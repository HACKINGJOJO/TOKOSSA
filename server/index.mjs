import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.AUTH_API_PORT || 8787)
const AUTH_ORIGIN = process.env.AUTH_ORIGIN || 'http://localhost:5173'
const DATA_PATH = path.join(__dirname, 'data', 'auth-db.json')

const AUTH_CONFIG = {
  PIN_LENGTH: 6,
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 5 * 60 * 1000,
  SESSION_DURATION: 24 * 60 * 60 * 1000,
}

async function ensureDb() {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  try {
    await fs.access(DATA_PATH)
  } catch {
    const initial = {
      users: [],
      attempts: 0,
      lockoutUntil: 0,
      sessions: {},
    }
    await fs.writeFile(DATA_PATH, JSON.stringify(initial, null, 2), 'utf8')
  }
}

async function readDb() {
  await ensureDb()
  const raw = await fs.readFile(DATA_PATH, 'utf8')
  return JSON.parse(raw)
}

async function writeDb(db) {
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2), 'utf8')
}

function hashPin(pin) {
  return crypto.createHash('sha256').update(`JOJO_ECOMMERCE_2024_${pin}`).digest('hex')
}

function now() {
  return Date.now()
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString('utf8')
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
  })
}

function parseCookies(req) {
  const header = req.headers.cookie || ''
  const entries = header.split(';').map((part) => part.trim()).filter(Boolean)
  const out = {}
  for (const entry of entries) {
    const idx = entry.indexOf('=')
    if (idx === -1) continue
    const key = entry.slice(0, idx)
    const value = decodeURIComponent(entry.slice(idx + 1))
    out[key] = value
  }
  return out
}

function createSession(db, userId) {
  const token = crypto.randomBytes(24).toString('hex')
  db.sessions[token] = {
    userId,
    expires: now() + AUTH_CONFIG.SESSION_DURATION,
  }
  return token
}

function getCurrentUserFromReq(db, req) {
  const cookies = parseCookies(req)
  const token = cookies.jojo_session
  if (!token) return null
  const session = db.sessions[token]
  if (!session) return null
  if (now() > session.expires) {
    delete db.sessions[token]
    return null
  }
  const user = db.users.find((u) => u.id === session.userId)
  return user || null
}

function generateMemberCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function sanitizeUser(user) {
  if (!user) return null
  const { pin, ...safeUser } = user
  return safeUser
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  })
  res.end(JSON.stringify(payload))
}

function withCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', AUTH_ORIGIN)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return true
  }
  return false
}

function requireAdmin(db, req) {
  const user = getCurrentUserFromReq(db, req)
  if (!user || user.role !== 'admin') return null
  return user
}

const server = http.createServer(async (req, res) => {
  if (withCors(req, res)) return

  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const { pathname } = url

  try {
    const db = await readDb()

    if (req.method === 'GET' && pathname === '/auth/health') {
      sendJson(res, 200, { ok: true, ts: now() })
      return
    }

    if (req.method === 'GET' && pathname === '/auth/has-pin') {
      sendJson(res, 200, { hasPin: db.users.length > 0 })
      return
    }

    if (req.method === 'POST' && pathname === '/auth/create-pin') {
      const body = await parseJsonBody(req)
      const pin = String(body.pin || '')

      if (db.users.length > 0) {
        sendJson(res, 400, { success: false, message: 'PIN déjà initialisé' })
        return
      }
      if (!/^\d+$/.test(pin) || pin.length !== AUTH_CONFIG.PIN_LENGTH) {
        sendJson(res, 400, { success: false, message: `Le PIN doit contenir ${AUTH_CONFIG.PIN_LENGTH} chiffres` })
        return
      }

      const user = {
        id: `admin_${now()}`,
        name: 'Admin (JOJO)',
        role: 'admin',
        pin: hashPin(pin),
        createdAt: now(),
        active: true,
      }
      db.users = [user]
      const token = createSession(db, user.id)
      await writeDb(db)

      sendJson(
        res,
        200,
        { success: true, message: 'PIN créé avec succès!', user: sanitizeUser(user) },
        { 'Set-Cookie': `jojo_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${AUTH_CONFIG.SESSION_DURATION / 1000}` }
      )
      return
    }

    if (req.method === 'POST' && pathname === '/auth/login') {
      const body = await parseJsonBody(req)
      const pin = String(body.pin || '')

      if (db.lockoutUntil && now() < db.lockoutUntil) {
        const remaining = Math.ceil((db.lockoutUntil - now()) / 60000)
        sendJson(res, 429, { success: false, message: `Trop de tentatives. Réessayez dans ${remaining} minute(s).` })
        return
      }

      const inputHash = hashPin(pin)
      const userByPin = db.users.find((u) => u.pin === inputHash && u.active)
      const userByCode = db.users.find((u) => u.code === pin && u.active)
      const user = userByPin || userByCode

      if (!user) {
        db.attempts = (db.attempts || 0) + 1
        if (db.attempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
          db.lockoutUntil = now() + AUTH_CONFIG.LOCKOUT_TIME
          await writeDb(db)
          sendJson(res, 429, { success: false, message: 'Trop de tentatives! Compte verrouillé 5 minutes.' })
          return
        }
        await writeDb(db)
        const remaining = AUTH_CONFIG.MAX_ATTEMPTS - db.attempts
        sendJson(res, 401, { success: false, message: `PIN/Code incorrect. ${remaining} tentative(s) restante(s).` })
        return
      }

      if (user.expiresAt && user.expiresAt < now()) {
        sendJson(res, 403, { success: false, message: "Ton accès a expiré. Contacte l'admin pour renouveler." })
        return
      }

      db.attempts = 0
      db.lockoutUntil = 0
      const token = createSession(db, user.id)
      await writeDb(db)

      sendJson(
        res,
        200,
        { success: true, message: 'Connexion réussie!', user: sanitizeUser(user) },
        { 'Set-Cookie': `jojo_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${AUTH_CONFIG.SESSION_DURATION / 1000}` }
      )
      return
    }

    if (req.method === 'GET' && pathname === '/auth/session') {
      const user = getCurrentUserFromReq(db, req)
      await writeDb(db)
      if (!user) {
        sendJson(res, 200, { valid: false, user: null })
        return
      }
      sendJson(res, 200, { valid: true, user: sanitizeUser(user) })
      return
    }

    if (req.method === 'POST' && pathname === '/auth/logout') {
      const cookies = parseCookies(req)
      const token = cookies.jojo_session
      if (token && db.sessions[token]) {
        delete db.sessions[token]
        await writeDb(db)
      }
      sendJson(
        res,
        200,
        { success: true },
        { 'Set-Cookie': 'jojo_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' }
      )
      return
    }

    if (req.method === 'GET' && pathname === '/auth/users') {
      const admin = requireAdmin(db, req)
      if (!admin) {
        sendJson(res, 403, { success: false, message: 'Action réservée aux admins' })
        return
      }
      sendJson(res, 200, db.users.map(sanitizeUser))
      return
    }

    if (req.method === 'POST' && pathname === '/auth/members') {
      const admin = requireAdmin(db, req)
      if (!admin) {
        sendJson(res, 403, { success: false, message: 'Action réservée aux admins' })
        return
      }
      const body = await parseJsonBody(req)
      const name = String(body.name || '').trim()
      const expiresInMinutes = Number(body.expiresInMinutes || 43200)
      if (!name) {
        sendJson(res, 400, { success: false, message: 'Nom requis' })
        return
      }
      const code = generateMemberCode()
      const member = {
        id: `member_${now()}`,
        name,
        role: 'member',
        code,
        pin: hashPin(code),
        createdAt: now(),
        expiresAt: expiresInMinutes > 0 ? now() + expiresInMinutes * 60 * 1000 : null,
        active: true,
      }
      db.users.push(member)
      await writeDb(db)
      sendJson(res, 200, { success: true, message: 'Membre ajouté!', member: sanitizeUser(member) })
      return
    }

    const removeMatch = pathname.match(/^\/auth\/members\/([^/]+)$/)
    if (req.method === 'DELETE' && removeMatch) {
      const admin = requireAdmin(db, req)
      if (!admin) {
        sendJson(res, 403, { success: false, message: 'Action réservée aux admins' })
        return
      }
      const memberId = removeMatch[1]
      const idx = db.users.findIndex((u) => u.id === memberId)
      if (idx === -1) {
        sendJson(res, 404, { success: false, message: 'Membre non trouvé' })
        return
      }
      if (db.users[idx].role === 'admin') {
        sendJson(res, 400, { success: false, message: "Impossible de supprimer l'admin" })
        return
      }
      db.users.splice(idx, 1)
      await writeDb(db)
      sendJson(res, 200, { success: true, message: 'Membre supprimé!' })
      return
    }

    const regenMatch = pathname.match(/^\/auth\/members\/([^/]+)\/regenerate$/)
    if (req.method === 'POST' && regenMatch) {
      const admin = requireAdmin(db, req)
      if (!admin) {
        sendJson(res, 403, { success: false, message: 'Action réservée aux admins' })
        return
      }
      const memberId = regenMatch[1]
      const idx = db.users.findIndex((u) => u.id === memberId)
      if (idx === -1) {
        sendJson(res, 404, { success: false, message: 'Membre non trouvé' })
        return
      }
      const code = generateMemberCode()
      db.users[idx].code = code
      db.users[idx].pin = hashPin(code)
      await writeDb(db)
      sendJson(res, 200, { success: true, message: 'Code régénéré!', code })
      return
    }

    sendJson(res, 404, { success: false, message: 'Not found' })
  } catch (error) {
    sendJson(res, 500, { success: false, message: error.message || 'Server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`)
  console.log(`Allowed origin: ${AUTH_ORIGIN}`)
})

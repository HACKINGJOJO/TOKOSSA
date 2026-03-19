import { User, Session, AuthResult, PromoCode } from '@/types'
import { storage } from './storage'
import { STORAGE_KEYS, AUTH_CONFIG } from '@/utils/constants'
import { hashPin, generateMemberCode } from '@/utils/helpers'

class AuthService {
  // Get all users
  getUsers(): User[] {
    return storage.get<User[]>(STORAGE_KEYS.USERS, [])
  }

  // Save users
  saveUsers(users: User[]): void {
    storage.set(STORAGE_KEYS.USERS, users)
  }

  // Check if PIN exists (any user registered)
  hasPin(): boolean {
    const users = this.getUsers()
    return users.length > 0
  }

  // Get current user
  getCurrentUser(): User | null {
    return storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const currentUser = this.getCurrentUser()
    return currentUser?.role === 'admin'
  }

  // Create initial PIN (first admin)
  createPin(pin: string): AuthResult {
    if (pin.length !== AUTH_CONFIG.PIN_LENGTH) {
      return { success: false, message: `Le PIN doit contenir ${AUTH_CONFIG.PIN_LENGTH} chiffres` }
    }
    if (!/^\d+$/.test(pin)) {
      return { success: false, message: 'Le PIN ne doit contenir que des chiffres' }
    }

    const hashedPin = hashPin(pin)
    const admin: User = {
      id: 'admin_' + Date.now(),
      name: 'Admin (JOJO)',
      role: 'admin',
      pin: hashedPin,
      createdAt: Date.now(),
      active: true,
    }

    this.saveUsers([admin])
    this.createSession(admin)
    this.recordLogin(admin.id, admin.name)

    return { success: true, message: 'PIN créé avec succès!', user: admin }
  }

  // Verify PIN
  verifyPin(pin: string): AuthResult {
    // Check lockout
    const lockoutUntil = storage.get<number>('lockout', 0)
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 60000)
      return { success: false, message: `Trop de tentatives. Réessayez dans ${remaining} minute(s).` }
    }

    const inputHash = hashPin(pin)
    const users = this.getUsers()

    // Find user with matching PIN
    const user = users.find((u) => u.pin === inputHash && u.active)

    if (user) {
      // Check expiration for members
      if (user.expiresAt && user.expiresAt < Date.now()) {
        return { success: false, message: "Ton accès a expiré. Contacte l'admin pour renouveler." }
      }

      storage.remove(STORAGE_KEYS.ATTEMPTS)
      storage.remove(STORAGE_KEYS.LOCKOUT)
      this.createSession(user)
      this.recordLogin(user.id, user.name)

      return { success: true, message: 'Connexion réussie!', user }
    }

    // Check by member code
    const memberByCode = users.find((u) => u.code === pin && u.active)
    if (memberByCode) {
      if (memberByCode.expiresAt && memberByCode.expiresAt < Date.now()) {
        return { success: false, message: "Ton accès a expiré. Contacte l'admin pour renouveler." }
      }

      storage.remove(STORAGE_KEYS.ATTEMPTS)
      storage.remove(STORAGE_KEYS.LOCKOUT)
      this.createSession(memberByCode)
      this.recordLogin(memberByCode.id, memberByCode.name)

      return { success: true, message: 'Connexion réussie!', user: memberByCode }
    }

    // Failed - increment attempts
    const attempts = storage.get<number>(STORAGE_KEYS.ATTEMPTS, 0) + 1
    storage.set(STORAGE_KEYS.ATTEMPTS, attempts)

    if (attempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
      storage.set(STORAGE_KEYS.LOCKOUT, Date.now() + AUTH_CONFIG.LOCKOUT_TIME)
      return { success: false, message: 'Trop de tentatives! Compte verrouillé 5 minutes.' }
    }

    const remaining = AUTH_CONFIG.MAX_ATTEMPTS - attempts
    return { success: false, message: `PIN/Code incorrect. ${remaining} tentative(s) restante(s).` }
  }

  // Create session
  createSession(user: User): void {
    const session: Session = {
      userId: user.id,
      timestamp: Date.now(),
      expires: Date.now() + AUTH_CONFIG.SESSION_DURATION,
    }
    storage.set(STORAGE_KEYS.SESSION, session)
    storage.set(STORAGE_KEYS.CURRENT_USER, user)
  }

  // Check session validity
  checkSession(): boolean {
    const session = storage.get<Session | null>(STORAGE_KEYS.SESSION, null)
    if (!session) return false

    if (Date.now() > session.expires) {
      this.logout()
      return false
    }
    return true
  }

  // Logout
  logout(): void {
    storage.remove(STORAGE_KEYS.SESSION)
    storage.remove(STORAGE_KEYS.CURRENT_USER)
  }

  // Change PIN
  changePin(oldPin: string, newPin: string): AuthResult {
    const verify = this.verifyPin(oldPin)
    if (!verify.success) {
      return { success: false, message: 'Ancien PIN incorrect' }
    }

    const users = this.getUsers()
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: 'Utilisateur non trouvé' }
    }

    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex === -1) {
      return { success: false, message: 'Utilisateur non trouvé' }
    }

    users[userIndex].pin = hashPin(newPin)
    this.saveUsers(users)

    return { success: true, message: 'PIN modifié avec succès!' }
  }

  // ============ MEMBER MANAGEMENT (Admin only) ============

  // Add member
  addMember(name: string, expiresInMinutes = 43200): AuthResult & { member?: User } {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const code = generateMemberCode()

    const member: User = {
      id: 'member_' + Date.now(),
      name,
      role: 'member',
      code,
      pin: hashPin(code),
      createdAt: Date.now(),
      expiresAt: expiresInMinutes > 0 ? Date.now() + expiresInMinutes * 60 * 1000 : null,
      active: true,
    }

    users.push(member)
    this.saveUsers(users)
    this.appendHistory({ type: 'added', memberId: member.id, name, code, at: Date.now() })

    return { success: true, message: 'Membre ajouté!', member }
  }

  // Remove member
  removeMember(memberId: string): AuthResult {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const memberIndex = users.findIndex((u) => u.id === memberId)

    if (memberIndex === -1) {
      return { success: false, message: 'Membre non trouvé' }
    }

    if (users[memberIndex].role === 'admin') {
      return { success: false, message: "Impossible de supprimer l'admin" }
    }

    const member = users[memberIndex]
    this.appendHistory({ type: 'removed', memberId, name: member.name, code: member.code, at: Date.now() })

    users.splice(memberIndex, 1)
    this.saveUsers(users)

    return { success: true, message: 'Membre supprimé!' }
  }

  // Toggle member active status
  toggleMember(memberId: string): AuthResult & { active?: boolean } {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const memberIndex = users.findIndex((u) => u.id === memberId)

    if (memberIndex === -1) {
      return { success: false, message: 'Membre non trouvé' }
    }

    if (users[memberIndex].role === 'admin') {
      return { success: false, message: "Impossible de désactiver l'admin" }
    }

    users[memberIndex].active = !users[memberIndex].active
    this.saveUsers(users)

    const status = users[memberIndex].active ? 'activé' : 'désactivé'
    return { success: true, message: `Membre ${status}!`, active: users[memberIndex].active }
  }

  // Regenerate member code
  regenerateCode(memberId: string): AuthResult & { code?: string } {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const memberIndex = users.findIndex((u) => u.id === memberId)

    if (memberIndex === -1) {
      return { success: false, message: 'Membre non trouvé' }
    }

    const oldCode = users[memberIndex].code
    const name = users[memberIndex].name
    const newCode = generateMemberCode()

    users[memberIndex].code = newCode
    users[memberIndex].pin = hashPin(newCode)
    this.saveUsers(users)

    this.appendHistory({ type: 'regenerated', memberId, name, oldCode, newCode, at: Date.now() })

    return { success: true, message: 'Code régénéré!', code: newCode }
  }

  // Edit member name
  editMemberName(memberId: string, newName: string): AuthResult {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === memberId)

    if (index === -1) {
      return { success: false, message: 'Membre non trouvé' }
    }

    if (users[index].role === 'admin') {
      return { success: false, message: "Impossible de modifier l'admin" }
    }

    const name = (newName || '').trim()
    if (!name) {
      return { success: false, message: 'Le nom ne peut pas être vide' }
    }

    users[index].name = name
    this.saveUsers(users)

    return { success: true, message: 'Nom modifié!' }
  }

  // Extend member access
  extendAccess(memberId: string, additionalDays: number): AuthResult {
    if (!this.isAdmin()) {
      return { success: false, message: 'Action réservée aux admins' }
    }

    const users = this.getUsers()
    const memberIndex = users.findIndex((u) => u.id === memberId)

    if (memberIndex === -1) {
      return { success: false, message: 'Membre non trouvé' }
    }

    const currentExpiry = users[memberIndex].expiresAt || Date.now()
    users[memberIndex].expiresAt = currentExpiry + additionalDays * 24 * 60 * 60 * 1000
    this.saveUsers(users)

    return { success: true, message: `Accès prolongé de ${additionalDays} jours!` }
  }

  // Get members (for admin)
  getMembers(): User[] {
    if (!this.isAdmin()) {
      return []
    }
    return this.getUsers().filter((u) => u.role === 'member')
  }

  // Clean expired members
  cleanExpiredMembers(): void {
    if (!this.isAdmin()) return

    const users = this.getUsers()
    const now = Date.now()
    const activeUsers = users.filter((u) => {
      if (u.role === 'admin') return true
      if (!u.expiresAt) return true
      return u.expiresAt > now
    })

    if (activeUsers.length !== users.length) {
      this.saveUsers(activeUsers)
    }
  }

  // Record login for stats
  private recordLogin(userId: string, name: string): void {
    try {
      const stats = storage.get<{ logins: Array<{ userId: string; name: string; at: number }>; pageViews: unknown[] }>(
        STORAGE_KEYS.ADMIN_STATS,
        { logins: [], pageViews: [] }
      )
      stats.logins = [...stats.logins, { userId, name, at: Date.now() }].slice(-100)
      storage.set(STORAGE_KEYS.ADMIN_STATS, stats)
    } catch {
      // Ignore
    }
  }

  // Append to history
  private appendHistory(entry: Record<string, unknown>): void {
    const history = storage.get<Record<string, unknown>[]>(STORAGE_KEYS.MEMBERS_HISTORY, [])
    history.push(entry)
    storage.set(STORAGE_KEYS.MEMBERS_HISTORY, history)
  }

  // Get members history
  getMembersHistory(): Record<string, unknown>[] {
    return storage.get<Record<string, unknown>[]>(STORAGE_KEYS.MEMBERS_HISTORY, [])
  }

  // Reset all
  reset(): void {
    storage.remove(STORAGE_KEYS.USERS)
    storage.remove(STORAGE_KEYS.SESSION)
    storage.remove(STORAGE_KEYS.CURRENT_USER)
    storage.remove(STORAGE_KEYS.ATTEMPTS)
    storage.remove(STORAGE_KEYS.LOCKOUT)
  }

  // ============ PROMO CODES ============

  getPromoCodes(): PromoCode[] {
    return storage.get<PromoCode[]>(STORAGE_KEYS.PROMO_CODES, [])
  }

  addPromoCode(code: string, reductionPct: number, validUntil: string | null): AuthResult {
    const list = this.getPromoCodes()
    if (list.some((p) => p.code.toUpperCase() === code.toUpperCase())) {
      return { success: false, message: 'Ce code existe déjà' }
    }

    list.push({
      id: 'promo_' + Date.now(),
      code: code.toUpperCase().trim(),
      reductionPct: Math.min(100, Math.max(0, reductionPct)),
      validUntil,
      createdAt: Date.now(),
    })
    storage.set(STORAGE_KEYS.PROMO_CODES, list)

    return { success: true, message: 'Code promo créé' }
  }

  removePromoCode(id: string): AuthResult {
    const list = this.getPromoCodes().filter((p) => p.id !== id)
    storage.set(STORAGE_KEYS.PROMO_CODES, list)
    return { success: true, message: 'Code supprimé' }
  }
}

export const authService = new AuthService()

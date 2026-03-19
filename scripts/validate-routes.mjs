import fs from 'node:fs'

const source = fs.readFileSync('src/app/routes.ts', 'utf8')
const routeRegex = /\{\s*id:\s*'([^']+)'\s*,\s*path:\s*'([^']+)'/g

const ids = new Set()
const paths = new Set()
const duplicateIds = new Set()
const duplicatePaths = new Set()

let match
while ((match = routeRegex.exec(source)) !== null) {
  const [, id, path] = match
  if (ids.has(id)) duplicateIds.add(id)
  if (paths.has(path)) duplicatePaths.add(path)
  ids.add(id)
  paths.add(path)
}

const requiredIds = ['login', 'dashboard', 'admin']
const missingRequired = requiredIds.filter((id) => !ids.has(id))

if (duplicateIds.size || duplicatePaths.size || missingRequired.length) {
  if (duplicateIds.size) {
    console.error('Duplicate route ids:', [...duplicateIds].join(', '))
  }
  if (duplicatePaths.size) {
    console.error('Duplicate route paths:', [...duplicatePaths].join(', '))
  }
  if (missingRequired.length) {
    console.error('Missing required route ids:', missingRequired.join(', '))
  }
  process.exit(1)
}

console.log(`Route validation OK (${ids.size} routes)`)

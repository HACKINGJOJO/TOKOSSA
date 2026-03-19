import fs from 'node:fs'

const files = [
  'src/pages/dashboard/Dashboard.tsx',
  'src/features/auth/pages/LoginPage.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/app/guards.tsx',
  'src/app/router.tsx',
]

const patterns = [
  /to="\//g,
  /href="\//g,
  /navigate\('\//g,
  /window\.location\.href\s*=\s*'\//g,
  /<Navigate to="\//g,
]

const failures = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      failures.push(`${file} -> ${pattern}`)
    }
  }
}

if (failures.length) {
  console.error('Hardcoded route strings detected:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('No hardcoded route strings in guarded files')

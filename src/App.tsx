import { useEffect, useState } from 'react'
import { AppRouter } from '@/app/router'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/features/auth'

function App() {
  const { theme } = useThemeStore()
  const { checkSession } = useAuthStore()
  const [authReady, setAuthReady] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  // Check session on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      await checkSession()
      if (mounted) {
        setAuthReady(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [checkSession])

  if (!authReady) return null

  return <AppRouter />
}

export default App

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/features/auth'
import { SEARCHABLE_ROUTES, getRoutePath } from '@/app/routes'
import { cn } from '@/utils/helpers'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof SEARCHABLE_ROUTES>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = SEARCHABLE_ROUTES.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.keywords || '').toLowerCase().includes(query)
    ).slice(0, 8)

    setSearchResults(results)
  }, [searchQuery])

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setShowResults(false)
  }

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return 'JO'
    const parts = user.name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    }
    return user.name.charAt(0).toUpperCase()
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-[70px] px-6',
        'bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800',
        'flex items-center justify-between gap-4'
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Menu toggle (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Search */}
        <div ref={searchRef} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Rechercher..."
              className={cn(
                'w-64 md:w-80 pl-12 pr-4 py-2.5 rounded-full',
                'bg-gray-100 dark:bg-dark-secondary',
                'border-2 border-transparent',
                'text-gray-900 dark:text-gray-100 placeholder:text-gray-400',
                'focus:outline-none focus:border-gold focus:bg-white dark:focus:bg-dark-card',
                'transition-all duration-200'
              )}
            />
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div
              className={cn(
                'absolute top-full left-0 right-0 mt-2',
                'bg-white dark:bg-dark-card rounded-xl shadow-lg',
                'border border-gray-200 dark:border-gray-800',
                'max-h-80 overflow-y-auto animate-fade-in-up'
              )}
            >
              {searchResults.map((result) => (
                <button
                  key={result.path}
                  onClick={() => handleResultClick(result.path)}
                  className={cn(
                    'w-full px-4 py-3 text-left',
                    'hover:bg-gold-pale dark:hover:bg-gold/20 hover:text-gold-dark',
                    'border-b border-gray-100 dark:border-gray-800 last:border-0',
                    'transition-colors'
                  )}
                >
                  {result.title}
                </button>
              ))}
            </div>
          )}

          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div
              className={cn(
                'absolute top-full left-0 right-0 mt-2 p-4',
                'bg-white dark:bg-dark-card rounded-xl shadow-lg',
                'border border-gray-200 dark:border-gray-800',
                'text-gray-500 text-sm'
              )}
            >
              Aucun résultat
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center',
            'bg-gray-100 dark:bg-dark-secondary border-2 border-gray-200 dark:border-gray-700',
            'hover:border-gold hover:bg-gold text-gray-700 dark:text-gray-300',
            'hover:text-white transition-all duration-200'
          )}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User avatar */}
        <Link
          to={getRoutePath('reglages')}
          className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-gold to-gold-light',
            'text-white font-bold text-sm',
            'hover:scale-105 transition-transform'
          )}
          title={user?.name || 'Utilisateur'}
        >
          {getInitials()}
        </Link>
      </div>
    </header>
  )
}

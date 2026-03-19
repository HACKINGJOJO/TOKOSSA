import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { NAV_SECTION_LABELS, NAV_SECTION_ORDER, getNavItemsBySection, getRoutePath } from '@/app/routes'
import { cn } from '@/utils/helpers'
import {
  Home,
  Wrench,
  BookOpen,
  Package,
  Megaphone,
  Smartphone,
  ShoppingCart,
  Gem,
  Calendar,
  Plug,
  MessageSquare,
  Book,
  ClipboardList,
  CheckSquare,
  Scale,
  Download,
  Target,
  HelpCircle,
  Video,
  FileText,
  Map,
  BarChart3,
  Medal,
  LifeBuoy,
  Trophy,
  Star,
  CreditCard,
  ListChecks,
  Settings,
  Users,
  LogOut,
  X,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Wrench,
  BookOpen,
  Package,
  Megaphone,
  Smartphone,
  ShoppingCart,
  Gem,
  Calendar,
  Plug,
  MessageSquare,
  Book,
  ClipboardList,
  CheckSquare,
  Scale,
  Download,
  Target,
  HelpCircle,
  Video,
  FileText,
  Map,
  BarChart3,
  Medal,
  LifeBuoy,
  Trophy,
  Star,
  CreditCard,
  ListChecks,
  Settings,
  Users,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { isAdmin, logout } = useAuthStore()

  const handleLogout = async () => {
    if (confirm('Voulez-vous vous déconnecter ?')) {
      await logout()
      window.location.href = getRoutePath('login')
    }
  }

  const NavSection = ({ title, sectionKey }: { title: string; sectionKey: keyof typeof NAV_SECTION_LABELS }) => {
    const items = getNavItemsBySection(sectionKey)
    if (!items.length) return null
    if (sectionKey === 'admin' && !isAdmin) return null

    return (
    <div className="mb-6">
      <h3 className="px-5 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      {items.map((item) => {
        const iconName = item.icon || 'Home'
        const Icon = iconMap[iconName] || Home
        const isActive = location.pathname === item.path

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-5 py-3 mx-2 rounded-xl',
              'text-gray-600 dark:text-gray-300 font-medium transition-all',
              'border-l-4 border-transparent',
              'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gold-dark hover:border-gold',
              isActive &&
                'bg-gradient-to-r from-gold/10 to-transparent text-gold-dark border-gold font-semibold'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs font-bold bg-gold text-white rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-72 z-50',
          'bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <Link to={getRoutePath('dashboard')} className="text-2xl font-black font-playfair text-gold-dark">
            JOJO <span className="text-gold">Mastery</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 scrollbar-thin">
          {NAV_SECTION_ORDER.map((section) => (
            <NavSection
              key={section}
              title={NAV_SECTION_LABELS[section]}
              sectionKey={section}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-5 py-3 rounded-xl',
              'text-gray-600 dark:text-gray-300 font-medium transition-all',
              'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
            )}
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

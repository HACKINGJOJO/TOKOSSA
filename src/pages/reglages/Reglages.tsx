import { useState } from 'react'
import { Card, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui'
import { Moon, Sun, User, Bell, Trash2, Download, Shield, LogOut, Check } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/features/auth'
import { useProgressStore } from '@/stores/progressStore'
import { storageService } from '@/services/storage'

export function Reglages() {
  const { theme, toggleTheme } = useThemeStore()
  const { currentUser, logout } = useAuthStore()
  const { totalXP, level } = useProgressStore()

  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    const data = {
      user: currentUser,
      progress: {
        totalXP,
        level,
      },
      notes: storageService.get('notes') || [],
      favorites: storageService.get('favorites') || [],
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jojo-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm('Es-tu sûr de vouloir effacer toutes tes données? Cette action est irréversible.')) {
      if (confirm('Dernière confirmation: TOUTES tes données seront perdues (progression, notes, favoris).')) {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  const handleLogout = async () => {
    if (confirm('Te déconnecter?')) {
      await logout()
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Paramètres</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Réglages</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Personnalise ton expérience JOJO
        </p>
      </div>

      {/* Profile Section */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Mon Profil
          </CardTitle>
        </CardHeader>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentUser?.name?.charAt(0) || 'J'}
          </div>
          <div>
            <h3 className="text-xl font-bold">{currentUser?.name || 'Utilisateur JOJO'}</h3>
            <p className="text-gray-500">Membre depuis {currentUser?.memberSince || 'récemment'}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="gold">Niveau {level}</Badge>
              <span className="text-sm text-gray-500">{totalXP} XP</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom d'affichage</label>
            <Input
              value={currentUser?.name || ''}
              disabled
              placeholder="Ton nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email (optionnel)</label>
            <Input
              type="email"
              placeholder="ton@email.com"
              disabled
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Apparence
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <div>
              <h4 className="font-semibold">Thème sombre</h4>
              <p className="text-sm text-gray-500">
                {theme === 'dark' ? 'Activé' : 'Désactivé'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                'relative w-14 h-8 rounded-full transition-colors',
                theme === 'dark' ? 'bg-gold' : 'bg-gray-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow',
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Theme Preview */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                'p-4 rounded-xl border-2 transition-all',
                theme === 'light' ? 'border-gold' : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="w-full h-20 bg-white border border-gray-200 rounded-lg mb-2" />
              <span className="font-medium">Clair</span>
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                'p-4 rounded-xl border-2 transition-all',
                theme === 'dark' ? 'border-gold' : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="w-full h-20 bg-gray-900 border border-gray-700 rounded-lg mb-2" />
              <span className="font-medium">Sombre</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
          <div>
            <h4 className="font-semibold">Notifications navigateur</h4>
            <p className="text-sm text-gray-500">
              Recevoir des rappels et mises à jour
            </p>
          </div>
          <button
            onClick={() => {
              setNotifications(!notifications)
              showSaved()
            }}
            className={cn(
              'relative w-14 h-8 rounded-full transition-colors',
              notifications ? 'bg-gold' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow',
                notifications ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </Card>

      {/* Data Management */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion des données
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
            <div>
              <h4 className="font-semibold">Exporter mes données</h4>
              <p className="text-sm text-gray-500">
                Télécharge une sauvegarde de ta progression
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData} leftIcon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div>
              <h4 className="font-semibold text-red-600">Effacer toutes mes données</h4>
              <p className="text-sm text-gray-500">
                Supprime définitivement progression, notes et favoris
              </p>
            </div>
            <Button variant="danger" onClick={handleClearData} leftIcon={<Trash2 className="w-4 h-4" />}>
              Effacer
            </Button>
          </div>
        </div>
      </Card>

      {/* Session */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Session
          </CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
          <div>
            <h4 className="font-semibold">Se déconnecter</h4>
            <p className="text-sm text-gray-500">
              Fermer ta session actuelle
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
            Déconnexion
          </Button>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-gray-400">
        <p>JOJO E-Commerce Mastery v2.0</p>
        <p>Made with ❤️ for African Entrepreneurs</p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4" />
          Sauvegardé!
        </div>
      )}
    </div>
  )
}

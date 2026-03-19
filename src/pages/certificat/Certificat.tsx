import { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Award, Download, Share2, Lock, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useProgressStore } from '@/stores/progressStore'
import { useAuthStore } from '@/features/auth'

const REQUIRED_MODULES = [
  { id: 'fondations', name: 'Fondations Stratégiques' },
  { id: 'sourcing', name: 'Sourcing & Fournisseurs' },
  { id: 'marketing', name: 'Marketing & Vente' },
  { id: 'facebook-ads', name: 'Facebook Ads Mastery' },
  { id: 'shopify', name: 'Shopify Mastery' },
]

export function Certificat() {
  const { getModuleProgress, hasCompletedAllForCertificate } = useProgressStore()
  const { user } = useAuthStore()
  const [showCertificate, setShowCertificate] = useState(false)

  const canGetCertificate = hasCompletedAllForCertificate()
  const completedCount = REQUIRED_MODULES.filter(m => getModuleProgress(m.id) >= 100).length

  const generateCertificateCode = () => {
    const date = new Date()
    return `JOJO-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Téléchargement du certificat... (fonctionnalité à venir)')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon Certificat JOJO E-Commerce Mastery',
        text: `J'ai obtenu mon certificat JOJO E-Commerce Mastery! 🎉`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié!')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Certification</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Mon Certificat</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Obtiens ton certificat JOJO E-Commerce Mastery
        </p>
      </div>

      {/* Progress */}
      <Card hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-dark" />
          Progression vers le certificat
        </h3>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{completedCount}/{REQUIRED_MODULES.length} modules complétés</span>
            <span className="text-gold-dark font-bold">{Math.round((completedCount / REQUIRED_MODULES.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-dark-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all"
              style={{ width: `${(completedCount / REQUIRED_MODULES.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {REQUIRED_MODULES.map(module => {
            const progress = getModuleProgress(module.id)
            const isCompleted = progress >= 100

            return (
              <div
                key={module.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl',
                  isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-dark-secondary'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={cn('font-semibold', isCompleted && 'text-green-600')}>{module.name}</h4>
                  <p className="text-sm text-gray-500">{progress}% complété</p>
                </div>
                <Badge variant={isCompleted ? 'success' : 'default'} size="sm">
                  {isCompleted ? 'Validé' : 'En cours'}
                </Badge>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Certificate Preview / Locked */}
      {canGetCertificate ? (
        <Card hover={false} className="text-center p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold font-playfair mb-2">Félicitations!</h2>
          <p className="text-gray-500 mb-6">Tu as complété tous les modules requis!</p>

          <Button onClick={() => setShowCertificate(true)} size="lg">
            Voir mon certificat
          </Button>
        </Card>
      ) : (
        <Card hover={false} className="text-center p-8 bg-gray-50 dark:bg-dark-secondary">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Certificat verrouillé</h2>
          <p className="text-gray-500">
            Complète tous les modules de formation pour débloquer ton certificat.
          </p>
        </Card>
      )}

      {/* Certificate Modal */}
      {showCertificate && canGetCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Certificate */}
            <div className="p-8 bg-gradient-to-br from-cream to-white dark:from-dark-card dark:to-dark-secondary border-8 border-gold m-4 rounded-xl">
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h1 className="text-3xl font-bold font-playfair text-gold-dark mb-2">
                  CERTIFICAT DE RÉUSSITE
                </h1>
                <p className="text-gray-500 mb-8">E-Commerce Mastery Program</p>

                <p className="text-lg mb-2">Ce certificat est décerné à</p>
                <h2 className="text-2xl font-bold font-playfair text-gold-dark mb-8">
                  {user?.name || 'Entrepreneur JOJO'}
                </h2>

                <p className="text-gray-600 mb-8">
                  Pour avoir complété avec succès le programme complet<br />
                  <strong>JOJO E-Commerce Mastery</strong><br />
                  incluant tous les modules de formation
                </p>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Code de vérification</p>
                    <p className="font-mono text-sm">{generateCertificateCode()}</p>
                  </div>
                </div>

                <div className="border-t-2 border-gold pt-4">
                  <p className="text-sm text-gray-500">JOJO E-Commerce Mastery</p>
                  <p className="text-xs text-gray-400">www.jojo-ecommerce.com</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-4 justify-center border-t dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowCertificate(false)}>
                Fermer
              </Button>
              <Button onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
                Télécharger PDF
              </Button>
              <Button variant="gold" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
                Partager
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

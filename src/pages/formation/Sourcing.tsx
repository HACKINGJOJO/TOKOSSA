import { useProgressStore } from '@/stores/progressStore'
import { Card, CardHeader, CardTitle, Button, Progress, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { CheckCircle, Package, Globe, Handshake, ClipboardCheck } from 'lucide-react'
import { cn } from '@/utils/helpers'

const SUPPLIERS = [
  { name: '1688.com', type: 'Chine', desc: 'Alibaba version chinoise, prix usine', pros: ['Prix très bas', 'Énorme choix'], cons: ['En chinois', 'MOQ élevé'] },
  { name: 'Made-in-China', type: 'Chine', desc: 'Alternative à Alibaba, anglais', pros: ['En anglais', 'Vérification fournisseurs'], cons: ['Prix plus élevés'] },
  { name: 'CJ Dropshipping', type: 'Dropshipping', desc: 'Dropshipping + stockage', pros: ['Pas de stock', 'Livraison directe'], cons: ['Marges réduites', 'Délais longs'] },
  { name: 'Marchés locaux', type: 'Local', desc: 'Dantokpa, Missèbo...', pros: ['Stock immédiat', 'Négociation directe'], cons: ['Choix limité'] },
  { name: 'Grossistes Togo/Nigeria', type: 'Régional', desc: 'Import régional', pros: ['Proximité', 'Moins de douane'], cons: ['Qualité variable'] },
]

const NEGO_RULES = [
  { icon: '📦', title: 'Quantité = Pouvoir', desc: 'Plus tu commandes, plus tu négocies. Minimum 50-100 pièces pour avoir du poids.' },
  { icon: '💵', title: 'Cash is King', desc: 'Paiement comptant = 5-10% de réduction possible.' },
  { icon: '🤝', title: 'Relation long terme', desc: 'Montre que tu veux travailler sur la durée, pas un one-shot.' },
  { icon: '⚖️', title: 'Compare toujours', desc: 'Demande 3-5 devis avant de décider. Utilise les prix comme levier.' },
  { icon: '📦', title: 'Échantillons d\'abord', desc: 'Toujours commander des échantillons avant une grosse commande.' },
  { icon: '📝', title: 'Conditions écrites', desc: 'Tout doit être écrit : délais, qualité, retours, prix.' },
  { icon: '🔄', title: 'Flexibilité', desc: 'Accepte parfois un mix de couleurs/tailles pour un meilleur prix.' },
]

const NEGO_SCRIPTS = [
  { title: 'Demande de prix', script: 'Bonjour, je suis intéressé par [produit]. Quel est votre meilleur prix pour 100 pièces ? Je compare plusieurs fournisseurs.' },
  { title: 'Négociation', script: "J'ai reçu une offre à [prix concurrent]. Pouvez-vous faire mieux ? Je cherche un partenaire long terme." },
  { title: 'Demande échantillon', script: 'Avant de passer commande, je souhaite recevoir 2-3 échantillons. Quels sont les frais ?' },
  { title: 'Confirmation finale', script: 'OK pour [quantité] à [prix]. Merci de confirmer : délai de livraison, conditions de paiement, et politique de retour.' },
  { title: 'Après réception', script: "Commande bien reçue, qualité conforme. Je prépare la prochaine commande pour [date]. Pouvez-vous m'accorder -5% ?" },
]

export function Sourcing() {
  const { getModuleProgress, markModuleProgress } = useProgressStore()
  const progress = getModuleProgress('sourcing')

  const handleMarkComplete = () => {
    markModuleProgress('sourcing', 100)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Module 2</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Sourcing & Fournisseurs</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Trouve les meilleurs fournisseurs et négocie comme un pro
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="font-bold text-gold-dark">{progress}%</span>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultTab="compare">
        <TabsList>
          <TabsTrigger value="compare">
            <Globe className="w-4 h-4 mr-2" />
            Local vs Chine
          </TabsTrigger>
          <TabsTrigger value="nego">
            <Handshake className="w-4 h-4 mr-2" />
            Négociation
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Package className="w-4 h-4 mr-2" />
            Fournisseurs
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Checklist
          </TabsTrigger>
        </TabsList>

        {/* Compare Tab */}
        <TabsContent value="compare">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>🌍 Local vs Import Chine : Le comparatif</CardTitle>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-bold">Critère</th>
                    <th className="py-3 px-4 font-bold text-blue-600">🇧🇯 Local</th>
                    <th className="py-3 px-4 font-bold text-red-600">🇨🇳 Import Chine</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Prix d'achat</td>
                    <td className="py-3 px-4">Plus élevé</td>
                    <td className="py-3 px-4 text-green-600">Très bas (-50-70%)</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Délai</td>
                    <td className="py-3 px-4 text-green-600">Immédiat</td>
                    <td className="py-3 px-4">15-45 jours</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">MOQ (minimum)</td>
                    <td className="py-3 px-4 text-green-600">1-10 pièces</td>
                    <td className="py-3 px-4">50-500 pièces</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Qualité</td>
                    <td className="py-3 px-4">Vérifiable sur place</td>
                    <td className="py-3 px-4">Variable, échantillons requis</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">Douane</td>
                    <td className="py-3 px-4 text-green-600">Aucune</td>
                    <td className="py-3 px-4">10-30% selon produit</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Risque</td>
                    <td className="py-3 px-4 text-green-600">Faible</td>
                    <td className="py-3 px-4">Moyen à élevé</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-gold-pale dark:bg-gold/10 p-6 rounded-xl">
              <h4 className="font-bold text-gold-dark mb-3">💡 Stratégie hybride recommandée</h4>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li><strong>Démarrer local</strong> pour tester la demande (0 risque)</li>
                <li><strong>Valider les bestsellers</strong> avec 20-50 ventes</li>
                <li><strong>Importer de Chine</strong> uniquement les produits validés</li>
                <li><strong>Garder du local</strong> pour les réassorts rapides</li>
              </ol>
            </div>
          </Card>
        </TabsContent>

        {/* Negotiation Tab */}
        <TabsContent value="nego">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>🤝 Les 7 Règles de Négociation Killer</CardTitle>
            </CardHeader>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {NEGO_RULES.map((rule, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-dark-secondary rounded-xl">
                  <span className="text-2xl">{rule.icon}</span>
                  <div>
                    <h4 className="font-bold text-gold-dark">{rule.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-bold text-gold-dark mb-4">📝 5 Phrases types à copier-coller</h4>
              <div className="space-y-4">
                {NEGO_SCRIPTS.map((item, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-dark-secondary p-4 rounded-xl">
                    <p className="font-semibold text-sm text-gold-dark mb-2">{item.title}</p>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{item.script}"</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>📦 Méga-Liste Fournisseurs</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {SUPPLIERS.map((supplier, i) => (
                <div
                  key={i}
                  className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gold transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gold-dark">{supplier.name}</h4>
                      <Badge variant={supplier.type === 'Local' ? 'success' : 'default'} size="sm">
                        {supplier.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{supplier.desc}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-green-600 mb-1">✅ Avantages</p>
                      <ul className="space-y-1">
                        {supplier.pros.map((pro, j) => (
                          <li key={j} className="text-gray-600 dark:text-gray-400">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-red-600 mb-1">❌ Inconvénients</p>
                      <ul className="space-y-1">
                        {supplier.cons.map((con, j) => (
                          <li key={j} className="text-gray-600 dark:text-gray-400">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>✅ Checklist : Avant de payer le fournisseur</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {[
                { check: 'Échantillon reçu et qualité validée', critical: true },
                { check: 'Bon de commande écrit avec quantités et prix', critical: true },
                { check: 'Coordonnées complètes du fournisseur (tel, adresse)', critical: true },
                { check: 'Conditions de retour/échange définies', critical: true },
                { check: 'Délai de livraison confirmé par écrit', critical: false },
                { check: 'Photos des produits exacts commandés', critical: false },
                { check: 'Mode de paiement sécurisé (pas Western Union sur 1ère commande)', critical: true },
                { check: 'Avis/références du fournisseur vérifiés', critical: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl',
                    item.critical ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-dark-secondary'
                  )}
                >
                  <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600" />
                  <span className="flex-1">{item.check}</span>
                  {item.critical && (
                    <Badge variant="danger" size="sm">Critique</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complete Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleMarkComplete}
          disabled={progress >= 100}
          leftIcon={<CheckCircle className="w-5 h-5" />}
        >
          {progress >= 100 ? 'Module complété ✓' : 'Marquer ce module comme terminé'}
        </Button>
      </div>
    </div>
  )
}

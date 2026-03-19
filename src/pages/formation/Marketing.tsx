import { useProgressStore } from '@/stores/progressStore'
import { Card, CardHeader, CardTitle, Button, Progress, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { CheckCircle, Megaphone, MessageSquare, Truck, PenTool } from 'lucide-react'

const AIDA = [
  { letter: 'A', title: 'Attention', desc: 'Accroche visuelle + emoji + question choc', example: '🔥 Tu cherches LA robe qui fait tourner les têtes ?' },
  { letter: 'I', title: 'Intérêt', desc: 'Bénéfices + preuves sociales', example: 'Déjà 200+ femmes de Cotonou l\'ont adoptée !' },
  { letter: 'D', title: 'Désir', desc: 'Créer l\'urgence + offre', example: 'PROMO -30% jusqu\'à dimanche seulement !' },
  { letter: 'A', title: 'Action', desc: 'CTA clair et simple', example: '📲 DM "ROBE" pour commander !' },
]

const POST_TYPES = [
  { type: 'Promo Flash', emoji: '🔥', desc: 'Réduction limitée dans le temps', frequency: '2-3x/semaine' },
  { type: 'Nouveauté', emoji: '✨', desc: 'Lancement de produit', frequency: '1-2x/semaine' },
  { type: 'Témoignage', emoji: '💬', desc: 'Avis client avec photo', frequency: '2x/semaine' },
  { type: 'Behind the scenes', emoji: '📦', desc: 'Coulisses, préparation commandes', frequency: '1x/semaine' },
  { type: 'Engagement', emoji: '🤔', desc: 'Sondage, question', frequency: '1-2x/semaine' },
  { type: 'Éducatif', emoji: '💡', desc: 'Tips, conseils mode', frequency: '1x/semaine' },
]

const WHATSAPP_SCRIPTS = [
  {
    title: 'Accueil client',
    script: `Salut [Prénom] ! 👋

Merci pour ton intérêt pour [produit] !

C'est un de nos bestsellers 🔥 Tu as des questions ?`
  },
  {
    title: 'Qualification',
    script: `Super ! Pour te proposer exactement ce qu'il te faut :

📏 Quelle taille préfères-tu ?
🎨 Quelle couleur ?
📍 Tu es où pour la livraison ?`
  },
  {
    title: 'Closing',
    script: `Parfait [Prénom] ! Récap :

✅ [Produit] - [Taille] - [Couleur]
💰 Prix : [X] FCFA
🚚 Livraison : [zone] - [délai]

🎁 BONUS : Je t'offre [cadeau] !

On valide ? Plus que [X] en stock !`
  },
  {
    title: 'Objection prix',
    script: `Je comprends ! En fait ce prix reflète la qualité premium.

Nos clientes nous disent souvent qu'elles auraient payé plus cher ailleurs 💎

Je peux te proposer -10% si tu commandes maintenant. Ça te va ?`
  },
  {
    title: 'Relance J+1',
    script: `Hey [Prénom] ! 👋

Je reviens vers toi pour [produit].

Tu as pu réfléchir ? Il en reste quelques-uns !

Si tu as des questions, je suis là 😊`
  },
]

const DELIVERY_STRATEGIES = [
  { zone: 'Cotonou centre', price: 'Gratuit', condition: 'Commande +15k FCFA' },
  { zone: 'Cotonou périphérie', price: '500 FCFA', condition: 'Ou gratuit +20k' },
  { zone: 'Autres villes', price: '1000-2000 FCFA', condition: 'Selon distance' },
]

export function Marketing() {
  const { getModuleProgress, markModuleProgress } = useProgressStore()
  const progress = getModuleProgress('marketing')

  const handleMarkComplete = () => {
    markModuleProgress('marketing', 100)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Module 3</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Marketing & Vente</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Crée du contenu qui vend et convertis tes prospects
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <span className="font-bold text-gold-dark">{progress}%</span>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultTab="aida">
        <TabsList>
          <TabsTrigger value="aida">
            <PenTool className="w-4 h-4 mr-2" />
            AIDA
          </TabsTrigger>
          <TabsTrigger value="content">
            <Megaphone className="w-4 h-4 mr-2" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Truck className="w-4 h-4 mr-2" />
            Livraison
          </TabsTrigger>
        </TabsList>

        {/* AIDA Tab */}
        <TabsContent value="aida">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>📝 La Méthode AIDA - Structure qui Vend</CardTitle>
            </CardHeader>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Chaque post, description ou message doit suivre cette structure pour maximiser les ventes.
            </p>

            <div className="space-y-6">
              {AIDA.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-white font-black text-2xl shrink-0">
                    {item.letter}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gold-dark text-lg">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{item.desc}</p>
                    <div className="bg-gray-100 dark:bg-dark-secondary p-3 rounded-lg">
                      <p className="text-sm italic">"{item.example}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>📱 Types de Posts & Fréquence</CardTitle>
            </CardHeader>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {POST_TYPES.map((post, i) => (
                <div key={i} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="text-3xl mb-2">{post.emoji}</div>
                  <h4 className="font-bold text-gold-dark">{post.type}</h4>
                  <p className="text-sm text-gray-500 mb-2">{post.desc}</p>
                  <Badge variant="default" size="sm">{post.frequency}</Badge>
                </div>
              ))}
            </div>

            <div className="bg-gold-pale dark:bg-gold/10 p-6 rounded-xl">
              <h4 className="font-bold text-gold-dark mb-3">📅 Planning hebdomadaire type</h4>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
                  <div key={i}>
                    <p className="font-bold mb-1">{day}</p>
                    <p className="text-xs text-gray-500">
                      {i === 0 && '✨ Nouveauté'}
                      {i === 1 && '💬 Témoignage'}
                      {i === 2 && '🔥 Promo'}
                      {i === 3 && '🤔 Engagement'}
                      {i === 4 && '🔥 Promo'}
                      {i === 5 && '📦 Coulisses'}
                      {i === 6 && '💡 Tips'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>💬 Scripts WhatsApp Copiables</CardTitle>
            </CardHeader>

            <div className="space-y-6">
              {WHATSAPP_SCRIPTS.map((item, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-green-500 text-white px-4 py-2 font-semibold">
                    {item.title}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-dark-secondary">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                      {item.script}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>🚚 Système de Livraison</CardTitle>
            </CardHeader>

            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left font-bold">Zone</th>
                    <th className="py-3 px-4 text-left font-bold">Prix</th>
                    <th className="py-3 px-4 text-left font-bold">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {DELIVERY_STRATEGIES.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">{row.zone}</td>
                      <td className="py-3 px-4 font-bold text-gold-dark">{row.price}</td>
                      <td className="py-3 px-4 text-gray-500">{row.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-gray-50 dark:bg-dark-secondary rounded-xl">
                <div className="text-2xl mb-2">🛵</div>
                <h4 className="font-bold">Zem / Moto</h4>
                <p className="text-sm text-gray-500">Rapide, économique, flexible</p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-dark-secondary rounded-xl">
                <div className="text-2xl mb-2">🚗</div>
                <h4 className="font-bold">Coursier dédié</h4>
                <p className="text-sm text-gray-500">Pour volumes importants</p>
              </div>
              <div className="p-5 bg-gray-50 dark:bg-dark-secondary rounded-xl">
                <div className="text-2xl mb-2">📦</div>
                <h4 className="font-bold">Point relais</h4>
                <p className="text-sm text-gray-500">Client récupère lui-même</p>
              </div>
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

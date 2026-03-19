import { useState } from 'react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { Code, Copy, Check, ExternalLink, Search, Zap } from 'lucide-react'
import { cn } from '@/utils/helpers'

const API_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '🔧' },
  { id: 'payment', name: 'Paiement', icon: '💳' },
  { id: 'messaging', name: 'Messagerie', icon: '💬' },
  { id: 'delivery', name: 'Livraison', icon: '🚚' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'ai', name: 'IA', icon: '🤖' },
]

const APIS = [
  {
    id: 1,
    name: 'FedaPay',
    category: 'payment',
    description: 'Solution de paiement mobile money pour l\'Afrique (MTN, Moov, Wave)',
    website: 'https://fedapay.com',
    pricing: 'Gratuit + 2% par transaction',
    features: ['Mobile Money', 'API REST', 'Webhook', 'Dashboard'],
    code: `// Installation
npm install fedapay-node

// Initialisation
const FedaPay = require('fedapay-node');
FedaPay.setApiKey('sk_live_xxx');

// Créer une transaction
const transaction = await FedaPay.Transaction.create({
  amount: 5000,
  currency: 'XOF',
  description: 'Commande #123',
  callback_url: 'https://monsite.com/callback'
});`,
    icon: '💳',
    popular: true
  },
  {
    id: 2,
    name: 'Kkiapay',
    category: 'payment',
    description: 'Paiement en ligne pour le Bénin et l\'Afrique de l\'Ouest',
    website: 'https://kkiapay.me',
    pricing: 'Gratuit + 1.9% par transaction',
    features: ['Mobile Money', 'Carte bancaire', 'Widget intégrable', 'API'],
    code: `<!-- Widget Kkiapay -->
<script src="https://cdn.kkiapay.me/k.js"></script>

<button id="pay-btn">Payer 5000 FCFA</button>

<script>
  document.getElementById('pay-btn').onclick = () => {
    openKkiapayWidget({
      amount: 5000,
      key: 'pk_xxx',
      sandbox: false,
      callback: (response) => {
        console.log('Transaction:', response);
      }
    });
  };
</script>`,
    icon: '💰',
    popular: true
  },
  {
    id: 3,
    name: 'WhatsApp Business API',
    category: 'messaging',
    description: 'Automatise tes messages WhatsApp avec l\'API officielle',
    website: 'https://business.whatsapp.com',
    pricing: 'Gratuit jusqu\'à 1000 messages/mois',
    features: ['Messages automatiques', 'Catalogue produits', 'Boutons interactifs', 'Templates'],
    code: `// Envoyer un message via l'API WhatsApp Cloud
const sendMessage = async (to, message) => {
  const response = await fetch(
    'https://graph.facebook.com/v17.0/PHONE_ID/messages',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ACCESS_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    }
  );
  return response.json();
};`,
    icon: '💬',
    popular: true
  },
  {
    id: 4,
    name: 'Twilio',
    category: 'messaging',
    description: 'SMS, WhatsApp et appels vocaux programmables',
    website: 'https://twilio.com',
    pricing: 'Pay as you go (~0.05$/SMS)',
    features: ['SMS', 'WhatsApp', 'Voice', 'Video'],
    code: `// Envoyer un SMS avec Twilio
const twilio = require('twilio');
const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

await client.messages.create({
  body: 'Votre commande #123 est en route!',
  from: '+1234567890',
  to: '+22961234567'
});`,
    icon: '📱',
    popular: false
  },
  {
    id: 5,
    name: 'Google Maps API',
    category: 'delivery',
    description: 'Géolocalisation et calcul d\'itinéraires pour les livraisons',
    website: 'https://developers.google.com/maps',
    pricing: '200$ crédit gratuit/mois',
    features: ['Géocodage', 'Directions', 'Distance Matrix', 'Places'],
    code: `// Calculer la distance entre deux points
const calculateDistance = async (origin, destination) => {
  const response = await fetch(
    \`https://maps.googleapis.com/maps/api/distancematrix/json?
      origins=\${origin}&
      destinations=\${destination}&
      key=API_KEY\`
  );
  const data = await response.json();
  return data.rows[0].elements[0];
};

// Exemple
const distance = await calculateDistance(
  'Cotonou, Benin',
  'Porto-Novo, Benin'
);
console.log(distance.distance.text); // "32 km"`,
    icon: '🗺️',
    popular: false
  },
  {
    id: 6,
    name: 'Facebook Pixel',
    category: 'analytics',
    description: 'Suivi des conversions et remarketing sur Facebook',
    website: 'https://facebook.com/business',
    pricing: 'Gratuit',
    features: ['Tracking', 'Conversions', 'Audiences', 'Remarketing'],
    code: `<!-- Installation du Pixel Facebook -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID');
  fbq('track', 'PageView');
</script>

<!-- Tracker un achat -->
<script>
  fbq('track', 'Purchase', {
    value: 15000,
    currency: 'XOF'
  });
</script>`,
    icon: '📊',
    popular: true
  },
  {
    id: 7,
    name: 'Google Analytics 4',
    category: 'analytics',
    description: 'Analyse du trafic et comportement des visiteurs',
    website: 'https://analytics.google.com',
    pricing: 'Gratuit',
    features: ['Trafic', 'Conversions', 'Audiences', 'Rapports'],
    code: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXX');

  // Tracker un événement
  gtag('event', 'purchase', {
    transaction_id: '123',
    value: 15000,
    currency: 'XOF',
    items: [{
      item_name: 'Produit X',
      price: 15000,
      quantity: 1
    }]
  });
</script>`,
    icon: '📈',
    popular: false
  },
  {
    id: 8,
    name: 'Google Gemini API',
    category: 'ai',
    description: 'IA générative pour créer du contenu, descriptions, etc.',
    website: 'https://ai.google.dev',
    pricing: 'Gratuit jusqu\'à 60 requêtes/min',
    features: ['Génération texte', 'Analyse images', 'Chat', 'Multimodal'],
    code: `import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Générer une description produit
const generateDescription = async (product) => {
  const prompt = \`Génère une description vendeuse pour: \${product}\`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const desc = await generateDescription('Sac en cuir artisanal');
console.log(desc);`,
    icon: '🤖',
    popular: true
  },
  {
    id: 9,
    name: 'Cloudinary',
    category: 'ai',
    description: 'Hébergement et optimisation d\'images avec IA',
    website: 'https://cloudinary.com',
    pricing: 'Gratuit jusqu\'à 25GB',
    features: ['Hébergement', 'Optimisation', 'Transformation', 'IA'],
    code: `// Upload et optimisation d'image
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'xxx',
  api_key: 'xxx',
  api_secret: 'xxx'
});

// Upload avec optimisation automatique
const result = await cloudinary.uploader.upload('image.jpg', {
  transformation: [
    { width: 800, crop: 'scale' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
});

console.log(result.secure_url);`,
    icon: '🖼️',
    popular: false
  },
]

export function APIs() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredAPIs = APIS.filter(api => {
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">APIs & Intégrations</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Les APIs essentielles pour automatiser ton business
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher une API..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {API_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-gold text-white'
                : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-secondary'
            )}
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* APIs List */}
      <div className="space-y-6">
        {filteredAPIs.map(api => (
          <Card key={api.id} hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-dark-secondary rounded-xl flex items-center justify-center text-3xl">
                  {api.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{api.name}</h3>
                    {api.popular && (
                      <Badge variant="gold" size="sm">Populaire</Badge>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{api.description}</p>
                </div>
              </div>
              <a
                href={api.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-dark hover:text-gold transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {api.features.map((feature, i) => (
                <Badge key={i} variant="default" size="sm">{feature}</Badge>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg mb-4">
              <span className="text-sm font-medium">Tarification:</span>
              <span className="text-sm text-gold-dark">{api.pricing}</span>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setExpandedId(expandedId === api.id ? null : api.id)}
            >
              <Code className="w-4 h-4 mr-2" />
              {expandedId === api.id ? 'Masquer le code' : 'Voir le code d\'exemple'}
            </Button>

            {expandedId === api.id && (
              <div className="mt-4 animate-fade-in">
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
                    <code>{api.code}</code>
                  </pre>
                  <button
                    onClick={() => copyCode(api.id, api.code)}
                    className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {copiedId === api.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Conseils d'intégration
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">🔐</div>
            <h4 className="font-semibold">Sécurise tes clés</h4>
            <p className="text-sm text-gray-500">Ne jamais exposer les clés API côté client</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">🧪</div>
            <h4 className="font-semibold">Teste en sandbox</h4>
            <p className="text-sm text-gray-500">Utilise le mode test avant la production</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold">Lis la doc</h4>
            <p className="text-sm text-gray-500">La documentation officielle est ton amie</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Download, Copy, Check, AlertTriangle, Building, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils/helpers'

const LEGAL_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '📋' },
  { id: 'structure', name: 'Statut juridique', icon: '🏢' },
  { id: 'documents', name: 'Documents', icon: '📄' },
  { id: 'taxes', name: 'Fiscalité', icon: '💰' },
  { id: 'protection', name: 'Protection', icon: '🛡️' },
]

const LEGAL_CONTENT = [
  {
    id: 1,
    category: 'structure',
    title: 'Quel statut choisir au Bénin?',
    icon: '🏢',
    importance: 'high',
    content: `
## Les statuts juridiques au Bénin

### 1. Entreprise Individuelle (EI)
**Pour qui:** Débutants, petites activités
- Capital: Pas de minimum
- Responsabilité: Illimitée (biens personnels engagés)
- Fiscalité: Impôt sur le revenu
- Avantages: Simple, peu coûteux
- Inconvénients: Responsabilité personnelle

### 2. SARL (Société à Responsabilité Limitée)
**Pour qui:** Business établi, plusieurs associés
- Capital minimum: 100 000 FCFA
- Responsabilité: Limitée au capital
- Fiscalité: IS (Impôt sur les Sociétés)
- Avantages: Protection patrimoine, crédibilité
- Inconvénients: Plus de formalités

### 3. SAS (Société par Actions Simplifiée)
**Pour qui:** Startups, levée de fonds
- Capital: Libre
- Responsabilité: Limitée
- Fiscalité: IS
- Avantages: Flexibilité, investisseurs
- Inconvénients: Coûts de création

## Notre recommandation

**Pour débuter:** Entreprise Individuelle
- Coût: ~50 000 FCFA
- Délai: 1-2 semaines
- Pas besoin de capital

**Pour scaler:** SARL
- Quand tu dépasses 1M FCFA/mois de CA
- Plus de crédibilité avec les fournisseurs
- Séparation patrimoine personnel/professionnel
    `,
    documents: []
  },
  {
    id: 2,
    category: 'structure',
    title: 'Créer son entreprise pas à pas',
    icon: '📝',
    importance: 'high',
    content: `
## Étapes pour créer ton entreprise au Bénin

### Étape 1: Choisir ton nom commercial
- Vérifier la disponibilité à l'APIEX
- Éviter les noms déjà utilisés
- Choisir un nom mémorable

### Étape 2: Réunir les documents
- Pièce d'identité (CNI ou passeport)
- Certificat de résidence
- 2 photos d'identité
- Formulaire de création (GUFE)

### Étape 3: Guichet Unique (GUFE)
📍 Adresse: APIEX, Cotonou
- Déposer le dossier
- Payer les frais (~50 000 FCFA pour EI)
- Délai: 24-72h

### Étape 4: Documents obtenus
- ✅ IFU (Identifiant Fiscal Unique)
- ✅ Registre de Commerce
- ✅ Carte professionnelle

### Étape 5: Compte bancaire pro
Banques recommandées:
- BOA (Bank of Africa)
- Ecobank
- UBA

Documents nécessaires:
- IFU + Registre de commerce
- Pièce d'identité
- Dépôt initial (~50 000 FCFA)
    `,
    documents: []
  },
  {
    id: 3,
    category: 'documents',
    title: 'CGV (Conditions Générales de Vente)',
    icon: '📄',
    importance: 'high',
    content: `
## Modèle de CGV pour E-commerce

Les CGV sont **obligatoires** pour vendre en ligne. Elles protègent toi ET tes clients.

### Ce que doivent contenir tes CGV:

1. **Identification du vendeur**
   - Nom/Raison sociale
   - Adresse
   - Contact (email, téléphone)
   - Numéro IFU

2. **Produits et prix**
   - Description des produits
   - Prix en FCFA TTC
   - Disponibilité

3. **Commande**
   - Processus de commande
   - Validation
   - Confirmation

4. **Paiement**
   - Moyens acceptés (Mobile Money, etc.)
   - Moment du paiement

5. **Livraison**
   - Zones livrées
   - Délais
   - Frais
   - Suivi

6. **Retours et remboursements**
   - Conditions de retour
   - Délai (7 jours recommandé)
   - Procédure

7. **Réclamations**
   - Contact SAV
   - Délai de réponse
    `,
    documents: [
      { name: 'Modèle CGV E-commerce', type: 'docx' }
    ]
  },
  {
    id: 4,
    category: 'documents',
    title: 'Politique de confidentialité',
    icon: '🔒',
    importance: 'medium',
    content: `
## Politique de confidentialité

**Pourquoi c'est important?**
Tu collectes des données personnelles (nom, téléphone, adresse) de tes clients. Tu dois les informer de l'utilisation de ces données.

### Éléments à inclure:

1. **Données collectées**
   - Nom, prénom
   - Téléphone
   - Adresse de livraison
   - Historique d'achats

2. **Utilisation des données**
   - Traitement des commandes
   - Livraison
   - Service client
   - Marketing (avec consentement)

3. **Partage des données**
   - Livreurs (adresse uniquement)
   - Prestataires de paiement
   - Jamais vendu à des tiers

4. **Durée de conservation**
   - Données clients: 3 ans après dernier achat
   - Données comptables: 10 ans

5. **Droits des clients**
   - Accès à leurs données
   - Modification
   - Suppression
   - Opposition marketing

### Où afficher?
- Lien dans le footer du site
- Mentionné dans les CGV
- Envoyé avec la confirmation de commande
    `,
    documents: [
      { name: 'Modèle Politique Confidentialité', type: 'docx' }
    ]
  },
  {
    id: 5,
    category: 'taxes',
    title: 'Fiscalité E-commerce au Bénin',
    icon: '💰',
    importance: 'high',
    content: `
## Taxes et impôts pour l'e-commerce

### Pour les Entreprises Individuelles

**1. Impôt sur le Revenu (IR)**
- Barème progressif
- Déclaration annuelle

**2. TVA (18%)**
- Obligatoire si CA > 50M FCFA/an
- En dessous: régime simplifié

**3. Patente**
- Impôt local annuel
- Variable selon la commune
- ~50 000 - 200 000 FCFA/an

### Régime simplifié (Forfait)
Pour CA < 50M FCFA:
- Impôt forfaitaire
- Déclaration simplifiée
- Recommandé pour débuter

### Obligations déclaratives
- **Mensuel:** Déclaration TVA (si applicable)
- **Annuel:** Déclaration de revenus
- **Comptabilité:** Livre de recettes/dépenses

### Conseils
1. Garde TOUTES tes factures
2. Utilise un logiciel de comptabilité simple
3. Consulte un comptable quand tu grandis
4. Mets 20% de côté pour les impôts
    `,
    documents: []
  },
  {
    id: 6,
    category: 'taxes',
    title: 'Factures et comptabilité',
    icon: '🧾',
    importance: 'high',
    content: `
## Facturation conforme

### Mentions obligatoires sur une facture

1. **Tes informations**
   - Nom de l'entreprise
   - Adresse
   - Numéro IFU
   - Téléphone

2. **Informations client**
   - Nom
   - Adresse (si professionnel: IFU)

3. **Détails de la vente**
   - Date de la facture
   - Numéro de facture (séquentiel)
   - Description des produits
   - Quantité
   - Prix unitaire HT
   - TVA (si applicable)
   - Total TTC

### Numérotation des factures
Format recommandé: AAAA-XXXX
Exemple: 2024-0001, 2024-0002...

### Conservation
- **Factures émises:** 10 ans
- **Factures reçues:** 10 ans
- Format papier OU numérique

### Outils gratuits recommandés
- Wave (en ligne)
- Zoho Invoice
- Google Sheets (template)
    `,
    documents: [
      { name: 'Modèle Facture', type: 'xlsx' }
    ]
  },
  {
    id: 7,
    category: 'protection',
    title: 'Protéger son business',
    icon: '🛡️',
    importance: 'medium',
    content: `
## Protection juridique de ton business

### 1. Protéger ta marque
**Dépôt de marque à l'OAPI**
- Coût: ~200 000 FCFA
- Protection: 10 ans (renouvelable)
- Territoire: 17 pays africains

### 2. Protéger tes créations
**Droits d'auteur**
- Photos de produits
- Textes et descriptions
- Logo et visuels

### 3. Contrats avec fournisseurs
Éléments à inclure:
- Conditions de paiement
- Délais de livraison
- Qualité attendue
- Pénalités de retard
- Exclusivité (si applicable)

### 4. Assurance
**Assurance Responsabilité Civile Pro**
- Protège si un produit cause un dommage
- Coût: ~100 000 - 300 000 FCFA/an
- Recommandé dès que tu grandis

### 5. Éviter les arnaques
- Toujours vérifier l'identité des gros acheteurs
- Paiement avant livraison
- Méfiance des commandes inhabituelles
- Screenshots de toutes les conversations
    `,
    documents: []
  },
  {
    id: 8,
    category: 'protection',
    title: 'Gérer les litiges clients',
    icon: '⚖️',
    importance: 'medium',
    content: `
## Gestion des litiges

### Prévention
1. **CGV claires** = moins de litiges
2. **Photos exactes** des produits
3. **Descriptions honnêtes**
4. **Délais réalistes**

### En cas de réclamation

**Étape 1: Écouter**
- Laisser le client s'exprimer
- Ne pas répondre sous l'émotion
- Prendre note des faits

**Étape 2: Analyser**
- Vérifier la commande
- Consulter les échanges
- Déterminer la responsabilité

**Étape 3: Proposer**
- Remplacement du produit
- Remboursement partiel/total
- Geste commercial

**Étape 4: Documenter**
- Garder trace de tout
- Faire signer un accord
- Clôturer proprement

### Si le client est de mauvaise foi
- Rester calme et professionnel
- S'appuyer sur les CGV
- Proposer une médiation
- En dernier recours: tribunal de commerce

### Conseils pratiques
- Réponds en moins de 24h
- Un client mécontent bien traité devient fidèle
- Parfois mieux de perdre une vente que sa réputation
    `,
    documents: []
  },
]

export function Legal() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredContent = LEGAL_CONTENT.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  )

  const copyContent = (id: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="gold" className="mb-2">Ressources</Badge>
        <h1 className="text-3xl font-bold font-playfair">
          <span className="gradient-text">Legal & Pro</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Tout pour être en règle et protéger ton business
        </p>
      </div>

      {/* Warning */}
      <Card className="border-l-4 border-l-amber-500" hover={false}>
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-600 dark:text-amber-400">Avertissement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ces informations sont fournies à titre indicatif. Pour des conseils personnalisés,
              consulte un professionnel (avocat, expert-comptable). Les lois peuvent évoluer.
            </p>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {LEGAL_CATEGORIES.map(cat => (
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

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map(item => (
          <Card key={item.id} hover={false} className="overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-dark-secondary rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-bold">{item.title}</h3>
                  <Badge
                    variant={item.importance === 'high' ? 'gold' : 'default'}
                    size="sm"
                  >
                    {item.importance === 'high' ? 'Important' : 'Utile'}
                  </Badge>
                </div>
              </div>
              {expandedId === item.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedId === item.id && (
              <div className="animate-fade-in border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {item.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-md font-semibold mt-3 mb-1 text-gold-dark">{line.replace('### ', '')}</h3>
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.replace('- ', '')}</li>
                      }
                      return line ? <p key={i}>{line}</p> : <br key={i} />
                    })}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContent(item.id, item.content)}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copié!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </>
                    )}
                  </Button>
                  {item.documents.map((doc, i) => (
                    <Button key={i} variant="gold" size="sm" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      {doc.name} (Bientôt)
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Contacts utiles
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold">APIEX/GUFE</h4>
            <p className="text-sm text-gray-500">Création d'entreprise</p>
            <p className="text-sm text-gold-dark mt-1">+229 21 31 55 00</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold">Impôts (DGI)</h4>
            <p className="text-sm text-gray-500">Questions fiscales</p>
            <p className="text-sm text-gold-dark mt-1">+229 21 30 10 20</p>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
            <h4 className="font-semibold">CCIB</h4>
            <p className="text-sm text-gray-500">Chambre de Commerce</p>
            <p className="text-sm text-gold-dark mt-1">+229 21 31 20 81</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

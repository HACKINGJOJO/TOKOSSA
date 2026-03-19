import { GoogleGenerativeAI } from '@google/generative-ai'
import { storage } from './storage'
import { STORAGE_KEYS } from '@/utils/constants'
import { formatNumber, getEndDate } from '@/utils/helpers'
import { DescriptionInput, DescriptionOutput } from '@/types'

export interface SalesPlaybook {
  offre: string
  sequence: string[]
  plan7jours: string[]
  kpi: string[]
}

export interface OfferBuilderOutput {
  angle: string
  offre: string
  cta: string
  objections: string[]
  bonus: string
}

export interface RelanceOutput {
  messages: string[]
  strategy: string
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  // Initialize with API key
  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    storage.set(STORAGE_KEYS.GEMINI_KEY, apiKey)
  }

  // Check if initialized
  isInitialized(): boolean {
    const apiKey = storage.get<string>(STORAGE_KEYS.GEMINI_KEY, '')
    if (apiKey && !this.genAI) {
      this.initialize(apiKey)
    }
    return !!this.genAI && !!this.model
  }

  // Get API key
  getApiKey(): string {
    return storage.get<string>(STORAGE_KEYS.GEMINI_KEY, '')
  }

  // Generate product description
  async generateDescription(data: DescriptionInput): Promise<DescriptionOutput> {
    if (!this.isInitialized()) {
      return this.generateDescriptionFallback(data)
    }

    const prompt = `Tu es un expert copywriter e-commerce au Bénin. Génère une description de produit VENDEUSE pour:

Produit: ${data.produit}
Catégorie: ${data.categorie}
Prix: ${data.prix} FCFA
Style: ${data.style || 'professionnel'}

Génère EXACTEMENT ce format JSON (sans markdown, juste le JSON brut):
{
  "courte": "Description courte avec emojis (50 mots max)",
  "longue": "Description longue avec structure AIDA (150 mots)",
  "bullets": "5 bullet points des bénéfices séparés par des retours à la ligne",
  "hook": "Un hook publicitaire accrocheur"
}

Important:
- Utilise des emojis
- Mentionne la livraison Cotonou
- Mentionne le paiement à la livraison
- Crée un sentiment d'urgence`

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()

      // Clean the response (remove markdown code blocks if present)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

      return JSON.parse(cleanText)
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generateDescriptionFallback(data)
    }
  }

  // Fallback description generator
  private generateDescriptionFallback(data: DescriptionInput): DescriptionOutput {
    const benefices: Record<string, string[]> = {
      mode: ['Matière premium confortable', 'Coupe flatteuse pour toutes les morphologies', 'Tendance 2024', 'Entretien facile'],
      cosmetique: ['Formule naturelle', 'Résultats visibles en 7 jours', 'Testé dermatologiquement', 'Longue tenue'],
      accessoire: ['Design élégant', 'Matériaux durables', 'Polyvalent au quotidien', 'Finitions soignées'],
      default: ['Qualité supérieure', 'Excellent rapport qualité-prix', 'Tendance actuelle', 'Satisfaction garantie'],
    }

    const beneficesList = benefices[data.categorie] || benefices.default

    return {
      courte: `✨ ${data.produit} - La qualité premium à prix mini! ${beneficesList[0]}. Commandez maintenant, stock limité!`,
      longue: `✨ **${data.produit}** ✨

Vous cherchez ${data.produit} de qualité sans vous ruiner? Votre recherche est terminée!

🎯 **Pourquoi vous allez l'adorer:**
• ${beneficesList[0]}
• ${beneficesList[1]}
• ${beneficesList[2]}

💰 **Prix:** ${formatNumber(data.prix)} FCFA
🚚 **Livraison:** Express Cotonou
✅ **Garantie:** Satisfait ou remboursé

⚡ **OFFRE LIMITÉE** - Stock limité, premiers arrivés premiers servis!

📲 **Commander:** Envoyez "JE COMMANDE" en DM ou WhatsApp`,
      bullets: beneficesList.map((b) => `• ${b}`).join('\n'),
      hook: `Vous cherchez ${data.produit} de qualité sans vous ruiner? Votre recherche est terminée!`,
    }
  }

  // Generate Facebook/Instagram post
  async generatePost(data: {
    type: 'promo' | 'nouveau' | 'temoignage'
    produit: string
    prix: number
    ancienPrix?: number
    description?: string
    bonus?: string
  }): Promise<{ post: string; hashtags: string }> {
    if (!this.isInitialized()) {
      return this.generatePostFallback(data)
    }

    const prompt = `Tu es un expert social media e-commerce au Bénin. Génère un post ${data.type} pour Facebook/Instagram:

Produit: ${data.produit}
Prix: ${data.prix} FCFA
${data.ancienPrix ? `Ancien prix: ${data.ancienPrix} FCFA` : ''}
${data.description ? `Description: ${data.description}` : ''}

Génère EXACTEMENT ce format JSON (sans markdown):
{
  "post": "Le post complet avec emojis, structure, CTA",
  "hashtags": "10 hashtags pertinents séparés par des espaces"
}

Important:
- Utilise beaucoup d'emojis
- Crée un sentiment d'urgence
- Mentionne Cotonou/Bénin
- Inclus un call-to-action clair`

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanText)
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generatePostFallback(data)
    }
  }

  private generatePostFallback(data: any): { post: string; hashtags: string } {
    const economie = (data.ancienPrix || data.prix * 1.5) - data.prix

    return {
      post: `🔥 **PROMO FLASH** 🔥

${data.produit} à seulement **${formatNumber(data.prix)} FCFA**${data.ancienPrix ? ` au lieu de ~~${formatNumber(data.ancienPrix)}~~!` : '!'}

💰 Économisez ${formatNumber(economie)} FCFA!

✅ Qualité premium
✅ Livraison rapide Cotonou
✅ Paiement à la livraison

⏰ Offre valable jusqu'à ${getEndDate()}
📦 Stock limité

📲 **COMMANDER:** Commentez "INTÉRESSÉ" ou DM direct!`,
      hashtags: '#Cotonou #Benin #Promo #Shopping #Mode #AchatEnLigne #Livraison #MadeinBenin #FashionBenin #ShoppingOnline',
    }
  }

  // Generate WhatsApp script
  async generateWhatsAppScript(data: {
    type: 'accueil' | 'closing' | 'objection' | 'relance'
    nom?: string
    produit: string
    prix?: number
  }): Promise<string> {
    if (!this.isInitialized()) {
      return this.generateScriptFallback(data)
    }

    const prompt = `Tu es un expert vente WhatsApp e-commerce au Bénin. Génère un script ${data.type}:

Client: ${data.nom || 'ami(e)'}
Produit: ${data.produit}
${data.prix ? `Prix: ${data.prix} FCFA` : ''}

Génère UNIQUEMENT le script (pas de JSON, juste le texte):
- Utilise un ton amical mais professionnel
- Sois persuasif sans être pushy
- Inclus des emojis
- Maximum 150 mots`

    try {
      const result = await this.model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generateScriptFallback(data)
    }
  }

  async generateSalesPlaybook(data: {
    objectif: string
    canal: 'whatsapp' | 'facebook' | 'instagram'
    categorie: string
    produit: string
    prix?: number
    budgetPub?: number
    priorityOrder?: number[]
  }): Promise<SalesPlaybook> {
    if (!this.isInitialized()) {
      return this.generateSalesPlaybookFallback(data)
    }

    const prompt = `Tu es un coach e-commerce d'exécution au Bénin. Conçois un playbook vivant et concret.

Objectif: ${data.objectif}
Canal principal: ${data.canal}
Catégorie: ${data.categorie}
Produit: ${data.produit}
${data.prix ? `Prix: ${data.prix} FCFA` : ''}
${data.budgetPub ? `Budget pub: ${data.budgetPub} FCFA` : ''}
${data.priorityOrder?.length ? `Priorité des messages qui performent historiquement: ${data.priorityOrder.map((v) => `M${v + 1}`).join(' > ')}` : ''}

Réponds en JSON STRICT (pas de markdown):
{
  "offre": "Offre claire et vendable immédiatement",
  "sequence": ["Message 1 ...", "Message 2 ...", "Message 3 ...", "Message 4 ...", "Message 5 ..."],
  "plan7jours": ["Jour 1 ...", "Jour 2 ...", "Jour 3 ...", "Jour 4 ...", "Jour 5 ...", "Jour 6 ...", "Jour 7 ..."],
  "kpi": ["KPI 1", "KPI 2", "KPI 3"]
}

Contraintes:
- style actionnable, terrain
- adapté au marché Cotonou/Bénin
- messages courts et persuasifs`

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanText) as SalesPlaybook
      if (!parsed.offre || !Array.isArray(parsed.sequence) || !Array.isArray(parsed.plan7jours)) {
        return this.generateSalesPlaybookFallback(data)
      }
      return parsed
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generateSalesPlaybookFallback(data)
    }
  }

  private generateScriptFallback(data: any): string {
    const scripts: Record<string, string> = {
      accueil: `Salut ${data.nom || 'ami(e)'}! 👋

Merci pour ton intérêt pour notre ${data.produit}!

C'est un excellent choix, c'est l'un de nos bestsellers! 🔥

Tu as des questions ou tu veux commander directement?`,
      closing: `Parfait ${data.nom || 'ami(e)'}! Récap de ta commande:

✅ ${data.produit}
💰 Prix: ${formatNumber(data.prix || 0)} FCFA
🚚 Livraison: 24-48h

🎁 BONUS: Je t'offre un petit cadeau pour ta première commande!

On valide? Plus que quelques pièces en stock! ⏰`,
      objection: `Je comprends totalement!

En fait, ce prix reflète la qualité premium du produit. Nos clientes nous disent souvent qu'elles auraient payé plus cher ailleurs pour moins bien!

Je peux te proposer un petit geste: -10% si tu commandes maintenant. Ça te va?`,
      relance: `Hey ${data.nom || 'ami(e)'}! 👋

Je reviens vers toi concernant le ${data.produit} dont on a parlé.

Tu as pu réfléchir? Il en reste encore quelques-uns!

Si tu as des questions, je suis là! 😊`,
    }

    return scripts[data.type] || scripts.accueil
  }

  private generateSalesPlaybookFallback(data: {
    objectif: string
    canal: 'whatsapp' | 'facebook' | 'instagram'
    categorie: string
    produit: string
    prix?: number
    budgetPub?: number
    priorityOrder?: number[]
  }): SalesPlaybook {
    const prixTxt = data.prix ? `${formatNumber(data.prix)} FCFA` : 'prix à définir'
    const canalTxt =
      data.canal === 'whatsapp' ? 'WhatsApp' : data.canal === 'facebook' ? 'Facebook' : 'Instagram'

    return {
      offre: `${data.produit} (${data.categorie}) à ${prixTxt}. Livraison rapide + paiement à la livraison + bonus 1 conseil personnalisé.`,
      sequence: [
        `Salut 👋 j'aide mes clientes à trouver ${data.produit} fiable sans se tromper. Tu veux voir 2 modèles aujourd'hui ?`,
        `Top. Le plus demandé est à ${prixTxt}. Qualité validée + livraison rapide Cotonou.`,
        `Si tu hésites sur le prix: je peux réserver aujourd'hui avec un petit bonus de lancement.`,
        `On valide ton modèle maintenant ? Je te garde la dispo jusqu'à ce soir.`,
        `Relance douce: je ferme les commandes du jour à 19h. Tu veux que je te confirme le tien ?`,
      ],
      plan7jours: [
        `Jour 1: Publie 1 offre ${data.produit} avec CTA ${canalTxt}`,
        `Jour 2: Réponds à toutes les discussions en moins de 10 min`,
        'Jour 3: Relance tous les prospects chauds',
        'Jour 4: Ajoute un témoignage ou preuve client',
        'Jour 5: Fais une offre limitée 24h',
        'Jour 6: Recycle les meilleurs messages qui convertissent',
        'Jour 7: Bilan KPI et ajustement prix/offre',
      ],
      kpi: ['Taux de réponse < 10 min', 'Nombre de conversations/jour', 'Taux de conversion conversation -> commande'],
    }
  }

  async generateOfferBuilder(data: {
    produit: string
    categorie: string
    prixVente: number
    prixAchat?: number
    urgence?: string
    garantie?: string
  }): Promise<OfferBuilderOutput> {
    if (!this.isInitialized()) {
      return this.generateOfferBuilderFallback(data)
    }

    const prompt = `Tu es un expert en offres e-commerce qui convertissent au Bénin.

Produit: ${data.produit}
Catégorie: ${data.categorie}
Prix de vente: ${data.prixVente} FCFA
${data.prixAchat ? `Prix d'achat: ${data.prixAchat} FCFA` : ''}
${data.urgence ? `Urgence: ${data.urgence}` : ''}
${data.garantie ? `Garantie: ${data.garantie}` : ''}

Réponds en JSON STRICT:
{
  "angle": "angle principal",
  "offre": "offre complète claire",
  "cta": "call to action direct",
  "objections": ["objection 1 + réponse", "objection 2 + réponse", "objection 3 + réponse"],
  "bonus": "bonus qui déclenche l'achat"
}`

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanText) as OfferBuilderOutput
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generateOfferBuilderFallback(data)
    }
  }

  async generateRelancePack(data: {
    contexte: 'panier' | 'dm'
    canal: 'whatsapp' | 'facebook' | 'instagram'
    produit: string
    prix?: number
  }): Promise<RelanceOutput> {
    if (!this.isInitialized()) {
      return this.generateRelancePackFallback(data)
    }

    const prompt = `Tu es un closer e-commerce expert en relance non agressive.

Contexte: ${data.contexte}
Canal: ${data.canal}
Produit: ${data.produit}
${data.prix ? `Prix: ${data.prix} FCFA` : ''}

Donne une séquence de 4 relances progressives.
Réponds en JSON STRICT:
{
  "strategy": "stratégie en une phrase",
  "messages": ["Relance 1", "Relance 2", "Relance 3", "Relance 4"]
}`

    try {
      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanText) as RelanceOutput
    } catch (error) {
      console.error('Gemini error:', error)
      return this.generateRelancePackFallback(data)
    }
  }

  private generateOfferBuilderFallback(data: {
    produit: string
    categorie: string
    prixVente: number
    prixAchat?: number
    urgence?: string
    garantie?: string
  }): OfferBuilderOutput {
    const marge = data.prixAchat ? data.prixVente - data.prixAchat : null
    return {
      angle: `Positionnement ${data.categorie}: pratique + résultat rapide`,
      offre: `${data.produit} à ${formatNumber(data.prixVente)} FCFA avec livraison rapide, paiement à la livraison${data.garantie ? ` et ${data.garantie}` : ''}.`,
      cta: `Envoie "JE VEUX ${data.produit.toUpperCase()}" maintenant pour réserver.`,
      objections: [
        'C’est cher -> la valeur est validée par la qualité + service + rapidité.',
        'Je dois réfléchir -> stock limité + bonus immédiat si validation aujourd’hui.',
        'Et si ça ne me convient pas ? -> garantie claire + support rapide.',
      ],
      bonus:
        marge && marge > 0
          ? `Bonus recommandé: mini cadeau coût max ${formatNumber(Math.max(200, Math.round(marge * 0.1)))} FCFA`
          : 'Bonus recommandé: livraison offerte sur la première commande',
    }
  }

  private generateRelancePackFallback(data: {
    contexte: 'panier' | 'dm'
    canal: 'whatsapp' | 'facebook' | 'instagram'
    produit: string
    prix?: number
  }): RelanceOutput {
    const prixTxt = data.prix ? ` à ${formatNumber(data.prix)} FCFA` : ''
    return {
      strategy: 'Rappeler la valeur, lever le frein, proposer une action simple.',
      messages: [
        `Hello 👋 je reviens pour ton ${data.produit}${prixTxt}. Tu veux que je te garde une pièce aujourd’hui ?`,
        `Petit rappel: le ${data.produit} part vite cette semaine. Je peux te confirmer la dispo maintenant.`,
        `Si ton frein est le prix, je peux t’ajouter un bonus utile pour valider aujourd’hui.`,
        `Dernier message: je clôture les réservations ce soir. Je bloque pour toi ?`,
      ],
    }
  }
}

export const geminiService = new GeminiService()

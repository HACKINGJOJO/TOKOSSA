import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Button, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui'
import { geminiService, type SalesPlaybook, type OfferBuilderOutput, type RelanceOutput } from '@/services/gemini'
import { analytics } from '@/services/analytics'
import { workspaceLearning } from '@/services/workspaceLearning'
import { CATEGORIES } from '@/utils/constants'
import { formatNumber, copyToClipboard } from '@/utils/helpers'
import { useAuthStore } from '@/features/auth'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useWorkspaceCrmStore, type LeadStatus } from '@/stores/workspaceCrmStore'
import { Sparkles, Copy, FileText, MessageSquare, Calculator, Settings, Rocket, Users, WalletCards, SendHorizontal } from 'lucide-react'

export function Workspace() {
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState(geminiService.getApiKey())
  const [showApiSetup, setShowApiSetup] = useState(!geminiService.isInitialized())
  const { niche, objective, channel } = useOnboardingStore()

  // Description generator state
  const [descForm, setDescForm] = useState({
    produit: '',
    categorie: 'mode',
    prix: '',
    style: 'professionnel',
  })
  const [descOutput, setDescOutput] = useState<{
    courte: string
    longue: string
    bullets: string
    hook: string
  } | null>(null)

  // Post generator state
  const [postForm, setPostForm] = useState({
    type: 'promo',
    produit: '',
    prix: '',
    ancienPrix: '',
  })
  const [postOutput, setPostOutput] = useState<{
    post: string
    hashtags: string
  } | null>(null)

  // Script generator state
  const [scriptForm, setScriptForm] = useState({
    type: 'accueil',
    nom: '',
    produit: '',
    prix: '',
  })
  const [scriptOutput, setScriptOutput] = useState<string>('')

  // Margin calculator state
  const [marginForm, setMarginForm] = useState({
    prixAchat: '',
    prixVente: '',
    fraisLivraison: '',
    fraisPub: '',
    quantite: '1',
  })
  const [marginResult, setMarginResult] = useState<any>(null)
  const [offerForm, setOfferForm] = useState({
    produit: '',
    categorie: niche || 'mode',
    prixVente: '',
    prixAchat: '',
    urgence: 'Stock limité 48h',
    garantie: 'Satisfait ou remboursé 7 jours',
  })
  const [offerOutput, setOfferOutput] = useState<OfferBuilderOutput | null>(null)
  const [relanceForm, setRelanceForm] = useState({
    contexte: 'panier',
    canal: 'whatsapp',
    produit: '',
    prix: '',
  })
  const [relanceOutput, setRelanceOutput] = useState<RelanceOutput | null>(null)
  const [roasForm, setRoasForm] = useState({
    prixVente: '',
    coutProduit: '',
    coutLivraison: '',
    fraisDivers: '',
    tauxConversion: '2',
  })
  const [roasOutput, setRoasOutput] = useState<{
    cpaMax: number
    roasMin: number
    breakevenRevenue: number
    recommendation: string
  } | null>(null)
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    product: '',
    amount: '',
    notes: '',
  })
  const { leads, addLead, removeLead, updateLeadStatus, updateLeadNotes, touchLead } = useWorkspaceCrmStore()
  const [playbookForm, setPlaybookForm] = useState({
    objectif: 'premiere_vente',
    canal: 'whatsapp',
    categorie: niche || 'mode',
    produit: '',
    prix: '',
    budgetPub: '',
  })
  const [playbookOutput, setPlaybookOutput] = useState<SalesPlaybook | null>(null)
  const [playbookFeedback, setPlaybookFeedback] = useState<'ok' | 'ko' | null>(null)
  const [selectedWinningMessage, setSelectedWinningMessage] = useState<number | null>(null)
  const [learningTick, setLearningTick] = useState(0)
  const requestedTab = searchParams.get('tab')
  const initialTab = ['live', 'offer', 'crm', 'relance', 'roas', 'description', 'post', 'script', 'margin'].includes(requestedTab || '')
    ? (requestedTab as 'live' | 'offer' | 'crm' | 'relance' | 'roas' | 'description' | 'post' | 'script' | 'margin')
    : 'description'
  const onboardingMode = searchParams.get('onboarding') === '1'

  const onboardingNicheLabel = useMemo(() => {
    return CATEGORIES.find((cat) => cat.value === niche)?.label || niche
  }, [niche])
  const playbookLearning = useMemo(
    () => {
      void learningTick
      return workspaceLearning.getContextSummary(playbookForm.categorie, playbookForm.canal)
    },
    [playbookForm.categorie, playbookForm.canal, learningTick]
  )
  const recommendedOrder = useMemo(
    () => {
      void learningTick
      return workspaceLearning.getPriorityOrder(playbookForm.categorie, playbookForm.canal)
    },
    [playbookForm.categorie, playbookForm.canal, learningTick]
  )
  const prioritizedSequence = useMemo(() => {
    if (!playbookOutput) return []
    return recommendedOrder
      .map((idx) => ({ originalIndex: idx, text: playbookOutput.sequence[idx] }))
      .filter((item) => !!item.text)
  }, [playbookOutput, recommendedOrder])

  useEffect(() => {
    if (!onboardingMode) return

    const suggestedType =
      objective === 'premiere_vente'
        ? 'accueil'
        : objective === 'doubler_ventes'
        ? 'closing'
        : 'relance'

    const suggestedProduct = onboardingNicheLabel
      ? `Produit ${onboardingNicheLabel.split('/')[0].trim()}`
      : 'Produit phare'

    setScriptForm((prev) => ({
      ...prev,
      type: suggestedType,
      produit: prev.produit || suggestedProduct,
    }))
  }, [objective, onboardingMode, onboardingNicheLabel])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      geminiService.initialize(apiKey.trim())
      setShowApiSetup(false)
      toast.success('Clé API Gemini configurée!')
    }
  }

  const handleGenerateDescription = async () => {
    if (!descForm.produit || !descForm.prix) {
      toast.error('Remplis le produit et le prix')
      return
    }

    setIsLoading(true)
    try {
      const result = await geminiService.generateDescription({
        produit: descForm.produit,
        categorie: descForm.categorie,
        prix: parseInt(descForm.prix),
        style: descForm.style,
      })
      analytics.track('workspace_generate', {
        tool: 'description',
        category: descForm.categorie,
      }, user?.id)
      setDescOutput(result)
      toast.success('Description générée!')
    } catch {
      toast.error('Erreur lors de la génération')
    }
    setIsLoading(false)
  }

  const handleGeneratePost = async () => {
    if (!postForm.produit || !postForm.prix) {
      toast.error('Remplis le produit et le prix')
      return
    }

    setIsLoading(true)
    try {
      const result = await geminiService.generatePost({
        type: postForm.type as 'promo' | 'nouveau' | 'temoignage',
        produit: postForm.produit,
        prix: parseInt(postForm.prix),
        ancienPrix: postForm.ancienPrix ? parseInt(postForm.ancienPrix) : undefined,
      })
      analytics.track('workspace_generate', {
        tool: 'post',
        type: postForm.type,
      }, user?.id)
      setPostOutput(result)
      toast.success('Post généré!')
    } catch {
      toast.error('Erreur lors de la génération')
    }
    setIsLoading(false)
  }

  const handleGenerateScript = async () => {
    if (!scriptForm.produit) {
      toast.error('Remplis le nom du produit')
      return
    }

    setIsLoading(true)
    try {
      const result = await geminiService.generateWhatsAppScript({
        type: scriptForm.type as 'accueil' | 'closing' | 'objection' | 'relance',
        nom: scriptForm.nom,
        produit: scriptForm.produit,
        prix: scriptForm.prix ? parseInt(scriptForm.prix) : undefined,
      })
      analytics.track('workspace_generate', {
        tool: 'script',
        type: scriptForm.type,
      }, user?.id)
      setScriptOutput(result)
      toast.success('Script généré!')
    } catch {
      toast.error('Erreur lors de la génération')
    }
    setIsLoading(false)
  }

  const handleCalculateMargin = () => {
    if (!marginForm.prixAchat || !marginForm.prixVente) {
      toast.error("Remplis le prix d'achat et de vente")
      return
    }

    const prixAchat = parseInt(marginForm.prixAchat)
    const prixVente = parseInt(marginForm.prixVente)
    const fraisLivraison = parseInt(marginForm.fraisLivraison) || 0
    const fraisPub = parseInt(marginForm.fraisPub) || 0
    const quantite = parseInt(marginForm.quantite) || 1

    const margeBrute = prixVente - prixAchat
    const fraisTotaux = fraisLivraison + fraisPub
    const margeNette = margeBrute - fraisTotaux
    const profitMensuel = margeNette * quantite
    const roi = prixAchat > 0 ? ((margeNette / prixAchat) * 100) : 0
    const margePercent = prixVente > 0 ? ((margeNette / prixVente) * 100) : 0

    let analyse = ''
    let niveau = ''
    if (roi >= 100) {
      analyse = '🔥 EXCELLENT! Marge exceptionnelle. Cette niche est en OR!'
      niveau = 'excellent'
    } else if (roi >= 50) {
      analyse = '✅ BIEN! Rentabilité solide. Tu peux scaler!'
      niveau = 'good'
    } else if (roi >= 30) {
      analyse = '⚠️ MOYEN. Cherche à réduire tes coûts ou augmenter tes prix.'
      niveau = 'medium'
    } else {
      analyse = '❌ TROP BAS! Change de niche ou renégocie avec tes fournisseurs.'
      niveau = 'low'
    }

    setMarginResult({
      margeBrute,
      margeNette,
      fraisTotaux,
      profitMensuel,
      roi: roi.toFixed(1),
      margePercent: margePercent.toFixed(1),
      analyse,
      niveau,
    })
    analytics.track('workspace_generate', {
      tool: 'margin',
      roi: Number(roi.toFixed(1)),
      margeNette,
    }, user?.id)
  }

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
    toast.success('Copié!')
  }

  const handleGeneratePlaybook = async () => {
    if (!playbookForm.produit.trim()) {
      toast.error('Ajoute un produit pour lancer le copilote')
      return
    }

    setIsLoading(true)
    try {
      const priorityOrder = workspaceLearning.getPriorityOrder(playbookForm.categorie, playbookForm.canal)
      const result = await geminiService.generateSalesPlaybook({
        objectif: playbookForm.objectif,
        canal: playbookForm.canal as 'whatsapp' | 'facebook' | 'instagram',
        categorie: playbookForm.categorie,
        produit: playbookForm.produit,
        prix: playbookForm.prix ? parseInt(playbookForm.prix) : undefined,
        budgetPub: playbookForm.budgetPub ? parseInt(playbookForm.budgetPub) : undefined,
        priorityOrder,
      })
      setPlaybookOutput(result)
      setPlaybookFeedback(null)
      setSelectedWinningMessage(null)
      analytics.track('workspace_generate', {
        tool: 'live_playbook',
        objectif: playbookForm.objectif,
        canal: playbookForm.canal,
      }, user?.id)
      toast.success('Playbook vivant généré')
    } catch {
      toast.error('Erreur lors de la génération du playbook')
    }
    setIsLoading(false)
  }

  const handlePlaybookFeedback = (feedback: 'ok' | 'ko') => {
    setPlaybookFeedback(feedback)
    workspaceLearning.recordFeedback({
      userId: user?.id,
      niche: playbookForm.categorie,
      channel: playbookForm.canal,
      objective: playbookForm.objectif,
      success: feedback === 'ok',
      messageIndex: selectedWinningMessage || undefined,
    })
    setLearningTick((v) => v + 1)
    analytics.track('workspace_feedback', {
      tool: 'live_playbook',
      feedback,
      objectif: playbookForm.objectif,
      niche: playbookForm.categorie,
      canal: playbookForm.canal,
      messageIndex: selectedWinningMessage,
    }, user?.id)
    toast.success(feedback === 'ok' ? 'Top, on garde cette direction' : 'Reçu, on va ajuster')
  }

  const handleGenerateOfferBuilder = async () => {
    if (!offerForm.produit || !offerForm.prixVente) {
      toast.error('Renseigne produit et prix de vente')
      return
    }
    setIsLoading(true)
    try {
      const output = await geminiService.generateOfferBuilder({
        produit: offerForm.produit,
        categorie: offerForm.categorie,
        prixVente: parseInt(offerForm.prixVente),
        prixAchat: offerForm.prixAchat ? parseInt(offerForm.prixAchat) : undefined,
        urgence: offerForm.urgence,
        garantie: offerForm.garantie,
      })
      setOfferOutput(output)
      analytics.track('workspace_generate', { tool: 'offer_builder', categorie: offerForm.categorie }, user?.id)
      toast.success('Offre pro générée')
    } catch {
      toast.error("Erreur de génération d'offre")
    }
    setIsLoading(false)
  }

  const handleGenerateRelancePack = async () => {
    if (!relanceForm.produit) {
      toast.error('Ajoute le produit pour générer la relance')
      return
    }
    setIsLoading(true)
    try {
      const output = await geminiService.generateRelancePack({
        contexte: relanceForm.contexte as 'panier' | 'dm',
        canal: relanceForm.canal as 'whatsapp' | 'facebook' | 'instagram',
        produit: relanceForm.produit,
        prix: relanceForm.prix ? parseInt(relanceForm.prix) : undefined,
      })
      setRelanceOutput(output)
      analytics.track('workspace_generate', {
        tool: 'relance_pack',
        contexte: relanceForm.contexte,
        canal: relanceForm.canal,
      }, user?.id)
      toast.success('Séquence de relance prête')
    } catch {
      toast.error('Erreur de génération relance')
    }
    setIsLoading(false)
  }

  const handleCalculateRoas = () => {
    if (!roasForm.prixVente || !roasForm.coutProduit) {
      toast.error('Renseigne prix de vente et coût produit')
      return
    }

    const price = parseInt(roasForm.prixVente)
    const cost = parseInt(roasForm.coutProduit)
    const shipping = parseInt(roasForm.coutLivraison) || 0
    const extra = parseInt(roasForm.fraisDivers) || 0
    const conversionRate = (parseFloat(roasForm.tauxConversion) || 1) / 100

    const margin = price - (cost + shipping + extra)
    const cpaMax = Math.max(0, margin)
    const roasMin = price > 0 && cpaMax > 0 ? Number((price / cpaMax).toFixed(2)) : 0
    const breakevenRevenue = Math.ceil((cost + shipping + extra) / Math.max(conversionRate, 0.001))

    const recommendation =
      cpaMax <= 0
        ? 'Marge trop faible: ajuste prix ou coûts avant de scaler.'
        : cpaMax < price * 0.2
        ? 'Zone prudente: teste petits budgets et optimise le tunnel.'
        : 'Zone saine: tu peux tester agressif et scaler progressivement.'

    setRoasOutput({ cpaMax, roasMin, breakevenRevenue, recommendation })
    analytics.track('workspace_generate', { tool: 'roas_breakeven', cpaMax, roasMin }, user?.id)
  }

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.phone.trim() || !newLead.product.trim()) {
      toast.error('Nom, téléphone et produit sont requis')
      return
    }
    addLead({
      name: newLead.name.trim(),
      phone: newLead.phone.trim(),
      product: newLead.product.trim(),
      amount: newLead.amount ? parseInt(newLead.amount) : undefined,
      notes: newLead.notes.trim(),
      status: 'new',
    })
    setNewLead({ name: '', phone: '', product: '', amount: '', notes: '' })
    analytics.track('workspace_generate', { tool: 'crm_add_lead' }, user?.id)
    toast.success('Lead ajouté au CRM')
  }

  const statusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'new', label: 'Nouveau' },
    { value: 'hot', label: 'Chaud' },
    { value: 'warm', label: 'Tiède' },
    { value: 'cold', label: 'Froid' },
    { value: 'won', label: 'Gagné' },
    { value: 'lost', label: 'Perdu' },
  ]

  // API Key Setup
  if (showApiSetup) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <Card hover={false}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-playfair text-gold-dark mb-2">
              Configurer Gemini AI
            </h1>
            <p className="text-gray-500">
              Entre ta clé API Google Gemini pour activer les fonctionnalités IA
            </p>
          </div>

          <Input
            label="Clé API Gemini"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
          />

          <p className="text-sm text-gray-500 mt-2 mb-6">
            Obtiens ta clé sur{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-dark underline"
            >
              Google AI Studio
            </a>
          </p>

          <Button onClick={handleSaveApiKey} className="w-full">
            Configurer
          </Button>

          <button
            onClick={() => setShowApiSetup(false)}
            className="w-full mt-3 text-gray-500 hover:text-gray-700"
          >
            Utiliser sans IA (templates basiques)
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">Workspace</span> 🛠️
          </h1>
          <p className="text-gray-500">Tes outils IA pour booster ton business</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowApiSetup(true)}
          leftIcon={<Settings className="w-4 h-4" />}
        >
          API
        </Button>
      </div>

      {onboardingMode && (
        <Card variant="gold" hover={false}>
          <h2 className="text-lg font-bold font-playfair mb-2">Mode démarrage activé</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Canal: <strong>{channel || 'whatsapp'}</strong> | Niche: <strong>{onboardingNicheLabel || '-'}</strong>.
            Complète le script ci-dessous puis copie-le pour ton premier envoi client.
          </p>
        </Card>
      )}

      {/* Tools */}
      <Tabs defaultTab={initialTab}>
        <TabsList className="overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="live">
            <Rocket className="w-4 h-4 mr-2" />
            Copilote
          </TabsTrigger>
          <TabsTrigger value="offer">
            <Sparkles className="w-4 h-4 mr-2" />
            Offre Pro
          </TabsTrigger>
          <TabsTrigger value="crm">
            <Users className="w-4 h-4 mr-2" />
            CRM
          </TabsTrigger>
          <TabsTrigger value="relance">
            <SendHorizontal className="w-4 h-4 mr-2" />
            Relance
          </TabsTrigger>
          <TabsTrigger value="roas">
            <WalletCards className="w-4 h-4 mr-2" />
            ROAS
          </TabsTrigger>
          <TabsTrigger value="description">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </TabsTrigger>
          <TabsTrigger value="post">
            <MessageSquare className="w-4 h-4 mr-2" />
            Post FB/IG
          </TabsTrigger>
          <TabsTrigger value="script">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="margin">
            <Calculator className="w-4 h-4 mr-2" />
            Marge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Mode Copilote Vente</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Select
                  label="Objectif business"
                  value={playbookForm.objectif}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, objectif: e.target.value })}
                  options={[
                    { value: 'premiere_vente', label: 'Faire ma 1ère vente' },
                    { value: 'doubler_ventes', label: 'Doubler mes ventes' },
                    { value: 'stabiliser', label: 'Stabiliser un système' },
                  ]}
                />
                <Select
                  label="Canal principal"
                  value={playbookForm.canal}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, canal: e.target.value })}
                  options={[
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'instagram', label: 'Instagram' },
                  ]}
                />
                <Select
                  label="Catégorie"
                  value={playbookForm.categorie}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, categorie: e.target.value })}
                  options={CATEGORIES}
                />
                <Input
                  label="Produit"
                  value={playbookForm.produit}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, produit: e.target.value })}
                  placeholder="Ex: Ensemble Ankara Premium"
                />
                <Input
                  label="Prix (optionnel)"
                  type="number"
                  value={playbookForm.prix}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, prix: e.target.value })}
                />
                <Input
                  label="Budget pub (optionnel)"
                  type="number"
                  value={playbookForm.budgetPub}
                  onChange={(e) => setPlaybookForm({ ...playbookForm, budgetPub: e.target.value })}
                />
                <Button
                  onClick={handleGeneratePlaybook}
                  isLoading={isLoading}
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Lancer le copilote
                </Button>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 text-sm">
                  <p className="font-semibold text-gold-dark mb-1">Apprentissage du canal</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {playbookLearning.total} feedback(s) en {playbookForm.canal} | taux de succès {playbookLearning.successRate}%
                  </p>
                  <p className="text-gray-500 mt-1">
                    Ordre qui performe: {playbookLearning.priorityOrder.map((n) => `M${n}`).join(' > ')}
                  </p>
                </div>
              </div>
            </Card>

            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Plan d'action vivant</CardTitle>
                {playbookOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy(
                        `${playbookOutput.offre}\n\n${playbookOutput.sequence.join('\n')}\n\n${playbookOutput.plan7jours.join('\n')}`
                      )
                    }
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copier
                  </Button>
                )}
              </CardHeader>
              {playbookOutput ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Offre recommandée</h4>
                    <p className="text-gray-700 dark:text-gray-300">{playbookOutput.offre}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Séquence de messages</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Priorité automatique actuelle: {recommendedOrder.map((i) => `M${i + 1}`).join(' > ')}
                    </p>
                    <div className="space-y-2">
                      {prioritizedSequence.map((item, i) => (
                        <div key={`${item.originalIndex}-${i}`} className="p-2 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            <strong>M{item.originalIndex + 1}.</strong> {item.text}
                          </p>
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant={selectedWinningMessage === item.originalIndex + 1 ? 'success' : 'outline'}
                              onClick={() => setSelectedWinningMessage(item.originalIndex + 1)}
                            >
                              {selectedWinningMessage === item.originalIndex + 1
                                ? 'Message gagnant sélectionné'
                                : 'Marquer comme message gagnant'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Plan 7 jours</h4>
                    <div className="space-y-1">
                      {playbookOutput.plan7jours.map((item, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">KPI à suivre</h4>
                    <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
                      {playbookOutput.kpi.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm mb-2">Ce plan a converti chez toi ?</p>
                    <p className="text-xs text-gray-500 mb-2">
                      Optionnel: sélectionne le message qui a le mieux converti pour améliorer la priorité automatique.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant={playbookFeedback === 'ok' ? 'success' : 'outline'} onClick={() => handlePlaybookFeedback('ok')}>
                        Oui
                      </Button>
                      <Button size="sm" variant={playbookFeedback === 'ko' ? 'danger' : 'outline'} onClick={() => handlePlaybookFeedback('ko')}>
                        Non
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Rocket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Configure ton objectif et lance le copilote.</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offer">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Offer Builder Pro</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Input label="Produit" value={offerForm.produit} onChange={(e) => setOfferForm({ ...offerForm, produit: e.target.value })} />
                <Select label="Catégorie" value={offerForm.categorie} onChange={(e) => setOfferForm({ ...offerForm, categorie: e.target.value })} options={CATEGORIES} />
                <Input label="Prix de vente (FCFA)" type="number" value={offerForm.prixVente} onChange={(e) => setOfferForm({ ...offerForm, prixVente: e.target.value })} />
                <Input label="Prix d'achat (optionnel)" type="number" value={offerForm.prixAchat} onChange={(e) => setOfferForm({ ...offerForm, prixAchat: e.target.value })} />
                <Input label="Urgence" value={offerForm.urgence} onChange={(e) => setOfferForm({ ...offerForm, urgence: e.target.value })} />
                <Input label="Garantie" value={offerForm.garantie} onChange={(e) => setOfferForm({ ...offerForm, garantie: e.target.value })} />
                <Button className="w-full" isLoading={isLoading} onClick={handleGenerateOfferBuilder} leftIcon={<Sparkles className="w-4 h-4" />}>
                  Générer l'offre
                </Button>
              </div>
            </Card>
            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Sortie offre</CardTitle>
                {offerOutput && <Button size="sm" variant="ghost" onClick={() => handleCopy(`${offerOutput.offre}\n\n${offerOutput.cta}`)} leftIcon={<Copy className="w-4 h-4" />}>Copier</Button>}
              </CardHeader>
              {offerOutput ? (
                <div className="space-y-4">
                  <p><strong>Angle:</strong> {offerOutput.angle}</p>
                  <p><strong>Offre:</strong> {offerOutput.offre}</p>
                  <p><strong>Bonus:</strong> {offerOutput.bonus}</p>
                  <p><strong>CTA:</strong> {offerOutput.cta}</p>
                  <div>
                    <p className="font-semibold mb-1">Objections traitées</p>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {offerOutput.objections.map((ob, i) => <li key={i}>{ob}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Renseigne le formulaire pour créer une offre prête à vendre.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>WhatsApp CRM Lite</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Input label="Nom prospect" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
                <Input label="Téléphone" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
                <Input label="Produit d'intérêt" value={newLead.product} onChange={(e) => setNewLead({ ...newLead, product: e.target.value })} />
                <Input label="Montant estimé (optionnel)" type="number" value={newLead.amount} onChange={(e) => setNewLead({ ...newLead, amount: e.target.value })} />
                <Input label="Notes (optionnel)" value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} />
                <Button className="w-full" onClick={handleAddLead} leftIcon={<Users className="w-4 h-4" />}>
                  Ajouter le lead
                </Button>
              </div>
            </Card>
            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Pipeline prospects ({leads.length})</CardTitle>
              </CardHeader>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {leads.length === 0 && <p className="text-gray-500">Aucun lead pour le moment.</p>}
                {leads.map((lead) => (
                  <div key={lead.id} className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.phone} • {lead.product}</p>
                      </div>
                      <button className="text-xs text-red-500" onClick={() => removeLead(lead.id)}>Supprimer</button>
                    </div>
                    <Select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      options={statusOptions}
                    />
                    <Input
                      value={lead.notes || ''}
                      onChange={(e) => updateLeadNotes(lead.id, e.target.value)}
                      placeholder="Notes rapides"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => touchLead(lead.id)}>
                        Marquer contacté
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRelanceForm((prev) => ({ ...prev, produit: lead.product }))}
                      >
                        Utiliser pour relance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relance">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Relance Panier / DM</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Select
                  label="Contexte"
                  value={relanceForm.contexte}
                  onChange={(e) => setRelanceForm({ ...relanceForm, contexte: e.target.value })}
                  options={[
                    { value: 'panier', label: 'Panier abandonné' },
                    { value: 'dm', label: 'DM sans réponse' },
                  ]}
                />
                <Select
                  label="Canal"
                  value={relanceForm.canal}
                  onChange={(e) => setRelanceForm({ ...relanceForm, canal: e.target.value })}
                  options={[
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'instagram', label: 'Instagram' },
                  ]}
                />
                <Input label="Produit" value={relanceForm.produit} onChange={(e) => setRelanceForm({ ...relanceForm, produit: e.target.value })} />
                <Input label="Prix (optionnel)" type="number" value={relanceForm.prix} onChange={(e) => setRelanceForm({ ...relanceForm, prix: e.target.value })} />
                <Button className="w-full" isLoading={isLoading} onClick={handleGenerateRelancePack} leftIcon={<SendHorizontal className="w-4 h-4" />}>
                  Générer séquence relance
                </Button>
              </div>
            </Card>
            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Relances prêtes</CardTitle>
                {relanceOutput && <Button size="sm" variant="ghost" onClick={() => handleCopy(relanceOutput.messages.join('\n\n'))} leftIcon={<Copy className="w-4 h-4" />}>Copier</Button>}
              </CardHeader>
              {relanceOutput ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">{relanceOutput.strategy}</p>
                  {relanceOutput.messages.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700">
                      <p className="text-sm whitespace-pre-wrap"><strong>Relance {i + 1}</strong> - {m}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Génère une séquence de relance progressive et non agressive.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roas">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>ROAS & Breakeven</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Input label="Prix de vente (FCFA)" type="number" value={roasForm.prixVente} onChange={(e) => setRoasForm({ ...roasForm, prixVente: e.target.value })} />
                <Input label="Coût produit (FCFA)" type="number" value={roasForm.coutProduit} onChange={(e) => setRoasForm({ ...roasForm, coutProduit: e.target.value })} />
                <Input label="Coût livraison (FCFA)" type="number" value={roasForm.coutLivraison} onChange={(e) => setRoasForm({ ...roasForm, coutLivraison: e.target.value })} />
                <Input label="Frais divers (FCFA)" type="number" value={roasForm.fraisDivers} onChange={(e) => setRoasForm({ ...roasForm, fraisDivers: e.target.value })} />
                <Input label="Taux conversion (%)" type="number" value={roasForm.tauxConversion} onChange={(e) => setRoasForm({ ...roasForm, tauxConversion: e.target.value })} />
                <Button className="w-full" onClick={handleCalculateRoas} leftIcon={<WalletCards className="w-4 h-4" />}>
                  Calculer seuils pub
                </Button>
              </div>
            </Card>
            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Décision pub</CardTitle>
              </CardHeader>
              {roasOutput ? (
                <div className="space-y-3">
                  <p><strong>CPA max:</strong> {formatNumber(roasOutput.cpaMax)} FCFA</p>
                  <p><strong>ROAS min:</strong> {roasOutput.roasMin}</p>
                  <p><strong>Chiffre pour break-even:</strong> {formatNumber(roasOutput.breakevenRevenue)} FCFA</p>
                  <div className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">{roasOutput.recommendation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Calcule tes seuils avant d’augmenter le budget ads.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Description Generator */}
        <TabsContent value="description">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Générateur de Description</CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <Input
                  label="Nom du produit"
                  value={descForm.produit}
                  onChange={(e) => setDescForm({ ...descForm, produit: e.target.value })}
                  placeholder="Ex: Robe Ankara Premium"
                />

                <Select
                  label="Catégorie"
                  value={descForm.categorie}
                  onChange={(e) => setDescForm({ ...descForm, categorie: e.target.value })}
                  options={CATEGORIES}
                />

                <Input
                  label="Prix (FCFA)"
                  type="number"
                  value={descForm.prix}
                  onChange={(e) => setDescForm({ ...descForm, prix: e.target.value })}
                  placeholder="15000"
                />

                <Select
                  label="Style"
                  value={descForm.style}
                  onChange={(e) => setDescForm({ ...descForm, style: e.target.value })}
                  options={[
                    { value: 'professionnel', label: 'Professionnel' },
                    { value: 'fun', label: 'Fun & Décontracté' },
                    { value: 'luxe', label: 'Luxe & Premium' },
                  ]}
                />

                <Button
                  onClick={handleGenerateDescription}
                  isLoading={isLoading}
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Générer avec IA
                </Button>
              </div>
            </Card>

            {/* Output */}
            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Résultat</CardTitle>
                {descOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(descOutput.longue)}
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copier
                  </Button>
                )}
              </CardHeader>

              {descOutput ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Hook</h4>
                    <p className="text-gray-700 dark:text-gray-300">{descOutput.hook}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Description courte</h4>
                    <p className="text-gray-700 dark:text-gray-300">{descOutput.courte}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Description longue</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {descOutput.longue}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gold-dark mb-2">Bullet points</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {descOutput.bullets}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Remplis le formulaire et clique sur Générer</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Post Generator */}
        <TabsContent value="post">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Générateur de Post</CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <Select
                  label="Type de post"
                  value={postForm.type}
                  onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}
                  options={[
                    { value: 'promo', label: 'Promo / Soldes' },
                    { value: 'nouveau', label: 'Nouveauté' },
                    { value: 'temoignage', label: 'Témoignage client' },
                  ]}
                />

                <Input
                  label="Produit"
                  value={postForm.produit}
                  onChange={(e) => setPostForm({ ...postForm, produit: e.target.value })}
                  placeholder="Nom du produit"
                />

                <Input
                  label="Prix actuel (FCFA)"
                  type="number"
                  value={postForm.prix}
                  onChange={(e) => setPostForm({ ...postForm, prix: e.target.value })}
                />

                <Input
                  label="Ancien prix (optionnel)"
                  type="number"
                  value={postForm.ancienPrix}
                  onChange={(e) => setPostForm({ ...postForm, ancienPrix: e.target.value })}
                />

                <Button
                  onClick={handleGeneratePost}
                  isLoading={isLoading}
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Générer
                </Button>
              </div>
            </Card>

            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Résultat</CardTitle>
                {postOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(postOutput.post + '\n\n' + postOutput.hashtags)}
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copier
                  </Button>
                )}
              </CardHeader>

              {postOutput ? (
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {postOutput.post}
                  </p>
                  <p className="text-blue-500 text-sm">{postOutput.hashtags}</p>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Génère ton post Facebook/Instagram</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Script Generator */}
        <TabsContent value="script">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Script WhatsApp</CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <Select
                  label="Type de script"
                  value={scriptForm.type}
                  onChange={(e) => setScriptForm({ ...scriptForm, type: e.target.value })}
                  options={[
                    { value: 'accueil', label: 'Accueil client' },
                    { value: 'closing', label: 'Closing / Validation' },
                    { value: 'objection', label: 'Gestion objection prix' },
                    { value: 'relance', label: 'Relance' },
                  ]}
                />

                <Input
                  label="Prénom du client (optionnel)"
                  value={scriptForm.nom}
                  onChange={(e) => setScriptForm({ ...scriptForm, nom: e.target.value })}
                  placeholder="Marie"
                />

                <Input
                  label="Produit"
                  value={scriptForm.produit}
                  onChange={(e) => setScriptForm({ ...scriptForm, produit: e.target.value })}
                  placeholder="Robe Ankara"
                />

                <Input
                  label="Prix (optionnel)"
                  type="number"
                  value={scriptForm.prix}
                  onChange={(e) => setScriptForm({ ...scriptForm, prix: e.target.value })}
                />

                <Button
                  onClick={handleGenerateScript}
                  isLoading={isLoading}
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Générer
                </Button>
              </div>
            </Card>

            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Script</CardTitle>
                {scriptOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(scriptOutput)}
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copier
                  </Button>
                )}
              </CardHeader>

              {scriptOutput ? (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {scriptOutput}
                </p>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Génère ton script de vente WhatsApp</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Margin Calculator */}
        <TabsContent value="margin">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Calculateur de Marge</CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <Input
                  label="Prix d'achat (FCFA)"
                  type="number"
                  value={marginForm.prixAchat}
                  onChange={(e) => setMarginForm({ ...marginForm, prixAchat: e.target.value })}
                  placeholder="5000"
                />

                <Input
                  label="Prix de vente (FCFA)"
                  type="number"
                  value={marginForm.prixVente}
                  onChange={(e) => setMarginForm({ ...marginForm, prixVente: e.target.value })}
                  placeholder="15000"
                />

                <Input
                  label="Frais livraison (optionnel)"
                  type="number"
                  value={marginForm.fraisLivraison}
                  onChange={(e) => setMarginForm({ ...marginForm, fraisLivraison: e.target.value })}
                  placeholder="500"
                />

                <Input
                  label="Frais pub (optionnel)"
                  type="number"
                  value={marginForm.fraisPub}
                  onChange={(e) => setMarginForm({ ...marginForm, fraisPub: e.target.value })}
                  placeholder="1000"
                />

                <Input
                  label="Ventes/mois estimées"
                  type="number"
                  value={marginForm.quantite}
                  onChange={(e) => setMarginForm({ ...marginForm, quantite: e.target.value })}
                  placeholder="30"
                />

                <Button onClick={handleCalculateMargin} className="w-full">
                  Calculer
                </Button>
              </div>
            </Card>

            <Card hover={false} className="bg-gray-50 dark:bg-dark-secondary">
              <CardHeader>
                <CardTitle>Résultat</CardTitle>
              </CardHeader>

              {marginResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Marge brute</p>
                      <p className="text-2xl font-bold text-gold-dark">
                        {formatNumber(marginResult.margeBrute)} FCFA
                      </p>
                    </div>
                    <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Marge nette</p>
                      <p className="text-2xl font-bold text-gold-dark">
                        {formatNumber(marginResult.margeNette)} FCFA
                      </p>
                    </div>
                    <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className="text-2xl font-bold text-gold-dark">{marginResult.roi}%</p>
                    </div>
                    <div className="bg-white dark:bg-dark-card p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Profit/mois</p>
                      <p className="text-2xl font-bold text-gold-dark">
                        {formatNumber(marginResult.profitMensuel)} FCFA
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      marginResult.niveau === 'excellent'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : marginResult.niveau === 'good'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : marginResult.niveau === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <p className="font-semibold">{marginResult.analyse}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Entre tes chiffres pour calculer ta marge</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

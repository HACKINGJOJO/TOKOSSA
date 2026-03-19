import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, Badge, Button, Input } from '@/components/ui'
import { Save, TrendingUp, Package, Users, DollarSign, Target, Edit2 } from 'lucide-react'
import { storageService } from '@/services/storage'

interface BusinessData {
  name: string
  niche: string
  target: string
  competitors: string
  suppliers: string
  monthlyGoal: number
  currentRevenue: number
  products: number
  clients: number
}

const DEFAULT_DATA: BusinessData = {
  name: '',
  niche: '',
  target: '',
  competitors: '',
  suppliers: '',
  monthlyGoal: 500000,
  currentRevenue: 0,
  products: 0,
  clients: 0,
}

export function MonBusiness() {
  const [data, setData] = useState<BusinessData>(DEFAULT_DATA)
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = storageService.get<BusinessData>('my_business')
    if (saved) setData(saved)
  }, [])

  const handleSave = () => {
    storageService.set('my_business', data)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const progress = data.monthlyGoal > 0 ? Math.min((data.currentRevenue / data.monthlyGoal) * 100, 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-2">Mon Business</Badge>
          <h1 className="text-3xl font-bold font-playfair">
            <span className="gradient-text">{data.name || 'Mon Business'}</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Tableau de bord de ton activité
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          leftIcon={isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        >
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <DollarSign className="w-8 h-8 text-gold-dark mx-auto mb-2" />
          {isEditing ? (
            <Input
              type="number"
              value={data.currentRevenue}
              onChange={(e) => setData({ ...data, currentRevenue: Number(e.target.value) })}
              className="text-center"
            />
          ) : (
            <div className="text-2xl font-bold">{data.currentRevenue.toLocaleString()}</div>
          )}
          <p className="text-sm text-gray-500">CA ce mois (FCFA)</p>
        </Card>

        <Card className="text-center">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          {isEditing ? (
            <Input
              type="number"
              value={data.monthlyGoal}
              onChange={(e) => setData({ ...data, monthlyGoal: Number(e.target.value) })}
              className="text-center"
            />
          ) : (
            <div className="text-2xl font-bold">{data.monthlyGoal.toLocaleString()}</div>
          )}
          <p className="text-sm text-gray-500">Objectif (FCFA)</p>
        </Card>

        <Card className="text-center">
          <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
          {isEditing ? (
            <Input
              type="number"
              value={data.products}
              onChange={(e) => setData({ ...data, products: Number(e.target.value) })}
              className="text-center"
            />
          ) : (
            <div className="text-2xl font-bold">{data.products}</div>
          )}
          <p className="text-sm text-gray-500">Produits</p>
        </Card>

        <Card className="text-center">
          <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          {isEditing ? (
            <Input
              type="number"
              value={data.clients}
              onChange={(e) => setData({ ...data, clients: Number(e.target.value) })}
              className="text-center"
            />
          ) : (
            <div className="text-2xl font-bold">{data.clients}</div>
          )}
          <p className="text-sm text-gray-500">Clients</p>
        </Card>
      </div>

      {/* Progress */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-dark" />
            Progression vers l'objectif
          </h3>
          <span className="text-2xl font-bold text-gold-dark">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-dark-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>0 FCFA</span>
          <span>{data.monthlyGoal.toLocaleString()} FCFA</span>
        </div>
      </Card>

      {/* Business Info */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Informations Business</CardTitle>
        </CardHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
            {isEditing ? (
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Ex: ChicMode Bénin"
              />
            ) : (
              <p className="p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg">
                {data.name || 'Non défini'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Niche principale</label>
            {isEditing ? (
              <Input
                value={data.niche}
                onChange={(e) => setData({ ...data, niche: e.target.value })}
                placeholder="Ex: Mode féminine, Cosmétiques"
              />
            ) : (
              <p className="p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg">
                {data.niche || 'Non défini'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cible</label>
            {isEditing ? (
              <Input
                value={data.target}
                onChange={(e) => setData({ ...data, target: e.target.value })}
                placeholder="Ex: Femmes 25-40 ans, Cotonou"
              />
            ) : (
              <p className="p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg">
                {data.target || 'Non défini'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Concurrents principaux</label>
            {isEditing ? (
              <Input
                value={data.competitors}
                onChange={(e) => setData({ ...data, competitors: e.target.value })}
                placeholder="Ex: BoutiqueX, ModeY"
              />
            ) : (
              <p className="p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg">
                {data.competitors || 'Non défini'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Fournisseurs</label>
            {isEditing ? (
              <Input
                value={data.suppliers}
                onChange={(e) => setData({ ...data, suppliers: e.target.value })}
                placeholder="Ex: Dantokpa, Fournisseur Chine"
              />
            ) : (
              <p className="p-3 bg-gray-50 dark:bg-dark-secondary rounded-lg">
                {data.suppliers || 'Non défini'}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card variant="gold" hover={false}>
        <h3 className="font-bold font-playfair text-lg mb-2">
          Mets à jour régulièrement
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Suis ton CA, tes clients et tes produits chaque semaine pour mesurer ta progression
          et ajuster ta stratégie.
        </p>
      </Card>

      {/* Save notification */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <Save className="w-4 h-4" />
          Sauvegardé!
        </div>
      )}
    </div>
  )
}

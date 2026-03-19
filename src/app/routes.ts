export type RouteAccess = 'public' | 'protected' | 'admin'
export type NavSectionKey = 'principal' | 'formation' | 'ressources' | 'autre' | 'admin'

export interface AppRouteItem {
  id: string
  path: string
  title: string
  access: RouteAccess
  icon?: string
  section?: NavSectionKey
  keywords?: string
  badge?: string
  showInNav?: boolean
  showInSearch?: boolean
}

export const NAV_SECTION_LABELS: Record<NavSectionKey, string> = {
  principal: 'Principal',
  formation: 'Formation',
  ressources: 'Ressources',
  autre: 'Autre',
  admin: 'Admin',
}

export const NAV_SECTION_ORDER: NavSectionKey[] = [
  'principal',
  'formation',
  'ressources',
  'autre',
  'admin',
]

export const APP_ROUTES: AppRouteItem[] = [
  { id: 'login', path: '/login', title: 'Connexion', access: 'public' },

  { id: 'dashboard', path: '/', title: 'Dashboard', access: 'protected', icon: 'Home', section: 'principal', keywords: 'dashboard accueil bienvenue', showInNav: true, showInSearch: true },
  { id: 'workspace', path: '/workspace', title: 'Workspace', access: 'protected', icon: 'Wrench', section: 'principal', keywords: 'workspace outils generateur', badge: 'NEW', showInNav: true, showInSearch: true },

  { id: 'fondations', path: '/formation/fondations', title: 'Fondations', access: 'protected', icon: 'BookOpen', section: 'formation', keywords: 'fondations niche pricing', showInNav: true, showInSearch: true },
  { id: 'sourcing', path: '/formation/sourcing', title: 'Sourcing', access: 'protected', icon: 'Package', section: 'formation', keywords: 'sourcing fournisseurs chine', showInNav: true, showInSearch: true },
  { id: 'marketing', path: '/formation/marketing', title: 'Marketing & Vente', access: 'protected', icon: 'Megaphone', section: 'formation', keywords: 'marketing vente aida', showInNav: true, showInSearch: true },
  { id: 'facebook-ads', path: '/formation/facebook-ads', title: 'Facebook Ads', access: 'protected', icon: 'Smartphone', section: 'formation', keywords: 'facebook ads publicite', showInNav: true, showInSearch: true },
  { id: 'shopify', path: '/formation/shopify', title: 'Shopify', access: 'protected', icon: 'ShoppingCart', section: 'formation', keywords: 'shopify boutique', showInNav: true, showInSearch: true },

  { id: 'produits-gagnants', path: '/ressources/produits-gagnants', title: 'Produits Gagnants', access: 'protected', icon: 'Gem', section: 'ressources', keywords: 'produits tendances', showInNav: true, showInSearch: true },
  { id: 'calendrier', path: '/ressources/calendrier', title: 'Calendrier E-com', access: 'protected', icon: 'Calendar', section: 'ressources', keywords: 'calendrier evenements', showInNav: true, showInSearch: true },
  { id: 'apis', path: '/ressources/apis', title: 'APIs & Outils', access: 'protected', icon: 'Plug', section: 'ressources', keywords: 'apis paiement livraison', showInNav: true, showInSearch: true },
  { id: 'outils', path: '/ressources/outils', title: 'Outils & IA', access: 'protected', icon: 'Wrench', section: 'ressources', keywords: 'outils ia design marketing', showInNav: true, showInSearch: false },
  { id: 'prompts', path: '/ressources/prompts', title: 'Prompts', access: 'protected', icon: 'MessageSquare', section: 'ressources', keywords: 'prompts ia chatgpt', showInNav: true, showInSearch: true },
  { id: 'dictionnaire', path: '/ressources/dictionnaire', title: 'Dictionnaire', access: 'protected', icon: 'Book', section: 'ressources', keywords: 'dictionnaire glossaire', showInNav: true, showInSearch: true },
  { id: 'cas-pratiques', path: '/ressources/cas-pratiques', title: 'Cas Pratiques', access: 'protected', icon: 'ClipboardList', section: 'ressources', keywords: 'cas pratiques business', showInNav: true, showInSearch: false },
  { id: 'checklists', path: '/ressources/checklists', title: 'Checklists', access: 'protected', icon: 'CheckSquare', section: 'ressources', keywords: 'checklists lancement', showInNav: true, showInSearch: false },
  { id: 'legal', path: '/ressources/legal', title: 'Legal & Pro', access: 'protected', icon: 'Scale', section: 'ressources', keywords: 'legal juridique benin', showInNav: true, showInSearch: false },
  { id: 'kit-demarrage', path: '/ressources/kit-demarrage', title: 'Kit Demarrage', access: 'protected', icon: 'Download', section: 'ressources', keywords: 'kit demarrage templates', showInNav: true, showInSearch: false },

  { id: 'tricks', path: '/tricks', title: 'Tricks', access: 'protected', icon: 'Target', section: 'autre', keywords: 'tricks astuces ventes', showInNav: true, showInSearch: true },
  { id: 'quiz', path: '/quiz', title: 'Quiz', access: 'protected', icon: 'HelpCircle', section: 'autre', keywords: 'quiz test', showInNav: true, showInSearch: true },
  { id: 'videos', path: '/videos', title: 'Videos', access: 'protected', icon: 'Video', section: 'autre', keywords: 'videos formation', showInNav: true, showInSearch: false },
  { id: 'notes', path: '/notes', title: 'Mes Notes', access: 'protected', icon: 'FileText', section: 'autre', keywords: 'notes prise de notes', showInNav: true, showInSearch: true },
  { id: 'roadmap', path: '/roadmap', title: 'Roadmap 30 Jours', access: 'protected', icon: 'Map', section: 'autre', keywords: 'roadmap parcours 30 jours', showInNav: true, showInSearch: false },
  { id: 'mon-business', path: '/mon-business', title: 'Mon Business', access: 'protected', icon: 'BarChart3', section: 'autre', keywords: 'business stats', showInNav: true, showInSearch: false },
  { id: 'leaderboard', path: '/leaderboard', title: 'Leaderboard', access: 'protected', icon: 'Medal', section: 'autre', keywords: 'classement xp', showInNav: true, showInSearch: true },
  { id: 'sav', path: '/sav', title: 'SAV & Crises', access: 'protected', icon: 'LifeBuoy', section: 'autre', keywords: 'sav service client crise', showInNav: true, showInSearch: false },
  { id: 'certificat', path: '/certificat', title: 'Mon Certificat', access: 'protected', icon: 'Trophy', section: 'autre', keywords: 'certificat attestation', showInNav: true, showInSearch: true },
  { id: 'favoris', path: '/favoris', title: 'Mes Favoris', access: 'protected', icon: 'Star', section: 'autre', keywords: 'favoris sauvegarder', showInNav: true, showInSearch: true },
  { id: 'faq', path: '/faq', title: 'FAQ', access: 'protected', icon: 'HelpCircle', section: 'autre', keywords: 'faq aide questions', showInNav: true, showInSearch: false },
  { id: 'tarifs', path: '/tarifs', title: 'Tarifs & Offres', access: 'protected', icon: 'CreditCard', section: 'autre', keywords: 'tarifs prix offres', showInNav: true, showInSearch: false },
  { id: 'parcours', path: '/parcours', title: 'Parcours 1ere vente', access: 'protected', icon: 'Target', section: 'autre', keywords: 'parcours premiere vente', showInNav: true, showInSearch: false },
  { id: 'plan-etude', path: '/plan-etude', title: "Plan d'etude", access: 'protected', icon: 'ListChecks', section: 'autre', keywords: 'plan etude apprentissage', showInNav: true, showInSearch: false },
  { id: 'reglages', path: '/reglages', title: 'Reglages', access: 'protected', icon: 'Settings', section: 'autre', keywords: 'reglages parametres', showInNav: true, showInSearch: true },

  { id: 'admin', path: '/admin', title: 'Gestion Membres', access: 'admin', icon: 'Users', section: 'admin', keywords: 'admin membres', showInNav: true, showInSearch: false },
]

export const SEARCHABLE_ROUTES = APP_ROUTES.filter((route) => route.showInSearch)

export function getNavItemsBySection(section: NavSectionKey): AppRouteItem[] {
  return APP_ROUTES.filter((route) => route.showInNav && route.section === section)
}

const routePathById = APP_ROUTES.reduce<Record<string, string>>((acc, route) => {
  acc[route.id] = route.path
  return acc
}, {})

export function getRoutePath(routeId: string, fallback = '/'): string {
  return routePathById[routeId] || fallback
}

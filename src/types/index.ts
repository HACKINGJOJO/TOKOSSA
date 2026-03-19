// User & Auth Types
export interface User {
  id: string
  name: string
  role: 'admin' | 'member'
  pin?: string
  code?: string
  createdAt: number
  expiresAt?: number | null
  active: boolean
  memberSince?: string
}

export interface Session {
  userId: string
  timestamp: number
  expires: number
}

export interface AuthResult {
  success: boolean
  message: string
  user?: User
}

// Progress Types
export interface ModuleProgress {
  [moduleId: string]: number
}

export interface Progress {
  modules: ModuleProgress
  completed: string[]
  milestones: Record<string, boolean>
  milestoneXpAwarded: string[]
  lastVisited: string | null
  totalTime: number
}

export interface Badge {
  id: string
  label: string
  icon: string
}

export interface Level {
  level: number
  name: string
  icon: string
  minXP: number
  xp: number
}

// Certificate Types
export interface Certificate {
  id: string
  userId: string
  userName: string
  date: number
  securityCode: string
}

// Favorites Types
export interface FavoriteItem {
  id: string
  type: 'prompt' | 'trick' | 'tool'
  title: string
  content?: string
  addedAt: number
}

// Notes Types
export interface Notes {
  [pageId: string]: string
}

// Quiz Types
export interface QuizScore {
  [quizId: string]: number
}

// Workspace Types
export interface WorkspaceHistoryItem {
  type: 'description' | 'post' | 'script'
  input: Record<string, unknown>
  output: string
  at: number
}

// Calendar Types
export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'personal' | 'holiday' | 'promo'
  at: number
}

// Promo Code Types
export interface PromoCode {
  id: string
  code: string
  reductionPct: number
  validUntil: string | null
  createdAt: number
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

// Tool Types
export interface DescriptionInput {
  produit: string
  categorie: string
  prix: number
  style?: string
}

export interface DescriptionOutput {
  courte: string
  longue: string
  bullets: string
  hook: string
}

export interface MarginInput {
  prixAchat: number
  prixVente: number
  fraisLivraison?: number
  fraisPub?: number
  fraisPackaging?: number
  quantite?: number
  fraisDouane?: number
  fraisShipping?: number
}

export interface MarginResult {
  coutTotal: number
  margeBrute: number
  margeNette: number
  fraisTotaux: number
  profitMensuel: number
  roi: string
  margePercent: string
  seuilRentabilite: number
  analyse: string
  niveau: 'excellent' | 'good' | 'medium' | 'low'
  projection: {
    jour: number
    semaine: number
    mois: number
    trimestre: number
  }
}

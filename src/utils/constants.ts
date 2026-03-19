export const APP_CONFIG = {
  name: 'JOJO E-Commerce Mastery',
  version: '2.0',
  storagePrefix: 'jojo_',
}

export const AUTH_CONFIG = {
  PIN_LENGTH: 6,
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 300000, // 5 minutes
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
}

export const STORAGE_KEYS = {
  USERS: 'users',
  SESSION: 'session',
  CURRENT_USER: 'current_user',
  ATTEMPTS: 'attempts',
  LOCKOUT: 'lockout',
  THEME: 'theme',
  PROGRESS: 'progress',
  FAVORITES: 'favorites',
  NOTES: 'notes',
  QUIZ_SCORES: 'quiz_scores',
  WORKSPACE_HISTORY: 'workspace_history',
  CALENDAR_EVENTS: 'calendar_events',
  CERTIFICATES: 'certificates',
  PROMO_CODES: 'promo_codes',
  GEMINI_KEY: 'gemini_key',
  ADMIN_STATS: 'admin_stats',
  MEMBERS_HISTORY: 'members_history',
  ANALYTICS_EVENTS: 'analytics_events',
  WORKSPACE_FEEDBACKS: 'workspace_feedbacks',
}

export const MODULES_FOR_CERTIFICATE = ['fondations', 'sourcing', 'marketing', 'shopify']

export const XP_LEVELS = [
  { level: 1, name: 'Débutant', icon: '🌱', minXP: 0 },
  { level: 2, name: 'Apprenti', icon: '📘', minXP: 100 },
  { level: 3, name: 'Pratiquant', icon: '⚡', minXP: 300 },
  { level: 4, name: 'Confirmé', icon: '🔥', minXP: 600 },
  { level: 5, name: 'Expert', icon: '💎', minXP: 1000 },
  { level: 6, name: 'Maître', icon: '👑', minXP: 1500 },
  { level: 7, name: 'Légende', icon: '🏆', minXP: 2500 },
]

export const CATEGORIES = [
  { value: 'mode', label: 'Mode / Vêtements' },
  { value: 'cosmetique', label: 'Cosmétiques / Beauté' },
  { value: 'accessoire', label: 'Accessoires' },
  { value: 'electronique', label: 'Électronique' },
  { value: 'bijoux', label: 'Bijoux' },
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'sacs', label: 'Sacs' },
  { value: 'bebe', label: 'Bébé / Enfants' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'fitness', label: 'Fitness / Sport' },
]

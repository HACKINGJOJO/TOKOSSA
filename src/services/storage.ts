import { APP_CONFIG } from '@/utils/constants'

class StorageService {
  private prefix = APP_CONFIG.storagePrefix

  get<T>(key: string): T | null
  get<T>(key: string, defaultValue: T): T
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key)
      if (item) {
        return JSON.parse(item)
      }
      return defaultValue !== undefined ? defaultValue : null
    } catch {
      return defaultValue !== undefined ? defaultValue : null
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key))
  }

  // User-specific storage
  getUserKey(key: string, userId: string): string {
    return `${key}_${userId}`
  }
}

export const storage = new StorageService()
export const storageService = storage

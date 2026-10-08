/**
 * JSON values in `localStorage`. Every call is guarded, so the service is safe
 * to construct during server-side rendering and in a sandboxed browser, where
 * the storage is missing or throws.
 */
export class StorageService {
  constructor(private readonly storage: Storage | null = defaultStorage()) {}

  setItem(key: string, value: unknown): void {
    if (typeof value === 'undefined' || value === null) {
      this.removeItem(key);
      return;
    }

    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T = any>(key: string): T | null {
    try {
      const item = this.storage?.getItem(key);

      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch (e) {
      console.error('Error removing data from localStorage', e);
    }
  }

  clear(): void {
    try {
      this.storage?.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
}

function defaultStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

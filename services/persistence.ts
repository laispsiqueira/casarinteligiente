
import { db } from './db';

/**
 * PersistenceService centraliza a lógica de armazenamento local.
 * Utiliza o padrão Singleton para garantir uma única instância de controle.
 */
export class PersistenceService {
  private static instance: PersistenceService;

  private constructor() {}

  public static getInstance(): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService();
    }
    return PersistenceService.instance;
  }

  // --- Métodos de Storage Síncrono (LocalStorage) ---
  
  saveToStorage(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Erro ao salvar no storage (${key}):`, e);
    }
  }

  loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  removeFromStorage(key: string): void {
    localStorage.removeItem(key);
  }

  // --- Métodos de Banco de Dados Assíncrono (IndexedDB) ---

  async saveToDB(key: string, value: any): Promise<void> {
    return db.save(key, value);
  }

  async loadFromDB<T>(key: string): Promise<T | null> {
    return db.load<T>(key);
  }
}

export const persistence = PersistenceService.getInstance();

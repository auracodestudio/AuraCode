import type { Product, User, Order, CartItem, SiteSettings } from '@/types';

const DB_NAME = 'AuraCodeDB';
const DB_VERSION = 1;

export interface DatabaseSchema {
  products: Product;
  users: User;
  orders: Order;
  cart: { id: string; items: CartItem[]; userId: string };
  siteSettings: SiteSettings;
}

class Database {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('name', 'name', { unique: false });
        }

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('role', 'role', { unique: false });
        }

        // Orders store
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
          orderStore.createIndex('userId', 'userId', { unique: false });
          orderStore.createIndex('status', 'status', { unique: false });
        }

        // Cart store
        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id' });
          cartStore.createIndex('userId', 'userId', { unique: true });
        }

        // Site Settings store
        if (!db.objectStoreNames.contains('siteSettings')) {
          db.createObjectStore('siteSettings', { keyPath: 'id' });
        }
      };
    });

    return this.initPromise;
  }

  private async getStore(storeName: keyof DatabaseSchema, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Generic CRUD operations
  async getAll<T>(storeName: keyof DatabaseSchema): Promise<T[]> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: keyof DatabaseSchema, id: string): Promise<T | null> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as T || null);
      request.onerror = () => reject(request.error);
    });
  }

  async add<T extends { id: string }>(storeName: keyof DatabaseSchema, item: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T extends { id: string }>(storeName: keyof DatabaseSchema, item: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: keyof DatabaseSchema, id: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(storeName: keyof DatabaseSchema, indexName: string, value: string): Promise<T[]> {
    const store = await this.getStore(storeName);
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear entire store
  async clear(storeName: keyof DatabaseSchema): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Check if database is empty and needs initialization
  async isEmpty(storeName: keyof DatabaseSchema): Promise<boolean> {
    const items = await this.getAll(storeName);
    return items.length === 0;
  }
}

export const db = new Database();

import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const DB_NAME = 'MaterialCycleDB';
const DB_VERSION = 1;
const TOWER_STORE = 'towers';
const LOG_STORE = 'logs';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(TOWER_STORE)) {
      db.createObjectStore(TOWER_STORE, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(LOG_STORE)) {
      db.createObjectStore(LOG_STORE, { keyPath: 'id' });
    }
  }
});

export async function addTower(tower) {
  const db = await dbPromise;
  return db.put(TOWER_STORE, tower);
}

export async function getAllTowers() {
  const db = await dbPromise;
  return db.getAll(TOWER_STORE);
}

export async function addLog(log) {
  const db = await dbPromise;
  return db.put(LOG_STORE, log);
}

export async function getAllLogs() {
  const db = await dbPromise;
  return db.getAll(LOG_STORE);
}

export async function clearAllData() {
  const db = await dbPromise;
  await db.clear(TOWER_STORE);
  await db.clear(LOG_STORE);
}

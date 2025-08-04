// js/db.js

import { openDB } from 'idb';

export const dbPromise = openDB('MaterialCycleDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('towers')) {
      db.createObjectStore('towers', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('logs')) {
      db.createObjectStore('logs', { keyPath: 'id' });
    }
  }
});

export async function saveTower(tower) {
  const db = await dbPromise;
  return db.put('towers', tower);
}

export async function getAllTowers() {
  const db = await dbPromise;
  return db.getAll('towers');
}

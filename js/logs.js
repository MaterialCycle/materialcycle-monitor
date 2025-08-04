// js/logs.js

import { dbPromise } from './db.js';

export async function addLog(log) {
  const db = await dbPromise;
  return db.put('logs', log);
}

export async function fetchLogs() {
  const db = await dbPromise;
  return db.getAll('logs');
}

export async function fetchLogsByTower(towerId) {
  const db = await dbPromise;
  const tx = db.transaction('logs');
  const store = tx.objectStore('logs');
  const allLogs = await store.getAll();
  return allLogs.filter(log => log.towerId === towerId);
}

export async function deleteLog(id) {
  const db = await dbPromise;
  return db.delete('logs', id);
}

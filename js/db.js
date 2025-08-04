// js/db.js

// Initialize IndexedDB using idb library
const dbPromise = idb.openDB("MaterialCycleDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("towers")) {
      db.createObjectStore("towers", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("logs")) {
      db.createObjectStore("logs", { keyPath: "id" });
    }
  }
});

// Save or update a tower
export async function saveTower(tower) {
  const db = await dbPromise;
  await db.put("towers", tower);
}

// Get all towers
export async function getAllTowers() {
  const db = await dbPromise;
  return db.getAll("towers");
}

// Save or update a daily log
export async function saveLog(log) {
  const db = await dbPromise;
  await db.put("logs", log);
}


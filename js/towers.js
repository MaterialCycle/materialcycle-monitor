// js/towers.js
import { saveTower, getAllTowers } from "./db.js";

// Add a new tower with unique id and timestamp
export async function addTower(tower) {
  tower.id = "tower-" + Date.now();
  tower.createdAt = new Date().toISOString();
  await saveTower(tower);
}

// Fetch all towers from IndexedDB
export async function fetchTowers() {
  return getAllTowers();
}


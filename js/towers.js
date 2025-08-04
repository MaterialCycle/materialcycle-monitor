import { addTower, getAllTowers } from './db.js';

export async function fetchTowers() {
  return getAllTowers();
}

export async function addTowerRecord(tower) {
  return addTower(tower);
}

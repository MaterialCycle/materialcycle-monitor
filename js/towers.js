// js/towers.js
import {
  addTower,
  getAllTowers,
  deleteTower
} from './db.js';
import { hideAllViews } from './utils.js';

const towersView = document.getElementById('view-towers');
const btnTowers = document.getElementById('btn-towers');

btnTowers.addEventListener('click', () => {
  hideAllViews();
  showTowersView();
});

function showTowersView() {
  towersView.style.display = 'block';
  towersView.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Tower Setup</h2>
    <form id="towerForm" class="space-y-2">
      <input type="text" id="towerId" placeholder="Tower ID (e.g. tower-001)" class="input" required />
      <input type="text" id="towerName" placeholder="Tower Name" class="input" />
      <select id="towerType" class="input">
        <option value="plant">Plant</option>
        <option value="distillation">Distillation</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <input type="text" id="towerLocation" placeholder="Location" class="input" />
      <select id="waterSource" class="input">
        <option value="rainwater">Rainwater</option>
        <option value="tap">Tap Water</option>
        <option value="recycled">Recycled Water</option>
      </select>
      <button type="submit" class="bg-green-500 text-white px-4 py-1 rounded">Save Tower</button>
    </form>

    <h3 class="text-lg mt-4 font-semibold">All Towers</h3>
    <ul id="towerList" class="mt-2 list-disc pl-5 text-sm text-gray-800"></ul>
  `;

  document.getElementById('towerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tower = {
      id: document.getElementById('towerId').value.trim(),
      name: document.getElementById('towerName').value.trim(),
      type: document.getElementById('towerType').value,
      location: document.getElementById('towerLocation').value.trim(),
      gps: {}, // optional for now
      waterSource: document.getElementById('waterSource').value,
      createdAt: new Date().toISOString()
    };

    await addTower(tower);
    alert('Tower saved!');
    showTowersView(); // refresh
  });

  loadTowerList();
}

async function loadTowerList() {
  const towerList = document.getElementById('towerList');
  const towers = await getAllTowers();
  towerList.innerHTML = '';

  towers.forEach(tower => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${tower.id}</strong>: ${tower.name || '(no name)'} - ${tower.type} 
      <button data-id="${tower.id}" class="text-red-500 ml-2 delete-btn">🗑</button>
    `;
    towerList.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Delete this tower?')) {
        await deleteTower(btn.dataset.id);
        loadTowerList();
      }
    });
  });
}

// js/towers.js
import { addTower, getAllTowers } from './db.js';
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
    <form id="towerForm" class="space-y-2 bg-white p-4 rounded shadow">
      <input type="text" id="towerId" class="input w-full" placeholder="Tower ID (e.g. tower-001)" required />
      <input type="text" id="towerName" class="input w-full" placeholder="Tower Name (optional)" />
      <select id="towerType" class="input w-full">
        <option value="plant">Plant</option>
        <option value="distillation">Distillation</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <input type="text" id="towerLocation" class="input w-full" placeholder="Location" />
      <input type="text" id="waterSource" class="input w-full" placeholder="Water Source (default: rainwater)" value="rainwater" />
      <button type="submit" class="bg-green-600 text-white px-4 py-1 rounded">Save Tower</button>
    </form>

    <h3 class="text-lg font-semibold mt-6 mb-2">Tower List</h3>
    <ul id="towerList" class="space-y-1"></ul>
  `;

  document.getElementById('towerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('towerId').value.trim();

    if (!id) {
      alert("Tower ID is required.");
      return;
    }

    const tower = {
      id,
      name: document.getElementById('towerName').value.trim(),
      type: document.getElementById('towerType').value,
      location: document.getElementById('towerLocation').value.trim(),
      gps: {}, // future GPS integration
      waterSource: document.getElementById('waterSource').value.trim() || "rainwater",
      createdAt: new Date().toISOString()
    };

    try {
      await addTower(tower);
      alert("Tower saved!");
      showTowersView(); // re-render
    } catch (err) {
      console.error("Error saving tower:", err);
      alert("Failed to save tower. See console for details.");
    }
  });

  renderTowerList();
}

async function renderTowerList() {
  const list = document.getElementById('towerList');
  const towers = await getAllTowers();

  if (towers.length === 0) {
    list.innerHTML = '<li class="text-gray-500">No towers saved yet.</li>';
    return;
  }

  list.innerHTML = towers.map(t => `
    <li class="border p-2 rounded bg-white shadow-sm">
      <strong>${t.name || t.id}</strong> (${t.type})<br/>
      Location: ${t.location || 'n/a'}<br/>
      Water Source: ${t.waterSource || 'n/a'}
    </li>
  `).join('');
}

// js/history.js
import { getAllLogs, getAllTowers } from './db.js';
import { hideAllViews } from './utils.js';

const btnHistory = document.getElementById('btn-history');
const historyView = document.getElementById('view-history');

btnHistory.addEventListener('click', () => {
  hideAllViews();
  showLogHistory();
});

async function showLogHistory() {
  historyView.style.display = 'block';
  historyView.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Log History</h2>
    <div class="mb-2">
      <label class="block font-semibold mb-1">Filter by Tower:</label>
      <select id="filterTower" class="input w-full mb-2"></select>
    </div>
    <table class="w-full text-sm bg-white rounded shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="text-left p-2">Date</th>
          <th class="text-left p-2">Tower</th>
          <th class="text-left p-2">Water Added</th>
          <th class="text-left p-2">Biomass (g)</th>
          <th class="text-left p-2">Distilled (L)</th>
        </tr>
      </thead>
      <tbody id="logTableBody"></tbody>
    </table>
  `;

  await populateTowerFilter();
  await renderLogTable();

  document.getElementById('filterTower').addEventListener('change', renderLogTable);
}

async function populateTowerFilter() {
  const towers = await getAllTowers();
  const filter = document.getElementById('filterTower');
  filter.innerHTML = `<option value="all">All Towers</option>`;
  towers.forEach(t => {
    filter.innerHTML += `<option value="${t.id}">${t.name || t.id}</option>`;
  });
}

async function renderLogTable() {
  const logs = await getAllLogs();
  const filterValue = document.getElementById('filterTower').value;
  const tbody = document.getElementById('logTableBody');

  let filteredLogs = logs;
  if (filterValue !== 'all') {
    filteredLogs = logs.filter(l => l.towerId === filterValue);
  }

  tbody.innerHTML = filteredLogs.map(log => `
    <tr class="border-t">
      <td class="p-2">${log.date}</td>
      <td class="p-2">${log.towerId}</td>
      <td class="p-2">${log.water?.addedToday ?? '-'}</td>
      <td class="p-2">${log.biomass?.harvested ?? '-'}</td>
      <td class="p-2">${log.distillation?.distilledVolume ?? '-'}</td>
    </tr>
  `).join('');
}


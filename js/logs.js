// js/logs.js
import { addLog, getAllTowers } from './db.js';
import { hideAllViews } from './utils.js';

const logsView = document.getElementById('view-logs');
const btnLogs = document.getElementById('btn-logs');

btnLogs.addEventListener('click', () => {
  hideAllViews();
  showLogsView();
});

function showLogsView() {
  logsView.style.display = 'block';
  logsView.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Daily Log Entry</h2>
    <form id="logForm" class="space-y-2">
      <label>Select Tower:</label>
      <select id="logTowerId" class="input"></select>

      <label>Date:</label>
      <input type="date" id="logDate" class="input" required />

      <label>Sunlight Exposure:</label>
      <input type="time" id="sunStart" class="input" />
      <input type="time" id="sunEnd" class="input" />
      <select id="exposureType" class="input">
        <option value="Full Sun">Full Sun</option>
        <option value="Partial Sun">Partial Sun</option>
        <option value="Reflected">Reflected</option>
        <option value="Artificial">Artificial</option>
        <option value="No Sun">No Sun</option>
      </select>

      <div id="logFields" class="border-t pt-3"></div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-1 rounded">Save Log</button>
    </form>
  `;

  populateTowerDropdown();
  document.getElementById('logForm').addEventListener('submit', saveLogEntry);
}

async function populateTowerDropdown() {
  const towerSelect = document.getElementById('logTowerId');
  const towers = await getAllTowers();
  towerSelect.innerHTML = '';

  towers.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name || t.id} (${t.type})`;
    opt.dataset.type = t.type;
    towerSelect.appendChild(opt);
  });

  towerSelect.addEventListener('change', renderTowerSpecificFields);
  renderTowerSpecificFields(); // trigger on load
}

function renderTowerSpecificFields() {
  const selected = document.querySelector('#logTowerId option:checked');
  const type = selected?.dataset.type || 'plant';
  const fields = document.getElementById('logFields');

  let html = '';

  if (type === 'plant' || type === 'hybrid') {
    html += `
      <h3 class="font-semibold mt-2">Water Info</h3>
      <input type="number" id="waterLevel" placeholder="Water Level (L)" class="input" />
      <input type="number" id="waterAdded" placeholder="Water Added Today (L)" class="input" />
      <input type="text" id="waterSource" placeholder="Source Used (e.g. rainwater)" class="input" />
    `;
  }

  if (type === 'distillation' || type === 'hybrid') {
    html += `
      <h3 class="font-semibold mt-2">Distillation</h3>
      <input type="text" id="rawInputType" placeholder="Raw Water Type" class="input" />
      <input type="number" id="inputVolume" placeholder="Raw Input Volume (L)" class="input" />
      <input type="number" id="distilledVolume" placeholder="Distilled Water Collected (L)" class="input" />
    `;
  }

  html += `
    <h3 class="font-semibold mt-2">Biomass</h3>
    <input type="number" id="harvested" placeholder="Harvested (g)" class="input" />
    <input type="text" id="biomassType" placeholder="Plant Type (e.g. Spinach)" class="input" />
    <input type="number" id="wasteRemoved" placeholder="Waste Removed (g)" class="input" />
  `;

  fields.innerHTML = html;
}

async function saveLogEntry(e) {
  e.preventDefault();

  const towerId = document.getElementById('logTowerId').value;
  const type = document.querySelector('#logTowerId option:checked')?.dataset.type;
  const log = {
    id: 'log-' + Date.now(),
    towerId,
    date: document.getElementById('logDate').value,
    sunlight: {
      startTime: document.getElementById('sunStart').value,
      endTime: document.getElementById('sunEnd').value,
      exposureType: document.getElementById('exposureType').value
    },
    water: (type === 'plant' || type === 'hybrid') ? {
      waterLevel: parseFloat(document.getElementById('waterLevel').value || 0),
      addedToday: parseFloat(document.getElementById('waterAdded').value || 0),
      sourceUsed: document.getElementById('waterSource').value
    } : null,
    distillation: (type === 'distillation' || type === 'hybrid') ? {
      rawInputType: document.getElementById('rawInputType').value,
      inputVolume: parseFloat(document.getElementById('inputVolume').value || 0),
      distilledVolume: parseFloat(document.getElementById('distilledVolume').value || 0)
    } : null,
    biomass: {
      harvested: parseFloat(document.getElementById('harvested').value || 0),
      type: document.getElementById('biomassType').value,
      wasteRemoved: parseFloat(document.getElementById('wasteRemoved').value || 0)
    },
    timestamp: new Date().toISOString()
  };

  await addLog(log);
  alert('Log saved!');
  showLogsView(); // reset form
}

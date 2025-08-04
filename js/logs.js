import { addLog, getAllLogs } from './db.js';

export async function fetchLogs() {
  return getAllLogs();
}

export async function addLogRecord(log) {
  return addLog(log);
}

// js/logs.js
import { saveLog } from "./db.js";

// Add a new log with unique id and timestamp
export async function addLog(log) {
  log.id = "log-" + Date.now();
  log.timestamp = new Date().toISOString();
  await saveLog(log);
}


// js/utils.js

// Hides all view sections (used when navigating between Towers, Logs, Dashboard)
export function hideAllViews() {
  document.querySelectorAll('.view').forEach(view => {
    view.style.display = 'none';
  });
}


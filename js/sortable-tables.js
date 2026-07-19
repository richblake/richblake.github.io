/* Accessible sortable tables for the progress page.
   Ported from the old inline script — the arrow colour now comes
   from the stylesheet (.sort-arrow) instead of an inline style. */

function makeTableSortable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headers = table.querySelectorAll('th');

  headers.forEach((header, colIndex) => {
    header.style.cursor = 'pointer';
    header.tabIndex = 0;
    header.setAttribute('aria-sort', 'none');

    const arrow = document.createElement('span');
    arrow.textContent = ' ⇅';
    arrow.className = 'sort-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    header.appendChild(arrow);

    let asc = true;

    function sortTable() {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const cellA = a.children[colIndex].textContent.trim().toLowerCase();
        const cellB = b.children[colIndex].textContent.trim().toLowerCase();
        if (cellA < cellB) return asc ? -1 : 1;
        if (cellA > cellB) return asc ? 1 : -1;
        return 0;
      });

      rows.forEach(row => tbody.appendChild(row));

      headers.forEach(h => h.setAttribute('aria-sort', 'none'));
      header.setAttribute('aria-sort', asc ? 'ascending' : 'descending');

      arrow.textContent = asc ? ' ↑' : ' ↓';
      asc = !asc;
    }

    header.addEventListener('click', sortTable);

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sortTable();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  makeTableSortable('planned-table');
  makeTableSortable('inprogress-table');
  makeTableSortable('published-table');
});

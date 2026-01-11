---
layout: page
title: Kanban Dashboard
---

<div id="kanban-dashboard">

  <!-- Stats section -->
  <div id="kanban-stats" style="margin-bottom: 20px;">
    <h2>Stats</h2>

    {% assign planned_columns = "Ideas in the long grass,Ready to write" | split: "," %}
    {% assign inprogress_columns = "Reviewing,Writing" | split: "," %}
    {% assign published_columns = "Done" | split: "," %}
    {% assign label_map =
      "everything-else:Everything else,arthritis:Living with arthritis,teams:Leading high performing teams" | split: "," %}

    {% assign planned = "" | split: "" %}
    {% assign in_progress = "" | split: "" %}
    {% assign published = "" | split: "" %}
    {% assign all_labels = "" | split: "" %}

    {% for column in site.data.kanban_board_structured %}
      {% assign column_name = column[0] %}
      {% assign cards = column[1] %}

      {% if planned_columns contains column_name %}
        {% assign planned = planned | concat: cards %}
      {% elsif inprogress_columns contains column_name %}
        {% assign in_progress = in_progress | concat: cards %}
      {% elsif published_columns contains column_name %}
        {% assign published = published | concat: cards %}
      {% endif %}

      {% for card in cards %}
        {% if card.label %}
          {% assign mapped_label = card.label %}
          {% for map in label_map %}
            {% assign parts = map | split: ":" %}
            {% if parts[0] == card.label %}
              {% assign mapped_label = parts[1] %}
            {% endif %}
          {% endfor %}
          {% assign all_labels = all_labels | push: mapped_label %}
        {% endif %}
      {% endfor %}
    {% endfor %}

    {% assign total_cards = planned | size | plus: in_progress | size | plus: published | size %}

    <!-- Stats matching original layout -->
    <p id="top-stats">
      <span class="stat-box">Total cards: {{ total_cards }}</span>
      <span class="stat-box">Planned: {{ planned | size }}</span>
      <span class="stat-box">In Progress: {{ in_progress | size }}</span>
      <span class="stat-box">Published: {{ published | size }}</span>
    </p>

    <p id="label-stats" style="margin-top: 10px;">
      {% assign unique_labels = all_labels | uniq %}
      {% for label in unique_labels %}
        {% assign count = 0 %}
        {% for l in all_labels %}
          {% if l == label %}
            {% assign count = count | plus: 1 %}
          {% endif %}
        {% endfor %}
        <span class="stat-box">{{ label }}: {{ count }}</span>
      {% endfor %}
    </p>
  </div>

  <!-- Planned table -->
  <h2 id="planned-heading">Planned ({{ planned | size }})</h2>
  <p id="planned-desc" style="margin-bottom: 10px;">
    These are the ideas that I think are good enough to put energy into. I like the metaphor of 'things being in the long grass' as a way of describing my backlog. I've got another step in my process called 'ready to write' which is when done my research, my thinking and committed to put pen to paper. I doubt I'll write all of these, but I can talk about all of them over a brew.
  </p>

  <table id="planned-table" class="table" aria-describedby="planned-desc">
    <thead>
      <tr>
        <th scope="col">Card Name</th>
        <th scope="col">Label</th>
        <th scope="col">Progress</th>
      </tr>
    </thead>
    <tbody>
      {% for card in planned %}
        <tr>
          <td>
            <strong>{{ card.summary }}</strong>
            {% if card.description %}
              <div style="margin-top:0.2em">{{ card.description }}</div>
            {% endif %}
          </td>
          <td>{{ card.label }}</td>
          <td>{{ card.column }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

  <!-- In Progress table -->
  <h2 id="inprogress-heading">In Progress ({{ in_progress | size }})</h2>
  <p id="inprogress-desc" style="margin-bottom: 10px;">These are pages that I'm working on. Work in progress limits? What are those?!</p>

  <table id="inprogress-table" class="table" aria-describedby="inprogress-desc">
    <thead>
      <tr>
        <th scope="col">Card Name</th>
        <th scope="col">Label</th>
        <th scope="col">Progress</th>
      </tr>
    </thead>
    <tbody>
      {% for card in in_progress %}
        <tr>
          <td>
            <strong>{{ card.summary }}</strong>
            {% if card.description %}
              <div style="margin-top:0.2em">{{ card.description }}</div>
            {% endif %}
          </td>
          <td>{{ card.label }}</td>
          <td>{{ card.column }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

  <!-- Published table -->
  <h2 id="published-heading">Published ({{ published | size }})</h2>
  <p id="published-desc" style="margin-bottom: 10px;">Click the page title to go straight to the post.</p>

  <table id="published-table" class="table" aria-describedby="published-desc">
    <thead>
      <tr>
        <th scope="col">Card Name</th>
        <th scope="col">Label</th>
        <th scope="col">Progress</th>
      </tr>
    </thead>
    <tbody>
      {% for card in published %}
        <tr>
          <td>
            {% if card["blog url"] %}
              <strong><a href="{{ card["blog url"] }}">{{ card.summary }}</a></strong>
            {% else %}
              <strong>{{ card.summary }}</strong>
            {% endif %}
            {% if card.description %}
              <div style="margin-top:0.2em">{{ card.description }}</div>
            {% endif %}
          </td>
          <td>{{ card.label }}</td>
          <td>{{ card.column }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>

  <style>

    .stat-box {
      border: 1px solid {{ site.data.settings.color_settings.border_color }};
      border-radius: 4px;
      padding: 2px 6px;
      margin-right: 5px;
      display: inline-block;

  </style>

  <!-- Accessible sortable tables JS -->
  <script>
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
        arrow.style.color = '{{ site.data.settings.color_settings.overlay_text_color }}';
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

    document.addEventListener("DOMContentLoaded", function() {
      makeTableSortable('planned-table');
      makeTableSortable('inprogress-table');
      makeTableSortable('published-table');
    });
  </script>

</div>

---
layout: page
title: Kanban Dashboard
description: An open backlog of Rich Blake's writing ideas, pulled from his kanban board.
---

<div id="kanban-dashboard" class="kanban">

	<!-- Stats section -->
	<div id="kanban-stats" class="kanban__stats">
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
					{% capture mapped_label %}{% include label-name.html label=card.label map=label_map %}{% endcapture %}
					{% assign all_labels = all_labels | push: mapped_label %}
				{% endif %}
			{% endfor %}
		{% endfor %}

		{% assign total_cards = planned | size | plus: in_progress | size | plus: published | size %}

		<p id="top-stats">
			<span class="chip">Total cards: {{ total_cards }}</span>
			<span class="chip">Planned: {{ planned | size }}</span>
			<span class="chip">In Progress: {{ in_progress | size }}</span>
			<span class="chip">Published: {{ published | size }}</span>
		</p>

		<p id="label-stats">
			{% assign unique_labels = all_labels | uniq %}
			{% for label in unique_labels %}
				{% assign count = 0 %}
				{% for l in all_labels %}
					{% if l == label %}
						{% assign count = count | plus: 1 %}
					{% endif %}
				{% endfor %}
				<span class="chip">{{ label }}: {{ count }}</span>
			{% endfor %}
		</p>
	</div>

	<!-- Planned table -->
	<h2 id="planned-heading">Planned ({{ planned | size }})</h2>
	<p id="planned-desc" class="kanban__desc">
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
							<div class="kanban__card-desc">{{ card.description }}</div>
						{% endif %}
					</td>
					<td>{% include label-name.html label=card.label map=label_map %}</td>
					<td>{{ card.column }}</td>
				</tr>
			{% endfor %}
		</tbody>
	</table>

	<!-- In Progress table -->
	<h2 id="inprogress-heading">In Progress ({{ in_progress | size }})</h2>
	<p id="inprogress-desc" class="kanban__desc">These are pages that I'm working on. Work in progress limits? What are those?!</p>

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
							<div class="kanban__card-desc">{{ card.description }}</div>
						{% endif %}
					</td>
					<td>{% include label-name.html label=card.label map=label_map %}</td>
					<td>{{ card.column }}</td>
				</tr>
			{% endfor %}
		</tbody>
	</table>

	<!-- Published table -->
	<h2 id="published-heading">Published ({{ published | size }})</h2>
	<p id="published-desc" class="kanban__desc">Click the page title to go straight to the post.</p>

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
				{% assign post_url = card.blog_url | default: card["blog url"] %}
				<tr>
					<td>
						{% if post_url %}
							<strong><a href="{{ post_url }}">{{ card.summary }}</a></strong>
						{% else %}
							<strong>{{ card.summary }}</strong>
						{% endif %}
						{% if card.description %}
							<div class="kanban__card-desc">{{ card.description }}</div>
						{% endif %}
					</td>
					<td>{% include label-name.html label=card.label map=label_map %}</td>
					<td>{{ card.column }}</td>
				</tr>
			{% endfor %}
		</tbody>
	</table>

</div>

<!-- Accessible sortable tables (progress page only) -->
<script src="/js/sortable-tables.js" defer></script>

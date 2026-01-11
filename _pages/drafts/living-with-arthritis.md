---
layout: project
title: Living with Arthritis
description: Blog posts about living with arthritis
featured_image: /images/social.jpg
per_page: 5
tags_to_include: ["arthritis","chronic-pain"]
published: false
---

This is a home for my thoughts about living with arthritis.

I explore the challenges and small victories as I test the limits of my physical and mental health.

I have more than one type of arthritis, affecting joints from my ankles to my knees. It is most noticeable in the winter, but it is with me all year.

Day to day, it affects my mobility and normal routines. Simple things like getting out, using public transport, or focusing on work can be hard. Severe pain attacks can last a week or more.

I write here to help me learn, grow, and adapt. To live the best life I can.

My ambition is greater than my ability to beat the curse of writer's block, so I've put a backlog of my ideas up on my [open backlog progress page](/progress.html). Feel free to browse what I'm interested in and let me know if anything stands out to you. 

{% assign filtered_posts = "" | split: "" %}
{% for post in site.posts %}
  {% for tag in page.tags_to_include %}
    {% if post.tags contains tag %}
      {% assign filtered_posts = filtered_posts | push: post %}
      {% break %}
    {% endif %}
  {% endfor %}
{% endfor %}

{% assign posts_per_page = page.per_page | default: 5 %}
{% assign page_num = 1 %}
{% assign total_pages = filtered_posts | size | divided_by: posts_per_page | ceil %}
{% assign start_index = posts_per_page | times: page_num | minus: posts_per_page %}
{% assign paginated_posts = filtered_posts | slice: start_index, posts_per_page %}

<section class="listing single">
  <div class="wrap">
    {% for post in paginated_posts %}
      <article class="listing-post">
        <div class="listing-post__header">
          <h2 class="listing-post__title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <p class="listing-post__subtitle">{{ post.date | date_to_long_string }}</p>
        </div>

        {% if post.featured_image %}
        <a href="{{ post.url | relative_url }}" class="listing-post__image" style="background-image: url({{ post.featured_image | relative_url }});"></a>
        {% endif %}

        <div class="listing-post__content">
          {{ post.excerpt | markdownify }}
          <p><a href="{{ post.url | relative_url }}" class="button">Read More</a></p>
        </div>
      </article>
    {% endfor %}

    {% if total_pages > 1 %}
      <section class="pagination">
        {% if page_num > 1 %}
          <div class="pagination__prev">
            <a href="{{ page.url }}?page_num={{ page_num | minus: 1 }}" class="button button--large">
              <i class="fa fa-angle-left" aria-hidden="true"></i> <span>Newer Posts</span>
            </a>
          </div>
        {% endif %}
        {% if page_num < total_pages %}
          <div class="pagination__next">
            <a href="{{ page.url }}?page_num={{ page_num | plus: 1 }}" class="button button--large">
              <span>Older Posts</span> <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        {% endif %}
      </section>
    {% endif %}

  </div>
</section>

/**
 * Renders event cards for the current category from events-data.json.
 * Expects a section with data-category="<slug>" containing #event-category-list.
 * Events are shown newest-first; single image = feature image, multiple = gallery grid.
 */
(function () {
  const listEl = document.getElementById('event-category-list');
  if (!listEl) return;

  const section = listEl.closest('section');
  const category = section && section.getAttribute('data-category');
  if (!category) return;

  fetch('events-data.json')
    .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('Failed to load events')); })
    .then(function (data) {
      const events = Array.isArray(data[category]) ? data[category] : [];
      listEl.innerHTML = '';

      if (events.length === 0) {
        listEl.innerHTML = '<p class="event-category-empty">No events in this category yet. Add Markdown files in the corresponding folder under <code>events-content/</code> and run <code>node build-events.js</code>.</p>';
        return;
      }

      var lightboxUrls = [];
      var lightboxIdx = 0;
      var overlay = document.createElement('div');
      overlay.className = 'event-lightbox-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      var content = document.createElement('div');
      content.className = 'event-lightbox-content';
      var imgEl = document.createElement('img');
      imgEl.className = 'event-lightbox-image';
      imgEl.alt = '';
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'event-lightbox-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close');
      var prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'event-lightbox-prev';
      prevBtn.innerHTML = '&#9664;';
      prevBtn.setAttribute('aria-label', 'Previous image');
      var nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'event-lightbox-next';
      nextBtn.innerHTML = '&#9654;';
      nextBtn.setAttribute('aria-label', 'Next image');
      content.appendChild(prevBtn);
      content.appendChild(imgEl);
      content.appendChild(nextBtn);
      overlay.appendChild(content);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      function showLightbox(idx, urls) {
        lightboxUrls = urls;
        lightboxIdx = idx;
        imgEl.src = urls[idx];
        overlay.classList.add('event-lightbox-open');
        overlay.setAttribute('aria-hidden', 'false');
        prevBtn.style.display = urls.length > 1 && idx > 0 ? '' : 'none';
        nextBtn.style.display = urls.length > 1 && idx < urls.length - 1 ? '' : 'none';
      }
      function hideLightbox() {
        overlay.classList.remove('event-lightbox-open');
        overlay.setAttribute('aria-hidden', 'true');
      }
      closeBtn.addEventListener('click', hideLightbox);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) hideLightbox();
      });
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (lightboxIdx > 0) showLightbox(lightboxIdx - 1, lightboxUrls);
      });
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (lightboxIdx < lightboxUrls.length - 1) showLightbox(lightboxIdx + 1, lightboxUrls);
      });
      content.addEventListener('click', function (e) { e.stopPropagation(); });
      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('event-lightbox-open')) return;
        if (e.key === 'Escape') { hideLightbox(); e.preventDefault(); }
        if (e.key === 'ArrowLeft' && lightboxIdx > 0) { showLightbox(lightboxIdx - 1, lightboxUrls); e.preventDefault(); }
        if (e.key === 'ArrowRight' && lightboxIdx < lightboxUrls.length - 1) { showLightbox(lightboxIdx + 1, lightboxUrls); e.preventDefault(); }
      });

      events.forEach(function (event) {
        const card = document.createElement('article');
        card.className = 'event-card';

        const name = document.createElement('h3');
        name.className = 'event-card-name';
        name.textContent = event.name || 'Untitled event';
        card.appendChild(name);

        if (event.date) {
          const dateEl = document.createElement('p');
          dateEl.className = 'event-card-date';
          dateEl.textContent = formatDate(event.date);
          card.appendChild(dateEl);
        }

        if (event.summary) {
          const summary = document.createElement('p');
          summary.className = 'event-card-summary';
          summary.textContent = event.summary;
          card.appendChild(summary);
        }

        const images = Array.isArray(event.images) ? event.images : (event.images ? [event.images] : []);
        if (images.length > 0) {
          const media = document.createElement('div');
          media.className = 'event-card-media';
          if (images.length === 1) {
            media.classList.add('event-card-media--single');
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'event-card-image-link';
            link.title = 'View full size';
            link.setAttribute('role', 'button');
            const img = document.createElement('img');
            img.src = images[0];
            img.alt = event.name || 'Event photo';
            img.loading = 'lazy';
            link.appendChild(img);
            link.addEventListener('click', function (e) {
              e.preventDefault();
              showLightbox(0, images);
            });
            media.appendChild(link);
          } else {
            media.classList.add('event-card-gallery');
            images.forEach(function (src, i) {
              const link = document.createElement('a');
              link.href = '#';
              link.className = 'event-card-image-link';
              link.title = 'View full size';
              link.setAttribute('role', 'button');
              const img = document.createElement('img');
              img.src = src;
              img.alt = '';
              img.loading = 'lazy';
              link.appendChild(img);
              link.addEventListener('click', function (e) {
                e.preventDefault();
                showLightbox(i, images);
              });
              media.appendChild(link);
            });
          }
          card.appendChild(media);
        }

        listEl.appendChild(card);
      });
    })
    .catch(function () {
      listEl.innerHTML = '<p class="event-category-empty">Unable to load events. Make sure <code>events-data.json</code> exists (run <code>node build-events.js</code>).</p>';
    });

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
})();

/**
 * Competition Team: load competition-team.json and render flip cards (same format as Officer Team).
 * Front: image, name, role; back: quote, contact. Uses officer-card classes for identical styling.
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  var FRONT_IMAGES = [
    'images/front-images/plane.png',
    'images/front-images/rocket_launch.png',
    'images/front-images/satellite_in_space.png',
    'images/front-images/three_planes.png',
    'images/front-images/rocket_tafe_off_docked.png',
    'images/front-images/parachute_payload2.png',
    'images/front-images/plane_comm_tower.png',
    'images/front-images/ground_station_satellite.png',
    'images/front-images/rocjet_in_space.png',
    'images/front-images/rocket_flying.png'
  ];

  function renderCard(o, index) {
    var card = document.createElement('div');
    card.className = 'officer-card';
    card.setAttribute('data-name', o.name);

    var inner = document.createElement('div');
    inner.className = 'officer-card-inner';

    var front = document.createElement('div');
    front.className = 'officer-card-front';
    front.innerHTML =
      '<div class="officer-card-photo-wrap">' +
        '<img src="' + escapeHtml(o.image) + '" alt="" class="officer-card-photo" loading="lazy">' +
        '<div class="officer-card-photo-shine" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="officer-card-meta">' +
        '<h3 class="officer-card-name">' + escapeHtml(o.name) + '</h3>' +
        '<p class="officer-card-role">' + escapeHtml(o.role) + '</p>' +
      '</div>';

    var back = document.createElement('div');
    back.className = 'officer-card-back';
    var linkHtml = '';
    if (o.linkedin) {
      linkHtml += '<a href="' + escapeHtml(o.linkedin) + '" target="_blank" rel="noopener noreferrer" class="officer-link officer-link-linkedin" aria-label="LinkedIn">' +
        '<svg class="officer-link-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0.003z"/></svg>' +
        '<span>LinkedIn</span></a>';
    }
    if (o.email) {
      linkHtml += '<a href="mailto:' + escapeHtml(o.email) + '" class="officer-link officer-link-email" aria-label="Email">' +
        '<svg class="officer-link-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
        '<span>Email</span></a>';
    }
    var backImg = FRONT_IMAGES[index % FRONT_IMAGES.length];
    back.innerHTML =
      '<div class="officer-card-back-header">' +
        '<h3 class="officer-card-back-name">' + escapeHtml(o.name) + '</h3>' +
        '<p class="officer-card-back-role">' + escapeHtml(o.role) + '</p>' +
      '</div>' +
      '<img src="' + escapeHtml(backImg) + '" alt="" class="officer-card-back-image" aria-hidden="true">' +
      '<div class="officer-card-back-footer">' +
        '<blockquote class="officer-card-quote-wrap">' +
          '<p class="officer-card-quote">' + escapeHtml(o.quote) + '</p>' +
        '</blockquote>' +
        '<div class="officer-card-links">' + linkHtml + '</div>' +
      '</div>';

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    return card;
  }

  function init() {
    var container = document.getElementById('competition-cards');
    if (!container) return;

    function onLoad(members) {
      container.innerHTML = '';
      for (var i = 0; i < members.length; i++) {
        container.appendChild(renderCard(members[i], i));
      }
    }

    function onError() {
      container.innerHTML = '<p class="officer-cards-error">Unable to load competition team profiles. Try again later.</p>';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'competition-team.json?v=' + Date.now());
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response && Array.isArray(xhr.response)) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    };
    xhr.onerror = onError;
    xhr.send();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

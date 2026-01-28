/**
 * Join page: fireworks/particle burst when the Discord button is clicked (red, orange, yellow).
 * Reuses the same particle animation as the Contact page (contact-particle-burst, contactParticleBurst).
 */
(function () {
  'use strict';

  var PARTICLE_COLORS = ['#e53935', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b'];
  var PARTICLE_COUNT = 18;
  var BURST_MS = 520;
  var NAV_DELAY_MS = 480;

  function burstParticles(btn, x, y) {
    var container = document.createElement('div');
    container.className = 'contact-particle-burst';
    container.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(container);

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'contact-particle';
      var color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      var angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
      var dist = 40 + Math.random() * 50;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist;
      p.style.cssText =
        'position:absolute;left:' + x + 'px;top:' + y + 'px;width:6px;height:6px;border-radius:50%;' +
        'background:' + color + ';box-shadow:0 0 6px ' + color + ';' +
        'transform:translate(-50%,-50%);' +
        'animation:contactParticleBurst ' + (BURST_MS / 1000) + 's ease-out forwards;' +
        '--dx:' + dx + 'px;--dy:' + dy + 'px;';
      container.appendChild(p);
    }

    setTimeout(function () {
      container.remove();
    }, BURST_MS + 50);
  }

  function init() {
    var btn = document.querySelector('.join-discord-cta');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      var href = btn.getAttribute('href');
      var rect = btn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      e.preventDefault();
      burstParticles(btn, x, y);

      setTimeout(function () {
        window.open(href, '_blank', 'noopener,noreferrer');
      }, NAV_DELAY_MS);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

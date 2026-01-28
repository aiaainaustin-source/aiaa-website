/**
 * Contact page: flow image parallax + particle burst on click.
 */
(function () {
  'use strict';

  var PARTICLE_COLORS = ['#e53935', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b'];
  var PARTICLE_COUNT = 18;
  var BURST_MS = 520;
  var NAV_DELAY_MS = 480;

  function init() {
    var section = document.getElementById('contact-section');
    if (!section) return;

    var flowImages = section.querySelectorAll('.flow-image[data-speed]');
    var cards = section.querySelectorAll('.contact-card');
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY || window.pageYOffset;
      var vh = window.innerHeight * 0.5;
      for (var i = 0; i < flowImages.length; i++) {
        var img = flowImages[i];
        var speed = parseFloat(img.getAttribute('data-speed')) || 0.5;
        var rect = img.getBoundingClientRect();
        var top = rect.top + scrollY;
        var offset = (scrollY - top + vh) * (1 - speed) * 0.5;
        img.style.transform = 'translateY(' + Math.round(offset) + 'px)';
      }
      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }

    if (flowImages.length) {
      window.addEventListener('scroll', requestTick, { passive: true });
      window.addEventListener('resize', requestTick);
      updateParallax();
    }

    function burstParticles(card, x, y) {
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

    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function (e) {
        var link = this;
        var href = link.getAttribute('href');
        var target = link.getAttribute('target');
        var rect = link.getBoundingClientRect();
        var x = rect.left + rect.width / 2;
        var y = rect.top + rect.height / 2;

        e.preventDefault();
        burstParticles(link, x, y);

        setTimeout(function () {
          if (target === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        }, NAV_DELAY_MS);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

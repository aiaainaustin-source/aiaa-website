/**
 * About page: parallax on front/flow images only (aerospace layers on the sides).
 * Pillar section images (about_us) stay static.
 */
(function () {
  'use strict';

  function init() {
    var flowImages = document.querySelectorAll('.flow-image[data-speed]');
    if (!flowImages.length) return;

    var ticking = false;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      var vh = window.innerHeight * 0.5;
      var i, img, speed, rect, blockTop, offset;
      for (i = 0; i < flowImages.length; i++) {
        img = flowImages[i];
        speed = parseFloat(img.getAttribute('data-speed')) || 0.5;
        rect = img.getBoundingClientRect();
        blockTop = rect.top + scrollY;
        offset = (scrollY - blockTop + vh) * (1 - speed) * 0.2;
        img.style.transform = 'translateY(' + Math.round(offset) + 'px)';
      }
      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

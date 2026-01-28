/**
 * Generic flow image parallax — runs on any page that has .flow-image[data-speed].
 * Used on Bylaws; Contact uses contact-effects.js for its flow parallax.
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

/**
 * Get Involved: ~200 blue/orange particles that move away from the mouse.
 */
(function () {
  'use strict';

  var NUM_DOTS = 200;
  var ORANGE_DARK = '#bf5700';
  var ORANGE_LIGHT = '#f8971f';
  var MOUSE_RADIUS = 90;
  var MAX_PUSH = 28;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function init() {
    var section = document.getElementById('get-involved');
    var container = document.getElementById('get-involved-dots');
    if (!section || !container) return;

    for (var i = 0; i < NUM_DOTS; i++) {
      var dot = document.createElement('span');
      dot.className = 'get-involved-dot';
      dot.setAttribute('aria-hidden', 'true');
      dot.style.left = randomInt(1, 98) + '%';
      dot.style.top = randomInt(2, 96) + '%';
      dot.style.background = Math.random() < 0.5 ? ORANGE_DARK : ORANGE_LIGHT;
      dot.style.width = randomInt(4, 10) + 'px';
      dot.style.height = dot.style.width;
      container.appendChild(dot);
    }

    container.style.pointerEvents = 'none';

    var mouseX = -1e5;
    var mouseY = -1e5;
    var mouseIn = false;
    var rafId = null;

    function update() {
      var dots = container.querySelectorAll('.get-involved-dot');
      var i, dot, r, dx, dy, d, strength;
      for (i = 0; i < dots.length; i++) {
        dot = dots[i];
        r = dot.getBoundingClientRect();
        dx = (r.left + r.width / 2) - mouseX;
        dy = (r.top + r.height / 2) - mouseY;
        d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < MOUSE_RADIUS && mouseIn) {
          strength = (1 - d / MOUSE_RADIUS) * (1 - d / MOUSE_RADIUS) * MAX_PUSH;
          dx = (dx / d) * strength;
          dy = (dy / d) * strength;
        } else {
          dx = 0;
          dy = 0;
        }
        dot.style.setProperty('--push-x', dx + 'px');
        dot.style.setProperty('--push-y', dy + 'px');
      }
      if (mouseIn) rafId = requestAnimationFrame(update);
      else rafId = null;
    }

    section.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    section.addEventListener('mouseenter', function (e) {
      mouseIn = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (rafId == null) update();
    });
    section.addEventListener('mouseleave', function () {
      mouseIn = false;
      mouseX = -1e5;
      mouseY = -1e5;
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      var dots = container.querySelectorAll('.get-involved-dot');
      for (var i = 0; i < dots.length; i++) {
        dots[i].style.setProperty('--push-x', '0px');
        dots[i].style.setProperty('--push-y', '0px');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

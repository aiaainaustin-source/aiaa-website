/**
 * Who We Are: scroll-driven plane following a path with waypoint dots.
 * Plane asset is nose-up; NOSE_UP_OFFSET aligns "up" (negative dy) with the asset.
 */
(function () {
  'use strict';

  var PATH = (function () {
    var out = [];
    var x, y, t, i, n = 150;
    var waveEnd = 0.28;
    var loopEnd = 0.58;
    var yBase = 50;
    var waveAmp = 14;
    for (i = 0; i <= n; i++) {
      t = i / n;
      if (t < waveEnd) {
        x = 8 + (46 - 8) * (t / waveEnd);
        y = yBase + waveAmp * Math.sin(t / waveEnd * Math.PI * 2);
      } else if (t <= loopEnd) {
        var s = ((t - waveEnd) / (loopEnd - waveEnd)) * Math.PI * 2;
        x = 46 + 6 * Math.sin(s);
        y = yBase + 22 * (1 - Math.cos(s));
      } else {
        var u = (t - loopEnd) / (1 - loopEnd);
        x = 46 + (96 - 46) * u;
        y = yBase + waveAmp * Math.sin(u * Math.PI * 2.5);
      }
      out.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
    return out;
  })();

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function pathPosition(path, t) {
    var n = path.length;
    if (t <= 0) return { x: path[0].x, y: path[0].y, angle: angleBetween(path[0], path[1]) };
    if (t >= 1) return { x: path[n - 1].x, y: path[n - 1].y, angle: angleBetween(path[n - 2], path[n - 1]) };
    var seg = (n - 1) * t;
    var i = Math.floor(seg);
    var j = Math.min(i + 1, n - 1);
    var u = seg - i;
    return {
      x: lerp(path[i].x, path[j].x, u),
      y: lerp(path[i].y, path[j].y, u),
      angle: angleBetween(path[i], path[j])
    };
  }

  var NOSE_UP_OFFSET_DEG = 90;

  function angleBetween(p, q) {
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    return Math.atan2(dy, dx) * (180 / Math.PI) + NOSE_UP_OFFSET_DEG;
  }

  function init() {
    var section = document.getElementById('who-we-are');
    var dotsEl = document.getElementById('who-path-dots');
    var planeWrap = document.getElementById('who-plane-wrap');
    if (!section || !dotsEl || !planeWrap) return;

    var dotStep = 2;
    for (var d = 0; d < PATH.length; d += dotStep) {
      var p = PATH[d];
      var dot = document.createElement('span');
      dot.className = 'who-path-dot';
      dot.style.left = p.x + '%';
      dot.style.top = p.y + '%';
      dotsEl.appendChild(dot);
    }

    function update(progress) {
      progress = Math.max(0, Math.min(1, progress));
      var pos = pathPosition(PATH, progress);
      planeWrap.style.left = pos.x + '%';
      planeWrap.style.top = pos.y + '%';
      planeWrap.style.transform = 'translate(-50%, -50%) rotate(' + pos.angle + 'deg)';
    }

    function onScroll() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var startY = vh * 0.5;
      var endY = -rect.height * 0.2;
      var prog = (startY - rect.top) / (startY - endY);
      update(prog);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

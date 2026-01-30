/**
 * Who We Are: scroll-driven plane following a path with waypoint dots.
 * Plane asset is nose-up; NOSE_UP_OFFSET aligns "up" (negative dy) with the asset.
 */
(function () {
  'use strict';

  var Y_BASE_PATH = 40; /* path a bit lower so loop sits above it */
  var PATH = (function () {
    var out = [];
    var x, y, t, i, n = 75;
    var waveEnd = 0.28;
    var loopEnd = 0.58;
    var waveAmp = 8;
    for (i = 0; i <= n; i++) {
      t = i / n;
      if (t < waveEnd) {
        x = 8 + (46 - 8) * (t / waveEnd);
        y = Y_BASE_PATH + waveAmp * Math.sin(t / waveEnd * Math.PI * 2);
      } else if (t <= loopEnd) {
        var s = ((t - waveEnd) / (loopEnd - waveEnd)) * Math.PI * 2;
        var xloopRadius = 7; /* same radius in x and y = circular loop */
        var yloopRadius = 18;
        x = 46 + xloopRadius * Math.sin(s);
        y = Y_BASE_PATH - yloopRadius * (1 - Math.cos(s));
      } else {
        var u = (t - loopEnd) / (1 - loopEnd);
        x = 46 + (96 - 46) * u;
        y = Y_BASE_PATH + waveAmp * Math.sin(u * Math.PI * 2.5);
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

  /* Plane image default is nose straight up (0deg); +90 aligns path direction to rotation */
  var NOSE_OFFSET_DEG = 90;

  function angleBetween(p, q) {
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    return Math.atan2(dy, dx) * (180 / Math.PI) + NOSE_OFFSET_DEG;
  }

  var REF_HEIGHT = 600;
  var Y_BASE = 22;

  function init() {
    var section = document.getElementById('who-we-are');
    var dotsEl = document.getElementById('who-path-dots');
    var planeWrap = document.getElementById('who-plane-wrap');
    if (!section || !dotsEl || !planeWrap) return;

    var dotStep = 2;
    var dotElements = [];
    for (var d = 0; d < PATH.length; d += dotStep) {
      var p = PATH[d];
      var dot = document.createElement('span');
      dot.className = 'who-path-dot';
      dot.style.left = p.x + '%';
      dot.style.top = p.y + '%';
      dotsEl.appendChild(dot);
      dotElements.push({ el: dot, x: p.x, y: p.y });
    }

    var lastProgress = -1;

    function scaleY(y, sectionHeight) {
      var scale = typeof sectionHeight === 'number' && sectionHeight > 0
        ? Math.min(1.2, Math.max(0.4, sectionHeight / REF_HEIGHT))
        : 1;
      return Y_BASE + (y - Y_BASE) * scale;
    }

    function update(progress, sectionHeight) {
      progress = Math.max(0, Math.min(1, progress));
      var pos = pathPosition(PATH, progress);
      var scaledY = scaleY(pos.y, sectionHeight);
      /* When scrolling up (progress decreasing), plane moves backward: flip 180 so nose faces direction of travel */
      var scrollDown = lastProgress < 0 || progress >= lastProgress;
      lastProgress = progress;
      var angle = scrollDown ? pos.angle : pos.angle + 180;
      planeWrap.style.left = pos.x + '%';
      planeWrap.style.top = scaledY + '%';
      planeWrap.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';
      var i;
      for (i = 0; i < dotElements.length; i++) {
        dotElements[i].el.style.left = dotElements[i].x + '%';
        dotElements[i].el.style.top = scaleY(dotElements[i].y, sectionHeight) + '%';
      }
    }

    function onScroll() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var sectionHeight = rect.height;
      var startY = vh * 0.5;
      var endY = -rect.height * 0.2;
      var prog = (startY - rect.top) / (startY - endY);
      update(prog, sectionHeight);
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

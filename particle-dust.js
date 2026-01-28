/**
 * Canvas-based orange dust particles that push away from the mouse.
 * Similar to Projects page: velocity, damping, wrap-around, mouse repulsion.
 * Runs on pages with .bylaws-section or .event-category-section.
 * Renders above the section background but underneath text and event cards.
 */
(function () {
  'use strict';

  var section = document.querySelector('.bylaws-section, .event-category-section');
  if (!section) return;

  var wrapper = document.createElement('div');
  wrapper.className = 'particle-dust-overlay';
  wrapper.setAttribute('aria-hidden', 'true');
  var canvas = document.createElement('canvas');
  canvas.id = 'particle-dust-canvas';
  wrapper.appendChild(canvas);
  section.insertBefore(wrapper, section.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = -1000;
  var mouseY = -1000;

  var PARTICLE_COUNT = 400;
  var REPEL_RADIUS = 150;
  var REPEL_STRENGTH = 0.3;
  var DAMPING = 0.98;

  // UT Austin orange shades (rgb)
  var ORANGE_COLORS = [
    { r: 191, g: 87, b: 0 },   // burnt orange #bf5700
    { r: 248, g: 151, b: 31 }, // #f8971f
    { r: 139, g: 61, b: 0 },   // #8b3d00
    { r: 214, g: 115, b: 0 },  // #d67300
    { r: 166, g: 74, b: 0 },   // #a34a00
    { r: 194, g: 97, b: 0 },   // #c26100
    { r: 255, g: 169, b: 0 },  // #ffa940
    { r: 153, g: 66, b: 0 },   // #994200
  ];

  function resize() {
    var w = section.offsetWidth;
    var h = section.offsetHeight;
    if (w < 10 || h < 10) return;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  function createParticles() {
    particles = [];
    var w = canvas.width;
    var h = canvas.height;
    if (w < 10 || h < 10) return;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var c = ORANGE_COLORS[Math.floor(Math.random() * ORANGE_COLORS.length)];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: c
      });
    }
  }

  function update(p) {
    var dx = mouseX - p.x;
    var dy = mouseY - p.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < REPEL_RADIUS && distance > 1) {
      var force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
      var angle = Math.atan2(dy, dx);
      p.vx -= Math.cos(angle) * force * REPEL_STRENGTH;
      p.vy -= Math.sin(angle) * force * REPEL_STRENGTH;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= DAMPING;
    p.vy *= DAMPING;

    var w = canvas.width;
    var h = canvas.height;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
  }

  function draw(p) {
    ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + p.opacity + ')';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop() {
    var w = canvas.width;
    var h = canvas.height;
    if (w > 0 && h > 0) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        update(particles[i]);
        draw(particles[i]);
      }
    }
    requestAnimationFrame(loop);
  }

  function getMouseInSection(e) {
    var rect = section.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }
  function clearMouse() {
    mouseX = -1000;
    mouseY = -1000;
  }

  function fitAndCreate() {
    resize();
    createParticles();
  }

  fitAndCreate();

  section.addEventListener('mousemove', getMouseInSection, { passive: true });
  section.addEventListener('mouseleave', clearMouse, { passive: true });
  window.addEventListener('resize', fitAndCreate);

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      fitAndCreate();
    });
    ro.observe(section);
  }

  setTimeout(fitAndCreate, 800);

  loop();
})();

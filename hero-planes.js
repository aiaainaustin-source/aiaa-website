/**
 * Hero planes: continuous spawn, remove on exit or click.
 *
 * Planes spawn every spawnIntervalMin–spawnIntervalMax ms with randomized
 * position, speed, direction, banner text, and plane image.
 * A plane is removed when its animation finishes (it has left the screen)
 * or when the user clicks it (pop, then remove).
 */
(function () {
  'use strict';

  var PLANE_CONFIG = {
    spawnIntervalMinMs: 1000,
    spawnIntervalMaxMs: 3000,
    topMin: 4,
    topMax: 78,
    durationMin: 24,
    durationMax: 48,
    bannerTexts: [ /* 88 unique banner texts */
      'UT Austin AIAA: Inspiring Aerospace Innovators!',
      'Join Our Mission to Fly Higher',
      'Engineering Students Taking Flight',
      'Competitions, Networking, Volunteering',
      'AIAA at UT Austin: Where Aerospace Meets Action',
      'From Rockets to Drones, We Do It All',
      'Launching Future Aerospace Leaders',
      'Learn, Build, Fly, Repeat',
      'Powered by Passion, Driven by Aerospace',
      'Want to Fly With Us? Join Today!',
      'Volunteer. Compete. Network.',
      'Your Aerospace Adventure Starts Here',
      'Looking for Engineers & Dreamers',
      'Become Part of Our Flight Crew',
      'Meet New People Who Love Aerospace',
      'No Experience Needed, Just Passion',
      'Join Our Next Competition Team',
      'Help Build the Next Big Project',
      'Take Your Skills to the Skies',
      'Design. Build. Compete.',
      'Pushing Aerospace Limits',
      'See Our Projects in Action',
      'Innovation Takes Flight',
      'Competition Ready, Always',
      'Engineering Students in the Sky',
      'Volunteer With AIAA at UT Austin',
      'Teach, Inspire, Fly',
      'STEM Outreach Opportunities',
      'Help Build the Next Generation of Engineers',
      'Community Matters, Aerospace Matters',
      'The Sky\'s Not the Limit',
      'We\'re Totally Cleared for Takeoff',
      'Wing It With Us!',
      'Airborne Engineers in Action',
      'Propelling Futures, One Flight at a Time',
      'Lift Off Your Semester',
      'Flight Mode: Engaged',
      'Altimeter Set to Success',
      'The Wright brothers\' first flight in 1903 lasted just 12 seconds.',
      'Concorde could fly from New York to London in just 3.5 hours.',
      'The world\'s fastest aircraft, the SR-71 Blackbird, flew at over Mach 3.',
      'Commercial airliners cruise at about 35,000 feet.',
      'The largest passenger airplane ever built is the Airbus A380.',
      'NASA\'s X-15 still holds the record for highest speed in a manned aircraft.',
      'The first woman in space was Valentina Tereshkova in 1963.',
      'Drones are now widely used in aerospace testing and design.',
      'Modern jet engines produce more thrust than a 747\'s entire weight.',
      'The Boeing 747 has over 6 million parts.',
      'Lift is generated when air moves faster over the top of a wing than underneath.',
      'Winglets reduce drag and improve fuel efficiency on planes.',
      'Supersonic flight produces a sonic boom due to shock waves.',
      'A plane\'s black box is actually bright orange for visibility.',
      'Birds inspired the first airplane wing designs.',
      'Airplanes are designed to be aerodynamically stable at high speeds.',
      'The angle of attack is critical for takeoff and landing.',
      'The fastest turn in a jet is limited by g-force tolerance.',
      'Hot air rises—basic principle used in balloon flight.',
      'Even a small crosswind can change takeoff and landing dynamics.',
      'The Saturn V rocket could carry 140,000 kg to low Earth orbit.',
      'Apollo 11 astronauts traveled 240,000 miles to reach the Moon.',
      'Rockets move upward by expelling gas downward—Newton\'s 3rd law.',
      'A rocket engine works in the vacuum of space without air.',
      'Some small satellites now use 3D-printed thrusters.',
      'The Hubble Telescope orbits Earth at about 17,000 mph.',
      'Gravity on Mars is only 38% of Earth\'s gravity.',
      'Spacecraft need orbital velocity to stay in orbit (~17,500 mph).',
      'Ion thrusters provide small but efficient propulsion for deep-space missions.',
      'The International Space Station has been continuously inhabited since 2000.',
      'The first jet engine was developed by Frank Whittle in 1937.',
      'Amelia Earhart was the first woman to fly solo across the Atlantic in 1932.',
      'The first supersonic passenger flight was in 1976 with Concorde.',
      'The Blackbird SR-71 could outrun missiles in flight.',
      'SpaceX\'s Falcon 9 is the first reusable orbital-class rocket.',
      'The term "aeronautics" comes from the Greek words "air" and "navigation."',
      'The AIAA was founded in 1932 to advance aerospace engineering.',
      'Satellites orbiting Earth experience microgravity.',
      'The Hindenburg was the largest airship ever built.',
      'Flight simulators have been used since the 1920s for pilot training.',
      'Paper airplanes have been used to teach aerodynamics for decades.',
      'Wing shapes are often inspired by birds, bats, and even fish.',
      'Airplanes sometimes "skid" during takeoff in high winds.',
      'Drones can be flown indoors for engineering tests.',
      'The speed of sound varies with temperature.',
      'Gliders can stay in the air using rising warm air currents.',
      'Modern airliners use fly-by-wire systems instead of manual controls.',
      'The space shuttle could glide back to Earth like a plane.',
      'Some rockets use water as a propellant in student competitions.',
      'The largest model rocket ever launched reached over 4,000 feet.'
    ],
    planeImages: [
      'images/planes/plane1.png',
      'images/planes/plane2.png',
      'images/planes/plane3.png',
      'images/planes/plane4.png',
      'images/planes/plane5.png'
    ],
    popDurationMs: 600,
    respawnDelayMs: 2800
  };
  var planeTier = 1;
  var reached_gold = false;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(array) {
    return array[randomInt(0, array.length - 1)];
  }

  function getTierFromTrack(track) {
    var banner = track && track.querySelector('.plane-banner');
    if (!banner) return 1;
    if (banner.classList.contains('plane-banner--gold')) return 4;
    if (banner.classList.contains('plane-banner--silver')) return 3;
    if (banner.classList.contains('plane-banner--bronze')) return 2;
    return 1;
  }

  var REACHED_GOLD_KEY = 'aiaa_reached_gold';

  function updateHeroTierColor(tier) {
    if (sessionStorage.getItem(REACHED_GOLD_KEY)) tier = 4;
    var hero = document.querySelector('.hero');
    if (hero) hero.setAttribute('data-plane-tier', String(tier));
  }

  function initHeroPlanes() {
    var layer = document.querySelector('.hero-planes-layer');
    if (!layer) return;

    var cfg = PLANE_CONFIG;
    updateHeroTierColor(planeTier);

    layer.addEventListener('click', function (e) {
      var track = e.target.closest('.hero-plane-track');
      if (!track || track.classList.contains('popped')) return;
      track.classList.add('popped');
      var clickedTier = getTierFromTrack(track);
      if (clickedTier === 1 && sessionStorage.getItem(REACHED_GOLD_KEY)) {
        sessionStorage.removeItem(REACHED_GOLD_KEY);
        planeTier = 1;
      }
      planeTier = Math.max(planeTier, clickedTier);
      updateHeroTierColor(planeTier);
      if (planeTier === 4) {
        sessionStorage.setItem(REACHED_GOLD_KEY, '1');
        window.location.href = 'secret.html';
        planeTier = 1;
        reached_gold = true;
        return;
      }
      track.removeEventListener('animationend', track._removeTrack);
      if (track._removeTrack) {
        window.setTimeout(track._removeTrack, cfg.popDurationMs);
      }
    });

    function createPlane(layer, cfg, startProgress) {
      var planeImages = cfg.planeImages;
      var duration = randomInRange(cfg.durationMin, cfg.durationMax);
      var leftToRight = Math.random() < 0.5;
      var planeIdx = randomInt(0, planeImages.length - 1);
      var planeSrc = planeImages[planeIdx];
      var planeFallback = planeImages[(planeIdx + 1) % planeImages.length];

      var delay = 0;
      if (startProgress != null && startProgress > 0 && startProgress < 1) {
        delay = -duration * startProgress;
      }

      var track = document.createElement('div');
      track.className = 'hero-plane-track';
      track.style.top = randomInRange(cfg.topMin, cfg.topMax) + '%';
      track.style.animation = (
        (leftToRight ? 'straightLeftToRight' : 'straightRightToLeft') +
        ' ' + duration + 's linear ' + delay + 's 1'
      );

      var plane = document.createElement('div');
      plane.className = 'hero-plane banner-' + (leftToRight ? 'l' : 'r');

      var banner = document.createElement('span');
      banner.className = 'plane-banner';
      if (Math.random() < 0.05) {
        if (planeTier >= 3) banner.classList.add('plane-banner--gold');
        else if (planeTier >= 2) banner.classList.add('plane-banner--silver');
        else if (planeTier >= 1) banner.classList.add('plane-banner--bronze');
      }
      banner.textContent = pick(cfg.bannerTexts);

      var img = document.createElement('img');
      img.src = planeSrc;
      img.alt = '';
      img.setAttribute('data-fallback', planeFallback);
      img.onerror = function () {
        this.src = this.getAttribute('data-fallback') || planeImages[0];
      };

      plane.appendChild(banner);
      plane.appendChild(img);
      track.appendChild(plane);

      function removeTrack() {
        if (track.parentNode) track.parentNode.removeChild(track);
      }
      track._removeTrack = removeTrack;

      track.addEventListener('animationend', removeTrack);

      layer.appendChild(track);
    }

    function scheduleNext() {
      setTimeout(function () {
        createPlane(layer, cfg);
        scheduleNext();
      }, randomInRange(cfg.spawnIntervalMinMs, cfg.spawnIntervalMaxMs));
    }

    for (var i = 0; i < 6; i++) {
      createPlane(layer, cfg, 0.15 + (i / 6) * 0.7);
    }
    scheduleNext();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroPlanes);
  } else {
    initHeroPlanes();
  }
})();

(() => {
  'use strict';

  const COLORS = {
    white: '#FFF9FA',
    blush: '#FCE7EF',
    rose: '#F4B8CE',
    deep: '#D95787',
    ink: '#30232A'
  };
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Build one flower as an SVG string.
     layers: [{ n: petal count, len, wid, fill, offset(deg), shape }] */
  function flowerSVG(layers, core, opts = {}) {
    const delayStep = opts.delayStep ?? 0.05;
    let petals = '';
    let delayBase = 0;
    layers.forEach((L) => {
      for (let i = 0; i < L.n; i++) {
        const angle = (360 / L.n) * i + (L.offset || 0);
        const d = (delayBase + i * delayStep).toFixed(2);
        const l = L.len, w = L.wid;
        // petal path pointing up from centre (100,100)
        let path;
        if (L.shape === 'round') {
          path = `M100 100 C ${100 - w} ${100 - l * 0.35}, ${100 - w} ${100 - l}, 100 ${100 - l} C ${100 + w} ${100 - l}, ${100 + w} ${100 - l * 0.35}, 100 100 Z`;
        } else if (L.shape === 'pointy') {
          path = `M100 100 C ${100 - w} ${100 - l * 0.4}, ${100 - w * 0.5} ${100 - l * 0.85}, 100 ${100 - l} C ${100 + w * 0.5} ${100 - l * 0.85}, ${100 + w} ${100 - l * 0.4}, 100 100 Z`;
        } else if (L.shape === 'notch') {
          path = `M100 100 C ${100 - w * 1.1} ${100 - l * 0.4}, ${100 - w} ${100 - l}, ${100 - w * 0.2} ${100 - l} Q 100 ${100 - l * 0.86} ${100 + w * 0.2} ${100 - l} C ${100 + w} ${100 - l}, ${100 + w * 1.1} ${100 - l * 0.4}, 100 100 Z`;
        } else {
          path = `M100 100 C ${100 - w} ${100 - l * 0.3}, ${100 - w * 0.8} ${100 - l}, 100 ${100 - l} C ${100 + w * 0.8} ${100 - l}, ${100 + w} ${100 - l * 0.3}, 100 100 Z`;
        }
        petals += `<path class="petal" style="--a:${angle}deg;--d:${d}s" d="${path}" fill="${L.fill}" stroke="${L.stroke || 'none'}" stroke-width="1"/>`;
      }
      delayBase += 0.35;
    });

    let centre = '';
    if (core.type === 'seeds') {
      centre = `<circle cx="100" cy="100" r="${core.r}" fill="${core.fill}"/>`;
      for (let i = 0; i < 26; i++) {
        const a = i * 137.5 * Math.PI / 180;
        const r = Math.sqrt(i + 1) * (core.r / 5.4);
        centre += `<circle cx="${100 + Math.cos(a) * r}" cy="${100 + Math.sin(a) * r}" r="1.6" fill="${core.dot}"/>`;
      }
    } else if (core.type === 'stamens') {
      centre = `<circle cx="100" cy="100" r="${core.r}" fill="${core.fill}"/>`;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = 100 + Math.cos(a) * core.r * 2.1, y = 100 + Math.sin(a) * core.r * 2.1;
        centre += `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${core.dot}" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="2.6" fill="${core.dot}"/>`;
      }
    } else {
      centre = `<circle cx="100" cy="100" r="${core.r}" fill="${core.fill}"/><circle cx="100" cy="100" r="${core.r * 0.45}" fill="${core.dot}"/>`;
    }

    return `<svg viewBox="0 0 200 200" class="bloom" xmlns="${NS}" role="img" aria-label="${opts.label || 'Flower'}">
      ${petals}<g class="core">${centre}</g></svg>`;
  }

  /* Flower recipes */
  const FLOWERS = {
    rose: {
      name: 'Rose',
      says: '"I love you, and I mean it."',
      note: 'Pink roses mean gratitude and admiration. Deep rose shades speak of devotion. Ours are the garden-grown kind: ruffled, fragrant, and nothing like the stiff supermarket stems.',
      season: 'Best from June to October',
      layers: [
        { n: 7, len: 88, wid: 40, fill: COLORS.rose, shape: 'round', offset: 0 },
        { n: 6, len: 68, wid: 34, fill: COLORS.deep, shape: 'round', offset: 25, stroke: COLORS.rose },
        { n: 5, len: 46, wid: 26, fill: COLORS.rose, shape: 'round', offset: 50, stroke: COLORS.deep },
        { n: 4, len: 26, wid: 18, fill: COLORS.deep, shape: 'round', offset: 15, stroke: COLORS.blush }
      ],
      core: { type: 'dot', r: 6, fill: COLORS.deep, dot: COLORS.rose }
    },
    peony: {
      name: 'Peony',
      says: '"Good fortune is on its way."',
      note: 'The flower of happy marriages and fresh starts. Peonies open slowly over days, so a bunch from us keeps surprising you long after it arrives.',
      season: 'Best in May and June',
      layers: [
        { n: 9, len: 90, wid: 38, fill: COLORS.blush, shape: 'notch', offset: 0, stroke: COLORS.rose },
        { n: 8, len: 74, wid: 34, fill: COLORS.rose, shape: 'notch', offset: 20, stroke: COLORS.blush },
        { n: 7, len: 56, wid: 28, fill: COLORS.blush, shape: 'notch', offset: 8, stroke: COLORS.rose },
        { n: 6, len: 38, wid: 22, fill: COLORS.rose, shape: 'notch', offset: 30, stroke: COLORS.deep }
      ],
      core: { type: 'stamens', r: 7, fill: COLORS.deep, dot: COLORS.deep }
    },
    daisy: {
      name: 'Daisy',
      says: '"I\'ll never tell."',
      note: 'The flower of innocence, new beginnings and keeping a secret. Children press them into books. We tuck them into almost every bouquet for a little cheer.',
      season: 'Best from April to September',
      layers: [
        { n: 16, len: 86, wid: 12, fill: COLORS.white, shape: 'round', offset: 0, stroke: COLORS.rose },
        { n: 16, len: 78, wid: 11, fill: COLORS.blush, shape: 'round', offset: 11, stroke: COLORS.rose }
      ],
      core: { type: 'seeds', r: 20, fill: COLORS.deep, dot: COLORS.blush }
    },
    tulip: {
      name: 'Tulip',
      says: '"You are perfect to me."',
      note: 'A tulip is a quiet kind of love. Its cup shape holds all the spring light it can find, and the stems keep bending toward the window long after you\'ve put them in water.',
      season: 'Best from March to May',
      layers: [
        { n: 3, len: 92, wid: 34, fill: COLORS.deep, shape: 'pointy', offset: 0 },
        { n: 3, len: 80, wid: 30, fill: COLORS.rose, shape: 'pointy', offset: 60, stroke: COLORS.deep }
      ],
      core: { type: 'dot', r: 8, fill: COLORS.blush, dot: COLORS.deep }
    },
    sweetpea: {
      name: 'Sweet pea',
      says: '"Thank you for a lovely time."',
      note: 'Sweet peas are the scent of an English summer. They don\'t travel well, which is why you can only find them from someone who grows them, like us.',
      season: 'Best in June and July',
      layers: [
        { n: 5, len: 84, wid: 42, fill: COLORS.blush, shape: 'notch', offset: 0, stroke: COLORS.rose },
        { n: 5, len: 60, wid: 34, fill: COLORS.rose, shape: 'notch', offset: 36, stroke: COLORS.deep },
        { n: 3, len: 34, wid: 24, fill: COLORS.deep, shape: 'round', offset: 12 }
      ],
      core: { type: 'dot', r: 5, fill: COLORS.blush, dot: COLORS.deep }
    }
  };

  /* ---------- HERO BLOOM ---------- */
  const heroEl = document.getElementById('heroBloom');
  const heroLayers = [
    { n: 8, len: 92, wid: 34, fill: COLORS.rose, shape: 'round', offset: 0, stroke: COLORS.deep },
    { n: 8, len: 76, wid: 30, fill: COLORS.blush, shape: 'round', offset: 22.5, stroke: COLORS.rose },
    { n: 7, len: 58, wid: 26, fill: COLORS.deep, shape: 'round', offset: 10, stroke: COLORS.rose },
    { n: 6, len: 38, wid: 20, fill: COLORS.rose, shape: 'round', offset: 30, stroke: COLORS.blush }
  ];
  heroEl.innerHTML = flowerSVG(heroLayers, { type: 'seeds', r: 15, fill: COLORS.ink, dot: COLORS.rose }, { label: 'A blooming pink flower', delayStep: 0.06 });
  const heroSvg = heroEl.querySelector('svg');

  const openBloom = (svg, wait = 150) => setTimeout(() => svg.classList.add('open'), wait);
  openBloom(heroSvg, 300);

  // The flower follows the cursor a little, and turns as you scroll
  let tiltX = 0, tiltY = 0, scrollRot = 0;
  const applyTransform = () => {
    heroSvg.style.transform = `rotate(${scrollRot}deg) translate(${tiltX}px, ${tiltY}px)`;
  };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      tiltX = (e.clientX / window.innerWidth - 0.5) * 18;
      tiltY = (e.clientY / window.innerHeight - 0.5) * 18;
      applyTransform();
    });
    window.addEventListener('scroll', () => {
      scrollRot = window.scrollY * 0.06;
      applyTransform();
    }, { passive: true });
  }

  // Click the bloom: petals drift down the page
  heroEl.addEventListener('click', (e) => {
    if (reduceMotion) return;
    const palette = [COLORS.rose, COLORS.deep, COLORS.blush];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'fall-petal';
      p.style.left = e.clientX + (Math.random() - 0.5) * 80 + 'px';
      p.style.top = e.clientY + (Math.random() - 0.5) * 40 + 'px';
      p.style.background = palette[i % palette.length];
      p.style.setProperty('--dx', (Math.random() - 0.5) * 300 + 'px');
      p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      p.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  });

  /* ---------- FLOWER LANGUAGE PICKER ---------- */
  const picker = document.getElementById('picker');
  const meaning = document.getElementById('meaning');
  const mFlower = document.getElementById('meaningFlower');
  const mName = document.getElementById('mName');
  const mSays = document.getElementById('mSays');
  const mNote = document.getElementById('mNote');
  const mSeason = document.getElementById('mSeason');

  function show(key, animate = true) {
    const f = FLOWERS[key];
    mFlower.innerHTML = flowerSVG(f.layers, f.core, { label: f.name });
    mFlower.querySelector('svg').classList.add('open');
    mName.textContent = f.name;
    mSays.textContent = f.says;
    mNote.textContent = f.note;
    mSeason.textContent = f.season;
    picker.querySelectorAll('.pick').forEach((b) =>
      b.setAttribute('aria-selected', b.dataset.key === key ? 'true' : 'false'));
    if (animate) {
      meaning.classList.remove('swap');
      void meaning.offsetWidth; // restart animation
      meaning.classList.add('swap');
    }
  }

  Object.entries(FLOWERS).forEach(([key, f]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pick';
    btn.dataset.key = key;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', f.name);
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = flowerSVG(f.layers, f.core, { label: '' }).replace('class="bloom"', 'class="bloom open"');
    btn.addEventListener('click', () => show(key));
    picker.appendChild(btn);
  });

  // Arrow-key navigation between flowers
  picker.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const btns = [...picker.querySelectorAll('.pick')];
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    next.focus();
    next.click();
  });

  show('peony', false);

  /* ---------- NAV SHADOW + YEAR ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* Name translation cycling (homepage only) */
const nameCycle = document.getElementById('name-cycle');
if (nameCycle) {
  const translations = [
    ['آرْيَامَانْ أرورا', 'Arabic'],
    ['𐬁𐬭𐬌𐬌𐬀𐬨𐬀𐬥', 'Avestan'],
    ['অর্যমন', 'Bengali'],
    ['ᎠᎠᏟᏯᎹᎾ', 'Cherokee'],
    ['阿亞曼 阿羅拉', 'Mandarin'],
    ['Ⲁⲣⲓⲁⲙⲁⲛ', 'Coptic'],
    ['ᐋᕐᔭᒪᓐ', 'Cree'],
    ['ኣፘመነ', 'Ge\u2019ez'],
    ['𐌰𐍂𐌾𐌰𐌼𐌰𐌽', 'Gothic'],
    ['Ἄριαμαν', 'Ancient Greek'],
    ['𐀀𐁈𐀔𐀙', 'Mycenaean Greek'],
    ['આર્યમન', 'Gujarati'],
    ['אַרְיַמַן', 'Hebrew'],
    ['आर्यमन अरोरा', 'Hindi'],
    ['アーリャマン', 'Japanese'],
    ['ꦄꦴꦫꦾꦩꦤ꧀', 'Javanese'],
    ['ಆರ್\u200Dಯಮನ್', 'Kannada'],
    ['អឫមន', 'Khmer'],
    ['아랴만 아로라', 'Korean'],
    ['ᰣᰦᰛᰤᰕᰰ', 'Lepcha'],
    ['𑀆𑀭𑁆𑀬𑀫𑀦', 'Maharastri Prakrit'],
    ['ᠠᠷᠶᠠᠮᠠᠨ', 'Mongolian'],
    ['आर्यमन् अरोडा', 'Nepali'],
    ['𐎠𐎠𐎼𐎹𐎶𐎴', 'Old Persian'],
    ['ଆର୍ୟମନ ଆରୋରା', 'Oriya'],
    ['𐤀𐤓𐤉𐤌𐤍', 'Phoenician'],
    ['*h₂é-ryo-mōn-', 'Proto-Indo-European'],
    ['ਆਰਯਮਨ ਅਰੋੜਾ', 'Punjabi'],
    ['Арьяма́н Арора', 'Russian'],
    ['आर्यमन्', 'Sanskrit'],
    ['ආර්යමන', 'Sinhalese'],
    ['𒅈𒄿𒄠𒀭', 'Sumerian'],
    ['ܐܪܝܡܢ', 'Syriac'],
    ['ஆர்யமன', 'Tamil'],
    ['ఆర్యమన', 'Telugu'],
    ['อารยมน', 'Thai'],
    ['اريمن ارورہ', 'Urdu'],
    ['אַריאַמאַן', 'Yiddish'],
  ];
  let i = 0;
  let current = translations.find(t => t[1] === 'Hindi');
  let interval;
  let hovering = false;

  // Create the language label
  const langLabel = document.createElement('span');
  langLabel.id = 'name-lang';
  nameCycle.parentNode.insertBefore(langLabel, nameCycle.nextSibling);

  function fade(text, lang) {
    nameCycle.style.opacity = 0;
    if (hovering) langLabel.style.opacity = 0;
    setTimeout(() => {
      nameCycle.textContent = text;
      nameCycle.style.opacity = 1;
      if (hovering) {
        langLabel.textContent = ' ' + lang;
        langLabel.style.opacity = 1;
      }
    }, 300);
  }

  function showLang(lang) {
    langLabel.textContent = ' ' + lang;
    langLabel.style.opacity = 1;
  }

  function hideLang() {
    langLabel.style.opacity = 0;
  }

  function cycle() {
    current = translations[i];
    fade(current[0], current[1]);
    i = (i + 1) % translations.length;
  }

  // Start cycling after a brief pause
  interval = setInterval(cycle, 2500);

  nameCycle.addEventListener('mouseenter', () => {
    hovering = true;
    showLang(current[1]);
  });

  nameCycle.addEventListener('mouseleave', () => {
    hovering = false;
    hideLang();
  });
}

/* Floating TOC (blog posts only) */
if (document.querySelector('.reading-progress')) {
  const headings = document.querySelectorAll('h2[id], h3[id]');
  if (headings.length > 0) {
    const nav = document.createElement('nav');
    nav.className = 'floating-toc';
    const ul = document.createElement('ul');
    headings.forEach(h => {
      const li = document.createElement('li');
      if (h.tagName === 'H3') li.classList.add('toc-h3');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    document.body.appendChild(nav);

    /* Highlight active section */
    const tocLinks = nav.querySelectorAll('a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(a => a.classList.remove('active'));
          const active = nav.querySelector('a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
    headings.forEach(h => observer.observe(h));
  }
}

/* Paper visualizations (papers page only) */
function buildBarChart(container, entries, maxCount) {
  const chart = document.createElement('div');
  chart.className = 'viz-bars';
  entries.forEach(([label, count]) => {
    const col = document.createElement('div');
    col.className = 'viz-col';

    const barArea = document.createElement('div');
    barArea.className = 'viz-bar-area';

    const countEl = document.createElement('span');
    countEl.className = 'viz-count';
    countEl.textContent = count;

    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    bar.style.height = Math.max(4, (count / maxCount) * 100) + 'px';

    barArea.appendChild(countEl);
    barArea.appendChild(bar);

    const nameEl = document.createElement('span');
    nameEl.className = 'viz-label';
    nameEl.textContent = label;

    col.appendChild(barArea);
    col.appendChild(nameEl);
    chart.appendChild(col);
  });
  container.appendChild(chart);
}

const coauthorViz = document.getElementById('coauthor-viz');
if (coauthorViz) {
  const authorSpans = document.querySelectorAll('.paper-entry .authors');
  const coauthorCounts = {};
  const canonicalNames = {
    'Christopher D. Manning': 'Christopher Manning',
    'Noah D. Goodman': 'Noah Goodman',
  };
  let paperCount = 0;

  authorSpans.forEach(span => {
    paperCount++;
    let authorText = '';
    for (const node of span.childNodes) {
      if (node.nodeName === 'BR') break;
      if (node.nodeType === Node.TEXT_NODE) authorText += node.textContent;
      else if (node.nodeName === 'STRONG') authorText += node.textContent;
    }
    authorText.split(',').forEach(raw => {
      let name = raw.trim().replace(/\s+/g, ' ').replace(/^\s*and\s+/i, '').replace(/\*/g, '').trim();
      if (name && name !== 'Aryaman Arora' && !name.includes('...') && name !== '...' && name.length > 1) {
        name = canonicalNames[name] || name;
        coauthorCounts[name] = (coauthorCounts[name] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(coauthorCounts).sort((a, b) => b[1] - a[1]);
  const topN = sorted.filter(([, count]) => count >= 2);

  const stat = document.createElement('p');
  stat.className = 'viz-stat';
  stat.innerHTML = '<strong>' + sorted.length + '</strong> unique coauthors across <strong>' + paperCount + '</strong> papers';
  coauthorViz.appendChild(stat);

  if (topN.length > 0) {
    buildBarChart(coauthorViz, topN, topN[0][1]);
  }
}

/* Reading progress indicator (blog posts only) */
const progress = document.querySelector('.reading-progress');
if (progress) {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progress.style.width = (window.scrollY / docHeight * 100) + '%';
    }
  }, { passive: true });
}

/* Colophon circuit: three hidden layers feeding the tokenized name; hover a token to trace it */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.colophon');
  const svg = root && root.querySelector('svg.circuit');
  if (!svg) return;
  const toks = [...root.querySelectorAll('.tok')];
  const NS = 'http://www.w3.org/2000/svg';
  const SIZES = [5, 6, 6]; // hidden layers
  const PAD = [70, 45, 20]; // hidden layers fan out wider than the tokens
  let layers, edges;

  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function build() {
    const rand = rng(116445);
    const sb = svg.getBoundingClientRect();
    const tb = toks.map(t => t.getBoundingClientRect());
    const lo = Math.min(...tb.map(b => b.left)) - sb.left;
    const hi = Math.max(...tb.map(b => b.right)) - sb.left;
    const H = sb.height;
    svg.innerHTML = '';

    layers = SIZES.map((n, l) =>
      Array.from({ length: n }, (_, i) => ({
        x: lo - PAD[l] + ((hi - lo + 2 * PAD[l]) * (i + 0.5)) / n + (rand() - 0.5) * 6,
        y: 4 + l * ((H - 8) / 3),
      }))
    );
    layers.push(tb.map(b => ({ x: (b.left + b.right) / 2 - sb.left, y: H })));

    // Each node keeps only its 2-3 strongest inputs
    edges = [];
    for (let l = 0; l < layers.length - 1; l++) {
      layers[l + 1].forEach((b, j) => {
        layers[l]
          .map((a, i) => ({ a, i, w: rand() }))
          .sort((p, q) => q.w - p.w)
          .slice(0, 2 + Math.floor(rand() * 2))
          .forEach(({ a, i, w }, rank) => {
            w = w / (rank + 1);
            const line = el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'stroke-width': 0.3 + 1.1 * w });
            svg.appendChild(line);
            edges.push({ l, i, j, w, line });
          });
      });
    }
    layers.slice(0, -1).forEach(layer =>
      layer.forEach(n => {
        n.circle = el('circle', { cx: n.x, cy: n.y, r: 2 });
        svg.appendChild(n.circle);
      })
    );
  }

  // Walk back from a token along the strongest incoming edges
  function trace(j) {
    root.classList.add('tracing');
    let frontier = new Set([j]);
    for (let l = layers.length - 2; l >= 0; l--) {
      const next = new Set();
      frontier.forEach(t => {
        edges
          .filter(e => e.l === l && e.j === t)
          .sort((a, b) => b.w - a.w)
          .slice(0, l === layers.length - 2 ? 2 : 1)
          .forEach(e => {
            e.line.classList.add('hot');
            next.add(e.i);
          });
      });
      next.forEach(i => layers[l][i].circle.classList.add('hot'));
      frontier = next;
    }
  }

  function clear() {
    root.classList.remove('tracing');
    svg.querySelectorAll('.hot').forEach(e => e.classList.remove('hot'));
  }

  toks.forEach((t, j) => {
    t.addEventListener('mouseenter', () => trace(j));
    t.addEventListener('mouseleave', clear);
  });
  build();
  document.fonts.ready.then(build);
  window.addEventListener('resize', build);
});

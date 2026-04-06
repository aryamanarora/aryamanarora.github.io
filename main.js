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

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

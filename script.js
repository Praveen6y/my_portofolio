/* Simple interactivity: theme toggle, mobile menu, smooth scroll, form mailto, reveal on scroll */

(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = Array.from(document.querySelectorAll('.mobile-link'));
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme: load from localStorage or system
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }

  function toggleTheme() {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  themeToggle && themeToggle.addEventListener('click', toggleTheme);

  // mobile menu
  let mobileOpen = false;
  mobileMenuBtn && mobileMenuBtn.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    mobileNav.classList.toggle('hidden', !mobileOpen);
  });

  mobileLinks.forEach(a => a.addEventListener('click', () => {
    mobileOpen = false;
    mobileNav.classList.add('hidden');
  }));

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // contact form: open mail client with prefilled body
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const name = encodeURIComponent(form.name.value.trim() || 'No name');
      const email = encodeURIComponent(form.email.value.trim() || '');
      const message = encodeURIComponent(form.message.value.trim() || '');
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
    });
  }

  // reveal elements on scroll (fade-up)
  const observers = [];
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('in-view');
          // optionally unobserve for perf
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => obs.observe(el));
    observers.push(obs);
  }

  // small helper: expose toggleTheme if developer console wants to call it
  window.__toggleSiteTheme = toggleTheme;
})();

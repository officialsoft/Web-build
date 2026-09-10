  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Typed terminal intro
  const fullText = "whoami && echo \"learner — building web apps, breaking networks (safely)\"";
  const typedEl = document.getElementById('typedLine');
  const cursorEl = document.getElementById('cursor');
  let i = 0;
  function typeStep(){
    if (i <= fullText.length){
      typedEl.textContent = fullText.slice(0, i);
      i++;
      setTimeout(typeStep, 28);
    }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedEl.textContent = fullText;
    cursorEl.style.animation = 'none';
  } else {
    typeStep();
  }

  // Log filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const logEntries = document.querySelectorAll('.log-entry');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      logEntries.forEach(entry => {
        entry.classList.toggle('hidden', filter !== 'all' && entry.dataset.tag !== filter);
      });
    });
  });

  // Log count
  document.getElementById('logCount').textContent = logEntries.length + '+';

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

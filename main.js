// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Featured properties carousel arrows (basic scroll behavior)
const arrows = document.querySelectorAll('.carousel-arrows button');
const grid = document.querySelector('.property-grid');

arrows.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (!grid) return;
    const amount = 280;
    grid.scrollBy({ left: i === 0 ? -amount : amount, behavior: 'smooth' });
  });
});

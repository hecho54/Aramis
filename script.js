/* ── Nav scroll effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Count-up animáció ── */
function countUp(el) {
  const target = +el.dataset.target;
  const duration = 1200;
  const start = performance.now();
  el.classList.add('counting');
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else { el.textContent = target; el.classList.remove('counting'); }
  };
  requestAnimationFrame(tick);
}

/* ── Reveal on scroll ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Count-up indítása ha stat szám
      e.target.querySelectorAll('.stats__num[data-target]').forEach(countUp);
    }
  }),
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => observer.observe(el));

/* ── Mobile nav ── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
  });
});

/* ── Menu tabs ── */
const tabs = document.querySelectorAll('.menu-tab');
const cards = document.querySelectorAll('.menu-card');
const pizzaSizeNote = document.getElementById('pizzaSizeNote');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Pizza méret fejléc csak pizza tab-nál
    if (pizzaSizeNote) {
      pizzaSizeNote.style.display = cat === 'pizza' ? '' : 'none';
    }

    cards.forEach(card => {
      if (card.dataset.category === cat) {
        const isInfo = card.classList.contains('menu-card--info');
        card.style.display = isInfo ? 'flex' : 'grid';
        requestAnimationFrame(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── Booking form ── */
const form = document.getElementById('bookingForm');
if (form) {
  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Köszönjük! Hamarosan felvesszük a kapcsolatot.';
    btn.disabled = true;
    btn.style.background = '#1a3a1a';
    btn.style.borderColor = '#2d6a2d';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 4000);
  });
}

/* ── Subtle parallax on hero image ── */
const heroImg = document.querySelector('.hero__img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── Active nav link highlight ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cream)' : '';
  });
}, { passive: true });

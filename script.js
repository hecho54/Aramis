/* ══════════════════════════════════════
   3D INTRO
   ══════════════════════════════════════ */
(function () {
  const intro     = document.getElementById('intro');
  const skipBtn   = document.getElementById('introSkip');
  const canvas    = document.getElementById('intro-embers');
  const ctx       = canvas.getContext('2d');

  /* ── Parázs részecskék ── */
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const embers = Array.from({ length: 55 }, () => spawnEmber(true));
  function spawnEmber(random) {
    return {
      x:    Math.random() * canvas.width,
      y:    random ? Math.random() * canvas.height : canvas.height + 10,
      r:    Math.random() * 2.2 + 0.6,
      vy:   -(Math.random() * 1.2 + 0.4),
      vx:   (Math.random() - 0.5) * 0.6,
      life: Math.random(),
      decay: Math.random() * 0.004 + 0.002,
      hue:  Math.random() * 30 + 5,   /* piros–narancs */
    };
  }
  let emberRAF;
  function drawEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    embers.forEach((e, i) => {
      e.x += e.vx + Math.sin(Date.now() * 0.001 + i) * 0.3;
      e.y += e.vy;
      e.life -= e.decay;
      if (e.life <= 0 || e.y < -10) { embers[i] = spawnEmber(false); return; }
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${e.hue}, 100%, 65%, ${e.life})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsla(${e.hue}, 100%, 60%, .8)`;
      ctx.fill();
    });
    emberRAF = requestAnimationFrame(drawEmbers);
  }
  drawEmbers();

  /* ── GSAP Timeline ── */
  const curtainTop    = intro.querySelector('.intro__curtain--top');
  const curtainBottom = intro.querySelector('.intro__curtain--bottom');

  function runIntro() {
    const tl = gsap.timeline({ onComplete: hideIntro });

    /* Curtain szétnyílik → megmutatja a bg-t */
    tl.to(curtainTop,    { y: '-100%', duration: .9, ease: 'power3.inOut' })
      .to(curtainBottom, { y:  '100%', duration: .9, ease: 'power3.inOut' }, '<')

    /* Kihagyás gomb */
      .to('.intro__skip', { opacity: 1, duration: .4 }, '-=.4')

    /* "Budapest szívében" besuhan */
      .fromTo('.intro__city',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.1')

    /* Logo 3D flip-in */
      .fromTo('.intro__logo',
        { opacity: 0, rotationX: 90, y: 40, transformOrigin: '50% 100%' },
        { opacity: 1, rotationX: 0,  y: 0,  duration: 1.1, ease: 'power4.out' }, '-=.1')

    /* "PIZZA & PUB" megjelenik */
      .fromTo('.intro__sub',
        { opacity: 0, letterSpacing: '1em' },
        { opacity: 1, letterSpacing: '.55em', duration: .8, ease: 'power3.out' }, '-=.4')

    /* Vízszintes vonal kihúzódik */
      .to('.intro__line',
        { width: 220, duration: .8, ease: 'power2.out' }, '-=.4')

    /* Hold */
      .to({}, { duration: 1.8 })

    /* Logo felerősödik, majd elillan */
      .to('.intro__logo', { scale: 1.05, filter: 'drop-shadow(0 0 80px rgba(196,30,30,.9))', duration: .5, ease: 'power2.inOut' })
      .to('.intro__content', { opacity: 0, duration: .4, ease: 'power2.in' }, '-=.1')

    /* Függöny visszacsukódik */
      .to(curtainTop,    { y: '0%', duration: .7, ease: 'power3.inOut' }, '-=.2')
      .to(curtainBottom, { y:  '0%', duration: .7, ease: 'power3.inOut' }, '<')

    /* Intro eltűnik, oldal megjelenik */
      .to(intro, { opacity: 0, duration: .5, ease: 'power2.in' }, '-=.15');
  }

  function hideIntro() {
    cancelAnimationFrame(emberRAF);
    intro.remove();
  }

  skipBtn.addEventListener('click', () => {
    gsap.killTweensOf('*');
    gsap.to(intro, { opacity: 0, duration: .4, onComplete: hideIntro });
  });

  runIntro();
})();

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
      e.target.querySelectorAll('.stats__num[data-target]').forEach(countUp);
      observer.unobserve(e.target);
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

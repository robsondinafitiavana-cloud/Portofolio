/* ==========================================================================
   DINA FITIAVANA ROBSON — PORTFOLIO
   Vanilla JS: navbar behaviour, theme toggle, role text rotator,
   scroll-reveal + skill bars + counters via IntersectionObserver,
   project filters, contact form validation, back-to-top.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. NAVBAR — blur/opaque on scroll + active link + mobile menu
  --------------------------------------------------------------------- */
  const nav = document.getElementById('drNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link-item');
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlight based on section in view
  const sections = document.querySelectorAll('main section[id], header#home');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------------------------------------------------------------------
     2. THEME TOGGLE — dark / light, persisted for the session
  --------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
  };

  let currentTheme = root.getAttribute('data-theme') || 'dark';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  /* ---------------------------------------------------------------------
     3. HERO ROLE ROTATOR — typewriter-style role switcher
  --------------------------------------------------------------------- */
  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Python Developer',
    'Java Developer',
    'Web Developer'
  ];
  const rotatorEl = document.getElementById('roleRotator');
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  function typeRole() {
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      if (charIndex > word.length) {
        deleting = true;
        setTimeout(typeRole, 1600);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }
    rotatorEl.textContent = roles[roleIndex].slice(0, charIndex);
    setTimeout(typeRole, deleting ? 45 : 85);
  }
  setTimeout(typeRole, 1400);

  /* ---------------------------------------------------------------------
     4. SCROLL REVEAL — fade/slide-up entrance for tagged elements
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     5. ANIMATED COUNTERS (about stats)
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------------------------------------------------------------------
     6. ANIMATED SKILL BARS
  --------------------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.level + '%';
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(f => skillObserver.observe(f));

  /* ---------------------------------------------------------------------
     7. PROJECT FILTERS
  --------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        const match = filter === 'all' || cats.includes(filter);
        if (match) {
          card.classList.remove('filtered-out');
          card.style.animation = 'none';
          // eslint-disable-next-line no-unused-expressions
          card.offsetHeight; /* restart animation */
          card.style.animation = 'fadeInUp .5s ease forwards';
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  /* ---------------------------------------------------------------------
     8. CONTACT FORM — client-side validation
  --------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');
    let valid = true;

    const name = document.getElementById('cf-name');
    const email = document.getElementById('cf-email');
    const subject = document.getElementById('cf-subject');
    const message = document.getElementById('cf-message');

    [name, subject, message].forEach(field => {
      const wrapper = field.closest('.form-field');
      if (field.value.trim() === '') {
        wrapper.classList.add('invalid');
        valid = false;
      } else {
        wrapper.classList.remove('invalid');
      }
    });

    const emailWrapper = email.closest('.form-field');
    if (!emailPattern.test(email.value.trim())) {
      emailWrapper.classList.add('invalid');
      valid = false;
    } else {
      emailWrapper.classList.remove('invalid');
    }

    if (valid) {
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
  });

  // Clear invalid state as the user types
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-field').classList.remove('invalid');
    });
  });

  /* ---------------------------------------------------------------------
     9. BACK TO TOP
  --------------------------------------------------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});

/* Keyframe used by the JS-triggered filter animation */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(styleSheet);

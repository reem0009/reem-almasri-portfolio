(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Intro sequence ---------- */
  const intro = document.querySelector('.intro');

  if (intro) {
    if (reduceMotion) {
      intro.remove();
      document.documentElement.classList.remove('intro-active');
    } else {
      const dots = [...intro.querySelectorAll('.intro__dot')];
      const percentEl = intro.querySelector('[data-intro-percent]');
      const statusEl = intro.querySelector('.intro__status');
      const locked = [...document.querySelectorAll('.skip-link, .site-header, main, .footer, .to-top')];
      locked.forEach((el) => el.setAttribute('inert', ''));

      let finished = false;
      let pageLoaded = document.readyState === 'complete';
      let displayed = 0;
      let rafId = 0;
      const startedAt = performance.now();
      const minimumTime = 1700;

      const setProgress = (value) => {
        if (percentEl) percentEl.textContent = String(Math.min(100, Math.floor(value))).padStart(2, '0');
        dots.forEach((dot, index) => {
          dot.classList.toggle('is-on', value >= (index + 1) * 10 - .5);
        });
      };

      const finish = (instant = false) => {
        if (finished) return;
        finished = true;
        window.cancelAnimationFrame(rafId);
        setProgress(100);
        if (statusEl) statusEl.textContent = instant ? 'Jumping in' : 'Ready';
        intro.classList.add('is-done');
        document.documentElement.classList.add('site-ready');
        if (instant) intro.classList.add('is-instant');

        window.setTimeout(() => {
          intro.classList.add('is-leaving');
        }, instant ? 0 : 260);

        window.setTimeout(() => {
          intro.remove();
          document.documentElement.classList.remove('intro-active');
          locked.forEach((el) => el.removeAttribute('inert'));
        }, instant ? 500 : 1180);
      };

      const skip = (event) => {
        if (event.type === 'keydown' && !['Escape', 'Enter', ' '].includes(event.key)) return;
        finish(true);
        intro.removeEventListener('click', skip);
        document.removeEventListener('keydown', skip);
      };

      intro.addEventListener('click', skip);
      document.addEventListener('keydown', skip);
      intro.classList.add('is-running');

      const easeInOut = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

      const tick = (now) => {
        if (finished) return;
        const t = Math.min(1, (now - startedAt) / minimumTime);
        const ceiling = pageLoaded ? 100 : 93;
        const target = Math.min(ceiling, easeInOut(t) * 100);
        displayed += (target - displayed) * .18;
        setProgress(displayed);

        if (pageLoaded && ((t >= 1 && displayed > 99.2) || now - startedAt > 2600)) {
          finish();
          return;
        }
        if (now - startedAt > 3600) {
          finish();
          return;
        }
        rafId = window.requestAnimationFrame(tick);
      };

      rafId = window.requestAnimationFrame(tick);

      window.addEventListener('load', () => {
        pageLoaded = true;
      }, { once: true });

      window.setTimeout(() => {
        pageLoaded = true;
        finish();
      }, 7000);
    }
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#mobile-menu');

  const closeMenu = (restoreFocus = false) => {
    if (!toggle || !menu) return;
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.hidden = true;
    if (wasOpen && restoreFocus) toggle.focus();
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      menu.hidden = isOpen;
      if (!isOpen) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });

    document.addEventListener('click', (event) => {
      if (menu.hidden) return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Scroll reveals ---------- */
  const revealEls = [...document.querySelectorAll('[data-reveal]')];

  revealEls.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((child) => child.hasAttribute('data-reveal'));
    const index = siblings.indexOf(el);
    el.style.setProperty('--delay', `${Math.min(index, 5) * 65}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.nav a, .mobile-menu nav a')];
  const sections = [...document.querySelectorAll('section[id]')];

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-38% 0px -54% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  const dot = cursor ? cursor.querySelector('.cursor__dot') : null;
  const ring = cursor ? cursor.querySelector('.cursor__ring') : null;

  if (cursor && dot && ring && finePointer && !reduceMotion) {
    document.body.classList.add('has-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let cursorActive = false;

    window.addEventListener('pointermove', (event) => {
      if (!cursorActive) {
        cursorActive = true;
        ringX = event.clientX;
        ringY = event.clientY;
        cursor.classList.add('is-active');
      }
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      window.requestAnimationFrame(renderCursor);
    };
    renderCursor();

    document.querySelectorAll('a, button, .service-card, .avatar-sticker, .about__mood, .poster').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });

    window.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));

    document.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-active');
    });

    document.addEventListener('pointerenter', () => {
      if (cursorActive) cursor.classList.add('is-active');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.btn').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        button.style.translate = `${x * 0.07}px ${y * 0.11}px`;
      });

      button.addEventListener('pointerleave', () => {
        button.style.translate = '';
      });
    });
  }

  /* ---------- Project tilt ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach((frame) => {
      frame.addEventListener('pointermove', (event) => {
        const rect = frame.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        frame.style.setProperty('--ry', `${x * 4.5}deg`);
        frame.style.setProperty('--rx', `${y * -4.5}deg`);
      });

      frame.addEventListener('pointerleave', () => {
        frame.style.setProperty('--ry', '0deg');
        frame.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');

  if (toTop) {
    toTop.hidden = false;
    toTop.tabIndex = -1;

    const updateToTop = () => {
      const show = window.scrollY > 700;
      toTop.classList.toggle('is-visible', show);
      toTop.tabIndex = show ? 0 : -1;
    };

    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();

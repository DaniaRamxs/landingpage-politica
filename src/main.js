import './style.css'

// ============================================
// CAMPAÑA MARLENE LUYO - MAIN.JS (consolidado)
// ============================================

class CampanaApp {
  constructor() {
    this.header = document.getElementById('header');
    this.backToTopBtn = document.getElementById('backToTop');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.hamburgerBtn = document.getElementById('hamburgerBtn');
    this.lastScroll = 0;
    this.ticking = false;
    this._confettiActive = false;
    this._progressBar = null;
    this.electionDate = new Date('2026-04-12T07:00:00-05:00');
    this.init();
  }

  init() {
    this.setupLoader();
    this.setupHamburgerMenu();
    this.setupProgressBar();
    this.setupBackToTop();
    this.setupScrollHandlers();
    this.setupScrollReveal();
    this.setupSmoothScroll();
    this.setupCardEffects();
    this.setupTitleReveal();
    this.setupMapaDraw();
    this.setupMapaInteractivo();
    this.setupFAQ();
    this.setupCountdown();
    this.setupBannerPopup();
    this.setupFloatingShare();
    this.setupConfetti();
    this.setupCtaParticles();
    this.setupTimeline();
    this.setupStatsAnimation();
    this.setupCounterAnimations();
    this.setupKineticText();
  }

  // ============================================
  // 1. LOADER
  // ============================================
  setupLoader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.classList.add('hidden');
      }, 1600);
    });
  }

  // ============================================
  // 2. HAMBURGER MENU (con ARIA completo)
  // ============================================
  setupHamburgerMenu() {
    if (!this.hamburgerBtn || !this.mobileMenu) return;

    this.hamburgerBtn.addEventListener('click', () => {
      const isOpen = this.mobileMenu.classList.toggle('open');
      this.hamburgerBtn.classList.toggle('active');
      this.hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      this.mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        const firstLink = this.mobileMenu.querySelector('.mobile-menu-link');
        if (firstLink) firstLink.focus();
      }
    });

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => this._closeMobileMenu());
    });

    // Cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('open')) {
        this._closeMobileMenu();
        this.hamburgerBtn.focus();
      }
    });
  }

  _closeMobileMenu() {
    if (!this.mobileMenu) return;
    this.mobileMenu.classList.remove('open');
    this.hamburgerBtn?.classList.remove('active');
    this.hamburgerBtn?.setAttribute('aria-expanded', 'false');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ============================================
  // 3. BARRA DE PROGRESO DE LECTURA
  // ============================================
  setupProgressBar() {
    const bar = document.createElement('div');
    bar.setAttribute('aria-hidden', 'true');
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '3px',
      background: 'linear-gradient(90deg, #1B6B3A, #3DA86A)',
      width: '0%',
      zIndex: '99999',
      transition: 'width 0.15s ease-out',
      pointerEvents: 'none',
      boxShadow: '0 0 8px rgba(27,107,58,0.4)'
    });
    document.body.prepend(bar);
    this._progressBar = bar;
  }

  // ============================================
  // 4. BOTÓN VOLVER ARRIBA
  // ============================================
  setupBackToTop() {
    if (!this.backToTopBtn) return;
    this.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 5. SCROLL UNIFICADO (reemplaza 10+ listeners)
  // ============================================
  setupScrollHandlers() {
    const onScroll = () => {
      const y = window.scrollY;
      this._handleHeaderScroll(y);
      this._handleBackToTop(y);
      this._handleProgressBar(y);
      this._handleFloatingShare(y);
      this._handleParallax(y);
      this.ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(onScroll);
        this.ticking = true;
      }
    }, { passive: true });

    if (this.header) {
      this.header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
    }
  }

  _handleHeaderScroll(y) {
    if (!this.header) return;
    this.header.classList.toggle('scrolled', y > 50);
    if (y > 300 && y > this.lastScroll) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
    this.lastScroll = y;
  }

  _handleBackToTop(y) {
    if (this.backToTopBtn) {
      this.backToTopBtn.classList.toggle('visible', y > 500);
    }
  }

  _handleProgressBar(y) {
    if (!this._progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) this._progressBar.style.width = `${(y / total) * 100}%`;
  }

  _handleFloatingShare(y) {
    const floatingShare = document.getElementById('floatingShare');
    if (floatingShare) floatingShare.classList.toggle('show', y > 400);
  }

  _handleParallax(y) {
    const heroParallax = document.getElementById('heroParallax');
    if (heroParallax && y < 900) {
      const circles = heroParallax.querySelectorAll('.hero-parallax-circle');
      if (circles[0]) circles[0].style.transform = `translateY(${y * 0.12}px)`;
      if (circles[1]) circles[1].style.transform = `translateY(${y * -0.08}px)`;
      if (circles[2]) circles[2].style.transform = `translateY(${y * 0.05}px) translateX(${y * 0.03}px)`;
    }

    const statsParallax = document.getElementById('statsParallax');
    if (statsParallax) {
      const rect = statsParallax.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const shapes = statsParallax.querySelectorAll('.stats-parallax-shape');
        if (shapes[0]) shapes[0].style.transform = `translateY(${progress * 40}px)`;
        if (shapes[1]) shapes[1].style.transform = `translateY(${progress * -25}px)`;
        if (shapes[2]) shapes[2].style.transform = `translateY(${progress * 15}px) translateX(${progress * 10}px)`;
      }
    }

    // Generic parallax: any element with data-parallax="speed"
    if (!this._parallaxEls) {
      this._parallaxEls = [...document.querySelectorAll('[data-parallax]')];
    }
    this._parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${center * speed * -1}px)`;
      }
    });
  }

  // ============================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ============================================
  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = parent ? [...parent.querySelectorAll(':scope > .reveal')] : [];
          const idx = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? idx * 100 : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // 7. SMOOTH SCROLL (links internos)
  // ============================================
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = this.header ? this.header.offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerH - 16,
          behavior: 'smooth'
        });
        if (this.mobileMenu?.classList.contains('open')) this._closeMobileMenu();
      });
    });
  }

  // ============================================
  // 8. CARD 3D TILT (solo desktop)
  // ============================================
  setupCardEffects() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  // ============================================
  // 9. TITLE REVEAL ON SCROLL
  // ============================================
  setupTitleReveal() {
    document.querySelectorAll('.section-title').forEach(title => {
      const text = title.innerHTML;
      title.classList.add('title-reveal');
      title.innerHTML = `<span class="title-reveal-inner">${text}</span>`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          const parent = entry.target.closest('.section-header');
          if (parent) parent.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.title-reveal').forEach(el => observer.observe(el));
  }

  // ============================================
  // 10. MAPA: ANIMACIÓN DE DIBUJO
  // ============================================
  setupMapaDraw() {
    const mapaSvg = document.querySelector('.mapa-svg');
    if (!mapaSvg) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapaSvg.querySelectorAll('.provincia-path').forEach((p, i) => {
            setTimeout(() => p.classList.add('drawn'), i * 180);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(mapaSvg);
  }

  // ============================================
  // 11. MAPA PROVINCIAS INTERACTIVO (+ touch)
  // ============================================
  setupMapaInteractivo() {
    const paths = document.querySelectorAll('.provincia-path');
    const items = document.querySelectorAll('.provincia-item');
    if (!paths.length) return;

    const activate = nombre => {
      paths.forEach(p => p.classList.toggle('active', p.dataset.provincia === nombre));
      items.forEach(it => it.classList.toggle('active', it.dataset.target === nombre));
    };
    const deactivate = () => {
      paths.forEach(p => p.classList.remove('active'));
      items.forEach(it => it.classList.remove('active'));
    };

    paths.forEach(p => {
      p.addEventListener('mouseenter', () => activate(p.dataset.provincia));
      p.addEventListener('mouseleave', deactivate);
      p.addEventListener('touchstart', e => {
        e.preventDefault();
        activate(p.dataset.provincia);
      }, { passive: false });
      p.addEventListener('click', () => {
        const nombre = p.dataset.provincia;
        let target = null;
        items.forEach(it => { if (it.dataset.target === nombre) target = it; });
        if (target) {
          activate(nombre);
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.transition = 'all 0.3s ease';
          target.style.boxShadow = '0 0 0 3px var(--verde-esperanza)';
          target.style.background = 'var(--verde-claro)';
          setTimeout(() => { target.style.boxShadow = ''; target.style.background = ''; }, 1500);
        }
      });
    });

    items.forEach(it => {
      it.addEventListener('mouseenter', () => activate(it.dataset.target));
      it.addEventListener('mouseleave', deactivate);
      it.addEventListener('click', () => {
        const nombre = it.dataset.target;
        activate(nombre);
        const mapaWrap = document.querySelector('.mapa-wrap');
        if (mapaWrap && window.innerWidth < 900) mapaWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        paths.forEach(p => {
          if (p.dataset.provincia === nombre) {
            p.style.transition = 'all 0.2s ease';
            p.style.fill = '#6EE29A';
            setTimeout(() => { p.style.fill = ''; }, 800);
          }
        });
      });
    });

    document.addEventListener('touchstart', e => {
      if (!e.target.closest('.mapa-svg') && !e.target.closest('.provincia-item')) deactivate();
    });
  }

  // ============================================
  // 12. FAQ ACCORDION (con ARIA)
  // ============================================
  setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ============================================
  // 13. COUNTDOWN
  // ============================================
  setupCountdown() {
    const pad = n => String(n).padStart(2, '0');
    const el = id => document.getElementById(id);

    const update = () => {
      const diff = this.electionDate - new Date();
      const days = Math.max(0, Math.floor(diff / 86400000));
      const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
      const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
      const secs = Math.max(0, Math.floor((diff % 60000) / 1000));
      if (el('cd-days')) el('cd-days').textContent = days;
      if (el('cd-hours')) el('cd-hours').textContent = pad(hours);
      if (el('cd-mins')) el('cd-mins').textContent = pad(mins);
      if (el('cd-secs')) el('cd-secs').textContent = pad(secs);
    };

    update();
    setInterval(update, 1000);
  }

  // ============================================
  // 14. BANNER POPUP
  // ============================================
  setupBannerPopup() {
    const diff = this.electionDate - new Date();
    const days = Math.floor(diff / 86400000);
    const bannerEl = document.getElementById('bannerPopup');
    const bannerDays = document.getElementById('bannerDays');
    if (!bannerEl || days <= 0) return;
    if (bannerDays) bannerDays.textContent = days;
    setTimeout(() => bannerEl.classList.add('show'), 2500);
    document.getElementById('bannerClose')?.addEventListener('click', () => bannerEl.classList.remove('show'));
    setTimeout(() => bannerEl.classList.remove('show'), 10500);
  }

  // ============================================
  // 15. FLOATING SHARE
  // ============================================
  setupFloatingShare() {
    const fsToggle = document.getElementById('fsToggle');
    const fsCopy = document.getElementById('fsCopy');

    fsToggle?.addEventListener('click', () => {
      document.getElementById('floatingShare')?.classList.toggle('open');
    });

    fsCopy?.addEventListener('click', () => {
      navigator.clipboard.writeText('https://marleneluyo.com').then(() => {
        fsCopy.style.background = '#C9A94E';
        setTimeout(() => { fsCopy.style.background = ''; }, 1500);
      }).catch(() => { });
    });
  }

  // ============================================
  // 16. CONFETTI 🧹 (con throttle)
  // ============================================
  setupConfetti() {
    const triggers = document.querySelectorAll(
      '.escobita, .nav-logo, header img[alt*="Logo"], header img[alt*="logo"], #heroEscobita, #escobita-trigger, .broom-trigger'
    );
    triggers.forEach(trigger => {
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', e => {
        e.preventDefault();
        this.launchConfetti(e.clientX, e.clientY);
      });
    });
  }

  launchConfetti(originX, originY) {
    if (this._confettiActive) return;
    this._confettiActive = true;
    setTimeout(() => { this._confettiActive = false; }, 2000);

    const colors = ['#1B6B3A', '#3DA86A', '#C9A94E', '#E8F5EC', '#FFD700', '#28854A', '#FFFFFF'];
    const shapes = ['square', 'circle', 'strip'];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 8 + 4;
      let w = size, h = size, radius = '0';
      if (shape === 'circle') radius = '50%';
      else if (shape === 'strip') { w = size * 0.4; h = size * 2.5; radius = '2px'; }

      Object.assign(el.style, {
        position: 'fixed',
        left: `${originX}px`,
        top: `${originY}px`,
        width: `${w}px`,
        height: `${h}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: radius,
        pointerEvents: 'none',
        zIndex: '99999',
        opacity: '1'
      });

      fragment.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 400 + 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 300;
      const rotateEnd = Math.random() * 720 - 360;
      const duration = Math.random() * 1200 + 1500;

      el.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${vx * 0.5}px,${vy * 0.3}px) rotate(${rotateEnd * 0.5}deg) scale(1)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${vx * 0.7}px,${vy * 0.1 + 400}px) rotate(${rotateEnd}deg) scale(0.6)`, opacity: 0.6, offset: 0.7 },
        { transform: `translate(${vx * 0.8}px,${vy * -0.1 + 700}px) rotate(${rotateEnd * 1.2}deg) scale(0)`, opacity: 0 }
      ], { duration, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' }).onfinish = () => el.remove();
    }

    document.body.appendChild(fragment);
  }

  // ============================================
  // 17. CTA PARTICLES
  // ============================================
  setupCtaParticles() {
    const container = document.getElementById('ctaParticles');
    if (!container) return;
    const colors = ['rgba(255,255,255,0.3)', 'rgba(201,169,78,0.3)', 'rgba(255,255,255,0.15)'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'cta-particle';
      const size = Math.random() * 6 + 2;
      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        background: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${Math.random() * 10 + 8}s`,
        animationDelay: `${Math.random() * 10}s`
      });
      fragment.appendChild(p);
    }
    container.appendChild(fragment);
  }

  // ============================================
  // 18. TIMELINE ANIMATION
  // ============================================
  setupTimeline() {
    const timeline = document.getElementById('mainTimeline');
    if (!timeline) return;
    const items = timeline.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('tl-drawn');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('tl-visible'), 300 + i * 250);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(timeline);
  }

  // ============================================
  // 19. ESTADÍSTICAS ANIMADAS
  // ============================================
  setupStatsAnimation() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
            if (el.dataset.animated) return;
            el.dataset.animated = 'true';
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const step = now => {
              const eased = 1 - Math.pow(1 - Math.min((now - start) / 2000, 1), 3);
              el.textContent = Math.floor(eased * target).toLocaleString('es-PE') + suffix;
              if (eased < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          });

          entry.target.querySelectorAll('.stat-bar-fill[data-width]').forEach((bar, k) => {
            setTimeout(() => { bar.style.width = `${bar.dataset.width}%`; }, k * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsGrid);
  }

  // ============================================
  // 20. CONTADORES ANIMADOS ([data-count])
  // ============================================
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.animated) return;
        const target = parseInt(entry.target.dataset.count, 10);
        if (isNaN(target)) return;
        entry.target.dataset.animated = 'true';
        this.animateNumber(entry.target, target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  animateNumber(el, target, duration = 2000) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      // Elastic out: slight overshoot then settles
      const eased = t === 1 ? 1
        : 1 - Math.pow(2, -10 * t) * Math.cos((t * 10 - 0.75) * (2 * Math.PI) / 3);
      const val = Math.min(Math.round(eased * target), target);
      el.textContent = val.toLocaleString('es-PE') + suffix;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es-PE') + suffix;
        el.classList.add('counter-done');
        setTimeout(() => el.classList.remove('counter-done'), 900);
      }
    };
    requestAnimationFrame(step);
  }

  // ============================================
  // 21. TEXTO CINÉTICO (word-by-word reveal)
  // ============================================
  setupKineticText() {
    // Targets: [data-kinetic] attrs + all .section-subtitle with plain text
    const targets = [
      ...document.querySelectorAll('[data-kinetic]'),
      ...document.querySelectorAll('.section-subtitle:not([data-kinetic])')
    ];

    targets.forEach(el => {
      // Skip if already processed or has nested HTML elements
      if (el.dataset.kineticDone) return;
      if (el.children.length > 0) return; // has child elements, skip
      const text = el.textContent.trim();
      if (!text) return;

      const words = text.split(/\s+/);
      el.innerHTML = words.map((w, i) =>
        `<span class="k-word" style="transition-delay:${i * 50}ms">${w}</span>`
      ).join(' ');
      el.classList.add('k-ready');
      el.dataset.kineticDone = '1';
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('k-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.k-ready').forEach(el => obs.observe(el));
  }

  // ============================================
  // 22. STICKY SECTION HEADERS
  // ============================================
  setupStickyHeaders() {
    document.querySelectorAll('.sticky-section-header').forEach(header => {
      // Sentinel: invisible 1px div placed just before the header
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none;';
      header.parentElement.style.position = 'relative';
      header.parentElement.insertBefore(sentinel, header);

      const obs = new IntersectionObserver(([entry]) => {
        header.classList.toggle('stuck', !entry.isIntersecting);
      }, { rootMargin: `-${(this.header?.offsetHeight || 64) + 1}px 0px 0px 0px` });

      obs.observe(sentinel);
    });
  }
}

// ============================================
// INICIALIZAR
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CampanaApp());
} else {
  new CampanaApp();
}

// ============================================
// EMAIL OFUSCADO (sin dependencia de Cloudflare)
// ============================================
document.getElementById('contactEmail')?.addEventListener('click', function (e) {
  e.preventDefault();
  window.location.href = `mailto:${this.dataset.user}@${this.dataset.domain}`;
});

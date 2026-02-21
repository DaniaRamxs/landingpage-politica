import './style.css'

// ============================================
// CAMPAÑA MARLENE LUYO - MAIN.JS
// ============================================

class CampanaApp {
  constructor() {
    this.header = document.querySelector('header');
    this.backToTopBtn = document.getElementById('backToTop');
    this.lastScroll = 0;
    this.ticking = false;
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupSmoothScroll();
    this.setupHeaderScroll();
    this.setupBackToTop();
    this.setupCardEffects();
    this.setupProgressBar();
    this.setupCounterAnimations();
    this.setupConfetti();
    this.setupPageEntrance();
  }

  // ============================================
  // 1. SCROLL REVEAL (IntersectionObserver)
  // ============================================
  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Escalonar hermanos con clase .reveal
          const parent = entry.target.parentElement;
          const siblings = parent ? [...parent.querySelectorAll(':scope > .reveal')] : [];
          const idx = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? idx * 100 : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // 2. SMOOTH SCROLL (links internos)
  // ============================================
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerH = this.header ? this.header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ============================================
  // 3. HEADER SCROLL EFFECT
  // ============================================
  setupHeaderScroll() {
    if (!this.header) return;

    const onScroll = () => {
      const y = window.scrollY;

      // Glassmorphism cuando se baja
      this.header.classList.toggle('scrolled', y > 40);

      // Ocultar/mostrar header según dirección
      if (y > 300 && y > this.lastScroll) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }

      this.lastScroll = y;
      this.ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(onScroll);
        this.ticking = true;
      }
    }, { passive: true });

    // Transición suave
    this.header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
  }

  // ============================================
  // 4. BOTÓN VOLVER ARRIBA
  // ============================================
  setupBackToTop() {
    if (!this.backToTopBtn) return;

    window.addEventListener('scroll', () => {
      this.backToTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    this.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 5. CARD 3D TILT EFFECT
  // ============================================
  setupCardEffects() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    // Solo en desktop (no touch)
    if ('ontouchstart' in window) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;

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
  // 6. BARRA DE PROGRESO DE LECTURA
  // ============================================
  setupProgressBar() {
    const bar = document.createElement('div');
    bar.setAttribute('aria-hidden', 'true');
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '3px',
      background: 'linear-gradient(90deg, #3D7C59, #4CAF6E)',
      width: '0%',
      zIndex: '9999',
      transition: 'width 0.15s ease-out',
      pointerEvents: 'none'
    });
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      bar.style.width = `${(window.scrollY / total) * 100}%`;
    }, { passive: true });
  }

  // ============================================
  // 7. CONTADORES ANIMADOS
  // ============================================
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
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

  animateNumber(el, target, duration = 1800) {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('es-PE');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ============================================
  // 8. CONFETTI 🧹 (escobita)
  // ============================================
  setupConfetti() {
    // Buscar cualquier elemento que funcione como trigger de escobita
    // Soporta: .escobita, .logo-icon, el logo del header, o imagen del logo
    const triggers = document.querySelectorAll(
      '.escobita, .logo-icon, header img[alt*="Logo"], header img[alt*="logo"], .broom-trigger'
    );

    triggers.forEach(trigger => {
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.launchConfetti(e.clientX, e.clientY);
      });
    });
  }

  launchConfetti(originX, originY) {
    const colors = ['#3D7C59', '#4CAF6E', '#C9A94E', '#E8F5E9', '#FFD700', '#2A6B46', '#FFFFFF'];
    const shapes = ['square', 'circle', 'strip'];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 8 + 4;

      let width = size, height = size, radius = '0';
      if (shape === 'circle') {
        radius = '50%';
      } else if (shape === 'strip') {
        width = size * 0.4;
        height = size * 2.5;
        radius = '2px';
      }

      Object.assign(el.style, {
        position: 'fixed',
        left: `${originX}px`,
        top: `${originY}px`,
        width: `${width}px`,
        height: `${height}px`,
        background: color,
        borderRadius: radius,
        pointerEvents: 'none',
        zIndex: '99999',
        opacity: '1'
      });

      document.body.appendChild(el);

      // Física: ángulo aleatorio + gravedad
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 400 + 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 300; // impulso hacia arriba
      const rotateEnd = Math.random() * 720 - 360;
      const duration = Math.random() * 1200 + 1500;

      el.animate([
        {
          transform: 'translate(0, 0) rotate(0deg) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${vx * 0.5}px, ${vy * 0.3}px) rotate(${rotateEnd * 0.5}deg) scale(1)`,
          opacity: 1,
          offset: 0.3
        },
        {
          transform: `translate(${vx * 0.7}px, ${vy * 0.1 + 400}px) rotate(${rotateEnd}deg) scale(0.6)`,
          opacity: 0.6,
          offset: 0.7
        },
        {
          transform: `translate(${vx * 0.8}px, ${vy * -0.1 + 700}px) rotate(${rotateEnd * 1.2}deg) scale(0)`,
          opacity: 0
        }
      ], {
        duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      }).onfinish = () => el.remove();
    }
  }

  // ============================================
  // 9. ENTRADA INICIAL DE PÁGINA
  // ============================================
  setupPageEntrance() {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '1';
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
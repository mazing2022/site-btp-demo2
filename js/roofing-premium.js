(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const revealNodes = Array.from(document.querySelectorAll('.reveal'));
  const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]'));
  const counterNodes = Array.from(document.querySelectorAll('[data-counter]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  let ticking = false;

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  };

  const toggleHeaderState = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 14);
  };

  const updateActiveLink = () => {
    if (!sections.length || !navLinks.length || !header) return;

    const checkpoint = window.scrollY + header.offsetHeight + 82;
    let activeId = sections[0].id;

    sections.forEach((section) => {
      if (checkpoint >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      link.classList.toggle('is-active', href.slice(1) === activeId);
    });
  };

  const updateParallax = () => {
    if (!parallaxNodes.length || prefersReducedMotion) return;

    const offsetY = window.scrollY;

    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.speed || 0.1);
      const scale = Number(node.dataset.scale || 1);
      const shift = clamp(offsetY * speed, -130, 210);
      node.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
    });
  };

  const onScroll = () => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(() => {
      toggleHeaderState();
      updateActiveLink();
      updateParallax();
      ticking = false;
    });
  };

  const animateCounter = (node) => {
    const target = Number(node.dataset.value || 0);
    const decimals = Number(node.dataset.decimals || 0);
    const suffix = node.dataset.suffix || '';

    if (Number.isNaN(target)) return;

    const duration = 1200;
    const startTime = performance.now();

    const formatValue = (value) => {
      if (decimals > 0) {
        return `${value.toFixed(decimals)}${suffix}`;
      }

      return `${Math.round(value).toLocaleString('fr-FR')}${suffix}`;
    };

    const step = (currentTime) => {
      const progress = clamp((currentTime - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      node.textContent = formatValue(value);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        node.textContent = formatValue(target);
      }
    };

    window.requestAnimationFrame(step);
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const opened = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!opened));
      nav.classList.toggle('open', !opened);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('open')) return;

      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!nav.contains(target) && !menuToggle.contains(target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) {
        closeMenu();
      }
    });
  }

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';

        filterButtons.forEach((item) => {
          item.classList.toggle('is-active', item === button);
        });

        projectCards.forEach((card) => {
          const tokens = (card.dataset.category || '').split(/\s+/).filter(Boolean);
          const visible = filter === 'all' || tokens.includes(filter);
          card.classList.toggle('hidden', !visible);
        });
      });
    });
  }

  if (revealNodes.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -48px 0px' }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  if (counterNodes.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const node = entry.target;
          if (!(node instanceof HTMLElement)) return;
          if (node.dataset.counted === 'true') return;

          node.dataset.counted = 'true';

          if (prefersReducedMotion) {
            const decimals = Number(node.dataset.decimals || 0);
            const value = Number(node.dataset.value || 0);
            const suffix = node.dataset.suffix || '';

            if (decimals > 0) {
              node.textContent = `${value.toFixed(decimals)}${suffix}`;
            } else {
              node.textContent = `${Math.round(value).toLocaleString('fr-FR')}${suffix}`;
            }
          } else {
            animateCounter(node);
          }

          observer.unobserve(node);
        });
      },
      { threshold: 0.35 }
    );

    counterNodes.forEach((node) => counterObserver.observe(node));
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

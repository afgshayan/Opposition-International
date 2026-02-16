// Opposition International - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

  // ═══════════════════ URGENT BANNER ═══════════════════
  const urgentBanner = document.getElementById('urgentBanner');
  const urgentClose = document.getElementById('urgentClose');

  if (urgentBanner && urgentClose) {
    urgentClose.addEventListener('click', () => {
      urgentBanner.classList.add('hidden');
      // Adjust nav position if needed
      document.body.style.paddingTop = '0';
    });
  }

  // ═══════════════════ NAVIGATION ═══════════════════
  const nav = document.getElementById('nav');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ═══════════════════ SMOOTH SCROLL ═══════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ═══════════════════ FAQ ACCORDION ═══════════════════
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ═══════════════════ SCROLL ANIMATIONS ═══════════════════
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elements to animate
  const animateElements = document.querySelectorAll(
    '.bento-item, .campaign-card, .news-card, .team-card, .event-card, .value-card, ' +
    '.story-card, .action-card, .report-card, .event-preview-card, .faq-item, .award-item'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observer.observe(el);
  });

  // ═══════════════════ COUNTER ANIMATION ═══════════════════
  const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }

      let displayValue = Math.floor(current);
      if (target >= 1000) {
        displayValue = displayValue.toLocaleString();
      }
      element.textContent = displayValue + suffix;
    }, stepTime);
  };

  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const countValue = element.dataset.count;

        if (countValue) {
          const target = parseInt(countValue);
          let suffix = '';

          // Determine suffix
          if (target >= 50000) {
            suffix = '+';
          } else if (target >= 500) {
            suffix = '+';
          }

          animateCounter(element, target, suffix);
        } else {
          // Fallback for elements without data-count
          const text = element.textContent;
          const value = parseInt(text.replace(/[^\d]/g, ''));
          const suffix = text.includes('+') ? '+' : (text.includes('K') ? 'K' : '');

          if (!isNaN(value) && value > 0) {
            animateCounter(element, value, suffix);
          }
        }

        impactObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.impact-number, .hero-stat-number').forEach(el => {
    impactObserver.observe(el);
  });

  // ═══════════════════ FORM HANDLING ═══════════════════
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const email = this.querySelector('input[type="email"]');
      if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        e.preventDefault();
        email.style.borderColor = 'var(--red)';
        email.focus();
        return;
      }

      // Show success message for newsletter
      if (this.classList.contains('newsletter-form')) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          email.value = '';
        }, 3000);
      }
    });
  });

  // ═══════════════════ DONATION BUTTONS ═══════════════════
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('custom-amount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (customAmount) {
        customAmount.value = '';
      }
    });
  });

  if (customAmount) {
    customAmount.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
    });
  }

  // ═══════════════════ PARALLAX EFFECT ═══════════════════
  const parallaxElements = document.querySelectorAll('.hero-bg, .cta-bg, .page-hero-bg');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach(el => {
        const speed = 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  // ═══════════════════ PARTNERS SCROLL ═══════════════════
  // Optional: Auto-scroll partners if there are many
  const partnersGrid = document.querySelector('.partners-grid');
  if (partnersGrid && partnersGrid.children.length > 6) {
    // Could add auto-scroll animation here
  }

});

// Add animation styles
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});

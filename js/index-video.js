// ═══════════════════════════════════════════════════════════
// INDEX-VIDEO.JS — Interactive components for index-video.html
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {

  // ═══════════════ TABBED CAMPAIGNS FILTER ═══════════════
  const tabs = document.querySelectorAll('.v3-tab');
  const campaignCards = document.querySelectorAll('.v3-campaign-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;

      campaignCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ═══════════════ TESTIMONIAL CAROUSEL ═══════════════
  const track = document.getElementById('v3TestimonialTrack');
  const prevBtn = document.querySelector('.v3-testimonial-prev');
  const nextBtn = document.querySelector('.v3-testimonial-next');
  const dots = document.querySelectorAll('.v3-dot');

  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const cards = track.querySelectorAll('.v3-testimonial-card');
    const totalSlides = cards.length;

    function getCardsPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function updateSlider() {
      const cardsPerView = getCardsPerView();
      const maxSlide = Math.max(0, totalSlides - cardsPerView);
      if (currentSlide > maxSlide) currentSlide = maxSlide;

      const gap = 24;
      const cardWidth = cards[0].offsetWidth + gap;
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', () => {
      const cardsPerView = getCardsPerView();
      const maxSlide = Math.max(0, totalSlides - cardsPerView);
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
      }
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateSlider();
      });
    });

    window.addEventListener('resize', updateSlider);
  }

  // ═══════════════ ANIMATED COUNTERS ═══════════════
  const counterElements = document.querySelectorAll('.v3-counter-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target >= 1000) {
        el.textContent = current.toLocaleString();
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Show + if original had it
        if (target === 500) el.textContent = '500+';
        if (target === 2400) el.textContent = '2,400+';
        if (target === 50000) el.textContent = '50,000+';
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for counters
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ═══════════════ SCROLL ANIMATIONS ═══════════════
  const animateElements = document.querySelectorAll(
    '.v3-about-grid, .v3-campaign-card, .v3-team-card, .v3-timeline-card, .v3-news-card, .v3-map-grid'
  );

  if (animateElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      fadeObserver.observe(el);
    });
  }

  // ═══════════════ DONATION WIDGET ═══════════════
  const donateAmountBtns = document.querySelectorAll('.v3-donate-btn');
  const donateSubmitBtn = document.querySelector('.v3-donate-card .btn-primary');
  const freqBtns = document.querySelectorAll('.v3-freq-btn');

  let selectedAmount = '$50';
  let selectedFrequency = 'Monthly';

  donateAmountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      donateAmountBtns.forEach(b => b.classList.remove('v3-donate-btn--active'));
      btn.classList.add('v3-donate-btn--active');
      selectedAmount = btn.textContent;
      updateDonateButton();
    });
  });

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('v3-freq-btn--active'));
      btn.classList.add('v3-freq-btn--active');
      selectedFrequency = btn.textContent;
      updateDonateButton();
    });
  });

  function updateDonateButton() {
    if (donateSubmitBtn) {
      donateSubmitBtn.textContent = `Donate ${selectedAmount} ${selectedFrequency}`;
    }
  }

});

// ═══════════════ FADE IN KEYFRAMES ═══════════════
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Opposition International - Advanced Layer Slider

class LayerSlider {
  constructor(element, options = {}) {
    this.slider = element;
    this.options = {
      autoplay: true,
      autoplayDelay: 7000,
      animationDuration: 1000,
      pauseOnHover: true,
      keyboard: true,
      swipe: true,
      ...options
    };

    this.slides = this.slider.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.currentSlide = 0;
    this.isAnimating = false;
    this.autoplayTimer = null;
    this.progressTimer = null;
    this.progress = 0;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    this.createElements();
    this.bindEvents();
    this.goToSlide(0);

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  createElements() {
    // Get existing elements
    this.prevBtn = this.slider.querySelector('.slider-prev');
    this.nextBtn = this.slider.querySelector('.slider-next');
    this.pagination = this.slider.querySelector('.slider-pagination');
    this.paginationDots = this.pagination?.querySelectorAll('.pagination-dot');
    this.progressBar = this.slider.querySelector('.progress-bar');
  }

  bindEvents() {
    // Navigation arrows
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Pagination dots
    this.paginationDots?.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    if (this.options.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    }

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.slider.addEventListener('mouseleave', () => this.resumeAutoplay());
    }

    // Touch/Swipe support
    if (this.options.swipe) {
      this.initSwipe();
    }

    // Visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    });
  }

  initSwipe() {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    const threshold = 50;
    const restraint = 100;

    this.slider.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      startX = touch.pageX;
      startY = touch.pageY;
    }, { passive: true });

    this.slider.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      distX = touch.pageX - startX;
      distY = touch.pageY - startY;

      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
    }, { passive: true });
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide) return;

    this.isAnimating = true;
    this.resetProgress();

    const prevSlide = this.slides[this.currentSlide];
    const nextSlide = this.slides[index];

    // Update classes
    prevSlide.classList.remove('active');
    prevSlide.classList.add('prev');
    nextSlide.classList.add('active');

    // Update pagination
    this.paginationDots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update current slide
    this.currentSlide = index;

    // Animation complete
    setTimeout(() => {
      prevSlide.classList.remove('prev');
      this.isAnimating = false;

      // Restart progress if autoplay is active
      if (this.options.autoplay && !this.isPaused) {
        this.startProgress();
      }
    }, this.options.animationDuration);
  }

  next() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.isPaused = false;
    this.startProgress();
  }

  pauseAutoplay() {
    this.isPaused = true;
    this.stopProgress();
  }

  resumeAutoplay() {
    if (this.options.autoplay) {
      this.isPaused = false;
      this.startProgress();
    }
  }

  startProgress() {
    this.stopProgress();

    const startTime = Date.now();
    const duration = this.options.autoplayDelay;

    const animate = () => {
      if (this.isPaused) return;

      const elapsed = Date.now() - startTime;
      this.progress = Math.min(elapsed / duration, 1);

      if (this.progressBar) {
        this.progressBar.style.width = `${this.progress * 100}%`;
      }

      if (this.progress < 1) {
        this.progressTimer = requestAnimationFrame(animate);
      } else {
        this.next();
      }
    };

    this.progressTimer = requestAnimationFrame(animate);
  }

  stopProgress() {
    if (this.progressTimer) {
      cancelAnimationFrame(this.progressTimer);
      this.progressTimer = null;
    }
  }

  resetProgress() {
    this.stopProgress();
    this.progress = 0;
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }

    // Reset pagination dot animations
    this.paginationDots?.forEach(dot => {
      const progress = dot.querySelector('.dot-progress');
      if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight; // Trigger reflow
        progress.style.animation = '';
      }
    });
  }

  destroy() {
    this.stopProgress();
    // Remove event listeners if needed
  }
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const sliderElement = document.getElementById('layerSlider');

  if (sliderElement) {
    window.layerSlider = new LayerSlider(sliderElement, {
      autoplay: true,
      autoplayDelay: 7000,
      animationDuration: 1000,
      pauseOnHover: true,
      keyboard: true,
      swipe: true
    });
  }
});

// Parallax effect on scroll
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.layer-slider');

  if (slider) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const sliderHeight = slider.offsetHeight;

          if (scrolled < sliderHeight) {
            const parallaxValue = scrolled * 0.4;
            const opacityValue = 1 - (scrolled / sliderHeight) * 0.5;

            slider.style.transform = `translateY(${parallaxValue}px)`;

            const content = slider.querySelector('.slide.active .slide-content');
            if (content) {
              content.style.opacity = Math.max(opacityValue, 0);
              content.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true });
  }
});

// Ken Burns effect enhancement
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');

  slides.forEach((slide, index) => {
    const bg = slide.querySelector('.slide-bg img');
    if (bg) {
      // Random start position for Ken Burns
      const positions = [
        { x: '0%', y: '0%' },
        { x: '100%', y: '0%' },
        { x: '0%', y: '100%' },
        { x: '100%', y: '100%' },
        { x: '50%', y: '50%' }
      ];
      const pos = positions[index % positions.length];
      bg.style.transformOrigin = `${pos.x} ${pos.y}`;
    }
  });
});

// Intersection Observer for slider visibility
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('layerSlider');

  if (slider && window.layerSlider) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.layerSlider.resumeAutoplay();
        } else {
          window.layerSlider.pauseAutoplay();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(slider);
  }
});

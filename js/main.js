// Main JavaScript - Language Management & Initialization
class LanguageManager {
  constructor() {
    this.currentLang = this.getStoredLanguage();
    this.init();
  }

  getStoredLanguage() {
    return localStorage.getItem('selectedLanguage') || 'tr';
  }

  setLanguage(lang) {
    if (!translations[lang]) {
      console.error(`Language ${lang} not found`);
      return;
    }

    localStorage.setItem('selectedLanguage', lang);
    this.currentLang = lang;
    this.updateContent();
    this.updateActiveLanguageButton();

    // Notify other components
    if (typeof cart !== 'undefined') cart.updateCurrency();
    if (typeof auth !== 'undefined') auth.updateUI();

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  updateContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);

      if (translation) {
        // Check if it's an input placeholder
        if (element.tagName === 'INPUT' && element.hasAttribute('data-i18n-placeholder')) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.getTranslation(key);

      if (translation) {
        element.placeholder = translation;
      }
    });

    // Update currency displays
    this.updateCurrencyDisplays();

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }

  getTranslation(key) {
    const keys = key.split('.');
    let translation = translations[this.currentLang];

    for (let k of keys) {
      if (translation && translation[k] !== undefined) {
        translation = translation[k];
      } else {
        console.warn(`Translation not found for key: ${key}`);
        return null;
      }
    }

    return translation;
  }

  updateCurrencyDisplays() {
    const currency = currencyMap[this.currentLang];

    document.querySelectorAll('[data-currency]').forEach(element => {
      element.textContent = currency.code;
    });

    // Update prices if needed
    if (typeof cart !== 'undefined') {
      cart.updateCurrency();
    }
  }

  updateActiveLanguageButton() {
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });
  }

  init() {
    this.updateContent();
    this.updateActiveLanguageButton();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Language selector buttons
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        this.setLanguage(lang);
      });
    });
  }
}

// Product Modal Management
class ProductModalManager {
  constructor() {
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      const modal = btn.closest('.modal');
      if (modal) {
        btn.addEventListener('click', () => this.closeModal(modal));
      }
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });

    // Quantity buttons in modal
    const modalQtyMinus = document.querySelector('#productModal .qty-btn.minus');
    const modalQtyPlus = document.querySelector('#productModal .qty-btn.plus');
    const modalQtyInput = document.getElementById('modalProductQty');

    if (modalQtyMinus && modalQtyPlus && modalQtyInput) {
      modalQtyMinus.addEventListener('click', () => {
        const currentValue = parseInt(modalQtyInput.value);
        if (currentValue > 1) {
          modalQtyInput.value = currentValue - 1;
        }
      });

      modalQtyPlus.addEventListener('click', () => {
        const currentValue = parseInt(modalQtyInput.value);
        if (currentValue < 10) {
          modalQtyInput.value = currentValue + 1;
        }
      });
    }

    // Product tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = btn.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabName);
    });
  }
}

// Smooth Scroll for anchor links
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        if (href === '#' || href === '#!') {
          return;
        }

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Lazy Loading Images
class LazyLoadManager {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// Placeholder Images Generator (for demo)
class PlaceholderImageGenerator {
  static generate() {
    const products = [
      { id: 1, name: 'Silk Swaddle', color: '#E8D4D0' },
      { id: 2, name: 'Wool Swaddle', color: '#F4A460' },
      { id: 3, name: 'Cashmere Swaddle', color: '#C5E5DC' }
    ];

    // Create placeholder images using canvas
    products.forEach(product => {
      const images = document.querySelectorAll(`[data-product-id="${product.id}"] img`);

      images.forEach(img => {
        if (!img.src || img.src.includes('product-')) {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');

          // Background
          ctx.fillStyle = product.color;
          ctx.fillRect(0, 0, 400, 400);

          // Text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(product.name, 200, 200);

          // Convert to image
          img.src = canvas.toDataURL();
        }
      });
    });

    // Hero and designer section images
    this.generateHeroImages();
  }

  static generateHeroImages() {
    const patterns = [
      { selector: '.hero .product-image:nth-child(1) img', text: 'Animals Print', color: '#F5E6E8' },
      { selector: '.hero .product-image:nth-child(2) img', text: 'Geometric', color: '#D85845' },
      { selector: '.hero .product-image:nth-child(3) img', text: 'Nature', color: '#C5E5DC' },
      { selector: '.designer-image img', text: 'Custom Design', color: '#F4A460' },
      { selector: '.center-image img', text: 'Organic Cotton', color: '#E8D4D0' }
    ];

    patterns.forEach(pattern => {
      const img = document.querySelector(pattern.selector);
      if (img && (!img.src || img.src.includes('.jpg'))) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = pattern.color;
        ctx.fillRect(0, 0, 600, 600);

        // Pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * 600,
            Math.random() * 600,
            Math.random() * 50 + 20,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pattern.text, 300, 300);

        img.src = canvas.toDataURL();
      }
    });
  }
}

// Scroll Animations
class ScrollAnimationManager {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Add animation class to sections
      document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(section);
      });

      // Add CSS for animation
      const style = document.createElement('style');
      style.textContent = `
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Header Scroll Effect
class HeaderScrollEffect {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    if (!this.header) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        this.header.style.boxShadow = 'var(--shadow-md)';
      } else {
        this.header.style.boxShadow = 'var(--shadow-sm)';
      }

      this.lastScroll = currentScroll;
    });
  }
}

// Form Validation Helper
class FormValidator {
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validatePassword(password) {
    return password.length >= 6;
  }

  static validateRequired(value) {
    return value && value.trim().length > 0;
  }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Kleine Wunder - Initializing...');

  // Initialize managers
  const languageManager = new LanguageManager();
  const productModalManager = new ProductModalManager();
  const smoothScrollManager = new SmoothScrollManager();
  const lazyLoadManager = new LazyLoadManager();
  const scrollAnimationManager = new ScrollAnimationManager();
  const headerScrollEffect = new HeaderScrollEffect();

  // Generate placeholder images (for demo)
  PlaceholderImageGenerator.generate();

  console.log('✅ Kleine Wunder - Ready!');
  console.log(`📍 Current Language: ${languageManager.currentLang}`);

  // Add a welcome message to console
  console.log(`
    %c Kleine Wunder
    %c Naturkleidung
    %c Made with ❤️ for your little ones
  `,
    'font-size: 24px; font-weight: bold; font-family: cursive;',
    'font-size: 12px; font-style: italic;',
    'font-size: 14px; color: #D85845;'
  );
});

// Handle page visibility (pause animations when tab is not active)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations
    document.querySelectorAll('.floating-leaf, .fox-illustration').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations
    document.querySelectorAll('.floating-leaf, .fox-illustration').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LanguageManager,
    ProductModalManager,
    FormValidator,
    PlaceholderImageGenerator
  };
}

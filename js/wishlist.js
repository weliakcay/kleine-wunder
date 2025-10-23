// Wishlist/Favorites Management System
class Wishlist {
  constructor() {
    this.items = this.loadWishlist();
    this.init();
  }

  init() {
    this.updateUI();
    this.attachEventListeners();
  }

  loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.items));
    this.updateUI();
  }

  getCurrentLang() {
    return localStorage.getItem('selectedLanguage') || 'tr';
  }

  getTranslation(key) {
    const keys = key.split('.');
    let translation = translations[this.getCurrentLang()];
    keys.forEach(k => translation = translation[k]);
    return translation;
  }

  addItem(product) {
    const exists = this.items.find(item => item.id === product.id);

    if (!exists) {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        addedDate: new Date().toISOString()
      });

      this.saveWishlist();
      this.showNotification(this.getTranslation('wishlist.itemAdded'));
      return true;
    }

    return false;
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveWishlist();
    this.showNotification(this.getTranslation('wishlist.itemRemoved'));
  }

  toggleItem(product) {
    const exists = this.items.find(item => item.id === product.id);

    if (exists) {
      this.removeItem(product.id);
      return false;
    } else {
      this.addItem(product);
      return true;
    }
  }

  isInWishlist(productId) {
    return this.items.some(item => item.id === productId);
  }

  getItems() {
    return this.items;
  }

  getCount() {
    return this.items.length;
  }

  updateUI() {
    this.updateWishlistCount();
    this.updateWishlistButtons();
  }

  updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
      const count = this.getCount();
      wishlistCount.textContent = count;
      wishlistCount.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  updateWishlistButtons() {
    // Update all wishlist buttons on the page
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productCard = btn.closest('.product-card');
      if (productCard) {
        const productId = productCard.dataset.productId;
        const isWishlisted = this.isInWishlist(productId);
        const heartIcon = btn.querySelector('.heart-icon');

        if (heartIcon) {
          heartIcon.textContent = isWishlisted ? '♥' : '♡';
          btn.classList.toggle('active', isWishlisted);
        }
      }
    });

    // Update modal wishlist button
    const modalWishlistBtn = document.getElementById('modalAddToWishlist');
    if (modalWishlistBtn) {
      const modal = document.getElementById('productModal');
      if (modal && modal.dataset.productId) {
        const isWishlisted = this.isInWishlist(modal.dataset.productId);
        const heartIcon = modalWishlistBtn.querySelector('span');
        if (heartIcon) {
          heartIcon.textContent = isWishlisted ? '♥' : '♡';
          modalWishlistBtn.classList.toggle('active', isWishlisted);
        }
      }
    }
  }

  attachEventListeners() {
    // Wishlist buttons on product cards
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('.wishlist-btn');

      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();

        const productCard = wishlistBtn.closest('.product-card');
        if (productCard) {
          const productId = productCard.dataset.productId;
          const name = productCard.querySelector('.product-name').textContent;
          const priceText = productCard.querySelector('.price-amount').textContent;
          const price = parseFloat(priceText);
          const image = productCard.querySelector('img').src;

          const product = { id: productId, name, price, image };
          const isAdded = this.toggleItem(product);

          // Animate button
          wishlistBtn.classList.add('animating');
          setTimeout(() => wishlistBtn.classList.remove('animating'), 300);
        }
      }
    });

    // Modal wishlist button
    const modalWishlistBtn = document.getElementById('modalAddToWishlist');
    if (modalWishlistBtn) {
      modalWishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('productModal');

        if (modal && modal.dataset.productId) {
          const product = {
            id: modal.dataset.productId,
            name: modal.dataset.productName,
            price: parseFloat(modal.dataset.productPrice),
            image: modal.dataset.productImage
          };

          this.toggleItem(product);

          // Animate button
          modalWishlistBtn.classList.add('animating');
          setTimeout(() => modalWishlistBtn.classList.remove('animating'), 300);
        }
      });
    }

    // Wishlist link in user dropdown
    const wishlistLink = document.getElementById('wishlistLink');
    if (wishlistLink) {
      wishlistLink.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real app, this would navigate to a wishlist page
        this.showWishlistModal();
      });
    }
  }

  showWishlistModal() {
    // Create and show a simple wishlist modal (could be expanded)
    const lang = this.getCurrentLang();

    if (this.items.length === 0) {
      this.showNotification('Favorileriniz boş / Your wishlist is empty / Ihre Wunschliste ist leer', 'info');
      return;
    }

    // For demo, just show notification with count
    this.showNotification(
      `${this.getCount()} ${this.getTranslation('wishlist.viewWishlist')}`,
      'info'
    );
  }

  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    if (notification && notificationText) {
      notificationText.textContent = message;
      notification.className = 'notification show ' + type;

      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  clearWishlist() {
    this.items = [];
    this.saveWishlist();
  }
}

// Initialize wishlist when DOM is ready
let wishlist;
document.addEventListener('DOMContentLoaded', () => {
  wishlist = new Wishlist();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Wishlist;
}

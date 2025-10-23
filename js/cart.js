// Shopping Cart Management System
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.currency = this.getCurrency();
    this.shippingThreshold = 500; // Free shipping above this amount (in base currency)
    this.init();
  }

  init() {
    this.updateUI();
    this.attachEventListeners();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateUI();
  }

  getCurrency() {
    const lang = localStorage.getItem('selectedLanguage') || 'tr';
    return currencyMap[lang];
  }

  updateCurrency() {
    this.currency = this.getCurrency();
    this.updateUI();
  }

  formatPrice(amount) {
    const formatted = amount.toFixed(2);
    if (this.currency.position === 'before') {
      return `${this.currency.symbol}${formatted}`;
    }
    return `${formatted} ${this.currency.code}`;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item =>
      item.id === product.id && item.size === product.size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: product.size,
        image: product.image,
        quantity: quantity
      });
    }

    this.saveCart();
    this.showNotification(translations[this.getCurrentLang()].cart.itemAdded);
    this.openCartSidebar();
  }

  removeItem(productId, size) {
    this.items = this.items.filter(item =>
      !(item.id === productId && item.size === size)
    );
    this.saveCart();
    this.showNotification(translations[this.getCurrentLang()].cart.itemRemoved);
  }

  updateQuantity(productId, size, quantity) {
    const item = this.items.find(item =>
      item.id === productId && item.size === size
    );

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, size);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getSubtotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getShipping() {
    const subtotal = this.getSubtotal();
    return subtotal >= this.shippingThreshold ? 0 : 50;
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getCurrentLang() {
    return localStorage.getItem('selectedLanguage') || 'tr';
  }

  updateUI() {
    this.updateBadge();
    this.updateCartSidebar();
  }

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    const count = this.getTotalItems();

    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  updateCartSidebar() {
    const cartItems = document.getElementById('cartItems');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty" data-i18n="cart.empty">
          ${translations[this.getCurrentLang()].cart.empty}
        </div>
      `;
    } else {
      const lang = this.getCurrentLang();
      cartItems.innerHTML = this.items.map(item => `
        <div class="cart-item" data-product-id="${item.id}" data-size="${item.size}">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-size">${translations[lang].product.size}: ${item.size}</p>
            <p class="cart-item-price">${this.formatPrice(item.price)}</p>
          </div>
          <div class="cart-item-quantity">
            <button class="qty-btn minus" data-action="decrease">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn plus" data-action="increase">+</button>
          </div>
          <button class="cart-item-remove" aria-label="Remove">&times;</button>
        </div>
      `).join('');

      // Attach event listeners to cart items
      this.attachCartItemListeners();
    }

    if (cartItemCount) {
      cartItemCount.textContent = `(${this.getTotalItems()})`;
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = this.formatPrice(this.getSubtotal());
    }

    if (cartShipping) {
      const shipping = this.getShipping();
      if (shipping === 0) {
        cartShipping.textContent = translations[this.getCurrentLang()].cart.freeShipping;
        cartShipping.classList.add('free');
      } else {
        cartShipping.textContent = this.formatPrice(shipping);
        cartShipping.classList.remove('free');
      }
    }

    if (cartTotal) {
      cartTotal.textContent = this.formatPrice(this.getTotal());
    }
  }

  attachCartItemListeners() {
    // Quantity buttons
    document.querySelectorAll('.cart-item .qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        const size = cartItem.dataset.size;
        const action = e.target.dataset.action;
        const item = this.items.find(i => i.id === productId && i.size === size);

        if (item) {
          const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(productId, size, newQty);
        }
      });
    });

    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        const size = cartItem.dataset.size;
        this.removeItem(productId, size);
      });
    });
  }

  attachEventListeners() {
    // Cart button - open sidebar
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.openCartSidebar());
    }

    // Close cart buttons
    document.querySelectorAll('.close-cart').forEach(btn => {
      btn.addEventListener('click', () => this.closeCartSidebar());
    });

    // Close sidebar when clicking outside
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        if (e.target === sidebar) {
          this.closeCartSidebar();
        }
      });
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');

        if (productCard) {
          const productId = productCard.dataset.productId;
          const name = productCard.querySelector('.product-name').textContent;
          const priceText = productCard.querySelector('.price-amount').textContent;
          const price = parseFloat(priceText);
          const size = productCard.querySelector('.product-size').textContent;
          const image = productCard.querySelector('img').src;

          this.addItem({
            id: productId,
            name: name,
            price: price,
            size: size,
            image: image
          }, 1);
        }
      });
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          this.openProductModal(productCard);
        }
      });
    });
  }

  openProductModal(productCard) {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const productId = productCard.dataset.productId;
    const name = productCard.querySelector('.product-name').textContent;
    const priceText = productCard.querySelector('.price-amount').textContent;
    const price = parseFloat(priceText);
    const image = productCard.querySelector('img').src;

    // Populate modal
    document.getElementById('modalProductImage').src = image;
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductPrice').textContent = this.formatPrice(price);

    // Store product data on modal
    modal.dataset.productId = productId;
    modal.dataset.productName = name;
    modal.dataset.productPrice = price;
    modal.dataset.productImage = image;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Attach modal add to cart button
    const modalAddBtn = document.getElementById('modalAddToCart');
    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        const size = document.getElementById('modalProductSize').value;
        const quantity = parseInt(document.getElementById('modalProductQty').value);

        this.addItem({
          id: productId,
          name: name,
          price: price,
          size: size,
          image: image
        }, quantity);

        this.closeProductModal();
      };
    }
  }

  closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
      sidebar.classList.add('active');
    }
  }

  closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
      sidebar.classList.remove('active');
    }
  }

  showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    if (notification && notificationText) {
      notificationText.textContent = message;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }
}

// Initialize cart when DOM is ready
let cart;
document.addEventListener('DOMContentLoaded', () => {
  cart = new ShoppingCart();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingCart;
}

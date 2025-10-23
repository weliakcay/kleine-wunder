// User Authentication System (Demo/Mock Implementation)
class UserAuth {
  constructor() {
    this.currentUser = this.loadUser();
    this.init();
  }

  init() {
    this.updateUI();
    this.attachEventListeners();
  }

  loadUser() {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = user;
    this.updateUI();
  }

  removeUser() {
    localStorage.removeItem('user');
    this.currentUser = null;
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

  login(email, password) {
    // Demo implementation - in production, this would call an API
    if (!email || !password) {
      this.showNotification(this.getTranslation('auth.loginError'), 'error');
      return false;
    }

    // For demo purposes, accept any valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification(this.getTranslation('auth.loginError'), 'error');
      return false;
    }

    // Create demo user
    const user = {
      email: email,
      name: email.split('@')[0],
      loginDate: new Date().toISOString()
    };

    this.saveUser(user);
    this.showNotification(this.getTranslation('auth.loginSuccess'), 'success');
    this.closeAuthModal();
    return true;
  }

  register(userData) {
    // Demo implementation - validate required fields
    const { name, email, password, confirmPassword } = userData;

    if (!name || !email || !password) {
      this.showNotification(this.getTranslation('auth.registerError'), 'error');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification(this.getTranslation('auth.registerError'), 'error');
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      this.showNotification('Şifreler eşleşmiyor / Passwords do not match', 'error');
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      this.showNotification('Şifre en az 6 karakter olmalı / Password must be at least 6 characters', 'error');
      return false;
    }

    // Create user
    const user = {
      email: email,
      name: name,
      registerDate: new Date().toISOString()
    };

    this.saveUser(user);
    this.showNotification(this.getTranslation('auth.registerSuccess'), 'success');
    this.closeAuthModal();
    return true;
  }

  logout() {
    this.removeUser();
    this.showNotification(this.getTranslation('auth.logoutSuccess'), 'success');

    // Redirect to home if on account page
    if (window.location.pathname.includes('account.html')) {
      window.location.href = '../index.html';
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getUser() {
    return this.currentUser;
  }

  updateUI() {
    // Update header user section
    const userLoggedIn = document.querySelector('.user-logged-in');
    const userNotLoggedIn = document.querySelector('.user-not-logged-in');
    const userName = document.getElementById('userName');

    if (this.isLoggedIn() && userLoggedIn && userNotLoggedIn) {
      userLoggedIn.style.display = 'block';
      userNotLoggedIn.style.display = 'none';

      if (userName) {
        userName.textContent = this.currentUser.name;
      }

      // Update user greeting text
      const greeting = userLoggedIn.querySelector('.user-greeting');
      if (greeting) {
        const lang = this.getCurrentLang();
        const greetingText = lang === 'tr' ? 'Merhaba' : lang === 'de' ? 'Hallo' : 'Hello';
        greeting.innerHTML = `${greetingText}, <span id="userName">${this.currentUser.name}</span>`;
      }
    } else if (userLoggedIn && userNotLoggedIn) {
      userLoggedIn.style.display = 'none';
      userNotLoggedIn.style.display = 'block';
    }

    // Update footer links
    const footerLoginLink = document.getElementById('footerLoginLink');
    const footerRegisterLink = document.getElementById('footerRegisterLink');

    if (this.isLoggedIn() && footerLoginLink) {
      footerLoginLink.textContent = this.getTranslation('auth.myAccount');
      footerLoginLink.href = 'pages/account.html';
      if (footerRegisterLink) {
        footerRegisterLink.style.display = 'none';
      }
    } else if (footerLoginLink) {
      footerLoginLink.href = '#';
      if (footerRegisterLink) {
        footerRegisterLink.style.display = 'block';
      }
    }
  }

  attachEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.openAuthModal('login'));
    }

    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
      registerBtn.addEventListener('click', () => this.openAuthModal('register'));
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Footer login link
    const footerLoginLink = document.getElementById('footerLoginLink');
    if (footerLoginLink && !this.isLoggedIn()) {
      footerLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal('login');
      });
    }

    // Footer register link
    const footerRegisterLink = document.getElementById('footerRegisterLink');
    if (footerRegisterLink) {
      footerRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal('register');
      });
    }

    // Auth modal tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchAuthTab(tabName);
      });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        this.login(email, password);
      });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
          name: document.getElementById('registerName').value,
          email: document.getElementById('registerEmail').value,
          password: document.getElementById('registerPassword').value,
          confirmPassword: document.getElementById('registerPasswordConfirm').value
        };
        this.register(userData);
      });
    }

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => this.closeAuthModal());
    });

    // Close modal when clicking outside
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          this.closeAuthModal();
        }
      });
    }

    // Social login buttons (demo - just show notification)
    document.querySelectorAll('.btn-social').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.classList.contains('google') ? 'Google' : 'Facebook';
        this.showNotification(`${provider} ile giriş demo modda çalışmıyor / ${provider} login not available in demo`, 'info');
      });
    });
  }

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.switchAuthTab(tab);
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';

      // Reset forms
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      if (loginForm) loginForm.reset();
      if (registerForm) registerForm.reset();
    }
  }

  switchAuthTab(tabName) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.toggle('active', form.id === `${tabName}Form`);
    });
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
}

// Initialize auth when DOM is ready
let auth;
document.addEventListener('DOMContentLoaded', () => {
  auth = new UserAuth();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserAuth;
}

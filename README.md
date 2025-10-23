# Kleine Wunder - Naturkleidung E-Commerce Website

Modern, çok dilli organik bebek kundağı e-ticaret web sitesi.

## 🎨 Özellikler

### ✅ Tamamlanan Özellikler

- **Çok Dilli Destek**: Türkçe, Almanca, İngilizce
- **Alışveriş Sepeti**: Tam özellikli sepet yönetimi, ürün ekleme/çıkarma
- **Kullanıcı Yönetimi**: Giriş, kayıt, profil yönetimi (demo)
- **Favoriler**: Ürünleri favorilere ekleme
- **Sosyal Medya Entegrasyonu**: 8 platform desteği (Instagram, Facebook, vb.)
- **Responsive Tasarım**: Mobile-first, tüm cihazlarda uyumlu
- **Modern UI/UX**: Smooth animasyonlar, hover efektleri
- **Ürün Detay Modal**: Hızlı ürün görüntüleme
- **Para Birimi Değişimi**: Dil bazlı otomatik para birimi (TRY/EUR/USD)
- **LocalStorage**: Sepet, kullanıcı ve favori verilerini saklama

## 🚀 Kurulum

1. Projeyi klonlayın veya indirin
2. Web tarayıcısında `index.html` dosyasını açın
3. Hazır! Hiçbir bağımlılık veya derleme gerekmiyor.

## 📁 Dosya Yapısı

```
kleine-wunder/
├── index.html                 # Ana sayfa
├── README.md                  # Proje dokümantasyonu
├── css/
│   └── style.css             # Ana CSS dosyası
├── js/
│   ├── main.js               # Ana JavaScript ve dil yönetimi
│   ├── translations.js       # Çok dilli çeviriler
│   ├── cart.js               # Sepet yönetimi
│   ├── auth.js               # Kullanıcı kimlik doğrulama
│   ├── wishlist.js           # Favori ürün yönetimi
│   └── social-media.js       # Sosyal medya yönetimi
├── pages/
│   ├── cart.html             # Sepet sayfası (TODO)
│   ├── checkout.html         # Ödeme sayfası (TODO)
│   ├── account.html          # Hesap sayfası (TODO)
│   └── products.html         # Ürünler sayfası (TODO)
└── images/
    ├── flags/                # Dil bayrak ikonları
    ├── social-icons/         # Sosyal medya ikonları
    └── products/             # Ürün görselleri
```

## 🎨 Renk Paleti

- **Ana Pembe**: #F5E6E8
- **Mint Yeşil**: #C5E5DC
- **Coral/CTA**: #D85845
- **Beyaz**: #FFFFFF
- **Koyu Gri**: #2C2C2C
- **Badge Kırmızı**: #FF4444

## 💻 Kullanılan Teknolojiler

- **HTML5**: Semantik HTML
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6+, LocalStorage API
- **Google Fonts**: Playfair Display, Dancing Script, Montserrat

## 🌍 Dil Değiştirme

Sağ üst köşedeki dil seçiciden dil değiştirilebilir:
- 🇹🇷 Türkçe (Varsayılan)
- 🇩🇪 Deutsch
- 🇬🇧 English

Seçilen dil tarayıcıda saklanır ve sayfa yenilenmeden değişir.

## 🛒 Sepet Özellikleri

- Ürün ekleme/çıkarma
- Miktar güncelleme (+/-)
- Otomatik toplam hesaplama
- Ücretsiz kargo (500+ TRY)
- LocalStorage ile kalıcı saklama
- Sepet badge ile ürün sayısı gösterimi

## 👤 Kullanıcı Özellikleri (Demo)

- Giriş yapma (herhangi bir email/şifre kabul eder)
- Kayıt olma
- Kullanıcı profili
- Çıkış yapma
- Giriş durumu saklanır

**Not**: Bu bir demo uygulamadır, gerçek API entegrasyonu yoktur.

## ❤️ Favoriler

- Ürünleri favorilere ekleme/çıkarma
- Favori sayısı gösterimi
- Kalp animasyonu
- LocalStorage ile saklama

## 📱 Sosyal Medya

Desteklenen platformlar:
- Instagram 📷
- Facebook 👥
- Pinterest 📌
- TikTok 🎵
- YouTube ▶️
- Twitter/X 🐦
- WhatsApp 💬
- LinkedIn 💼

### Sosyal Medya Linklerini Güncelleme

`js/social-media.js` dosyasında:

```javascript
const socialMediaConfig = {
  instagram: {
    url: 'https://instagram.com/kleinewunder', // Buraya URL ekleyin
    active: true // true yaparak aktifleştirin
  },
  // ...
}
```

## 🎯 Yapılacaklar (TODO)

- [ ] Ek sayfalar (cart.html, checkout.html, account.html, products.html)
- [ ] Ödeme entegrasyonu
- [ ] Ürün filtreleme ve arama
- [ ] Kullanıcı yorumları sistemi
- [ ] Gerçek ürün görselleri
- [ ] Backend API entegrasyonu
- [ ] Email doğrulama
- [ ] Sipariş takibi
- [ ] Mobil menü (hamburger)

## 🔧 Geliştirme

### Yeni Çeviri Ekleme

1. `js/translations.js` dosyasını açın
2. İlgili dil nesnesine yeni anahtar ekleyin:

```javascript
tr: {
  newSection: {
    title: "Başlık",
    description: "Açıklama"
  }
}
```

3. HTML'de kullanın:

```html
<h2 data-i18n="newSection.title">Başlık</h2>
```

### Yeni Ürün Ekleme

HTML'de ürün kartı kopyalayın ve düzenleyin:

```html
<div class="product-card" data-product-id="4">
  <div class="product-image-wrapper">
    <img src="images/products/product-4.jpg" alt="Yeni Ürün">
    <!-- ... -->
  </div>
  <!-- ... -->
</div>
```

## 📝 Lisans

Bu proje demo amaçlıdır. Kişisel ve ticari kullanım için uyarlanabilir.

## 👨‍💻 Geliştirici Notları

### LocalStorage Veri Yapısı

```javascript
// Sepet
localStorage.setItem('cart', JSON.stringify([
  {
    id: "1",
    name: "Silk Swaddle",
    price: 1290,
    size: "96x96",
    quantity: 2,
    image: "..."
  }
]));

// Kullanıcı
localStorage.setItem('user', JSON.stringify({
  email: "user@example.com",
  name: "John Doe"
}));

// Favoriler
localStorage.setItem('wishlist', JSON.stringify([
  { id: "1", name: "...", price: 1290, image: "..." }
]));

// Dil
localStorage.setItem('selectedLanguage', 'tr');
```

### Event Listeners

Sistemde kullanılan önemli event'ler:
- `languageChanged`: Dil değiştiğinde tetiklenir
- `DOMContentLoaded`: Sayfa yüklendiğinde tüm manager'lar başlatılır
- `visibilitychange`: Sekme aktifliği değiştiğinde animasyonları durdurur/başlatır

### Placeholder Görsel Üretimi

Demo amaçlı, gerçek ürün görselleri yoksa Canvas API ile otomatik placeholder üretilir:

```javascript
PlaceholderImageGenerator.generate();
```

## 🐛 Bilinen Sorunlar

- Mobil menü henüz implement edilmedi
- Ürün arama fonksiyonu pasif
- Gerçek ödeme entegrasyonu yok
- SEO optimizasyonu yapılmadı

## 📧 İletişim

Sorularınız için: info@kleinewunder.com

---

**Made with ❤️ for Kleine Wunder - Naturkleidung**

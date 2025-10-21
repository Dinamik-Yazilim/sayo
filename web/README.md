# DinamikSAYO - Tanıtım Web Sitesi

> **Mikro ERP V16 ve V17 ile Entegre Satın Alma Yönetim Sistemi**  
> Dinamik Yazılım Ltd. Şti. tarafından geliştirilmiştir.

## 📖 Proje Hakkında

DinamikSAYO tanıtım web sitesi, Mikro ERP sistemleri ile tam entegre çalışan profesyonel satın alma yönetim sisteminin tanıtımı için geliştirilmiş modern bir web uygulamasıdır.

### 🎯 Amaç

- DinamikSAYO ürününün özelliklerini tanıtmak
- Mikro ERP V16/V17 entegrasyonunu vurgulamak
- Potansiyel müşterilere sistem hakkında bilgi vermek
- Demo talepleri ve sistem girişi için yönlendirme sağlamak

## 🛠️ Teknoloji Stack

### Frontend Framework

- **Next.js 15.5.6** - React tabanlı full-stack framework
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Turbopack** - Hızlı build ve geliştirme

### UI/UX

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Modern ve erişilebilir UI bileşenleri
- **Lucide React** - SVG icon library
- **Geist Font** - Vercel tarafından optimize edilmiş font

### Geliştirme Araçları

- **ESLint 9** - Kod kalitesi ve tutarlılığı
- **PostCSS** - CSS işleme
- **TypeScript 5** - Statik tip denetimi

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18.0.0 veya üzeri
- npm, yarn, pnpm veya bun paket yöneticisi

### Kurulum Adımları

1. **Projeyi klonlayın:**

```bash
git clone https://github.com/Dinamik-Yazilim/sayo.git
cd sayo/web
```

2. **Bağımlılıkları yükleyin:**

```bash
npm install
# veya
yarn install
```

3. **Geliştirme sunucusunu başlatın:**

```bash
npm run dev
# veya
yarn dev
```

4. **Tarayıcıda açın:**
   - Local: http://localhost:3000
   - Network: http://[IP]:3000

## 📁 Proje Yapısı

```
web/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global stiller
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx            # Ana sayfa
│   ├── components/
│   │   └── ui/                 # Shadcn/ui bileşenleri
│   └── lib/
│       └── utils.ts            # Yardımcı fonksiyonlar
├── public/
│   └── img/
│       └── favicon.svg         # Site ikonu
├── package.json                # Proje bağımlılıkları
├── tailwind.config.ts          # Tailwind yapılandırması
├── components.json             # Shadcn/ui yapılandırması
└── README.md                   # Bu dosya
```

## 🎨 Sayfa Bölümleri

### 1. Header

- **Logo**: DinamikSAYO + V17 badge
- **Navigasyon**: Özellikler, Fiyatlandırma, İletişim
- **CTA Button**: "Sisteme Giriş" → https://sayoapp.dinamikup.com

### 2. Hero Section

- **Ana Başlık**: "Mikro ERP ile Entegre Satın Alma Yönetimi"
- **Açıklama**: Mikro ERP V16/V17 entegrasyon vurgusu
- **Action Buttons**: Demo Talep Et, Dinamik Yazılım'ı Ziyaret Et

### 3. Features Section

- **Mikro ERP Entegrasyonu**: V16/V17 uyumluluğu
- **Satın Alma Yönetimi**: Tedarikçi ve sipariş yönetimi
- **Detaylı Raporlama**: Analiz ve performans takibi
- **Kullanıcı Yönetimi**: Rol tabanlı erişim
- **Bulut Tabanlı**: Her yerden erişim
- **Mobil Uyumlu**: Responsive tasarım

### 4. Benefits Section

- **Neden DinamikSAYO**: Dinamik Yazılım güvencesi
- **Müşteri Referansı**: %60 hızlanma örneği

### 5. Pricing Section

- **Özel Fiyatlandırma**: Tüm planlar ₺0,00/ay
- **3 Plan**: Başlangıç, Profesyonel, Kurumsal

### 6. CTA Section

- **Son Çağrı**: Demo talep formu

### 7. Footer

- **Şirket Bilgileri**: Dinamik Yazılım Ltd. Şti.
- **Linkler**: Ürün, Şirket, Destek bölümleri
- **Copyright**: 2025 Dinamik Yazılım

## 📱 Responsive Tasarım

Site tüm cihaz türlerinde optimal görünüm sağlar:

- **Desktop**: 1024px ve üzeri
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu (Turbopack ile)
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Code linting
npm run lint
```

## 🌐 Deployment

### Vercel (Önerilen)

```bash
npm run build
```

Vercel ile otomatik deployment için proje GitHub'a push edildiğinde otomatik olarak deploy edilir.

### Diğer Platformlar

```bash
npm run build
npm run start
```

## 🔗 Harici Bağlantılar

- **Ana Sistem**: https://sayoapp.dinamikup.com
- **Şirket Web Sitesi**: Dinamik Yazılım Ltd. Şti.
- **Mikro ERP**: V16 ve V17 entegrasyonu

## 📞 İletişim ve Destek

**Dinamik Yazılım Ltd. Şti.**

- Web sitesi üzerinden iletişim formu
- Demo talep sistemi
- Teknik destek

## 📄 Lisans

Bu proje Dinamik Yazılım Ltd. Şti. tarafından geliştirilmiştir.
© 2025 Dinamik Yazılım Ltd. Şti. Tüm hakları saklıdır.

---

**Not**: Bu tanıtım sitesi DinamikSAYO ürününün pazarlama ve bilgilendirme amaçlı tasarlanmıştır. Gerçek sistem işlevselliği için ana uygulamaya yönlendirilir.

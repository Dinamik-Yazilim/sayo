# SAYO - Satın Alma Yönetim Sistemi

🚀 **Mikro 16 ve 17 Versiyonlarıyla %100 Uyumlu Satın Alma Yönetim Sistemi**

SAYO (Satın Alma Yönetim Sistemi), modern web teknolojileri kullanılarak geliştirilmiş, Mikro ERP sistemleri ile tam entegrasyon sağlayan kapsamlı bir satın alma yönetim platformudur.

## 🏗️ Proje Mimarisi

Bu proje **Full-Stack** bir yapıya sahiptir ve iki ana bileşenden oluşur:

```
📁 sayo/
├── 📁 client/          # Frontend (Next.js 14+ React TypeScript)
├── 📁 kernel/          # Backend (Node.js Express API)
└── 📄 README.md        # Ana proje dökümanı
```

## 🌟 Temel Özellikler

### 🛒 Satın Alma Modülü

- **Satın Alma Siparişleri**: Kapsamlı sipariş yönetimi
- **Tedarikçi Yönetimi**: Firma ve tedarikçi ilişkileri
- **Satın Alma Koşulları**: Fiyat ve koşul takibi
- **Envanter Entegrasyonu**: Stok takibi ve yönetimi

### 🏢 Organizasyon Yönetimi

- **Multi-Organization Support**: Çoklu organizasyon desteği
- **Kullanıcı Rolleri**: Granüler yetki sistemi
- **Veritabanı Yönetimi**: Dinamik veritabanı bağlantıları

### 🔄 Mikro ERP Entegrasyonu

- **Mikro 16/17 Uyumluluğu**: %100 uyumlu veri yapıları
- **Real-time Senkronizasyon**: Canlı veri aktarımı
- **SQL Connector**: Doğrudan veritabanı bağlantısı

## 🚀 Teknoloji Yığını

### Frontend (Client)

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Hooks
- **HTTP Client**: Custom fetch wrapper

### Backend (Kernel)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MSSQL (Mikro ERP Compatible)
- **Authentication**: JWT + Cookie-based
- **API Architecture**: RESTful APIs
- **File Storage**: AWS S3 Integration

### Veritabanı & Entegrasyon

- **Primary DB**: Microsoft SQL Server
- **ERP Integration**: Mikro 16/17
- **Cloud Storage**: AWS S3
- **Real-time**: WebSocket connections

## 📋 Sistem Gereksinimleri

### Minimum Gereksinimler

- **Node.js**: v18.0.0 veya üzeri
- **NPM**: v8.0.0 veya üzeri
- **MSSQL Server**: 2016 veya üzeri
- **RAM**: 4GB (önerilen 8GB)
- **Disk**: 2GB boş alan

### Desteklenen Mikro Versiyonları

- ✅ Mikro 16.x (Tüm alt versiyonlar)
- ✅ Mikro 17.x (Tüm alt versiyonlar)
- ✅ Mikro Yarg ile tam uyumluluk

## 🛠️ Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/Dinamik-Yazilim/sayo.git
cd sayo
```

### 2. Backend Kurulumu

```bash
cd kernel
npm install
npm start
```

### 3. Frontend Kurulumu

```bash
cd client
npm install
npm run dev
```

### 4. Erişim Adresleri

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📁 Proje Yapısı Detayları

### Client (Frontend)

```
client/
├── src/app/                    # Next.js App Router
│   ├── (authenticated)/        # Kimlik doğrulama gerektiren sayfalar
│   │   ├── purchase/           # Satın alma modülü
│   │   ├── admin/              # Yönetim paneli
│   │   ├── settings/           # Sistem ayarları
│   │   └── (components)/       # Paylaşılan bileşenler
│   └── auth/                   # Giriş sayfaları
├── components/                 # UI Bileşenleri
├── lib/                        # Yardımcı kütüphaneler
└── types/                      # TypeScript tip tanımları
```

### Kernel (Backend)

```
kernel/
├── controllers/                # API kontrolcüleri
│   ├── admin/                  # Yönetim API'leri
│   ├── auth/                   # Kimlik doğrulama
│   └── master/                 # Ana veri API'leri
├── db/                         # Veritabanı bağlantıları
├── lib/                        # Sunucu kütüphaneleri
└── wss-api/                    # WebSocket API'leri
```

## 🔐 Güvenlik Özellikleri

- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Role-based Authorization**: Rol tabanlı yetkilendirme
- **SQL Injection Protection**: Parametreli sorgular
- **CORS Configuration**: Çapraz kaynak güvenliği
- **Environment Variables**: Güvenli konfigürasyon

## 🌐 Mikro ERP Entegrasyonu

### Desteklenen Özellikler

- ✅ Stok kartları senkronizasyonu
- ✅ Firma bilgileri entegrasyonu
- ✅ Fiyat listeleri aktarımı
- ✅ Sipariş durumu takibi
- ✅ Depo yönetimi
- ✅ KDV ve muhasebe entegrasyonu

### Veri Yapıları

Sistem, Mikro ERP'nin orijinal tablo yapılarını kullanır:

- `STOKLAR` - Stok kartları
- `FIRMALAR` - Firma bilgileri
- `SIPARISLER` - Sipariş verileri
- `DEPOLAR` - Depo tanımları

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje Dinamik Yazılım tarafından geliştirilmiştir.

## 📞 İletişim

**Dinamik Yazılım**

- Website: [dinamik-yazilim.com](https://dinamik-yazilim.com)
- Email: info@dinamik-yazilim.com

## 🔗 İlgili Projeler

- [Mikro ERP](https://mikro.com) - Ana ERP sistemi
- [Dinamik Yazılım](https://dinamik-yazilim.com) - Geliştirici firma

---

🚀 **SAYO ile satın alma süreçlerinizi dijitalleştirin ve Mikro ERP'niz ile mükemmel entegrasyon yaşayın!**

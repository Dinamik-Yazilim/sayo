# SAYO Client - Frontend Application

🎨 **Modern React TypeScript Frontend with Next.js 14+**

SAYO Client, Satın Alma Yönetim Sistemi'nin frontend kısmıdır. Next.js 14 App Router, TypeScript ve Tailwind CSS kullanılarak geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Teknolojiler

### Core Framework

- **Next.js 14+**: React-based full-stack framework (App Router)
- **React 18+**: Modern React hooks ve concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### UI/UX Libraries

- **shadcn/ui**: Modern React component library
- **Lucide React**: Beautiful icon library
- **Radix UI**: Headless UI primitives
- **React Hook Form**: Performant form management

### State & Data Management

- **React Hooks**: Built-in state management
- **Custom Fetch**: HTTP client with error handling
- **Cookies**: Client-side session management
- **Toast Notifications**: User feedback system

## 📁 Proje Yapısı

```
client/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (authenticated)/     # Protected routes
│   │   │   ├── 📁 purchase/        # Satın alma modülü
│   │   │   │   ├── 📁 orders/      # Sipariş yönetimi
│   │   │   │   ├── 📁 conditions/  # Satın alma koşulları
│   │   │   │   └── 📁 inventory/   # Envanter görünümü
│   │   │   ├── 📁 admin/           # Sistem yönetimi
│   │   │   │   ├── 📁 organizations/ # Organizasyon yönetimi
│   │   │   │   └── 📁 adminUsers/  # Kullanıcı yönetimi
│   │   │   ├── 📁 settings/        # Uygulama ayarları
│   │   │   │   ├── 📁 users/       # Kullanıcı profilleri
│   │   │   │   ├── 📁 connector/   # Mikro ERP bağlantısı
│   │   │   │   └── 📁 workingParams/ # Çalışma parametreleri
│   │   │   ├── 📁 reports/         # Raporlama modülü
│   │   │   ├── 📁 me/              # Kullanıcı profil sayfaları
│   │   │   └── 📁 (components)/    # Paylaşılan select bileşenleri
│   │   └── 📁 auth/                # Authentication pages
│   │       └── 📁 login/           # Giriş sayfası
│   ├── 📁 components/              # Reusable UI components
│   │   ├── 📁 ui/                  # shadcn/ui components
│   │   └── 📁 ui216/               # Custom TSN components
│   ├── 📁 lib/                     # Utility libraries
│   ├── 📁 types/                   # TypeScript definitions
│   ├── 📁 styles/                  # Global styles
│   └── 📁 widgets/                 # Standalone widgets
├── 📁 public/                      # Static assets
│   ├── 📁 img/                     # Images
│   └── 📁 mp3/                     # Audio files
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json               # TypeScript config
├── 📄 tailwind.config.ts          # Tailwind CSS config
└── 📄 next.config.js              # Next.js configuration
```

## 🧩 Ana Bileşenler

### Authentication System

```typescript
// JWT tabanlı kimlik doğrulama
- Login/Logout flows
- Token management with cookies
- Protected route guards
- Multi-organization support
```

### Purchase Management

```typescript
// Satın alma modülü bileşenleri
- OrdersPage: Sipariş listesi ve yönetimi
- OrderDetailPage: Detaylı sipariş formu
- PurchaseConditions: Koşul yönetimi
- InventoryView: Envanter görünümü
```

### Admin Panel

```typescript
// Yönetim paneli
- OrganizationManagement: Organizasyon CRUD
- UserManagement: Kullanıcı yönetimi
- SystemSettings: Sistem konfigürasyonu
```

### Custom Components (ui216)

```typescript
// Özel TSN bileşen kütüphanesi
- TsnGrid: Veri tablosu bileşeni
- TsnPanel: Katlanabilir panel
- TsnInput: Gelişmiş input bileşeni
- TsnSelect: Select box bileşeni
- StandartForm: Standart form layout
```

## 🔧 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Konfigürasyonu

```bash
# .env.local dosyası oluşturun
cp .env.example .env.local
```

### 3. Development Server

```bash
npm run dev
```

http://localhost:3000 adresinde erişilebilir

### 4. Production Build

```bash
npm run build
npm start
```

## 📦 Ana Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-*": "UI primitives",
  "lucide-react": "Icon library",
  "js-cookie": "Cookie management",
  "sonner": "Toast notifications"
}
```

## 🎨 UI/UX Özellikler

### Design System

- **Tailwind CSS**: Utility-first styling
- **Dark/Light Mode**: Theme switching support
- **Responsive Design**: Mobile-first approach
- **Component Library**: shadcn/ui based

### User Experience

- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation
- **Toast Notifications**: Success/error feedback

## 🔄 API Integration

### HTTP Client

```typescript
// Custom fetch wrapper with error handling
- Automatic token management
- Request/response interceptors
- Error boundary integration
- Loading state management
```

### Data Flow

```typescript
// Typical data flow pattern
Page Component → API Call → Update State → Re-render
```

## 🌐 Routing Structure

### App Router (Next.js 14)

```
/                           # Ana sayfa (redirect to /auth or /home)
/auth/login                 # Giriş sayfası
/auth/login/verify         # Email doğrulama
/(authenticated)/          # Protected routes group
  /home                    # Dashboard
  /purchase/*              # Satın alma modülü
  /admin/*                 # Yönetim paneli
  /settings/*              # Ayarlar
  /reports/*               # Raporlar
  /me/*                    # Kullanıcı profili
```

## 🔐 Security Features

- **Client-side Route Guards**: Protected route validation
- **Token Management**: Secure JWT handling
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: SameSite cookie attributes

## 📱 Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 🧪 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

### Best Practices

- **File Naming**: kebab-case for files, PascalCase for components
- **Type Safety**: Explicit typing for all props and state
- **Error Boundaries**: Graceful error handling
- **Performance**: Lazy loading and code splitting

## 🚀 Performance Optimizations

- **Next.js Image**: Optimized image loading
- **Dynamic Imports**: Code splitting
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: Webpack bundle analyzer

## 📈 Monitoring & Analytics

- **Error Tracking**: Built-in error boundaries
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Custom event tracking

---

🎯 **SAYO Client ile modern, performant ve kullanıcı dostu web deneyimi yaşayın!**

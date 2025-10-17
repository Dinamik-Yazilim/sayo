# SAYO Kernel - Backend API Server

⚡ **High-Performance Node.js Backend with Mikro ERP Integration**

SAYO Kernel, Satın Alma Yönetim Sistemi'nin backend kısmıdır. Express.js tabanlı RESTful API servisi olup, Mikro ERP 16/17 versiyonları ile %100 uyumlu veri entegrasyonu sağlar.

## 🚀 Teknolojiler

### Core Framework
- **Node.js**: v18+ JavaScript runtime
- **Express.js**: Web application framework
- **JavaScript ES6+**: Modern JavaScript features
- **CORS**: Cross-origin resource sharing

### Database & Integration
- **Microsoft SQL Server**: Primary database
- **Mikro ERP Integration**: 16/17 version compatibility
- **Connection Pooling**: Efficient database connections
- **Parameterized Queries**: SQL injection protection

### Authentication & Security
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **Cookie-based Sessions**: Secure session management
- **Role-based Access**: Granular permissions

### Additional Features
- **AWS S3**: File storage integration
- **WebSocket**: Real-time communication
- **Email/SMS**: Notification services
- **Spam Detection**: Anti-spam mechanisms

## 📁 Proje Yapısı

```
kernel/
├── 📄 app.js                      # Express app configuration
├── 📄 index.js                    # Server entry point
├── 📄 routes.js                   # Route definitions
├── 📄 package.json               # Dependencies & scripts
├── 📁 controllers/               # API Controllers
│   ├── 📁 admin/                 # Admin management
│   │   ├── 📄 members.controller.js      # User management
│   │   └── 📄 organizations.controller.js # Org management
│   ├── 📁 auth/                  # Authentication
│   │   ├── 📄 check.controller.js        # Auth validation
│   │   ├── 📄 login.controller.js        # Login process
│   │   ├── 📄 verify.controller.js       # Email verification
│   │   └── 📄 helper.js                  # Auth utilities
│   └── 📁 master/                # Master data controllers
│       ├── 📄 connector.controller.js    # ERP connections
│       └── 📄 *.controller.js            # Various data controllers
├── 📁 db/                        # Database layer
│   ├── 📄 index.js               # DB connection manager
│   ├── 📁 collections/           # Data access objects
│   └── 📁 helpers/               # DB utility functions
├── 📁 lib/                       # Core libraries
│   ├── 📄 auth.js                # Authentication logic
│   ├── 📄 awsS3.js               # AWS S3 integration
│   ├── 📄 connectorAbi.js        # ERP connector interface
│   ├── 📄 http-server.js         # HTTP server utilities
│   ├── 📄 mongoAdapter.js        # MongoDB adapter (legacy)
│   ├── 📄 searchHelper.js        # Search functionality
│   ├── 📄 sender-email.js        # Email service
│   ├── 📄 sender-sms.js          # SMS service
│   ├── 📄 sender.js              # Notification dispatcher
│   ├── 📄 socketHelper.js        # WebSocket utilities
│   ├── 📄 spam-detector.js       # Anti-spam system
│   ├── 📄 util.js                # General utilities
│   ├── 📁 i18n/                  # Internationalization (legacy)
│   └── 📁 mikro/                 # Mikro ERP specific modules
├── 📁 posProviders/              # POS system integrations
│   └── 📁 pos312/               # Specific POS provider
├── 📁 public/                    # Static files
│   └── 📄 test.html             # API test page
└── 📁 wss-api/                   # WebSocket API
    ├── 📄 wss-api.js             # WebSocket server
    └── 📁 sockets/               # Socket handlers
```

## 🔧 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Environment Konfigürasyonu
```bash
# .env dosyası oluşturun
cp .env.example .env
```

### 3. Veritabanı Bağlantısı
```javascript
// Mikro ERP veritabanı bağlantı ayarları
DB_HOST=your_sql_server
DB_NAME=your_mikro_database
DB_USER=your_username
DB_PASS=your_password
```

### 4. Serveri Başlatın
```bash
npm start
```
http://localhost:3001 adresinde API servisi çalışır

## 🔌 API Endpoints

### Authentication
```
POST /auth/login          # Kullanıcı girişi
POST /auth/verify         # Email doğrulama
GET  /auth/check          # Token doğrulama
POST /auth/logout         # Çıkış yapma
```

### Admin Management
```
GET    /admin/members           # Kullanıcı listesi
POST   /admin/members           # Yeni kullanıcı
PUT    /admin/members/:id       # Kullanıcı güncelle
DELETE /admin/members/:id       # Kullanıcı sil

GET    /admin/organizations     # Organizasyon listesi
POST   /admin/organizations     # Yeni organizasyon
PUT    /admin/organizations/:id # Organizasyon güncelle
```

### Master Data
```
GET  /connector/test      # ERP bağlantı testi
POST /connector/query     # ERP sorgusu
GET  /firms              # Firma listesi
GET  /items              # Ürün listesi
GET  /warehouses         # Depo listesi
GET  /projects           # Proje listesi
```

### Mikro ERP Integration
```
POST /mikro/get          # Mikro veri çekme
POST /mikro/set          # Mikro veri kaydetme
GET  /mikro/sync         # Senkronizasyon
POST /mikro/query        # Custom SQL sorgu
```

## 🔒 Authentication System

### JWT Token Flow
```javascript
1. Login Request → Credentials Validation
2. Generate JWT Token → Store in Cookie
3. API Requests → Token Verification
4. Role-based Authorization → Access Control
```

### Supported Roles
- `sysadmin`: System administrator
- `admin`: Organization admin
- `user`: Standard user
- `viewer`: Read-only access

## 🗄️ Database Integration

### Mikro ERP Tables
```sql
-- Ana Mikro ERP tabloları ile entegrasyon
STOKLAR          -- Stok kartları
FIRMALAR         -- Firma bilgileri  
SIPARISLER       -- Sipariş verileri
DEPOLAR          -- Depo tanımları
PROJELER         -- Proje kartları
ODEME_PLANLARI   -- Ödeme planları
```

### Connection Management
- **Connection Pooling**: Verimli bağlantı yönetimi
- **Transaction Support**: Atomik işlemler
- **Error Handling**: Kapsamlı hata yönetimi
- **Query Optimization**: Optimize edilmiş sorgular

## 🔧 Core Modules

### Authentication (lib/auth.js)
```javascript
// JWT token yönetimi ve yetkilendirme
- Token generation/validation
- Password hashing (bcrypt)
- Role-based access control
- Session management
```

### ERP Connector (lib/connectorAbi.js)
```javascript
// Mikro ERP entegrasyon arayüzü
- Database connection management
- SQL query execution
- Data type mapping
- Error handling
```

### AWS S3 Integration (lib/awsS3.js)
```javascript
// Dosya depolama servisi
- File upload/download
- Presigned URLs
- Bucket management
- Access control
```

### Notification System (lib/sender.js)
```javascript
// Bildirim servisleri
- Email notifications
- SMS messaging
- Push notifications
- Template management
```

## 🌐 WebSocket API

### Real-time Features
```javascript
// wss-api/wss-api.js
- Live data updates
- User presence tracking
- System notifications
- Real-time synchronization
```

### Socket Events
```javascript
'connection'     // User connected
'disconnect'     // User disconnected
'data_update'    // Data changed
'notification'   // System notification
```

## 🛡️ Security Features

### Data Protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Secure cross-origin requests
- **Rate Limiting**: API abuse prevention

### Authentication Security
- **JWT Secret**: Secure token signing
- **Password Policies**: Strong password requirements
- **Session Timeout**: Automatic session expiry
- **Brute Force Protection**: Login attempt limiting

## 📊 Performance Optimizations

### Database Optimization
- **Connection Pooling**: Reuse database connections
- **Query Caching**: Cache frequently used queries
- **Index Optimization**: Optimized database indexes
- **Batch Operations**: Bulk data processing

### API Performance
- **Response Compression**: Gzip compression
- **Caching Headers**: HTTP cache control
- **Async Processing**: Non-blocking operations
- **Memory Management**: Efficient memory usage

## 🔍 Monitoring & Logging

### Error Handling
```javascript
// Kapsamlı hata yönetimi
- Try-catch blocks
- Error logging
- User-friendly messages
- Stack trace capture
```

### Performance Monitoring
- **Response Times**: API endpoint performance
- **Error Rates**: Error frequency tracking
- **Database Performance**: Query execution times
- **Memory Usage**: Server resource monitoring

## 🧪 Testing

### API Testing
```bash
# API test sayfası
http://localhost:3001/test.html

# Postman collection
Import: sayo-api-collection.json
```

### Database Testing
```javascript
// ERP bağlantı testi
GET /connector/test
POST /connector/query
```

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your_secret_key
DB_HOST=sql_server_host
DB_NAME=mikro_database
DB_USER=database_user
DB_PASS=database_password
AWS_ACCESS_KEY_ID=aws_key
AWS_SECRET_ACCESS_KEY=aws_secret
SMTP_HOST=mail_server
SMTP_USER=mail_username
SMTP_PASS=mail_password
```

### Database Configuration
```javascript
// db/index.js
const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}
```

## 🚀 Deployment

### Production Setup
```bash
# PM2 ile production deployment
npm install -g pm2
pm2 start index.js --name sayo-kernel
pm2 startup
pm2 save
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

---

⚡ **SAYO Kernel ile güçlü, ölçeklenebilir ve güvenli backend API servisi!**
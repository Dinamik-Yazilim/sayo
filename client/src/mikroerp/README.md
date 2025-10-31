# MikroERP SQL Query Library

MikroERP V16/V17 veritabanı sorguları için merkezi TypeScript kütüphanesi.

## 📦 Kurulum

```typescript
import { getStoklar, getTopSellingProducts } from '@/mikroerp'
```

## 🎯 Amaç

Bu kütüphane, MikroERP SQL sorgularını:

- ✅ **Merkezi** bir yerden yönetir
- ✅ **Tip güvenli** şekilde kullanmanızı sağlar
- ✅ **Yeniden kullanılabilir** hale getirir
- ✅ **Bakımı kolay** yapar
- ✅ **Kod tekrarını** önler

## 📂 Klasör Yapısı

```
src/mikroerp/
├── index.ts                 # Ana export dosyası
└── queries/
    ├── stok.ts             # Stok sorguları
    ├── cari.ts             # Cari hesap sorguları
    ├── dashboard.ts        # Dashboard/istatistik sorguları
    └── depo.ts             # Depo sorguları
```

## 📚 Mevcut Sorgular

### Stok Sorguları (`queries/stok.ts`)

#### `getStokAnaGruplari()`

Tüm stok ana gruplarını listeler (alt grup ve stok sayılarıyla)

```typescript
const query = getStokAnaGruplari()
const data = await postItem('/mikro/get', token, { query })
```

#### `searchStokAnaGruplari(searchTerm: string)`

Ana grupları kod veya isim ile arar

```typescript
const query = searchStokAnaGruplari('Gıda')
```

#### `getStokAltGruplari(anaGrupKod?: string)`

Alt grupları listeler, opsiyonel ana grup filtresi ile

```typescript
const query = getStokAltGruplari('01') // Sadece 01 ana grubuna bağlı alt gruplar
const query = getStokAltGruplari() // Tüm alt gruplar
```

#### `searchStokAltGruplari(searchTerm: string, anaGrupKod?: string)`

Alt grupları arar

```typescript
const query = searchStokAltGruplari('Süt', '01')
```

#### `getStokKategorileri()`

Tüm stok kategorilerini listeler

#### `getStokMarkalari()`

Tüm markaları listeler

#### `getStoklar(searchTerm?, anaGrupKod?, altGrupKod?, kategoriKod?, markaKod?)`

Gelişmiş filtreleme ile stokları listeler (TOP 200)

```typescript
const query = getStoklar(
  'Süt', // Arama terimi (kod, isim veya barkod)
  '01', // Ana grup
  '01.001', // Alt grup
  'GIDA', // Kategori
  'ULKER', // Marka
)
```

### Dashboard Sorguları (`queries/dashboard.ts`)

#### `getTopSellingProducts(days: number, limit: number)`

En çok satan ürünleri getirir (Net satış - İadeler)

```typescript
const query = getTopSellingProducts(30, 10) // Son 30 günde en çok satan 10 ürün
```

#### `getTotalStockCount()`

Toplam stok sayısı

#### `getDailySales()`

Günlük satış toplamı

#### `getMonthlySales()`

Aylık ciro

#### `getActiveCustomerCount()`

Aktif müşteri sayısı

#### `getPendingOrderCount()`

Bekleyen sipariş sayısı

#### `getMonthlyInvoiceCount()`

Aylık fatura sayısı

#### `getCriticalStockCount()`

Kritik stok sayısı (minimum seviyenin altında)

### Depo Sorguları (`queries/depo.ts`)

#### `getDepolar(depTipi?: string)`

Depoları listeler, opsiyonel tip filtresi ile

```typescript
const query = getDepolar('0') // Sadece Merkez depolar
const query = getDepolar() // Tüm depolar
```

#### `searchDepolar(searchTerm: string, depTipi?: string)`

Depoları arar

```typescript
const query = searchDepolar('Merkez', '0')
```

### Cari Hesap Sorguları (`queries/cari.ts`)

#### `getCariHesaplar()`

Tüm cari hesapları listeler

#### `searchCariHesaplar(searchTerm: string)`

Cari hesapları arar

#### `getMusteriler()`

Sadece müşterileri listeler

#### `getTedarikciler()`

Sadece tedarikçileri listeler

## 🔧 Kullanım Örnekleri

### Basit Kullanım

```typescript
import { getStoklar } from '@/mikroerp'
import { postItem } from '@/lib/fetch'

// Tüm stokları getir
const query = getStoklar()
const data = await postItem('/mikro/get', token, { query })
```

### Filtreleme ile Kullanım

```typescript
import { getStoklar } from '@/mikroerp'

// Ana gruba göre filtrele
const query = getStoklar(undefined, '01')

// Arama ve filtre birlikte
const query = getStoklar('Süt', '01', 'all', 'GIDA')
```

### Dashboard İstatistikleri

```typescript
import { getTopSellingProducts, getDailySales } from '@/mikroerp'

// En çok satanlar
const topQuery = getTopSellingProducts(30, 10)
const topProducts = await postItem('/mikro/get', token, { query: topQuery })

// Günlük satış
const salesQuery = getDailySales()
const dailySales = await postItem('/mikro/get', token, { query: salesQuery })
```

## ✨ Avantajlar

### Kod Tekrarını Önler

**Önce:**

```typescript
// Her sayfada aynı sorguyu yazıyorduk
const query = `
  SELECT san_kod, san_isim
  FROM STOK_ANA_GRUPLARI
  WHERE san_iptal = 0
  ORDER BY san_kod
`
```

**Sonra:**

```typescript
// Artık tek satır
const query = getStokAnaGruplari()
```

### Tip Güvenliği

- TypeScript ile tam tip desteği
- Otomatik parametre validasyonu
- IDE autocomplete desteği

### Kolay Bakım

- Sorgu değişikliği tek yerden yapılır
- Tüm kullanımlar otomatik güncellenir
- Versiyon kontrolü kolay

### Dokümantasyon

- JSDoc ile inline dokümantasyon
- Parametre açıklamaları
- Kullanım örnekleri

## 🚀 Yeni Sorgu Eklemek

1. İlgili query dosyasını aç (örn: `queries/stok.ts`)
2. Yeni fonksiyon ekle:

```typescript
/**
 * Stok Minimum Seviyeleri
 * @returns Minimum seviye tanımlı stoklar
 */
export const getStokMinimumSeviyeleri = () => `
  SELECT 
    sto_kod,
    sto_isim,
    sto_minimum_seviye
  FROM STOKLAR
  WHERE sto_iptal = 0
    AND sto_minimum_seviye > 0
  ORDER BY sto_minimum_seviye DESC
`
```

3. Kullan:

```typescript
import { getStokMinimumSeviyeleri } from '@/mikroerp'

const query = getStokMinimumSeviyeleri()
```

## 📝 Notlar

- Tüm sorgular `sto_iptal = 0` gibi filtrelerle iptal edilmiş kayıtları otomatik olarak filtreler
- Parametreler SQL injection'a karşı korunmalıdır (şu an string interpolation kullanılıyor, production'da parametreli sorgular kullanılmalı)
- Sorgular MikroERP V16/V17 için tasarlanmıştır

## 🔮 Gelecek Planlar

- [ ] Parametreli sorgu desteği (SQL injection koruması)
- [ ] Query builder pattern
- [ ] Sorgu önbellekleme
- [ ] Sayfalama desteği
- [ ] Daha fazla tablo desteği (SIPARISLER, FATURALAR, vb.)
- [ ] Unit testler

## 📖 İlgili Dökümanlar

- [MikroERP Schema Dökümanları](../../mikroerp/schema/)
- [STOK_HAREKETLERI.md](../../mikroerp/schema/STOK_HAREKETLERI.md)
- [STOKLAR.md](../../mikroerp/schema/STOKLAR.md)

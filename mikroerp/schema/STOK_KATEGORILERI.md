# STOK_KATEGORILERI Tablosu - Kategori Tanımları

## Tablo Özeti

**Tablo Adı:** `STOK_KATEGORILERI`  
**Türkçe Adı:** Kategori Tanımları  
**Amaç:** Stokları kategorize etmek için kullanılan kategori tanımlarını tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Stok kategorileri tablosu, stokları farklı kriterlere göre gruplamak için kullanılır. Ana grup ve alt grup yapısından farklı olarak, kategoriler daha esnek bir sınıflandırma sağlar.

**Örnek Kategoriler:**

- "İthal Ürünler"
- "Yurt İçi Ürünler"
- "Kampanyalı Ürünler"
- "Sezonluk Ürünler"
- "Organik Ürünler"

---

## Tablo Yapısı

| Alan No | Alan Adı          | Veri Tipi                   | Açıklama                           | Örnek Değer                            |
| ------- | ----------------- | --------------------------- | ---------------------------------- | -------------------------------------- |
| 0       | `ktg_Guid`        | Uniqueidentifier            | Benzersiz kategori tanımlayıcı     | `A1B2C3D4-E5F6-7890-1234-567890ABCDEF` |
| 1       | `ktg_DBCno`       | Smallint                    | Veritabanı şirketi numarası        | `1`                                    |
| 2       | `ktg_SpecRECno`   | Integer                     | Özel kayıt numarası                | `0`                                    |
| 3       | `ktg_iptal`       | Bit                         | İptal bayrağı (0=Aktif, 1=İptal)   | `0`                                    |
| 4       | `ktg_fileid`      | Smallint                    | Dosya tanımlayıcı                  | `1`                                    |
| 5       | `ktg_hidden`      | Bit                         | Gizli bayrak (0=Görünür, 1=Gizli)  | `0`                                    |
| 6       | `ktg_kilitli`     | Bit                         | Kilitli bayrak (0=Açık, 1=Kilitli) | `0`                                    |
| 7       | `ktg_degisti`     | Bit                         | Değişim bayrağı                    | `0`                                    |
| 8       | `ktg_checksum`    | Integer                     | Kontrol toplamı                    | `12345`                                |
| 9       | `ktg_create_user` | Smallint                    | Oluşturan kullanıcı ID             | `1`                                    |
| 10      | `ktg_create_date` | DateTime                    | Oluşturma tarihi                   | `2024-01-15 09:30:00`                  |
| 11      | `ktg_lastup_user` | Smallint                    | Son güncelleyen kullanıcı ID       | `2`                                    |
| 12      | `ktg_lastup_date` | DateTime                    | Son güncelleme tarihi              | `2024-10-20 14:45:00`                  |
| 13      | `ktg_special1`    | Nvarchar(4)                 | Özel alan 1                        | `SPCL`                                 |
| 14      | `ktg_special2`    | Nvarchar(4)                 | Özel alan 2                        | `STD`                                  |
| 15      | `ktg_special3`    | Nvarchar(4)                 | Özel alan 3                        | `MAN`                                  |
| 16      | `ktg_kod`         | Nvarchar(25)                | **Kategori Kodu**                  | `KTG-001`                              |
| 17      | `ktg_isim`        | Nvarchar(50)                | **Kategori Adı**                   | `İthal Ürünler`                        |
| 18      | `ktg_aciklama`    | dbo.nvarchar_maxhesapisimno | Kategori Açıklaması                | `Yurt dışından ithal edilen ürünler`   |

---

## Alan Kategorileri

### 🔑 Temel Alanlar

- **ktg_kod** (Nvarchar(25)): Kategori kodunun benzersiz tanımlayıcısı
- **ktg_isim** (Nvarchar(50)): Kategorinin adı
- **ktg_aciklama** (nvarchar_maxhesapisimno): Kategoriye ait detaylı açıklama

### 🔐 Sistem Alanları

- **ktg_Guid** (Uniqueidentifier): Sistemin kategori için atadığı benzersiz GUID
- **ktg_DBCno** (Smallint): Veritabanı şirketi numarası (çok şirketli yapıda)
- **ktg_SpecRECno** (Integer): Özel kayıt numarası (sistem tarafından yönetilen)
- **ktg_fileid** (Smallint): Dosya tanımlayıcı

### ⚠️ Durum Bayrakları

- **ktg_iptal** (Bit): `0` = Aktif, `1` = İptal edilmiş (silinmiş)
- **ktg_hidden** (Bit): `0` = Görünür, `1` = Gizli (listede gösterilmez)
- **ktg_kilitli** (Bit): `0` = Açık (düzenlenebilir), `1` = Kilitli (salt okunur)
- **ktg_degisti** (Bit): Veri değişip değişmediğini gösteren bayrak

### 👤 Kullanıcı İzleme

- **ktg_create_user** (Smallint): Kategoriyi oluşturan kullanıcının ID'si
- **ktg_create_date** (DateTime): Kategorinin oluşturulma tarihi ve saati
- **ktg_lastup_user** (Smallint): Son güncelleyen kullanıcının ID'si
- **ktg_lastup_date** (DateTime): Son güncelleme tarihi ve saati

### 📝 Özel Alanlar

- **ktg_special1, ktg_special2, ktg_special3** (Nvarchar(4)): Gelecekteki ihtiyaçlar için ayrılan ek alanlar

### 🔧 Teknik Alanlar

- **ktg_checksum** (Integer): Satırın bütünlüğünü kontrol etmek için kullanılan kontrol toplamı

---

## İndeksler

| İndeks Adı                 | Özellik     | Alanlar    | Açıklama                                           |
| -------------------------- | ----------- | ---------- | -------------------------------------------------- |
| `NDX_STOK_KATEGORILERI_00` | PRIMARY KEY | `ktg_Guid` | Birincil anahtar - Her kategori benzersiz GUID ile |
| `NDX_STOK_KATEGORILERI_02` | UNIQUE      | `ktg_kod`  | Kategori kodu benzersiz olmalıdır                  |
| `NDX_STOK_KATEGORILERI_03` | Index       | `ktg_isim` | Kategori ismine göre hızlı arama için indeks       |

---

## İlişkiler

### Bağlantılı Tablolar

- **STOKLAR**: Stok kartlarında `sto_kategori_kodu` alanı bu tablodaki `ktg_kod` alanına referans verir

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Kategorileri Listele

```sql
SELECT
    ktg_kod,
    ktg_isim,
    ktg_aciklama
FROM STOK_KATEGORILERI
WHERE ktg_iptal = 0
ORDER BY ktg_kod
```

### 2. Kategoriye Ait Stok Sayısını Getir

```sql
SELECT
    k.ktg_kod,
    k.ktg_isim,
    COUNT(s.sto_kod) as stok_sayisi
FROM STOK_KATEGORILERI k
LEFT JOIN STOKLAR s ON s.sto_kategori_kodu = k.ktg_kod AND s.sto_iptal = 0
WHERE k.ktg_iptal = 0
GROUP BY k.ktg_kod, k.ktg_isim
ORDER BY k.ktg_kod
```

### 3. Belirli Kategorideki Stokları Listele

```sql
SELECT
    s.sto_kod,
    s.sto_isim,
    k.ktg_isim as kategori
FROM STOKLAR s
INNER JOIN STOK_KATEGORILERI k ON k.ktg_kod = s.sto_kategori_kodu
WHERE s.sto_kategori_kodu = 'KTG-001'
  AND s.sto_iptal = 0
  AND k.ktg_iptal = 0
ORDER BY s.sto_kod
```

### 4. Yeni Kategori Ekle

```sql
INSERT INTO STOK_KATEGORILERI (
    ktg_Guid, ktg_DBCno, ktg_iptal, ktg_fileid,
    ktg_create_user, ktg_create_date,
    ktg_kod, ktg_isim, ktg_aciklama
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'KTG-100', 'Organik Ürünler', 'Organik sertifikalı ürünler'
)
```

### 5. Kategori Güncelle

```sql
UPDATE STOK_KATEGORILERI
SET
    ktg_isim = 'İthal Organik Ürünler',
    ktg_aciklama = 'Yurt dışından ithal edilen organik sertifikalı ürünler',
    ktg_lastup_user = 2,
    ktg_lastup_date = GETDATE()
WHERE ktg_kod = 'KTG-100'
```

---

## TypeScript Arayüzü

```typescript
export interface StokKategorisi {
  // Sistem
  ktgGuid: string
  ktgDBCno: number
  ktgSpecRECno: number

  // Durum
  ktgIptal: boolean
  ktgHidden: boolean
  ktgKilitli: boolean

  // Temel Bilgiler
  ktgKod: string
  ktgIsim: string
  ktgAciklama?: string

  // Kullanıcı İzleme
  ktgCreateUser: number
  ktgCreateDate: Date
  ktgLastupUser?: number
  ktgLastupDate?: Date

  // Özel Alanlar
  ktgSpecial1?: string
  ktgSpecial2?: string
  ktgSpecial3?: string

  // Hesaplanan
  stokSayisi?: number
}
```

---

## API Endpoint Örneği

```typescript
// GET /api/mikro/stok-kategorileri
export async function GET(req: Request) {
  const query = `
    SELECT 
      k.ktg_kod,
      k.ktg_isim,
      k.ktg_aciklama,
      COUNT(s.sto_kod) as stok_sayisi
    FROM STOK_KATEGORILERI k
    LEFT JOIN STOKLAR s ON s.sto_kategori_kodu = k.ktg_kod AND s.sto_iptal = 0
    WHERE k.ktg_iptal = 0
    GROUP BY k.ktg_kod, k.ktg_isim, k.ktg_aciklama
    ORDER BY k.ktg_kod
  `

  const result = await postItem("/mikro/get", token, { query })
  return Response.json({ success: true, data: result })
}

// POST /api/mikro/stok-kategorileri
export async function POST(req: Request) {
  const body = await req.json()

  const query = `
    INSERT INTO STOK_KATEGORILERI (
      ktg_Guid, ktg_DBCno, ktg_iptal, ktg_fileid,
      ktg_create_user, ktg_create_date,
      ktg_kod, ktg_isim, ktg_aciklama
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @createUser, GETDATE(),
      @kod, @isim, @aciklama
    )
  `

  await postItem("/mikro/save", token, { query, params: body })
  return Response.json({ success: true })
}
```

---

## React Component Örneği

```typescript
"use client"

import { useState, useEffect } from "react"
import { postItem } from "@/lib/fetch"

interface Kategori {
  ktgKod: string
  ktgIsim: string
  ktgAciklama: string
  stokSayisi: number
}

export default function KategoriListesi() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKategoriler()
  }, [])

  const loadKategoriler = async () => {
    const query = `
      SELECT 
        k.ktg_kod as ktgKod,
        k.ktg_isim as ktgIsim,
        k.ktg_aciklama as ktgAciklama,
        COUNT(s.sto_kod) as stokSayisi
      FROM STOK_KATEGORILERI k
      LEFT JOIN STOKLAR s ON s.sto_kategori_kodu = k.ktg_kod
      WHERE k.ktg_iptal = 0
      GROUP BY k.ktg_kod, k.ktg_isim, k.ktg_aciklama
      ORDER BY k.ktg_kod
    `

    const data = await postItem("/mikro/get", token, { query })
    setKategoriler(data || [])
    setLoading(false)
  }

  return (
    <div>
      {kategoriler.map((k) => (
        <div key={k.ktgKod}>
          <h3>{k.ktgIsim}</h3>
          <p>{k.ktgAciklama}</p>
          <span>Stok Sayısı: {k.stokSayisi}</span>
        </div>
      ))}
    </div>
  )
}
```

---

## Önemli Notlar

### 🔑 Birincil Anahtar

- `ktg_Guid` alanı PRIMARY KEY
- `ktg_kod` alanı UNIQUE (benzersiz olmalı)

### 🔗 İlişkiler

- STOKLAR tablosunda `sto_kategori_kodu` alanı bu tabloya referans verir
- Kategori silinmeden önce, ona bağlı stok olup olmadığı kontrol edilmelidir

### 📊 Kullanım Senaryoları

1. **Ürün Filtreleme**: Web sitesi veya raporlarda kategoriye göre filtreleme
2. **Fiyat Stratejisi**: Kategorilere özel indirim kampanyaları
3. **Stok Yönetimi**: Kategorilere göre stok seviyesi takibi
4. **Raporlama**: Kategorilere göre satış ve karlılık analizi

### 💡 En İyi Uygulamalar

- Kategori kodları anlamlı olmalı (ÖRN: "ITHAL", "ORGANIK", "SEZONLUK")
- Açıklama alanı detaylı doldurulmalı
- Ana grup/alt grup yapısı ile birlikte kullanılabilir
- Kategoriler çok fazla artmamalı (maksimum 50-100 kategori ideal)

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

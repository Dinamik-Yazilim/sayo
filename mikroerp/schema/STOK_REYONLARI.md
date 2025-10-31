# STOK_REYONLARI Tablosu - Reyon Kartları

## Tablo Özeti

**Tablo Adı:** `STOK_REYONLARI`  
**Türkçe Adı:** Reyon Kartları  
**Amaç:** Depolardaki reyonları (reyon bölümleri, raflar) tanımlamak ve yönetmek  
**Veri Tabanı:** Mikro ERP V16/V17

Reyon kartları tablosu, depo içerisindeki fiziksel reyonları (raf bölümleri) tanımlar. Her reyon bir depo içerisinde stok tutulabilecek bir yerdir. Stok hareketlerinde ve stok yönetiminde kullanılır.

---

## Tablo Yapısı

| Alan No | Alan Adı          | Veri Tipi        | Açıklama                           | Örnek Değer                            |
| ------- | ----------------- | ---------------- | ---------------------------------- | -------------------------------------- |
| 0       | `ryn_Guid`        | Uniqueidentifier | Benzersiz reyon tanımlayıcı        | `A1B2C3D4-E5F6-7890-1234-567890ABCDEF` |
| 1       | `ryn_DBCno`       | Smallint         | Veritabanı şirketi numarası        | `1`                                    |
| 2       | `ryn_SpecRECno`   | Integer          | Özel kayıt numarası                | `0`                                    |
| 3       | `ryn_iptal`       | Bit              | İptal bayrağı (0=Aktif, 1=İptal)   | `0`                                    |
| 4       | `ryn_fileid`      | Smallint         | Dosya tanımlayıcı                  | `1`                                    |
| 5       | `ryn_hidden`      | Bit              | Gizli bayrak (0=Görünür, 1=Gizli)  | `0`                                    |
| 6       | `ryn_kilitli`     | Bit              | Kilitli bayrak (0=Açık, 1=Kilitli) | `0`                                    |
| 7       | `ryn_degisti`     | Bit              | Değişim bayrağı                    | `0`                                    |
| 8       | `ryn_checksum`    | Integer          | Kontrol toplamı                    | `12345`                                |
| 9       | `ryn_create_user` | Smallint         | Oluşturan kullanıcı ID             | `1`                                    |
| 10      | `ryn_create_date` | DateTime         | Oluşturma tarihi                   | `2024-01-15 09:30:00`                  |
| 11      | `ryn_lastup_user` | Smallint         | Son güncelleyen kullanıcı ID       | `2`                                    |
| 12      | `ryn_lastup_date` | DateTime         | Son güncelleme tarihi              | `2024-10-20 14:45:00`                  |
| 13      | `ryn_special1`    | Nvarchar(4)      | Özel alan 1                        | `SPCL`                                 |
| 14      | `ryn_special2`    | Nvarchar(4)      | Özel alan 2                        | `STD`                                  |
| 15      | `ryn_special3`    | Nvarchar(4)      | Özel alan 3                        | `MAN`                                  |
| 16      | `ryn_kod`         | Nvarchar(25)     | **Reyon Kodu (Benzersiz)**         | `R-001`                                |
| 17      | `ryn_ismi`        | Nvarchar(40)     | **Reyon Adı**                      | `Ana Reyon`                            |

---

## Alan Kategorileri

### 🔑 Temel Alanlar

- **ryn_kod** (Nvarchar(25)): Reyon kodunun benzersiz tanımlayıcısı
- **ryn_ismi** (Nvarchar(40)): Reyonun adı (örn: "Ana Reyon", "B Bölümü Raf 1")

### 🔐 Sistem Alanları

- **ryn_Guid** (Uniqueidentifier): Sistemin reyon için atadığı benzersiz GUID
- **ryn_DBCno** (Smallint): Veritabanı şirketi numarası (çok şirketli yapıda)
- **ryn_SpecRECno** (Integer): Özel kayıt numarası (sistem tarafından yönetilen)
- **ryn_fileid** (Smallint): Dosya tanımlayıcı

### ⚠️ Durum Bayrakları

- **ryn_iptal** (Bit): `0` = Aktif, `1` = İptal edilmiş (silinmiş)
- **ryn_hidden** (Bit): `0` = Görünür, `1` = Gizli (listede gösterilmez)
- **ryn_kilitli** (Bit): `0` = Açık (düzenlenebilir), `1` = Kilitli (salt okunur)
- **ryn_degisti** (Bit): Veri değişip değişmediğini gösteren bayrak

### 👤 Kullanıcı İzleme

- **ryn_create_user** (Smallint): Reyon kartını oluşturan kullanıcının ID'si
- **ryn_create_date** (DateTime): Reyon kartının oluşturulma tarihi ve saati
- **ryn_lastup_user** (Smallint): Son güncelleyen kullanıcının ID'si
- **ryn_lastup_date** (DateTime): Son güncelleme tarihi ve saati

### 📝 Özel Alanlar

- **ryn_special1, ryn_special2, ryn_special3** (Nvarchar(4)): Gelecekteki ihtiyaçlar için ayrılan ek alanlar

### 🔧 Teknik Alanlar

- **ryn_checksum** (Integer): Satırın bütünlüğünü kontrol etmek için kullanılan kontrol toplamı

---

## İndeksler

| İndeks Adı              | Özellik     | Alanlar    | Açıklama                                                   |
| ----------------------- | ----------- | ---------- | ---------------------------------------------------------- |
| `NDX_STOK_REYONLARI_00` | PRIMARY KEY | `ryn_Guid` | Birincil anahtar - Her reyon benzersiz GUID ile tanımlanır |
| `NDX_STOK_REYONLARI_02` | UNIQUE      | `ryn_kod`  | Reyon kodu benzersiz olmalıdır (R-001, R-002 vb.)          |
| `NDX_STOK_REYONLARI_03` | İndeks      | `ryn_ismi` | Reyon adına göre hızlı arama için indeks                   |

---

## İlişkiler

### STOKLAR Tablosu ile İlişki

Reyon kartları, `STOKLAR` tablosundaki stok kaydıyla bağlantılı olabilir:

```sql
-- STOKLAR tablosunda muhtemelen sto_reyon_id veya benzeri alan olacak
SELECT
    s.sto_kod,
    s.sto_ismi,
    r.ryn_kod,
    r.ryn_ismi
FROM STOKLAR s
LEFT JOIN STOK_REYONLARI r ON s.sto_reyon_id = r.ryn_Guid
```

### STOK_HAREKETLERI Tablosu ile İlişki

Stok hareketleri kayıtlarında reyon bilgisi tutulabilir:

```sql
SELECT
    h.har_id,
    h.har_tarihi,
    h.har_turu,
    r.ryn_kod,
    r.ryn_ismi
FROM STOK_HAREKETLERI h
LEFT JOIN STOK_REYONLARI r ON h.har_reyon_id = r.ryn_Guid
```

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Reyonları Listele

```sql
SELECT
    ryn_Guid,
    ryn_kod,
    ryn_ismi,
    ryn_create_date,
    ryn_lastup_date
FROM STOK_REYONLARI
WHERE ryn_iptal = 0
ORDER BY ryn_kod
```

### 2. Belirli Bir Reyon Kartını Getir

```sql
SELECT
    ryn_Guid,
    ryn_kod,
    ryn_ismi,
    ryn_kilitli,
    ryn_hidden,
    ryn_create_user,
    ryn_create_date,
    ryn_lastup_user,
    ryn_lastup_date
FROM STOK_REYONLARI
WHERE ryn_kod = 'R-001'
    AND ryn_iptal = 0
```

### 3. Yeni Reyon Kartı Ekle

```sql
INSERT INTO STOK_REYONLARI (
    ryn_Guid,
    ryn_DBCno,
    ryn_SpecRECno,
    ryn_iptal,
    ryn_fileid,
    ryn_hidden,
    ryn_kilitli,
    ryn_degisti,
    ryn_checksum,
    ryn_create_user,
    ryn_create_date,
    ryn_lastup_user,
    ryn_lastup_date,
    ryn_special1,
    ryn_special2,
    ryn_special3,
    ryn_kod,
    ryn_ismi
)
VALUES (
    NEWID(),           -- ryn_Guid
    1,                 -- ryn_DBCno (şirket numarası)
    0,                 -- ryn_SpecRECno
    0,                 -- ryn_iptal (aktif)
    1,                 -- ryn_fileid
    0,                 -- ryn_hidden (görünür)
    0,                 -- ryn_kilitli (açık)
    0,                 -- ryn_degisti
    0,                 -- ryn_checksum
    1,                 -- ryn_create_user (kullanıcı ID)
    GETDATE(),         -- ryn_create_date
    1,                 -- ryn_lastup_user
    GETDATE(),         -- ryn_lastup_date
    NULL,              -- ryn_special1
    NULL,              -- ryn_special2
    NULL,              -- ryn_special3
    'R-005',           -- ryn_kod
    'Yeni Reyon'       -- ryn_ismi
)
```

### 4. Reyon Kartını Güncelle

```sql
UPDATE STOK_REYONLARI
SET
    ryn_ismi = 'Güncellenmiş Reyon Adı',
    ryn_lastup_user = 2,
    ryn_lastup_date = GETDATE(),
    ryn_degisti = 1
WHERE ryn_kod = 'R-001'
    AND ryn_iptal = 0
```

### 5. Reyon Kartını Soft Delete (İptal Et)

```sql
UPDATE STOK_REYONLARI
SET
    ryn_iptal = 1,
    ryn_lastup_user = 2,
    ryn_lastup_date = GETDATE(),
    ryn_degisti = 1
WHERE ryn_kod = 'R-003'
```

### 6. Gizli Reyonları Göster/Gizle

```sql
-- Gizli reyonları göster
UPDATE STOK_REYONLARI
SET
    ryn_hidden = 0,
    ryn_lastup_date = GETDATE()
WHERE ryn_kod = 'R-002'

-- Reyon gizle
UPDATE STOK_REYONLARI
SET
    ryn_hidden = 1,
    ryn_lastup_date = GETDATE()
WHERE ryn_kod = 'R-004'
```

### 7. Reyon İstatistikleri

```sql
SELECT
    COUNT(*) AS toplam_reyon,
    SUM(CASE WHEN ryn_iptal = 0 THEN 1 ELSE 0 END) AS aktif_reyon,
    SUM(CASE WHEN ryn_iptal = 1 THEN 1 ELSE 0 END) AS iptal_reyon,
    SUM(CASE WHEN ryn_hidden = 1 THEN 1 ELSE 0 END) AS gizli_reyon,
    SUM(CASE WHEN ryn_kilitli = 1 THEN 1 ELSE 0 END) AS kilitli_reyon
FROM STOK_REYONLARI
```

### 8. Reyon Kodu ile Reyonları Ara

```sql
SELECT
    ryn_Guid,
    ryn_kod,
    ryn_ismi
FROM STOK_REYONLARI
WHERE ryn_kod LIKE 'R-%'
    AND ryn_iptal = 0
ORDER BY ryn_kod
```

---

## DinamikSAYO Entegrasyonu

### TypeScript Arayüzü

```typescript
// types/ShelfCard.ts

export interface ShelfCard {
  // Sistem alanları
  rynGuid: string // Benzersiz tanımlayıcı
  rynDBCno: number // Veritabanı şirketi numarası
  rynSpecRECno: number // Özel kayıt numarası
  rynFileId: number // Dosya tanımlayıcı
  rynChecksum: number // Kontrol toplamı

  // Temel bilgiler
  rynKod: string // Reyon kodu (benzersiz)
  rynIsmi: string // Reyon adı

  // Durum bayrakları
  rynIptal: boolean // İptal bayrağı
  rynHidden: boolean // Gizli bayrak
  rynKilitli: boolean // Kilitli bayrak
  rynDegisti: boolean // Değişim bayrağı

  // Kullanıcı izleme
  rynCreateUser: number // Oluşturan kullanıcı
  rynCreateDate: Date // Oluşturma tarihi
  rynLastupUser: number // Son güncelleyen kullanıcı
  rynLastupDate: Date // Son güncelleme tarihi

  // Özel alanlar
  rynSpecial1?: string // Özel alan 1
  rynSpecial2?: string // Özel alan 2
  rynSpecial3?: string // Özel alan 3
}

// Reyon Oluşturma Formunda Kullanılan Tip
export interface CreateShelfCardRequest {
  rynKod: string
  rynIsmi: string
  rynSpecial1?: string
  rynSpecial2?: string
  rynSpecial3?: string
}

// Reyon Güncelleme İsteği
export interface UpdateShelfCardRequest {
  rynIsmi?: string
  rynSpecial1?: string
  rynSpecial2?: string
  rynSpecial3?: string
  rynKilitli?: boolean
}
```

### API Endpoint Örnekleri

#### 1. Tüm Reyonları Listele

```typescript
// GET /api/shelf-cards

export async function GET() {
  try {
    const query = `
      SELECT 
        ryn_Guid as rynGuid,
        ryn_kod as rynKod,
        ryn_ismi as rynIsmi,
        ryn_iptal as rynIptal,
        ryn_hidden as rynHidden,
        ryn_kilitli as rynKilitli,
        ryn_create_date as rynCreateDate,
        ryn_lastup_date as rynLastupDate
      FROM STOK_REYONLARI
      WHERE ryn_iptal = 0
      ORDER BY ryn_kod
    `

    const result = await executeQuery(query)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 2. Belirli Reyon Kartını Getir

```typescript
// GET /api/shelf-cards/:kod

export async function GET(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const query = `
      SELECT *
      FROM STOK_REYONLARI
      WHERE ryn_kod = @kod
        AND ryn_iptal = 0
    `

    const result = await executeQuery(query, {
      kod: params.kod,
    })

    if (!result.length) {
      return Response.json({ error: "Reyon bulunamadı" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 3. Yeni Reyon Kartı Ekle

```typescript
// POST /api/shelf-cards

export async function POST(request: Request) {
  try {
    const data: CreateShelfCardRequest = await request.json()

    // Validasyon
    if (!data.rynKod || !data.rynIsmi) {
      return Response.json(
        { error: "Reyon kodu ve adı gereklidir" },
        { status: 400 }
      )
    }

    // Benzersizlik kontrolü
    const checkQuery = `
      SELECT COUNT(*) as cnt FROM STOK_REYONLARI
      WHERE ryn_kod = @kod
    `
    const check = await executeQuery(checkQuery, { kod: data.rynKod })

    if (check[0].cnt > 0) {
      return Response.json(
        { error: "Bu reyon kodu zaten kullanılıyor" },
        { status: 409 }
      )
    }

    const insertQuery = `
      INSERT INTO STOK_REYONLARI (
        ryn_Guid, ryn_DBCno, ryn_SpecRECno, ryn_iptal,
        ryn_fileid, ryn_hidden, ryn_kilitli, ryn_degisti,
        ryn_checksum, ryn_create_user, ryn_create_date,
        ryn_lastup_user, ryn_lastup_date,
        ryn_special1, ryn_special2, ryn_special3,
        ryn_kod, ryn_ismi
      )
      VALUES (
        NEWID(), @dbcno, 0, 0, 1, 0, 0, 0, 0,
        @userId, GETDATE(), @userId, GETDATE(),
        @special1, @special2, @special3,
        @kod, @ismi
      )
    `

    await executeQuery(insertQuery, {
      dbcno: 1,
      userId: getCurrentUserId(),
      special1: data.rynSpecial1 || null,
      special2: data.rynSpecial2 || null,
      special3: data.rynSpecial3 || null,
      kod: data.rynKod,
      ismi: data.rynIsmi,
    })

    return Response.json(
      { message: "Reyon başarıyla oluşturuldu" },
      { status: 201 }
    )
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 4. Reyon Kartını Güncelle

```typescript
// PATCH /api/shelf-cards/:kod

export async function PATCH(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const data: UpdateShelfCardRequest = await request.json()

    const updateQuery = `
      UPDATE STOK_REYONLARI
      SET
        ryn_ismi = COALESCE(@ismi, ryn_ismi),
        ryn_special1 = COALESCE(@special1, ryn_special1),
        ryn_special2 = COALESCE(@special2, ryn_special2),
        ryn_special3 = COALESCE(@special3, ryn_special3),
        ryn_kilitli = COALESCE(@kilitli, ryn_kilitli),
        ryn_lastup_user = @userId,
        ryn_lastup_date = GETDATE(),
        ryn_degisti = 1
      WHERE ryn_kod = @kod
        AND ryn_iptal = 0
    `

    const result = await executeQuery(updateQuery, {
      kod: params.kod,
      ismi: data.rynIsmi || null,
      special1: data.rynSpecial1 || null,
      special2: data.rynSpecial2 || null,
      special3: data.rynSpecial3 || null,
      kilitli: data.rynKilitli !== undefined ? (data.rynKilitli ? 1 : 0) : null,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Reyon güncellendi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 5. Reyon Kartını Sil (Soft Delete)

```typescript
// DELETE /api/shelf-cards/:kod

export async function DELETE(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const deleteQuery = `
      UPDATE STOK_REYONLARI
      SET
        ryn_iptal = 1,
        ryn_lastup_user = @userId,
        ryn_lastup_date = GETDATE(),
        ryn_degisti = 1
      WHERE ryn_kod = @kod
    `

    await executeQuery(deleteQuery, {
      kod: params.kod,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Reyon silindi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### React Bileşen Örneği

#### Reyon Seçim Dropdown Bileşeni

```typescript
// components/shelf-card-select.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShelfCard } from "@/types/ShelfCard"

interface ShelfCardSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ShelfCardSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Reyon seçin...",
}: ShelfCardSelectProps) {
  const [shelfCards, setShelfCards] = useState<ShelfCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShelfCards = async () => {
      try {
        const response = await fetch("/api/shelf-cards")
        if (!response.ok) throw new Error("Reyonlar yüklenemedi")

        const data = await response.json()
        setShelfCards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchShelfCards()
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {error ? (
          <div className="px-2 py-1.5 text-sm text-red-500">{error}</div>
        ) : shelfCards.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">
            Reyon bulunamadı
          </div>
        ) : (
          shelfCards.map((card) => (
            <SelectItem key={card.rynGuid} value={card.rynKod}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{card.rynKod}</span>
                <span className="text-gray-600">-</span>
                <span>{card.rynIsmi}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
```

#### Reyon Kartı Listesi Bileşeni

```typescript
// components/shelf-cards-list.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShelfCard } from "@/types/ShelfCard"

export function ShelfCardsList() {
  const [shelfCards, setShelfCards] = useState<ShelfCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShelfCards = async () => {
      try {
        const response = await fetch("/api/shelf-cards")
        const data = await response.json()
        setShelfCards(data)
      } finally {
        setLoading(false)
      }
    }

    fetchShelfCards()
  }, [])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reyon Kodu</TableHead>
          <TableHead>Reyon Adı</TableHead>
          <TableHead>Durumu</TableHead>
          <TableHead>Oluşturma Tarihi</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shelfCards.map((card) => (
          <TableRow key={card.rynGuid}>
            <TableCell className="font-medium">{card.rynKod}</TableCell>
            <TableCell>{card.rynIsmi}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {card.rynKilitli && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Kilitli
                  </span>
                )}
                {card.rynHidden && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Gizli
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              {new Date(card.rynCreateDate).toLocaleDateString("tr-TR")}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                Düzenle
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                Sil
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## Önemli Notlar

### 📌 Benzersizlik Kuralları

1. **ryn_Guid** - MSSQL tarafından otomatik olarak atanan benzersiz tanımlayıcı
2. **ryn_kod** - Reyon kodunun benzersiz olması **zorunludur** (R-001, R-002 vb.)
   - Yinelenen kodla reyon oluşturmaya çalışmak başarısız olur
   - Veri tabanı seviyesinde `UNIQUE` kısıtlaması vardır

### 🗑️ Silme İşlemi - Soft Delete

- Mikro ERP'de `DELETE` yerine **soft delete** kullanılır
- Silmek için `ryn_iptal = 1` ayarlanır (fiziksel silme yapılmaz)
- Silinen reyonlar listelerden `WHERE ryn_iptal = 0` ile filtrelenerek gizlenir
- Silinen veriler arşiv/audit amaçlı tutulur

### 🔒 Kilitli Reyonlar

- `ryn_kilitli = 1` olan reyonlar **salt okunur** olur
- Bu reyonlar güncellenemesin veya silinemez
- Sistem yöneticileri tarafından kritik reyonları korumak için kullanılır

### 👁️ Gizli Reyonlar

- `ryn_hidden = 1` olan reyonlar arayüzde **gösterilmez**
- Ancak veritabanında hala mevcuttur
- Raporlar ve istatistiklerde şartlı olarak kullanılabilir
- Geçici olarak devre dışı bırakmak için idealdir

### 👤 Kullanıcı İzleme

- Reyon oluşturma ve güncellemeler tamamen **audit** edilir
- `ryn_create_user` ve `ryn_create_date` - oluşturma bilgileri (değiştirilmez)
- `ryn_lastup_user` ve `ryn_lastup_date` - son güncelleme bilgileri (her değişiklikle güncellenir)

### 🔧 Depolama Kapasitesi

- `ryn_kod` maksimum 25 karakter tutabilir
- `ryn_ismi` maksimum 40 karakter tutabilir
- Bu değerler aşılırsa veritabanı işlemi başarısız olur

### 🆚 Comparation with İlişkili Tablolar

- **STOKLAR** - Depo stok kartları (depodan satın alınan ürünler)
- **STOK_REYONLARI** - Reyonlar (depo içi fiziksel bölümlendirme)
- **STOK_HAREKETLERI** - Stok giriş/çıkış işlemleri
- **DEPOLAR** - Depoların tanımları (bölgeler, şehirler)

---

## İstatistik Sorguları

### Reyon Kullanım İstatistikleri

```sql
SELECT
    COUNT(*) AS toplam_reyon_sayisi,
    SUM(CASE WHEN ryn_iptal = 0 THEN 1 ELSE 0 END) AS aktif_reyon,
    SUM(CASE WHEN ryn_iptal = 1 THEN 1 ELSE 0 END) AS iptal_reyon,
    SUM(CASE WHEN ryn_hidden = 1 THEN 1 ELSE 0 END) AS gizli_reyon,
    SUM(CASE WHEN ryn_kilitli = 1 THEN 1 ELSE 0 END) AS kilitli_reyon,
    COUNT(DISTINCT ryn_create_user) AS reyon_tanimlayan_kullanici_sayisi
FROM STOK_REYONLARI
```

### Aylık Reyon Oluşturma Trendi

```sql
SELECT
    DATEPART(YEAR, ryn_create_date) AS yil,
    DATEPART(MONTH, ryn_create_date) AS ay,
    COUNT(*) AS olusturulan_reyon_sayisi
FROM STOK_REYONLARI
WHERE ryn_iptal = 0
GROUP BY DATEPART(YEAR, ryn_create_date), DATEPART(MONTH, ryn_create_date)
ORDER BY yil DESC, ay DESC
```

### En Çok Güncellenen Reyonlar

```sql
SELECT TOP 10
    ryn_kod,
    ryn_ismi,
    ryn_create_user,
    ryn_create_date,
    ryn_lastup_user,
    ryn_lastup_date,
    DATEDIFF(DAY, ryn_create_date, ryn_lastup_date) AS guncelleme_interval_gun
FROM STOK_REYONLARI
WHERE ryn_iptal = 0
ORDER BY ryn_lastup_date DESC
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, STOK_HAREKETLERI, DEPOLAR
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

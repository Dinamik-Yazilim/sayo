# STOK_ANA_GRUPLARI Tablosu - Stok Ana Grupları

## Tablo Özeti

**Tablo Adı:** `STOK_ANA_GRUPLARI`  
**Türkçe Adı:** Stok Ana Grupları  
**Amaç:** Stokları kategorize etmek için kullanılan üst düzey grup tanımlamaları  
**Veri Tabanı:** Mikro ERP V16/V17

Stok ana grupları tablosu, ürünleri kategorize etmek için kullanılan en üst düzey sınıflandırma yapısıdır. Her stok kartı bir ana gruba bağlıdır. Ana gruplar altında alt gruplar ve detay gruplar tanımlanabilir (hiyerarşik yapı).

**Örnek Ana Gruplar:**

- Hammadde
- Yarı Mamul
- Mamul
- Ticari Mal
- Yedek Parça
- Ambalaj Malzemeleri

---

## Tablo Yapısı

| Alan No | Alan Adı          | Veri Tipi        | Açıklama                                    | Örnek Değer           |
| ------- | ----------------- | ---------------- | ------------------------------------------- | --------------------- |
| 0       | `san_Guid`        | Integer IDENTITY | Benzersiz grup tanımlayıcı (otomatik artan) | `1001`                |
| 1       | `san_DBCno`       | Smallint         | Veritabanı şirketi numarası                 | `1`                   |
| 2       | `san_SpecRECno`   | Integer          | Özel kayıt numarası                         | `0`                   |
| 3       | `san_iptal`       | Bit              | İptal bayrağı (0=Aktif, 1=İptal)            | `0`                   |
| 4       | `san_fileid`      | Smallint         | Dosya tanımlayıcı                           | `1`                   |
| 5       | `san_hidden`      | Bit              | Gizli bayrak (0=Görünür, 1=Gizli)           | `0`                   |
| 6       | `san_kilitli`     | Bit              | Kilitli bayrak (0=Açık, 1=Kilitli)          | `0`                   |
| 7       | `san_degisti`     | Bit              | Değişim bayrağı                             | `0`                   |
| 8       | `san_checksum`    | Integer          | Kontrol toplamı                             | `12345`               |
| 9       | `san_create_user` | Smallint         | Oluşturan kullanıcı ID                      | `1`                   |
| 10      | `san_create_date` | DateTime         | Oluşturma tarihi                            | `2024-01-15 09:30:00` |
| 11      | `san_lastup_user` | Smallint         | Son güncelleyen kullanıcı ID                | `2`                   |
| 12      | `san_lastup_date` | DateTime         | Son güncelleme tarihi                       | `2024-10-20 14:45:00` |
| 13      | `san_special1`    | Nvarchar(4)      | Özel alan 1                                 | `SPCL`                |
| 14      | `san_special2`    | Nvarchar(4)      | Özel alan 2                                 | `STD`                 |
| 15      | `san_special3`    | Nvarchar(4)      | Özel alan 3                                 | `MAN`                 |
| 16      | `san_kod`         | Nvarchar(25)     | **Stok Ana Grup Kodu (Benzersiz)**          | `AG-001`              |
| 17      | `san_isim`        | Nvarchar(40)     | **Stok Ana Grup Adı**                       | `Hammadde`            |

---

## Alan Kategorileri

### 🔑 Temel Alanlar

- **san_kod** (Nvarchar(25)): Ana grup kodunun benzersiz tanımlayıcısı
- **san_isim** (Nvarchar(40)): Ana grubun adı (örn: "Hammadde", "Mamul", "Ticari Mal")

### 🔐 Sistem Alanları

- **san_Guid** (Integer IDENTITY): Sistemin ana grup için atadığı benzersiz ID (otomatik artan)
- **san_DBCno** (Smallint): Veritabanı şirketi numarası (çok şirketli yapıda)
- **san_SpecRECno** (Integer): Özel kayıt numarası (sistem tarafından yönetilen)
- **san_fileid** (Smallint): Dosya tanımlayıcı

### ⚠️ Durum Bayrakları

- **san_iptal** (Bit): `0` = Aktif, `1` = İptal edilmiş (silinmiş)
- **san_hidden** (Bit): `0` = Görünür, `1` = Gizli (listede gösterilmez)
- **san_kilitli** (Bit): `0` = Açık (düzenlenebilir), `1` = Kilitli (salt okunur)
- **san_degisti** (Bit): Veri değişip değişmediğini gösteren bayrak

### 👤 Kullanıcı İzleme

- **san_create_user** (Smallint): Ana grup kartını oluşturan kullanıcının ID'si
- **san_create_date** (DateTime): Ana grup kartının oluşturulma tarihi ve saati
- **san_lastup_user** (Smallint): Son güncelleyen kullanıcının ID'si
- **san_lastup_date** (DateTime): Son güncelleme tarihi ve saati

### 📝 Özel Alanlar

- **san_special1, san_special2, san_special3** (Nvarchar(4)): Gelecekteki ihtiyaçlar için ayrılan ek alanlar

### 🔧 Teknik Alanlar

- **san_checksum** (Integer): Satırın bütünlüğünü kontrol etmek için kullanılan kontrol toplamı

---

## İndeksler

| İndeks Adı                 | Özellik     | Alanlar    | Açıklama                                                    |
| -------------------------- | ----------- | ---------- | ----------------------------------------------------------- |
| `NDX_STOK_ANA_GRUPLARI_00` | PRIMARY KEY | `san_Guid` | Birincil anahtar - Her ana grup benzersiz ID ile tanımlanır |
| `NDX_STOK_ANA_GRUPLARI_02` | UNIQUE      | `san_kod`  | Ana grup kodu benzersiz olmalıdır (AG-001, AG-002 vb.)      |

---

## İlişkiler

### STOKLAR Tablosu ile İlişki

Ana gruplar, stok kartlarıyla bağlantılıdır:

```sql
-- STOKLAR tablosunda muhtemelen sto_ana_grup_kodu veya sto_ana_grup_id alanı var
SELECT
    s.sto_kod,
    s.sto_ismi,
    ag.san_kod,
    ag.san_isim
FROM STOKLAR s
INNER JOIN STOK_ANA_GRUPLARI ag ON s.sto_ana_grup_id = ag.san_Guid
WHERE ag.san_iptal = 0
```

### STOK_ALT_GRUPLARI Tablosu ile İlişki

Ana gruplar, alt grupların üst seviyesidir:

```sql
-- Alt gruplar ana gruplara bağlıdır (hiyerarşik yapı)
SELECT
    ag.san_kod AS ana_grup_kodu,
    ag.san_isim AS ana_grup_adi,
    alt.salt_kod AS alt_grup_kodu,
    alt.salt_isim AS alt_grup_adi
FROM STOK_ANA_GRUPLARI ag
LEFT JOIN STOK_ALT_GRUPLARI alt ON alt.salt_ana_grup_id = ag.san_Guid
WHERE ag.san_iptal = 0
ORDER BY ag.san_kod, alt.salt_kod
```

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Ana Grupları Listele

```sql
SELECT
    san_Guid,
    san_kod,
    san_isim,
    san_create_date,
    san_lastup_date
FROM STOK_ANA_GRUPLARI
WHERE san_iptal = 0
ORDER BY san_kod
```

### 2. Belirli Bir Ana Grubu Getir

```sql
SELECT
    san_Guid,
    san_kod,
    san_isim,
    san_kilitli,
    san_hidden,
    san_create_user,
    san_create_date,
    san_lastup_user,
    san_lastup_date
FROM STOK_ANA_GRUPLARI
WHERE san_kod = 'AG-001'
    AND san_iptal = 0
```

### 3. Yeni Ana Grup Ekle

```sql
-- Not: san_Guid IDENTITY olduğu için INSERT sırasında belirtilmez (otomatik artar)
INSERT INTO STOK_ANA_GRUPLARI (
    san_DBCno,
    san_SpecRECno,
    san_iptal,
    san_fileid,
    san_hidden,
    san_kilitli,
    san_degisti,
    san_checksum,
    san_create_user,
    san_create_date,
    san_lastup_user,
    san_lastup_date,
    san_special1,
    san_special2,
    san_special3,
    san_kod,
    san_isim
)
VALUES (
    1,                 -- san_DBCno (şirket numarası)
    0,                 -- san_SpecRECno
    0,                 -- san_iptal (aktif)
    1,                 -- san_fileid
    0,                 -- san_hidden (görünür)
    0,                 -- san_kilitli (açık)
    0,                 -- san_degisti
    0,                 -- san_checksum
    1,                 -- san_create_user (kullanıcı ID)
    GETDATE(),         -- san_create_date
    1,                 -- san_lastup_user
    GETDATE(),         -- san_lastup_date
    NULL,              -- san_special1
    NULL,              -- san_special2
    NULL,              -- san_special3
    'AG-005',          -- san_kod
    'Yeni Ana Grup'    -- san_isim
)

-- Oluşturulan ID'yi almak için
SELECT SCOPE_IDENTITY() AS yeni_ana_grup_id
```

### 4. Ana Grubu Güncelle

```sql
UPDATE STOK_ANA_GRUPLARI
SET
    san_isim = 'Güncellenmiş Ana Grup Adı',
    san_lastup_user = 2,
    san_lastup_date = GETDATE(),
    san_degisti = 1
WHERE san_kod = 'AG-001'
    AND san_iptal = 0
```

### 5. Ana Grubu Soft Delete (İptal Et)

```sql
UPDATE STOK_ANA_GRUPLARI
SET
    san_iptal = 1,
    san_lastup_user = 2,
    san_lastup_date = GETDATE(),
    san_degisti = 1
WHERE san_kod = 'AG-003'
```

### 6. Ana Grup Koduna Göre Ara

```sql
SELECT
    san_Guid,
    san_kod,
    san_isim
FROM STOK_ANA_GRUPLARI
WHERE san_kod LIKE 'AG-%'
    AND san_iptal = 0
ORDER BY san_kod
```

### 7. Ana Grup İsimine Göre Ara (Fuzzy Search)

```sql
SELECT
    san_Guid,
    san_kod,
    san_isim
FROM STOK_ANA_GRUPLARI
WHERE san_isim LIKE '%mamul%'
    AND san_iptal = 0
ORDER BY san_isim
```

### 8. Her Ana Gruptaki Stok Sayısı

```sql
SELECT
    ag.san_kod,
    ag.san_isim,
    COUNT(s.sto_Guid) AS stok_sayisi
FROM STOK_ANA_GRUPLARI ag
LEFT JOIN STOKLAR s ON s.sto_ana_grup_id = ag.san_Guid
WHERE ag.san_iptal = 0
    AND (s.sto_iptal = 0 OR s.sto_Guid IS NULL)
GROUP BY ag.san_kod, ag.san_isim
ORDER BY stok_sayisi DESC
```

---

## DinamikSAYO Entegrasyonu

### TypeScript Arayüzü

```typescript
// types/StockMainGroup.ts

export interface StockMainGroup {
  // Sistem alanları
  sanGuid: number // Benzersiz tanımlayıcı (IDENTITY)
  sanDBCno: number // Veritabanı şirketi numarası
  sanSpecRECno: number // Özel kayıt numarası
  sanFileId: number // Dosya tanımlayıcı
  sanChecksum: number // Kontrol toplamı

  // Temel bilgiler
  sanKod: string // Ana grup kodu (benzersiz)
  sanIsim: string // Ana grup adı

  // Durum bayrakları
  sanIptal: boolean // İptal bayrağı
  sanHidden: boolean // Gizli bayrak
  sanKilitli: boolean // Kilitli bayrak
  sanDegisti: boolean // Değişim bayrağı

  // Kullanıcı izleme
  sanCreateUser: number // Oluşturan kullanıcı
  sanCreateDate: Date // Oluşturma tarihi
  sanLastupUser: number // Son güncelleyen kullanıcı
  sanLastupDate: Date // Son güncelleme tarihi

  // Özel alanlar
  sanSpecial1?: string // Özel alan 1
  sanSpecial2?: string // Özel alan 2
  sanSpecial3?: string // Özel alan 3
}

// Ana Grup Oluşturma İsteği
export interface CreateStockMainGroupRequest {
  sanKod: string
  sanIsim: string
  sanSpecial1?: string
  sanSpecial2?: string
  sanSpecial3?: string
}

// Ana Grup Güncelleme İsteği
export interface UpdateStockMainGroupRequest {
  sanIsim?: string
  sanSpecial1?: string
  sanSpecial2?: string
  sanSpecial3?: string
  sanKilitli?: boolean
}

// Ana Grup İstatistikleri
export interface StockMainGroupStats {
  sanGuid: number
  sanKod: string
  sanIsim: string
  stockCount: number // Bu ana gruptaki toplam stok sayısı
  subGroupCount: number // Alt grup sayısı
}
```

### API Endpoint Örnekleri

#### 1. Tüm Ana Grupları Listele

```typescript
// GET /api/stock-main-groups

export async function GET() {
  try {
    const query = `
      SELECT 
        san_Guid as sanGuid,
        san_kod as sanKod,
        san_isim as sanIsim,
        san_iptal as sanIptal,
        san_hidden as sanHidden,
        san_kilitli as sanKilitli,
        san_create_date as sanCreateDate,
        san_lastup_date as sanLastupDate
      FROM STOK_ANA_GRUPLARI
      WHERE san_iptal = 0
      ORDER BY san_kod
    `

    const result = await executeQuery(query)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 2. Belirli Ana Grubu Getir

```typescript
// GET /api/stock-main-groups/:kod

export async function GET(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const query = `
      SELECT *
      FROM STOK_ANA_GRUPLARI
      WHERE san_kod = @kod
        AND san_iptal = 0
    `

    const result = await executeQuery(query, {
      kod: params.kod,
    })

    if (!result.length) {
      return Response.json({ error: "Ana grup bulunamadı" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 3. Yeni Ana Grup Ekle

```typescript
// POST /api/stock-main-groups

export async function POST(request: Request) {
  try {
    const data: CreateStockMainGroupRequest = await request.json()

    // Validasyon
    if (!data.sanKod || !data.sanIsim) {
      return Response.json(
        { error: "Ana grup kodu ve adı gereklidir" },
        { status: 400 }
      )
    }

    // Benzersizlik kontrolü
    const checkQuery = `
      SELECT COUNT(*) as cnt FROM STOK_ANA_GRUPLARI
      WHERE san_kod = @kod
    `
    const check = await executeQuery(checkQuery, { kod: data.sanKod })

    if (check[0].cnt > 0) {
      return Response.json(
        { error: "Bu ana grup kodu zaten kullanılıyor" },
        { status: 409 }
      )
    }

    const insertQuery = `
      INSERT INTO STOK_ANA_GRUPLARI (
        san_DBCno, san_SpecRECno, san_iptal,
        san_fileid, san_hidden, san_kilitli, san_degisti,
        san_checksum, san_create_user, san_create_date,
        san_lastup_user, san_lastup_date,
        san_special1, san_special2, san_special3,
        san_kod, san_isim
      )
      VALUES (
        @dbcno, 0, 0, 1, 0, 0, 0, 0,
        @userId, GETDATE(), @userId, GETDATE(),
        @special1, @special2, @special3,
        @kod, @isim
      );
      SELECT SCOPE_IDENTITY() AS newId;
    `

    const result = await executeQuery(insertQuery, {
      dbcno: 1,
      userId: getCurrentUserId(),
      special1: data.sanSpecial1 || null,
      special2: data.sanSpecial2 || null,
      special3: data.sanSpecial3 || null,
      kod: data.sanKod,
      isim: data.sanIsim,
    })

    return Response.json(
      {
        message: "Ana grup başarıyla oluşturuldu",
        id: result[0].newId,
      },
      { status: 201 }
    )
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 4. Ana Grubu Güncelle

```typescript
// PATCH /api/stock-main-groups/:kod

export async function PATCH(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const data: UpdateStockMainGroupRequest = await request.json()

    const updateQuery = `
      UPDATE STOK_ANA_GRUPLARI
      SET
        san_isim = COALESCE(@isim, san_isim),
        san_special1 = COALESCE(@special1, san_special1),
        san_special2 = COALESCE(@special2, san_special2),
        san_special3 = COALESCE(@special3, san_special3),
        san_kilitli = COALESCE(@kilitli, san_kilitli),
        san_lastup_user = @userId,
        san_lastup_date = GETDATE(),
        san_degisti = 1
      WHERE san_kod = @kod
        AND san_iptal = 0
    `

    await executeQuery(updateQuery, {
      kod: params.kod,
      isim: data.sanIsim || null,
      special1: data.sanSpecial1 || null,
      special2: data.sanSpecial2 || null,
      special3: data.sanSpecial3 || null,
      kilitli: data.sanKilitli !== undefined ? (data.sanKilitli ? 1 : 0) : null,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Ana grup güncellendi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 5. Ana Grubu Sil (Soft Delete)

```typescript
// DELETE /api/stock-main-groups/:kod

export async function DELETE(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    // Önce bu ana gruba bağlı stoklar var mı kontrol et
    const checkStocksQuery = `
      SELECT COUNT(*) as cnt FROM STOKLAR
      WHERE sto_ana_grup_id = (
        SELECT san_Guid FROM STOK_ANA_GRUPLARI WHERE san_kod = @kod
      )
      AND sto_iptal = 0
    `

    const stockCheck = await executeQuery(checkStocksQuery, { kod: params.kod })

    if (stockCheck[0].cnt > 0) {
      return Response.json(
        {
          error: `Bu ana gruba bağlı ${stockCheck[0].cnt} adet stok var. Önce stokları başka gruplara taşıyın.`,
        },
        { status: 409 }
      )
    }

    const deleteQuery = `
      UPDATE STOK_ANA_GRUPLARI
      SET
        san_iptal = 1,
        san_lastup_user = @userId,
        san_lastup_date = GETDATE(),
        san_degisti = 1
      WHERE san_kod = @kod
    `

    await executeQuery(deleteQuery, {
      kod: params.kod,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Ana grup silindi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 6. Ana Grup İstatistikleri

```typescript
// GET /api/stock-main-groups/:kod/stats

export async function GET(
  request: Request,
  { params }: { params: { kod: string } }
) {
  try {
    const query = `
      SELECT 
        ag.san_Guid as sanGuid,
        ag.san_kod as sanKod,
        ag.san_isim as sanIsim,
        COUNT(DISTINCT s.sto_Guid) as stockCount,
        COUNT(DISTINCT alt.salt_Guid) as subGroupCount
      FROM STOK_ANA_GRUPLARI ag
      LEFT JOIN STOKLAR s ON s.sto_ana_grup_id = ag.san_Guid AND s.sto_iptal = 0
      LEFT JOIN STOK_ALT_GRUPLARI alt ON alt.salt_ana_grup_id = ag.san_Guid AND alt.salt_iptal = 0
      WHERE ag.san_kod = @kod
        AND ag.san_iptal = 0
      GROUP BY ag.san_Guid, ag.san_kod, ag.san_isim
    `

    const result = await executeQuery(query, { kod: params.kod })

    if (!result.length) {
      return Response.json({ error: "Ana grup bulunamadı" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### React Bileşen Örnekleri

#### Ana Grup Seçim Dropdown Bileşeni

```typescript
// components/stock-main-group-select.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StockMainGroup } from "@/types/StockMainGroup"

interface StockMainGroupSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function StockMainGroupSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Ana grup seçin...",
}: StockMainGroupSelectProps) {
  const [groups, setGroups] = useState<StockMainGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/stock-main-groups")
        if (!response.ok) throw new Error("Ana gruplar yüklenemedi")

        const data = await response.json()
        setGroups(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
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
        ) : groups.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">
            Ana grup bulunamadı
          </div>
        ) : (
          groups.map((group) => (
            <SelectItem key={group.sanGuid} value={group.sanKod}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.sanKod}</span>
                <span className="text-gray-600">-</span>
                <span>{group.sanIsim}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
```

#### Ana Grup Kartları Listesi

```typescript
// components/stock-main-groups-list.tsx

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
import { Badge } from "@/components/ui/badge"
import { StockMainGroupStats } from "@/types/StockMainGroup"

export function StockMainGroupsList() {
  const [groups, setGroups] = useState<StockMainGroupStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/stock-main-groups")
        const data = await response.json()

        // Her grup için istatistikleri getir
        const groupsWithStats = await Promise.all(
          data.map(async (group: any) => {
            const statsResponse = await fetch(
              `/api/stock-main-groups/${group.sanKod}/stats`
            )
            return await statsResponse.json()
          })
        )

        setGroups(groupsWithStats)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stok Ana Grupları</h2>
        <Button>Yeni Ana Grup Ekle</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grup Kodu</TableHead>
            <TableHead>Grup Adı</TableHead>
            <TableHead className="text-center">Stok Sayısı</TableHead>
            <TableHead className="text-center">Alt Grup Sayısı</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.sanGuid}>
              <TableCell className="font-medium">{group.sanKod}</TableCell>
              <TableCell>{group.sanIsim}</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{group.stockCount}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{group.subGroupCount}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    disabled={group.stockCount > 0}
                  >
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

#### Ana Grup Oluşturma Formu

```typescript
// components/create-stock-main-group-form.tsx

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateStockMainGroupRequest } from "@/types/StockMainGroup"

export function CreateStockMainGroupForm() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStockMainGroupRequest>()

  const onSubmit = async (data: CreateStockMainGroupRequest) => {
    setLoading(true)
    try {
      const response = await fetch("/api/stock-main-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      alert("Ana grup başarıyla oluşturuldu")
      reset()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="sanKod">Ana Grup Kodu *</Label>
        <Input
          id="sanKod"
          {...register("sanKod", { required: "Ana grup kodu gereklidir" })}
          placeholder="AG-001"
          maxLength={25}
        />
        {errors.sanKod && (
          <p className="text-sm text-red-500 mt-1">{errors.sanKod.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="sanIsim">Ana Grup Adı *</Label>
        <Input
          id="sanIsim"
          {...register("sanIsim", { required: "Ana grup adı gereklidir" })}
          placeholder="Hammadde"
          maxLength={40}
        />
        {errors.sanIsim && (
          <p className="text-sm text-red-500 mt-1">{errors.sanIsim.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sanSpecial1">Özel Alan 1</Label>
          <Input id="sanSpecial1" {...register("sanSpecial1")} maxLength={4} />
        </div>
        <div>
          <Label htmlFor="sanSpecial2">Özel Alan 2</Label>
          <Input id="sanSpecial2" {...register("sanSpecial2")} maxLength={4} />
        </div>
        <div>
          <Label htmlFor="sanSpecial3">Özel Alan 3</Label>
          <Input id="sanSpecial3" {...register("sanSpecial3")} maxLength={4} />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Oluşturuluyor..." : "Ana Grup Oluştur"}
      </Button>
    </form>
  )
}
```

---

## Önemli Notlar

### 🔑 IDENTITY Alanı Kullanımı

- **san_Guid** alanı `INTEGER IDENTITY` tipindedir
- Bu alan otomatik olarak artar, INSERT sırasında belirtilmez
- Yeni kaydın ID'sini almak için `SELECT SCOPE_IDENTITY()` kullanılır
- Diğer tablolardan farklı olarak GUID değil INTEGER kullanır

### 📌 Benzersizlik Kuralları

1. **san_Guid** - Otomatik artan benzersiz ID
2. **san_kod** - Ana grup kodunun benzersiz olması **zorunludur**
   - Veri tabanı seviyesinde `UNIQUE` kısıtlaması vardır
   - Yinelenen kodla ana grup oluşturmaya çalışmak başarısız olur

### 🗑️ Silme İşlemi - Cascade Kontrolü

- Ana grup silinmeden önce bağlı stoklar kontrol edilmelidir
- Eğer ana gruba bağlı aktif stoklar varsa silme işlemi engellenmelidir
- Soft delete (`san_iptal = 1`) kullanılır
- Silinen ana gruplar `WHERE san_iptal = 0` ile filtrelenir

### 🏗️ Hiyerarşik Yapı

Stok gruplandırma hiyerarşisi:

```
STOK_ANA_GRUPLARI (Ana Gruplar)
    └── STOK_ALT_GRUPLARI (Alt Gruplar)
            └── STOK_DETAY_GRUPLARI (Detay Gruplar)
                    └── STOKLAR (Stok Kartları)
```

**Örnek:**

- Ana Grup: "Hammadde"
  - Alt Grup: "Kimyasal Hammaddeler"
    - Detay Grup: "Polimerler"
      - Stok: "PVC Reçine K-67"

### 🔒 Kilitli Ana Gruplar

- `san_kilitli = 1` olan ana gruplar **salt okunur** olur
- Kilitli ana gruplar güncellenemez veya silinemez
- Sistem yöneticileri tarafından kritik ana grupları korumak için kullanılır

### 👁️ Gizli Ana Gruplar

- `san_hidden = 1` olan ana gruplar arayüzde **gösterilmez**
- Ancak veritabanında hala mevcuttur
- Geçici olarak devre dışı bırakmak için kullanılır

### 📊 Kategorizasyon Örnekleri

**Üretim Şirketi:**

- AG-001: Hammadde
- AG-002: Yarı Mamul
- AG-003: Mamul
- AG-004: Yardımcı Malzeme
- AG-005: Ambalaj Malzemeleri

**Ticaret Şirketi:**

- AG-001: Ticari Mal
- AG-002: Yedek Parça
- AG-003: Aksesuar
- AG-004: Tüketim Malzemeleri

**Hizmet Şirketi:**

- AG-001: Ofis Malzemeleri
- AG-002: IT Ekipmanları
- AG-003: Temizlik Malzemeleri

---

## İstatistik Sorguları

### Ana Grup Kullanım İstatistikleri

```sql
SELECT
    COUNT(*) AS toplam_ana_grup_sayisi,
    SUM(CASE WHEN san_iptal = 0 THEN 1 ELSE 0 END) AS aktif_ana_grup,
    SUM(CASE WHEN san_iptal = 1 THEN 1 ELSE 0 END) AS iptal_ana_grup,
    SUM(CASE WHEN san_hidden = 1 THEN 1 ELSE 0 END) AS gizli_ana_grup,
    SUM(CASE WHEN san_kilitli = 1 THEN 1 ELSE 0 END) AS kilitli_ana_grup
FROM STOK_ANA_GRUPLARI
```

### En Çok Stok İçeren Ana Gruplar

```sql
SELECT TOP 10
    ag.san_kod,
    ag.san_isim,
    COUNT(s.sto_Guid) AS stok_sayisi
FROM STOK_ANA_GRUPLARI ag
LEFT JOIN STOKLAR s ON s.sto_ana_grup_id = ag.san_Guid AND s.sto_iptal = 0
WHERE ag.san_iptal = 0
GROUP BY ag.san_kod, ag.san_isim
ORDER BY stok_sayisi DESC
```

### Boş Ana Gruplar (Stok İçermeyen)

```sql
SELECT
    ag.san_kod,
    ag.san_isim,
    ag.san_create_date
FROM STOK_ANA_GRUPLARI ag
WHERE ag.san_iptal = 0
    AND NOT EXISTS (
        SELECT 1 FROM STOKLAR s
        WHERE s.sto_ana_grup_id = ag.san_Guid
        AND s.sto_iptal = 0
    )
ORDER BY ag.san_create_date DESC
```

### Aylık Ana Grup Oluşturma Trendi

```sql
SELECT
    DATEPART(YEAR, san_create_date) AS yil,
    DATEPART(MONTH, san_create_date) AS ay,
    COUNT(*) AS olusturulan_ana_grup_sayisi
FROM STOK_ANA_GRUPLARI
WHERE san_iptal = 0
GROUP BY DATEPART(YEAR, san_create_date), DATEPART(MONTH, san_create_date)
ORDER BY yil DESC, ay DESC
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, STOK_ALT_GRUPLARI, STOK_DETAY_GRUPLARI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi
- 📖 **Diğer Stok Tabloları**: STOK_HAREKETLERI, STOK_URETICILERI, STOK_REYONLARI

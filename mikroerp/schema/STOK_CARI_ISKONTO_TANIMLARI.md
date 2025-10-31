# STOK_CARI_ISKONTO_TANIMLARI Tablosu - İskonto Kartları

## Tablo Özeti

**Tablo Adı:** `STOK_CARI_ISKONTO_TANIMLARI`  
**Türkçe Adı:** İskonto Kartları  
**Amaç:** Stok-Cari bazında özel iskonto ve masraf tanımlarını tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Belirli bir stok için belirli bir cariye özel fiyatlandırma, iskonto ve masraf tanımları yapılır.

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `isk_Guid`, `isk_DBCno`, `isk_iptal`, `isk_hidden`, `isk_kilitli`, `isk_create_user`, `isk_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan                       | Tip          | Açıklama      | FK             |
| -------------------------- | ------------ | ------------- | -------------- |
| `isk_stok_kod`             | Nvarchar(4)  | **Stok Kodu** | STOKLAR        |
| `isk_cari_kod`             | Nvarchar(4)  | **Cari Kodu** | CARI_HESAPLAR  |
| `isk_isim`                 | Nvarchar(50) | İskonto Adı   | -              |
| `isk_uygulama_odeme_plani` | Integer      | Ödeme Planı   | ODEME_PLANLARI |

### 🎁 Bedelsiz Ürün

| Alan                           | Tip   | Açıklama                  |
| ------------------------------ | ----- | ------------------------- |
| `isk_bedelsiz_referans_miktar` | Float | Bedelsiz Referans Miktarı |

### 💰 İskonto Tanımları (6 Adet)

Her iskonto için 3 alan: Açıklama, Uygulama Tipi, Yüzde/Tutar

**İskonto 1-6:**

- `isk_isk1_aciklama` - `isk_isk6_aciklama` (Nvarchar(20))
- `isk_isk1_uygulama` - `isk_isk6_uygulama` (Tinyint)
- `isk_isk1_yuzde` - `isk_isk6_yuzde` (Float)

### 📊 Masraf Tanımları (4 Adet)

**Masraf 1-4:**

- `isk_mas1_aciklama` - `isk_mas4_aciklama` (Nvarchar(20))
- `isk_mas1_uygulama` - `isk_mas4_uygulama` (Tinyint)
- `isk_mas1_yuzde` - `isk_mas4_yuzde` (Float)

---

## İndeksler

| İndeks                               | Özellik     | Alanlar                                                    | Açıklama                        |
| ------------------------------------ | ----------- | ---------------------------------------------------------- | ------------------------------- |
| `NDX_STOK_CARI_ISKONTO_TANIMLARI_00` | PRIMARY KEY | `isk_Guid`                                                 | Benzersiz tanımlayıcı           |
| `NDX_STOK_CARI_ISKONTO_TANIMLARI_02` | UNIQUE      | `isk_stok_kod`, `isk_cari_kod`, `isk_uygulama_odeme_plani` | Stok+Cari+Ödeme Planı benzersiz |

---

## Enum Tanımları

### İskonto/Masraf Uygulama Tipi

```typescript
export enum IskontoUygulamaTipi {
  // Temel İskontolar
  BrutToplamYuzde = 0, // Brüt toplamdan yüzde
  AraToplamYuzde = 1, // Ara toplamdan yüzde
  TutarIskonto = 2, // Tutar İskonto masraf

  // Miktar Bazlı
  MiktarBasinaTutar = 3, // Miktar başına tutar
  Miktar2BasinaTutar = 4, // Miktar2 başına tutar
  Miktar3BasinaTutar = 5, // Miktar3 başına tutar

  // Bedelsiz
  BedelsizMiktar = 6, // Bedelsiz miktar

  // İskonto 1-6 Yüzdeleri
  Iskonto1Yuzde = 7, // Iskonto1 yüzde
  Iskonto1AratopYuzde = 8, // Iskonto1 aratop yüzde
  Iskonto2Yuzde = 9, // Iskonto2 yüzde
  Iskonto2AratopYuzde = 10, // Iskonto2 aratop yüzde
  Iskonto3Yuzde = 11, // Iskonto3 yüzde
  Iskonto3AratopYuzde = 12, // Iskonto3 aratop yüzde
  Iskonto4Yuzde = 13, // Iskonto4 yüzde
  Iskonto4AratopYuzde = 14, // Iskonto4 aratop yüzde
  Iskonto5Yuzde = 15, // Iskonto5 yüzde
  Iskonto5AratopYuzde = 16, // Iskonto5 aratop yüzde
  Iskonto6Yuzde = 17, // Iskonto6 yüzde
  Iskonto6AratopYuzde = 18, // Iskonto6 aratop yüzde

  // Masraf 1-3 Yüzdeleri
  Masraf1Yuzde = 19, // Masraf1 yüzde
  Masraf1AratopYuzde = 20, // Masraf1 aratop yüzde
  Masraf2Yuzde = 21, // Masraf2 yüzde
  Masraf2AratopYuzde = 22, // Masraf2 aratop yüzde
  Masraf3Yuzde = 23, // Masraf3 yüzde
  Masraf3AratopYuzde = 24, // Masraf3 aratop yüzde
}
```

---

## SQL Sorgu Örnekleri

### 1. Cari için Stok İskontolarını Listele

```sql
SELECT
    i.isk_stok_kod,
    s.sto_isim,
    i.isk_isim,
    i.isk_isk1_aciklama,
    i.isk_isk1_yuzde,
    i.isk_isk2_aciklama,
    i.isk_isk2_yuzde,
    i.isk_bedelsiz_referans_miktar
FROM STOK_CARI_ISKONTO_TANIMLARI i
INNER JOIN STOKLAR s ON i.isk_stok_kod = s.sto_kod
WHERE i.isk_cari_kod = 'CARI-001'
    AND i.isk_iptal = 0
ORDER BY s.sto_isim
```

### 2. Stok için Tüm Cari İskontolarını Getir

```sql
SELECT
    i.isk_cari_kod,
    c.cari_unvan1,
    i.isk_isim,
    i.isk_isk1_aciklama,
    i.isk_isk1_uygulama,
    i.isk_isk1_yuzde,
    op.odp_adi AS odeme_plani_adi
FROM STOK_CARI_ISKONTO_TANIMLARI i
INNER JOIN CARI_HESAPLAR c ON i.isk_cari_kod = c.cari_kod
LEFT JOIN ODEME_PLANLARI op ON i.isk_uygulama_odeme_plani = op.odp_no
WHERE i.isk_stok_kod = 'STOK-001'
    AND i.isk_iptal = 0
```

### 3. Belirli Stok-Cari İçin İskonto Detayları

```sql
SELECT
    i.isk_isim,
    i.isk_bedelsiz_referans_miktar,
    -- İskonto 1
    i.isk_isk1_aciklama,
    i.isk_isk1_uygulama,
    i.isk_isk1_yuzde,
    -- İskonto 2
    i.isk_isk2_aciklama,
    i.isk_isk2_uygulama,
    i.isk_isk2_yuzde,
    -- Masraf 1
    i.isk_mas1_aciklama,
    i.isk_mas1_uygulama,
    i.isk_mas1_yuzde
FROM STOK_CARI_ISKONTO_TANIMLARI i
WHERE i.isk_stok_kod = 'STOK-001'
    AND i.isk_cari_kod = 'CARI-001'
    AND i.isk_uygulama_odeme_plani = 1
    AND i.isk_iptal = 0
```

### 4. Yeni İskonto Kartı Ekle

```sql
INSERT INTO STOK_CARI_ISKONTO_TANIMLARI (
    isk_Guid, isk_DBCno, isk_iptal, isk_fileid,
    isk_create_user, isk_create_date,
    isk_stok_kod, isk_cari_kod,
    isk_isim, isk_uygulama_odeme_plani,
    isk_isk1_aciklama, isk_isk1_uygulama, isk_isk1_yuzde,
    isk_isk2_aciklama, isk_isk2_uygulama, isk_isk2_yuzde,
    isk_bedelsiz_referans_miktar
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'STOK-001', 'CARI-001',
    'VIP Müşteri İndirimi', 1,
    'Kampanya İnd.', 0, 10.0,      -- %10 brüt toplamdan
    'Erken Ödeme', 1, 5.0,         -- %5 ara toplamdan
    100.0                           -- 100 birim alımda bedelsiz
)
```

### 5. Tüm İskonto ve Masrafları Göster

```sql
SELECT
    i.isk_stok_kod,
    i.isk_cari_kod,
    -- İskontolar
    CASE WHEN i.isk_isk1_yuzde IS NOT NULL
        THEN i.isk_isk1_aciklama + ': %' + CAST(i.isk_isk1_yuzde AS NVARCHAR)
        ELSE NULL END AS iskonto1,
    CASE WHEN i.isk_isk2_yuzde IS NOT NULL
        THEN i.isk_isk2_aciklama + ': %' + CAST(i.isk_isk2_yuzde AS NVARCHAR)
        ELSE NULL END AS iskonto2,
    -- Masraflar
    CASE WHEN i.isk_mas1_yuzde IS NOT NULL
        THEN i.isk_mas1_aciklama + ': %' + CAST(i.isk_mas1_yuzde AS NVARCHAR)
        ELSE NULL END AS masraf1
FROM STOK_CARI_ISKONTO_TANIMLARI i
WHERE i.isk_iptal = 0
```

### 6. Bedelsiz Ürün Veren İskontolar

```sql
SELECT
    i.isk_stok_kod,
    s.sto_isim,
    i.isk_cari_kod,
    c.cari_unvan1,
    i.isk_bedelsiz_referans_miktar,
    i.isk_isim
FROM STOK_CARI_ISKONTO_TANIMLARI i
INNER JOIN STOKLAR s ON i.isk_stok_kod = s.sto_kod
INNER JOIN CARI_HESAPLAR c ON i.isk_cari_kod = c.cari_kod
WHERE i.isk_bedelsiz_referans_miktar > 0
    AND i.isk_iptal = 0
ORDER BY i.isk_bedelsiz_referans_miktar DESC
```

---

## TypeScript Arayüzü

```typescript
export interface IskontoKarti {
  // Sistem
  iskGuid: string
  iskStokKod: string
  iskCariKod: string
  iskIsim: string
  iskUygulamaOdemePlani: number

  // Bedelsiz
  iskBedelsizReferansMiktar?: number

  // İskonto 1-6
  iskIsk1Aciklama?: string
  iskIsk1Uygulama?: IskontoUygulamaTipi
  iskIsk1Yuzde?: number

  iskIsk2Aciklama?: string
  iskIsk2Uygulama?: IskontoUygulamaTipi
  iskIsk2Yuzde?: number

  iskIsk3Aciklama?: string
  iskIsk3Uygulama?: IskontoUygulamaTipi
  iskIsk3Yuzde?: number

  iskIsk4Aciklama?: string
  iskIsk4Uygulama?: IskontoUygulamaTipi
  iskIsk4Yuzde?: number

  iskIsk5Aciklama?: string
  iskIsk5Uygulama?: IskontoUygulamaTipi
  iskIsk5Yuzde?: number

  iskIsk6Aciklama?: string
  iskIsk6Uygulama?: IskontoUygulamaTipi
  iskIsk6Yuzde?: number

  // Masraf 1-4
  iskMas1Aciklama?: string
  iskMas1Uygulama?: IskontoUygulamaTipi
  iskMas1Yuzde?: number

  iskMas2Aciklama?: string
  iskMas2Uygulama?: IskontoUygulamaTipi
  iskMas2Yuzde?: number

  iskMas3Aciklama?: string
  iskMas3Uygulama?: IskontoUygulamaTipi
  iskMas3Yuzde?: number

  iskMas4Aciklama?: string
  iskMas4Uygulama?: IskontoUygulamaTipi
  iskMas4Yuzde?: number

  // Durum
  iskIptal: boolean
}

export interface IskontoDetay {
  aciklama: string
  uygulama: IskontoUygulamaTipi
  yuzde: number
}

export interface IskontoWithDetails extends IskontoKarti {
  stokIsim: string
  cariUnvan: string
  odemePlaniAdi?: string
  iskontolar: IskontoDetay[]
  masraflar: IskontoDetay[]
}

export interface CreateIskontoRequest {
  iskStokKod: string
  iskCariKod: string
  iskIsim: string
  iskUygulamaOdemePlani?: number
  iskBedelsizReferansMiktar?: number
  iskontolar?: IskontoDetay[]
  masraflar?: IskontoDetay[]
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/cari-hesaplar/:cariKod/iskontolar
export async function GET(
  req: Request,
  { params }: { params: { cariKod: string } }
) {
  const { searchParams } = new URL(req.url)
  const stokKod = searchParams.get("stokKod")

  let query = `
    SELECT 
      i.isk_Guid as iskGuid,
      i.isk_stok_kod as iskStokKod,
      i.isk_cari_kod as iskCariKod,
      i.isk_isim as iskIsim,
      i.isk_bedelsiz_referans_miktar as iskBedelsizReferansMiktar,
      i.isk_isk1_aciklama as iskIsk1Aciklama,
      i.isk_isk1_uygulama as iskIsk1Uygulama,
      i.isk_isk1_yuzde as iskIsk1Yuzde,
      i.isk_isk2_aciklama as iskIsk2Aciklama,
      i.isk_isk2_uygulama as iskIsk2Uygulama,
      i.isk_isk2_yuzde as iskIsk2Yuzde,
      s.sto_isim as stokIsim
    FROM STOK_CARI_ISKONTO_TANIMLARI i
    INNER JOIN STOKLAR s ON i.isk_stok_kod = s.sto_kod
    WHERE i.isk_cari_kod = @cariKod
      AND i.isk_iptal = 0
  `

  const params: any = { cariKod: params.cariKod }

  if (stokKod) {
    query += " AND i.isk_stok_kod = @stokKod"
    params.stokKod = stokKod
  }

  query += " ORDER BY s.sto_isim"

  const result = await executeQuery(query, params)
  return Response.json(result)
}

// POST /api/iskonto-kartlari
export async function POST(req: Request) {
  const data: CreateIskontoRequest = await req.json()

  // Benzersizlik kontrolü
  const checkQuery = `
    SELECT COUNT(*) as count
    FROM STOK_CARI_ISKONTO_TANIMLARI
    WHERE isk_stok_kod = @stokKod
      AND isk_cari_kod = @cariKod
      AND isk_uygulama_odeme_plani = @odemePlani
      AND isk_iptal = 0
  `

  const checkResult = await executeQuery(checkQuery, {
    stokKod: data.iskStokKod,
    cariKod: data.iskCariKod,
    odemePlani: data.iskUygulamaOdemePlani ?? 0,
  })

  if (checkResult[0].count > 0) {
    return Response.json(
      { error: "Bu stok-cari-ödeme planı kombinasyonu zaten mevcut" },
      { status: 400 }
    )
  }

  const insertQuery = `
    INSERT INTO STOK_CARI_ISKONTO_TANIMLARI (
      isk_Guid, isk_DBCno, isk_iptal, isk_fileid,
      isk_create_user, isk_create_date,
      isk_stok_kod, isk_cari_kod,
      isk_isim, isk_uygulama_odeme_plani,
      isk_bedelsiz_referans_miktar,
      isk_isk1_aciklama, isk_isk1_uygulama, isk_isk1_yuzde,
      isk_isk2_aciklama, isk_isk2_uygulama, isk_isk2_yuzde
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @stokKod, @cariKod,
      @isim, @odemePlani,
      @bedelsizMiktar,
      @isk1Aciklama, @isk1Uygulama, @isk1Yuzde,
      @isk2Aciklama, @isk2Uygulama, @isk2Yuzde
    )
  `

  const iskonto1 = data.iskontolar?.[0]
  const iskonto2 = data.iskontolar?.[1]

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    stokKod: data.iskStokKod,
    cariKod: data.iskCariKod,
    isim: data.iskIsim,
    odemePlani: data.iskUygulamaOdemePlani ?? 0,
    bedelsizMiktar: data.iskBedelsizReferansMiktar,
    isk1Aciklama: iskonto1?.aciklama,
    isk1Uygulama: iskonto1?.uygulama,
    isk1Yuzde: iskonto1?.yuzde,
    isk2Aciklama: iskonto2?.aciklama,
    isk2Uygulama: iskonto2?.uygulama,
    isk2Yuzde: iskonto2?.yuzde,
  })

  return Response.json(
    { message: "İskonto kartı başarıyla oluşturuldu" },
    { status: 201 }
  )
}

// GET /api/iskonto-kartlari/calculate
// Fiyat hesaplama endpoint'i
export async function POST(req: Request) {
  const { stokKod, cariKod, miktar, birimFiyat } = await req.json()

  const query = `
    SELECT *
    FROM STOK_CARI_ISKONTO_TANIMLARI
    WHERE isk_stok_kod = @stokKod
      AND isk_cari_kod = @cariKod
      AND isk_iptal = 0
  `

  const iskonto = await executeQuery(query, { stokKod, cariKod })

  if (iskonto.length === 0) {
    return Response.json({
      brutTutar: miktar * birimFiyat,
      netTutar: miktar * birimFiyat,
      iskontolar: [],
    })
  }

  const isk = iskonto[0]
  let brutTutar = miktar * birimFiyat
  let netTutar = brutTutar
  const hesaplananIskontolar = []

  // İskonto 1 hesapla
  if (isk.isk_isk1_yuzde && isk.isk_isk1_uygulama === 0) {
    const iskontoTutar = brutTutar * (isk.isk_isk1_yuzde / 100)
    netTutar -= iskontoTutar
    hesaplananIskontolar.push({
      aciklama: isk.isk_isk1_aciklama,
      yuzde: isk.isk_isk1_yuzde,
      tutar: iskontoTutar,
    })
  }

  // İskonto 2 hesapla (ara toplamdan)
  if (isk.isk_isk2_yuzde && isk.isk_isk2_uygulama === 1) {
    const iskontoTutar = netTutar * (isk.isk_isk2_yuzde / 100)
    netTutar -= iskontoTutar
    hesaplananIskontolar.push({
      aciklama: isk.isk_isk2_aciklama,
      yuzde: isk.isk_isk2_yuzde,
      tutar: iskontoTutar,
    })
  }

  return Response.json({
    brutTutar,
    netTutar,
    toplamIskonto: brutTutar - netTutar,
    iskontolar: hesaplananIskontolar,
    bedelsizMiktar: isk.isk_bedelsiz_referans_miktar,
  })
}
```

---

## React Bileşen Örneği

```typescript
// components/iskonto-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface IskontoFormProps {
  stokKod: string
  cariKod: string
  onSuccess?: () => void
}

export function IskontoForm({ stokKod, cariKod, onSuccess }: IskontoFormProps) {
  const [formData, setFormData] = useState({
    iskIsim: "",
    iskBedelsizReferansMiktar: 0,
    isk1Aciklama: "",
    isk1Uygulama: 0,
    isk1Yuzde: 0,
    isk2Aciklama: "",
    isk2Uygulama: 1,
    isk2Yuzde: 0,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/iskonto-kartlari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iskStokKod: stokKod,
          iskCariKod: cariKod,
          iskIsim: formData.iskIsim,
          iskBedelsizReferansMiktar: formData.iskBedelsizReferansMiktar || null,
          iskontolar: [
            formData.isk1Yuzde > 0
              ? {
                  aciklama: formData.isk1Aciklama,
                  uygulama: formData.isk1Uygulama,
                  yuzde: formData.isk1Yuzde,
                }
              : null,
            formData.isk2Yuzde > 0
              ? {
                  aciklama: formData.isk2Aciklama,
                  uygulama: formData.isk2Uygulama,
                  yuzde: formData.isk2Yuzde,
                }
              : null,
          ].filter(Boolean),
        }),
      })

      if (response.ok) {
        alert("İskonto kartı oluşturuldu")
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(error.error || "Bir hata oluştu")
      }
    } catch (error) {
      console.error("İskonto oluşturma hatası:", error)
      alert("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>İskonto Adı</Label>
        <Input
          value={formData.iskIsim}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, iskIsim: e.target.value }))
          }
          placeholder="VIP Müşteri İndirimi"
          required
        />
      </div>

      <div>
        <Label>Bedelsiz Referans Miktarı</Label>
        <Input
          type="number"
          value={formData.iskBedelsizReferansMiktar}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              iskBedelsizReferansMiktar: parseFloat(e.target.value) || 0,
            }))
          }
          placeholder="100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Bu miktarda alımda bedelsiz ürün verilir
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">İskonto 1</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Açıklama</Label>
            <Input
              value={formData.isk1Aciklama}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isk1Aciklama: e.target.value,
                }))
              }
              placeholder="Kampanya"
            />
          </div>
          <div>
            <Label>Tip</Label>
            <Select
              value={formData.isk1Uygulama.toString()}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  isk1Uygulama: parseInt(val),
                }))
              }
            >
              <option value="0">Brüt Toplamdan %</option>
              <option value="1">Ara Toplamdan %</option>
              <option value="2">Tutar İskonto</option>
            </Select>
          </div>
          <div>
            <Label>Yüzde/Tutar</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.isk1Yuzde}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isk1Yuzde: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="10.00"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">İskonto 2</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Açıklama</Label>
            <Input
              value={formData.isk2Aciklama}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isk2Aciklama: e.target.value,
                }))
              }
              placeholder="Erken Ödeme"
            />
          </div>
          <div>
            <Label>Tip</Label>
            <Select
              value={formData.isk2Uygulama.toString()}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  isk2Uygulama: parseInt(val),
                }))
              }
            >
              <option value="0">Brüt Toplamdan %</option>
              <option value="1">Ara Toplamdan %</option>
              <option value="2">Tutar İskonto</option>
            </Select>
          </div>
          <div>
            <Label>Yüzde/Tutar</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.isk2Yuzde}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isk2Yuzde: parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="5.00"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Kaydediliyor..." : "İskonto Kartı Oluştur"}
      </Button>
    </form>
  )
}
```

---

## Önemli Notlar

### 🔑 Composite Unique Key

- `isk_stok_kod + isk_cari_kod + isk_uygulama_odeme_plani` benzersiz
- Aynı stok-cari için farklı ödeme planlarına farklı iskontolar tanımlanabilir

### 💰 İskonto Hesaplama Sırası

1. **Brüt Toplamdan**: İlk iskonto brüt tutardan hesaplanır
2. **Ara Toplamdan**: Sonraki iskontolar kalan tutardan hesaplanır
3. **Kademeli İskonto**: 6 farklı iskonto kademesi tanımlanabilir

### 📊 Uygulama Tipleri

- **Yüzde İskontolar (0-1)**: En yaygın kullanım
- **Tutar İskonto (2)**: Sabit tutar indirimi
- **Miktar Bazlı (3-5)**: Toplu alımlarda birim başı indirim
- **Bedelsiz (6)**: X al Y öde kampanyaları

### 🎁 Bedelsiz Ürün Sistemi

- `isk_bedelsiz_referans_miktar`: Referans miktar
- Örnek: 100 birim alımda 10 bedelsiz → Referans: 100
- Kampanya ve promosyon yönetimi için kullanılır

### 🔗 Ödeme Planı Entegrasyonu

- `isk_uygulama_odeme_plani`: ODEME_PLANLARI tablosuna FK
- Peşin, vadeli, taksitli ödemeler için farklı iskontolar
- 0 = Tüm ödeme planları için geçerli

### 📈 Masraf Ekleme

- İskonto dışında 4 farklı masraf kalemi eklenebilir
- Nakliye, ambalaj, sigorta vb. masraflar
- Aynı uygulama tipleri iskontolarla aynı

### ⚠️ Alan Boyutu Uyarısı

- `isk_stok_kod` ve `isk_cari_kod` Nvarchar(4) olarak tanımlanmış
- Gerçek kullanımda daha büyük olabilir (muhtemelen Nvarchar(25))
- Schema inconsistency - kontrol edilmeli

---

## Kullanım Senaryoları

### 1. VIP Müşteri İndirimi

```sql
-- %15 genel indirim + %5 erken ödeme
isk_isk1_aciklama = 'VIP İndirim'
isk_isk1_uygulama = 0  -- Brüt toplamdan
isk_isk1_yuzde = 15.0

isk_isk2_aciklama = 'Erken Ödeme'
isk_isk2_uygulama = 1  -- Ara toplamdan
isk_isk2_yuzde = 5.0
```

### 2. Kampanya (Al 10 - 1 Bedelsiz)

```sql
isk_bedelsiz_referans_miktar = 10.0
```

### 3. Toplu Alım İndirimi

```sql
isk_isk1_aciklama = 'Toplu Alım'
isk_isk1_uygulama = 3  -- Miktar başına tutar
isk_isk1_yuzde = 2.5   -- Her birim için 2.5 TL indirim
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, CARI_HESAPLAR, ODEME_PLANLARI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

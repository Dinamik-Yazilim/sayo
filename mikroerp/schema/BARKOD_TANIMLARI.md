# BARKOD_TANIMLARI Tablosu - Barkod Kartları

## Tablo Özeti

**Tablo Adı:** `BARKOD_TANIMLARI`  
**Türkçe Adı:** Barkod Kartları  
**Amaç:** Stok kartlarına ait barkod tanımlarını tutar (EAN, UPC, Code39 vb.)  
**Veri Tabanı:** Mikro ERP V16/V17

Her stok için birden fazla barkod tanımlanabilir (ana barkod, farklı birimler, beden/renk kombinasyonları).

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `bar_Guid`, `bar_DBCno`, `bar_iptal`, `bar_hidden`, `bar_kilitli`, `bar_create_user`, `bar_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan           | Tip          | Açıklama                 | Örnek           |
| -------------- | ------------ | ------------------------ | --------------- |
| `bar_kodu`     | barkod_str   | **Barkod Kodu (UNIQUE)** | `8690123456789` |
| `bar_stokkodu` | Nvarchar(25) | **Stok Kodu (FK)**       | `STOK-001`      |
| `bar_master`   | Bit          | Ana Barkod mı?           | 0:Hayır, 1:Evet |

### 📦 Ürün Detayları

| Alan                      | Tip          | Açıklama           |
| ------------------------- | ------------ | ------------------ |
| `bar_partikodu`           | Nvarchar(25) | Parti Kodu         |
| `bar_lotno`               | Integer      | Lot Numarası       |
| `bar_serino_veya_bagkodu` | Nvarchar(25) | Seri No / Bağ Kodu |

### 📊 Barkod Tipi ve İçerik

**bar_barkodtipi** (Tinyint):

- 0: EAN-13
- 1: EAN-8
- 2: ASCII
- 3: UPC-A
- 4: UPC-E
- 5: Code39

**bar_icerigi** (Tinyint):

- 0: Kod
- 1: Kod + Miktar
- 2: Kod + Birim Fiyat
- 3: Kod + Tutar

### 🎨 Varyasyon Bilgileri

| Alan            | Tip     | Açıklama            | FK                   |
| --------------- | ------- | ------------------- | -------------------- |
| `bar_birimpntr` | Tinyint | Birim pointer (1-4) | STOKLAR.sto_birimX   |
| `bar_bedenpntr` | Tinyint | Beden pointer       | STOK_BEDEN_TANIMLARI |
| `bar_renkpntr`  | Tinyint | Renk pointer        | STOK_RENK_TANIMLARI  |

### 🔗 Bağlantı Tipi

**bar_baglantitipi** (Tinyint):

- 0: Stok Barkodu
- 1: Paket Barkodu
- 2: Asorti Barkodu
- 3: Stok Detay Barkodu
- 4: Hediye Çeki Barkodu
- 5: Hediye Kartı Barkodu
- 6: Sabit Kıymet Barkodu

### 🎁 İlişkili Alanlar

| Alan                  | Tip              | Açıklama          |
| --------------------- | ---------------- | ----------------- |
| `bar_har_uid`         | Uniqueidentifier | Hareket UID       |
| `bar_asortitanimkodu` | Nvarchar(25)     | Asorti Tanım Kodu |

---

## İndeksler

| İndeks                    | Özellik     | Alanlar        | Açıklama                      |
| ------------------------- | ----------- | -------------- | ----------------------------- |
| `NDX_BARKOD_TANIMLARI_00` | PRIMARY KEY | `bar_Guid`     | Benzersiz tanımlayıcı         |
| `NDX_BARKOD_TANIMLARI_02` | UNIQUE      | `bar_kodu`     | Barkod kodu benzersiz         |
| `NDX_BARKOD_TANIMLARI_03` | INDEX       | `bar_stokkodu` | Stok koduna göre hızlı erişim |

---

## Enum Tanımları

```typescript
export enum BarkodTipi {
  EAN13 = 0,
  EAN8 = 1,
  ASCII = 2,
  UPCA = 3,
  UPCE = 4,
  Code39 = 5,
}

export enum BarkodIcerigi {
  Kod = 0,
  KodMiktar = 1,
  KodBirimFiyat = 2,
  KodTutar = 3,
}

export enum BarkodBaglantiTipi {
  StokBarkodu = 0,
  PaketBarkodu = 1,
  AsortiBarkodu = 2,
  StokDetayBarkodu = 3,
  HediyeCekiBarkodu = 4,
  HediyeKartiBarkodu = 5,
  SabitKiymetBarkodu = 6,
}
```

---

## SQL Sorgu Örnekleri

### 1. Stokun Tüm Barkodlarını Listele

```sql
SELECT
    bar_kodu,
    bar_stokkodu,
    bar_barkodtipi,
    bar_icerigi,
    bar_birimpntr,
    bar_master,
    bar_baglantitipi
FROM BARKOD_TANIMLARI
WHERE bar_stokkodu = 'STOK-001'
    AND bar_iptal = 0
ORDER BY bar_master DESC, bar_kodu
```

### 2. Barkod ile Stok Bilgilerini Getir

```sql
SELECT
    b.bar_kodu,
    b.bar_barkodtipi,
    s.sto_kod,
    s.sto_isim,
    s.sto_birim1_ad,
    s.sto_birim2_ad,
    b.bar_birimpntr
FROM BARKOD_TANIMLARI b
INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
WHERE b.bar_kodu = '8690123456789'
    AND b.bar_iptal = 0
```

### 3. Ana Barkodları Listele

```sql
SELECT
    b.bar_kodu,
    b.bar_stokkodu,
    s.sto_isim,
    b.bar_barkodtipi,
    CASE b.bar_barkodtipi
        WHEN 0 THEN 'EAN-13'
        WHEN 1 THEN 'EAN-8'
        WHEN 2 THEN 'ASCII'
        WHEN 3 THEN 'UPC-A'
        WHEN 4 THEN 'UPC-E'
        WHEN 5 THEN 'Code39'
    END AS barkod_tipi_adi
FROM BARKOD_TANIMLARI b
INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
WHERE b.bar_master = 1
    AND b.bar_iptal = 0
```

### 4. Beden/Renk Varyasyonlu Barkodlar

```sql
SELECT
    b.bar_kodu,
    s.sto_isim,
    bd.bed_adi AS beden,
    rk.ren_adi AS renk,
    b.bar_birimpntr
FROM BARKOD_TANIMLARI b
INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
LEFT JOIN STOK_BEDEN_TANIMLARI bd ON b.bar_bedenpntr = bd.bed_no
LEFT JOIN STOK_RENK_TANIMLARI rk ON b.bar_renkpntr = rk.ren_no
WHERE b.bar_stokkodu = 'STOK-001'
    AND b.bar_iptal = 0
```

### 5. Yeni Barkod Ekle

```sql
INSERT INTO BARKOD_TANIMLARI (
    bar_Guid, bar_DBCno, bar_iptal, bar_fileid,
    bar_create_user, bar_create_date,
    bar_kodu, bar_stokkodu,
    bar_barkodtipi, bar_icerigi,
    bar_birimpntr, bar_master,
    bar_baglantitipi
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    '8690123456789', 'STOK-001',
    0, 0,  -- EAN-13, Sadece Kod
    1, 1,  -- Birim1, Ana Barkod
    0      -- Stok Barkodu
)
```

### 6. Farklı Birimler İçin Barkodlar

```sql
SELECT
    b.bar_kodu,
    s.sto_isim,
    CASE b.bar_birimpntr
        WHEN 1 THEN s.sto_birim1_ad
        WHEN 2 THEN s.sto_birim2_ad
        WHEN 3 THEN s.sto_birim3_ad
        WHEN 4 THEN s.sto_birim4_ad
    END AS birim_adi,
    CASE b.bar_birimpntr
        WHEN 1 THEN 1
        WHEN 2 THEN s.sto_birim2_katsayi
        WHEN 3 THEN s.sto_birim3_katsayi
        WHEN 4 THEN s.sto_birim4_katsayi
    END AS birim_katsayi
FROM BARKOD_TANIMLARI b
INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
WHERE b.bar_stokkodu = 'STOK-001'
    AND b.bar_iptal = 0
ORDER BY b.bar_birimpntr
```

---

## TypeScript Arayüzü

```typescript
export interface BarkodTanim {
  // Sistem
  barGuid: string
  barKodu: string // UNIQUE
  barStokkodu: string

  // Ürün Detay
  barPartikodu?: string
  barLotno?: number
  barSerinoVeyaBagkodu?: string

  // Barkod Özellikleri
  barBarkodtipi: BarkodTipi
  barIcerigi: BarkodIcerigi
  barBirimpntr: number // 1-4 (STOKLAR.sto_birimX)
  barMaster: boolean // Ana barkod mı?

  // Varyasyon
  barBedenpntr?: number
  barRenkpntr?: number

  // Bağlantı
  barBaglantitipi: BarkodBaglantiTipi
  barHarUid?: string
  barAsortitanimkodu?: string

  // Durum
  barIptal: boolean
}

export interface BarkodWithStok extends BarkodTanim {
  stokIsim: string
  stokBirimAd: string
  bedenAdi?: string
  renkAdi?: string
}

export interface CreateBarkodRequest {
  barKodu: string
  barStokkodu: string
  barBarkodtipi: BarkodTipi
  barIcerigi?: BarkodIcerigi
  barBirimpntr: number
  barMaster: boolean
  barBaglantitipi?: BarkodBaglantiTipi
  barBedenpntr?: number
  barRenkpntr?: number
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/stoklar/:stokKod/barkodlar
export async function GET(
  req: Request,
  { params }: { params: { stokKod: string } }
) {
  const query = `
    SELECT 
      b.bar_Guid as barGuid,
      b.bar_kodu as barKodu,
      b.bar_stokkodu as barStokkodu,
      b.bar_barkodtipi as barBarkodtipi,
      b.bar_icerigi as barIcerigi,
      b.bar_birimpntr as barBirimpntr,
      b.bar_master as barMaster,
      b.bar_baglantitipi as barBaglantitipi,
      s.sto_isim as stokIsim,
      CASE b.bar_birimpntr
        WHEN 1 THEN s.sto_birim1_ad
        WHEN 2 THEN s.sto_birim2_ad
        WHEN 3 THEN s.sto_birim3_ad
        WHEN 4 THEN s.sto_birim4_ad
      END as stokBirimAd
    FROM BARKOD_TANIMLARI b
    INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
    WHERE b.bar_stokkodu = @stokKod
      AND b.bar_iptal = 0
    ORDER BY b.bar_master DESC, b.bar_kodu
  `

  const result = await executeQuery(query, { stokKod: params.stokKod })
  return Response.json(result)
}

// GET /api/barkodlar/:barkod
export async function GET(
  req: Request,
  { params }: { params: { barkod: string } }
) {
  const query = `
    SELECT 
      b.*,
      s.sto_isim,
      s.sto_birim1_ad,
      s.sto_birim2_ad,
      s.sto_birim3_ad,
      s.sto_birim4_ad,
      bd.bed_adi,
      rk.ren_adi
    FROM BARKOD_TANIMLARI b
    INNER JOIN STOKLAR s ON b.bar_stokkodu = s.sto_kod
    LEFT JOIN STOK_BEDEN_TANIMLARI bd ON b.bar_bedenpntr = bd.bed_no
    LEFT JOIN STOK_RENK_TANIMLARI rk ON b.bar_renkpntr = rk.ren_no
    WHERE b.bar_kodu = @barkod
      AND b.bar_iptal = 0
  `

  const result = await executeQuery(query, { barkod: params.barkod })

  if (result.length === 0) {
    return Response.json({ error: "Barkod bulunamadı" }, { status: 404 })
  }

  return Response.json(result[0])
}

// POST /api/stoklar/:stokKod/barkodlar
export async function POST(
  req: Request,
  { params }: { params: { stokKod: string } }
) {
  const data: CreateBarkodRequest = await req.json()

  // Barkod benzersizliği kontrolü
  const checkQuery = `
    SELECT COUNT(*) as count 
    FROM BARKOD_TANIMLARI 
    WHERE bar_kodu = @barkod AND bar_iptal = 0
  `
  const checkResult = await executeQuery(checkQuery, { barkod: data.barKodu })

  if (checkResult[0].count > 0) {
    return Response.json(
      { error: "Bu barkod zaten kullanılıyor" },
      { status: 400 }
    )
  }

  const insertQuery = `
    INSERT INTO BARKOD_TANIMLARI (
      bar_Guid, bar_DBCno, bar_iptal, bar_fileid,
      bar_create_user, bar_create_date,
      bar_kodu, bar_stokkodu,
      bar_barkodtipi, bar_icerigi,
      bar_birimpntr, bar_master,
      bar_baglantitipi,
      bar_bedenpntr, bar_renkpntr
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @barkod, @stokKod,
      @barkodTipi, @icerik,
      @birimPntr, @master,
      @baglantiTipi,
      @bedenPntr, @renkPntr
    )
  `

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    barkod: data.barKodu,
    stokKod: params.stokKod,
    barkodTipi: data.barBarkodtipi,
    icerik: data.barIcerigi ?? 0,
    birimPntr: data.barBirimpntr,
    master: data.barMaster,
    baglantiTipi: data.barBaglantitipi ?? 0,
    bedenPntr: data.barBedenpntr,
    renkPntr: data.barRenkpntr,
  })

  return Response.json({ message: "Barkod başarıyla eklendi" }, { status: 201 })
}
```

---

## React Bileşen Örneği

```typescript
// components/barkod-scanner.tsx
"use client"

import { useState } from "react"
import { Barcode, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BarkodScanner() {
  const [barkod, setBarkod] = useState("")
  const [stokInfo, setStokInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!barkod.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/barkodlar/${barkod}`)

      if (response.ok) {
        const data = await response.json()
        setStokInfo(data)
      } else {
        setStokInfo(null)
        alert("Barkod bulunamadı!")
      }
    } catch (error) {
      console.error("Barkod okuma hatası:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Barcode className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Barkod okutun veya yazın..."
            value={barkod}
            onChange={(e) => setBarkod(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
            autoFocus
          />
        </div>
        <Button onClick={handleScan} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          Ara
        </Button>
      </div>

      {stokInfo && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-500">Stok Kodu</label>
              <p className="font-semibold">{stokInfo.bar_stokkodu}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Stok Adı</label>
              <p className="font-semibold">{stokInfo.sto_isim}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Barkod Tipi</label>
                <p>{getBarkodTipiAdi(stokInfo.bar_barkodtipi)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Birim</label>
                <p>
                  {stokInfo.bar_birimpntr === 1 && stokInfo.sto_birim1_ad}
                  {stokInfo.bar_birimpntr === 2 && stokInfo.sto_birim2_ad}
                  {stokInfo.bar_birimpntr === 3 && stokInfo.sto_birim3_ad}
                  {stokInfo.bar_birimpntr === 4 && stokInfo.sto_birim4_ad}
                </p>
              </div>
            </div>
            {(stokInfo.bed_adi || stokInfo.ren_adi) && (
              <div className="grid grid-cols-2 gap-4">
                {stokInfo.bed_adi && (
                  <div>
                    <label className="text-sm text-gray-500">Beden</label>
                    <p>{stokInfo.bed_adi}</p>
                  </div>
                )}
                {stokInfo.ren_adi && (
                  <div>
                    <label className="text-sm text-gray-500">Renk</label>
                    <p>{stokInfo.ren_adi}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function getBarkodTipiAdi(tip: number): string {
  const tipler = {
    0: "EAN-13",
    1: "EAN-8",
    2: "ASCII",
    3: "UPC-A",
    4: "UPC-E",
    5: "Code39",
  }
  return tipler[tip] || "Bilinmeyen"
}
```

---

## Önemli Notlar

### 🔑 Benzersizlik

- `bar_kodu` alanı UNIQUE - her barkod sadece bir kez tanımlanabilir
- Aynı stok için farklı birimlere farklı barkodlar verilebilir

### 📦 Çoklu Birim Desteği

- `bar_birimpntr`: Barkodun hangi birime ait olduğunu gösterir (1-4)
- Örnek: Birim1=Adet, Birim2=Koli → Her birim için ayrı barkod

### 🎨 Beden/Renk Varyasyonları

- Tekstil ürünleri için beden/renk kombinasyonları
- Her kombinasyon için farklı barkod tanımlanabilir
- Örnek: Tişört-Kırmızı-M, Tişört-Kırmızı-L farklı barkodlar

### 🏷️ Ana Barkod (`bar_master`)

- Bir stokun birden fazla barkodu olabilir
- Ana barkod (master=1) varsayılan barkod olarak kullanılır
- POS sistemlerinde öncelikli kullanılır

### 📊 Barkod İçeriği

- **Sadece Kod (0)**: Klasik barkod
- **Kod+Miktar (1)**: Tartılı ürünler (meyve, et vb.)
- **Kod+Fiyat (2)**: Hazır paketli ürünler
- **Kod+Tutar (3)**: Değişken fiyatlı ürünler

### 🎁 Özel Barkod Tipleri

- **Paket Barkodu (1)**: Toplu satış paketleri
- **Asorti Barkodu (2)**: Ürün setleri
- **Hediye Çeki (4)**: Hediye kuponu
- **Sabit Kıymet (6)**: Demirbaş takibi

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, STOK_BEDEN_TANIMLARI, STOK_RENK_TANIMLARI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

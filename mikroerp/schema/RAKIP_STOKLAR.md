# RAKIP_STOKLAR (Rakip Stok Kartları)

## Genel Bakış

Rakip firmaların stok kartlarını takip eder. Fiyat karşılaştırması, pazar analizi ve rakip ürün eşleştirmesi için kullanılır.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `raks_Guid` - PRIMARY KEY (Uniqueidentifier)
- `raks_DBCno`, `raks_SpecRECno`, `raks_iptal`, `raks_fileid`
- `raks_hidden`, `raks_kilitli`, `raks_degisti`, `raks_checksum`
- `raks_create_user`, `raks_create_date`, `raks_lastup_user`, `raks_lastup_date`
- `raks_special1`, `raks_special2`, `raks_special3`

### Temel Bilgiler (16-20)

- `raks_kod` - Rakip stok kodu (Nvarchar(25))
- `raks_isim` - Rakip stok adı (Nvarchar(50))
- `raks_sat_cari_kod` - Satıcı cari kodu (Nvarchar(25))
- `raks_cins` - Stok cinsi (0-11, Tinyint)
- `raks_doviz_cinsi` - Döviz cinsi (Tinyint)

### Birim 1 Bilgileri (21-27)

- `raks_birim1_ad` - Birim adı (Nvarchar(10))
- `raks_birim1_katsayi` - Birim katsayı (Float)
- `raks_birim1_agirlik` - Net ağırlık kg (Float)
- `raks_birim1_en` - En mm (Float)
- `raks_birim1_boy` - Boy mm (Float)
- `raks_birim1_yuksekli` - Yükseklik mm (Float)
- `raks_birim1_dara` - Dara (Float)

### Birim 2 Bilgileri (28-34)

Birim 1 ile aynı yapıda: ad, katsayı, ağırlık, en, boy, yükseklik, dara

### Birim 3 Bilgileri (35-41)

Birim 1 ile aynı yapıda: ad, katsayı, ağırlık, en, boy, yükseklik, dara

### Birim 4 Bilgileri (42-48)

Birim 1 ile aynı yapıda: ad, katsayı, ağırlık, en, boy, yükseklik, dara

### Diğer Bilgiler (49-57)

- `raks_karorani` - Kar oranı (Float)
- `raks_reyon_kodu` - Reyon kodu (Nvarchar(25))
- `raks_ambalaj_kodu` - Ambalaj kodu (Nvarchar(25))
- `raks_biz_stok_kodu` - Bizim stok kodu (eşleşme için, Nvarchar(25))
- `raks_satisfiat` - Satış fiyatı (Float)
- `raks_fiat_doviz` - Fiyat döviz cinsi (Tinyint)
- `raks_fiat_opno` - Fiyat ödeme planı no (Integer)
- `raks_fiat_iskonto` - Fiyat iskonto kodu (Nvarchar(4))
- `raks_kdvdahil` - KDV dahil mi? (Bit)

## Enum Değerleri

### raks_cins

- 0: Ticari Mal
- 1: İlk Madde
- 2: Ara Mamül
- 3: Yarı Mamül
- 4: Mamül
- 5: Yan Mamül
- 6: İşletme Malzemesi
- 7: Tüketim Malzemesi
- 8: Yedek Parça
- 9: Akaryakıt Stok
- 10: Montaj Reçeteli Mamül
- 11: Temel Hammadde

## İlişkiler

- **CARI_HESAPLAR** ← KOD: `raks_sat_cari_kod` → `cari_kod` (Rakip/Satıcı)
- **STOKLAR** ← KOD: `raks_biz_stok_kodu` → `sto_kod` (Bizim karşılık ürün)
- **STOK_REYONLARI** ← KOD: `raks_reyon_kodu` → `ryn_kod`
- **ODEME_PLANLARI** ← KOD: `raks_fiat_opno` → `odp_no`

## Indexler

Belirtilmemiş (varsayılan sadece PRIMARY KEY)

## Kullanım Senaryoları

### 1. Fiyat Karşılaştırması

Rakip ürün fiyatlarını kendi ürünlerimizle karşılaştırma

### 2. Pazar Analizi

Rakip ürün portföyü ve fiyatlandırma stratejilerini takip

### 3. Ürün Eşleştirme

`raks_biz_stok_kodu` ile rakip ürünleri kendi ürünlerimize eşleştirme

## SQL Örnekleri

### 1. Rakip Stok Listesi

```sql
SELECT
  r.raks_kod,
  r.raks_isim,
  c.cari_unvan1 AS rakip_firma,
  r.raks_satisfiat,
  r.raks_kdvdahil
FROM RAKIP_STOKLAR r
LEFT JOIN CARI_HESAPLAR c ON r.raks_sat_cari_kod = c.cari_kod
WHERE r.raks_iptal = 0
ORDER BY c.cari_unvan1, r.raks_isim
```

### 2. Fiyat Karşılaştırması

```sql
SELECT
  s.sto_kod AS bizim_kod,
  s.sto_isim AS bizim_urun,
  s.sto_satis_fiyat1 AS bizim_fiyat,
  r.raks_kod AS rakip_kod,
  r.raks_isim AS rakip_urun,
  r.raks_satisfiat AS rakip_fiyat,
  c.cari_unvan1 AS rakip_firma,
  r.raks_satisfiat - s.sto_satis_fiyat1 AS fiyat_farki
FROM STOKLAR s
INNER JOIN RAKIP_STOKLAR r ON s.sto_kod = r.raks_biz_stok_kodu
LEFT JOIN CARI_HESAPLAR c ON r.raks_sat_cari_kod = c.cari_kod
WHERE s.sto_iptal = 0
  AND r.raks_iptal = 0
ORDER BY fiyat_farki DESC
```

### 3. Rakip Firma Bazında Ürün Sayısı

```sql
SELECT
  c.cari_kod,
  c.cari_unvan1,
  COUNT(*) AS urun_adedi,
  AVG(r.raks_satisfiat) AS ortalama_fiyat
FROM RAKIP_STOKLAR r
INNER JOIN CARI_HESAPLAR c ON r.raks_sat_cari_kod = c.cari_kod
WHERE r.raks_iptal = 0
GROUP BY c.cari_kod, c.cari_unvan1
ORDER BY urun_adedi DESC
```

## TypeScript Interface

```typescript
interface RakipStok {
  raksGuid: string
  raksKod: string
  raksIsim: string
  raksSatCariKod?: string
  raksCins: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  raksDovizCinsi: number
  // Birim 1
  raksBirim1Ad?: string
  raksBirim1Katsayi?: number
  raksBirim1Agirlik?: number
  raksBirim1En?: number
  raksBirim1Boy?: number
  raksBirim1Yuksekli?: number
  // Birim 2-4 (benzer yapı)
  raksKarorani?: number
  raksReyonKodu?: string
  raksAmbalajKodu?: string
  raksBizStokKodu?: string // Eşleşme için
  raksSatisfiat: number
  raksFiatDoviz: number
  raksFiatOpno?: number
  raksFiatIskonto?: string
  raksKdvdahil: boolean
  raksIptal: boolean
}

interface FiyatKarsilastirma {
  bizimKod: string
  bizimUrun: string
  bizimFiyat: number
  rakipKod: string
  rakipUrun: string
  rakipFiyat: number
  rakipFirma: string
  fiyatFarki: number
  farkYuzde: number
}
```

## API Endpoint Örneği

```typescript
// app/api/rakip-stoklar/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rakipCariKod = searchParams.get("rakip_cari_kod")
  const bizimStokKod = searchParams.get("bizim_stok_kod")

  const result = await query(
    `
    SELECT 
      r.raks_Guid as raksGuid,
      r.raks_kod as raksKod,
      r.raks_isim as raksIsim,
      r.raks_sat_cari_kod as raksSatCariKod,
      c.cari_unvan1 as rakipFirma,
      r.raks_satisfiat as raksSatisfiat,
      r.raks_biz_stok_kodu as raksBizStokKodu,
      s.sto_isim as bizimStokIsim,
      r.raks_kdvdahil as raksKdvdahil
    FROM RAKIP_STOKLAR r
    LEFT JOIN CARI_HESAPLAR c ON r.raks_sat_cari_kod = c.cari_kod
    LEFT JOIN STOKLAR s ON r.raks_biz_stok_kodu = s.sto_kod
    WHERE r.raks_iptal = 0
      ${rakipCariKod ? "AND r.raks_sat_cari_kod = @rakipCariKod" : ""}
      ${bizimStokKod ? "AND r.raks_biz_stok_kodu = @bizimStokKod" : ""}
    ORDER BY c.cari_unvan1, r.raks_isim
  `,
    { rakipCariKod, bizimStokKod }
  )

  return Response.json(result.recordset)
}

// Fiyat karşılaştırma
export async function POST(request: Request) {
  const { stokKod } = await request.json()

  const result = await query(
    `
    SELECT 
      s.sto_kod as bizimKod,
      s.sto_isim as bizimUrun,
      s.sto_satis_fiyat1 as bizimFiyat,
      r.raks_kod as rakipKod,
      r.raks_isim as rakipUrun,
      r.raks_satisfiat as rakipFiyat,
      c.cari_unvan1 as rakipFirma,
      r.raks_satisfiat - s.sto_satis_fiyat1 as fiyatFarki,
      CASE 
        WHEN s.sto_satis_fiyat1 > 0 
        THEN ((r.raks_satisfiat - s.sto_satis_fiyat1) / s.sto_satis_fiyat1) * 100
        ELSE 0 
      END as farkYuzde
    FROM STOKLAR s
    INNER JOIN RAKIP_STOKLAR r ON s.sto_kod = r.raks_biz_stok_kodu
    LEFT JOIN CARI_HESAPLAR c ON r.raks_sat_cari_kod = c.cari_kod
    WHERE s.sto_kod = @stokKod
      AND s.sto_iptal = 0
      AND r.raks_iptal = 0
    ORDER BY r.raks_satisfiat
  `,
    { stokKod }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/fiyat-karsilastirma.tsx
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

export function FiyatKarsilastirma({
  karsilastirmalar,
}: {
  karsilastirmalar: FiyatKarsilastirma[]
}) {
  const getFarkIcon = (fark: number) => {
    if (fark > 0) return <ArrowUp className="h-4 w-4 text-red-500" />
    if (fark < 0) return <ArrowDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bizim Ürün</TableHead>
          <TableHead className="text-right">Bizim Fiyat</TableHead>
          <TableHead>Rakip Firma</TableHead>
          <TableHead>Rakip Ürün</TableHead>
          <TableHead className="text-right">Rakip Fiyat</TableHead>
          <TableHead className="text-right">Fark</TableHead>
          <TableHead className="text-right">Fark %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {karsilastirmalar.map((k, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="font-medium">{k.bizimUrun}</div>
              <div className="text-sm text-muted-foreground">{k.bizimKod}</div>
            </TableCell>
            <TableCell className="text-right font-medium">
              ₺{k.bizimFiyat.toFixed(2)}
            </TableCell>
            <TableCell>{k.rakipFirma}</TableCell>
            <TableCell>
              <div>{k.rakipUrun}</div>
              <div className="text-sm text-muted-foreground">{k.rakipKod}</div>
            </TableCell>
            <TableCell className="text-right">
              ₺{k.rakipFiyat.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {getFarkIcon(k.fiyatFarki)}
                <span
                  className={
                    k.fiyatFarki > 0
                      ? "text-red-600"
                      : k.fiyatFarki < 0
                      ? "text-green-600"
                      : ""
                  }
                >
                  ₺{Math.abs(k.fiyatFarki).toFixed(2)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={
                  k.farkYuzde > 0
                    ? "destructive"
                    : k.farkYuzde < 0
                    ? "success"
                    : "outline"
                }
              >
                {k.farkYuzde > 0 ? "+" : ""}
                {k.farkYuzde.toFixed(1)}%
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Notlar

- **58 alanlı** rakip ürün takip tablosu
- **4 Birim Seti**: Her biri için 7 özellik (ad, katsayı, ağırlık, en, boy, yükseklik, dara)
- **Ürün Eşleştirme**: `raks_biz_stok_kodu` ile kendi ürünlerimize bağlantı
- Fiyat karşılaştırması ve pazar analizi için ideal
- Rakip firma bazında ürün portföyü takibi

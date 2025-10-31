# SAYIM_SONUCLARI (Sayım Sonuçları)

## Genel Bakış

Depo envanter sayım sonuçlarını kaydeder. Fiziksel stok sayımları, 5 farklı miktar kaydı, reyon/koridor/raf bazlı konum takibi sağlar.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `sym_Guid` - PRIMARY KEY (Uniqueidentifier)
- `sym_DBCno`, `sym_SpecRECno`, `sym_iptal`, `sym_fileid`
- `sym_hidden`, `sym_kilitli`, `sym_degisti`, `sym_checksum`
- `sym_create_user`, `sym_create_date`, `sym_lastup_user`, `sym_lastup_date`
- `sym_special1`, `sym_special2`, `sym_special3`

### Sayım Bilgileri (16-19)

- `sym_tarihi` - Sayım tarihi (UNIQUE, DateTime)
- `sym_depono` - Depo no (UNIQUE, Integer)
- `sym_evrakno` - Sayım evrak no (UNIQUE, Integer)
- `sym_satirno` - Satır no (UNIQUE, Integer)

### Stok ve Konum (20-23)

- `sym_Stokkodu` - Stok kodu (Nvarchar(25))
- `sym_reyonkodu` - Reyon kodu (Nvarchar(4))
- `sym_koridorkodu` - Koridor kodu (Nvarchar(4))
- `sym_rafkodu` - Raf kodu (Nvarchar(4))

### Miktar Bilgileri (24-29)

- `sym_miktar1` - 1. Miktar (Float) - İlk sayım
- `sym_miktar2` - 2. Miktar (Float) - 2. sayım
- `sym_miktar3` - 3. Miktar (Float) - 3. sayım
- `sym_miktar4` - 4. Miktar (Float) - 4. sayım
- `sym_miktar5` - 5. Miktar (Float) - 5. sayım
- `sym_birim_pntr` - Birim bağlantısı (Tinyint)

### Ürün Varyantları (30-35)

- `sym_barkod` - Barkod (barkod_str)
- `sym_renkno` - Renk no (Integer)
- `sym_bedenno` - Beden no (Integer)
- `sym_parti_kodu` - Parti kodu (Nvarchar(25))
- `sym_lot_no` - Lot no (Integer)
- `sym_serino` - Seri no (Nvarchar(25))

## İlişkiler

- **DEPOLAR** ← KOD: `sym_depono` → `dep_no`
- **STOKLAR** ← KOD: `sym_Stokkodu` → `sto_kod`
- **STOK_REYONLARI** ← KOD: `sym_reyonkodu` → `ryn_kod`
- **BARKOD_TANIMLARI** ← KOD: `sym_barkod` → `bar_kodu`

## Indexler

```sql
PRIMARY KEY: sym_Guid
UNIQUE: (sym_tarihi, sym_depono, sym_evrakno, sym_satirno)
INDEX: (sym_Stokkodu, sym_barkod, sym_reyonkodu, sym_koridorkodu, sym_rafkodu, sym_renkno, sym_bedenno)
```

## Kullanım Senaryoları

### 1. Çoklu Sayım

5 farklı miktar alanı sayesinde:

- İlk sayım (`sym_miktar1`)
- Kontrol sayımı (`sym_miktar2`)
- Son sayım (`sym_miktar3-5`)
- Farklı sayım ekipleri

### 2. Konum Bazlı Sayım

- Reyon/koridor/raf kombinasyonu
- Fiziksel lokasyon takibi
- Depo organizasyonu

### 3. Varyant Takibi

- Renk/beden bazlı sayım
- Parti ve lot takibi
- Seri numaralı ürünler

## SQL Örnekleri

### 1. Sayım Listesi

```sql
SELECT
  s.sym_tarihi,
  s.sym_evrakno,
  d.dep_adi AS depo_adi,
  s.sym_Stokkodu,
  st.sto_isim,
  s.sym_miktar1,
  s.sym_miktar2,
  s.sym_miktar3
FROM SAYIM_SONUCLARI s
INNER JOIN DEPOLAR d ON s.sym_depono = d.dep_no
INNER JOIN STOKLAR st ON s.sym_Stokkodu = st.sto_kod
WHERE s.sym_iptal = 0
  AND s.sym_tarihi = @tarih
ORDER BY s.sym_evrakno, s.sym_satirno
```

### 2. Fark Analizi

```sql
SELECT
  s.sym_Stokkodu,
  st.sto_isim,
  s.sym_miktar1 AS sayim1,
  s.sym_miktar2 AS sayim2,
  s.sym_miktar2 - s.sym_miktar1 AS fark,
  CASE
    WHEN ABS(s.sym_miktar2 - s.sym_miktar1) > 0 THEN 'Farklı'
    ELSE 'Uyumlu'
  END AS durum
FROM SAYIM_SONUCLARI s
INNER JOIN STOKLAR st ON s.sym_Stokkodu = st.sto_kod
WHERE s.sym_iptal = 0
  AND s.sym_tarihi = @tarih
  AND s.sym_depono = @depoNo
ORDER BY ABS(s.sym_miktar2 - s.sym_miktar1) DESC
```

### 3. Reyon Bazlı Özet

```sql
SELECT
  r.ryn_isim AS reyon,
  COUNT(*) AS toplam_satir,
  SUM(s.sym_miktar1) AS toplam_miktar,
  COUNT(CASE WHEN ABS(s.sym_miktar2 - s.sym_miktar1) > 0 THEN 1 END) AS farkli_sayim
FROM SAYIM_SONUCLARI s
LEFT JOIN STOK_REYONLARI r ON s.sym_reyonkodu = r.ryn_kod
WHERE s.sym_iptal = 0
  AND s.sym_tarihi = @tarih
  AND s.sym_depono = @depoNo
GROUP BY r.ryn_isim
ORDER BY reyon
```

### 4. Konum Detaylı Sayım

```sql
SELECT
  s.sym_reyonkodu,
  s.sym_koridorkodu,
  s.sym_rafkodu,
  s.sym_Stokkodu,
  st.sto_isim,
  s.sym_miktar1,
  s.sym_barkod
FROM SAYIM_SONUCLARI s
INNER JOIN STOKLAR st ON s.sym_Stokkodu = st.sto_kod
WHERE s.sym_iptal = 0
  AND s.sym_tarihi = @tarih
  AND s.sym_depono = @depoNo
ORDER BY s.sym_reyonkodu, s.sym_koridorkodu, s.sym_rafkodu
```

## TypeScript Interface

```typescript
interface SayimSonucu {
  symGuid: string
  symTarihi: Date
  symDepono: number
  symEvrakno: number
  symSatirno: number
  symStokkodu: string
  symReyonkodu?: string
  symKoridorkodu?: string
  symRafkodu?: string
  symMiktar1?: number
  symMiktar2?: number
  symMiktar3?: number
  symMiktar4?: number
  symMiktar5?: number
  symBirimPntr: number
  symBarkod?: string
  symRenkno?: number
  symBedenno?: number
  symPartiKodu?: string
  symLotNo?: number
  symSerino?: string
  symIptal: boolean
}

interface SayimFarki {
  stokKodu: string
  stokIsim: string
  sayim1: number
  sayim2: number
  fark: number
  farkYuzde: number
}
```

## API Endpoint Örneği

```typescript
// app/api/sayim-sonuclari/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tarih = searchParams.get("tarih")
  const depoNo = searchParams.get("depo_no")
  const evrakNo = searchParams.get("evrak_no")

  const result = await query(
    `
    SELECT 
      s.sym_Guid as symGuid,
      s.sym_tarihi as symTarihi,
      s.sym_evrakno as symEvrakno,
      s.sym_satirno as symSatirno,
      s.sym_Stokkodu as symStokkodu,
      st.sto_isim as stokIsim,
      s.sym_reyonkodu as symReyonkodu,
      s.sym_miktar1 as symMiktar1,
      s.sym_miktar2 as symMiktar2,
      s.sym_barkod as symBarkod,
      d.dep_adi as depoAdi
    FROM SAYIM_SONUCLARI s
    INNER JOIN STOKLAR st ON s.sym_Stokkodu = st.sto_kod
    INNER JOIN DEPOLAR d ON s.sym_depono = d.dep_no
    WHERE s.sym_iptal = 0
      ${tarih ? "AND CAST(s.sym_tarihi AS DATE) = @tarih" : ""}
      ${depoNo ? "AND s.sym_depono = @depoNo" : ""}
      ${evrakNo ? "AND s.sym_evrakno = @evrakNo" : ""}
    ORDER BY s.sym_evrakno, s.sym_satirno
  `,
    {
      tarih,
      depoNo: depoNo ? parseInt(depoNo) : undefined,
      evrakNo: evrakNo ? parseInt(evrakNo) : undefined,
    }
  )

  return Response.json(result.recordset)
}

// Fark analizi endpoint
export async function POST(request: Request) {
  const { tarih, depoNo } = await request.json()

  const result = await query(
    `
    SELECT 
      s.sym_Stokkodu as stokKodu,
      st.sto_isim as stokIsim,
      s.sym_miktar1 as sayim1,
      s.sym_miktar2 as sayim2,
      s.sym_miktar2 - s.sym_miktar1 as fark,
      CASE 
        WHEN s.sym_miktar1 > 0 
        THEN ((s.sym_miktar2 - s.sym_miktar1) / s.sym_miktar1) * 100
        ELSE 0 
      END as farkYuzde
    FROM SAYIM_SONUCLARI s
    INNER JOIN STOKLAR st ON s.sym_Stokkodu = st.sto_kod
    WHERE s.sym_iptal = 0
      AND CAST(s.sym_tarihi AS DATE) = @tarih
      AND s.sym_depono = @depoNo
      AND ABS(s.sym_miktar2 - s.sym_miktar1) > 0
    ORDER BY ABS(s.sym_miktar2 - s.sym_miktar1) DESC
  `,
    { tarih, depoNo }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/sayim-fark-raporu.tsx
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

export function SayimFarkRaporu({ sayimlar }: { sayimlar: SayimSonucu[] }) {
  const hesaplaFark = (s: SayimSonucu) => {
    const fark = (s.symMiktar2 || 0) - (s.symMiktar1 || 0)
    const yuzde =
      s.symMiktar1 && s.symMiktar1 > 0 ? (fark / s.symMiktar1) * 100 : 0
    return { fark, yuzde }
  }

  const getDurumBadge = (fark: number) => {
    if (fark === 0) return <Badge variant="success">Uyumlu</Badge>
    if (Math.abs(fark) < 5) return <Badge variant="secondary">Küçük Fark</Badge>
    return <Badge variant="destructive">Büyük Fark</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stok Kodu</TableHead>
          <TableHead>Stok İsmi</TableHead>
          <TableHead>Reyon</TableHead>
          <TableHead className="text-right">1. Sayım</TableHead>
          <TableHead className="text-right">2. Sayım</TableHead>
          <TableHead className="text-right">Fark</TableHead>
          <TableHead className="text-right">Fark %</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sayimlar.map((s) => {
          const { fark, yuzde } = hesaplaFark(s)
          return (
            <TableRow key={s.symGuid}>
              <TableCell className="font-mono">{s.symStokkodu}</TableCell>
              <TableCell>{s.stokIsim}</TableCell>
              <TableCell>
                {s.symReyonkodu &&
                  `${s.symReyonkodu}-${s.symKoridorkodu}-${s.symRafkodu}`}
              </TableCell>
              <TableCell className="text-right">
                {s.symMiktar1?.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {s.symMiktar2?.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${
                  fark !== 0 ? "text-red-600" : ""
                }`}
              >
                {fark.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{yuzde.toFixed(1)}%</TableCell>
              <TableCell>{getDurumBadge(fark)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
```

## Notlar

- **36 alanlı** envanter sayım tablosu
- **5 Miktar Alanı**: Çoklu sayım ve doğrulama için
- **Konum Sistemi**: Reyon → Koridor → Raf hiyerarşisi
- **Varyant Desteği**: Renk, beden, parti, lot, seri no
- Composite unique: `(tarih, depo, evrak_no, satir_no)`
- Sayım farkı analizi ve raporlama için ideal yapı

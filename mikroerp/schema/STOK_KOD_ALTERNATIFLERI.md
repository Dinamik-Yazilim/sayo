# STOK_KOD_ALTERNATIFLERI (Stok Kod Alternatifleri)

## Genel Bakış

Stoklar için alternatif kodlama sistemi sağlar. Grup ve alan bazlı esnek kod yapısı ile farklı kodlama şemalarını destekler.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `sak_Guid` - PRIMARY KEY (Uniqueidentifier)
- `sak_DBCno`, `sak_SpecRECno`, `sak_iptal`, `sak_fileid`
- `sak_hidden`, `sak_kilitli`, `sak_degisti`, `sak_checksum`
- `sak_create_user`, `sak_create_date`, `sak_lastup_user`, `sak_lastup_date`
- `sak_special1`, `sak_special2`, `sak_special3`

### Alternatif Kod Tanımları (16-19)

- `sak_altgrupno` - Alternatif grup no (Smallint, UNIQUE)
- `sak_altalanno` - Alternatif alan no (Smallint, UNIQUE)
- `sak_altkodu` - Alternatif kod (UNIQUE, Nvarchar(25))
- `sak_altaciklama` - Alternatif açıklama (Nvarchar(50))

## İlişkiler

- **STOKLAR** ← KOD: Stok kartlarında alternatif kod alanlarıyla eşleşir
- **Composite Key**: `(sak_altgrupno, sak_altalanno, sak_altkodu)` unique kombinasyon

## Indexler

```sql
PRIMARY KEY: sak_Guid
UNIQUE: (sak_altgrupno, sak_altalanno, sak_altkodu)
```

## Kullanım Senaryoları

### 1. Farklı Kod Sistemleri

- Tedarikçi kodları
- Müşteri kodları
- Eski sistem kodları
- Uluslararası kodlar (EAN, GTİN)

### 2. Grup ve Alan Yapısı

- **Grup No**: Kodlama kategorisini belirtir (örn: Tedarikçi A, Tedarikçi B)
- **Alan No**: Alt kategorileri belirtir (örn: Ana ürün, Varyant)
- **Kod**: Gerçek alternatif kod değeri

## SQL Örnekleri

### 1. Alternatif Kod Listesi

```sql
SELECT
  sak_altgrupno,
  sak_altalanno,
  sak_altkodu,
  sak_altaciklama
FROM STOK_KOD_ALTERNATIFLERI
WHERE sak_iptal = 0
ORDER BY sak_altgrupno, sak_altalanno, sak_altkodu
```

### 2. Belirli Gruba Ait Alternatif Kodlar

```sql
SELECT
  sak_altalanno,
  sak_altkodu,
  sak_altaciklama
FROM STOK_KOD_ALTERNATIFLERI
WHERE sak_altgrupno = @grupNo
  AND sak_iptal = 0
ORDER BY sak_altalanno, sak_altkodu
```

### 3. Alternatif Kod Araması

```sql
SELECT
  sak_altgrupno,
  sak_altalanno,
  sak_altkodu,
  sak_altaciklama
FROM STOK_KOD_ALTERNATIFLERI
WHERE sak_altkodu = @altKod
  AND sak_iptal = 0
```

## TypeScript Interface

```typescript
interface StokKodAlternatifi {
  sakGuid: string
  sakAltgrupno: number
  sakAltalanno: number
  sakAltkodu: string
  sakAltaciklama?: string
  sakIptal: boolean
  sakCreateDate: Date
  sakLastupDate: Date
}

// Kullanım örneği
interface StokWithAlternatives {
  stokKod: string
  stokIsim: string
  alternatifKodlar: StokKodAlternatifi[]
}
```

## API Endpoint Örneği

```typescript
// app/api/stok-kod-alternatifleri/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const grupNo = searchParams.get("grup_no")
  const alanNo = searchParams.get("alan_no")
  const altKod = searchParams.get("alt_kod")

  const result = await query(
    `
    SELECT 
      sak_Guid as sakGuid,
      sak_altgrupno as sakAltgrupno,
      sak_altalanno as sakAltalanno,
      sak_altkodu as sakAltkodu,
      sak_altaciklama as sakAltaciklama
    FROM STOK_KOD_ALTERNATIFLERI
    WHERE sak_iptal = 0
      ${grupNo ? "AND sak_altgrupno = @grupNo" : ""}
      ${alanNo ? "AND sak_altalanno = @alanNo" : ""}
      ${altKod ? "AND sak_altkodu LIKE @altKod" : ""}
    ORDER BY sak_altgrupno, sak_altalanno, sak_altkodu
  `,
    {
      grupNo: grupNo ? parseInt(grupNo) : undefined,
      alanNo: alanNo ? parseInt(alanNo) : undefined,
      altKod: altKod ? `%${altKod}%` : undefined,
    }
  )

  return Response.json(result.recordset)
}

// Alternatif kod ile stok bulma
export async function POST(request: Request) {
  const { altKod, grupNo, alanNo } = await request.json()

  const result = await query(
    `
    SELECT 
      sak_altkodu as sakAltkodu,
      sak_altaciklama as sakAltaciklama
    FROM STOK_KOD_ALTERNATIFLERI
    WHERE sak_altkodu = @altKod
      AND sak_altgrupno = @grupNo
      AND sak_altalanno = @alanNo
      AND sak_iptal = 0
  `,
    { altKod, grupNo, alanNo }
  )

  return Response.json(result.recordset[0])
}
```

## React Component Örneği

```typescript
// components/alternatif-kod-search.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AlternatifKodSearch() {
  const [grupNo, setGrupNo] = useState<string>("")
  const [alanNo, setAlanNo] = useState<string>("")
  const [altKod, setAltKod] = useState<string>("")
  const [sonuclar, setSonuclar] = useState<StokKodAlternatifi[]>([])

  const ara = async () => {
    const params = new URLSearchParams()
    if (grupNo) params.append("grup_no", grupNo)
    if (alanNo) params.append("alan_no", alanNo)
    if (altKod) params.append("alt_kod", altKod)

    const response = await fetch(`/api/stok-kod-alternatifleri?${params}`)
    const data = await response.json()
    setSonuclar(data)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Grup No</label>
          <Input
            type="number"
            value={grupNo}
            onChange={(e) => setGrupNo(e.target.value)}
            placeholder="Grup numarası..."
          />
        </div>
        <div>
          <label className="text-sm font-medium">Alan No</label>
          <Input
            type="number"
            value={alanNo}
            onChange={(e) => setAlanNo(e.target.value)}
            placeholder="Alan numarası..."
          />
        </div>
        <div>
          <label className="text-sm font-medium">Alternatif Kod</label>
          <Input
            value={altKod}
            onChange={(e) => setAltKod(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ara()}
            placeholder="Alternatif kod ara..."
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grup No</TableHead>
            <TableHead>Alan No</TableHead>
            <TableHead>Alternatif Kod</TableHead>
            <TableHead>Açıklama</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sonuclar.map((s) => (
            <TableRow key={s.sakGuid}>
              <TableCell>{s.sakAltgrupno}</TableCell>
              <TableCell>{s.sakAltalanno}</TableCell>
              <TableCell className="font-mono">{s.sakAltkodu}</TableCell>
              <TableCell>{s.sakAltaciklama}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

## Notlar

- **20 alanlı** basit ama esnek yapı
- **Composite Unique Key**: `(grup_no, alan_no, kod)` kombinasyonu
- Çoklu kodlama sistemleri için ideal
- Tedarikçi/müşteri özel kodlarını saklama
- Barkod sistemine alternatif veya tamamlayıcı
- STOKLAR tablosunun alternatif kod alanlarıyla entegre çalışır

# SORUMLULUK_MERKEZLERI (Sorumluluk Merkezleri)

## Genel Bakış

Maliyet muhasebesi ve üretim yönetimi için sorumluluk merkezlerini tanımlar. Masraf, kar ve yatırım merkezlerini içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `som_Guid` - PRIMARY KEY (Uniqueidentifier)
- `som_DBCno`, `som_SpecRECno`, `som_iptal`, `som_fileid`
- `som_hidden`, `som_kilitli`, `som_degisti`, `som_checksum`
- `som_create_user`, `som_create_date`, `som_lastup_user`, `som_lastup_date`
- `som_special1`, `som_special2`, `som_special3`

### Tanım Alanları (16-25)

- `som_kod` - Sorumluluk merkezi kodu (UNIQUE, Nvarchar(25))
- `som_isim` - Sorumluluk merkezi adı (Nvarchar(40))
- `som_DogrudanUrtSrmMrk` - Doğrudan üretim merkezi mi? (Bit)
- `som_MasrafNereyeYuklenecek` - Masraf yükleme yeri (0-4, Tinyint)
- `som_DagAnahKodu` - Dağıtım anahtarı kodu (Nvarchar(25))
- `som_MuhArtikeli` - Muhasebe artikeli (Nvarchar(10))
- `som_MaliyetDagitimSekli` - Maliyet dağıtım şekli (0-12, Tinyint)
- `som_MaliyetDagitimKaynak` - Maliyet dağıtım kaynağı (0-1, Tinyint)
- `som_tipi` - Sorumluluk merkezi tipi (0-7, Tinyint)
- `som_satis_fiyat_liste_no` - Satış fiyat liste no (Integer)

## Enum Değerleri

### som_MasrafNereyeYuklenecek

- 0: İş Merkezine
- 1: İş Emrine
- 2: Ürüne
- 3: Operasyona
- 4: Kalıba

### som_MaliyetDagitimSekli

- 0: Süreye göre
- 1: Miktara göre
- 2: Ağırlığa göre
- 3: Alana göre
- 4: Hacme göre
- 5: Adam saate göre
- 6: Miktar 2'ye göre
- 7: Miktar 3'e göre
- 8: Miktar 4'e göre
- 9: Enerji 1'e göre
- 10: Enerji 2'ye göre
- 11: Miktar bölü safha sayısına göre
- 12: Miktar bölü safha sayısı çarpı standart maliyete göre

### som_MaliyetDagitimKaynak

- 0: Hesaptan
- 1: Sorumluluk Merkezi Özel

### som_tipi

- 0: Genel Amaçlı Masraf Merkezi
- 1: Genel Amaçlı Kar Merkezi
- 2: Doğrudan Üretim Yeri Masraf Merkezi
- 3: Dolaylı Üretim Yeri Masraf Merkezi
- 4: Satış Kar Merkezi
- 5: Kampanya Satış Kar Merkezi
- 6: Yatırım Merkezi
- 7: Ödenmeyen Değerli Kağıtlar Merkezi

## İlişkiler

- **DEPOLAR** ← KOD: `dep_sor_mer_kodu` → `som_kod`
- **STOK_HAREKETLERI** ← KOD: `sth_sor_merkezi` → `som_kod`
- **MUHASEBE_HAREKETLERI** ← KOD: `muh_sorumluluk_merkezi` → `som_kod`

## Indexler

```sql
PRIMARY KEY: som_Guid
UNIQUE: som_kod
INDEX: som_isim
```

## SQL Örnekleri

### 1. Sorumluluk Merkezi Listesi

```sql
SELECT
  som_kod,
  som_isim,
  som_tipi,
  som_DogrudanUrtSrmMrk
FROM SORUMLULUK_MERKEZLERI
WHERE som_iptal = 0
ORDER BY som_kod
```

### 2. Üretim Merkezleri

```sql
SELECT
  som_kod,
  som_isim,
  CASE som_tipi
    WHEN 2 THEN 'Doğrudan Üretim'
    WHEN 3 THEN 'Dolaylı Üretim'
  END AS tip_adi
FROM SORUMLULUK_MERKEZLERI
WHERE som_tipi IN (2, 3)
  AND som_iptal = 0
```

### 3. Kar Merkezleri

```sql
SELECT
  som_kod,
  som_isim,
  som_satis_fiyat_liste_no
FROM SORUMLULUK_MERKEZLERI
WHERE som_tipi IN (1, 4, 5)
  AND som_iptal = 0
```

## TypeScript Interface

```typescript
interface SorumlulukMerkezi {
  somGuid: string
  somKod: string
  somIsim: string
  somDogrudanUrtSrmMrk: boolean
  somMasrafNereyeYuklenecek: 0 | 1 | 2 | 3 | 4
  somDagAnahKodu?: string
  somMuhArtikeli?: string
  somMaliyetDagitimSekli: number
  somMaliyetDagitimKaynak: 0 | 1
  somTipi: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  somSatisFiyatListeNo?: number
  somIptal: boolean
}

type SorumlulukMerkeziTipi =
  | "Genel Amaçlı Masraf Merkezi"
  | "Genel Amaçlı Kar Merkezi"
  | "Doğrudan Üretim Yeri Masraf Merkezi"
  | "Dolaylı Üretim Yeri Masraf Merkezi"
  | "Satış Kar Merkezi"
  | "Kampanya Satış Kar Merkezi"
  | "Yatırım Merkezi"
  | "Ödenmeyen Değerli Kağıtlar Merkezi"
```

## API Endpoint Örneği

```typescript
// app/api/sorumluluk-merkezleri/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tip = searchParams.get("tip")

  const result = await query(
    `
    SELECT 
      som_Guid as somGuid,
      som_kod as somKod,
      som_isim as somIsim,
      som_tipi as somTipi,
      som_DogrudanUrtSrmMrk as somDogrudanUrtSrmMrk
    FROM SORUMLULUK_MERKEZLERI
    WHERE som_iptal = 0
      ${tip ? "AND som_tipi = @tip" : ""}
    ORDER BY som_kod
  `,
    tip ? { tip: parseInt(tip) } : {}
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/sorumluluk-merkezi-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MERKEZ_TIPLERI: Record<number, string> = {
  0: "Genel Masraf",
  1: "Genel Kar",
  2: "Doğrudan Üretim",
  3: "Dolaylı Üretim",
  4: "Satış Kar",
  5: "Kampanya Satış",
  6: "Yatırım",
  7: "Değerli Kağıtlar",
}

export function SorumlulukMerkeziSelect({ value, onChange, merkezTip }: Props) {
  const [merkezler, setMerkezler] = useState<SorumlulukMerkezi[]>([])

  useEffect(() => {
    const url =
      merkezTip !== undefined
        ? `/api/sorumluluk-merkezleri?tip=${merkezTip}`
        : "/api/sorumluluk-merkezleri"

    fetch(url)
      .then((r) => r.json())
      .then(setMerkezler)
  }, [merkezTip])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sorumluluk Merkezi Seçin" />
      </SelectTrigger>
      <SelectContent>
        {merkezler.map((m) => (
          <SelectItem key={m.somGuid} value={m.somKod}>
            {m.somKod} - {m.somIsim} ({MERKEZ_TIPLERI[m.somTipi]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

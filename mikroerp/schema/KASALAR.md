# KASALAR (Kasa Kartları)

## Genel Bakış

Firmanın nakit, çek ve senet kasalarını tanımlar. Her kasa tipi için ayrı muhasebe kodu ve döviz cinsi belirlenebilir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `kas_Guid` - PRIMARY KEY (Uniqueidentifier)
- `kas_DBCno`, `kas_SpecRecno`, `kas_iptal`, `kas_fileid`
- `kas_hidden`, `kas_kilitli`, `kas_degisti`, `kas_checksum`
- `kas_create_user`, `kas_create_date`, `kas_lastup_user`, `kas_lastup_date`
- `kas_special1`, `kas_special2`, `kas_special3`

### Tanım Alanları (16-24)

- `kas_tip` - Kasa tipi (0-7, Tinyint)
- `kas_firma_no` - Firma numarası (Integer)
- `kas_kod` - Kasa kodu (UNIQUE, Nvarchar(25))
- `kas_isim` - Kasa ismi (Nvarchar(40))
- `kas_muh_kod` - Muhasebe kodu (Nvarchar(40))
- `kas_doviz_cinsi` - Döviz cinsi (Tinyint)
- `kas_bankakodu` - Bağlı banka kodu (Nvarchar(25))
- `kas_nakakincelenmesi` - Nakit akışta incelenmesin (Bit)
- `kas_ufrs_muh_kod` - UFRS muhasebe kodu (Nvarchar(40))

## Enum Değerleri

### kas_tip

- 0: Nakit Kasası
- 1: Çek Kasası
- 2: Karşılıksız Çek Kasası
- 3: Senet Kasası
- 4: Protestolu Senet Kasası
- 5: Verilen Senet Kasası
- 6: Verilen Ödeme Emirleri Kasası
- 7: Müşteri Ödeme Sözleri Kasası

## İlişkiler

- **BANKALAR** ← KOD: `kas_bankakodu` → `ban_kod`
- **MUHASEBE_HESAP_PLANI** ← KOD: `kas_muh_kod` → `muh_kod`
- **KASA_HAREKETLERI** ← KOD: `knh_kasa_kodu` → `kas_kod`
- **CEKSENET_HAREKETLERI** ← KOD: `cns_kasa_kodu` → `kas_kod`

## Indexler

```sql
PRIMARY KEY: kas_Guid
UNIQUE: kas_kod
INDEX: kas_isim
```

## SQL Örnekleri

### 1. Kasa Listesi

```sql
SELECT
  kas_kod,
  kas_isim,
  kas_tip,
  kas_doviz_cinsi
FROM KASALAR
WHERE kas_iptal = 0
ORDER BY kas_kod
```

### 2. Nakit Kasaları

```sql
SELECT
  kas_kod,
  kas_isim,
  kas_muh_kod,
  kas_doviz_cinsi
FROM KASALAR
WHERE kas_tip = 0
  AND kas_iptal = 0
```

### 3. Çek ve Senet Kasaları

```sql
SELECT
  kas_kod,
  kas_isim,
  CASE kas_tip
    WHEN 1 THEN 'Çek Kasası'
    WHEN 2 THEN 'Karşılıksız Çek'
    WHEN 3 THEN 'Senet Kasası'
    WHEN 4 THEN 'Protestolu Senet'
  END AS tip_adi
FROM KASALAR
WHERE kas_tip IN (1, 2, 3, 4)
  AND kas_iptal = 0
```

## TypeScript Interface

```typescript
interface Kasa {
  kasGuid: string
  kasTip: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  kasFirmaNo: number
  kasKod: string
  kasIsim: string
  kasMuhKod?: string
  kasDovizCinsi: number
  kasBankakodu?: string
  kasNakakincelenmesi: boolean
  kasUfrsMuhKod?: string
  kasIptal: boolean
}

type KasaTipi =
  | "Nakit Kasası"
  | "Çek Kasası"
  | "Karşılıksız Çek Kasası"
  | "Senet Kasası"
  | "Protestolu Senet Kasası"
  | "Verilen Senet Kasası"
  | "Verilen Ödeme Emirleri Kasası"
  | "Müşteri Ödeme Sözleri Kasası"
```

## API Endpoint Örneği

```typescript
// app/api/kasalar/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tip = searchParams.get("tip")

  const result = await query(
    `
    SELECT 
      kas_Guid as kasGuid,
      kas_tip as kasTip,
      kas_kod as kasKod,
      kas_isim as kasIsim,
      kas_doviz_cinsi as kasDovizCinsi,
      kas_bankakodu as kasBankakodu
    FROM KASALAR
    WHERE kas_iptal = 0
      ${tip ? "AND kas_tip = @tip" : ""}
    ORDER BY kas_kod
  `,
    tip ? { tip: parseInt(tip) } : {}
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/kasa-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const KASA_TIPLERI: Record<number, string> = {
  0: "Nakit Kasası",
  1: "Çek Kasası",
  2: "Karşılıksız Çek",
  3: "Senet Kasası",
  4: "Protestolu Senet",
  5: "Verilen Senet",
  6: "Verilen Ödeme Emirleri",
  7: "Müşteri Ödeme Sözleri",
}

export function KasaSelect({ value, onChange, kasaTip }: Props) {
  const [kasalar, setKasalar] = useState<Kasa[]>([])

  useEffect(() => {
    const url =
      kasaTip !== undefined ? `/api/kasalar?tip=${kasaTip}` : "/api/kasalar"

    fetch(url)
      .then((r) => r.json())
      .then(setKasalar)
  }, [kasaTip])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Kasa Seçin" />
      </SelectTrigger>
      <SelectContent>
        {kasalar.map((k) => (
          <SelectItem key={k.kasGuid} value={k.kasKod}>
            {k.kasKod} - {k.kasIsim} ({KASA_TIPLERI[k.kasTip]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

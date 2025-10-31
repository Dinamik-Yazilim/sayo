# STOK_MARKALARI (Marka Kartları)

## Genel Bakış

Stok kartlarında kullanılan marka tanımlarını içerir. Basit ve minimal yapıdadır.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `mrk_Guid` - PRIMARY KEY (Uniqueidentifier)
- `mrk_DBCno`, `mrk_SpecRECno`, `mrk_iptal`, `mrk_fileid`
- `mrk_hidden`, `mrk_kilitli`, `mrk_degisti`, `mrk_checksum`
- `mrk_create_user`, `mrk_create_date`, `mrk_lastup_user`, `mrk_lastup_date`
- `mrk_special1`, `mrk_special2`, `mrk_special3`

### Tanım Alanları (16-17)

- `mrk_kod` - Marka kodu (UNIQUE, Nvarchar(25))
- `mrk_ismi` - Marka ismi (Nvarchar(40))

## İlişkiler

- **STOKLAR** ← KOD: `sto_marka_kodu` → `mrk_kod`

## Indexler

```sql
PRIMARY KEY: mrk_Guid
UNIQUE: mrk_kod
INDEX: mrk_ismi
```

## SQL Örnekleri

### 1. Marka Listesi

```sql
SELECT
  mrk_kod,
  mrk_ismi
FROM STOK_MARKALARI
WHERE mrk_iptal = 0
ORDER BY mrk_ismi
```

### 2. Marka Bazında Stok Sayısı

```sql
SELECT
  m.mrk_kod,
  m.mrk_ismi,
  COUNT(s.sto_kod) AS stok_adedi
FROM STOK_MARKALARI m
LEFT JOIN STOKLAR s ON m.mrk_kod = s.sto_marka_kodu
WHERE m.mrk_iptal = 0
GROUP BY m.mrk_kod, m.mrk_ismi
ORDER BY stok_adedi DESC
```

### 3. Kod ile Arama

```sql
SELECT *
FROM STOK_MARKALARI
WHERE mrk_kod = @kod
  AND mrk_iptal = 0
```

## TypeScript Interface

```typescript
interface StokMarka {
  mrkGuid: string
  mrkKod: string
  mrkIsmi: string
  mrkIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/stok-markalari/route.ts
import { query } from "@/lib/db"

export async function GET() {
  const result = await query(`
    SELECT 
      mrk_Guid as mrkGuid,
      mrk_kod as mrkKod,
      mrk_ismi as mrkIsmi
    FROM STOK_MARKALARI
    WHERE mrk_iptal = 0
    ORDER BY mrk_ismi
  `)
  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/marka-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MarkaSelect({ value, onChange }: Props) {
  const [markalar, setMarkalar] = useState<StokMarka[]>([])

  useEffect(() => {
    fetch("/api/stok-markalari")
      .then((r) => r.json())
      .then(setMarkalar)
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Marka Seçin" />
      </SelectTrigger>
      <SelectContent>
        {markalar.map((m) => (
          <SelectItem key={m.mrkGuid} value={m.mrkKod}>
            {m.mrkKod} - {m.mrkIsmi}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Notlar

- **18 alanlı** minimal tanım tablosu
- STOKLAR tablosunun `sto_marka_kodu` alanıyla ilişkili
- Basit kod-isim yapısı

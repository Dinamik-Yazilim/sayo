# ODEME_PLANLARI (Ödeme Planları)

## Genel Bakış

Satış ve alış işlemlerinde kullanılan ödeme planlarını tanımlar. Vade, iskonto ve taksit koşullarını içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `odp_Guid` - PRIMARY KEY (Uniqueidentifier)
- `odp_DBCno`, `odp_SpecRECno`, `odp_iptal`, `odp_fileid`
- `odp_hidden`, `odp_kilitli`, `odp_degisti`, `odp_checksum`
- `odp_create_user`, `odp_create_date`, `odp_lastup_user`, `odp_lastup_date`
- `odp_special1`, `odp_special2`, `odp_special3`

### Tanım Alanları (16-22)

- `odp_no` - Ödeme planı numarası (UNIQUE, Integer)
- `odp_kodu` - Ödeme planı kodu (Nvarchar(25))
- `odp_adi` - Ödeme planı ismi (Nvarchar(50))
- `odp_aratop` - Ara toplam formülü (Nvarchar(127))
- `odp_masraf` - Masraf formülü (Nvarchar(127))
- `odp_vergi` - Vergi formülü (Nvarchar(127))
- `odp_ortgun` - Ortalama vade gün sayısı (Integer)

## İlişkiler

- **STOK_CARI_ISKONTO_TANIMLARI** ← KOD: `isk_uygulama_odeme_plani` → `odp_no`
- **STOK_HAREKETLERI** ← KOD: `sth_odeme_plani` → `odp_no`
- **CARI_HESAP_HAREKETLERI** ← KOD: `cari_odeme_plani` → `odp_no`

## Indexler

```sql
PRIMARY KEY: odp_Guid
UNIQUE: odp_no
INDEX: odp_kodu
```

## SQL Örnekleri

### 1. Ödeme Planı Listesi

```sql
SELECT
  odp_no,
  odp_kodu,
  odp_adi,
  odp_ortgun
FROM ODEME_PLANLARI
WHERE odp_iptal = 0
ORDER BY odp_kodu
```

### 2. Koda Göre Ödeme Planı

```sql
SELECT *
FROM ODEME_PLANLARI
WHERE odp_kodu = 'PESIN'
  AND odp_iptal = 0
```

### 3. Ortalama Vadeye Göre Planlar

```sql
SELECT odp_kodu, odp_adi, odp_ortgun
FROM ODEME_PLANLARI
WHERE odp_ortgun > 0
  AND odp_iptal = 0
ORDER BY odp_ortgun
```

## TypeScript Interface

```typescript
interface OdemePlani {
  odpGuid: string
  odpNo: number
  odpKodu: string
  odpAdi: string
  odpAratop?: string
  odpMasraf?: string
  odpVergi?: string
  odpOrtgun: number
  odpIptal: boolean
  odpCreateDate: Date
  odpLastupDate: Date
}
```

## API Endpoint Örneği

```typescript
// app/api/odeme-planlari/route.ts
import { query } from "@/lib/db"

export async function GET() {
  const result = await query(`
    SELECT 
      odp_Guid as odpGuid,
      odp_no as odpNo,
      odp_kodu as odpKodu,
      odp_adi as odpAdi,
      odp_ortgun as odpOrtgun
    FROM ODEME_PLANLARI
    WHERE odp_iptal = 0
    ORDER BY odp_kodu
  `)
  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/odeme-plani-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OdemePlaniSelect({ value, onChange }: Props) {
  const [planlar, setPlanlar] = useState<OdemePlani[]>([])

  useEffect(() => {
    fetch("/api/odeme-planlari")
      .then((r) => r.json())
      .then(setPlanlar)
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Ödeme Planı Seçin" />
      </SelectTrigger>
      <SelectContent>
        {planlar.map((p) => (
          <SelectItem key={p.odpGuid} value={p.odpNo.toString()}>
            {p.odpKodu} - {p.odpAdi} ({p.odpOrtgun} gün)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

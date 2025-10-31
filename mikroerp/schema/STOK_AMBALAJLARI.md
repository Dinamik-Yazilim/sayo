# STOK_AMBALAJLARI (Ambalaj Kartları)

## Genel Bakış

Stok kartlarında kullanılan ambalaj tanımlarını içerir. Ambalaj miktarı ve dara bilgilerini tutar.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `amb_Guid` - PRIMARY KEY (Uniqueidentifier)
- `amb_DBCno`, `amb_SpecRECno`, `amb_iptal`, `amb_fileid`
- `amb_hidden`, `amb_kilitli`, `amb_degisti`, `amb_checksum`
- `amb_create_user`, `amb_create_date`, `amb_lastup_user`, `amb_lastup_date`
- `amb_special1`, `amb_special2`, `amb_special3`

### Tanım Alanları (16-19)

- `amb_kod` - Ambalaj kodu (UNIQUE, Nvarchar(25))
- `amb_ismi` - Ambalaj ismi (Nvarchar(40))
- `amb_miktar` - Ambalaj miktarı (Float)
- `amb_dara` - Ambalaj dara/fire (Float)

## İlişkiler

- **STOKLAR** ← KOD: `sto_ambalaj_kodu` → `amb_kod`
- **RAKIP_STOKLAR** ← KOD: `raks_ambalaj_kodu` → `amb_kod`

## Indexler

```sql
PRIMARY KEY: amb_Guid
UNIQUE: amb_kod
INDEX: amb_ismi
```

## SQL Örnekleri

### 1. Ambalaj Listesi

```sql
SELECT
  amb_kod,
  amb_ismi,
  amb_miktar,
  amb_dara
FROM STOK_AMBALAJLARI
WHERE amb_iptal = 0
ORDER BY amb_ismi
```

### 2. Ambalaj Kullanım Raporu

```sql
SELECT
  a.amb_kod,
  a.amb_ismi,
  COUNT(s.sto_kod) AS kullanim_adedi
FROM STOK_AMBALAJLARI a
LEFT JOIN STOKLAR s ON a.amb_kod = s.sto_ambalaj_kodu
WHERE a.amb_iptal = 0
GROUP BY a.amb_kod, a.amb_ismi
ORDER BY kullanim_adedi DESC
```

## TypeScript Interface

```typescript
interface StokAmbalaj {
  ambGuid: string
  ambKod: string
  ambIsmi: string
  ambMiktar?: number
  ambDara?: number
  ambIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/stok-ambalajlari/route.ts
import { query } from "@/lib/db"

export async function GET() {
  const result = await query(`
    SELECT 
      amb_Guid as ambGuid,
      amb_kod as ambKod,
      amb_ismi as ambIsmi,
      amb_miktar as ambMiktar,
      amb_dara as ambDara
    FROM STOK_AMBALAJLARI
    WHERE amb_iptal = 0
    ORDER BY amb_ismi
  `)
  return Response.json(result.recordset)
}
```

## Notlar

- **20 alanlı** basit tanım tablosu
- Ambalaj miktarı ve dara/fire hesaplaması
- STOKLAR ve RAKIP_STOKLAR ile ilişkili

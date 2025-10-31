# STOK_MUHASEBE_GRUPLARI (Stok Muhasebe Grup Kartları)

## Genel Bakış

Stokların muhasebe entegrasyonu için grup bazlı hesap kodlarını tanımlar. Alış, satış, maliyet ve UFRS hesaplarını içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `stmuh_Guid` - PRIMARY KEY (Uniqueidentifier)
- `stmuh_DBCno`, `stmuh_SpecRECno`, `stmuh_iptal`, `stmuh_fileid`
- `stmuh_hidden`, `stmuh_kilitli`, `stmuh_degisti`, `stmuh_checksum`
- `stmuh_create_user`, `stmuh_create_date`, `stmuh_lastup_user`, `stmuh_lastup_date`
- `stmuh_special1`, `stmuh_special2`, `stmuh_special3`

### Temel Bilgiler (16-17)

- `stmuh_kod` - Muhasebe grup kodu (UNIQUE, Nvarchar(25))
- `stmuh_ismi` - Muhasebe grup ismi (nvarchar_maxhesapisimno)

### Temel Muhasebe Kodları (18-36)

- `stmuh_muh_kod` - Stok muhasebe kodu
- `stmuh_iade_muh_kod` - Stok iade muhasebe kodu
- `stmuh_YurtIciSatMuhK` - Yurt içi satış
- `stmuh_SatIadeMuhKod` - Satış iade
- `stmuh_SatIskMuhKod` - Satış iskonto
- `stmuh_Al_IskMKod` - Alış iskonto
- `stmuh_SatMalMuhKod` - Satış maliyet
- `stmuh_YurtDisiSatMuh` - Yurt dışı satış
- `stmuh_ilavemasmuhkod` - İlave masraflar
- `stmuh_yatirimtesmuhkod` - Yatırım teşvik
- `stmuh_depsatmuhkod` - Depolar arası satış
- `stmuh_depsatmalmuhkod` - Depolar arası satış maliyeti
- `stmuh_bagortsatmuhkod` - Bağlı ortaklıklara satış
- `stmuh_bagortsatIadmuhkod` - Bağlı ortaklıklara satış iade
- `stmuh_bagortsatIskmuhkod` - Bağlı ortaklıklara satış iskonto
- `stmuh_satfiyfarksmuhkod` - Satış fiyat farkı
- `stmuh_yurtdisisatmalmuhkod` - Yurt dışı satış maliyeti
- `stmuh_bagortsatmalmuhkod` - Bağlı ortaklık satış maliyeti
- `stmuh_sifirbedsatmalmuhkod` - Sıfır bedelli satış maliyeti

### UFRS Fark Kodları (37-58)

Her temel muhasebe kodu için UFRS fark hesapları (22 alan):

- `stmuh_ufrsfark_kod` - UFRS fark
- `stmuh_iade_ufrsfark_kod` - İade UFRS fark
- `stmuh_yurticisat_ufrsfark_kod` - Yurt içi satış UFRS fark
- `stmuh_satiade_ufrsfark_kod` - Satış iade UFRS fark
- `stmuh_satisk_ufrsfark_kod` - Satış iskonto UFRS fark
- `stmuh_alisk_ufrsfark_kod` - Alış iskonto UFRS fark
- `stmuh_satmal_ufrsfark_kod` - Satış maliyeti UFRS fark
- `stmuh_yurtdisisat_ufrsfark_kod` - Yurt dışı satış UFRS fark
- `stmuh_ilavemas_ufrsfark_kod` - İlave masraflar UFRS fark
- `stmuh_yatirimtes_ufrsfark_kod` - Yatırım teşvik UFRS fark
- `stmuh_depsat_ufrsfark_kod` - Depolar arası satış UFRS fark
- `stmuh_depsatmal_ufrsfark_kod` - Depolar arası satış maliyeti UFRS fark
- `stmuh_bagortsat_ufrsfark_kod` - Bağlı ortaklıklara satış UFRS fark
- `stmuh_bagortsatiade_ufrsfark_kod` - Bağlı ortaklıklara satış iade UFRS fark
- `stmuh_bagortsatisk_ufrsfark_kod` - Bağlı ortaklıklara satış iskonto UFRS fark
- `stmuh_satfiyfark_ufrsfark_kod` - Satış fiyat farkı UFRS fark
- `stmuh_yurtdisisatmal_ufrsfark_kod` - Yurt dışı satış maliyeti UFRS fark
- `stmuh_bagortsatmal_ufrsfark_kod` - Bağlı ortaklıklara satış maliyeti UFRS fark
- `stmuh_sifirbedsatmal_ufrsfark_kod` - Sıfır bedelli satış maliyeti UFRS fark
- `stmuh_uretimmaliyet_ufrsfark_kod` - Üretim maliyeti UFRS fark
- `stmuh_uretimkapasite_ufrsfark_kod` - Üretim kapasite UFRS fark
- `stmuh_degerdusuklugu_ufrsfark_kod` - Değer düşüklüğü UFRS fark

## İlişkiler

- **STOKLAR** ← KOD: `sto_muh_grup_kodu` → `stmuh_kod`
- **MUHASEBE_HESAP_PLANI** ← KOD: Tüm `stmuh_*_kod` alanları → `muh_kod`

## Indexler

```sql
PRIMARY KEY: stmuh_Guid
UNIQUE: stmuh_kod
INDEX: stmuh_ismi
```

## SQL Örnekleri

### 1. Muhasebe Grup Listesi

```sql
SELECT
  stmuh_kod,
  stmuh_ismi,
  stmuh_muh_kod,
  stmuh_YurtIciSatMuhK,
  stmuh_SatMalMuhKod
FROM STOK_MUHASEBE_GRUPLARI
WHERE stmuh_iptal = 0
ORDER BY stmuh_kod
```

### 2. Detaylı Grup Bilgisi

```sql
SELECT
  stmuh_kod,
  stmuh_ismi,
  stmuh_muh_kod AS stok_hesap,
  stmuh_YurtIciSatMuhK AS satis_hesap,
  stmuh_SatMalMuhKod AS maliyet_hesap,
  stmuh_SatIskMuhKod AS iskonto_hesap
FROM STOK_MUHASEBE_GRUPLARI
WHERE stmuh_kod = @kod
  AND stmuh_iptal = 0
```

### 3. Grup Bazında Stok Sayısı

```sql
SELECT
  m.stmuh_kod,
  m.stmuh_ismi,
  COUNT(s.sto_kod) AS stok_adedi
FROM STOK_MUHASEBE_GRUPLARI m
LEFT JOIN STOKLAR s ON m.stmuh_kod = s.sto_muh_grup_kodu
WHERE m.stmuh_iptal = 0
GROUP BY m.stmuh_kod, m.stmuh_ismi
ORDER BY stok_adedi DESC
```

## TypeScript Interface

```typescript
interface StokMuhasebeGrubu {
  stmuhGuid: string
  stmuhKod: string
  stmuhIsmi: string
  // Temel muhasebe kodları
  stmuhMuhKod?: string
  stmuhIadeMuhKod?: string
  stmuhYurtIciSatMuhK?: string
  stmuhSatIadeMuhKod?: string
  stmuhSatIskMuhKod?: string
  stmuhAlIskMKod?: string
  stmuhSatMalMuhKod?: string
  stmuhYurtDisiSatMuh?: string
  stmuhIlavemasmuhkod?: string
  stmuhDepsatmuhkod?: string
  stmuhBagortsatmuhkod?: string
  // UFRS fark kodları
  stmuhUfrsfarkKod?: string
  stmuhYurtICisatUfrsfarkKod?: string
  stmuhSatmalUfrsfarkKod?: string
  // ... diğer UFRS kodları
  stmuhIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/stok-muhasebe-gruplari/route.ts
import { query } from "@/lib/db"

export async function GET() {
  const result = await query(`
    SELECT 
      stmuh_Guid as stmuhGuid,
      stmuh_kod as stmuhKod,
      stmuh_ismi as stmuhIsmi,
      stmuh_muh_kod as stmuhMuhKod,
      stmuh_YurtIciSatMuhK as stmuhYurtIciSatMuhK,
      stmuh_SatMalMuhKod as stmuhSatMalMuhKod
    FROM STOK_MUHASEBE_GRUPLARI
    WHERE stmuh_iptal = 0
    ORDER BY stmuh_kod
  `)
  return Response.json(result.recordset)
}

// Detaylı grup bilgisi
export async function POST(request: Request) {
  const { kod } = await request.json()

  const result = await query(
    `
    SELECT 
      stmuh_Guid as stmuhGuid,
      stmuh_kod as stmuhKod,
      stmuh_ismi as stmuhIsmi,
      stmuh_muh_kod as stokHesap,
      stmuh_YurtIciSatMuhK as satisHesap,
      stmuh_SatMalMuhKod as maliyetHesap,
      stmuh_SatIskMuhKod as iskontoHesap,
      stmuh_ufrsfark_kod as ufrsStokHesap,
      stmuh_yurticisat_ufrsfark_kod as ufrsSatisHesap
    FROM STOK_MUHASEBE_GRUPLARI
    WHERE stmuh_kod = @kod
      AND stmuh_iptal = 0
  `,
    { kod }
  )

  return Response.json(result.recordset[0])
}
```

## React Component Örneği

```typescript
// components/muhasebe-grup-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MuhasebeGrupSelect({ value, onChange }: Props) {
  const [gruplar, setGruplar] = useState<StokMuhasebeGrubu[]>([])

  useEffect(() => {
    fetch("/api/stok-muhasebe-gruplari")
      .then((r) => r.json())
      .then(setGruplar)
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Muhasebe Grubu Seçin" />
      </SelectTrigger>
      <SelectContent>
        {gruplar.map((g) => (
          <SelectItem key={g.stmuhGuid} value={g.stmuhKod}>
            {g.stmuhKod} - {g.stmuhIsmi}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Notlar

- **59 alanlı** kapsamlı muhasebe entegrasyon tablosu
- **19 Temel Hesap**: Alış, satış, maliyet, iskonto, iade, depolar arası vb.
- **22 UFRS Fark Hesabı**: Her temel hesap için UFRS karşılığı
- STOKLAR tablosunun `sto_muh_grup_kodu` alanıyla ilişkili
- Otomatik muhasebe fişi kesimi için kritik tablo
- Yurt içi/dışı, bağlı ortaklık, sıfır bedel gibi özel durumlar için ayrı hesaplar

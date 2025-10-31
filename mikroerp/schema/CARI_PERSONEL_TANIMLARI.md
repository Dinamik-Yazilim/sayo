# CARI_PERSONEL_TANIMLARI (Cari Personel Tanımları)

## Genel Bakış

Firma personelini tanımlar. Satıcı, satın almacı ve diğer personel tiplerini içerir. Prim, muhasebe ve kasiyer bilgilerini yönetir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `cari_per_Guid` - PRIMARY KEY (Uniqueidentifier)
- `cari_per_DBCno`, `cari_per_SpecRECno`, `cari_per_iptal`, `cari_per_fileid`
- `cari_per_hidden`, `cari_per_kilitli`, `cari_per_degisti`, `cari_per_checksum`
- `cari_per_create_user`, `cari_per_create_date`, `cari_per_lastup_user`, `cari_per_lastup_date`
- `cari_per_special1`, `cari_per_special2`, `cari_per_special3`

### Temel Bilgiler (16-20)

- `cari_per_kod` - Personel kodu (UNIQUE, Nvarchar(25))
- `cari_per_adi` - Personel adı (Nvarchar(50))
- `cari_per_soyadi` - Personel soyadı (Nvarchar(50))
- `cari_per_tip` - Personel tipi (0-2, Tinyint)
- `cari_per_doviz_cinsi` - Döviz cinsi (Tinyint)

### Muhasebe Kodları (21-25)

- `cari_per_muhkod0` - İş avansı muhasebe kodu (Nvarchar(40))
- `cari_per_muhkod1` - Bordro avansı muhasebe kodu (Nvarchar(40))
- `cari_per_muhkod2` - Maaş hesabı muhasebe kodu (Nvarchar(40))
- `cari_per_muhkod3` - Kısa vadeli borç muhasebe kodu (Nvarchar(40))
- `cari_per_muhkod4` - Uzun vadeli borç muhasebe kodu (Nvarchar(40))

### Banka Bilgileri (26-30)

- `cari_per_banka_tcmb_kod` - Banka TCMB kodu (Nvarchar(4))
- `cari_per_banka_tcmb_subekod` - Banka TCMB şube kodu (Nvarchar(8))
- `cari_per_banka_tcmb_ilkod` - Banka TCMB il kodu (Nvarchar(3))
- `cari_per_banka_hesapno` - Banka hesap no (Nvarchar(30))
- `cari_per_banka_swiftkodu` - Banka swift kodu (Nvarchar(25))

### Prim Bilgileri (31-43)

- `cari_per_prim_adet` - Prim adedi (Float)
- `cari_per_prim_yuzde` - Prim yüzdesi (Float)
- `cari_per_prim_carpani` - Prim çarpanı (Float)
- Basamaklı prim (5 seviye): Her biri için `cari_per_basmprimcirotav` ve `cari_per_basmprimyuz`

### Kasiyer Bilgileri (44-48, 52)

- `cari_per_kasiyerkodu` - Kasiyer kodu (Nvarchar(25))
- `cari_per_kasiyersifresi` - Kasiyer şifresi (Nvarchar(127))
- `cari_per_kasiyerAmiri` - Kasiyer amiri (Nvarchar(25))
- `cari_per_userno` - Kullanıcı no (Integer)
- `cari_per_depono` - Depo no (Integer)
- `cari_per_kasiyerfirmaid` - Kasiyer firma id (Nvarchar(15))

### İletişim ve Diğer (49-51, 53)

- `cari_per_cepno` - Cep telefonu (Nvarchar(15))
- `cari_per_mail` - E-posta (Nvarchar(50))
- `cari_takvim_kodu` - Takvim kodu (Nvarchar(4))
- `cari_per_KEP_adresi` - KEP adresi (Nvarchar(80))

## Enum Değerleri

### cari_per_tip

- 0: Satıcı Eleman
- 1: Satın Almacı
- 2: Diğer Eleman

## İlişkiler

- **STOK_HAREKETLERI** ← KOD: `sth_plasiyer_kodu` → `cari_per_kod`
- **CARI_HESAP_HAREKETLERI** ← KOD: `cari_plasiyer_kodu` → `cari_per_kod`
- **DEPOLAR** ← KOD: `cari_per_depono` → `dep_no`
- **MUHASEBE_HESAP_PLANI** ← KOD: `cari_per_muhkod0-4` → `muh_kod`

## Indexler

```sql
PRIMARY KEY: cari_per_Guid
UNIQUE: cari_per_kod
INDEX: (cari_per_adi, cari_per_soyadi)
INDEX: (cari_per_soyadi, cari_per_adi)
```

## SQL Örnekleri

### 1. Personel Listesi

```sql
SELECT
  cari_per_kod,
  cari_per_adi + ' ' + cari_per_soyadi AS tam_ad,
  CASE cari_per_tip
    WHEN 0 THEN 'Satıcı'
    WHEN 1 THEN 'Satın Almacı'
    WHEN 2 THEN 'Diğer'
  END AS tip_adi,
  cari_per_cepno,
  cari_per_mail
FROM CARI_PERSONEL_TANIMLARI
WHERE cari_per_iptal = 0
ORDER BY cari_per_soyadi, cari_per_adi
```

### 2. Satıcı Personel Listesi

```sql
SELECT
  cari_per_kod,
  cari_per_adi + ' ' + cari_per_soyadi AS tam_ad,
  cari_per_prim_yuzde,
  cari_per_prim_carpani
FROM CARI_PERSONEL_TANIMLARI
WHERE cari_per_tip = 0
  AND cari_per_iptal = 0
ORDER BY cari_per_kod
```

### 3. Kasiyer Listesi

```sql
SELECT
  cari_per_kod,
  cari_per_adi + ' ' + cari_per_soyadi AS tam_ad,
  cari_per_kasiyerkodu,
  cari_per_kasiyerAmiri,
  d.dep_adi AS depo_adi
FROM CARI_PERSONEL_TANIMLARI p
LEFT JOIN DEPOLAR d ON p.cari_per_depono = d.dep_no
WHERE cari_per_kasiyerkodu IS NOT NULL
  AND cari_per_iptal = 0
```

## TypeScript Interface

```typescript
interface CariPersonel {
  cariPerGuid: string
  cariPerKod: string
  cariPerAdi: string
  cariPerSoyadi: string
  cariPerTip: 0 | 1 | 2
  cariPerDovizCinsi: number
  // Muhasebe kodları
  cariPerMuhkod0?: string
  cariPerMuhkod1?: string
  cariPerMuhkod2?: string
  cariPerMuhkod3?: string
  cariPerMuhkod4?: string
  // Banka bilgileri
  cariPerBankaTcmbKod?: string
  cariPerBankaTcmbSubekod?: string
  cariPerBankaTcmbIlkod?: string
  cariPerBankaHesapno?: string
  cariPerBankaSwiftkodu?: string
  // Prim bilgileri
  cariPerPrimAdet?: number
  cariPerPrimYuzde?: number
  cariPerPrimCarpani?: number
  // Basamaklı prim (1-5)
  cariPerBasmprimcirotav1?: number
  cariPerBasmprimyuz1?: number
  // Kasiyer bilgileri
  cariPerKasiyerkodu?: string
  cariPerKasiyersifresi?: string
  cariPerKasiyerAmiri?: string
  cariPerUserno?: number
  cariPerDepono?: number
  cariPerKasiyerfirmaid?: string
  // İletişim
  cariPerCepno?: string
  cariPerMail?: string
  cariTakvimKodu?: string
  cariPerKEPAdresi?: string
  cariPerIptal: boolean
}

type PersonelTipi = "Satıcı Eleman" | "Satın Almacı" | "Diğer Eleman"
```

## API Endpoint Örneği

```typescript
// app/api/cari-personel/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tip = searchParams.get("tip")
  const kasiyerOnly = searchParams.get("kasiyer") === "true"

  const result = await query(
    `
    SELECT 
      p.cari_per_Guid as cariPerGuid,
      p.cari_per_kod as cariPerKod,
      p.cari_per_adi as cariPerAdi,
      p.cari_per_soyadi as cariPerSoyadi,
      p.cari_per_adi + ' ' + p.cari_per_soyadi as tamAd,
      p.cari_per_tip as cariPerTip,
      p.cari_per_cepno as cariPerCepno,
      p.cari_per_mail as cariPerMail,
      p.cari_per_kasiyerkodu as cariPerKasiyerkodu
    FROM CARI_PERSONEL_TANIMLARI p
    WHERE p.cari_per_iptal = 0
      ${tip ? "AND p.cari_per_tip = @tip" : ""}
      ${kasiyerOnly ? "AND p.cari_per_kasiyerkodu IS NOT NULL" : ""}
    ORDER BY p.cari_per_soyadi, p.cari_per_adi
  `,
    {
      tip: tip ? parseInt(tip) : undefined,
    }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/personel-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PERSONEL_TIPLERI: Record<number, string> = {
  0: "Satıcı",
  1: "Satın Almacı",
  2: "Diğer",
}

export function PersonelSelect({ value, onChange, tip }: Props) {
  const [personeller, setPersoneller] = useState<CariPersonel[]>([])

  useEffect(() => {
    const url =
      tip !== undefined ? `/api/cari-personel?tip=${tip}` : "/api/cari-personel"

    fetch(url)
      .then((r) => r.json())
      .then(setPersoneller)
  }, [tip])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Personel Seçin" />
      </SelectTrigger>
      <SelectContent>
        {personeller.map((p) => (
          <SelectItem key={p.cariPerGuid} value={p.cariPerKod}>
            {p.tamAd} - {PERSONEL_TIPLERI[p.cariPerTip]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

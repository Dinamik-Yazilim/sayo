# PROJELER (Proje Tanımları)

## Genel Bakış

Firma projelerini tanımlar. Müşteri bazlı proje yönetimi, planlama, performans takibi ve teminat bilgilerini içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `pro_Guid` - PRIMARY KEY (Uniqueidentifier)
- `pro_DBCno`, `pro_SpecRECno`, `pro_iptal`, `pro_fileid`
- `pro_hidden`, `pro_kilitli`, `pro_degisti`, `pro_checksum`
- `pro_create_user`, `pro_create_date`, `pro_lastup_user`, `pro_lastup_date`
- `pro_special1`, `pro_special2`, `pro_special3`

### Temel Bilgiler (16-26)

- `pro_kodu` - Proje kodu (UNIQUE, Nvarchar(25))
- `pro_adi` - Proje adı (Nvarchar(40))
- `pro_musterikodu` - Müşteri kodu (Nvarchar(25))
- `pro_sormerkodu` - Sorumluluk merkezi kodu (Nvarchar(25))
- `pro_bolgekodu` - Bölge kodu (Nvarchar(25))
- `pro_sektorkodu` - Sektör kodu (Nvarchar(25))
- `pro_grupkodu` - Grup kodu (Nvarchar(25))
- `pro_muh_kod_artikeli` - Muhasebe kod artikeli (Nvarchar(10))
- `pro_durumu` - Proje durumu (0-3, Tinyint)
- `pro_aciklama` - Açıklama (Nvarchar(50))
- `pro_ana_projekodu` - Ana proje kodu (Nvarchar(25))

### Planlama ve Gerçekleşme (27-34)

- `pro_planlanan_sure` - Planlanan süre (Integer)
- `pro_planlanan_bastarih` - Planlanan başlangıç tarihi (DateTime)
- `pro_planlanan_bittarih` - Planlanan bitiş tarihi (DateTime)
- `pro_gerceklesen_bastarih` - Gerçekleşen başlangıç tarihi (DateTime)
- `pro_gerceklesen_bittarih` - Gerçekleşen bitiş tarihi (DateTime)
- `pro_baslangic_gecikmesebep` - Başlangıç gecikme sebebi (Nvarchar(50))
- `pro_bitis_gecikmesebep` - Bitiş gecikme sebebi (Nvarchar(50))
- `pro_performans_orani` - Performans oranı (Float)

### Teminat ve Avans (35-40)

- `pro_teminat_sekli` - Teminat şekli (0:Yüzde, 1:Tutar)
- `pro_teminat_doviz_cinsi` - Teminat döviz cinsi (Tinyint)
- `pro_teminat` - Teminat tutarı/oranı (Float)
- `pro_isavansi_sekli` - İş avansı şekli (0:Yüzde, 1:Tutar)
- `pro_isavansi_doviz_cinsi` - İş avansı döviz cinsi (Tinyint)
- `pro_isavansi` - İş avansı tutarı/oranı (Float)

## Enum Değerleri

### pro_durumu

- 0: Teklif Verildi
- 1: Kaybedildi
- 2: Tamamlandı
- 3: İptal Edildi

### pro_teminat_sekli / pro_isavansi_sekli

- 0: Yüzde
- 1: Tutar

## İlişkiler

- **CARI_HESAPLAR** ← KOD: `pro_musterikodu` → `cari_kod`
- **SORUMLULUK_MERKEZLERI** ← KOD: `pro_sormerkodu` → `som_kod`
- **PROJELER** (Ana Proje) ← KOD: `pro_ana_projekodu` → `pro_kodu`
- **STOK_HAREKETLERI** ← KOD: `sth_proje_kodu` → `pro_kodu`
- **CARI_HESAP_HAREKETLERI** ← KOD: `cari_proje_kodu` → `pro_kodu`

## Indexler

```sql
PRIMARY KEY: pro_Guid
UNIQUE: pro_kodu
INDEX: pro_adi
```

## SQL Örnekleri

### 1. Aktif Proje Listesi

```sql
SELECT
  p.pro_kodu,
  p.pro_adi,
  c.cari_unvan1 AS musteri,
  p.pro_durumu,
  p.pro_planlanan_bastarih,
  p.pro_planlanan_bittarih
FROM PROJELER p
LEFT JOIN CARI_HESAPLAR c ON p.pro_musterikodu = c.cari_kod
WHERE p.pro_iptal = 0
  AND p.pro_durumu IN (0, 2)
ORDER BY p.pro_kodu
```

### 2. Gecikmeli Projeler

```sql
SELECT
  pro_kodu,
  pro_adi,
  pro_planlanan_bittarih,
  pro_gerceklesen_bittarih,
  DATEDIFF(day, pro_planlanan_bittarih, ISNULL(pro_gerceklesen_bittarih, GETDATE())) AS gecikme_gun
FROM PROJELER
WHERE pro_iptal = 0
  AND (
    pro_gerceklesen_bittarih > pro_planlanan_bittarih
    OR (pro_gerceklesen_bittarih IS NULL AND GETDATE() > pro_planlanan_bittarih)
  )
```

### 3. Proje Performans Raporu

```sql
SELECT
  p.pro_kodu,
  p.pro_adi,
  p.pro_performans_orani,
  p.pro_teminat,
  p.pro_isavansi,
  CASE p.pro_durumu
    WHEN 0 THEN 'Teklif'
    WHEN 1 THEN 'Kaybedildi'
    WHEN 2 THEN 'Tamamlandı'
    WHEN 3 THEN 'İptal'
  END AS durum
FROM PROJELER p
WHERE p.pro_iptal = 0
ORDER BY p.pro_performans_orani DESC
```

## TypeScript Interface

```typescript
interface Proje {
  proGuid: string
  proKodu: string
  proAdi: string
  proMusterikodu?: string
  proSormerkodu?: string
  proBolgekodu?: string
  proSektorkodu?: string
  proGrupkodu?: string
  proMuhKodArtikeli?: string
  proDurumu: 0 | 1 | 2 | 3
  proAciklama?: string
  proAnaProjekodu?: string
  proPlanlananSure?: number
  proPlanlananBasTarih?: Date
  proPlanlananBitTarih?: Date
  proGerceklesenBasTarih?: Date
  proGerceklesenBitTarih?: Date
  proBaslangicGecikmeSebep?: string
  proBitisGecikmeSebep?: string
  proPerformansOrani?: number
  proTeminatSekli?: 0 | 1
  proTeminatDovizCinsi?: number
  proTeminat?: number
  proIsavansiSekli?: 0 | 1
  proIsavansiDovizCinsi?: number
  proIsavansi?: number
  proIptal: boolean
}

type ProjeDurumu =
  | "Teklif Verildi"
  | "Kaybedildi"
  | "Tamamlandı"
  | "İptal Edildi"
```

## API Endpoint Örneği

```typescript
// app/api/projeler/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const durum = searchParams.get("durum")
  const musteriKodu = searchParams.get("musteri")

  const result = await query(
    `
    SELECT 
      p.pro_Guid as proGuid,
      p.pro_kodu as proKodu,
      p.pro_adi as proAdi,
      p.pro_musterikodu as proMusterikodu,
      c.cari_unvan1 as musteriAdi,
      p.pro_durumu as proDurumu,
      p.pro_planlanan_bastarih as proPlanlananBasTarih,
      p.pro_planlanan_bittarih as proPlanlananBitTarih,
      p.pro_performans_orani as proPerformansOrani
    FROM PROJELER p
    LEFT JOIN CARI_HESAPLAR c ON p.pro_musterikodu = c.cari_kod
    WHERE p.pro_iptal = 0
      ${durum ? "AND p.pro_durumu = @durum" : ""}
      ${musteriKodu ? "AND p.pro_musterikodu = @musteriKodu" : ""}
    ORDER BY p.pro_kodu
  `,
    {
      durum: durum ? parseInt(durum) : undefined,
      musteriKodu,
    }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/proje-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PROJE_DURUMLARI: Record<number, string> = {
  0: "Teklif",
  1: "Kaybedildi",
  2: "Tamamlandı",
  3: "İptal",
}

export function ProjeSelect({ value, onChange, musteriKodu, durum }: Props) {
  const [projeler, setProjeler] = useState<Proje[]>([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (musteriKodu) params.append("musteri", musteriKodu)
    if (durum !== undefined) params.append("durum", durum.toString())

    fetch(`/api/projeler?${params}`)
      .then((r) => r.json())
      .then(setProjeler)
  }, [musteriKodu, durum])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Proje Seçin" />
      </SelectTrigger>
      <SelectContent>
        {projeler.map((p) => (
          <SelectItem key={p.proGuid} value={p.proKodu}>
            {p.proKodu} - {p.proAdi} ({PROJE_DURUMLARI[p.proDurumu]})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

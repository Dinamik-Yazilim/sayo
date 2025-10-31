# STOK_SATIS_FIYAT_LISTE_TANIMLARI (Satış Fiyat Listesi Tanımları)

## Genel Bakış

Farklı satış fiyat listelerini tanımlar. Formül bazlı fiyatlama, ödeme planı, döviz ve kampanya uygulamaları içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `sfl_Guid` - PRIMARY KEY (Uniqueidentifier)
- `sfl_DBCno`, `sfl_SpecRECno`, `sfl_iptal`, `sfl_fileid`
- `sfl_hidden`, `sfl_kilitli`, `sfl_degisti`, `sfl_checksum`
- `sfl_create_user`, `sfl_create_date`, `sfl_lastup_user`, `sfl_lastup_date`
- `sfl_special1`, `sfl_special2`, `sfl_special3`

### Temel Bilgiler (16-17)

- `sfl_sirano` - Sıra no (UNIQUE, Integer)
- `sfl_aciklama` - Açıklama (Nvarchar(50))

### Fiyat Uygulaması (18-19)

- `sfl_fiyatuygulama` - Fiyat uygulaması (0:Listeden, 1:Formülden)
- `sfl_fiyatformul` - Formüllü fiyat (Nvarchar(50))

### Ödeme Planı (20-22)

- `sfl_odepluygulama` - Ödeme planı uygulaması (0-3)
- `sfl_odeplformul` - Formüllü ödeme planı (Nvarchar(50))
- `sfl_sabit_odeme_plani` - Sabit ödeme planı (Integer)

### Vergi ve Tarih (23-26)

- `sfl_kdvdahil` - KDV dahil mi? (Bit)
- `sfl_ilktarih` - İlk tarih (DateTime)
- `sfl_sontarih` - Son tarih (DateTime)
- `sfl_yerineuygulanacakfiyat` - Yerine uygulanacak fiyat (Integer)

### Kur ve Döviz (27-29, 32)

- `sfl_kurhesaplamasekli` - Kur hesaplama şekli (Tinyint)
- `sfl_doviz_uygulama` - Döviz uygulaması (0-2)
- `sfl_sabit_doviz` - Sabit döviz (Tinyint)
- `sfl_sabit_kur` - Sabit kur (Float)

### İskonto (30-31)

- `sfl_iskonto_uygulama` - İskonto uygulaması (0-2)
- `sfl_sabit_iskonto` - Sabit iskonto (Nvarchar(4))

### Kampanya (33-36)

- `sfl_kampanya_uygulama` - Kampanya uygulaması (0-2)
- `sfl_sabit_kampanya` - Sabit kampanya (Nvarchar(4))
- `sfl_kampanya_vade_gozardi` - Kampanya vadesi gözardı edilsin mi? (Bit)
- `sfl_kampanya_iskonto_gozardi` - Kampanya iskontosu gözardı edilsin mi? (Bit)

### Diğer Vergiler (37-38)

- `sfl_otvdahil` - ÖTV dahil mi? (Bit)
- `sfl_oivdahil` - Özel iletişim vergisi dahil mi? (Bit)

## Enum Değerleri

### sfl_fiyatuygulama

- 0: Listeden
- 1: Formülden

### sfl_odepluygulama

- 0: Listeden
- 1: Formülden
- 2: Formüldeki İlk Fiyattan
- 3: Sabit

### sfl_doviz_uygulama / sfl_iskonto_uygulama / sfl_kampanya_uygulama

- 0: Formüldeki İlk Fiyattan
- 1: Listeden
- 2: Sabit

## İlişkiler

- **ODEME_PLANLARI** ← KOD: `sfl_sabit_odeme_plani` → `odp_no`
- **STOK_SATIS_FIYAT_LISTELERI** ← KOD: `sfl_sirano` → `sfiyat_listesirano`
- **CARI_HESAPLAR** ← KOD: `cari_fiyat_liste_no` → `sfl_sirano`

## Indexler

```sql
PRIMARY KEY: sfl_Guid
UNIQUE: sfl_sirano
INDEX: sfl_aciklama
```

## SQL Örnekleri

### 1. Fiyat Listesi Tanımları

```sql
SELECT
  sfl_sirano,
  sfl_aciklama,
  CASE sfl_fiyatuygulama
    WHEN 0 THEN 'Listeden'
    WHEN 1 THEN 'Formülden'
  END AS fiyat_uygulama,
  sfl_kdvdahil,
  sfl_ilktarih,
  sfl_sontarih
FROM STOK_SATIS_FIYAT_LISTE_TANIMLARI
WHERE sfl_iptal = 0
ORDER BY sfl_sirano
```

### 2. Aktif Fiyat Listeleri

```sql
SELECT
  sfl_sirano,
  sfl_aciklama,
  sfl_fiyatformul,
  sfl_sabit_odeme_plani
FROM STOK_SATIS_FIYAT_LISTE_TANIMLARI
WHERE sfl_iptal = 0
  AND GETDATE() BETWEEN sfl_ilktarih AND sfl_sontarih
ORDER BY sfl_sirano
```

### 3. Formül Bazlı Fiyat Listeleri

```sql
SELECT
  sfl_sirano,
  sfl_aciklama,
  sfl_fiyatformul,
  sfl_odeplformul
FROM STOK_SATIS_FIYAT_LISTE_TANIMLARI
WHERE sfl_fiyatuygulama = 1
  AND sfl_iptal = 0
```

## TypeScript Interface

```typescript
interface SatisFiyatListeTanimi {
  sflGuid: string
  sflSirano: number
  sflAciklama: string
  sflFiyatuygulama: 0 | 1
  sflFiyatformul?: string
  sflOdepluygulama: 0 | 1 | 2 | 3
  sflOdeplformul?: string
  sflSabitOdemePlani?: number
  sflKdvdahil: boolean
  sflIlktarih: Date
  sflSontarih: Date
  sflYerineuygulanacakfiyat?: number
  sflKurhesaplamasekli: number
  sflDovizUygulama: 0 | 1 | 2
  sflSabitDoviz?: number
  sflIskontoUygulama: 0 | 1 | 2
  sflSabitIskonto?: string
  sflSabitKur?: number
  sflKampanyaUygulama: 0 | 1 | 2
  sflSabitKampanya?: string
  sflKampanyaVadeGozardi: boolean
  sflKampanyaIskontoGozardi: boolean
  sflOtvdahil: boolean
  sflOivdahil: boolean
  sflIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/satis-fiyat-liste-tanimlari/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const aktifOnly = searchParams.get("aktif") === "true"

  const result = await query(`
    SELECT 
      sfl_Guid as sflGuid,
      sfl_sirano as sflSirano,
      sfl_aciklama as sflAciklama,
      sfl_fiyatuygulama as sflFiyatuygulama,
      sfl_fiyatformul as sflFiyatformul,
      sfl_kdvdahil as sflKdvdahil,
      sfl_ilktarih as sflIlktarih,
      sfl_sontarih as sflSontarih
    FROM STOK_SATIS_FIYAT_LISTE_TANIMLARI
    WHERE sfl_iptal = 0
      ${aktifOnly ? "AND GETDATE() BETWEEN sfl_ilktarih AND sfl_sontarih" : ""}
    ORDER BY sfl_sirano
  `)

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/fiyat-listesi-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FiyatListesiSelect({
  value,
  onChange,
  aktifOnly = true,
}: Props) {
  const [listeler, setListeler] = useState<SatisFiyatListeTanimi[]>([])

  useEffect(() => {
    const url = aktifOnly
      ? "/api/satis-fiyat-liste-tanimlari?aktif=true"
      : "/api/satis-fiyat-liste-tanimlari"

    fetch(url)
      .then((r) => r.json())
      .then(setListeler)
  }, [aktifOnly])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Fiyat Listesi Seçin" />
      </SelectTrigger>
      <SelectContent>
        {listeler.map((l) => (
          <SelectItem key={l.sflGuid} value={l.sflSirano.toString()}>
            {l.sflSirano} - {l.sflAciklama}
            {l.sflKdvdahil && " (KDV Dahil)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Notlar

- **39 alanlı** esnek fiyat listesi tanım tablosu
- **Formül Desteği**: Dinamik fiyat hesaplama
- **Çoklu Uygulama Modu**: Liste, formül, sabit değer
- Tarih aralığı ile geçerlilik kontrolü
- KDV, ÖTV, ÖİV dahil/hariç seçenekleri
- Kampanya ve iskonto entegrasyonu

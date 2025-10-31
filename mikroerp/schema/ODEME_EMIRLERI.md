# ODEME_EMIRLERI (Senet Çek Kartları)

## Genel Bakış

Müşteri/firma çek, senet, havale, kredi kartı ve teminat mektuplarını tanımlar. Portföy yönetimi ve takip bilgilerini içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `sck_Guid` - PRIMARY KEY (Uniqueidentifier)
- `sck_DBCno`, `sck_SpecRECno`, `sck_iptal`, `sck_fileid`
- `sck_hidden`, `sck_kilitli`, `sck_degisti`, `sck_checksum`
- `sck_create_user`, `sck_create_date`, `sck_lastup_user`, `sck_lastup_date`
- `sck_special1`, `sck_special2`, `sck_special3`

### Temel Bilgiler (16-25)

- `sck_firmano` - Firma no (Integer)
- `sck_subeno` - Şube no (Integer)
- `sck_tip` - Senet/çek tipi (0-13, Tinyint)
- `sck_refno` - Referans no (UNIQUE, Nvarchar(25))
- `sck_bankano` - Banka no (Nvarchar(25))
- `sck_borclu` - Borçlu adı (Nvarchar(50))
- `sck_vdaire_no` - Vergi daire no (Nvarchar(40))
- `sck_vade` - Vade tarihi (DateTime)
- `sck_tutar` - Tutar (Float)
- `sck_doviz` - Döviz cinsi (Tinyint)

### Ödeme ve Değerleme (26-27)

- `sck_odenen` - Ödenen miktar (Float)
- `sck_degerleme_islendi` - Değerleme işlendi mi? (0-1, Tinyint)

### Banka ve Borçlu Bilgileri (28-33)

- `sck_banka_adres1` - Banka adresi (Nvarchar(50))
- `sck_sube_adres2` - Şube adresi (Nvarchar(50))
- `sck_borclu_tel` - Borçlu telefon (Nvarchar(15))
- `sck_hesapno_sehir` - Hesap no/Şehir (Nvarchar(30))
- `sck_no` - Senet/çek no (Nvarchar(25))
- `sck_duzen_tarih` - Düzenlenme tarihi (DateTime)

### Sahip Bilgileri (34-36)

- `sck_sahip_cari_cins` - Sahip cari cinsi (0-13, Tinyint)
- `sck_sahip_cari_kodu` - Sahip cari kodu (Nvarchar(25))
- `sck_sahip_cari_grupno` - Sahip grup no (Tinyint)

### Nerede Bilgileri (37-39)

- `sck_nerede_cari_cins` - Nerede cari cinsi (0-13, Tinyint)
- `sck_nerede_cari_kodu` - Nerede cari kodu (Nvarchar(25))
- `sck_nerede_cari_grupno` - Nerede grup no (Tinyint)

### Hareket Bilgileri (40-45)

- `sck_ilk_hareket_tarihi` - İlk hareket tarihi (DateTime)
- `sck_ilk_evrak_seri` - İlk evrak seri (evrakseri_str)
- `sck_ilk_evrak_sira_no` - İlk evrak sıra no (Integer)
- `sck_ilk_evrak_satir_no` - İlk evrak satır no (Integer)
- `sck_son_hareket_tarihi` - Son hareket tarihi (DateTime)
- `sck_doviz_kur` - Döviz kuru (Float)

### Pozisyon ve Diğer (46-54)

- `sck_sonpoz` - Son pozisyon (0-10, Tinyint)
- `sck_imza` - İmza sahibi (0-1, Tinyint)
- `sck_srmmrk` - Sorumluluk merkezi (Nvarchar(25))
- `sck_kesideyeri` - Keşide yeri (Nvarchar(14))
- `Sck_TCMB_Banka_kodu` - TCMB banka kodu (Nvarchar(4))
- `Sck_TCMB_Sube_kodu` - TCMB şube kodu (Nvarchar(8))
- `Sck_TCMB_İL_kodu` - TCMB il kodu (Nvarchar(3))
- `SckTasra_fl` - Taşra mı? (Bit)
- `sck_projekodu` - Proje kodu (Nvarchar(25))

### Masraf ve Komisyon (55-64)

- `sck_masraf1`, `sck_masraf1_isleme` - Masraf 1 ve işleme şekli
- `sck_masraf2`, `sck_masraf2_isleme` - Masraf 2 ve işleme şekli
- `sck_odul_katkisi_tutari`, `sck_odul_katkisi_tutari_islendi_fl`
- `sck_servis_komisyon_tutari`, `sck_servis_komisyon_tutari_islendi_fl`
- `sck_erken_odeme_faiz_tutari`, `sck_erken_odeme_faiz_tutari_islendi_fl`

### Kredi Kartı Bilgileri (65-70)

- `sck_kredi_karti_tipi` - Kredi kartı tipi (0-2, Tinyint)
- `sck_taksit_sayisi` - Taksit sayısı (Smallint)
- `sck_kacinci_taksit` - Kaçıncı taksit (Smallint)
- `sck_uye_isyeri_no` - Üye işyeri no (Nvarchar(25))
- `sck_kredi_karti_no` - Kredi kartı no (Nvarchar(16))
- `sck_provizyon_kodu` - Provizyon kodu (Nvarchar(10))

## Enum Değerleri

### sck_tip

- 0: Müşteri Çeki
- 1: Müşteri Senedi
- 2: Kendi Çekimiz
- 3: Kendi Senedimiz
- 4: Müşteri Havale Sözü
- 5: Müşteri Ödeme Sözü
- 6: Müşteri Kredi Kartı
- 7: Kendi Havale Emrimiz
- 8: Kendi Ödeme Emrimiz
- 9: Kendi Kredi Kartımız
- 10: Müşteri Teminat Mektubu
- 11: Firma Teminat Mektubu
- 12: Depozito Çeki
- 13: Depozito Senedi

### sck_sonpoz

- 0: Portföyde
- 1: Ciro
- 2: Tahsilde
- 3: Teminatta
- 4: İade Edilen
- 5: Diğer3
- 6: Ödenmedi Portföyde
- 7: Ödenmedi İade
- 8: İcrada
- 9: Kısmen Ödendi
- 10: Ödendi

### sck_sahip_cari_cins / sck_nerede_cari_cins

- 0: Carimiz
- 1: Cari Personelimiz
- 2: Bankamız
- 3: Hizmetimiz
- 4: Kasamız
- 5: Giderimiz
- 6: Muhasebe Hesabımız
- 7: Personelimiz
- 8: Demirbaşımız
- 9: İthalat Dosyamız
- 10: Finansal Sözleşmemiz
- 11: Kredi Sözleşmemiz
- 12: Dönemsel Hizmetimiz
- 13: Kredi Kartımız

### sck_imza

- 0: Kendisi
- 1: Müşterisi

### sck_kredi_karti_tipi

- 0: Kendi Kredi Kartı
- 1: Başka Banka Kredi Kartı
- 2: Bonus Puan Kullanımı

## İlişkiler

- **BANKALAR** ← KOD: `sck_bankano` → `ban_kod`
- **CARI_HESAPLAR** ← KOD: `sck_sahip_cari_kodu` → `cari_kod`
- **SORUMLULUK_MERKEZLERI** ← KOD: `sck_srmmrk` → `som_kod`
- **PROJELER** ← KOD: `sck_projekodu` → `pro_kodu`
- **CEKSENET_HAREKETLERI** ← KOD: `cns_sck_refno` → `sck_refno`

## Indexler

```sql
PRIMARY KEY: sck_Guid
UNIQUE: (sck_tip, sck_refno)
INDEX: (sck_tip, sck_sonpoz, sck_vade)
INDEX: sck_vade
INDEX: (sck_tip, sck_sahip_cari_cins, sck_sahip_cari_kodu, sck_sonpoz, sck_vade)
INDEX: (Sck_TCMB_Banka_kodu, Sck_TCMB_Sube_kodu, sck_no)
INDEX: sck_srmmrk
INDEX: (sck_sahip_cari_cins, sck_sahip_cari_kodu, sck_vade)
```

## SQL Örnekleri

### 1. Portföydeki Çekler

```sql
SELECT
  sck_refno,
  sck_no,
  sck_borclu,
  sck_tutar,
  sck_vade,
  sck_doviz
FROM ODEME_EMIRLERI
WHERE sck_tip IN (0, 2)
  AND sck_sonpoz = 0
  AND sck_iptal = 0
ORDER BY sck_vade
```

### 2. Vadesi Gelen Çek/Senetler

```sql
SELECT
  CASE sck_tip
    WHEN 0 THEN 'Müşteri Çeki'
    WHEN 1 THEN 'Müşteri Senedi'
    WHEN 2 THEN 'Kendi Çekimiz'
    WHEN 3 THEN 'Kendi Senedimiz'
  END AS tip_adi,
  sck_refno,
  sck_borclu,
  sck_tutar,
  sck_vade,
  DATEDIFF(day, GETDATE(), sck_vade) AS kalan_gun
FROM ODEME_EMIRLERI
WHERE sck_vade BETWEEN GETDATE() AND DATEADD(day, 30, GETDATE())
  AND sck_sonpoz IN (0, 6)
  AND sck_iptal = 0
ORDER BY sck_vade
```

### 3. Müşteri Bazında Çek/Senet Raporu

```sql
SELECT
  c.cari_kod,
  c.cari_unvan1,
  COUNT(*) AS adet,
  SUM(sck_tutar) AS toplam_tutar,
  MIN(sck_vade) AS en_yakin_vade
FROM ODEME_EMIRLERI o
INNER JOIN CARI_HESAPLAR c ON o.sck_sahip_cari_kodu = c.cari_kod
WHERE o.sck_sahip_cari_cins = 0
  AND o.sck_sonpoz IN (0, 2)
  AND o.sck_iptal = 0
GROUP BY c.cari_kod, c.cari_unvan1
ORDER BY toplam_tutar DESC
```

## TypeScript Interface

```typescript
interface OdemeEmri {
  sckGuid: string
  sckFirmano: number
  sckSubeno: number
  sckTip: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
  sckRefno: string
  sckBankano?: string
  sckBorclu: string
  sckVdaireNo?: string
  sckVade: Date
  sckTutar: number
  sckDoviz: number
  sckOdenen?: number
  sckDegerlemeIslendi: 0 | 1
  sckNo?: string
  sckDuzenTarih?: Date
  sckSahipCariCins: number
  sckSahipCariKodu?: string
  sckNeredeCariCins?: number
  sckNeredeCariKodu?: string
  sckSonpoz: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  sckImza: 0 | 1
  sckSrmmrk?: string
  sckProjekodu?: string
  sckKrediKartiTipi?: 0 | 1 | 2
  sckTaksitSayisi?: number
  sckKacinciTaksit?: number
  sckIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/odeme-emirleri/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tip = searchParams.get("tip")
  const pozisyon = searchParams.get("pozisyon")
  const cariKod = searchParams.get("cari_kod")

  const result = await query(
    `
    SELECT 
      o.sck_Guid as sckGuid,
      o.sck_tip as sckTip,
      o.sck_refno as sckRefno,
      o.sck_no as sckNo,
      o.sck_borclu as sckBorclu,
      o.sck_tutar as sckTutar,
      o.sck_doviz as sckDoviz,
      o.sck_vade as sckVade,
      o.sck_sonpoz as sckSonpoz,
      c.cari_unvan1 as sahipAdi
    FROM ODEME_EMIRLERI o
    LEFT JOIN CARI_HESAPLAR c 
      ON o.sck_sahip_cari_kodu = c.cari_kod 
      AND o.sck_sahip_cari_cins = 0
    WHERE o.sck_iptal = 0
      ${tip ? "AND o.sck_tip = @tip" : ""}
      ${pozisyon ? "AND o.sck_sonpoz = @pozisyon" : ""}
      ${cariKod ? "AND o.sck_sahip_cari_kodu = @cariKod" : ""}
    ORDER BY o.sck_vade
  `,
    {
      tip: tip ? parseInt(tip) : undefined,
      pozisyon: pozisyon ? parseInt(pozisyon) : undefined,
      cariKod,
    }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/odeme-emri-list.tsx
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const ODEME_TIP: Record<number, string> = {
  0: "Müşteri Çeki",
  1: "Müşteri Senedi",
  2: "Kendi Çekimiz",
  3: "Kendi Senedimiz",
  4: "Havale Sözü",
  6: "Kredi Kartı",
}

const POZISYON: Record<number, { label: string; variant: any }> = {
  0: { label: "Portföyde", variant: "default" },
  2: { label: "Tahsilde", variant: "secondary" },
  6: { label: "Ödenmedi", variant: "destructive" },
  10: { label: "Ödendi", variant: "success" },
}

export function OdemeEmriList({ emirler }: { emirler: OdemeEmri[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ref No</TableHead>
          <TableHead>Tip</TableHead>
          <TableHead>Borçlu</TableHead>
          <TableHead>Tutar</TableHead>
          <TableHead>Vade</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emirler.map((e) => (
          <TableRow key={e.sckGuid}>
            <TableCell className="font-mono">{e.sckRefno}</TableCell>
            <TableCell>{ODEME_TIP[e.sckTip]}</TableCell>
            <TableCell>{e.sckBorclu}</TableCell>
            <TableCell className="text-right font-medium">
              {e.sckTutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell>
              {new Date(e.sckVade).toLocaleDateString("tr-TR")}
            </TableCell>
            <TableCell>
              <Badge variant={POZISYON[e.sckSonpoz]?.variant}>
                {POZISYON[e.sckSonpoz]?.label}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

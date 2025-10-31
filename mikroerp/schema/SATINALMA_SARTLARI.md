# SATINALMA_SARTLARI (Satın Alma Şartları)

## Genel Bakış

Tedarikçi bazında stok alım sözleşmelerini tanımlar. Fiyat, iskonto, masraf, teslim süresi ve ödeme planı bilgilerini içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `sas_Guid` - PRIMARY KEY (Uniqueidentifier)
- `sas_DBCno`, `sas_SpecRECno`, `sas_iptal`, `sas_fileid`
- `sas_hidden`, `sas_kilitli`, `sas_degisti`, `sas_checksum`
- `sas_create_user`, `sas_create_date`, `sas_lastup_user`, `sas_lastup_date`
- `sas_special1`, `sas_special2`, `sas_special3`

### Temel Bilgiler (16-27)

- `sas_stok_kod` - Stok kodu (Nvarchar(25))
- `sas_cari_kod` - Tedarikçi kodu (Nvarchar(25))
- `sas_evrak_no_seri` - Sözleşme seri no (evrakseri_str)
- `sas_evrak_no_sira` - Sözleşme sıra no (Integer)
- `sas_evrak_tarih` - Evrak tarihi (DateTime)
- `sas_satir_no` - Satır no (Integer)
- `sas_belge_no` - Belge no (belgeno_str)
- `sas_belge_tarih` - Belge tarihi (DateTime)
- `sas_asgari_miktar` - Asgari miktar (Float)
- `sas_teslim_sure` - Teslimat süresi (Smallint)
- `sas_basla_tarih` - Başlangıç tarihi (DateTime)
- `sas_bitis_tarih` - Bitiş tarihi (DateTime)

### Fiyat Bilgileri (28, 100-104)

- `sas_brut_fiyat` - Brüt fiyat (Float)
- `sas_net_alis_kdvli` - KDV dahil net alış fiyatı (Float)
- `sas_kar_oran` - Kar oranı (Float)
- `sas_net_satis_kdvli` - KDV dahil net satış fiyatı (Float)
- `sas_satis_fiyat` - Satış fiyatı (Float)
- `sas_doviz_cinsi` - Döviz cinsi (Tinyint)

### İskonto Detayları (29-70)

6 iskonto satırı: Her biri için `sas_isk_acik`, `sas_isk_uyg`, `sas_isk_durum`, `sas_isk_vergi`, `sas_isk_kriter`, `sas_isk_yuzde`, `sas_isk_miktar`

### Masraf Detayları (71-98)

4 masraf satırı: Her biri için `sas_mas_acik`, `sas_mas_uyg`, `sas_mas_durum`, `sas_mas_vergi`, `sas_mas_kriter`, `sas_mas_yuzde`, `sas_mas_miktar`

### Diğer Bilgiler (99, 105-112)

- `sas_odeme_plan` - Ödeme planı no (Integer)
- `sas_evrtipi` - Evrak tipi (0-2, Tinyint)
- `sas_aciklama` - Açıklama (Nvarchar(40))
- `sas_depo_no` - Depo no (Integer)
- `sas_maliyette_kullan_fl` - Maliyette kullan (Bit)
- `sas_ilave_maliyet_tutari` - İlave maliyet tutarı (Float)
- `sas_ilave_maliyet_yuzdesi` - İlave maliyet yüzdesi (Float)
- `Sas_Kesinlesti_fl` - Proforma kesinleşti mi? (Bit)
- `Sas_ProSas_uid` - Proforma satın alma şartı uid (Uniqueidentifier)

## Enum Değerleri

### sas_isk_uyg / sas_mas_uyg (İskonto/Masraf Uygulaması)

- 0: Brüt toplamdan yüzde
- 1: Ara toplamdan yüzde
- 2: Tutar İskonto masraf
- 3: Miktar başına tutar
- 4-5: Miktar2/3 başına tutar
- 6: Bedelsiz miktar
- 7-18: İskonto1-6 yüzde/aratop yüzde
- 19-24: Masraf1-3 yüzde/aratop yüzde

### sas_isk_durum / sas_mas_durum (İskonto/Masraf Durumu)

- 0: Her zaman
- 1: Borç bakiyede
- 2: Alacak bakiyede
- 3: Dönemsel genel ciro
- 4: Dönemsel mal ciro
- 5: Genel ciro
- 6: Genel mal ciro

### sas_evrtipi

- 0: Normal
- 1: Promosyon
- 2: Proforma

## İlişkiler

- **STOKLAR** ← KOD: `sas_stok_kod` → `sto_kod`
- **CARI_HESAPLAR** ← KOD: `sas_cari_kod` → `cari_kod`
- **DEPOLAR** ← KOD: `sas_depo_no` → `dep_no`
- **ODEME_PLANLARI** ← KOD: `sas_odeme_plan` → `odp_no`

## Indexler

```sql
PRIMARY KEY: sas_Guid
UNIQUE: (sas_evrak_no_seri, sas_evrak_no_sira, sas_satir_no)
INDEX: (sas_cari_kod, sas_stok_kod, sas_basla_tarih)
INDEX: (sas_stok_kod, sas_cari_kod, sas_basla_tarih)
INDEX: sas_evrak_tarih
INDEX: (sas_stok_kod, sas_basla_tarih)
INDEX: (sas_cari_kod, sas_stok_kod, sas_depo_no, sas_basla_tarih)
INDEX: (sas_stok_kod, sas_depo_no, sas_basla_tarih)
```

## SQL Örnekleri

### 1. Aktif Satın Alma Şartları

```sql
SELECT
  s.sas_stok_kod,
  st.sto_isim,
  c.cari_unvan1 AS tedarikci,
  s.sas_brut_fiyat,
  s.sas_doviz_cinsi,
  s.sas_basla_tarih,
  s.sas_bitis_tarih
FROM SATINALMA_SARTLARI s
INNER JOIN STOKLAR st ON s.sas_stok_kod = st.sto_kod
INNER JOIN CARI_HESAPLAR c ON s.sas_cari_kod = c.cari_kod
WHERE s.sas_iptal = 0
  AND GETDATE() BETWEEN s.sas_basla_tarih AND s.sas_bitis_tarih
ORDER BY s.sas_stok_kod, s.sas_brut_fiyat
```

### 2. Stok Bazında En İyi Fiyat

```sql
SELECT
  s.sas_stok_kod,
  MIN(s.sas_brut_fiyat) AS en_iyi_fiyat,
  c.cari_kod,
  c.cari_unvan1
FROM SATINALMA_SARTLARI s
INNER JOIN CARI_HESAPLAR c ON s.sas_cari_kod = c.cari_kod
WHERE s.sas_iptal = 0
  AND GETDATE() BETWEEN s.sas_basla_tarih AND s.sas_bitis_tarih
  AND s.sas_stok_kod = @stokKod
GROUP BY s.sas_stok_kod, c.cari_kod, c.cari_unvan1
ORDER BY en_iyi_fiyat
```

### 3. Tedarikçi Bazında Şartlar

```sql
SELECT
  s.sas_evrak_no_seri + '-' + CAST(s.sas_evrak_no_sira AS VARCHAR) AS sozlesme_no,
  s.sas_stok_kod,
  st.sto_isim,
  s.sas_brut_fiyat,
  s.sas_teslim_sure,
  s.sas_odeme_plan
FROM SATINALMA_SARTLARI s
INNER JOIN STOKLAR st ON s.sas_stok_kod = st.sto_kod
WHERE s.sas_cari_kod = @cariKod
  AND s.sas_iptal = 0
  AND GETDATE() BETWEEN s.sas_basla_tarih AND s.sas_bitis_tarih
```

## TypeScript Interface

```typescript
interface SatinAlmaSarti {
  sasGuid: string
  sasStokKod: string
  sasCariKod: string
  sasEvrakNoSeri: string
  sasEvrakNoSira: number
  sasEvrakTarih: Date
  sasSatirNo: number
  sasBelgeNo?: string
  sasBelgeTarih?: Date
  sasAsgariMiktar?: number
  sasTeslimSure?: number
  sasBaslaTarih: Date
  sasBitisTarih: Date
  sasBrutFiyat: number
  // İskonto 1-6
  sasIskAcik1?: string
  sasIskUyg1?: number
  sasIskDurum1?: number
  sasIskVergi1?: number
  sasIskKriter1?: number
  sasIskYuzde1?: number
  sasIskMiktar1?: number
  // Masraf 1-4 (benzer yapı)
  sasOdemePlan?: number
  sasNetAlisKdvli?: number
  sasKarOran?: number
  sasNetSatisKdvli?: number
  sasSatisFiyat?: number
  sasDovizCinsi: number
  sasEvrtipi: 0 | 1 | 2
  sasAciklama?: string
  sasDepoNo?: number
  sasMaliyetteKullanFl: boolean
  sasIlaveMaliyetTutari?: number
  sasIlaveMaliyetYuzdesi?: number
  sasKesinlestiFl: boolean
  sasProSasUid?: string
  sasIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/satinalma-sartlari/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stokKod = searchParams.get("stok_kod")
  const cariKod = searchParams.get("cari_kod")

  const result = await query(
    `
    SELECT 
      s.sas_Guid as sasGuid,
      s.sas_stok_kod as sasStokKod,
      st.sto_isim as stokIsim,
      s.sas_cari_kod as sasCariKod,
      c.cari_unvan1 as tedarikciAdi,
      s.sas_brut_fiyat as sasBrutFiyat,
      s.sas_doviz_cinsi as sasDovizCinsi,
      s.sas_teslim_sure as sasTeslimSure,
      s.sas_basla_tarih as sasBaslaTarih,
      s.sas_bitis_tarih as sasBitisTarih
    FROM SATINALMA_SARTLARI s
    INNER JOIN STOKLAR st ON s.sas_stok_kod = st.sto_kod
    INNER JOIN CARI_HESAPLAR c ON s.sas_cari_kod = c.cari_kod
    WHERE s.sas_iptal = 0
      AND GETDATE() BETWEEN s.sas_basla_tarih AND s.sas_bitis_tarih
      ${stokKod ? "AND s.sas_stok_kod = @stokKod" : ""}
      ${cariKod ? "AND s.sas_cari_kod = @cariKod" : ""}
    ORDER BY s.sas_stok_kod, s.sas_brut_fiyat
  `,
    { stokKod, cariKod }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/satinalma-sarti-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SatinAlmaSartiCard({ sart }: { sart: SatinAlmaSarti }) {
  const formatTarih = (date: Date) => new Date(date).toLocaleDateString("tr-TR")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{sart.stokIsim}</span>
          <Badge variant={sart.sasEvrtipi === 1 ? "secondary" : "default"}>
            {sart.sasEvrtipi === 0
              ? "Normal"
              : sart.sasEvrtipi === 1
              ? "Promosyon"
              : "Proforma"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tedarikçi:</span>
          <span className="font-medium">{sart.tedarikciAdi}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fiyat:</span>
          <span className="font-bold text-lg">
            {sart.sasBrutFiyat.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Teslimat:</span>
          <span>{sart.sasTeslimSure} gün</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Geçerlilik:</span>
          <span>
            {formatTarih(sart.sasBaslaTarih)} -{" "}
            {formatTarih(sart.sasBitisTarih)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

# SIPARISLER (Sipariş Hareketleri)

## Genel Bakış

Alış ve satış siparişlerini yönetir. Talep/temin siparişleri, proforma, konsinye, fason ve üretim siparişlerini içerir. **CARI_HESAP_HAREKETLERI** ile GUID ilişkisi kurar.

## Alan Kategorileri

### Sistem Alanları (0-15)

Standart sistem alanları: `sip_Guid` (PRIMARY KEY), `sip_DBCno`, `sip_iptal`, `sip_create_user`, `sip_create_date`, vb.

### Evrak Bilgileri (16-26)

- `sip_firmano` - Firma no
- `sip_subeno` - Şube no
- `sip_tarih` - Sipariş tarihi
- `sip_teslim_tarih` - Teslim tarihi
- `sip_tip` - Sipariş tipi (0:Talep, 1:Temin)
- `sip_cins` - Sipariş cinsi (0-9)
- `sip_evrakno_seri` - Evrak seri (UNIQUE)
- `sip_evrakno_sira` - Evrak sıra (UNIQUE)
- `sip_satirno` - Satır no (UNIQUE)
- `sip_belgeno` - Belge no
- `sip_belge_tarih` - Belge tarihi

### Cari ve Stok Bilgileri (27-29)

- `sip_satici_kod` - Satıcı kodu
- `sip_musteri_kod` - Müşteri kodu
- `sip_stok_kod` - Stok kodu

### Miktar ve Fiyat (30-34)

- `sip_b_fiyat` - Birim fiyat
- `sip_miktar` - Sipariş miktarı
- `sip_birim_pntr` - Birim bağlantısı
- `sip_teslim_miktar` - Teslim edilen miktar
- `sip_tutar` - Sipariş tutarı

### İskonto ve Masraf (35-44)

- `sip_iskonto_1` - 6 adet iskonto tutarı
- `sip_masraf_1` - 4 adet masraf tutarı

### Vergi Bilgileri (45-48)

- `sip_vergi_pntr` - Vergi bağlantısı
- `sip_vergi` - Vergi tutarı
- `sip_masvergi_pntr` - Ana vergi bağlantısı
- `sip_masvergi` - Ana vergi tutarı

### Genel Bilgiler (49-55)

- `sip_opno` - Ödeme planı no
- `sip_aciklama`, `sip_aciklama2` - Açıklamalar
- `sip_depono` - Depo no
- `sip_OnaylayanKulNo` - Onaylayan kullanıcı
- `sip_vergisiz_fl` - Vergisiz mi?
- `sip_kapat_fl` - Sipariş kapandı mı?
- `sip_promosyon_fl` - Promosyon var mı?

### Sorumluluk ve Grup (57-59)

- `sip_cari_sormerk` - Cari sorumluluk merkezi
- `sip_stok_sormerk` - Stok sorumluluk merkezi
- `sip_cari_grupno` - Cari grup no

### Döviz Bilgileri (60-62)

- `sip_doviz_cinsi` - Döviz cinsi
- `sip_doviz_kuru` - Döviz kuru
- `sip_alt_doviz_kuru` - Alternatif döviz kuru

### Diğer Bilgiler (63-66)

- `sip_adresno` - Adres no
- `sip_teslimturu` - Teslim türü
- `sip_cagrilabilir_fl` - Çağrılabilir sipariş mi?
- `sip_prosip_uid` - Proforma sipariş GUID

### İskonto/Masraf Tipleri (67-86)

- `sip_iskonto1-6` - İskonto uygulama tipleri (0-24)
- `sip_masraf1-4` - Masraf uygulama tipleri
- `sip_isk1-6`, `sip_mas1-4` - Satır iskonto/masraf bayrakları

### İleri Düzey (87-106)

- `sip_Exp_Imp_Kodu` - EXIM kodu
- `sip_kar_orani` - Kar oranı
- `sip_durumu` - Sipariş durumu (0-3)
- `sip_stal_uid` - Satın alma şartları GUID
- `sip_planlananmiktar` - Planlanan miktar
- `sip_teklif_uid` - Teklif GUID
- `sip_parti_kodu` - Parti kodu
- `sip_lot_no` - Lot no
- `sip_projekodu` - Proje kodu
- `sip_fiyat_liste_no` - Fiyat liste no
- `sip_Otv_Pntr`, `sip_Otv_Vergi`, `sip_otvtutari` - ÖTV bilgileri
- `sip_paket_kod` - Paket kodu
- `sip_Rez_uid` - Rezervasyon GUID
- `sip_harekettipi` - Hareket tipi (0-3)
- `sip_yetkili_uid` - Yetkili GUID
- `sip_kapatmanedenkod` - Kapatma nedeni
- `sip_gecerlilik_tarihi` - Geçerlilik tarihi

### Ön Ödeme (107-109)

- `sip_onodeme_evrak_tip` - Ön ödeme evrak tipi (0-136, CARI_HESAP_HAREKETLERI ile aynı)
- `sip_onodeme_evrak_seri` - Ön ödeme evrak seri
- `sip_onodeme_evrak_sira` - Ön ödeme evrak sıra

### Rezervasyon (110-111)

- `sip_rezervasyon_miktari` - Rezervasyon miktarı
- `sip_rezerveden_teslim_edilen` - Rezerveden teslim edilen

## Enum Değerleri

### sip_tip

- 0: Talep (Alış Siparişi)
- 1: Temin (Satış Siparişi)

### sip_cins

- 0: Normal Sipariş
- 1: Konsinye Sipariş
- 2: Proforma Sipariş
- 3: Dış Ticaret Siparişi
- 4: Fason Siparişi
- 5: Dahili Sarf Siparişi
- 6: Depolar Arası Sipariş
- 7: Satın Alma Talebi
- 8: Üretim Talebi
- 9: İş Emirleri

### sip_durumu

- 0: Stoktan sevk edilecek
- 1: Üretilecek
- 2: Satın alınacak
- 3: Stoktan sevk edilecek (Rezerve edildi)

### sip_harekettipi

- 0: Stok
- 1: Hizmet
- 2: Gider
- 3: Demirbaş

### sip_iskonto1-6 / sip_masraf1-4 (İskonto/Masraf Uygulaması)

- 0: Brüt toplamdan yüzde
- 1: Ara toplamdan yüzde
- 2: Tutar İskonto masraf
- 3: Miktar başına tutar
- 4-5: Miktar2/3 başına tutar
- 6: Bedelsiz miktar
- 7-18: İskonto1-6 yüzde/aratop yüzde
- 19-24: Masraf1-3 yüzde/aratop yüzde

## İlişkiler

**ÖNEMLİ:** Bu tablo hem KOD hem GUID ilişkileri kullanır:

### KOD Bazlı İlişkiler

- **CARI_HESAPLAR** ← KOD: `sip_satici_kod` / `sip_musteri_kod` → `cari_kod`
- **STOKLAR** ← KOD: `sip_stok_kod` → `sto_kod`
- **DEPOLAR** ← KOD: `sip_depono` → `dep_no`
- **PROJELER** ← KOD: `sip_projekodu` → `pro_kodu`
- **ODEME_PLANLARI** ← KOD: `sip_opno` → `odp_no`

### GUID Bazlı İlişkiler

- **CARI_HESAP_HAREKETLERI** → GUID: `cha_sip_uid` ← `sip_Guid` ⚠️ (TEMEL İLİŞKİ)
- **PROFORMA_SIPARISLER** ← GUID: `sip_prosip_uid` → `prosip_Guid`
- **SATINALMA_SARTLARI** ← GUID: `sip_stal_uid` → `sas_Guid`
- **VERILEN_TEKLIFLER** ← GUID: `sip_teklif_uid` → `teklif_Guid`
- **CARI_HESAP_YETKILILERI** ← GUID: `sip_yetkili_uid` → `mye_Guid`

## Indexler

```sql
PRIMARY KEY: sip_Guid
UNIQUE: (sip_tip, sip_cins, sip_evrakno_seri, sip_evrakno_sira, sip_satirno)
INDEX: sip_teslim_tarih
INDEX: sip_tarih
INDEX: (sip_tip, sip_stok_kod, sip_teslim_tarih)
INDEX: (sip_tip, sip_musteri_kod, sip_teslim_tarih)
INDEX: (sip_tip, sip_Exp_Imp_Kodu)
```

## SQL Örnekleri

### 1. Açık Siparişler

```sql
SELECT
  s.sip_evrakno_seri + '-' + CAST(s.sip_evrakno_sira AS VARCHAR) AS siparis_no,
  CASE s.sip_tip WHEN 0 THEN 'Alış' WHEN 1 THEN 'Satış' END AS tip,
  c.cari_unvan1 AS musteri,
  st.sto_isim AS stok_adi,
  s.sip_miktar,
  s.sip_teslim_miktar,
  s.sip_miktar - s.sip_teslim_miktar AS kalan_miktar,
  s.sip_teslim_tarih
FROM SIPARISLER s
LEFT JOIN CARI_HESAPLAR c ON s.sip_musteri_kod = c.cari_kod
INNER JOIN STOKLAR st ON s.sip_stok_kod = st.sto_kod
WHERE s.sip_kapat_fl = 0
  AND s.sip_iptal = 0
  AND s.sip_miktar > s.sip_teslim_miktar
ORDER BY s.sip_teslim_tarih
```

### 2. Müşteri Bazında Sipariş Özeti

```sql
SELECT
  c.cari_kod,
  c.cari_unvan1,
  COUNT(*) AS siparis_adedi,
  SUM(s.sip_tutar) AS toplam_tutar,
  SUM(s.sip_miktar - s.sip_teslim_miktar) AS toplam_kalan
FROM SIPARISLER s
INNER JOIN CARI_HESAPLAR c ON s.sip_musteri_kod = c.cari_kod
WHERE s.sip_tip = 1
  AND s.sip_kapat_fl = 0
  AND s.sip_iptal = 0
GROUP BY c.cari_kod, c.cari_unvan1
ORDER BY toplam_tutar DESC
```

### 3. Vadesi Geçmiş Siparişler

```sql
SELECT
  s.sip_evrakno_seri + '-' + CAST(s.sip_evrakno_sira AS VARCHAR) AS siparis_no,
  c.cari_unvan1,
  s.sip_teslim_tarih,
  DATEDIFF(day, s.sip_teslim_tarih, GETDATE()) AS gecikme_gun,
  s.sip_miktar - s.sip_teslim_miktar AS kalan_miktar
FROM SIPARISLER s
INNER JOIN CARI_HESAPLAR c ON s.sip_musteri_kod = c.cari_kod
WHERE s.sip_teslim_tarih < GETDATE()
  AND s.sip_kapat_fl = 0
  AND s.sip_iptal = 0
ORDER BY gecikme_gun DESC
```

## TypeScript Interface

```typescript
interface Siparis {
  sipGuid: string
  sipFirmano: number
  sipSubeno: number
  sipTarih: Date
  sipTeslimTarih: Date
  sipTip: 0 | 1 // 0:Talep 1:Temin
  sipCins: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  sipEvraknoSeri: string
  sipEvraknoSira: number
  sipSatirno: number
  sipBelgeno?: string
  sipBelgeTarih?: Date
  sipSaticiKod?: string
  sipMusteriKod?: string
  sipStokKod: string
  sipBFiyat: number
  sipMiktar: number
  sipBirimPntr: number
  sipTeslimMiktar: number
  sipTutar: number
  // İskonto 1-6
  sipIskonto1?: number
  // Masraf 1-4
  sipMasraf1?: number
  sipOpno?: number
  sipAciklama?: string
  sipDepono?: number
  sipVergisizFl: boolean
  sipKapatFl: boolean
  sipPromosyonFl: boolean
  sipDovizCinsi: number
  sipDovizKuru: number
  sipDurumu: 0 | 1 | 2 | 3
  sipProjekodu?: string
  sipHarekettipi: 0 | 1 | 2 | 3
  sipRezervasyonMiktari?: number
  sipRezervedenTeslimEdilen?: number
  sipIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/siparisler/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tip = searchParams.get("tip")
  const musteriKod = searchParams.get("musteri_kod")
  const acikSiparisler = searchParams.get("acik") === "true"

  const result = await query(
    `
    SELECT 
      s.sip_Guid as sipGuid,
      s.sip_evrakno_seri as sipEvraknoSeri,
      s.sip_evrakno_sira as sipEvraknoSira,
      s.sip_tip as sipTip,
      s.sip_tarih as sipTarih,
      s.sip_teslim_tarih as sipTeslimTarih,
      s.sip_stok_kod as sipStokKod,
      st.sto_isim as stokIsim,
      s.sip_musteri_kod as sipMusteriKod,
      c.cari_unvan1 as musteriAdi,
      s.sip_miktar as sipMiktar,
      s.sip_teslim_miktar as sipTeslimMiktar,
      s.sip_tutar as sipTutar,
      s.sip_kapat_fl as sipKapatFl
    FROM SIPARISLER s
    LEFT JOIN CARI_HESAPLAR c ON s.sip_musteri_kod = c.cari_kod
    INNER JOIN STOKLAR st ON s.sip_stok_kod = st.sto_kod
    WHERE s.sip_iptal = 0
      ${tip ? "AND s.sip_tip = @tip" : ""}
      ${musteriKod ? "AND s.sip_musteri_kod = @musteriKod" : ""}
      ${acikSiparisler ? "AND s.sip_kapat_fl = 0" : ""}
    ORDER BY s.sip_teslim_tarih, s.sip_evrakno_sira
  `,
    {
      tip: tip ? parseInt(tip) : undefined,
      musteriKod,
    }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/siparis-list.tsx
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

const SIPARIS_TIP: Record<number, string> = {
  0: "Alış",
  1: "Satış",
}

const SIPARIS_CINS: Record<number, string> = {
  0: "Normal",
  1: "Konsinye",
  2: "Proforma",
  3: "Dış Ticaret",
  4: "Fason",
  5: "Dahili Sarf",
  6: "Depolar Arası",
  7: "Satın Alma Talebi",
  8: "Üretim Talebi",
  9: "İş Emirleri",
}

export function SiparisList({ siparisler }: { siparisler: Siparis[] }) {
  const kalanMiktar = (s: Siparis) => s.sipMiktar - s.sipTeslimMiktar

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sipariş No</TableHead>
          <TableHead>Tip</TableHead>
          <TableHead>Müşteri</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead className="text-right">Miktar</TableHead>
          <TableHead className="text-right">Kalan</TableHead>
          <TableHead>Teslim Tarihi</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {siparisler.map((s) => (
          <TableRow key={s.sipGuid}>
            <TableCell className="font-mono">
              {s.sipEvraknoSeri}-{s.sipEvraknoSira}
            </TableCell>
            <TableCell>
              <Badge variant={s.sipTip === 0 ? "secondary" : "default"}>
                {SIPARIS_TIP[s.sipTip]}
              </Badge>
            </TableCell>
            <TableCell>{s.musteriAdi}</TableCell>
            <TableCell>{s.stokIsim}</TableCell>
            <TableCell className="text-right">{s.sipMiktar}</TableCell>
            <TableCell className="text-right font-medium">
              {kalanMiktar(s).toFixed(2)}
            </TableCell>
            <TableCell>
              {new Date(s.sipTeslimTarih).toLocaleDateString("tr-TR")}
            </TableCell>
            <TableCell>
              {s.sipKapatFl ? (
                <Badge variant="outline">Kapalı</Badge>
              ) : kalanMiktar(s) > 0 ? (
                <Badge variant="destructive">Açık</Badge>
              ) : (
                <Badge variant="success">Tamamlandı</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Notlar

- **112 alan** içeren kapsamlı sipariş tablosu
- **sip_Guid**: CARI_HESAP_HAREKETLERI ile GUID ilişkisi kurar (`cha_sip_uid`)
- 10 farklı sipariş cinsi destekler
- Rezervasyon, ön ödeme, çağrılabilir sipariş özellikleri
- e-Fatura entegrasyonu için uyumlu evrak tipleri

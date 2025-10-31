# CARI_HESAP_HAREKETLERI (Cari Hareketleri)

## Genel Bakış

Tüm cari hesap hareketlerini kaydeder. Faturalar, tahsilat/tediye, çek/senet, dekont ve diğer mali belgeleri içerir. Mikro ERP'nin en kritik hareket tablosudur.

## Alan Kategorileri

### Sistem Alanları (0-15)

Standart sistem alanları: `cha_Guid` (PRIMARY KEY), `cha_DBCno`, `cha_iptal`, `cha_create_user`, `cha_create_date`, vb.

### Evrak Bilgileri (16-22)

- `cha_firmano` - Firma no
- `cha_subeno` - Şube no
- `cha_evrak_tip` - Evrak tipi (0-136, 137 farklı evrak tipi)
- `cha_evrakno_seri` - Evrak seri (UNIQUE)
- `cha_evrakno_sira` - Evrak sıra no (UNIQUE)
- `cha_satir_no` - Satır no (UNIQUE)
- `cha_tarihi` - Hareket tarihi

### Hareket Özellikleri (23-30)

- `cha_tip` - Hareket tipi (0:Borç, 1:Alacak)
- `cha_cinsi` - Hareket cinsi (0-41, nakit/çek/senet/fatura vb.)
- `cha_normal_Iade` - Normal/İade (0:Normal, 1:İade)
- `cha_tpoz` - Cari pozisyonu (0:Açık, 1:Kapalı)
- `cha_ticaret_turu` - Dış ticaret türü (0-5)
- `cha_belge_no` - Belge no
- `cha_belge_tarih` - Belge tarihi
- `cha_aciklama` - Açıklama

### Cari ve İlişkili Kodlar (31-37)

- `cha_satici_kodu` - Satıcı kodu
- `cha_EXIMkodu` - Exim kodu
- `cha_projekodu` - Proje kodu
- `cha_yat_tes_kodu` - Yatırım teşvik kodu
- `cha_cari_cins` - Cari cinsi (0-13)
- `cha_kod` - Cari kodu (ana cari)
- `cha_ciro_cari_kodu` - Ciro cari kodu

### Döviz Bilgileri (38-40)

- `cha_d_cins` - Orijinal döviz cinsi
- `cha_d_kur` - Orijinal döviz kuru
- `cha_altd_kur` - Alternatif döviz kuru

### Sorumluluk ve Grup (41-42)

- `cha_grupno` - Cari grup no
- `cha_srmrkkodu` - Sorumluluk merkezi kodu

### Karşı Hesap Bilgileri (43-48)

- `cha_kasa_hizmet` - Karşı kasa/hizmet cinsi (0-13)
- `cha_kasa_hizkod` - Karşı kasa/hizmet kodu
- `cha_karsidcinsi` - Karşı döviz cinsi
- `cha_karsid_kur` - Karşı döviz kuru
- `cha_karsidgrupno` - Karşı grup no
- `cha_karsisrmrkkodu` - Karşı sorumluluk merkezi

### Tutar Bilgileri (49-51)

- `cha_miktari` - Miktar
- `cha_meblag` - Hareket meblağı (orijinal döviz cinsinden)
- `cha_aratoplam` - Ara toplam

### Vade ve İskonto (52-63)

- `cha_vade` - Vade tarihi
- `cha_Vade_Farki_Yuz` - Vade farkı yüzdesi
- `cha_ft_iskonto1-6` - İskonto tutarları
- `cha_ft_masraf1-4` - Masraf tutarları

### İskonto/Masraf Bayrakları (64-83)

- `cha_isk_mas1-10` - İskonto/masraf tipleri
- `cha_sat_iskmas1-10` - Satır iskonto/masraf bayrakları

### Diğer Tutarlar (84-88)

- `cha_yuvarlama` - Yuvarlama
- `cha_StFonPntr` - Fon bağlantısı
- `cha_stopaj` - Stopaj
- `cha_savsandesfonu` - SavSanDes fonu
- `cha_avansmak_damgapul` - Damga pulu

### Vergi Bilgileri (89-106)

- `cha_vergipntr` - Vergi bağlantısı
- `cha_vergi1-10` - Vergi tutarları
- `cha_vergisiz_fl` - Vergisiz mi?
- `cha_otvtutari` - ÖTV tutarı
- `cha_oiv_pntr` - Özel iletişim vergisi uygulaması
- `cha_oivtutari` - ÖİV tutarı
- `cha_tevkifat_toplam` - Tevkifat toplamı
- `cha_ilave_edilecek_kdv1-10` - İlave KDV tutarları

### Fiş ve Referans (107-112)

- `cha_fis_tarih` - Fiş tarihi
- `cha_fis_sirano` - Fiş sıra no
- `cha_trefno` - Referans no (çek/senet için önemli)
- `cha_sntck_poz` - Senet/çek pozisyonu (0-10)
- `cha_reftarihi` - Referans tarihi
- `cha_istisnakodu` - İstisna kodu

### Özel Durumlar (113-121)

- `cha_pos_hareketi` - POS hareketi mi?
- `cha_meblag_ana_doviz_icin_gecersiz_fl` - Meblağ geçersizlik bayrakları
- `cha_sip_uid` - Sipariş GUID (GUID ilişkisi!)
- `cha_kirahar_uid` - Kira hareketi GUID
- `cha_vardiya_tarihi`, `cha_vardiya_no`, `cha_vardiya_evrak_ti` - Vardiya bilgileri

### e-Fatura ve e-Belge (122, 134-138)

- `cha_ebelge_cinsi` - e-Belge cinsi (0-3)
- `cha_e_islem_turu` - e-İşlem türü (0-2)
- `cha_fatura_belge_turu` - Fatura belge türü (0-12)
- `cha_diger_belge_adi` - Diğer belge adı
- `cha_uuid` - e-Fatura UUID
- `cha_adres_no` - Hizmet adresi no

### Toplam ve İlk Belge (139-141)

- `cha_vergifon_toplam` - Vergi/fon toplamı
- `cha_ilk_belge_tarihi` - İlk belge tarihi
- `cha_ilk_belge_doviz_kuru` - İlk belge döviz kuru

## Önemli Enum Değerleri

### cha_evrak_tip (Kısaltılmış - 137 tip)

- 0: Alış Faturası
- 1: Tahsilat Makbuzu
- 3-4: Senet/Çek Giriş Bordrosu
- 63: Satış Faturası
- 64: Tediye Makbuzu
- 66-67: Senet/Çek Çıkış Bordrosu
- 82-83: Ödeme Emri Giriş/Çıkış Bordrosu

### cha_tip

- 0: Borç
- 1: Alacak

### cha_cinsi

- 0: Nakit
- 1: Müşteri Çeki
- 2: Müşteri Senedi
- 3: Firma Çeki
- 4: Firma Senedi
- 6: Toptan Fatura
- 7: Perakende Faturası
- 19: Müşteri Kredi Kartı
- 22: Firma Kredi Kartı

### cha_sntck_poz

- 0: Portföyde
- 2: Tahsilde
- 3: Teminatta
- 10: Ödendi

## İlişkiler

**ÖNEMLİ:** Bu tablo KOD-based ilişkiler kullanır, ancak **1 GUID istisnası** vardır:

- **CARI_HESAPLAR** ← KOD: `cha_kod` → `cari_kod`
- **PROJELER** ← KOD: `cha_projekodu` → `pro_kodu`
- **SORUMLULUK_MERKEZLERI** ← KOD: `cha_srmrkkodu` → `som_kod`
- **KASALAR** ← KOD: `cha_kasa_hizkod` → `kas_kod`
- **ODEME_EMIRLERI** ← KOD: `cha_trefno` → `sck_refno`
- **SIPARISLER** ← **GUID**: `cha_sip_uid` → `sip_Guid` ⚠️ (TEK GUID İLİŞKİSİ)

## Indexler

```sql
PRIMARY KEY: cha_Guid
UNIQUE: (cha_evrak_tip, cha_evrakno_seri, cha_evrakno_sira, cha_satir_no)
INDEX: cha_tarihi
INDEX: (cha_cari_cins, cha_kod, cha_tarihi)
INDEX: (cha_kasa_hizmet, cha_kasa_hizkod, cha_tarihi)
INDEX: cha_trefno
INDEX: cha_sip_uid
```

## SQL Örnekleri

### 1. Cari Ekstre

```sql
SELECT
  cha_tarihi,
  cha_evrakno_seri + '-' + CAST(cha_evrakno_sira AS VARCHAR) AS evrak_no,
  cha_aciklama,
  CASE cha_tip WHEN 0 THEN cha_meblag ELSE 0 END AS borc,
  CASE cha_tip WHEN 1 THEN cha_meblag ELSE 0 END AS alacak
FROM CARI_HESAP_HAREKETLERI
WHERE cha_cari_cins = 0
  AND cha_kod = @cariKod
  AND cha_iptal = 0
ORDER BY cha_tarihi, cha_evrakno_sira
```

### 2. Açık Faturalar

```sql
SELECT
  c.cari_unvan1,
  h.cha_belge_no,
  h.cha_tarihi,
  h.cha_vade,
  h.cha_meblag,
  DATEDIFF(day, GETDATE(), h.cha_vade) AS kalan_gun
FROM CARI_HESAP_HAREKETLERI h
INNER JOIN CARI_HESAPLAR c ON h.cha_kod = c.cari_kod
WHERE h.cha_cari_cins = 0
  AND h.cha_tpoz = 0
  AND h.cha_evrak_tip IN (0, 63)
  AND h.cha_iptal = 0
ORDER BY h.cha_vade
```

### 3. Günlük Satış Raporu

```sql
SELECT
  SUM(CASE WHEN cha_normal_Iade = 0 THEN cha_meblag ELSE 0 END) AS satis,
  SUM(CASE WHEN cha_normal_Iade = 1 THEN cha_meblag ELSE 0 END) AS iade,
  COUNT(DISTINCT cha_evrakno_sira) AS fatura_adedi
FROM CARI_HESAP_HAREKETLERI
WHERE cha_evrak_tip = 63
  AND cha_tarihi = @tarih
  AND cha_iptal = 0
```

## TypeScript Interface

```typescript
interface CariHesapHareketi {
  chaGuid: string
  chaFirmano: number
  chaSubeno: number
  chaEvrakTip: number // 0-136
  chaEvraknoSeri: string
  chaEvraknoSira: number
  chaSatirNo: number
  chaTarihi: Date
  chaTip: 0 | 1 // 0:Borç 1:Alacak
  chaCinsi: number // 0-41
  chaNormalIade: 0 | 1
  chaTpoz: 0 | 1 // 0:Açık 1:Kapalı
  chaBelgeNo?: string
  chaBelgeTarih?: Date
  chaAciklama?: string
  chaSaticiKodu?: string
  chaEXIMkodu?: string
  chaProjekodu?: string
  chaCariCins: number // 0-13
  chaKod: string // Ana cari kodu
  chaDCins: number // Döviz cinsi
  chaDKur: number // Döviz kuru
  chaGrupno?: number
  chaSrmrkkodu?: string
  chaKasaHizmet?: number
  chaKasaHizkod?: string
  chaMiktari?: number
  chaMeblag: number // Meblağ
  chaAratoplam?: number
  chaVade?: number
  chaVergiFonToplam?: number
  chaTrefno?: string // Çek/senet ref no
  chaSntckPoz?: number // 0-10
  chaSipUid?: string // ⚠️ GUID ilişkisi
  chaIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/cari-hareketler/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cariKod = searchParams.get("cari_kod")
  const basTarih = searchParams.get("bas_tarih")
  const bitTarih = searchParams.get("bit_tarih")

  const result = await query(
    `
    SELECT 
      h.cha_Guid as chaGuid,
      h.cha_tarihi as chaTarihi,
      h.cha_evrakno_seri as chaEvraknoSeri,
      h.cha_evrakno_sira as chaEvraknoSira,
      h.cha_tip as chaTip,
      h.cha_meblag as chaMeblag,
      h.cha_aciklama as chaAciklama,
      c.cari_unvan1 as cariUnvan
    FROM CARI_HESAP_HAREKETLERI h
    LEFT JOIN CARI_HESAPLAR c ON h.cha_kod = c.cari_kod AND h.cha_cari_cins = 0
    WHERE h.cha_iptal = 0
      ${cariKod ? "AND h.cha_kod = @cariKod" : ""}
      ${basTarih ? "AND h.cha_tarihi >= @basTarih" : ""}
      ${bitTarih ? "AND h.cha_tarihi <= @bitTarih" : ""}
    ORDER BY h.cha_tarihi DESC, h.cha_evrakno_sira DESC
  `,
    { cariKod, basTarih, bitTarih }
  )

  return Response.json(result.recordset)
}
```

## Notlar

- **141 alan** içeren çok kapsamlı hareket tablosu
- **137 farklı evrak tipi** destekler
- **cha_sip_uid**: Mikro ERP'de GUID ilişkisi kullanan **tek alan** (STOK_HAREKETLERI'nden sonra)
- e-Fatura/e-Arşiv entegrasyonu için `cha_uuid` alanı kullanılır
- Vardiya takibi için özel alanlar mevcut
- KDV, ÖTV, Stopaj, Tevkifat gibi tüm vergi türleri desteklenir

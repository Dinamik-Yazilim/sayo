# STOK_HAREKETLERI Tablosu

> **Mikro ERP V16/V17 - Stok Hareket Tablosu**  
> Tüm stok giriş, çıkış ve transfer hareketlerini kayıt altına alan ana tablo

## 📋 Genel Bilgiler

Bu tablo sistemdeki tüm stok hareketlerini (giriş, çıkış, transfer) detaylı şekilde saklar. Her hareket satırı için fiyat, iskonto, masraf, vergi bilgileri gibi detaylar bu tabloda tutulur.

## 🗄️ Tablo Yapısı

### Sistem Alanları (0-15)

| Alan Adı          | Tip              | Açıklama                              |
| ----------------- | ---------------- | ------------------------------------- |
| `sth_Guid`        | Uniqueidentifier | Benzersiz kayıt kimliği (Primary Key) |
| `sth_DBCno`       | Smallint         | Veritabanı şirket numarası            |
| `sth_SpecRECno`   | Integer          | Özel kayıt numarası                   |
| `sth_iptal`       | Bit              | İptal edildi mi? (0: Hayır, 1: Evet)  |
| `sth_fileid`      | Smallint         | Dosya ID                              |
| `sth_hidden`      | Bit              | Gizli mi?                             |
| `sth_kilitli`     | Bit              | Kilitli mi?                           |
| `sth_degisti`     | Bit              | Değişti mi?                           |
| `sth_checksum`    | Integer          | Kontrol toplamı                       |
| `sth_create_user` | Smallint         | Oluşturan kullanıcı ID                |
| `sth_create_date` | DateTime         | Oluşturma tarihi                      |
| `sth_lastup_user` | Smallint         | Son güncelleyen kullanıcı ID          |
| `sth_lastup_date` | DateTime         | Son güncelleme tarihi                 |
| `sth_special1`    | Nvarchar(4)      | Özel alan 1                           |
| `sth_special2`    | Nvarchar(4)      | Özel alan 2                           |
| `sth_special3`    | Nvarchar(4)      | Özel alan 3                           |

### Temel Hareket Bilgileri (16-28)

| Alan Adı           | Tip          | Açıklama                      |
| ------------------ | ------------ | ----------------------------- |
| `sth_firmano`      | Integer      | Firma numarası                |
| `sth_subeno`       | Integer      | Şube numarası                 |
| `sth_tarih`        | DateTime     | **Hareket tarihi** (İndeksli) |
| `sth_tip`          | Tinyint      | **Hareket tipi**              |
| `sth_cins`         | Tinyint      | **Hareket cinsi**             |
| `sth_normal_iade`  | Tinyint      | Normal/İade durumu            |
| `sth_evraktip`     | Tinyint      | **Evrak tipi**                |
| `sth_evrakno_seri` | Nvarchar     | **Evrak seri numarası**       |
| `sth_evrakno_sira` | Integer      | **Evrak sıra numarası**       |
| `sth_satirno`      | Integer      | **Satır numarası**            |
| `sth_belge_no`     | Nvarchar     | Belge numarası                |
| `sth_belge_tarih`  | DateTime     | Belge tarihi                  |
| `sth_stok_kod`     | Nvarchar(25) | **Stok kodu** (İndeksli)      |

### Hareket Tipleri (`sth_tip`)

| Değer | Açıklama                                   |
| ----- | ------------------------------------------ |
| 0     | **Giriş** - Depoya mal girişi              |
| 1     | **Çıkış** - Depodan mal çıkışı             |
| 2     | **Depo Transfer** - Depolar arası transfer |

### Hareket Cinsleri (`sth_cins`)

| Değer | Açıklama                               |
| ----- | -------------------------------------- |
| 0     | Toptan satış/alış                      |
| 1     | Perakende satış/alış                   |
| 2     | Dış ticaret                            |
| 3     | Stok virman                            |
| 4     | Fire                                   |
| 5     | Sarf                                   |
| 6     | Transfer                               |
| 7     | Üretim                                 |
| 8     | Fason                                  |
| 9     | Değer farkı                            |
| 10    | Sayım                                  |
| 11    | Stok açılış                            |
| 12    | İthalat-İhracat                        |
| 13    | Hal                                    |
| 14    | Müstahsil / Kabzımal                   |
| 15    | Müstahsil Değer Farkı / Gider Pusulası |

### Normal/İade Durumu (`sth_normal_iade`)

| Değer | Açıklama                      |
| ----- | ----------------------------- |
| 0     | **Normal** - Standart hareket |
| 1     | **İade** - İade işlemi        |

### Evrak Tipleri (`sth_evraktip`)

| Değer | Açıklama                                 |
| ----- | ---------------------------------------- |
| 0     | Depo Çıkış Fişi                          |
| 1     | Çıkış İrsaliyesi                         |
| 2     | Depo Transfer Fişi                       |
| 3     | **Giriş Faturası**                       |
| 4     | **Çıkış Faturası**                       |
| 5     | Stoklara İthalat Masraf Yansıtma Dekontu |
| 6     | Stok Virman Fişi                         |
| 7     | Üretim Fişi                              |
| 8     | İlave Enflasyon Maliyet Fişi             |
| 9     | Stoklara İlave Maliyet Yedirme Fişi      |
| 10    | Antrepolardan Mal Millileştirme Fişi     |
| 11    | Antrepolar Arası Transfer Fişi           |
| 12    | **Depo Giriş Fişi**                      |
| 13    | **Giriş İrsaliyesi**                     |
| 14    | Fason Giriş Çıkış Fişi                   |
| 15    | Depolar Arası Satış Fişi                 |
| 16    | Stok Gider Pusulası Fişi                 |
| 17    | Depolar Arası Nakliye Fişi               |

### İskonto ve Masraf Alanları (29-48)

| Alan Adı           | Tip     | Açıklama                           |
| ------------------ | ------- | ---------------------------------- |
| `sth_isk_mas1`     | Tinyint | 1. İskonto/Masraf tipi             |
| `sth_isk_mas2`     | Tinyint | 2. İskonto/Masraf tipi             |
| `sth_isk_mas3`     | Tinyint | 3. İskonto/Masraf tipi             |
| `sth_isk_mas4`     | Tinyint | 4. İskonto/Masraf tipi             |
| `sth_isk_mas5`     | Tinyint | 5. İskonto/Masraf tipi             |
| `sth_isk_mas6`     | Tinyint | 6. İskonto/Masraf tipi             |
| `sth_isk_mas7`     | Tinyint | 7. İskonto/Masraf tipi             |
| `sth_isk_mas8`     | Tinyint | 8. İskonto/Masraf tipi             |
| `sth_isk_mas9`     | Tinyint | 9. İskonto/Masraf tipi             |
| `sth_isk_mas10`    | Tinyint | 10. İskonto/Masraf tipi            |
| `sth_sat_iskmas1`  | Bit     | 1. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas2`  | Bit     | 2. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas3`  | Bit     | 3. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas4`  | Bit     | 4. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas5`  | Bit     | 5. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas6`  | Bit     | 6. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas7`  | Bit     | 7. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas8`  | Bit     | 8. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas9`  | Bit     | 9. İskonto/Masraf satır bazlı mı?  |
| `sth_sat_iskmas10` | Bit     | 10. İskonto/Masraf satır bazlı mı? |

#### İskonto/Masraf Tipleri

| Değer | Açıklama                  |
| ----- | ------------------------- |
| 0     | Brüt toplamdan yüzde      |
| 1     | Ara toplamdan yüzde       |
| 2     | Tutar iskonto/masraf      |
| 3     | Miktar başına tutar       |
| 4     | Miktar2 başına tutar      |
| 5     | Miktar3 başına tutar      |
| 6     | Bedelsiz miktar           |
| 7     | İskonto1 yüzde            |
| 8     | İskonto1 ara toplam yüzde |
| 9     | İskonto2 yüzde            |
| 10    | İskonto2 ara toplam yüzde |
| 11    | İskonto3 yüzde            |
| 12    | İskonto3 ara toplam yüzde |
| 13    | İskonto4 yüzde            |
| 14    | İskonto4 ara toplam yüzde |
| 15    | İskonto5 yüzde            |
| 16    | İskonto5 ara toplam yüzde |
| 17    | İskonto6 yüzde            |
| 18    | İskonto6 ara toplam yüzde |
| 19    | Masraf1 yüzde             |
| 20    | Masraf1 ara toplam yüzde  |
| 21    | Masraf2 yüzde             |
| 22    | Masraf2 ara toplam yüzde  |
| 23    | Masraf3 yüzde             |
| 24    | Masraf3 ara toplam yüzde  |

### Özel Alanlar (49-50)

| Alan Adı           | Tip | Açıklama          |
| ------------------ | --- | ----------------- |
| `sth_pos_satis`    | Bit | POS satışı mı?    |
| `sth_promosyon_fl` | Bit | Promosyon var mı? |

### Cari ve İlişkili Bilgiler (51-55)

| Alan Adı                | Tip          | Açıklama                 |
| ----------------------- | ------------ | ------------------------ |
| `sth_cari_cinsi`        | Tinyint      | **Cari cinsi**           |
| `sth_cari_kodu`         | Nvarchar(25) | **Cari kodu** (İndeksli) |
| `sth_cari_grup_no`      | Tinyint      | Cari grup numarası       |
| `sth_isemri_gider_kodu` | Nvarchar(10) | İş emri gider kodu       |
| `sth_plasiyer_kodu`     | Nvarchar(25) | Plasiyer kodu (İndeksli) |

#### Cari Cinsleri (`sth_cari_cinsi`)

| Değer | Açıklama                    |
| ----- | --------------------------- |
| 0     | Carimiz (Müşteri/Tedarikçi) |
| 1     | Cari Personelimiz           |
| 2     | Bankamız                    |
| 3     | Hizmetimiz                  |
| 4     | Kasamız                     |
| 5     | Giderimiz                   |
| 6     | Muhasebe Hesabımız          |
| 7     | Personelimiz                |
| 8     | Demirbaşımız                |
| 9     | İthalat Dosyamız            |
| 10    | Finansal Sözleşmemiz        |
| 11    | Kredi Sözleşmemiz           |
| 12    | Dönemsel Hizmetimiz         |
| 13    | Kredi Kartımız              |

### Döviz Bilgileri (56-60)

| Alan Adı               | Tip     | Açıklama                                 |
| ---------------------- | ------- | ---------------------------------------- |
| `sth_har_doviz_cinsi`  | Tinyint | Hareket döviz cinsi (Bkz. DOVIZ_KURLARI) |
| `sth_har_doviz_kuru`   | Float   | Hareket döviz kuru                       |
| `sth_alt_doviz_kuru`   | Float   | Alternatif döviz kuru                    |
| `sth_stok_doviz_cinsi` | Tinyint | Stok döviz cinsi                         |
| `sth_stok_doviz_kuru`  | Float   | Stok döviz kuru                          |

### Miktar ve Tutar Bilgileri (61-79)

| Alan Adı                | Tip     | Açıklama                                     |
| ----------------------- | ------- | -------------------------------------------- |
| `sth_miktar`            | Float   | **Hareket miktarı** (Ana miktar)             |
| `sth_miktar2`           | Float   | 2. birim miktarı                             |
| `sth_birim_pntr`        | Tinyint | Birim pointer (1: Ana, 2: İkinci, 3: Üçüncü) |
| `sth_tutar`             | Float   | **Hareket tutarı**                           |
| `sth_iskonto1`          | Float   | 1. İskonto miktarı                           |
| `sth_iskonto2`          | Float   | 2. İskonto miktarı                           |
| `sth_iskonto3`          | Float   | 3. İskonto miktarı                           |
| `sth_iskonto4`          | Float   | 4. İskonto miktarı                           |
| `sth_iskonto5`          | Float   | 5. İskonto miktarı                           |
| `sth_iskonto6`          | Float   | 6. İskonto miktarı                           |
| `sth_masraf1`           | Float   | 1. Masraf miktarı                            |
| `sth_masraf2`           | Float   | 2. Masraf miktarı                            |
| `sth_masraf3`           | Float   | 3. Masraf miktarı                            |
| `sth_masraf4`           | Float   | 4. Masraf miktarı                            |
| `sth_vergi_pntr`        | Tinyint | Vergi bağlantısı                             |
| `sth_vergi`             | Float   | Vergi oranı (KDV)                            |
| `sth_masraf_vergi_pntr` | Tinyint | Masraf vergi bağlantısı                      |
| `sth_masraf_vergi`      | Float   | Masraf vergi oranı                           |
| `sth_netagirlik`        | Float   | Net ağırlık (kg)                             |

### Diğer Hareket Bilgileri (80-118)

| Alan Adı                 | Tip              | Açıklama                                 |
| ------------------------ | ---------------- | ---------------------------------------- |
| `sth_odeme_op`           | Integer          | Ödeme planı                              |
| `sth_aciklama`           | Nvarchar(50)     | Hareket açıklaması                       |
| `sth_sip_uid`            | Uniqueidentifier | Sipariş UID (Bkz. SIPARISLER)            |
| `sth_fat_uid`            | Uniqueidentifier | Fatura UID (Bkz. CARI_HESAP_HAREKETLERI) |
| `sth_giris_depo_no`      | Integer          | **Giriş depo numarası**                  |
| `sth_cikis_depo_no`      | Integer          | **Çıkış depo numarası**                  |
| `sth_malkbl_sevk_tarihi` | DateTime         | Mal kabul/sevkiyat tarihi                |
| `sth_cari_srm_merkezi`   | Nvarchar(25)     | Cari sorumluluk merkezi                  |
| `sth_stok_srm_merkezi`   | Nvarchar(25)     | Stok sorumluluk merkezi                  |
| `sth_fis_tarihi`         | DateTime         | Fiş tarihi                               |
| `sth_fis_sirano`         | Integer          | Fiş sıra numarası                        |
| `sth_vergisiz_fl`        | Bit              | Vergisiz mi?                             |
| `sth_maliyet_ana`        | Float            | Ana maliyet                              |
| `sth_maliyet_alternatif` | Float            | Alternatif maliyet                       |
| `sth_maliyet_orjinal`    | Float            | Orijinal maliyet                         |
| `sth_adres_no`           | Integer          | Adres numarası                           |
| `sth_parti_kodu`         | Nvarchar(25)     | Parti kodu (Bkz. PARTILOT)               |
| `sth_lot_no`             | Integer          | Lot numarası (Bkz. PARTILOT)             |
| `sth_kons_uid`           | Uniqueidentifier | Konsinye UID                             |
| `sth_proje_kodu`         | Nvarchar(25)     | Proje kodu (Bkz. PROJELER)               |
| `sth_exim_kodu`          | Nvarchar(25)     | Exim kodu                                |
| `sth_otv_pntr`           | Tinyint          | ÖTV bağlantısı                           |
| `sth_otv_vergi`          | Float            | ÖTV oranı                                |
| `sth_brutagirlik`        | Float            | Brüt ağırlık (kg)                        |
| `sth_disticaret_turu`    | Tinyint          | Dış ticaret türü                         |
| `sth_otvtutari`          | Float            | ÖTV tutarı                               |
| `sth_otvvergisiz_fl`     | Bit              | ÖTV vergisiz mi?                         |
| `sth_oiv_pntr`           | Tinyint          | ÖİV bağlantısı                           |
| `sth_oiv_vergi`          | Float            | ÖİV oranı                                |
| `sth_oivvergisiz_fl`     | Bit              | ÖİV vergisiz mi?                         |
| `sth_fiyat_liste_no`     | Integer          | Fiyat liste numarası                     |
| `sth_oivtutari`          | Float            | ÖİV tutarı                               |
| `sth_Tevkifat_turu`      | Tinyint          | Tevkifat türü                            |
| `sth_nakliyedeposu`      | Integer          | Nakliye deposu                           |
| `sth_nakliyedurumu`      | Tinyint          | Nakliye durumu                           |
| `sth_yetkili_uid`        | Uniqueidentifier | Yetkili UID                              |
| `sth_taxfree_fl`         | Bit              | Tax-free mi?                             |
| `sth_ilave_edilecek_kdv` | Float            | İlave edilecek KDV                       |
| `sth_ismerkezi_kodu`     | Nvarchar(25)     | İş merkezi kodu                          |

#### Dış Ticaret Türleri (`sth_disticaret_turu`)

| Değer | Açıklama                                 |
| ----- | ---------------------------------------- |
| 0     | Toptan yurtiçi ticaret                   |
| 1     | Perakende yurtiçi ticaret                |
| 2     | İhraç kayıtlı yurtiçi ticaret            |
| 3     | Yurtdışı ticaret                         |
| 4     | Yurtdışı nitelikli ihraç kayıtlı ticaret |
| 5     | Yurtdışı nitelikli yurtiçi ticaret       |

#### Tevkifat Türleri (`sth_Tevkifat_turu`)

| Değer | Açıklama |
| ----- | -------- |
| 0     | Yok      |
| 1     | 10'da 3  |
| 2     | 10'da 9  |
| 3     | %21      |
| 4     | %32      |
| 5     | %61      |
| 6     | %45      |
| 7     | Tam      |
| 8     | 10'da 2  |
| 9     | 10'da 5  |
| 10    | 10'da 7  |

#### Nakliye Durumu (`sth_nakliyedurumu`)

| Değer | Açıklama      |
| ----- | ------------- |
| 0     | Yolda         |
| 1     | Teslim edildi |

## 📊 İndeksler

| İndeks Adı                | Özellik      | Alanlar                                                                                                             |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `NDX_STOK_HAREKETLERI_00` | PRIMARY KEY  | `sth_Guid`                                                                                                          |
| `NDX_STOK_HAREKETLERI_02` | -            | `sth_tarih`                                                                                                         |
| `NDX_STOK_HAREKETLERI_03` | -            | `sth_cari_cinsi`, `sth_cari_kodu`, `sth_tarih`                                                                      |
| `NDX_STOK_HAREKETLERI_04` | -            | `sth_stok_kod`, `sth_tarih`                                                                                         |
| `NDX_STOK_HAREKETLERI_05` | UNIQUE       | `sth_evraktip`, `sth_evrakno_seri`, `sth_evrakno_sira`, `sth_satirno`                                               |
| `NDX_STOK_HAREKETLERI_06` | -            | `sth_plasiyer_kodu`, `sth_tarih`                                                                                    |
| `NDX_STOK_HAREKETLERI_07` | -            | `sth_fat_uid`                                                                                                       |
| `NDX_STOK_HAREKETLERI_08` | -            | `sth_sip_uid`                                                                                                       |
| `NDX_STOK_HAREKETLERI_10` | -            | `sth_cari_cinsi`, `sth_cari_kodu`, `sth_stok_kod`, `sth_tarih`                                                      |
| `NDX_STOK_HAREKETLERI_11` | -            | `sth_stok_kod`, `sth_cari_cinsi`, `sth_cari_kodu`, `sth_tarih`                                                      |
| `NDX_STOK_HAREKETLERI_12` | -            | `sth_exim_kodu`                                                                                                     |
| `NDX_STOK_HAREKETLERI_13` | -            | `sth_isemri_gider_kodu`                                                                                             |
| `NDX_STOK_HAREKETLERI_14` | NONCLUSTERED | `sth_stok_kod`, `sth_cins` INCLUDE (`sth_tarih`, `sth_tip`, `sth_miktar`, `sth_giris_depo_no`, `sth_cikis_depo_no`) |
| `NDX_STOK_HAREKETLERI_15` | -            | `sth_kons_uid`                                                                                                      |

## 🔍 Örnek Sorgular

### Stok Kartı Bazında Toplam Miktar

```sql
SELECT
    sth_stok_kod,
    SUM(CASE WHEN sth_tip = 0 THEN sth_miktar ELSE 0 END) as giris_toplam,
    SUM(CASE WHEN sth_tip = 1 THEN sth_miktar ELSE 0 END) as cikis_toplam,
    SUM(CASE
        WHEN sth_tip = 0 THEN sth_miktar
        WHEN sth_tip = 1 THEN -sth_miktar
        ELSE 0
    END) as net_miktar
FROM STOK_HAREKETLERI
WHERE sth_iptal = 0
GROUP BY sth_stok_kod
```

### Depo Bazında Stok Miktarları

```sql
SELECT
    ISNULL(sth_giris_depo_no, sth_cikis_depo_no) as depo_no,
    sth_stok_kod,
    SUM(CASE
        WHEN sth_tip = 0 THEN sth_miktar
        WHEN sth_tip = 1 THEN -sth_miktar
        WHEN sth_tip = 2 AND sth_giris_depo_no IS NOT NULL THEN sth_miktar
        WHEN sth_tip = 2 AND sth_cikis_depo_no IS NOT NULL THEN -sth_miktar
        ELSE 0
    END) as net_miktar
FROM STOK_HAREKETLERI
WHERE sth_iptal = 0
GROUP BY ISNULL(sth_giris_depo_no, sth_cikis_depo_no), sth_stok_kod
HAVING SUM(CASE
    WHEN sth_tip = 0 THEN sth_miktar
    WHEN sth_tip = 1 THEN -sth_miktar
    WHEN sth_tip = 2 AND sth_giris_depo_no IS NOT NULL THEN sth_miktar
    WHEN sth_tip = 2 AND sth_cikis_depo_no IS NOT NULL THEN -sth_miktar
    ELSE 0
END) <> 0
```

### Cari Bazında Alış Hareketleri

```sql
SELECT
    sth_cari_kodu,
    ch.cari_unvan1,
    sth_stok_kod,
    s.sto_isim,
    sth_tarih,
    sth_miktar,
    sth_tutar,
    sth_iskonto1,
    sth_iskonto2,
    sth_iskonto3,
    sth_vergi
FROM STOK_HAREKETLERI
LEFT JOIN CARI_HESAPLAR ch ON sth_cari_kodu = ch.cari_kod AND sth_cari_cinsi = 0
LEFT JOIN STOKLAR s ON sth_stok_kod = s.sto_kod
WHERE sth_tip = 0 -- Giriş
    AND sth_cari_cinsi = 0 -- Carimiz
    AND sth_iptal = 0
    AND sth_tarih BETWEEN @startDate AND @endDate
ORDER BY sth_tarih DESC, sth_evrakno_sira DESC
```

### Son Alış Fiyatı Bulma

```sql
SELECT TOP 1
    sth_stok_kod,
    sth_tutar / sth_miktar as birim_fiyat,
    sth_tarih,
    sth_cari_kodu
FROM STOK_HAREKETLERI
WHERE sth_stok_kod = @stokKodu
    AND sth_tip = 0 -- Giriş
    AND sth_iptal = 0
    AND sth_miktar > 0
ORDER BY sth_tarih DESC, sth_create_date DESC
```

## 💡 DinamikSAYO Entegrasyonu

### Mapping Önerileri

```javascript
// DinamikSAYO için önerilen mapping
const mikroToSayo = {
  // Temel bilgiler
  _id: "sth_Guid",
  date: "sth_tarih",
  type: "sth_tip", // 0: Giriş, 1: Çıkış, 2: Transfer
  itemCode: "sth_stok_kod",
  quantity: "sth_miktar",
  price: "sth_tutar / sth_miktar", // Birim fiyat
  amount: "sth_tutar",

  // Evrak bilgileri
  docType: "sth_evraktip",
  docSerial: "sth_evrakno_seri",
  docSequence: "sth_evrakno_sira",
  lineNo: "sth_satirno",

  // Cari bilgileri
  firmId: "sth_cari_kodu",
  firmType: "sth_cari_cinsi",

  // Depo bilgileri
  warehouseIn: "sth_giris_depo_no",
  warehouseOut: "sth_cikis_depo_no",

  // İskonto ve vergi
  discount1: "sth_iskonto1",
  discount2: "sth_iskonto2",
  discount3: "sth_iskonto3",
  vatRate: "sth_vergi",

  // Bağlantılar
  orderId: "sth_sip_uid",
  invoiceId: "sth_fat_uid",
}
```

### Önemli Notlar

1. **İptal Kontrolü**: Her sorguda `sth_iptal = 0` kontrolü yapılmalı
2. **Tip Kontrolü**: Giriş/Çıkış/Transfer ayırımı için `sth_tip` alanı kullanılmalı
3. **Miktar Hesaplama**: Net miktar hesabında tip'e göre + veya - işlem yapılmalı
4. **Birim Fiyat**: `sth_tutar / sth_miktar` formülü ile hesaplanır
5. **Depo Bilgisi**: Transfer hareketlerinde hem `sth_giris_depo_no` hem de `sth_cikis_depo_no` dolu olur

## 📚 İlişkili Tablolar

- **STOKLAR**: `sth_stok_kod` → `sto_kod`
- **CARI_HESAPLAR**: `sth_cari_kodu` → `cari_kod`
- **DEPOLAR**: `sth_giris_depo_no`, `sth_cikis_depo_no` → `dep_no`
- **SIPARISLER**: `sth_sip_uid` → `sip_Guid`
- **CARI_HESAP_HAREKETLERI**: `sth_fat_uid` → `cha_Guid`
- **PROJELER**: `sth_proje_kodu` → `prj_kod`

---

**Dinamik Yazılım Ltd. Şti.**  
_Son Güncelleme: 31 Ekim 2025_

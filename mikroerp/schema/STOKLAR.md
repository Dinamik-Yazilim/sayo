# STOKLAR Tablosu - Stok Kartları

## Tablo Özeti

**Tablo Adı:** `STOKLAR`  
**Türkçe Adı:** Stok Kartları  
**Amaç:** Ürün/Malzeme/Hammadde kartlarının temel bilgilerini tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Stoklar tablosu, işletmenin tüm ürün, hammadde, yarı mamul ve mamul kartlarını içerir. Her stok kartı bir ana gruba ve alt gruba bağlıdır.

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `sto_Guid`, `sto_DBCno`, `sto_iptal`, `sto_hidden`, `sto_kilitli`, `sto_create_user`, `sto_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan               | Tip          | Açıklama                  | Örnek             |
| ------------------ | ------------ | ------------------------- | ----------------- |
| `sto_kod`          | Nvarchar(25) | **Stok Kodu (Benzersiz)** | `STK-001`         |
| `sto_isim`         | Nvarchar(50) | **Stok Adı**              | `PVC Reçine K-67` |
| `sto_kisa_ismi`    | Nvarchar(25) | Stok Kısa Adı             | `PVC K-67`        |
| `sto_yabanci_isim` | Nvarchar(50) | Yabancı İsim              | `PVC Resin K-67`  |

### 🏢 İlişkili Kodlar (Foreign Keys)

| Alan               | Referans Tablo         | Açıklama           |
| ------------------ | ---------------------- | ------------------ |
| `sto_sat_cari_kod` | CARI_HESAPLAR          | Satıcı Cari Kodu   |
| `sto_anagrup_kod`  | STOK_ANA_GRUPLARI      | Ana Grup Kodu      |
| `sto_altgrup_kod`  | STOK_ALT_GRUPLARI      | Alt Grup Kodu      |
| `sto_uretici_kodu` | STOK_URETICILERI       | Üretici Kodu       |
| `sto_reyon_kodu`   | STOK_REYONLARI         | Reyon Kodu         |
| `sto_sektor_kodu`  | STOK_SEKTORLERI        | Sektör Kodu        |
| `sto_muhgrup_kodu` | STOK_MUHASEBE_GRUPLARI | Muhasebe Grup Kodu |
| `sto_ambalaj_kodu` | STOK_AMBALAJLARI       | Ambalaj Kodu       |
| `sto_marka_kodu`   | STOK_MARKALARI         | Marka Kodu         |
| `sto_urun_sorkod`  | PERSONELLER            | Ürün Sorumlusu     |

### 📦 Stok Özellikleri

**sto_cins** (Tinyint) - Stok Cinsi:

- 0: Ticari Mal
- 1: İlk Madde
- 2: Ara Mamül
- 3: Yarı Mamül
- 4: Mamül
- 5: Yan Mamül
- 6: İşletme Malzemesi
- 7: Tüketim Malzemesi
- 8: Yedek Parça
- 9: Akaryakıt Stok
- 10: Montaj Reçeteli Mamül
- 11: Temel Hammadde

**sto_detay_takip** (Tinyint) - Detay Takibi:

- 0: Detay takip yok
- 1: Parti bazında
- 2: Parti Lot bazında
- 3: Seri no bazında
- 4: Bağ bazında
- 5: Parti Lot bağ bazında

**sto_doviz_cinsi** (Tinyint) - Döviz türü (DOVIZ_KURLARI tablosuna referans)

**sto_kategori_kodu** (Nvarchar(25)) - Kategori kodu

**sto_muh_kod** (Nvarchar(40)) - Muhasebe hesap kodu

### 📏 Birim Bilgileri (4 Birim)

Her birim için:

- `sto_birimX_ad`: Birim adı (Adet, Kg, Kutu, vb.)
- `sto_birimX_katsayi`: Birim katsayısı
- `sto_birimX_agirlik`: Net ağırlık (kg)
- `sto_birimX_en`: En (mm)
- `sto_birimX_boy`: Boy (mm)
- `sto_birimX_yukseklik`: Yükseklik (mm)
- `sto_birimX_dara`: Dara

**Örnek:**

- Birim 1: Adet (katsayı: 1)
- Birim 2: Koli (katsayı: 12)
- Birim 3: Palet (katsayı: 240)
- Birim 4: Ton (katsayı: 1000)

---

## İndeksler

| İndeks           | Özellik     | Alanlar                              |
| ---------------- | ----------- | ------------------------------------ |
| `NDX_STOKLAR_02` | PRIMARY KEY | `sto_kod`                            |
| `NDX_STOKLAR_00` | UNIQUE      | `sto_Guid`                           |
| `NDX_STOKLAR_03` | Index       | `sto_isim`                           |
| `NDX_STOKLAR_04` | Index       | `sto_anagrup_kod`, `sto_altgrup_kod` |

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Stokları Listele

```sql
SELECT
    sto_kod,
    sto_isim,
    sto_anagrup_kod,
    sto_altgrup_kod,
    sto_birim1_ad
FROM STOKLAR
WHERE sto_iptal = 0
ORDER BY sto_kod
```

### 2. Stok Kartını İlişkileriyle Getir

```sql
SELECT
    s.sto_kod,
    s.sto_isim,
    ag.san_isim AS ana_grup,
    alt.sta_isim AS alt_grup,
    u.urt_ismi AS uretici,
    r.ryn_ismi AS reyon,
    m.mar_ismi AS marka
FROM STOKLAR s
LEFT JOIN STOK_ANA_GRUPLARI ag ON s.sto_anagrup_kod = ag.san_kod
LEFT JOIN STOK_ALT_GRUPLARI alt ON s.sto_altgrup_kod = alt.sta_kod
LEFT JOIN STOK_URETICILERI u ON s.sto_uretici_kodu = u.urt_kod
LEFT JOIN STOK_REYONLARI r ON s.sto_reyon_kodu = r.ryn_kod
LEFT JOIN STOK_MARKALARI m ON s.sto_marka_kodu = m.mar_kod
WHERE s.sto_kod = 'STK-001'
```

### 3. Yeni Stok Kartı Ekle

```sql
INSERT INTO STOKLAR (
    sto_Guid, sto_DBCno, sto_iptal, sto_fileid,
    sto_create_user, sto_create_date,
    sto_kod, sto_isim, sto_kisa_ismi,
    sto_anagrup_kod, sto_altgrup_kod,
    sto_cins, sto_detay_takip,
    sto_birim1_ad, sto_birim1_katsayi
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'STK-100', 'Yeni Ürün', 'Ürün',
    'AG-001', 'ALT-001',
    0, 0,
    'Adet', 1
)
```

---

## TypeScript Arayüzü

```typescript
export interface Stock {
  // Sistem
  stoGuid: string
  stoKod: string
  stoIsim: string
  stoKisaIsmi?: string
  stoYabanciIsim?: string

  // İlişkiler
  stoSatCariKod?: string
  stoAnagrupKod: string
  stoAltgrupKod?: string
  stoUreticiKodu?: string
  stoReyonKodu?: string
  stoSektorKodu?: string
  stoMarkaKodu?: string

  // Özellikler
  stoCins: number
  stoDovizCinsi?: number
  stoDetayTakip: number
  stoKategoriKodu?: string
  stoMuhKod?: string

  // Birim 1
  stoBirim1Ad: string
  stoBirim1Katsayi: number
  stoBirim1Agirlik?: number

  // Durum
  stoIptal: boolean
  stoHidden: boolean
  stoKilitli: boolean
}

export enum StockType {
  TicariMal = 0,
  IlkMadde = 1,
  AraMamul = 2,
  YariMamul = 3,
  Mamul = 4,
  YanMamul = 5,
  IsletmeMalzemesi = 6,
  TuketimMalzemesi = 7,
  YedekParca = 8,
  Akaryakit = 9,
  MontajRecetel = 10,
  TemelHammadde = 11,
}
```

---

## API Endpoint Örneği

```typescript
// GET /api/stocks/:kod
export async function GET(
  req: Request,
  { params }: { params: { kod: string } }
) {
  const query = `
    SELECT 
      s.*,
      ag.san_isim as anaGrupAdi,
      alt.sta_isim as altGrupAdi,
      u.urt_ismi as ureticiAdi
    FROM STOKLAR s
    LEFT JOIN STOK_ANA_GRUPLARI ag ON s.sto_anagrup_kod = ag.san_kod
    LEFT JOIN STOK_ALT_GRUPLARI alt ON s.sto_altgrup_kod = alt.sta_kod
    LEFT JOIN STOK_URETICILERI u ON s.sto_uretici_kodu = u.urt_kod
    WHERE s.sto_kod = @kod AND s.sto_iptal = 0
  `

  const result = await executeQuery(query, { kod: params.kod })
  return Response.json(result[0])
}
```

---

## Önemli Notlar

### 🔑 Birincil Anahtar

- `sto_kod` alanı PRIMARY KEY (benzersiz olmalı)
- `sto_Guid` da UNIQUE (sistem tanımlayıcı)

### 🔗 Zorunlu İlişkiler

- `sto_anagrup_kod` mutlaka dolu olmalı
- Ana grup ve alt grup birlikte kullanılır

### 📦 Birim Sistemi

- En az 1 birim tanımlı olmalı
- Birim katsayıları birim dönüşümünde kullanılır
- Örn: 1 Koli = 12 Adet

### 🏷️ Stok Cinsi

- Üretim şirketleri: Hammadde, Yarı Mamul, Mamul
- Ticaret şirketleri: Ticari Mal
- Hizmet şirketleri: Tüketim Malzemesi

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOK_ANA_GRUPLARI, STOK_ALT_GRUPLARI, STOK_URETICILERI, STOK_REYONLARI, STOK_HAREKETLERI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

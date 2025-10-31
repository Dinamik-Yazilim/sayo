# DEPOLAR Tablosu - Depolar

## Tablo Özeti

**Tablo Adı:** `DEPOLAR`  
**Türkçe Adı:** Depolar  
**Amaç:** Firma ve şubelere ait depo tanımlarını tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Her firma/şubenin birden fazla deposu olabilir (merkez, şube, mağaza, satıcı, gümrük, üretim vb.).

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `dep_Guid`, `dep_DBCno`, `dep_iptal`, `dep_hidden`, `dep_kilitli`, `dep_create_user`, `dep_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan            | Tip          | Açıklama             | Örnek         |
| --------------- | ------------ | -------------------- | ------------- |
| `dep_no`        | Integer      | **Depo No (UNIQUE)** | `1`           |
| `dep_adi`       | Nvarchar(50) | **Depo Adı**         | `Merkez Depo` |
| `dep_firmano`   | Integer      | Firma No             | `1`           |
| `dep_subeno`    | Integer      | Şube No              | `1`           |
| `dep_grup_kodu` | Nvarchar(25) | Depo Grup Kodu       | `MERKEZ`      |

### 🏭 Depo Tipi ve Hareket

**dep_tipi** (Tinyint):

- 0: Merkez Depo
- 1: Şube Depo
- 2: Mağaza Depo
- 3: Market Depo
- 4: Satıcı Depo
- 5: Gümrük Depo
- 6: Mal Kabul Depo
- 7: Ham Madde Depo
- 8: Yarı Mamül Depo
- 9: Üretim Koltuk Depo
- 10: Fason Depo
- 11: Mamül Depo
- 12: Sevk Depo
- 13: Kalite Kontrol Depo
- 14: Konsinye Depo
- 15: Nakliye Depo
- 16: Kiralama Depo

**dep_hareket_tipi** (Tinyint):

- 0: Hareket girilir
- 1: Hareket girilemez
- 2: Sadece giriş yapılır
- 3: Sadece çıkış yapılır

**dep_detay_takibi** (Tinyint):

- 0: Var
- 1: Yok

### 💰 Fiyat ve Muhasebe

| Alan                                 | Tip          | Açıklama                   | FK                    |
| ------------------------------------ | ------------ | -------------------------- | --------------------- |
| `dep_DepoSevkOtoFiyat`               | Tinyint      | Sevkiyat Fiyat Tipi        | -                     |
| `dep_DepoSevkUygFiyat`               | Integer      | Sevk Uygun Fiyat Kodu      | STOKLAR               |
| `dep_BagliOrtakliklaraSatisUygFiyat` | Tinyint      | Bağlı Ortaklık Satış Fiyat | -                     |
| `dep_NakliyefisiSatisFiyatTipi`      | Tinyint      | Nakliye Fişi Fiyat Tipi    | -                     |
| `dep_muh_kodu`                       | Nvarchar(10) | Muhasebe Kodu              | MUHASEBE_HESAP_PLANI  |
| `dep_sor_mer_kodu`                   | Nvarchar(25) | Sorumluluk Merkezi         | SORUMLULUK_MERKEZLERI |
| `dep_proje_kodu`                     | Nvarchar(25) | Proje Kodu                 | -                     |

**Fiyat Tipleri (0-3):**

- 0: Maliyet değeri
- 1: Satış fiyatı
- 2: Satın alma şartları
- 3: Giriş Depo Satın Alma Şartı (bazı alanlar)

### 📍 Adres Bilgileri

| Alan             | Tip          | Açıklama    |
| ---------------- | ------------ | ----------- |
| `dep_cadde`      | Nvarchar(50) | Cadde       |
| `dep_mahalle`    | Nvarchar(50) | Mahalle     |
| `dep_sokak`      | Nvarchar(50) | Sokak       |
| `dep_Semt`       | Nvarchar(25) | Semt        |
| `dep_Apt_No`     | Nvarchar(10) | Apartman No |
| `dep_Daire_No`   | Nvarchar(10) | Daire No    |
| `dep_posta_Kodu` | Nvarchar(8)  | Posta Kodu  |
| `dep_Ilce`       | Nvarchar(50) | İlçe        |
| `dep_Il`         | Nvarchar(50) | İl          |
| `dep_Ulke`       | Nvarchar(50) | Ülke        |
| `dep_Adres_kodu` | Nvarchar(10) | Adres Kodu  |

### 🗺️ GPS ve Bölge

| Alan             | Tip          | Açıklama   |
| ---------------- | ------------ | ---------- |
| `dep_gps_enlem`  | Float        | GPS Enlem  |
| `dep_gps_boylam` | Float        | GPS Boylam |
| `dep_bolge_kodu` | Nvarchar(25) | Bölge Kodu |

### 📞 İletişim

| Alan                 | Tip          | Açıklama        |
| -------------------- | ------------ | --------------- |
| `dep_tel_ulke_kodu`  | Nvarchar(5)  | Ülke Kodu       |
| `dep_tel_bolge_kodu` | Nvarchar(5)  | Bölge Kodu      |
| `dep_tel_no1`        | Nvarchar(10) | Telefon 1       |
| `dep_tel_no2`        | Nvarchar(10) | Telefon 2       |
| `dep_tel_faxno`      | Nvarchar(10) | Fax No          |
| `dep_tel_modem`      | Nvarchar(10) | Modem No        |
| `dep_yetkili_email`  | Nvarchar(50) | Yetkili E-Posta |

### 📦 Depo Özellikleri

**Alan Ölçüleri:**

- `dep_alani` (Float): Toplam Depo Alanı (m²)
- `dep_satis_alani` (Float): Satış Alanı (m²)
- `dep_sergi_alani` (Float): Sergi Alanı (m²)
- `dep_otopark_alani` (Float): Otopark Alanı (m²)
- `dep_rafhacmi` (Float): Raf Hacmi (m³)

**Kapasite:**

- `dep_otopark_kapasite` (Integer): Otopark Kapasitesi (araç)
- `dep_kasa_sayisi` (Integer): Kasa Sayısı
- `dep_kamyon_kasa_hacmi` (Float): Kamyon Kasa Hacmi (m³)
- `dep_kamyon_istiab_haddi` (Float): Kamyon İstiab Haddi (ton)

### 🔧 Diğer Ayarlar

| Alan                     | Tip          | Açıklama                 |
| ------------------------ | ------------ | ------------------------ |
| `dep_KilitTarihi`        | DateTime     | Kilit Tarihi             |
| `dep_envanter_harici_fl` | Bit          | Envanter Deposu mu?      |
| `dep_barkod_yazici_yolu` | Nvarchar(50) | Barkod Yazıcı Yolu       |
| `dep_dizin_adi`          | Nvarchar(50) | Dizin Adı                |
| `dep_fason_sor_mer_kodu` | Nvarchar(25) | Fason Sorumluluk Merkezi |

**dep_EksiyeDusurenStkHar** (Tinyint):

- 0: Genel Ayarlar
- 1: Devam Et
- 2: Uyar Devam Et
- 3: Uyar Devam Etme

---

## İndeksler

| İndeks           | Özellik     | Alanlar                     | Açıklama                |
| ---------------- | ----------- | --------------------------- | ----------------------- |
| `NDX_DEPOLAR_00` | PRIMARY KEY | `dep_Guid`                  | Benzersiz tanımlayıcı   |
| `NDX_DEPOLAR_02` | UNIQUE      | `dep_no`                    | Depo numarası benzersiz |
| `NDX_DEPOLAR_03` | INDEX       | `dep_adi`                   | Depo adına göre arama   |
| `NDX_DEPOLAR_04` | INDEX       | `dep_firmano`, `dep_subeno` | Firma/şube bazlı arama  |
| `NDX_DEPOLAR_05` | INDEX       | `dep_sor_mer_kodu`          | Sorumluluk merkezi      |
| `NDX_DEPOLAR_06` | INDEX       | `dep_grup_kodu`             | Depo grubu              |

---

## Enum Tanımları

```typescript
export enum DepoTipi {
  MerkezDepo = 0,
  SubeDepo = 1,
  MagazaDepo = 2,
  MarketDepo = 3,
  SaticiDepo = 4,
  GumrukDepo = 5,
  MalKabulDepo = 6,
  HamMaddeDepo = 7,
  YariMamulDepo = 8,
  UretimKoltukDepo = 9,
  FasonDepo = 10,
  MamulDepo = 11,
  SevkDepo = 12,
  KaliteKontrolDepo = 13,
  KonsinyeDepo = 14,
  NakliyeDepo = 15,
  KiralamaDepo = 16,
}

export enum DepoHareketTipi {
  HareketGirilir = 0,
  HareketGirilemez = 1,
  SadeceGiris = 2,
  SadeceCikis = 3,
}

export enum DepoFiyatTipi {
  MaliyetDegeri = 0,
  SatisFiyati = 1,
  SatinAlmaSartlari = 2,
  GirisDepoSatinAlma = 3, // Sadece bazı alanlar
}

export enum DepoDetayTakibi {
  Var = 0,
  Yok = 1,
}

export enum DepoEksiyeUyari {
  GenelAyarlar = 0,
  DevamEt = 1,
  UyarDevamEt = 2,
  UyarDevamEtme = 3,
}
```

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Depoları Listele

```sql
SELECT
    dep_no,
    dep_adi,
    dep_tipi,
    dep_firmano,
    dep_subeno,
    dep_Il,
    dep_hareket_tipi
FROM DEPOLAR
WHERE dep_iptal = 0
ORDER BY dep_no
```

### 2. Firma/Şube Bazında Depoları Getir

```sql
SELECT
    dep_no,
    dep_adi,
    dep_tipi,
    CASE dep_tipi
        WHEN 0 THEN 'Merkez Depo'
        WHEN 1 THEN 'Şube Depo'
        WHEN 2 THEN 'Mağaza Depo'
        WHEN 3 THEN 'Market Depo'
        WHEN 4 THEN 'Satıcı Depo'
        WHEN 5 THEN 'Gümrük Depo'
        ELSE 'Diğer'
    END AS depo_tipi_adi,
    dep_alani,
    dep_rafhacmi
FROM DEPOLAR
WHERE dep_firmano = 1
    AND dep_subeno = 1
    AND dep_iptal = 0
ORDER BY dep_adi
```

### 3. Üretim Depolarını Listele

```sql
SELECT
    dep_no,
    dep_adi,
    dep_tipi,
    dep_sor_mer_kodu,
    dep_alani,
    dep_rafhacmi
FROM DEPOLAR
WHERE dep_iptal = 0
    AND dep_tipi IN (7, 8, 9, 10, 11)  -- Ham Madde, Yarı Mamül, Üretim, Fason, Mamül
ORDER BY dep_tipi, dep_adi
```

### 4. Depo Detaylarını Getir (GPS, Adres, İletişim)

```sql
SELECT
    d.dep_no,
    d.dep_adi,
    d.dep_cadde + ' ' + d.dep_mahalle + ' ' + d.dep_sokak AS adres,
    d.dep_Ilce,
    d.dep_Il,
    d.dep_posta_Kodu,
    d.dep_gps_enlem AS latitude,
    d.dep_gps_boylam AS longitude,
    d.dep_tel_no1,
    d.dep_yetkili_email,
    d.dep_alani,
    d.dep_rafhacmi,
    d.dep_otopark_kapasite
FROM DEPOLAR d
WHERE d.dep_no = 1
    AND d.dep_iptal = 0
```

### 5. Yeni Depo Ekle

```sql
INSERT INTO DEPOLAR (
    dep_Guid, dep_DBCno, dep_iptal, dep_fileid,
    dep_create_user, dep_create_date,
    dep_no, dep_adi, dep_firmano, dep_subeno,
    dep_tipi, dep_hareket_tipi, dep_detay_takibi,
    dep_Il, dep_Ilce,
    dep_alani, dep_rafhacmi,
    dep_muh_kodu, dep_sor_mer_kodu
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    5, 'Yeni Merkez Depo', 1, 1,
    0, 0, 0,  -- Merkez Depo, Hareket girilir, Detay var
    'İstanbul', 'Kadıköy',
    500.0, 1000.0,  -- 500 m², 1000 m³
    '120.01.001', 'SRM-001'
)
```

### 6. Depo Grup Bazında Listele

```sql
SELECT
    dep_grup_kodu,
    COUNT(*) AS depo_sayisi,
    SUM(dep_alani) AS toplam_alan,
    SUM(dep_rafhacmi) AS toplam_hacim
FROM DEPOLAR
WHERE dep_iptal = 0
GROUP BY dep_grup_kodu
ORDER BY dep_grup_kodu
```

### 7. Envanter Dışı Depoları Bul

```sql
SELECT
    dep_no,
    dep_adi,
    dep_tipi,
    dep_envanter_harici_fl
FROM DEPOLAR
WHERE dep_iptal = 0
    AND dep_envanter_harici_fl = 1
```

---

## TypeScript Arayüzü

```typescript
export interface Depo {
  // Sistem
  depGuid: string
  depNo: number // UNIQUE
  depAdi: string
  depFirmano: number
  depSubeno: number
  depGrupKodu?: string

  // Tip ve Hareket
  depTipi: DepoTipi
  depHareketTipi: DepoHareketTipi
  depDetayTakibi: DepoDetayTakibi

  // Fiyat ve Muhasebe
  depDepoSevkOtoFiyat: DepoFiyatTipi
  depDepoSevkUygFiyat?: number
  depBagliOrtakliklaraSatisUygFiyat: DepoFiyatTipi
  depNakliyefisiSatisFiyatTipi: DepoFiyatTipi
  depMuhKodu?: string
  depSorMerKodu?: string
  depProjeKodu?: string

  // Adres
  depCadde?: string
  depMahalle?: string
  depSokak?: string
  depSemt?: string
  depAptNo?: string
  depDaireNo?: string
  depPostaKodu?: string
  depIlce?: string
  depIl?: string
  depUlke?: string
  depAdresKodu?: string

  // GPS
  depGpsEnlem?: number
  depGpsBoylam?: number
  depBolgeKodu?: string

  // İletişim
  depTelUlkeKodu?: string
  depTelBolgeKodu?: string
  depTelNo1?: string
  depTelNo2?: string
  depTelFaxno?: string
  depTelModem?: string
  depYetkiliEmail?: string

  // Depo Özellikleri
  depAlani?: number // m²
  depRafhacmi?: number // m³
  depSatisAlani?: number
  depSergiAlani?: number
  depOtoparkAlani?: number
  depOtoparkKapasite?: number
  depKasaSayisi?: number
  depKamyonKasaHacmi?: number
  depKamyonIstiabHaddi?: number

  // Diğer
  depKilitTarihi?: Date
  depEnvanterHariciFl: boolean
  depBarkodYaziciYolu?: string
  depDizinAdi?: string
  depFasonSorMerKodu?: string
  depEksiyeDusurenStkHar: DepoEksiyeUyari

  // Durum
  depIptal: boolean
  depHidden: boolean
  depKilitli: boolean
}

export interface DepoWithDetails extends Depo {
  sorMerAdi?: string
  toplamStokDegeri?: number
  kullanimOrani?: number
}

export interface CreateDepoRequest {
  depNo: number
  depAdi: string
  depFirmano: number
  depSubeno: number
  depTipi: DepoTipi
  depHareketTipi?: DepoHareketTipi
  depIl?: string
  depIlce?: string
  depAlani?: number
  depRafhacmi?: number
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/depolar
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const firmano = searchParams.get("firmano")
  const subeno = searchParams.get("subeno")
  const tip = searchParams.get("tip")

  let where = "dep_iptal = 0"
  const params: any = {}

  if (firmano) {
    where += " AND dep_firmano = @firmano"
    params.firmano = parseInt(firmano)
  }

  if (subeno) {
    where += " AND dep_subeno = @subeno"
    params.subeno = parseInt(subeno)
  }

  if (tip) {
    where += " AND dep_tipi = @tip"
    params.tip = parseInt(tip)
  }

  const query = `
    SELECT 
      dep_Guid as depGuid,
      dep_no as depNo,
      dep_adi as depAdi,
      dep_tipi as depTipi,
      dep_firmano as depFirmano,
      dep_subeno as depSubeno,
      dep_Il as depIl,
      dep_Ilce as depIlce,
      dep_hareket_tipi as depHareketTipi,
      dep_alani as depAlani,
      dep_rafhacmi as depRafhacmi
    FROM DEPOLAR
    WHERE ${where}
    ORDER BY dep_no
  `

  const result = await executeQuery(query, params)
  return Response.json(result)
}

// GET /api/depolar/:no
export async function GET(
  req: Request,
  { params }: { params: { no: string } }
) {
  const query = `
    SELECT 
      d.*,
      sm.srm_adi as sorMerAdi
    FROM DEPOLAR d
    LEFT JOIN SORUMLULUK_MERKEZLERI sm ON d.dep_sor_mer_kodu = sm.srm_kod
    WHERE d.dep_no = @no
      AND d.dep_iptal = 0
  `

  const result = await executeQuery(query, { no: parseInt(params.no) })

  if (!result.length) {
    return Response.json({ error: "Depo bulunamadı" }, { status: 404 })
  }

  return Response.json(result[0])
}

// POST /api/depolar
export async function POST(req: Request) {
  const data: CreateDepoRequest = await req.json()

  // Depo numarası benzersizlik kontrolü
  const checkQuery = `
    SELECT COUNT(*) as count
    FROM DEPOLAR
    WHERE dep_no = @no AND dep_iptal = 0
  `
  const checkResult = await executeQuery(checkQuery, { no: data.depNo })

  if (checkResult[0].count > 0) {
    return Response.json(
      { error: "Bu depo numarası zaten kullanılıyor" },
      { status: 400 }
    )
  }

  const insertQuery = `
    INSERT INTO DEPOLAR (
      dep_Guid, dep_DBCno, dep_iptal, dep_fileid,
      dep_create_user, dep_create_date,
      dep_no, dep_adi,
      dep_firmano, dep_subeno,
      dep_tipi, dep_hareket_tipi, dep_detay_takibi,
      dep_Il, dep_Ilce,
      dep_alani, dep_rafhacmi
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @no, @adi,
      @firmano, @subeno,
      @tipi, @hareketTipi, 0,
      @il, @ilce,
      @alani, @rafhacmi
    )
  `

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    no: data.depNo,
    adi: data.depAdi,
    firmano: data.depFirmano,
    subeno: data.depSubeno,
    tipi: data.depTipi,
    hareketTipi: data.depHareketTipi ?? 0,
    il: data.depIl,
    ilce: data.depIlce,
    alani: data.depAlani,
    rafhacmi: data.depRafhacmi,
  })

  return Response.json(
    { message: "Depo başarıyla oluşturuldu", depNo: data.depNo },
    { status: 201 }
  )
}
```

---

## React Bileşen Örneği

```typescript
// components/depo-select.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DepoSelectProps {
  value?: number
  onValueChange?: (value: number) => void
  firmano?: number
  subeno?: number
  tip?: DepoTipi
  disabled?: boolean
}

export function DepoSelect({
  value,
  onValueChange,
  firmano,
  subeno,
  tip,
  disabled = false,
}: DepoSelectProps) {
  const [depolar, setDepolar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepolar = async () => {
      try {
        const params = new URLSearchParams()
        if (firmano) params.append("firmano", firmano.toString())
        if (subeno) params.append("subeno", subeno.toString())
        if (tip !== undefined) params.append("tip", tip.toString())

        const url = `/api/depolar?${params.toString()}`
        const response = await fetch(url)
        const data = await response.json()
        setDepolar(data)
      } finally {
        setLoading(false)
      }
    }

    fetchDepolar()
  }, [firmano, subeno, tip])

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onValueChange?.(parseInt(val))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Depo seçin..." />
      </SelectTrigger>
      <SelectContent>
        {depolar.map((depo: any) => (
          <SelectItem key={depo.depGuid} value={depo.depNo.toString()}>
            {depo.depNo} - {depo.depAdi}
            {depo.depIl && ` (${depo.depIl})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Depo tipi helper
export function getDepoTipiAdi(tip: DepoTipi): string {
  const tipler = {
    0: "Merkez Depo",
    1: "Şube Depo",
    2: "Mağaza Depo",
    3: "Market Depo",
    4: "Satıcı Depo",
    5: "Gümrük Depo",
    6: "Mal Kabul Depo",
    7: "Ham Madde Depo",
    8: "Yarı Mamül Depo",
    9: "Üretim Koltuk Depo",
    10: "Fason Depo",
    11: "Mamül Depo",
    12: "Sevk Depo",
    13: "Kalite Kontrol Depo",
    14: "Konsinye Depo",
    15: "Nakliye Depo",
    16: "Kiralama Depo",
  }
  return tipler[tip] || "Bilinmeyen"
}
```

---

## Önemli Notlar

### 🔑 Benzersizlik

- `dep_no` alanı UNIQUE - her depo numarası benzersiz
- Firma/Şube kombinasyonu ile birden fazla depo olabilir

### 🏭 Depo Tipleri

- **0-3**: Satış depoları (Merkez, Şube, Mağaza, Market)
- **4-6**: Özel depolar (Satıcı, Gümrük, Mal Kabul)
- **7-11**: Üretim depoları (Ham Madde → Yarı Mamül → Üretim → Fason → Mamül)
- **12-16**: Lojistik depolar (Sevk, Kalite Kontrol, Konsinye, Nakliye, Kiralama)

### 📊 Hareket Kontrolleri

- **Hareket Girilemez (1)**: Pasif depo, sadece görüntüleme
- **Sadece Giriş (2)**: Mal kabul, satın alma depoları
- **Sadece Çıkış (3)**: Sevk, nakliye depoları

### 💰 Fiyat Stratejileri

- **Depo Sevk Fiyat**: Depolar arası transferde kullanılan fiyat
- **Bağlı Ortaklık Fiyat**: Şirketler arası satışlarda fiyat
- **Nakliye Fişi Fiyat**: Sevkiyat belgelerinde fiyat
- Çıkış/Giriş depo bazlı farklı fiyatlandırma

### 🔒 Kilit Tarihi

- `dep_KilitTarihi`: Bu tarihten önceki hareketler kilitlenir
- Geçmiş tarihli işlemlerin önlenmesi için kullanılır

### 📦 Kapasite Yönetimi

- Alan, hacim, otopark kapasitesi takibi
- Kamyon/araç kapasiteleri
- Kasa ve raf planlaması

### ⚠️ Eksiye Düşme Uyarısı

- Stok eksiye düştüğünde nasıl davranılacağını belirler
- Depo bazında farklı kurallar tanımlanabilir

### 🗺️ GPS Entegrasyonu

- Depo lokasyonları harita üzerinde gösterilebilir
- Lojistik planlama ve rota optimizasyonu

---

## Kullanım Senaryoları

### 1. Üretim Süreci Depo Zinciri

```
Ham Madde (7) → Üretim (9) → Yarı Mamül (8) → Mamül (11) → Sevk (12)
```

### 2. Satış Depo Hiyerarşisi

```
Merkez Depo (0) → Şube Depoları (1) → Mağaza Depoları (2)
```

### 3. Fason Üretim

```
Merkez (0) → Fason Depo (10) → Kalite Kontrol (13) → Mamül (11)
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, MUHASEBE_HESAP_PLANI, SORUMLULUK_MERKEZLERI, STOK_HAREKETLERI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

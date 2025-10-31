# CARI_HESAP_ADRESLERI Tablosu - Cari Adresleri

## Tablo Özeti

**Tablo Adı:** `CARI_HESAP_ADRESLERI`  
**Türkçe Adı:** Cari Adresleri  
**Amaç:** Cari hesaplara ait adres bilgilerini tutar (fatura, sevk, iletişim adresleri)  
**Veri Tabanı:** Mikro ERP V16/V17

Her cari hesabın birden fazla adresi olabilir (merkez, şube, fatura adresi, sevk adresi vb.).

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `adr_Guid`, `adr_DBCno`, `adr_iptal`, `adr_hidden`, `adr_kilitli`, `adr_create_user`, `adr_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan             | Tip          | Açıklama           | Örnek      |
| ---------------- | ------------ | ------------------ | ---------- |
| `adr_cari_kod`   | Nvarchar(25) | **Cari Kodu (FK)** | `CARI-001` |
| `adr_adres_no`   | Integer      | **Adres No**       | `1`        |
| `adr_Adres_kodu` | Nvarchar(10) | Adres Kodu         | `MRK`      |

### 📍 Adres Detayları

| Alan             | Tip          | Açıklama    |
| ---------------- | ------------ | ----------- |
| `adr_cadde`      | Nvarchar(50) | Cadde       |
| `adr_mahalle`    | Nvarchar(50) | Mahalle     |
| `adr_sokak`      | Nvarchar(50) | Sokak       |
| `adr_Semt`       | Nvarchar(25) | Semt        |
| `adr_Apt_No`     | Nvarchar(10) | Apartman No |
| `adr_Daire_No`   | Nvarchar(10) | Daire No    |
| `adr_posta_kodu` | Nvarchar(8)  | Posta Kodu  |
| `adr_ilce`       | Nvarchar(50) | İlçe        |
| `adr_il`         | Nvarchar(50) | İl          |
| `adr_ulke`       | Nvarchar(50) | Ülke        |

### 📞 İletişim Bilgileri

| Alan                 | Tip          | Açıklama         |
| -------------------- | ------------ | ---------------- |
| `adr_tel_ulke_kodu`  | Nvarchar(5)  | Ülke Kodu (90)   |
| `adr_tel_bolge_kodu` | Nvarchar(5)  | Bölge Kodu (212) |
| `adr_tel_no1`        | Nvarchar(10) | Telefon 1        |
| `adr_tel_no2`        | Nvarchar(10) | Telefon 2        |
| `adr_tel_faxno`      | Nvarchar(10) | Fax No           |
| `adr_tel_modem`      | Nvarchar(10) | Modem No         |

### 🗺️ Lokasyon ve Ziyaret

**GPS Koordinatları:**

- `adr_gps_enlem` (Float): Enlem (+Kuzey, -Güney)
- `adr_gps_boylam` (Float): Boylam (+Doğu, -Batı)

**Ziyaret Bilgileri:**

**adr_ziyaretperyodu** (Tinyint):

- 0: Ziyaret edilmeyecek
- 1: Her gün
- 2: Haftada bir
- 3: Onbeş günde bir
- 4: Ayda bir
- 5: Üç ayda bir
- 6: Altı ayda bir
- 7: Yılda bir
- 8: Üç haftada bir
- 9: Haftada iki
- 10: Haftada üç
- 11: Haftada dört
- 12: Haftada beş

**adr_ziyaretgunu** (Float):

- 1: Pazartesi
- 2: Salı
- 3: Çarşamba
- 4: Perşembe
- 5: Cuma
- 6: Cumartesi
- 7: Pazar

**adr_ziyarethaftasi** (Tinyint):

- 0: İlk Hafta
- 1: İkinci Hafta
- 2: Üçüncü Hafta

**İkinci Ziyaret Günleri (Bit):**

- `adr_ziygunu2_1` - `adr_ziygunu2_7`: Pazartesi'den Pazar'a kadar ikinci ziyaret günleri

### 📧 E-Belge Bilgileri

| Alan                  | Tip           | Açıklama                         |
| --------------------- | ------------- | -------------------------------- |
| `adr_efatura_alias`   | Nvarchar(120) | e-Fatura Alias (GB, PK, E-Posta) |
| `adr_eirsaliye_alias` | Nvarchar(120) | e-İrsaliye Alias                 |

### 🔧 Diğer Alanlar

| Alan                | Tip          | Açıklama                                 |
| ------------------- | ------------ | ---------------------------------------- |
| `adr_aprint_fl`     | Bit          | Yazıcıya basılacak mı? (0:Hayır, 1:Evet) |
| `adr_yon_kodu`      | Nvarchar(4)  | Yön Kodu                                 |
| `adr_uzaklik_kodu`  | Smallint     | Uzaklık Kodu                             |
| `adr_temsilci_kodu` | Nvarchar(25) | Temsilci Kodu                            |
| `adr_ozel_not`      | Nvarchar(50) | Özel Not                                 |

---

## İndeksler

| İndeks                        | Özellik     | Alanlar                        | Açıklama                       |
| ----------------------------- | ----------- | ------------------------------ | ------------------------------ |
| `NDX_CARI_HESAP_ADRESLERI_00` | PRIMARY KEY | `adr_Guid`                     | Benzersiz tanımlayıcı          |
| `NDX_CARI_HESAP_ADRESLERI_02` | UNIQUE      | `adr_cari_kod`, `adr_adres_no` | Cari başına adres no benzersiz |

---

## SQL Sorgu Örnekleri

### 1. Cari Hesabın Tüm Adreslerini Listele

```sql
SELECT
    adr_adres_no,
    adr_Adres_kodu,
    adr_cadde,
    adr_mahalle,
    adr_semt,
    adr_ilce,
    adr_il,
    adr_posta_kodu
FROM CARI_HESAP_ADRESLERI
WHERE adr_cari_kod = 'CARI-001'
    AND adr_iptal = 0
ORDER BY adr_adres_no
```

### 2. Fatura ve Sevk Adreslerini Getir

```sql
SELECT
    c.cari_kod,
    c.cari_unvan1,
    fa.adr_cadde AS fatura_cadde,
    fa.adr_il AS fatura_il,
    sa.adr_cadde AS sevk_cadde,
    sa.adr_il AS sevk_il
FROM CARI_HESAPLAR c
LEFT JOIN CARI_HESAP_ADRESLERI fa
    ON c.cari_fatura_adres_no = fa.adr_adres_no
    AND c.cari_kod = fa.adr_cari_kod
LEFT JOIN CARI_HESAP_ADRESLERI sa
    ON c.cari_sevk_adres_no = sa.adr_adres_no
    AND c.cari_kod = sa.adr_cari_kod
WHERE c.cari_kod = 'CARI-001'
```

### 3. Yeni Adres Ekle

```sql
-- Önce son adres numarasını bul
DECLARE @son_adres_no INT
SELECT @son_adres_no = ISNULL(MAX(adr_adres_no), 0)
FROM CARI_HESAP_ADRESLERI
WHERE adr_cari_kod = 'CARI-001'

-- Yeni adres ekle
INSERT INTO CARI_HESAP_ADRESLERI (
    adr_Guid, adr_DBCno, adr_iptal, adr_fileid,
    adr_create_user, adr_create_date,
    adr_cari_kod, adr_adres_no,
    adr_cadde, adr_mahalle, adr_sokak,
    adr_ilce, adr_il, adr_posta_kodu,
    adr_tel_ulke_kodu, adr_tel_bolge_kodu, adr_tel_no1
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'CARI-001', @son_adres_no + 1,
    'Atatürk Cad.', 'Merkez Mah.', '15. Sokak',
    'Kadıköy', 'İstanbul', '34710',
    '90', '216', '1234567'
)
```

### 4. Ziyaret Planı Olan Adresleri Listele

```sql
SELECT
    a.adr_cari_kod,
    c.cari_unvan1,
    a.adr_cadde,
    a.adr_il,
    a.adr_ziyaretperyodu,
    a.adr_ziyaretgunu,
    a.adr_gps_enlem,
    a.adr_gps_boylam
FROM CARI_HESAP_ADRESLERI a
INNER JOIN CARI_HESAPLAR c ON a.adr_cari_kod = c.cari_kod
WHERE a.adr_iptal = 0
    AND a.adr_ziyaretperyodu > 0
ORDER BY a.adr_ziyaretgunu
```

### 5. GPS Koordinatları Olan Adresleri Getir

```sql
SELECT
    adr_cari_kod,
    adr_cadde,
    adr_il,
    adr_gps_enlem AS latitude,
    adr_gps_boylam AS longitude
FROM CARI_HESAP_ADRESLERI
WHERE adr_iptal = 0
    AND adr_gps_enlem IS NOT NULL
    AND adr_gps_boylam IS NOT NULL
```

---

## TypeScript Arayüzü

```typescript
export interface CariAdres {
  // Sistem
  adrGuid: string
  adrCariKod: string
  adrAdresNo: number
  adrAdresKodu?: string

  // Adres
  adrCadde?: string
  adrMahalle?: string
  adrSokak?: string
  adrSemt?: string
  adrAptNo?: string
  adrDaireNo?: string
  adrPostaKodu?: string
  adrIlce?: string
  adrIl?: string
  adrUlke?: string

  // İletişim
  adrTelUlkeKodu?: string
  adrTelBolgeKodu?: string
  adrTelNo1?: string
  adrTelNo2?: string
  adrTelFaxno?: string
  adrTelModem?: string

  // GPS
  adrGpsEnlem?: number // +Kuzey -Güney
  adrGpsBoylam?: number // +Doğu -Batı

  // Ziyaret
  adrZiyaretperyodu: ZiyaretPeryodu
  adrZiyaretgunu?: number
  adrZiyarethaftasi?: ZiyaretHaftasi
  adrZiygunu21?: boolean
  adrZiygunu22?: boolean
  adrZiygunu23?: boolean
  adrZiygunu24?: boolean
  adrZiygunu25?: boolean
  adrZiygunu26?: boolean
  adrZiygunu27?: boolean

  // E-Belge
  adrEfaturaAlias?: string
  adrEirsaliyeAlias?: string

  // Diğer
  adrAprintFl: boolean
  adrYonKodu?: string
  adrUzaklikKodu?: number
  adrTemsilciKodu?: string
  adrOzelNot?: string

  // Durum
  adrIptal: boolean
}

export enum ZiyaretPeryodu {
  Yok = 0,
  HerGun = 1,
  HaftadaBir = 2,
  OnbesGunde = 3,
  AydaBir = 4,
  UcAyda = 5,
  AltiAyda = 6,
  YildaBir = 7,
  UcHaftada = 8,
  HaftadaIki = 9,
  HaftadaUc = 10,
  HaftadaDort = 11,
  HaftadaBes = 12,
}

export enum ZiyaretHaftasi {
  IlkHafta = 0,
  IkinciHafta = 1,
  UcuncuHafta = 2,
}

export interface CreateAdresRequest {
  adrCariKod: string
  adrCadde?: string
  adrMahalle?: string
  adrSokak?: string
  adrIlce?: string
  adrIl?: string
  adrPostaKodu?: string
  adrTelNo1?: string
  adrGpsEnlem?: number
  adrGpsBoylam?: number
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/cari-hesaplar/:cariKod/adresler
export async function GET(
  req: Request,
  { params }: { params: { cariKod: string } }
) {
  const query = `
    SELECT 
      adr_Guid as adrGuid,
      adr_adres_no as adrAdresNo,
      adr_Adres_kodu as adrAdresKodu,
      adr_cadde as adrCadde,
      adr_mahalle as adrMahalle,
      adr_ilce as adrIlce,
      adr_il as adrIl,
      adr_tel_no1 as adrTelNo1,
      adr_efatura_alias as adrEfaturaAlias
    FROM CARI_HESAP_ADRESLERI
    WHERE adr_cari_kod = @cariKod
      AND adr_iptal = 0
    ORDER BY adr_adres_no
  `

  const result = await executeQuery(query, { cariKod: params.cariKod })
  return Response.json(result)
}

// POST /api/cari-hesaplar/:cariKod/adresler
export async function POST(
  req: Request,
  { params }: { params: { cariKod: string } }
) {
  const data: CreateAdresRequest = await req.json()

  // Son adres numarasını bul
  const maxQuery = `
    SELECT ISNULL(MAX(adr_adres_no), 0) as maxNo
    FROM CARI_HESAP_ADRESLERI
    WHERE adr_cari_kod = @cariKod
  `
  const maxResult = await executeQuery(maxQuery, { cariKod: params.cariKod })
  const yeniAdresNo = maxResult[0].maxNo + 1

  const insertQuery = `
    INSERT INTO CARI_HESAP_ADRESLERI (
      adr_Guid, adr_DBCno, adr_iptal, adr_fileid,
      adr_create_user, adr_create_date,
      adr_cari_kod, adr_adres_no,
      adr_cadde, adr_mahalle, adr_sokak,
      adr_ilce, adr_il, adr_posta_kodu,
      adr_tel_no1, adr_gps_enlem, adr_gps_boylam
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @cariKod, @adresNo,
      @cadde, @mahalle, @sokak,
      @ilce, @il, @postaKodu,
      @telNo1, @gpsEnlem, @gpsBoylam
    )
  `

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    cariKod: params.cariKod,
    adresNo: yeniAdresNo,
    cadde: data.adrCadde,
    mahalle: data.adrMahalle,
    sokak: data.adrSokak,
    ilce: data.adrIlce,
    il: data.adrIl,
    postaKodu: data.adrPostaKodu,
    telNo1: data.adrTelNo1,
    gpsEnlem: data.adrGpsEnlem,
    gpsBoylam: data.adrGpsBoylam,
  })

  return Response.json(
    { message: "Adres başarıyla eklendi", adresNo: yeniAdresNo },
    { status: 201 }
  )
}
```

---

## React Bileşen Örneği

```typescript
// components/cari-adres-list.tsx
"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone } from "lucide-react"

interface AdresListProps {
  cariKod: string
}

export function CariAdresList({ cariKod }: AdresListProps) {
  const [adresler, setAdresler] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdresler = async () => {
      try {
        const response = await fetch(`/api/cari-hesaplar/${cariKod}/adresler`)
        const data = await response.json()
        setAdresler(data)
      } finally {
        setLoading(false)
      }
    }

    fetchAdresler()
  }, [cariKod])

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-4">
      {adresler.map((adres: any) => (
        <div key={adres.adrGuid} className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">
                  Adres {adres.adrAdresNo}
                  {adres.adrAdresKodu && ` (${adres.adrAdresKodu})`}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                {adres.adrCadde} {adres.adrMahalle}
              </p>
              <p className="text-sm text-gray-700">
                {adres.adrIlce} / {adres.adrIl}
              </p>

              {adres.adrTelNo1 && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{adres.adrTelNo1}</span>
                </div>
              )}

              {adres.adrEfaturaAlias && (
                <p className="text-xs text-gray-500 mt-2">
                  e-Fatura: {adres.adrEfaturaAlias}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {adresler.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Kayıtlı adres bulunamadı
        </p>
      )}
    </div>
  )
}
```

---

## Önemli Notlar

### 🔑 Composite Unique Key

- `adr_cari_kod + adr_adres_no` kombinasyonu benzersiz
- Her cari için adres numarası 1'den başlar ve artar

### 📍 Fatura vs Sevk Adresi

- CARI_HESAPLAR tablosunda `cari_fatura_adres_no` ve `cari_sevk_adres_no` alanları bu tabloya referans verir
- Bir adres hem fatura hem sevk adresi olabilir

### 🗺️ GPS Koordinatları

- Mobil satış ekipleri için konum bilgisi
- Rota optimizasyonu ve saha takibi için kullanılır
- Enlem: +40.7128 (Kuzey), -33.8688 (Güney)
- Boylam: +29.0128 (Doğu), -118.2437 (Batı)

### 📅 Ziyaret Planlaması

- Satış temsilcilerinin ziyaret rotası oluşturulur
- Haftalık, aylık, dönemsel ziyaret planları
- İkinci ziyaret günleri ile esneklik sağlanır

### 📧 E-Belge Entegrasyonu

- e-Fatura ve e-İrsaliye için GB, PK veya e-posta adresi
- GİB entegrasyonu için zorunlu

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: CARI_HESAPLAR
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

# CARI_HESAP_YETKILILERI Tablosu - Cari Yetkilileri

## Tablo Özeti

**Tablo Adı:** `CARI_HESAP_YETKILILERI`  
**Türkçe Adı:** Cari Yetkilileri  
**Amaç:** Cari hesaplara ait yetkili kişilerin bilgilerini tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Her cari hesap için birden fazla yetkili tanımlanabilir (genel müdür, satın alma müdürü, muhasebe sorumlusu vb.).

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `mye_Guid`, `mye_DBCno`, `mye_iptal`, `mye_hidden`, `mye_kilitli`, `mye_create_user`, `mye_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan           | Tip          | Açıklama            | FK                   |
| -------------- | ------------ | ------------------- | -------------------- |
| `mye_cari_kod` | Nvarchar(25) | **Cari Kodu**       | CARI_HESAPLAR        |
| `mye_adres_no` | Integer      | Adres No            | CARI_HESAP_ADRESLERI |
| `mye_isim`     | Nvarchar(30) | **Yetkili İsmi**    | -                    |
| `mye_soyisim`  | Nvarchar(30) | **Yetkili Soyismi** | -                    |

### 👤 Kişisel Bilgiler

| Alan                 | Tip          | Açıklama        |
| -------------------- | ------------ | --------------- |
| `mye_dogum_tarihi`   | DateTime     | Doğum Tarihi    |
| `mye_dogum_yeri`     | Nvarchar(30) | Doğum Yeri      |
| `mye_tc_kimlikno`    | Nvarchar(20) | TC Kimlik No    |
| `mye_vergi_dairesi`  | Nvarchar(20) | Vergi Dairesi   |
| `mye_vergi_kimlikno` | Nvarchar(20) | Vergi Kimlik No |

### 💍 Aile Bilgileri

| Alan                 | Tip          | Açıklama        |
| -------------------- | ------------ | --------------- |
| `mye_evlilik_tarih`  | DateTime     | Evlilik Tarihi  |
| `mye_es_isim`        | Nvarchar(30) | Eş İsmi         |
| `mye_es_dogum_tarih` | DateTime     | Eş Doğum Tarihi |

### 💼 İş Bilgileri

**mye_unvan** (Tinyint):

- Ünvan kodu (şirket içi pozisyon)

**mye_hitap** (Tinyint):

- Hitap şekli kodu

**mye_hisse** (Tinyint):

- 0: Yok
- 1: Ortak
- 2: Tüm

**mye_tahsil** (Tinyint):

- 0: Tahsili Yok
- 1: İlk
- 2: Orta
- 3: Lise
- 4: Yüksek
- 5: Fakülte
- 6: Yüksek Lisans
- 7: Doktora
- 8: Fakülte Temel Bilgi
- 9: Yüksek Lisans Temel Bilgi
- 10: Okul Öncesi

### 📞 İletişim Bilgileri

| Alan               | Tip          | Açıklama       |
| ------------------ | ------------ | -------------- |
| `mye_dahili_telno` | Nvarchar(5)  | Dahili Telefon |
| `mye_is_telno`     | Nvarchar(17) | İş Telefonu    |
| `mye_ev_telno`     | Nvarchar(17) | Ev Telefonu    |
| `mye_cep_telno`    | Nvarchar(17) | Cep Telefonu   |
| `mye_email_adres`  | Nvarchar(50) | E-Posta Adresi |
| `mye_KEP_adresi`   | Nvarchar(80) | KEP Adresi     |

### 🏠 Ev Adresi

| Alan                | Tip          | Açıklama    |
| ------------------- | ------------ | ----------- |
| `mye_ev_cadde`      | Nvarchar(50) | Cadde       |
| `mye_ev_mahalle`    | Nvarchar(50) | Mahalle     |
| `mye_ev_sokak`      | Nvarchar(50) | Sokak       |
| `mye_ev_Semt`       | Nvarchar(25) | Semt        |
| `mye_ev_Apt_No`     | Nvarchar(10) | Apartman No |
| `mye_ev_Daire_No`   | Nvarchar(10) | Daire No    |
| `mye_ev_posta_kodu` | Nvarchar(8)  | Posta Kodu  |
| `mye_ev_ilce`       | Nvarchar(50) | İlçe        |
| `mye_ev_il`         | Nvarchar(50) | İl          |
| `mye_ev_ulke`       | Nvarchar(50) | Ülke        |
| `mye_ev_adres_kodu` | Nvarchar(10) | Adres Kodu  |

### ✅ Yetki ve Roller

| Alan                         | Tip | Açıklama                |
| ---------------------------- | --- | ----------------------- |
| `mye_mutabakat_yetkilisi_fl` | Bit | Mutabakat Yetkilisi mi? |

---

## İndeksler

| İndeks                          | Özellik     | Alanlar                                                   | Açıklama                  |
| ------------------------------- | ----------- | --------------------------------------------------------- | ------------------------- |
| `NDX_CARI_HESAP_YETKILILERI_00` | PRIMARY KEY | `mye_Guid`                                                | Benzersiz tanımlayıcı     |
| `NDX_CARI_HESAP_YETKILILERI_02` | INDEX       | `mye_cari_kod`, `mye_adres_no`                            | Cari ve adrese göre arama |
| `NDX_CARI_HESAP_YETKILILERI_03` | INDEX       | `mye_isim`, `mye_soyisim`, `mye_cari_kod`, `mye_adres_no` | İsme göre arama           |
| `NDX_CARI_HESAP_YETKILILERI_04` | INDEX       | `mye_soyisim`, `mye_isim`, `mye_cari_kod`, `mye_adres_no` | Soyisme göre arama        |

---

## Enum Tanımları

```typescript
export enum HisseDurumu {
  Yok = 0,
  Ortak = 1,
  Tum = 2,
}

export enum TahsilDurumu {
  TahsiliYok = 0,
  Ilk = 1,
  Orta = 2,
  Lise = 3,
  Yuksek = 4,
  Fakulte = 5,
  YuksekLisans = 6,
  Doktora = 7,
  FakulteTemelBilgi = 8,
  YuksekLisansTemelBilgi = 9,
  OkulOncesi = 10,
}
```

---

## SQL Sorgu Örnekleri

### 1. Cari Hesabın Tüm Yetkililerini Listele

```sql
SELECT
    mye_isim,
    mye_soyisim,
    mye_unvan,
    mye_email_adres,
    mye_cep_telno,
    mye_dahili_telno,
    mye_mutabakat_yetkilisi_fl
FROM CARI_HESAP_YETKILILERI
WHERE mye_cari_kod = 'CARI-001'
    AND mye_iptal = 0
ORDER BY mye_soyisim, mye_isim
```

### 2. Mutabakat Yetkililerini Getir

```sql
SELECT
    y.mye_cari_kod,
    c.cari_unvan1,
    y.mye_isim + ' ' + y.mye_soyisim AS yetkili_adi,
    y.mye_email_adres,
    y.mye_cep_telno,
    y.mye_is_telno
FROM CARI_HESAP_YETKILILERI y
INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
WHERE y.mye_mutabakat_yetkilisi_fl = 1
    AND y.mye_iptal = 0
    AND c.cari_iptal = 0
ORDER BY c.cari_unvan1
```

### 3. Adres Bazında Yetkilileri Listele

```sql
SELECT
    y.mye_isim + ' ' + y.mye_soyisim AS yetkili,
    y.mye_email_adres,
    y.mye_cep_telno,
    a.adr_cadde + ' ' + a.adr_ilce + '/' + a.adr_il AS adres
FROM CARI_HESAP_YETKILILERI y
INNER JOIN CARI_HESAP_ADRESLERI a
    ON y.mye_cari_kod = a.adr_cari_kod
    AND y.mye_adres_no = a.adr_adres_no
WHERE y.mye_cari_kod = 'CARI-001'
    AND y.mye_iptal = 0
    AND a.adr_iptal = 0
```

### 4. Yetkili İsim veya Soyisme Göre Ara

```sql
SELECT
    y.mye_cari_kod,
    c.cari_unvan1,
    y.mye_isim,
    y.mye_soyisim,
    y.mye_email_adres,
    y.mye_cep_telno
FROM CARI_HESAP_YETKILILERI y
INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
WHERE (y.mye_isim LIKE '%Ahmet%' OR y.mye_soyisim LIKE '%Ahmet%')
    AND y.mye_iptal = 0
ORDER BY y.mye_soyisim, y.mye_isim
```

### 5. Yeni Yetkili Ekle

```sql
INSERT INTO CARI_HESAP_YETKILILERI (
    mye_Guid, mye_DBCno, mye_iptal, mye_fileid,
    mye_create_user, mye_create_date,
    mye_cari_kod, mye_adres_no,
    mye_isim, mye_soyisim,
    mye_email_adres, mye_cep_telno,
    mye_is_telno, mye_dahili_telno,
    mye_unvan, mye_tahsil,
    mye_mutabakat_yetkilisi_fl
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'CARI-001', 1,
    'Ahmet', 'Yılmaz',
    'ahmet.yilmaz@firma.com', '0532 123 4567',
    '0212 345 6789', '1234',
    1, 5,  -- Ünvan: 1, Tahsil: Fakülte
    1  -- Mutabakat yetkilisi
)
```

### 6. E-Posta ve Telefon Bilgileri ile Detaylı Liste

```sql
SELECT
    c.cari_kod,
    c.cari_unvan1,
    y.mye_isim + ' ' + y.mye_soyisim AS yetkili_adi,
    y.mye_email_adres,
    y.mye_cep_telno,
    y.mye_is_telno,
    y.mye_dahili_telno,
    y.mye_KEP_adresi,
    CASE y.mye_hisse
        WHEN 0 THEN 'Yok'
        WHEN 1 THEN 'Ortak'
        WHEN 2 THEN 'Tüm'
    END AS hisse_durumu,
    CASE y.mye_tahsil
        WHEN 0 THEN 'Tahsili Yok'
        WHEN 1 THEN 'İlk'
        WHEN 2 THEN 'Orta'
        WHEN 3 THEN 'Lise'
        WHEN 4 THEN 'Yüksek'
        WHEN 5 THEN 'Fakülte'
        WHEN 6 THEN 'Yüksek Lisans'
        WHEN 7 THEN 'Doktora'
    END AS tahsil
FROM CARI_HESAP_YETKILILERI y
INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
WHERE y.mye_iptal = 0
    AND c.cari_iptal = 0
ORDER BY c.cari_unvan1, y.mye_soyisim
```

### 7. Doğum Günü Yaklaşan Yetkililer

```sql
SELECT
    y.mye_isim + ' ' + y.mye_soyisim AS yetkili,
    c.cari_unvan1,
    y.mye_dogum_tarihi,
    DAY(y.mye_dogum_tarihi) AS gun,
    MONTH(y.mye_dogum_tarihi) AS ay,
    y.mye_email_adres,
    y.mye_cep_telno
FROM CARI_HESAP_YETKILILERI y
INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
WHERE y.mye_dogum_tarihi IS NOT NULL
    AND MONTH(y.mye_dogum_tarihi) = MONTH(GETDATE())
    AND DAY(y.mye_dogum_tarihi) >= DAY(GETDATE())
    AND y.mye_iptal = 0
ORDER BY DAY(y.mye_dogum_tarihi)
```

---

## TypeScript Arayüzü

```typescript
export interface CariYetkili {
  // Sistem
  myeGuid: string
  myeCariKod: string
  myeAdresNo?: number

  // Kişisel Bilgiler
  myeIsim: string
  myeSoyisim: string
  myeDogumTarihi?: Date
  myeDogumYeri?: string
  myeTcKimlikno?: string
  myeVergiDairesi?: string
  myeVergiKimlikno?: string

  // Aile Bilgileri
  myeEvlilikTarih?: Date
  myeEsIsim?: string
  myeEsDogumTarih?: Date

  // İş Bilgileri
  myeUnvan?: number
  myeHitap?: number
  myeHisse: HisseDurumu
  myeTahsil: TahsilDurumu

  // İletişim
  myeDahiliTelno?: string
  myeIsTelno?: string
  myeEvTelno?: string
  myeCepTelno?: string
  myeEmailAdres?: string
  myeKEPAdresi?: string

  // Ev Adresi
  myeEvCadde?: string
  myeEvMahalle?: string
  myeEvSokak?: string
  myeEvSemt?: string
  myeEvAptNo?: string
  myeEvDaireNo?: string
  myeEvPostaKodu?: string
  myeEvIlce?: string
  myeEvIl?: string
  myeEvUlke?: string
  myeEvAdresKodu?: string

  // Yetki
  myeMutabakatYetkilisiFl: boolean

  // Durum
  myeIptal: boolean
}

export interface YetkiliWithCari extends CariYetkili {
  cariUnvan1: string
  adresBilgisi?: string
}

export interface CreateYetkiliRequest {
  myeCariKod: string
  myeAdresNo?: number
  myeIsim: string
  myeSoyisim: string
  myeEmailAdres?: string
  myeCepTelno?: string
  myeIsTelno?: string
  myeDahiliTelno?: string
  myeUnvan?: number
  myeMutabakatYetkilisiFl?: boolean
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/cari-hesaplar/:cariKod/yetkililer
export async function GET(
  req: Request,
  { params }: { params: { cariKod: string } }
) {
  const { searchParams } = new URL(req.url)
  const mutabakat = searchParams.get("mutabakat")

  let where = "mye_cari_kod = @cariKod AND mye_iptal = 0"
  const queryParams: any = { cariKod: params.cariKod }

  if (mutabakat === "true") {
    where += " AND mye_mutabakat_yetkilisi_fl = 1"
  }

  const query = `
    SELECT 
      mye_Guid as myeGuid,
      mye_cari_kod as myeCariKod,
      mye_adres_no as myeAdresNo,
      mye_isim as myeIsim,
      mye_soyisim as myeSoyisim,
      mye_email_adres as myeEmailAdres,
      mye_cep_telno as myeCepTelno,
      mye_is_telno as myeIsTelno,
      mye_dahili_telno as myeDahiliTelno,
      mye_unvan as myeUnvan,
      mye_hisse as myeHisse,
      mye_tahsil as myeTahsil,
      mye_mutabakat_yetkilisi_fl as myeMutabakatYetkilisiFl
    FROM CARI_HESAP_YETKILILERI
    WHERE ${where}
    ORDER BY mye_soyisim, mye_isim
  `

  const result = await executeQuery(query, queryParams)
  return Response.json(result)
}

// GET /api/yetkililer/:guid
export async function GET(
  req: Request,
  { params }: { params: { guid: string } }
) {
  const query = `
    SELECT 
      y.*,
      c.cari_unvan1,
      a.adr_cadde + ' ' + a.adr_ilce + '/' + a.adr_il as adresBilgisi
    FROM CARI_HESAP_YETKILILERI y
    INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
    LEFT JOIN CARI_HESAP_ADRESLERI a 
      ON y.mye_cari_kod = a.adr_cari_kod 
      AND y.mye_adres_no = a.adr_adres_no
    WHERE y.mye_Guid = @guid
      AND y.mye_iptal = 0
  `

  const result = await executeQuery(query, { guid: params.guid })

  if (!result.length) {
    return Response.json({ error: "Yetkili bulunamadı" }, { status: 404 })
  }

  return Response.json(result[0])
}

// POST /api/cari-hesaplar/:cariKod/yetkililer
export async function POST(
  req: Request,
  { params }: { params: { cariKod: string } }
) {
  const data: CreateYetkiliRequest = await req.json()

  const insertQuery = `
    INSERT INTO CARI_HESAP_YETKILILERI (
      mye_Guid, mye_DBCno, mye_iptal, mye_fileid,
      mye_create_user, mye_create_date,
      mye_cari_kod, mye_adres_no,
      mye_isim, mye_soyisim,
      mye_email_adres, mye_cep_telno,
      mye_is_telno, mye_dahili_telno,
      mye_unvan, mye_hisse, mye_tahsil,
      mye_mutabakat_yetkilisi_fl
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @cariKod, @adresNo,
      @isim, @soyisim,
      @email, @cepTel,
      @isTel, @dahiliTel,
      @unvan, 0, 0,
      @mutabakat
    )
  `

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    cariKod: params.cariKod,
    adresNo: data.myeAdresNo,
    isim: data.myeIsim,
    soyisim: data.myeSoyisim,
    email: data.myeEmailAdres,
    cepTel: data.myeCepTelno,
    isTel: data.myeIsTelno,
    dahiliTel: data.myeDahiliTelno,
    unvan: data.myeUnvan,
    mutabakat: data.myeMutabakatYetkilisiFl ?? false,
  })

  return Response.json(
    { message: "Yetkili başarıyla eklendi" },
    { status: 201 }
  )
}

// GET /api/yetkililer/search?q=ahmet
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q || q.length < 2) {
    return Response.json({ error: "En az 2 karakter girin" }, { status: 400 })
  }

  const query = `
    SELECT TOP 50
      y.mye_Guid as myeGuid,
      y.mye_cari_kod as myeCariKod,
      c.cari_unvan1 as cariUnvan1,
      y.mye_isim + ' ' + y.mye_soyisim as adSoyad,
      y.mye_email_adres as myeEmailAdres,
      y.mye_cep_telno as myeCepTelno
    FROM CARI_HESAP_YETKILILERI y
    INNER JOIN CARI_HESAPLAR c ON y.mye_cari_kod = c.cari_kod
    WHERE (
        y.mye_isim LIKE @search 
        OR y.mye_soyisim LIKE @search
        OR y.mye_email_adres LIKE @search
      )
      AND y.mye_iptal = 0
      AND c.cari_iptal = 0
    ORDER BY y.mye_soyisim, y.mye_isim
  `

  const result = await executeQuery(query, {
    search: `%${q}%`,
  })

  return Response.json(result)
}
```

---

## React Bileşen Örneği

```typescript
// components/yetkili-list.tsx
"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, User, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YetkiliListProps {
  cariKod: string
  sadeceMutabakat?: boolean
}

export function YetkiliList({
  cariKod,
  sadeceMutabakat = false,
}: YetkiliListProps) {
  const [yetkililer, setYetkililer] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchYetkililer()
  }, [cariKod, sadeceMutabakat])

  const fetchYetkililer = async () => {
    try {
      const params = sadeceMutabakat ? "?mutabakat=true" : ""
      const response = await fetch(
        `/api/cari-hesaplar/${cariKod}/yetkililer${params}`
      )
      const data = await response.json()
      setYetkililer(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-4">
      {yetkililer.map((yetkili: any) => (
        <div
          key={yetkili.myeGuid}
          className="border rounded-lg p-4 hover:bg-gray-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {yetkili.myeIsim} {yetkili.myeSoyisim}
                  </h3>
                  {yetkili.myeUnvan && (
                    <span className="text-sm text-gray-500">
                      Ünvan: {yetkili.myeUnvan}
                    </span>
                  )}
                </div>
                {yetkili.myeMutabakatYetkilisiFl && (
                  <Award
                    className="h-5 w-5 text-green-500"
                    title="Mutabakat Yetkilisi"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {yetkili.myeEmailAdres && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${yetkili.myeEmailAdres}`}
                      className="text-blue-600 hover:underline"
                    >
                      {yetkili.myeEmailAdres}
                    </a>
                  </div>
                )}

                {yetkili.myeCepTelno && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${yetkili.myeCepTelno}`}
                      className="text-blue-600 hover:underline"
                    >
                      {yetkili.myeCepTelno}
                    </a>
                  </div>
                )}

                {yetkili.myeIsTelno && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>İş: {yetkili.myeIsTelno}</span>
                    {yetkili.myeDahiliTelno && (
                      <span className="text-gray-500">
                        (Dahili: {yetkili.myeDahiliTelno})
                      </span>
                    )}
                  </div>
                )}

                {yetkili.myeAdresNo && (
                  <div className="text-gray-600">
                    Adres No: {yetkili.myeAdresNo}
                  </div>
                )}
              </div>

              {(yetkili.myeHisse > 0 || yetkili.myeTahsil > 0) && (
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  {yetkili.myeHisse > 0 && (
                    <span>Hisse: {getHisseDurumuText(yetkili.myeHisse)}</span>
                  )}
                  {yetkili.myeTahsil > 0 && (
                    <span>Tahsil: {getTahsilText(yetkili.myeTahsil)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {yetkililer.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          {sadeceMutabakat
            ? "Mutabakat yetkilisi bulunamadı"
            : "Kayıtlı yetkili bulunamadı"}
        </p>
      )}
    </div>
  )
}

function getHisseDurumuText(hisse: number): string {
  const durumlar = {
    0: "Yok",
    1: "Ortak",
    2: "Tüm",
  }
  return durumlar[hisse] || "Bilinmiyor"
}

function getTahsilText(tahsil: number): string {
  const tahsiller = {
    0: "Tahsili Yok",
    1: "İlk",
    2: "Orta",
    3: "Lise",
    4: "Yüksek",
    5: "Fakülte",
    6: "Yüksek Lisans",
    7: "Doktora",
    8: "Fakülte Temel Bilgi",
    9: "Yüksek Lisans Temel Bilgi",
    10: "Okul Öncesi",
  }
  return tahsiller[tahsil] || "Bilinmiyor"
}
```

---

## Önemli Notlar

### 🔗 İlişkiler

- Her yetkili bir cari hesaba bağlıdır (`mye_cari_kod`)
- Opsiyonel olarak bir adrese bağlanabilir (`mye_adres_no`)
- Bir carinin birden fazla yetkilisi olabilir

### 📧 İletişim Bilgileri

- E-posta ve telefon bilgileri otomatik iletişim için kullanılır
- KEP adresi resmi elektronik posta için
- Dahili telefon şirket içi iletişim için

### 👔 Mutabakat Yetkilisi

- `mye_mutabakat_yetkilisi_fl`: Cari mutabakat işlemlerini yapabilir
- E-fatura, e-arşiv ve mutabakat dokümanları bu kişiye gönderilir
- Bir carinin birden fazla mutabakat yetkilisi olabilir

### 🎓 Tahsil Bilgisi

- 11 farklı eğitim seviyesi
- CRM ve pazarlama analizleri için kullanılabilir

### 💍 Aile Bilgileri

- Doğum günü hatırlatmaları
- Evlilik yıldönümü takibi
- Kurumsal hediye ve kutlama yönetimi

### 🏠 Ev Adresi

- İş adresinden farklı ev adresi tutulabilir
- Kargo ve posta gönderileri için

### 🔍 Arama İndeksleri

- İsim ve soyisme göre hızlı arama
- Cari ve adres kombinasyonunda optimizasyon

---

## Kullanım Senaryoları

### 1. Mutabakat Süreci

```sql
-- Mutabakat dokümanı gönderilecek yetkililer
SELECT * FROM CARI_HESAP_YETKILILERI
WHERE mye_mutabakat_yetkilisi_fl = 1
  AND mye_email_adres IS NOT NULL
```

### 2. Doğum Günü Kampanyası

```sql
-- Bu ay doğum günü olan yetkililer
SELECT * FROM CARI_HESAP_YETKILILERI
WHERE MONTH(mye_dogum_tarihi) = MONTH(GETDATE())
```

### 3. Şirket Ortakları

```sql
-- Hissedar yetkililer
SELECT * FROM CARI_HESAP_YETKILILERI
WHERE mye_hisse IN (1, 2)  -- Ortak veya Tüm
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: CARI_HESAPLAR, CARI_HESAP_ADRESLERI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

# STOK_FIYAT_DEGISIKLIKLERI Tablosu - Fiyat Değişikliği

## Tablo Özeti

**Tablo Adı:** `STOK_FIYAT_DEGISIKLIKLERI`  
**Türkçe Adı:** Fiyat Değişikliği  
**Amaç:** Stok fiyat değişikliklerinin kayıt altına alınması ve takibi  
**Veri Tabanı:** Mikro ERP V16/V17

Stok fiyatlarında yapılan tüm değişikliklerin geçmişini tutar. Eski ve yeni fiyat bilgileri, değişiklik nedeni ve onay durumu saklanır.

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `fid_Guid`, `fid_DBCno`, `fid_iptal`, `fid_hidden`, `fid_kilitli`, `fid_create_user`, `fid_create_date`, vb.

### 🔑 Evrak Bilgileri

| Alan                 | Tip           | Açıklama          | Örnek        |
| -------------------- | ------------- | ----------------- | ------------ |
| `fid_evrak_seri_no`  | evrakseri_str | **Evrak Seri No** | `FD`         |
| `fid_evrak_sira_no`  | Integer       | **Evrak Sıra No** | `1001`       |
| `fid_evrak_satir_no` | Integer       | **Satır No**      | `1`          |
| `fid_evrak_tarih`    | DateTime      | Evrak Tarihi      | `2025-10-31` |
| `fid_belge_no`       | belgeno_str   | Belge No          | `BLG-001`    |
| `fid_belge_tarih`    | DateTime      | Belge Tarihi      | `2025-10-31` |

### 📦 Stok ve Zaman

| Alan           | Tip          | Açıklama          | FK      |
| -------------- | ------------ | ----------------- | ------- |
| `fid_stok_kod` | Nvarchar(25) | **Stok Kodu**     | STOKLAR |
| `fid_tarih`    | DateTime     | Değişiklik Tarihi | -       |
| `fid_saat`     | Tinyint      | Değişiklik Saati  | -       |
| `fid_depo_no`  | Tinyint      | Depo No           | DEPOLAR |

### 📊 Değişiklik Bilgileri

| Alan                  | Tip              | Açıklama                                   |
| --------------------- | ---------------- | ------------------------------------------ |
| `fid_fiyat_deg_neden` | Tinyint          | Fiyat Değişiklik Nedeni                    |
| `fid_fiyat_no`        | Integer          | Fiyat No (1-10)                            |
| `fid_yapildi_fl`      | Tinyint          | Değişiklik Uygulandı mı? (0:Hayır, 1:Evet) |
| `fid_prof_uid`        | Uniqueidentifier | Profil UID                                 |

### 💰 Eski Fiyat Bilgileri

| Alan                  | Tip         | Açıklama            | FK                          |
| --------------------- | ----------- | ------------------- | --------------------------- |
| `fid_eskifiy_tutar`   | Float       | Eski Fiyat Tutarı   | -                           |
| `fid_eskifiy_doviz`   | Tinyint     | Eski Döviz Cinsi    | DOVIZ_KURLARI               |
| `fid_eskifiy_iskonto` | Nvarchar(4) | Eski İskonto Kodu   | STOK_CARI_ISKONTO_TANIMLARI |
| `fid_eskifiy_opno`    | Integer     | Eski Ödeme Planı No | ODEME_PLANLARI              |
| `fid_eski_karorani`   | Float       | Eski Kar Oranı (%)  | -                           |

### 💵 Yeni Fiyat Bilgileri

| Alan                  | Tip         | Açıklama            | FK                          |
| --------------------- | ----------- | ------------------- | --------------------------- |
| `fid_yenifiy_tutar`   | Float       | Yeni Fiyat Tutarı   | -                           |
| `fid_yenifiy_doviz`   | Tinyint     | Yeni Döviz Cinsi    | DOVIZ_KURLARI               |
| `fid_yenifiy_iskonto` | Nvarchar(4) | Yeni İskonto Kodu   | STOK_CARI_ISKONTO_TANIMLARI |
| `fid_yenifiy_opno`    | Integer     | Yeni Ödeme Planı No | ODEME_PLANLARI              |
| `fid_yeni_karorani`   | Float       | Yeni Kar Oranı (%)  | -                           |

---

## İndeksler

| İndeks                             | Özellik     | Alanlar                                                        | Açıklama               |
| ---------------------------------- | ----------- | -------------------------------------------------------------- | ---------------------- |
| `NDX_STOK_FIYAT_DEGISIKLIKLERI_00` | PRIMARY KEY | `fid_Guid`                                                     | Benzersiz tanımlayıcı  |
| `NDX_STOK_FIYAT_DEGISIKLIKLERI_02` | UNIQUE      | `fid_evrak_seri_no`, `fid_evrak_sira_no`, `fid_evrak_satir_no` | Evrak benzersizliği    |
| `NDX_STOK_FIYAT_DEGISIKLIKLERI_03` | INDEX       | `fid_stok_kod`, `fid_tarih`, `fid_saat`                        | Stok bazlı zaman arama |
| `NDX_STOK_FIYAT_DEGISIKLIKLERI_04` | INDEX       | `fid_tarih`, `fid_saat`                                        | Tarih bazlı arama      |

---

## Enum Tanımları

```typescript
export enum FiyatDegisiklikDurumu {
  Beklemede = 0, // Henüz uygulanmadı
  Uygulandi = 1, // Fiyat değişikliği yapıldı
}
```

---

## SQL Sorgu Örnekleri

### 1. Stokun Fiyat Değişiklik Geçmişi

```sql
SELECT
    fid_evrak_seri_no + '-' + CAST(fid_evrak_sira_no AS NVARCHAR) AS evrak_no,
    fid_tarih,
    fid_saat,
    fid_fiyat_no,
    fid_eskifiy_tutar AS eski_fiyat,
    fid_yenifiy_tutar AS yeni_fiyat,
    fid_yenifiy_tutar - fid_eskifiy_tutar AS fiyat_farki,
    fid_eski_karorani AS eski_kar,
    fid_yeni_karorani AS yeni_kar,
    fid_yapildi_fl AS uygulandı,
    u.user_name AS yapan_kullanici
FROM STOK_FIYAT_DEGISIKLIKLERI f
LEFT JOIN KULLANICILAR u ON f.fid_create_user = u.user_id
WHERE fid_stok_kod = 'STOK-001'
    AND fid_iptal = 0
ORDER BY fid_tarih DESC, fid_saat DESC
```

### 2. Bekleyen Fiyat Değişikliklerini Getir

```sql
SELECT
    f.fid_Guid,
    f.fid_evrak_seri_no,
    f.fid_evrak_sira_no,
    f.fid_stok_kod,
    s.sto_isim,
    f.fid_tarih,
    f.fid_eskifiy_tutar,
    f.fid_yenifiy_tutar,
    f.fid_yeni_karorani
FROM STOK_FIYAT_DEGISIKLIKLERI f
INNER JOIN STOKLAR s ON f.fid_stok_kod = s.sto_kod
WHERE f.fid_yapildi_fl = 0
    AND f.fid_iptal = 0
ORDER BY f.fid_tarih, f.fid_saat
```

### 3. Bugün Yapılan Fiyat Değişiklikleri

```sql
SELECT
    f.fid_stok_kod,
    s.sto_isim,
    f.fid_fiyat_no,
    f.fid_eskifiy_tutar AS eski,
    f.fid_yenifiy_tutar AS yeni,
    CAST((f.fid_yenifiy_tutar - f.fid_eskifiy_tutar) / f.fid_eskifiy_tutar * 100 AS DECIMAL(10,2)) AS degisim_yuzdesi,
    f.fid_yapildi_fl
FROM STOK_FIYAT_DEGISIKLIKLERI f
INNER JOIN STOKLAR s ON f.fid_stok_kod = s.sto_kod
WHERE CAST(f.fid_tarih AS DATE) = CAST(GETDATE() AS DATE)
    AND f.fid_iptal = 0
ORDER BY f.fid_saat DESC
```

### 4. Fiyat No Bazında Son Değişiklikler

```sql
SELECT
    f.fid_stok_kod,
    s.sto_isim,
    f.fid_fiyat_no,
    f.fid_yenifiy_tutar AS guncel_fiyat,
    f.fid_yeni_karorani AS guncel_kar,
    f.fid_tarih AS degisiklik_tarihi
FROM STOK_FIYAT_DEGISIKLIKLERI f
INNER JOIN STOKLAR s ON f.fid_stok_kod = s.sto_kod
WHERE f.fid_yapildi_fl = 1
    AND f.fid_iptal = 0
    AND f.fid_tarih = (
        SELECT MAX(f2.fid_tarih)
        FROM STOK_FIYAT_DEGISIKLIKLERI f2
        WHERE f2.fid_stok_kod = f.fid_stok_kod
            AND f2.fid_fiyat_no = f.fid_fiyat_no
            AND f2.fid_yapildi_fl = 1
            AND f2.fid_iptal = 0
    )
ORDER BY f.fid_stok_kod, f.fid_fiyat_no
```

### 5. Yeni Fiyat Değişikliği Kaydı Oluştur

```sql
INSERT INTO STOK_FIYAT_DEGISIKLIKLERI (
    fid_Guid, fid_DBCno, fid_iptal, fid_fileid,
    fid_create_user, fid_create_date,
    fid_evrak_seri_no, fid_evrak_sira_no, fid_evrak_satir_no,
    fid_evrak_tarih, fid_belge_no, fid_belge_tarih,
    fid_stok_kod, fid_tarih, fid_saat,
    fid_fiyat_no,
    fid_eskifiy_tutar, fid_eskifiy_doviz, fid_eski_karorani,
    fid_yenifiy_tutar, fid_yenifiy_doviz, fid_yeni_karorani,
    fid_yapildi_fl, fid_depo_no
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'FD', 1001, 1,
    GETDATE(), 'BLG-001', GETDATE(),
    'STOK-001', GETDATE(), DATEPART(HOUR, GETDATE()),
    1,  -- Fiyat 1
    100.00, 0, 20.0,  -- Eski: 100 TL, %20 kar
    120.00, 0, 25.0,  -- Yeni: 120 TL, %25 kar
    0, 1  -- Beklemede, Depo 1
)
```

### 6. Fiyat Değişikliğini Uygula

```sql
-- Önce değişiklik kaydını işaretle
UPDATE STOK_FIYAT_DEGISIKLIKLERI
SET fid_yapildi_fl = 1,
    fid_lastup_user = @userId,
    fid_lastup_date = GETDATE()
WHERE fid_Guid = @fidGuid

-- Sonra stok fiyatını güncelle (örnek: Fiyat 1)
UPDATE STOKLAR
SET sto_perakende_fiyat = (
        SELECT fid_yenifiy_tutar
        FROM STOK_FIYAT_DEGISIKLIKLERI
        WHERE fid_Guid = @fidGuid
    ),
    sto_lastup_user = @userId,
    sto_lastup_date = GETDATE()
WHERE sto_kod = (
    SELECT fid_stok_kod
    FROM STOK_FIYAT_DEGISIKLIKLERI
    WHERE fid_Guid = @fidGuid
)
```

### 7. Depo Bazında Fiyat Değişiklikleri

```sql
SELECT
    d.dep_adi,
    COUNT(*) AS degisiklik_sayisi,
    AVG(f.fid_yenifiy_tutar - f.fid_eskifiy_tutar) AS ortalama_fiyat_artisi,
    SUM(CASE WHEN f.fid_yapildi_fl = 1 THEN 1 ELSE 0 END) AS uygulanan,
    SUM(CASE WHEN f.fid_yapildi_fl = 0 THEN 1 ELSE 0 END) AS bekleyen
FROM STOK_FIYAT_DEGISIKLIKLERI f
LEFT JOIN DEPOLAR d ON f.fid_depo_no = d.dep_no
WHERE f.fid_iptal = 0
    AND f.fid_tarih >= DATEADD(MONTH, -1, GETDATE())
GROUP BY d.dep_adi
ORDER BY degisiklik_sayisi DESC
```

---

## TypeScript Arayüzü

```typescript
export interface StokFiyatDegisiklik {
  // Sistem
  fidGuid: string
  fidEvrakSeriNo: string
  fidEvrakSiraNo: number
  fidEvrakSatirNo: number
  fidEvrakTarih: Date
  fidBelgeNo?: string
  fidBelgeTarih?: Date

  // Stok ve Zaman
  fidStokKod: string
  fidTarih: Date
  fidSaat: number
  fidDepoNo?: number

  // Değişiklik
  fidFiyatDegNeden?: number
  fidFiyatNo: number // 1-10
  fidYapildiFl: FiyatDegisiklikDurumu
  fidProfUid?: string

  // Eski Fiyat
  fidEskifiyTutar: number
  fidEskifiyDoviz: number
  fidEskifiyIskonto?: string
  fidEskifiyOpno?: number
  fidEskiKarorani?: number

  // Yeni Fiyat
  fidYenifiyTutar: number
  fidYenifiyDoviz: number
  fidYenifiyIskonto?: string
  fidYenifiyOpno?: number
  fidYeniKarorani?: number

  // Durum
  fidIptal: boolean
}

export interface FiyatDegisiklikWithDetails extends StokFiyatDegisiklik {
  stokIsim: string
  depoAdi?: string
  fiyatFarki: number
  degisimYuzdesi: number
  karoraniFarki: number
  yayanKullanici?: string
}

export interface CreateFiyatDegisiklikRequest {
  fidEvrakSeriNo: string
  fidEvrakSiraNo: number
  fidStokKod: string
  fidFiyatNo: number
  fidEskifiyTutar: number
  fidYenifiyTutar: number
  fidEskiKarorani?: number
  fidYeniKarorani?: number
  fidDepoNo?: number
  fidBelgeNo?: string
}

export interface FiyatDegisiklikStats {
  toplamDegisiklik: number
  bekleyenDegisiklik: number
  uygulananDegisiklik: number
  ortalamaArtis: number
  ortalamaKarArtisi: number
}
```

---

## API Endpoint Örnekleri

```typescript
// GET /api/stoklar/:stokKod/fiyat-degisiklikleri
export async function GET(
  req: Request,
  { params }: { params: { stokKod: string } }
) {
  const { searchParams } = new URL(req.url)
  const fiyatNo = searchParams.get("fiyatNo")
  const durum = searchParams.get("durum") // bekleyen, uygulanan

  let where = "f.fid_stok_kod = @stokKod AND f.fid_iptal = 0"
  const queryParams: any = { stokKod: params.stokKod }

  if (fiyatNo) {
    where += " AND f.fid_fiyat_no = @fiyatNo"
    queryParams.fiyatNo = parseInt(fiyatNo)
  }

  if (durum === "bekleyen") {
    where += " AND f.fid_yapildi_fl = 0"
  } else if (durum === "uygulanan") {
    where += " AND f.fid_yapildi_fl = 1"
  }

  const query = `
    SELECT 
      f.fid_Guid as fidGuid,
      f.fid_evrak_seri_no as fidEvrakSeriNo,
      f.fid_evrak_sira_no as fidEvrakSiraNo,
      f.fid_tarih as fidTarih,
      f.fid_saat as fidSaat,
      f.fid_fiyat_no as fidFiyatNo,
      f.fid_eskifiy_tutar as fidEskifiyTutar,
      f.fid_yenifiy_tutar as fidYenifiyTutar,
      f.fid_yenifiy_tutar - f.fid_eskifiy_tutar as fiyatFarki,
      f.fid_eski_karorani as fidEskiKarorani,
      f.fid_yeni_karorani as fidYeniKarorani,
      f.fid_yapildi_fl as fidYapildiFl,
      s.sto_isim as stokIsim
    FROM STOK_FIYAT_DEGISIKLIKLERI f
    INNER JOIN STOKLAR s ON f.fid_stok_kod = s.sto_kod
    WHERE ${where}
    ORDER BY f.fid_tarih DESC, f.fid_saat DESC
  `

  const result = await executeQuery(query, queryParams)
  return Response.json(result)
}

// POST /api/fiyat-degisiklikleri
export async function POST(req: Request) {
  const data: CreateFiyatDegisiklikRequest = await req.json()

  // Evrak sıra no kontrolü (benzersizlik)
  const checkQuery = `
    SELECT COUNT(*) as count
    FROM STOK_FIYAT_DEGISIKLIKLERI
    WHERE fid_evrak_seri_no = @seriNo
      AND fid_evrak_sira_no = @siraNo
      AND fid_iptal = 0
  `
  const checkResult = await executeQuery(checkQuery, {
    seriNo: data.fidEvrakSeriNo,
    siraNo: data.fidEvrakSiraNo,
  })

  if (checkResult[0].count > 0) {
    return Response.json(
      { error: "Bu evrak numarası zaten kullanılıyor" },
      { status: 400 }
    )
  }

  const insertQuery = `
    INSERT INTO STOK_FIYAT_DEGISIKLIKLERI (
      fid_Guid, fid_DBCno, fid_iptal, fid_fileid,
      fid_create_user, fid_create_date,
      fid_evrak_seri_no, fid_evrak_sira_no, fid_evrak_satir_no,
      fid_evrak_tarih, fid_belge_no, fid_belge_tarih,
      fid_stok_kod, fid_tarih, fid_saat,
      fid_fiyat_no,
      fid_eskifiy_tutar, fid_eskifiy_doviz, fid_eski_karorani,
      fid_yenifiy_tutar, fid_yenifiy_doviz, fid_yeni_karorani,
      fid_yapildi_fl, fid_depo_no
    )
    VALUES (
      NEWID(), 1, 0, 1,
      @userId, GETDATE(),
      @seriNo, @siraNo, 1,
      GETDATE(), @belgeNo, GETDATE(),
      @stokKod, GETDATE(), DATEPART(HOUR, GETDATE()),
      @fiyatNo,
      @eskiFiyat, 0, @eskiKar,
      @yeniFiyat, 0, @yeniKar,
      0, @depoNo
    )
  `

  await executeQuery(insertQuery, {
    userId: getCurrentUserId(),
    seriNo: data.fidEvrakSeriNo,
    siraNo: data.fidEvrakSiraNo,
    belgeNo: data.fidBelgeNo,
    stokKod: data.fidStokKod,
    fiyatNo: data.fidFiyatNo,
    eskiFiyat: data.fidEskifiyTutar,
    eskiKar: data.fidEskiKarorani ?? 0,
    yeniFiyat: data.fidYenifiyTutar,
    yeniKar: data.fidYeniKarorani ?? 0,
    depoNo: data.fidDepoNo,
  })

  return Response.json(
    { message: "Fiyat değişikliği kaydı oluşturuldu" },
    { status: 201 }
  )
}

// PUT /api/fiyat-degisiklikleri/:guid/uygula
export async function PUT(
  req: Request,
  { params }: { params: { guid: string } }
) {
  // Değişiklik kaydını al
  const getQuery = `
    SELECT * FROM STOK_FIYAT_DEGISIKLIKLERI
    WHERE fid_Guid = @guid AND fid_iptal = 0
  `
  const degisiklik = await executeQuery(getQuery, { guid: params.guid })

  if (!degisiklik.length) {
    return Response.json({ error: "Kayıt bulunamadı" }, { status: 404 })
  }

  if (degisiklik[0].fid_yapildi_fl === 1) {
    return Response.json(
      { error: "Bu değişiklik zaten uygulandı" },
      { status: 400 }
    )
  }

  const fiyatAlanMap = {
    1: "sto_perakende_fiyat",
    2: "sto_toptan_fiyat",
    3: "sto_alinan_fiyat",
    // ... diğer fiyat alanları
  }

  const fiyatAlan = fiyatAlanMap[degisiklik[0].fid_fiyat_no]

  if (!fiyatAlan) {
    return Response.json({ error: "Geçersiz fiyat numarası" }, { status: 400 })
  }

  // Transaction başlat
  await executeQuery("BEGIN TRANSACTION")

  try {
    // Değişiklik kaydını işaretle
    await executeQuery(
      `
      UPDATE STOK_FIYAT_DEGISIKLIKLERI
      SET fid_yapildi_fl = 1,
          fid_lastup_user = @userId,
          fid_lastup_date = GETDATE()
      WHERE fid_Guid = @guid
    `,
      { userId: getCurrentUserId(), guid: params.guid }
    )

    // Stok fiyatını güncelle
    await executeQuery(
      `
      UPDATE STOKLAR
      SET ${fiyatAlan} = @yeniFiyat,
          sto_lastup_user = @userId,
          sto_lastup_date = GETDATE()
      WHERE sto_kod = @stokKod
    `,
      {
        yeniFiyat: degisiklik[0].fid_yenifiy_tutar,
        userId: getCurrentUserId(),
        stokKod: degisiklik[0].fid_stok_kod,
      }
    )

    await executeQuery("COMMIT TRANSACTION")

    return Response.json({ message: "Fiyat değişikliği başarıyla uygulandı" })
  } catch (error) {
    await executeQuery("ROLLBACK TRANSACTION")
    throw error
  }
}

// GET /api/fiyat-degisiklikleri/stats
export async function GET(req: Request) {
  const query = `
    SELECT 
      COUNT(*) as toplamDegisiklik,
      SUM(CASE WHEN fid_yapildi_fl = 0 THEN 1 ELSE 0 END) as bekleyenDegisiklik,
      SUM(CASE WHEN fid_yapildi_fl = 1 THEN 1 ELSE 0 END) as uygulananDegisiklik,
      AVG(fid_yenifiy_tutar - fid_eskifiy_tutar) as ortalamaArtis,
      AVG(fid_yeni_karorani - fid_eski_karorani) as ortalamaKarArtisi
    FROM STOK_FIYAT_DEGISIKLIKLERI
    WHERE fid_iptal = 0
      AND fid_tarih >= DATEADD(MONTH, -1, GETDATE())
  `

  const result = await executeQuery(query)
  return Response.json(result[0])
}
```

---

## React Bileşen Örneği

```typescript
// components/fiyat-degisiklik-list.tsx
"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FiyatDegisiklikListProps {
  stokKod?: string
  durum?: "bekleyen" | "uygulanan"
}

export function FiyatDegisiklikList({
  stokKod,
  durum,
}: FiyatDegisiklikListProps) {
  const [degisiklikler, setDegisiklikler] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDegisiklikler()
  }, [stokKod, durum])

  const fetchDegisiklikler = async () => {
    try {
      const params = new URLSearchParams()
      if (durum) params.append("durum", durum)

      const url = stokKod
        ? `/api/stoklar/${stokKod}/fiyat-degisiklikleri?${params.toString()}`
        : `/api/fiyat-degisiklikleri?${params.toString()}`

      const response = await fetch(url)
      const data = await response.json()
      setDegisiklikler(data)
    } finally {
      setLoading(false)
    }
  }

  const handleUygula = async (guid: string) => {
    if (!confirm("Fiyat değişikliği uygulanacak. Onaylıyor musunuz?")) return

    try {
      const response = await fetch(`/api/fiyat-degisiklikleri/${guid}/uygula`, {
        method: "PUT",
      })

      if (response.ok) {
        alert("Fiyat değişikliği başarıyla uygulandı")
        fetchDegisiklikler()
      } else {
        const error = await response.json()
        alert(error.error || "Bir hata oluştu")
      }
    } catch (error) {
      console.error("Uygulama hatası:", error)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-4">
      {degisiklikler.map((deg: any) => {
        const fiyatFarki = deg.fidYenifiyTutar - deg.fidEskifiyTutar
        const artis = fiyatFarki > 0
        const degisimYuzdesi = (
          (fiyatFarki / deg.fidEskifiyTutar) *
          100
        ).toFixed(2)

        return (
          <div
            key={deg.fidGuid}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {deg.fidYapildiFl === 1 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  <span className="font-semibold">
                    {deg.fidEvrakSeriNo}-{deg.fidEvrakSiraNo}
                  </span>
                  {stokKod ? null : (
                    <span className="text-sm text-gray-600">
                      {deg.stokIsim}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fiyat No:</span>
                    <span className="ml-2 font-medium">{deg.fidFiyatNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tarih:</span>
                    <span className="ml-2">
                      {new Date(deg.fidTarih).toLocaleDateString("tr-TR")}{" "}
                      {deg.fidSaat}:00
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Durum:</span>
                    <span
                      className={`ml-2 font-medium ${
                        deg.fidYapildiFl === 1
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {deg.fidYapildiFl === 1 ? "Uygulandı" : "Bekliyor"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-6">
                  <div>
                    <span className="text-xs text-gray-500">Eski Fiyat</span>
                    <div className="text-lg font-medium">
                      ₺{deg.fidEskifiyTutar.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center">
                    {artis ? (
                      <TrendingUp className="h-6 w-6 text-red-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-green-500" />
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Yeni Fiyat</span>
                    <div className="text-lg font-medium text-blue-600">
                      ₺{deg.fidYenifiyTutar.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500">Değişim</span>
                    <div
                      className={`text-lg font-medium ${
                        artis ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {artis ? "+" : ""}
                      {degisimYuzdesi}%
                    </div>
                  </div>

                  {deg.fidYeniKarorani !== null && (
                    <div>
                      <span className="text-xs text-gray-500">Yeni Kar</span>
                      <div className="text-lg font-medium">
                        %{deg.fidYeniKarorani.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {deg.fidYapildiFl === 0 && (
                <Button
                  onClick={() => handleUygula(deg.fidGuid)}
                  size="sm"
                  variant="default"
                >
                  Uygula
                </Button>
              )}
            </div>
          </div>
        )
      })}

      {degisiklikler.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Fiyat değişikliği bulunamadı
        </p>
      )}
    </div>
  )
}
```

---

## Önemli Notlar

### 🔑 Composite Unique Key

- `fid_evrak_seri_no + fid_evrak_sira_no + fid_evrak_satir_no` benzersiz
- Bir evrakta birden fazla satır olabilir (farklı stoklar)

### 💰 Fiyat Numaraları

- `fid_fiyat_no`: 1-10 arası değer alır
- STOKLAR tablosundaki hangi fiyat alanının değiştirileceğini belirtir
- Örnek: 1=Perakende, 2=Toptan, 3=Alış Fiyatı

### ⏳ Onay Süreci

- `fid_yapildi_fl = 0`: Değişiklik beklemede
- `fid_yapildi_fl = 1`: Değişiklik uygulandı
- Onay mekanizması ile fiyat değişiklikleri kontrol edilebilir

### 📊 Kar Oranı Takibi

- Eski ve yeni kar oranları saklanır
- Fiyat stratejisi analizi yapılabilir
- Kar marjı değişimleri raporlanabilir

### 🕐 Zaman Damgası

- Tarih ve saat bilgisi ayrı tutulur
- Aynı gün içinde sıralama için saat kullanılır
- Fiyat geçmişi kronolojik olarak takip edilir

### 🔄 Değişiklik Uygulama

- Önce değişiklik kaydı işaretlenir (yapildi_fl = 1)
- Sonra STOKLAR tablosunda ilgili fiyat güncellenir
- Transaction ile veri tutarlılığı sağlanır

### 📍 Depo Bazlı Fiyatlandırma

- `fid_depo_no`: Opsiyonel, depo bazlı fiyat değişiklikleri
- Farklı depolarda farklı fiyatlar uygulanabilir

### 💱 Döviz Desteği

- Eski ve yeni fiyatlar farklı dövizlerde olabilir
- Döviz cinsine göre fiyat karşılaştırması yapılmalı

---

## Kullanım Senaryoları

### 1. Toplu Fiyat Güncelleme

- Sezon sonu indirimleri
- Maliyet artışı sonrası fiyat revizyonu
- Kampanya fiyatları

### 2. Onaylı Fiyat Değişikliği

- Yönetici onayı bekleyen değişiklikler
- Otomatik fiyat güncellemelerinin kontrolü
- İnceleme ve onay süreci

### 3. Fiyat Geçmişi Analizi

- Fiyat trendleri
- Kar oranı değişimleri
- Rekabet analizi

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOKLAR, DOVIZ_KURLARI, STOK_CARI_ISKONTO_TANIMLARI, ODEME_PLANLARI, DEPOLAR
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

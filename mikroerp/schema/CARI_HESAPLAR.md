# CARI_HESAPLAR Tablosu - Cari Kartları

## Tablo Özeti

**Tablo Adı:** `CARI_HESAPLAR`  
**Türkçe Adı:** Cari Kartları  
**Amaç:** Müşteri, satıcı ve diğer cari hesapların temel bilgilerini tutar  
**Veri Tabanı:** Mikro ERP V16/V17

Cari hesaplar tablosu, işletmenin tüm müşteri, tedarikçi, satıcı ve diğer ticari ilişki içinde olduğu firmaların kayıtlarını içerir.

---

## Tablo Yapısı (Özet)

### 🔐 Sistem Alanları (0-15)

Standart sistem alanları: `cari_Guid`, `cari_DBCno`, `cari_iptal`, `cari_hidden`, `cari_kilitli`, `cari_create_user`, `cari_create_date`, vb.

### 🔑 Temel Bilgiler

| Alan          | Tip           | Açıklama                  | Örnek              |
| ------------- | ------------- | ------------------------- | ------------------ |
| `cari_kod`    | Nvarchar(25)  | **Cari Kodu (Benzersiz)** | `CARI-001`         |
| `cari_unvan1` | Nvarchar(127) | **Ünvan 1**               | `ABC Tekstil A.Ş.` |
| `cari_unvan2` | Nvarchar(127) | Ünvan 2 (İkinci satır)    | `İstanbul Şubesi`  |

### 🏢 Vergi Bilgileri

| Alan                 | Tip          | Açıklama          |
| -------------------- | ------------ | ----------------- |
| `cari_vdaire_adi`    | Nvarchar(50) | Vergi Dairesi Adı |
| `cari_vdaire_no`     | Nvarchar(15) | Vergi Dairesi No  |
| `cari_sicil_no`      | Nvarchar(15) | Sicil No          |
| `cari_VergiKimlikNo` | Nvarchar(10) | Vergi Kimlik No   |

### 🔄 Hareket Tipleri

**cari_hareket_tipi** (Tinyint):

- 0: Mal ve Hizmet Alınır ve Satılır
- 1: Mal ve Hizmet Sadece Satılır (Müşteri)
- 2: Mal ve Hizmet Sadece Alınır (Tedarikçi)
- 3: Sadece Parasal Hareket Yapılır
- 4: Cari Hareket Yapılmaz

**cari_baglanti_tipi** (Tinyint):

- 0: Müşteri
- 1: Satıcı
- 2: Diğer Cari
- 3: Dağıtıcı
- 4: Bayi
- 5: Hedef Müşteri
- 6: Hedef Bayi
- 7: Alt Bayi
- 8: Bağlı Ortaklık

**cari_stok_alim_cinsi** (Tinyint):

- 0: Toptan ve Perakende
- 1: Toptan
- 2: Perakende

**cari_stok_satim_cinsi** (Tinyint):

- 0: Toptan ve Perakende
- 1: Toptan
- 2: Perakende

### 💰 Muhasebe ve Döviz

| Alan                | Referans             | Açıklama          |
| ------------------- | -------------------- | ----------------- |
| `cari_muh_kod`      | MUHASEBE_HESAP_PLANI | Ana Muhasebe Kodu |
| `cari_muh_kod1`     | MUHASEBE_HESAP_PLANI | Muhasebe Kodu 1   |
| `cari_muh_kod2`     | MUHASEBE_HESAP_PLANI | Muhasebe Kodu 2   |
| `cari_doviz_cinsi`  | DOVIZ_KURLARI        | Ana Döviz Cinsi   |
| `cari_doviz_cinsi1` | DOVIZ_KURLARI        | Döviz Cinsi 1     |
| `cari_doviz_cinsi2` | DOVIZ_KURLARI        | Döviz Cinsi 2     |

**Vade Farkı:**

- `cari_vade_fark_yuz` (Float): Ana vade fark yüzdesi
- `cari_vade_fark_yuz1` (Float): Vade fark yüzdesi 1
- `cari_vade_fark_yuz2` (Float): Vade fark yüzdesi 2

**cari_KurHesapSekli** (Tinyint):

- 1: Döviz Alış
- 2: Döviz Satış
- 3: Efektif Alış
- 4: Efektif Satış

### 💳 Ödeme Bilgileri

**cari_odeme_cinsi** (Tinyint):

- 0: Serbest
- 1: Haftalık
- 2: Aylık
- 3: 15 Günlük

**cari_cariodemetercihi** (Tinyint):

- 0: Nakit
- 1: Müşteri Çeki
- 2: Firma Çeki
- 3: Müşteri Senedi
- 4: Firma Senedi
- 5: Havale
- 6: Ödeme Emri
- 7: Doğrudan Havale

| Alan                | Tip     | Açıklama                          |
| ------------------- | ------- | --------------------------------- |
| `cari_odeme_gunu`   | Tinyint | Ödeme Günü (1-31)                 |
| `cari_odemeplan_no` | Integer | Ödeme Planı No (→ ODEME_PLANLARI) |
| `cari_opsiyon_gun`  | Integer | Opsiyon Gün                       |

### 🏷️ Satış ve Adres

| Alan                   | Referans             | Açıklama                                            |
| ---------------------- | -------------------- | --------------------------------------------------- |
| `cari_satis_fk`        | STOKLAR              | Satış Fiyat Kodu (Hangi fiyat listesi kullanılacak) |
| `cari_fatura_adres_no` | CARI_HESAP_ADRESLERI | Fatura Adresi No                                    |
| `cari_sevk_adres_no`   | CARI_HESAP_ADRESLERI | Sevk Adresi No                                      |

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Carileri Listele

```sql
SELECT
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    cari_vdaire_adi,
    cari_VergiKimlikNo
FROM CARI_HESAPLAR
WHERE cari_iptal = 0
ORDER BY cari_kod
```

### 2. Sadece Müşterileri Getir

```sql
SELECT
    cari_kod,
    cari_unvan1,
    cari_baglanti_tipi,
    cari_hareket_tipi
FROM CARI_HESAPLAR
WHERE cari_iptal = 0
    AND cari_baglanti_tipi = 0  -- Müşteri
ORDER BY cari_unvan1
```

### 3. Sadece Tedarikçileri Getir

```sql
SELECT
    cari_kod,
    cari_unvan1,
    cari_baglanti_tipi,
    cari_hareket_tipi
FROM CARI_HESAPLAR
WHERE cari_iptal = 0
    AND cari_baglanti_tipi = 1  -- Satıcı
ORDER BY cari_unvan1
```

### 4. Cari Kartını Detaylı Getir

```sql
SELECT
    c.*,
    fa.adr_cadde AS fatura_adres,
    sa.adr_cadde AS sevk_adres
FROM CARI_HESAPLAR c
LEFT JOIN CARI_HESAP_ADRESLERI fa
  ON c.cari_fatura_adres_no = fa.adr_adres_no
  AND c.cari_kod = fa.adr_cari_kod
LEFT JOIN CARI_HESAP_ADRESLERI sa
  ON c.cari_sevk_adres_no = sa.adr_adres_no
  AND c.cari_kod = sa.adr_cari_kod
WHERE c.cari_kod = 'CARI-001'
    AND c.cari_iptal = 0
```

### 5. Yeni Cari Kartı Ekle

```sql
INSERT INTO CARI_HESAPLAR (
    cari_Guid, cari_DBCno, cari_iptal, cari_fileid,
    cari_create_user, cari_create_date,
    cari_kod, cari_unvan1, cari_unvan2,
    cari_hareket_tipi, cari_baglanti_tipi,
    cari_vdaire_adi, cari_vdaire_no, cari_VergiKimlikNo,
    cari_doviz_cinsi, cari_odeme_cinsi
)
VALUES (
    NEWID(), 1, 0, 1,
    1, GETDATE(),
    'CARI-500', 'Yeni Müşteri A.Ş.', 'İstanbul',
    1, 0,  -- Sadece Satış, Müşteri
    'Kadıköy', '12345', '1234567890',
    0, 0  -- TL, Serbest ödeme
)
```

---

## TypeScript Arayüzü

```typescript
export interface CariHesap {
  // Sistem
  cariGuid: string
  cariKod: string
  cariUnvan1: string
  cariUnvan2?: string

  // Tipler
  cariHareketTipi: CariHareketTipi
  cariBaglantiTipi: CariBaglantiTipi
  cariStokAlimCinsi: StokCinsi
  cariStokSatimCinsi: StokCinsi

  // Vergi
  cariVdaireAdi?: string
  cariVdaireNo?: string
  cariSicilNo?: string
  cariVergiKimlikNo?: string

  // Muhasebe & Döviz
  cariMuhKod?: string
  cariMuhKod1?: string
  cariMuhKod2?: string
  cariDovizCinsi: number
  cariDovizCinsi1?: number
  cariDovizCinsi2?: number
  cariKurHesapSekli: KurHesapSekli

  // Vade Farkı
  cariVadeFarkYuz?: number
  cariVadeFarkYuz1?: number
  cariVadeFarkYuz2?: number

  // Ödeme
  cariOdemeCinsi: OdemeCinsi
  cariOdemeGunu?: number
  cariOdemeplanNo?: number
  cariOpsiyonGun?: number
  cariCariodemetercihi: OdemeTercihi

  // Satış & Adres
  cariSatisFk?: number
  cariFaturaAdresNo?: number
  cariSevkAdresNo?: number

  // Durum
  cariIptal: boolean
  cariHidden: boolean
  cariKilitli: boolean
}

export enum CariHareketTipi {
  AlimVeSatim = 0,
  SadeceSatim = 1,
  SadeceAlim = 2,
  SadeceParasal = 3,
  HareketYok = 4,
}

export enum CariBaglantiTipi {
  Musteri = 0,
  Satici = 1,
  DigerCari = 2,
  Dagitici = 3,
  Bayi = 4,
  HedefMusteri = 5,
  HedefBayi = 6,
  AltBayi = 7,
  BagliOrtaklik = 8,
}

export enum StokCinsi {
  ToptanVePerakende = 0,
  Toptan = 1,
  Perakende = 2,
}

export enum KurHesapSekli {
  DovizAlis = 1,
  DovizSatis = 2,
  EfektifAlis = 3,
  EfektifSatis = 4,
}

export enum OdemeCinsi {
  Serbest = 0,
  Haftalik = 1,
  Aylik = 2,
  OnbesGunluk = 3,
}

export enum OdemeTercihi {
  Nakit = 0,
  MusteriCeki = 1,
  FirmaCeki = 2,
  MusteriSenedi = 3,
  FirmaSenedi = 4,
  Havale = 5,
  OdemeEmri = 6,
  DoğrudanHavale = 7,
}
```

---

## API Endpoint Örneği

```typescript
// GET /api/cari-hesaplar/:kod
export async function GET(
  req: Request,
  { params }: { params: { kod: string } }
) {
  const query = `
    SELECT 
      c.*,
      fa.adr_cadde AS faturaAdres,
      sa.adr_cadde AS sevkAdres
    FROM CARI_HESAPLAR c
    LEFT JOIN CARI_HESAP_ADRESLERI fa 
      ON c.cari_fatura_adres_no = fa.adr_adres_no
      AND c.cari_kod = fa.adr_cari_kod
    LEFT JOIN CARI_HESAP_ADRESLERI sa 
      ON c.cari_sevk_adres_no = sa.adr_adres_no
      AND c.cari_kod = sa.adr_cari_kod
    WHERE c.cari_kod = @kod 
      AND c.cari_iptal = 0
  `

  const result = await executeQuery(query, { kod: params.kod })

  if (!result.length) {
    return Response.json({ error: "Cari hesap bulunamadı" }, { status: 404 })
  }

  return Response.json(result[0])
}

// GET /api/cari-hesaplar?tip=musteri
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tip = searchParams.get("tip")

  let where = "cari_iptal = 0"

  if (tip === "musteri") {
    where += " AND cari_baglanti_tipi = 0"
  } else if (tip === "satici") {
    where += " AND cari_baglanti_tipi = 1"
  }

  const query = `
    SELECT 
      cari_kod,
      cari_unvan1,
      cari_baglanti_tipi,
      cari_hareket_tipi,
      cari_VergiKimlikNo
    FROM CARI_HESAPLAR
    WHERE ${where}
    ORDER BY cari_unvan1
  `

  const result = await executeQuery(query)
  return Response.json(result)
}
```

---

## React Bileşen Örneği

```typescript
// components/cari-hesap-select.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CariHesapSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  tip?: "musteri" | "satici" | "all"
  disabled?: boolean
}

export function CariHesapSelect({
  value,
  onValueChange,
  tip = "all",
  disabled = false,
}: CariHesapSelectProps) {
  const [cariler, setCariler] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCariler = async () => {
      try {
        const url =
          tip !== "all" ? `/api/cari-hesaplar?tip=${tip}` : "/api/cari-hesaplar"

        const response = await fetch(url)
        const data = await response.json()
        setCariler(data)
      } finally {
        setLoading(false)
      }
    }

    fetchCariler()
  }, [tip])

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Cari seçin..." />
      </SelectTrigger>
      <SelectContent>
        {cariler.map((cari: any) => (
          <SelectItem key={cari.cariGuid} value={cari.cariKod}>
            {cari.cariKod} - {cari.cariUnvan1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

---

## Önemli Notlar

### 🔑 Benzersizlik

- `cari_kod` alanı PRIMARY KEY (benzersiz)
- Vergi kimlik numarası genelde benzersiz olmalı

### 🏢 Müşteri vs Satıcı

- `cari_baglanti_tipi = 0`: Müşteri
- `cari_baglanti_tipi = 1`: Satıcı
- Bir cari hem müşteri hem satıcı olabilir (hareket_tipi = 0)

### 💰 Fiyat Listesi

- `cari_satis_fk`: Müşteriye hangi fiyat listesiyle satış yapılacağını belirtir
- STOKLAR tablosundaki fiyat alanlarına referans

### 📍 Adresler

- Fatura ve sevk adresleri CARI_HESAP_ADRESLERI tablosunda tutulur
- Bir carinin birden fazla adresi olabilir

### 💳 Ödeme Planı

- `cari_odemeplan_no`: ODEME_PLANLARI tablosuna referans
- Taksitli satış planlarını içerir

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: CARI_HESAP_ADRESLERI, STOKLAR, ODEME_PLANLARI, MUHASEBE_HESAP_PLANI, DOVIZ_KURLARI
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi

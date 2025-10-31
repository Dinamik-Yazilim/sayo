# STOK_ALT_GRUPLARI Tablosu - Stok Alt Grupları

## Tablo Özeti

**Tablo Adı:** `STOK_ALT_GRUPLARI`  
**Türkçe Adı:** Stok Alt Grupları  
**Amaç:** Stokları ana gruplar altında daha detaylı kategorize etmek için kullanılan alt düzey grup tanımlamaları  
**Veri Tabanı:** Mikro ERP V16/V17

Stok alt grupları tablosu, ana grupların altında daha spesifik kategoriler oluşturmak için kullanılır. Hiyerarşik yapıda ana grup ile detay grup arasında yer alır. Her alt grup bir ana gruba bağlıdır.

**Hiyerarşi:**

```
Ana Grup (STOK_ANA_GRUPLARI)
    └── Alt Grup (STOK_ALT_GRUPLARI) ← Bu tablo
            └── Detay Grup (STOK_DETAY_GRUPLARI)
                    └── Stok Kartı (STOKLAR)
```

**Örnek Alt Gruplar:**

- Ana Grup: "Hammadde" → Alt Grup: "Kimyasal Hammaddeler", "Metal Hammaddeler"
- Ana Grup: "Mamul" → Alt Grup: "Beyaz Eşya", "Elektronik Cihazlar"
- Ana Grup: "Ticari Mal" → Alt Grup: "Gıda Ürünleri", "Temizlik Ürünleri"

---

## Tablo Yapısı

| Alan No | Alan Adı           | Veri Tipi        | Açıklama                           | Örnek Değer                            |
| ------- | ------------------ | ---------------- | ---------------------------------- | -------------------------------------- |
| 0       | `sta_Guid`         | Uniqueidentifier | Benzersiz alt grup tanımlayıcı     | `A1B2C3D4-E5F6-7890-1234-567890ABCDEF` |
| 1       | `sta_DBCno`        | Smallint         | Veritabanı şirketi numarası        | `1`                                    |
| 2       | `sta_SpecRECno`    | Integer          | Özel kayıt numarası                | `0`                                    |
| 3       | `sta_iptal`        | Bit              | İptal bayrağı (0=Aktif, 1=İptal)   | `0`                                    |
| 4       | `sta_fileid`       | Smallint         | Dosya tanımlayıcı                  | `1`                                    |
| 5       | `sta_hidden`       | Bit              | Gizli bayrak (0=Görünür, 1=Gizli)  | `0`                                    |
| 6       | `sta_kilitli`      | Bit              | Kilitli bayrak (0=Açık, 1=Kilitli) | `0`                                    |
| 7       | `sta_degisti`      | Bit              | Değişim bayrağı                    | `0`                                    |
| 8       | `sta_checksum`     | Integer          | Kontrol toplamı                    | `12345`                                |
| 9       | `sta_create_user`  | Smallint         | Oluşturan kullanıcı ID             | `1`                                    |
| 10      | `sta_create_date`  | DateTime         | Oluşturma tarihi                   | `2024-01-15 09:30:00`                  |
| 11      | `sta_lastup_user`  | Smallint         | Son güncelleyen kullanıcı ID       | `2`                                    |
| 12      | `sta_lastup_date`  | DateTime         | Son güncelleme tarihi              | `2024-10-20 14:45:00`                  |
| 13      | `sta_special1`     | Nvarchar(4)      | Özel alan 1                        | `SPCL`                                 |
| 14      | `sta_special2`     | Nvarchar(4)      | Özel alan 2                        | `STD`                                  |
| 15      | `sta_special3`     | Nvarchar(4)      | Özel alan 3                        | `MAN`                                  |
| 16      | `sta_kod`          | Nvarchar(25)     | **Stok Alt Grup Kodu**             | `ALT-001`                              |
| 17      | `sta_isim`         | Nvarchar(40)     | **Stok Alt Grup Adı**              | `Kimyasal Hammaddeler`                 |
| 18      | `sta_ana_grup_kod` | Nvarchar(25)     | **Bağlı Olduğu Ana Grup Kodu**     | `AG-001`                               |

---

## Alan Kategorileri

### 🔑 Temel Alanlar

- **sta_kod** (Nvarchar(25)): Alt grup kodunun tanımlayıcısı
- **sta_isim** (Nvarchar(40)): Alt grubun adı
- **sta_ana_grup_kod** (Nvarchar(25)): Bu alt grubun bağlı olduğu ana grup kodu (**Foreign Key**)

### 🔐 Sistem Alanları

- **sta_Guid** (Uniqueidentifier): Sistemin alt grup için atadığı benzersiz GUID
- **sta_DBCno** (Smallint): Veritabanı şirketi numarası (çok şirketli yapıda)
- **sta_SpecRECno** (Integer): Özel kayıt numarası (sistem tarafından yönetilen)
- **sta_fileid** (Smallint): Dosya tanımlayıcı

### ⚠️ Durum Bayrakları

- **sta_iptal** (Bit): `0` = Aktif, `1` = İptal edilmiş (silinmiş)
- **sta_hidden** (Bit): `0` = Görünür, `1` = Gizli (listede gösterilmez)
- **sta_kilitli** (Bit): `0` = Açık (düzenlenebilir), `1` = Kilitli (salt okunur)
- **sta_degisti** (Bit): Veri değişip değişmediğini gösteren bayrak

### 👤 Kullanıcı İzleme

- **sta_create_user** (Smallint): Alt grup kartını oluşturan kullanıcının ID'si
- **sta_create_date** (DateTime): Alt grup kartının oluşturulma tarihi ve saati
- **sta_lastup_user** (Smallint): Son güncelleyen kullanıcının ID'si
- **sta_lastup_date** (DateTime): Son güncelleme tarihi ve saati

### 📝 Özel Alanlar

- **sta_special1, sta_special2, sta_special3** (Nvarchar(4)): Gelecekteki ihtiyaçlar için ayrılan ek alanlar

### 🔧 Teknik Alanlar

- **sta_checksum** (Integer): Satırın bütünlüğünü kontrol etmek için kullanılan kontrol toplamı

---

## İndeksler

| İndeks Adı                 | Özellik     | Alanlar                       | Açıklama                                                                   |
| -------------------------- | ----------- | ----------------------------- | -------------------------------------------------------------------------- |
| `NDX_STOK_ALT_GRUPLARI_00` | PRIMARY KEY | `sta_Guid`                    | Birincil anahtar - Her alt grup benzersiz GUID ile tanımlanır              |
| `NDX_STOK_ALT_GRUPLARI_02` | UNIQUE      | `sta_ana_grup_kod`, `sta_kod` | Aynı ana grup altında alt grup kodu benzersiz olmalıdır (composite unique) |

⚠️ **Önemli:** Alt grup kodu (`sta_kod`) tek başına benzersiz değildir. **Ana grup kodu + Alt grup kodu** kombinasyonu benzersiz olmalıdır. Bu sayede farklı ana gruplar altında aynı alt grup kodu kullanılabilir.

**Örnek:**

- Ana Grup: `AG-001` (Hammadde) → Alt Grup: `ALT-001` (Kimyasallar) ✅
- Ana Grup: `AG-002` (Mamul) → Alt Grup: `ALT-001` (Elektronik) ✅
- Ana Grup: `AG-001` (Hammadde) → Alt Grup: `ALT-001` (Başka bir grup) ❌ (Duplicate!)

---

## İlişkiler

### STOK_ANA_GRUPLARI Tablosu ile İlişki (Parent)

Her alt grup bir ana gruba bağlıdır:

```sql
SELECT
    alt.sta_kod,
    alt.sta_isim,
    ana.san_kod AS ana_grup_kodu,
    ana.san_isim AS ana_grup_adi
FROM STOK_ALT_GRUPLARI alt
INNER JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
WHERE alt.sta_iptal = 0
    AND ana.san_iptal = 0
ORDER BY ana.san_kod, alt.sta_kod
```

### STOKLAR Tablosu ile İlişki (Children)

Alt gruplar, stok kartlarıyla bağlantılıdır:

```sql
SELECT
    alt.sta_kod,
    alt.sta_isim,
    COUNT(s.sto_Guid) AS stok_sayisi
FROM STOK_ALT_GRUPLARI alt
LEFT JOIN STOKLAR s ON s.sto_alt_grup_kod = alt.sta_kod
    AND s.sto_ana_grup_kod = alt.sta_ana_grup_kod
    AND s.sto_iptal = 0
WHERE alt.sta_iptal = 0
GROUP BY alt.sta_kod, alt.sta_isim
```

### STOK_DETAY_GRUPLARI Tablosu ile İlişki (Children)

Alt gruplar, detay grupların üst seviyesidir:

```sql
SELECT
    alt.sta_kod AS alt_grup_kodu,
    alt.sta_isim AS alt_grup_adi,
    det.sdt_kod AS detay_grup_kodu,
    det.sdt_isim AS detay_grup_adi
FROM STOK_ALT_GRUPLARI alt
LEFT JOIN STOK_DETAY_GRUPLARI det
    ON det.sdt_alt_grup_kod = alt.sta_kod
    AND det.sdt_ana_grup_kod = alt.sta_ana_grup_kod
WHERE alt.sta_iptal = 0
ORDER BY alt.sta_kod, det.sdt_kod
```

---

## SQL Sorgu Örnekleri

### 1. Tüm Aktif Alt Grupları Ana Gruplarıyla Listele

```sql
SELECT
    alt.sta_Guid,
    alt.sta_kod,
    alt.sta_isim,
    alt.sta_ana_grup_kod,
    ana.san_isim AS ana_grup_adi,
    alt.sta_create_date
FROM STOK_ALT_GRUPLARI alt
LEFT JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
WHERE alt.sta_iptal = 0
ORDER BY alt.sta_ana_grup_kod, alt.sta_kod
```

### 2. Belirli Bir Ana Grubun Alt Gruplarını Listele

```sql
SELECT
    sta_Guid,
    sta_kod,
    sta_isim,
    sta_create_date
FROM STOK_ALT_GRUPLARI
WHERE sta_ana_grup_kod = 'AG-001'
    AND sta_iptal = 0
ORDER BY sta_kod
```

### 3. Yeni Alt Grup Ekle

```sql
-- Önce ana grup kodunun geçerli olduğunu kontrol et
DECLARE @ana_grup_kod NVARCHAR(25) = 'AG-001';

IF NOT EXISTS (
    SELECT 1 FROM STOK_ANA_GRUPLARI
    WHERE san_kod = @ana_grup_kod AND san_iptal = 0
)
BEGIN
    RAISERROR('Ana grup bulunamadı veya iptal edilmiş', 16, 1);
    RETURN;
END

-- Alt grup ekle
INSERT INTO STOK_ALT_GRUPLARI (
    sta_Guid,
    sta_DBCno,
    sta_SpecRECno,
    sta_iptal,
    sta_fileid,
    sta_hidden,
    sta_kilitli,
    sta_degisti,
    sta_checksum,
    sta_create_user,
    sta_create_date,
    sta_lastup_user,
    sta_lastup_date,
    sta_special1,
    sta_special2,
    sta_special3,
    sta_kod,
    sta_isim,
    sta_ana_grup_kod
)
VALUES (
    NEWID(),                    -- sta_Guid
    1,                          -- sta_DBCno (şirket numarası)
    0,                          -- sta_SpecRECno
    0,                          -- sta_iptal (aktif)
    1,                          -- sta_fileid
    0,                          -- sta_hidden (görünür)
    0,                          -- sta_kilitli (açık)
    0,                          -- sta_degisti
    0,                          -- sta_checksum
    1,                          -- sta_create_user (kullanıcı ID)
    GETDATE(),                  -- sta_create_date
    1,                          -- sta_lastup_user
    GETDATE(),                  -- sta_lastup_date
    NULL,                       -- sta_special1
    NULL,                       -- sta_special2
    NULL,                       -- sta_special3
    'ALT-005',                  -- sta_kod
    'Kimyasal Hammaddeler',     -- sta_isim
    @ana_grup_kod               -- sta_ana_grup_kod
)
```

### 4. Alt Grubu Güncelle

```sql
UPDATE STOK_ALT_GRUPLARI
SET
    sta_isim = 'Güncellenmiş Alt Grup Adı',
    sta_lastup_user = 2,
    sta_lastup_date = GETDATE(),
    sta_degisti = 1
WHERE sta_ana_grup_kod = 'AG-001'
    AND sta_kod = 'ALT-001'
    AND sta_iptal = 0
```

### 5. Alt Grubu Soft Delete (İptal Et)

```sql
-- Önce bu alt gruba bağlı stoklar var mı kontrol et
DECLARE @ana_grup NVARCHAR(25) = 'AG-001';
DECLARE @alt_grup NVARCHAR(25) = 'ALT-003';

DECLARE @stok_sayisi INT;
SELECT @stok_sayisi = COUNT(*)
FROM STOKLAR
WHERE sto_ana_grup_kod = @ana_grup
    AND sto_alt_grup_kod = @alt_grup
    AND sto_iptal = 0;

IF @stok_sayisi > 0
BEGIN
    RAISERROR('Bu alt gruba bağlı %d adet stok var. Önce stokları taşıyın.', 16, 1, @stok_sayisi);
    RETURN;
END

-- Soft delete işlemi
UPDATE STOK_ALT_GRUPLARI
SET
    sta_iptal = 1,
    sta_lastup_user = 2,
    sta_lastup_date = GETDATE(),
    sta_degisti = 1
WHERE sta_ana_grup_kod = @ana_grup
    AND sta_kod = @alt_grup
```

### 6. Hiyerarşik Ağaç Yapısı Görünümü

```sql
SELECT
    ana.san_kod AS ana_grup_kodu,
    ana.san_isim AS ana_grup_adi,
    alt.sta_kod AS alt_grup_kodu,
    alt.sta_isim AS alt_grup_adi,
    COUNT(DISTINCT s.sto_Guid) AS toplam_stok
FROM STOK_ANA_GRUPLARI ana
LEFT JOIN STOK_ALT_GRUPLARI alt
    ON alt.sta_ana_grup_kod = ana.san_kod
    AND alt.sta_iptal = 0
LEFT JOIN STOKLAR s
    ON s.sto_ana_grup_kod = alt.sta_ana_grup_kod
    AND s.sto_alt_grup_kod = alt.sta_kod
    AND s.sto_iptal = 0
WHERE ana.san_iptal = 0
GROUP BY ana.san_kod, ana.san_isim, alt.sta_kod, alt.sta_isim
ORDER BY ana.san_kod, alt.sta_kod
```

### 7. Boş Alt Grupları Bul (Stok İçermeyen)

```sql
SELECT
    alt.sta_kod,
    alt.sta_isim,
    alt.sta_ana_grup_kod,
    ana.san_isim AS ana_grup_adi
FROM STOK_ALT_GRUPLARI alt
INNER JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
WHERE alt.sta_iptal = 0
    AND NOT EXISTS (
        SELECT 1 FROM STOKLAR s
        WHERE s.sto_ana_grup_kod = alt.sta_ana_grup_kod
            AND s.sto_alt_grup_kod = alt.sta_kod
            AND s.sto_iptal = 0
    )
ORDER BY alt.sta_ana_grup_kod, alt.sta_kod
```

### 8. Alt Grup Koduna Göre Ara (Pattern Matching)

```sql
SELECT
    alt.sta_kod,
    alt.sta_isim,
    alt.sta_ana_grup_kod,
    ana.san_isim AS ana_grup_adi
FROM STOK_ALT_GRUPLARI alt
LEFT JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
WHERE alt.sta_kod LIKE 'ALT-%'
    AND alt.sta_iptal = 0
ORDER BY alt.sta_kod
```

---

## DinamikSAYO Entegrasyonu

### TypeScript Arayüzü

```typescript
// types/StockSubGroup.ts

export interface StockSubGroup {
  // Sistem alanları
  staGuid: string // Benzersiz tanımlayıcı (GUID)
  staDBCno: number // Veritabanı şirketi numarası
  staSpecRECno: number // Özel kayıt numarası
  staFileId: number // Dosya tanımlayıcı
  staChecksum: number // Kontrol toplamı

  // Temel bilgiler
  staKod: string // Alt grup kodu
  staIsim: string // Alt grup adı
  staAnaGrupKod: string // Ana grup kodu (Foreign Key)

  // Durum bayrakları
  staIptal: boolean // İptal bayrağı
  staHidden: boolean // Gizli bayrak
  staKilitli: boolean // Kilitli bayrak
  staDegisti: boolean // Değişim bayrağı

  // Kullanıcı izleme
  staCreateUser: number // Oluşturan kullanıcı
  staCreateDate: Date // Oluşturma tarihi
  staLastupUser: number // Son güncelleyen kullanıcı
  staLastupDate: Date // Son güncelleme tarihi

  // Özel alanlar
  staSpecial1?: string // Özel alan 1
  staSpecial2?: string // Özel alan 2
  staSpecial3?: string // Özel alan 3

  // İlişkili veriler (JOIN'den gelen)
  anaGrupAdi?: string // Ana grup adı
  stokSayisi?: number // Bu alt gruptaki toplam stok sayısı
}

// Alt Grup Oluşturma İsteği
export interface CreateStockSubGroupRequest {
  staKod: string
  staIsim: string
  staAnaGrupKod: string // Zorunlu: Bağlı olduğu ana grup
  staSpecial1?: string
  staSpecial2?: string
  staSpecial3?: string
}

// Alt Grup Güncelleme İsteği
export interface UpdateStockSubGroupRequest {
  staIsim?: string
  staSpecial1?: string
  staSpecial2?: string
  staSpecial3?: string
  staKilitli?: boolean
  // Not: Ana grup değiştirilemez (veri tutarlılığı için)
}

// Hiyerarşik Alt Grup Görünümü
export interface StockSubGroupHierarchy {
  staGuid: string
  staKod: string
  staIsim: string
  staAnaGrupKod: string
  anaGrupAdi: string
  stokSayisi: number
  detayGrupSayisi: number
}
```

### API Endpoint Örnekleri

#### 1. Tüm Alt Grupları Listele

```typescript
// GET /api/stock-sub-groups

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const anaGrupKod = searchParams.get("anaGrupKod")

    let query = `
      SELECT 
        alt.sta_Guid as staGuid,
        alt.sta_kod as staKod,
        alt.sta_isim as staIsim,
        alt.sta_ana_grup_kod as staAnaGrupKod,
        ana.san_isim as anaGrupAdi,
        alt.sta_iptal as staIptal,
        alt.sta_hidden as staHidden,
        alt.sta_kilitli as staKilitli,
        alt.sta_create_date as staCreateDate,
        alt.sta_lastup_date as staLastupDate
      FROM STOK_ALT_GRUPLARI alt
      LEFT JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
      WHERE alt.sta_iptal = 0
    `

    const params: any = {}

    // Eğer ana grup kodu verilmişse filtreleme yap
    if (anaGrupKod) {
      query += ` AND alt.sta_ana_grup_kod = @anaGrupKod`
      params.anaGrupKod = anaGrupKod
    }

    query += ` ORDER BY alt.sta_ana_grup_kod, alt.sta_kod`

    const result = await executeQuery(query, params)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 2. Belirli Alt Grubu Getir

```typescript
// GET /api/stock-sub-groups/:anaGrupKod/:kod

export async function GET(
  request: Request,
  { params }: { params: { anaGrupKod: string; kod: string } }
) {
  try {
    const query = `
      SELECT 
        alt.*,
        ana.san_isim as anaGrupAdi,
        COUNT(DISTINCT s.sto_Guid) as stokSayisi
      FROM STOK_ALT_GRUPLARI alt
      LEFT JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
      LEFT JOIN STOKLAR s 
        ON s.sto_ana_grup_kod = alt.sta_ana_grup_kod
        AND s.sto_alt_grup_kod = alt.sta_kod
        AND s.sto_iptal = 0
      WHERE alt.sta_ana_grup_kod = @anaGrupKod
        AND alt.sta_kod = @kod
        AND alt.sta_iptal = 0
      GROUP BY 
        alt.sta_Guid, alt.sta_DBCno, alt.sta_SpecRECno, alt.sta_iptal,
        alt.sta_fileid, alt.sta_hidden, alt.sta_kilitli, alt.sta_degisti,
        alt.sta_checksum, alt.sta_create_user, alt.sta_create_date,
        alt.sta_lastup_user, alt.sta_lastup_date, alt.sta_special1,
        alt.sta_special2, alt.sta_special3, alt.sta_kod, alt.sta_isim,
        alt.sta_ana_grup_kod, ana.san_isim
    `

    const result = await executeQuery(query, {
      anaGrupKod: params.anaGrupKod,
      kod: params.kod,
    })

    if (!result.length) {
      return Response.json({ error: "Alt grup bulunamadı" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 3. Yeni Alt Grup Ekle

```typescript
// POST /api/stock-sub-groups

export async function POST(request: Request) {
  try {
    const data: CreateStockSubGroupRequest = await request.json()

    // Validasyon
    if (!data.staKod || !data.staIsim || !data.staAnaGrupKod) {
      return Response.json(
        { error: "Alt grup kodu, adı ve ana grup kodu gereklidir" },
        { status: 400 }
      )
    }

    // Ana grup var mı kontrol et
    const anaGrupCheck = `
      SELECT COUNT(*) as cnt FROM STOK_ANA_GRUPLARI
      WHERE san_kod = @anaGrupKod AND san_iptal = 0
    `
    const anaGrupResult = await executeQuery(anaGrupCheck, {
      anaGrupKod: data.staAnaGrupKod,
    })

    if (anaGrupResult[0].cnt === 0) {
      return Response.json(
        { error: "Ana grup bulunamadı veya iptal edilmiş" },
        { status: 404 }
      )
    }

    // Composite unique constraint kontrolü (ana_grup_kod + alt_grup_kod)
    const uniqueCheck = `
      SELECT COUNT(*) as cnt FROM STOK_ALT_GRUPLARI
      WHERE sta_ana_grup_kod = @anaGrupKod 
        AND sta_kod = @kod
    `
    const uniqueResult = await executeQuery(uniqueCheck, {
      anaGrupKod: data.staAnaGrupKod,
      kod: data.staKod,
    })

    if (uniqueResult[0].cnt > 0) {
      return Response.json(
        { error: "Bu ana grup altında bu alt grup kodu zaten kullanılıyor" },
        { status: 409 }
      )
    }

    const insertQuery = `
      INSERT INTO STOK_ALT_GRUPLARI (
        sta_Guid, sta_DBCno, sta_SpecRECno, sta_iptal,
        sta_fileid, sta_hidden, sta_kilitli, sta_degisti,
        sta_checksum, sta_create_user, sta_create_date,
        sta_lastup_user, sta_lastup_date,
        sta_special1, sta_special2, sta_special3,
        sta_kod, sta_isim, sta_ana_grup_kod
      )
      VALUES (
        NEWID(), @dbcno, 0, 0, 1, 0, 0, 0, 0,
        @userId, GETDATE(), @userId, GETDATE(),
        @special1, @special2, @special3,
        @kod, @isim, @anaGrupKod
      )
    `

    await executeQuery(insertQuery, {
      dbcno: 1,
      userId: getCurrentUserId(),
      special1: data.staSpecial1 || null,
      special2: data.staSpecial2 || null,
      special3: data.staSpecial3 || null,
      kod: data.staKod,
      isim: data.staIsim,
      anaGrupKod: data.staAnaGrupKod,
    })

    return Response.json(
      { message: "Alt grup başarıyla oluşturuldu" },
      { status: 201 }
    )
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 4. Alt Grubu Güncelle

```typescript
// PATCH /api/stock-sub-groups/:anaGrupKod/:kod

export async function PATCH(
  request: Request,
  { params }: { params: { anaGrupKod: string; kod: string } }
) {
  try {
    const data: UpdateStockSubGroupRequest = await request.json()

    const updateQuery = `
      UPDATE STOK_ALT_GRUPLARI
      SET
        sta_isim = COALESCE(@isim, sta_isim),
        sta_special1 = COALESCE(@special1, sta_special1),
        sta_special2 = COALESCE(@special2, sta_special2),
        sta_special3 = COALESCE(@special3, sta_special3),
        sta_kilitli = COALESCE(@kilitli, sta_kilitli),
        sta_lastup_user = @userId,
        sta_lastup_date = GETDATE(),
        sta_degisti = 1
      WHERE sta_ana_grup_kod = @anaGrupKod
        AND sta_kod = @kod
        AND sta_iptal = 0
    `

    await executeQuery(updateQuery, {
      anaGrupKod: params.anaGrupKod,
      kod: params.kod,
      isim: data.staIsim || null,
      special1: data.staSpecial1 || null,
      special2: data.staSpecial2 || null,
      special3: data.staSpecial3 || null,
      kilitli: data.staKilitli !== undefined ? (data.staKilitli ? 1 : 0) : null,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Alt grup güncellendi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

#### 5. Alt Grubu Sil (Soft Delete)

```typescript
// DELETE /api/stock-sub-groups/:anaGrupKod/:kod

export async function DELETE(
  request: Request,
  { params }: { params: { anaGrupKod: string; kod: string } }
) {
  try {
    // Önce bu alt gruba bağlı stoklar var mı kontrol et
    const checkStocksQuery = `
      SELECT COUNT(*) as cnt FROM STOKLAR
      WHERE sto_ana_grup_kod = @anaGrupKod
        AND sto_alt_grup_kod = @kod
        AND sto_iptal = 0
    `

    const stockCheck = await executeQuery(checkStocksQuery, {
      anaGrupKod: params.anaGrupKod,
      kod: params.kod,
    })

    if (stockCheck[0].cnt > 0) {
      return Response.json(
        {
          error: `Bu alt gruba bağlı ${stockCheck[0].cnt} adet stok var. Önce stokları başka gruplara taşıyın.`,
        },
        { status: 409 }
      )
    }

    const deleteQuery = `
      UPDATE STOK_ALT_GRUPLARI
      SET
        sta_iptal = 1,
        sta_lastup_user = @userId,
        sta_lastup_date = GETDATE(),
        sta_degisti = 1
      WHERE sta_ana_grup_kod = @anaGrupKod
        AND sta_kod = @kod
    `

    await executeQuery(deleteQuery, {
      anaGrupKod: params.anaGrupKod,
      kod: params.kod,
      userId: getCurrentUserId(),
    })

    return Response.json({ message: "Alt grup silindi" })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

### React Bileşen Örnekleri

#### Cascade Alt Grup Seçim Bileşeni

```typescript
// components/stock-sub-group-select.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StockSubGroup } from "@/types/StockSubGroup"

interface StockSubGroupSelectProps {
  anaGrupKod: string // Ana grup kodu (required)
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function StockSubGroupSelect({
  anaGrupKod,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Alt grup seçin...",
}: StockSubGroupSelectProps) {
  const [subGroups, setSubGroups] = useState<StockSubGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!anaGrupKod) {
      setSubGroups([])
      setLoading(false)
      return
    }

    const fetchSubGroups = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/stock-sub-groups?anaGrupKod=${anaGrupKod}`
        )
        if (!response.ok) throw new Error("Alt gruplar yüklenemedi")

        const data = await response.json()
        setSubGroups(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchSubGroups()
  }, [anaGrupKod])

  if (!anaGrupKod) {
    return <div className="text-sm text-gray-500">Önce ana grup seçin</div>
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {error ? (
          <div className="px-2 py-1.5 text-sm text-red-500">{error}</div>
        ) : subGroups.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">
            Bu ana gruba ait alt grup bulunamadı
          </div>
        ) : (
          subGroups.map((group) => (
            <SelectItem key={group.staGuid} value={group.staKod}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.staKod}</span>
                <span className="text-gray-600">-</span>
                <span>{group.staIsim}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
```

#### Hiyerarşik Grup Seçim Bileşeni

```typescript
// components/hierarchical-group-select.tsx

"use client"

import { useState } from "react"
import { StockMainGroupSelect } from "./stock-main-group-select"
import { StockSubGroupSelect } from "./stock-sub-group-select"
import { Label } from "@/components/ui/label"

interface HierarchicalGroupSelectProps {
  anaGrupKod?: string
  altGrupKod?: string
  onAnaGrupChange?: (kod: string) => void
  onAltGrupChange?: (kod: string) => void
  disabled?: boolean
}

export function HierarchicalGroupSelect({
  anaGrupKod,
  altGrupKod,
  onAnaGrupChange,
  onAltGrupChange,
  disabled = false,
}: HierarchicalGroupSelectProps) {
  const [selectedAnaGrup, setSelectedAnaGrup] = useState(anaGrupKod || "")
  const [selectedAltGrup, setSelectedAltGrup] = useState(altGrupKod || "")

  const handleAnaGrupChange = (kod: string) => {
    setSelectedAnaGrup(kod)
    setSelectedAltGrup("") // Ana grup değişince alt grubu sıfırla
    onAnaGrupChange?.(kod)
    onAltGrupChange?.("")
  }

  const handleAltGrupChange = (kod: string) => {
    setSelectedAltGrup(kod)
    onAltGrupChange?.(kod)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ana-grup">Ana Grup</Label>
        <StockMainGroupSelect
          value={selectedAnaGrup}
          onValueChange={handleAnaGrupChange}
          disabled={disabled}
          placeholder="Ana grup seçin..."
        />
      </div>

      <div>
        <Label htmlFor="alt-grup">Alt Grup</Label>
        <StockSubGroupSelect
          anaGrupKod={selectedAnaGrup}
          value={selectedAltGrup}
          onValueChange={handleAltGrupChange}
          disabled={disabled || !selectedAnaGrup}
          placeholder={
            selectedAnaGrup ? "Alt grup seçin..." : "Önce ana grup seçin"
          }
        />
      </div>
    </div>
  )
}
```

#### Alt Grup Ağaç Görünümü

```typescript
// components/stock-group-tree.tsx

"use client"

import { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react"
import { StockMainGroup } from "@/types/StockMainGroup"
import { StockSubGroup } from "@/types/StockSubGroup"

interface TreeNode {
  anaGrup: StockMainGroup
  altGruplar: StockSubGroup[]
  expanded: boolean
}

export function StockGroupTree() {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ana grupları getir
        const anaGrupResponse = await fetch("/api/stock-main-groups")
        const anaGruplar: StockMainGroup[] = await anaGrupResponse.json()

        // Her ana grup için alt grupları getir
        const treeData = await Promise.all(
          anaGruplar.map(async (anaGrup) => {
            const altGrupResponse = await fetch(
              `/api/stock-sub-groups?anaGrupKod=${anaGrup.sanKod}`
            )
            const altGruplar: StockSubGroup[] = await altGrupResponse.json()

            return {
              anaGrup,
              altGruplar,
              expanded: false,
            }
          })
        )

        setTree(treeData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleNode = (index: number) => {
    setTree((prev) =>
      prev.map((node, i) =>
        i === index ? { ...node, expanded: !node.expanded } : node
      )
    )
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-1">
      {tree.map((node, index) => (
        <div key={node.anaGrup.sanGuid}>
          {/* Ana Grup */}
          <div
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => toggleNode(index)}
          >
            {node.altGruplar.length > 0 ? (
              node.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="w-4" />
            )}
            {node.expanded ? (
              <FolderOpen className="h-5 w-5 text-blue-500" />
            ) : (
              <Folder className="h-5 w-5 text-blue-500" />
            )}
            <span className="font-medium">{node.anaGrup.sanKod}</span>
            <span>-</span>
            <span>{node.anaGrup.sanIsim}</span>
            <span className="ml-auto text-sm text-gray-500">
              ({node.altGruplar.length} alt grup)
            </span>
          </div>

          {/* Alt Gruplar */}
          {node.expanded && (
            <div className="ml-6 space-y-1">
              {node.altGruplar.map((altGrup) => (
                <div
                  key={altGrup.staGuid}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <Folder className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">{altGrup.staKod}</span>
                  <span className="text-sm">-</span>
                  <span className="text-sm">{altGrup.staIsim}</span>
                  {altGrup.stokSayisi !== undefined && (
                    <span className="ml-auto text-xs text-gray-500">
                      ({altGrup.stokSayisi} stok)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## Önemli Notlar

### 🔑 Composite Unique Constraint

- Alt grup kodu (`sta_kod`) **tek başına benzersiz değildir**
- **Ana grup kodu + Alt grup kodu** kombinasyonu benzersiz olmalıdır
- Bu sayede farklı ana gruplar altında aynı alt grup kodu kullanılabilir

**Örnekler:**

```sql
-- ✅ Geçerli: Farklı ana gruplar
('AG-001', 'ALT-001', 'Kimyasallar')
('AG-002', 'ALT-001', 'Elektronik')

-- ❌ Geçersiz: Aynı ana grup altında duplicate kod
('AG-001', 'ALT-001', 'Kimyasallar')
('AG-001', 'ALT-001', 'Başka bir grup')
```

### 🔗 Foreign Key İlişkisi

- `sta_ana_grup_kod` alanı `STOK_ANA_GRUPLARI.san_kod` alanına referans verir
- Alt grup eklerken ana grup kodunun geçerliliği kontrol edilmelidir
- Ana grup iptal edilirse/silinirse bağlı alt gruplar yetim kalabilir (cascade kontrolü önerilir)

### 🗑️ Silme İşlemi - Cascade Kontrolü

Alt grup silinmeden önce:

1. Bağlı stoklar kontrol edilmelidir
2. Bağlı detay gruplar kontrol edilmelidir
3. Eğer bağlı kayıtlar varsa silme işlemi engellenmelidir
4. Soft delete (`sta_iptal = 1`) kullanılır

### 🏗️ Hiyerarşik Navigasyon

Cascade seçim (waterfall selection):

1. Önce ana grup seçilir
2. Ana grup seçildikten sonra o ana gruba bağlı alt gruplar listelenir
3. Alt grup seçimi ana grup seçimine bağımlıdır
4. Ana grup değiştiğinde alt grup seçimi sıfırlanmalıdır

### 📊 Kategorizasyon Örnekleri

**Hammadde Ana Grubu:**

- ALT-001: Kimyasal Hammaddeler
- ALT-002: Metal Hammaddeler
- ALT-003: Plastik Hammaddeler

**Mamul Ana Grubu:**

- ALT-001: Beyaz Eşya
- ALT-002: Elektronik Cihazlar
- ALT-003: Mobilya

**Ticari Mal Ana Grubu:**

- ALT-001: Gıda Ürünleri
- ALT-002: Temizlik Ürünleri
- ALT-003: Kırtasiye Malzemeleri

### 🔒 Veri Tutarlılığı

- Alt grup güncellenirken ana grup kodu değiştirilmemelidir
- Ana grup kodu değiştirmek için alt grup silinip yeniden oluşturulmalıdır
- Bu kısıtlama veri tutarlılığını korur

### 👁️ Gizli/Kilitli Alt Gruplar

- `sta_hidden = 1`: Arayüzde gösterilmez
- `sta_kilitli = 1`: Salt okunur, güncellenemez/silinemez
- Ana grup gizli/kilitli ise alt gruplar otomatik olarak etkilenmez (bağımsız bayraklar)

---

## İstatistik Sorguları

### Alt Grup İstatistikleri

```sql
SELECT
    COUNT(*) AS toplam_alt_grup_sayisi,
    SUM(CASE WHEN sta_iptal = 0 THEN 1 ELSE 0 END) AS aktif_alt_grup,
    SUM(CASE WHEN sta_iptal = 1 THEN 1 ELSE 0 END) AS iptal_alt_grup,
    COUNT(DISTINCT sta_ana_grup_kod) AS kullanilan_ana_grup_sayisi
FROM STOK_ALT_GRUPLARI
```

### Ana Grup Bazında Alt Grup Dağılımı

```sql
SELECT
    ana.san_kod,
    ana.san_isim,
    COUNT(alt.sta_Guid) AS alt_grup_sayisi,
    SUM(CASE WHEN alt.sta_hidden = 1 THEN 1 ELSE 0 END) AS gizli_alt_grup,
    SUM(CASE WHEN alt.sta_kilitli = 1 THEN 1 ELSE 0 END) AS kilitli_alt_grup
FROM STOK_ANA_GRUPLARI ana
LEFT JOIN STOK_ALT_GRUPLARI alt
    ON alt.sta_ana_grup_kod = ana.san_kod
    AND alt.sta_iptal = 0
WHERE ana.san_iptal = 0
GROUP BY ana.san_kod, ana.san_isim
ORDER BY alt_grup_sayisi DESC
```

### En Çok Stok İçeren Alt Gruplar

```sql
SELECT TOP 10
    alt.sta_kod,
    alt.sta_isim,
    alt.sta_ana_grup_kod,
    ana.san_isim AS ana_grup_adi,
    COUNT(s.sto_Guid) AS stok_sayisi
FROM STOK_ALT_GRUPLARI alt
LEFT JOIN STOK_ANA_GRUPLARI ana ON alt.sta_ana_grup_kod = ana.san_kod
LEFT JOIN STOKLAR s
    ON s.sto_ana_grup_kod = alt.sta_ana_grup_kod
    AND s.sto_alt_grup_kod = alt.sta_kod
    AND s.sto_iptal = 0
WHERE alt.sta_iptal = 0
GROUP BY alt.sta_kod, alt.sta_isim, alt.sta_ana_grup_kod, ana.san_isim
ORDER BY stok_sayisi DESC
```

### Yetim Alt Gruplar (Ana Grubu Olmayan)

```sql
SELECT
    alt.sta_kod,
    alt.sta_isim,
    alt.sta_ana_grup_kod AS hata_ana_grup_kodu
FROM STOK_ALT_GRUPLARI alt
WHERE alt.sta_iptal = 0
    AND NOT EXISTS (
        SELECT 1 FROM STOK_ANA_GRUPLARI ana
        WHERE ana.san_kod = alt.sta_ana_grup_kod
        AND ana.san_iptal = 0
    )
```

---

## Kaynaklar

- 📚 **Mikro ERP Belgeleri**: https://mikro.com.tr/
- 🔗 **İlişkili Tablolar**: STOK_ANA_GRUPLARI (parent), STOKLAR (children), STOK_DETAY_GRUPLARI (children)
- 💻 **DinamikSAYO Projesi**: Mikro ERP ile entegre satın alma yönetim sistemi
- 📖 **Diğer Stok Tabloları**: STOK_HAREKETLERI, STOK_URETICILERI, STOK_REYONLARI

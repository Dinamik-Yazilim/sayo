# STOK_URETICILERI - Üretici Kartları Tablosu

## 📋 Genel Bilgi

**Tablo Adı:** `STOK_URETICILERI`  
**Açıklama:** Stok (ürün) üreticilerinin tanımlandığı tablo  
**Kullanım Alanı:** Ürün kartlarında üretici bilgisi tanımlamak için kullanılır

---

## 🔑 Temel Alanlar

### Üretici Bilgileri

| Alan Adı   | Tip          | Açıklama     | Özellik             |
| ---------- | ------------ | ------------ | ------------------- |
| `urt_kod`  | NVARCHAR(25) | Üretici Kodu | **Unique**, Zorunlu |
| `urt_ismi` | NVARCHAR(40) | Üretici Adı  | Zorunlu             |

**Örnek Veri:**

```sql
urt_kod: 'BOSCH'
urt_ismi: 'Robert Bosch GmbH'
```

---

## 🔧 Sistem Alanları

### Temel Sistem Alanları

| Alan Adı        | Tip              | Açıklama                         |
| --------------- | ---------------- | -------------------------------- |
| `urt_Guid`      | UNIQUEIDENTIFIER | Benzersiz kayıt ID (Primary Key) |
| `urt_DBCno`     | SMALLINT         | Veritabanı şirket numarası       |
| `urt_SpecRECno` | INTEGER          | Özel kayıt numarası              |

### Durum Alanları (Flag)

| Alan Adı      | Tip | Açıklama           | Değerler             |
| ------------- | --- | ------------------ | -------------------- |
| `urt_iptal`   | BIT | İptal edilmiş mi?  | 0: Aktif, 1: İptal   |
| `urt_hidden`  | BIT | Gizli mi?          | 0: Görünür, 1: Gizli |
| `urt_kilitli` | BIT | Kilitli mi?        | 0: Açık, 1: Kilitli  |
| `urt_degisti` | BIT | Değişiklik var mı? | 0: Hayır, 1: Evet    |

### Kontrol ve İzleme

| Alan Adı       | Tip      | Açıklama        |
| -------------- | -------- | --------------- |
| `urt_fileid`   | SMALLINT | Dosya ID        |
| `urt_checksum` | INTEGER  | Kontrol toplamı |

### Kullanıcı İzleme

| Alan Adı          | Tip      | Açıklama                     |
| ----------------- | -------- | ---------------------------- |
| `urt_create_user` | SMALLINT | Oluşturan kullanıcı ID       |
| `urt_create_date` | DATETIME | Oluşturma tarihi             |
| `urt_lastup_user` | SMALLINT | Son güncelleyen kullanıcı ID |
| `urt_lastup_date` | DATETIME | Son güncelleme tarihi        |

### Özel Alanlar

| Alan Adı       | Tip         | Açıklama    |
| -------------- | ----------- | ----------- |
| `urt_special1` | NVARCHAR(4) | Özel alan 1 |
| `urt_special2` | NVARCHAR(4) | Özel alan 2 |
| `urt_special3` | NVARCHAR(4) | Özel alan 3 |

---

## 📊 İlişkili Tablolar

### STOKLAR İlişkisi

Üretici bilgisi STOKLAR tablosunda kullanılır:

```sql
SELECT
    s.sto_kod,
    s.sto_isim,
    s.sto_uretici_kodu,
    u.urt_ismi as uretici_adi
FROM STOKLAR s
LEFT JOIN STOK_URETICILERI u ON s.sto_uretici_kodu = u.urt_kod
WHERE u.urt_iptal = 0
```

---

## 🔍 Örnek Sorgular

### Tüm Üreticileri Listele

```sql
SELECT
    urt_kod as code,
    urt_ismi as name,
    urt_create_date as createdAt
FROM STOK_URETICILERI
WHERE urt_iptal = 0
ORDER BY urt_ismi
```

### Üreticiye Göre Ürünleri Listele

```sql
SELECT
    u.urt_kod as ureticiKodu,
    u.urt_ismi as uretici,
    COUNT(s.sto_kod) as urunSayisi
FROM STOK_URETICILERI u
LEFT JOIN STOKLAR s ON u.urt_kod = s.sto_uretici_kodu
WHERE u.urt_iptal = 0
GROUP BY u.urt_kod, u.urt_ismi
ORDER BY urunSayisi DESC
```

### Yeni Üretici Ekleme

```sql
INSERT INTO STOK_URETICILERI (
    urt_Guid,
    urt_kod,
    urt_ismi,
    urt_iptal,
    urt_create_date,
    urt_create_user
)
VALUES (
    NEWID(),
    'SAMSUNG',
    'Samsung Electronics',
    0,
    GETDATE(),
    @userId
)
```

---

## 🎯 DinamikSAYO Kullanımı

### API Endpoint Önerisi

```javascript
// GET /api/manufacturers
app.get("/manufacturers", async (req, res) => {
  const query = `
        SELECT 
            urt_Guid as _id,
            urt_kod as code,
            urt_ismi as name
        FROM STOK_URETICILERI
        WHERE urt_iptal = 0
        ORDER BY urt_ismi
    `
  const result = await executeQuery(query)
  res.json(result)
})
```

### TypeScript Interface

```typescript
interface Manufacturer {
  _id: string // urt_Guid
  code: string // urt_kod
  name: string // urt_ismi
  createdAt?: Date // urt_create_date
  updatedAt?: Date // urt_lastup_date
}
```

### React Component Örneği

```typescript
// Üretici seçim dropdown'ı
const ManufacturerSelect = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])

  useEffect(() => {
    fetch("/api/manufacturers")
      .then((res) => res.json())
      .then((data) => setManufacturers(data))
  }, [])

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Üretici Seçin" />
      </SelectTrigger>
      <SelectContent>
        {manufacturers.map((m) => (
          <SelectItem key={m._id} value={m.code}>
            {m.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

---

## ⚠️ Önemli Notlar

1. **Kod Benzersizliği**: `urt_kod` alanı benzersiz (UNIQUE) olmalıdır
2. **İptal Kontrolü**: Sorgulamalarda mutlaka `urt_iptal = 0` kontrolü yapın
3. **Boş Değerler**: `urt_kod` ve `urt_ismi` alanları NULL olamaz
4. **Silme İşlemi**: Kayıtlar fiziksel olarak silinmez, `urt_iptal = 1` yapılır
5. **Stok İlişkisi**: Üretici silinmeden önce, o üreticiyi kullanan stoklar kontrol edilmelidir

---

## 📈 İstatistikler

```sql
-- Toplam üretici sayısı
SELECT COUNT(*) as toplamUretici
FROM STOK_URETICILERI
WHERE urt_iptal = 0

-- En çok ürüne sahip üreticiler
SELECT TOP 10
    u.urt_ismi,
    COUNT(s.sto_kod) as urunSayisi
FROM STOK_URETICILERI u
LEFT JOIN STOKLAR s ON u.urt_kod = s.sto_uretici_kodu
WHERE u.urt_iptal = 0
GROUP BY u.urt_ismi
ORDER BY urunSayisi DESC
```

---

**Son Güncelleme:** 31 Ekim 2025  
**Dinamik Yazılım Ltd. Şti.**  
DinamikSAYO - Mikro ERP Entegre Satın Alma Yönetim Sistemi

# BANKALAR (Banka Kartları)

## Genel Bakış

Firmanın çalıştığı banka hesaplarını tanımlar. Mevduat/kredi hesapları, IBAN, muhasebe kodları ve ilgili ayarları içerir.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `ban_Guid` - PRIMARY KEY (Uniqueidentifier)
- `ban_DBCno`, `ban_SpecRECNo`, `ban_iptal`, `ban_fileid`
- `ban_hidden`, `ban_kilitli`, `ban_degisti`, `ban_CheckSum`
- `ban_create_user`, `ban_create_date`, `ban_lastup_user`, `ban_lastup_date`
- `ban_special1`, `ban_special2`, `ban_special3`

### Temel Bilgiler (16-22)

- `ban_kod` - Banka kodu (UNIQUE, Nvarchar(25))
- `ban_ismi` - Banka ismi (Nvarchar(50))
- `ban_sube` - Şube adı (Nvarchar(50))
- `ban_SwiftKodu` - Swift kodu (Nvarchar(25))
- `ban_IBANKodu` - IBAN kodu (Nvarchar(40))
- `ban_hesapno` - Hesap numarası (Nvarchar(30))
- `ban_firma_no` - Firma numarası (Integer)

### Hesap Tipleri (23-25)

- `ban_hesap_tip` - Hesap tipi (0:Mevduat, 1:Kredi)
- `ban_mevduat_tip` - Mevduat cinsi (0-6)
- `ban_kredi_tip` - Kredi cinsi (0-5)

### Muhasebe Kodları (26-36, 74-86)

- `ban_muh_kod` - Banka muhasebe kodu
- `ban_ver_cek_muh_kod` - Verilen çek muhasebe kodu
- `ban_tah_cek_muh_kod` - Tahsil çek muhasebe kodu
- `ban_tah_sen_muh_kod` - Tahsil senet muhasebe kodu
- `ban_tem_cek_muh_kod` - Teminat çek muhasebe kodu
- `ban_tem_sen_muh_kod` - Teminat senet muhasebe kodu
- `ban_mus_krdrkart_muh_kod` - Müşteri kredi kartı muhasebe kodu
- `ban_frm_krdrkart_muh_kod` - Firma kredi kartı muhasebe kodu
- `ban_must_havale_sozu_muh_kodu` - Müşteri havale sözü muhasebe kodu
- `ban_firma_havale_emri_muh_kodu` - Firma havale emri muhasebe kodu
- `ban_tem_muh_kodu` - Teminat muhasebe kodu
- UFRS kodları (74-86)

### Finansal Bilgiler (37-40)

- `ban_doviz_cinsi` - Döviz cinsi (Tinyint)
- `ban_vade_fark_yuzde` - Vade fark yüzdesi (Float)
- `ban_kredi_tavan` - Kredi tavanı (Float)
- `ban_risk_tavan` - Risk tavanı (Float)

### TCMB ve Diğer (42-47)

- `ban_nakakincelenmesi` - Nakit akışta incelenmesin (Bit)
- `ban_TCMB_Kodu`, `ban_TCMB_Sube_Kodu`, `ban_TCMB_Il_Kodu`
- `ban_musteri_no` - Müşteri numarası
- `ban_Ayni_banka_tahsil_suresi`, `ban_baska_banka_tahsil_suresi`

### Ödül/Komisyon Hesapları (48-54)

- `ban_odul_katkisi_hesap_cinsi`, `ban_odul_katkisi_hesabi`
- `ban_servis_komisyon_hesap_cinsi`, `ban_servis_komisyon_hesabi`
- `ban_erken_odm_faiz_hesap_cinsi`, `ban_erken_odm_faiz_hesabi`
- `ban_pos_tahsilat_cari_hesabi`

### Adres ve İletişim (55-73)

- Adres: `ban_adr_cadde`, `ban_adr_mahalle`, `ban_adr_sokak`, `ban_adr_Semt`
- `ban_adr_Apt_No`, `ban_adr_Daire_No`, `ban_adr_posta_kodu`
- `ban_adr_ilce`, `ban_adr_il`, `ban_adr_ulke`, `ban_adr_adres_kodu`
- Telefon: `ban_tel_ulke_kodu`, `ban_tel_bolge_kodu`, `ban_tel_no1`, `ban_tel_no2`
- `ban_tel_faxno`, `ban_tel_modem`
- `ban_temsilci`, `ban_temsilci_email`

## Enum Değerleri

### ban_hesap_tip

- 0: Mevduat
- 1: Kredi

### ban_mevduat_tip

- 0: Vadesiz ticari
- 1: Vadesiz tasarruf
- 2: Vadeli tasarruf
- 3: Yatırım fonu
- 4: Repo
- 5: Bloke
- 6: Diğer mevduat

### ban_kredi_tip

- 0: Kısa vadeli açık kredi
- 1: Kısa vadeli teminatlı kredi
- 2: Uzun vadeli açık kredi
- 3: Uzun vadeli teminatlı kredi
- 4: Exim kredileri
- 5: Diğer kredi

## İlişkiler

- **BANKA_HAREKETLERI** ← KOD: `bnh_banka_kodu` → `ban_kod`
- **CEKSENET_HAREKETLERI** ← KOD: `cns_banka_kodu` → `ban_kod`
- **MUHASEBE_HESAP_PLANI** ← KOD: `ban_muh_kod` → `muh_kod`

## Indexler

```sql
PRIMARY KEY: ban_Guid
UNIQUE: ban_kod
INDEX: ban_ismi
```

## SQL Örnekleri

### 1. Banka Listesi

```sql
SELECT
  ban_kod,
  ban_ismi,
  ban_sube,
  ban_IBANKodu,
  ban_hesapno
FROM BANKALAR
WHERE ban_iptal = 0
ORDER BY ban_kod
```

### 2. Mevduat Hesapları

```sql
SELECT
  ban_kod,
  ban_ismi,
  ban_IBANKodu,
  ban_mevduat_tip
FROM BANKALAR
WHERE ban_hesap_tip = 0
  AND ban_iptal = 0
```

### 3. Kredi Hesapları ve Limit

```sql
SELECT
  ban_kod,
  ban_ismi,
  ban_kredi_tavan,
  ban_risk_tavan,
  ban_kredi_tip
FROM BANKALAR
WHERE ban_hesap_tip = 1
  AND ban_iptal = 0
```

## TypeScript Interface

```typescript
interface Banka {
  banGuid: string
  banKod: string
  banIsmi: string
  banSube?: string
  banSwiftKodu?: string
  banIBANKodu?: string
  banHesapno?: string
  banFirmaNo: number
  banHesapTip: 0 | 1 // 0:Mevduat 1:Kredi
  banMevduatTip?: number
  banKrediTip?: number
  banMuhKod?: string
  banDovizCinsi: number
  banVadeFarkYuzde?: number
  banKrediTavan?: number
  banRiskTavan?: number
  banIBANKodu?: string
  banTemsilci?: string
  banTemsilciEmail?: string
  banIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/bankalar/route.ts
import { query } from "@/lib/db"

export async function GET() {
  const result = await query(`
    SELECT 
      ban_Guid as banGuid,
      ban_kod as banKod,
      ban_ismi as banIsmi,
      ban_sube as banSube,
      ban_IBANKodu as banIBANKodu,
      ban_hesapno as banHesapno,
      ban_hesap_tip as banHesapTip,
      ban_kredi_tavan as banKrediTavan
    FROM BANKALAR
    WHERE ban_iptal = 0
    ORDER BY ban_kod
  `)
  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/banka-select.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BankaSelect({ value, onChange, hesapTip }: Props) {
  const [bankalar, setBankalar] = useState<Banka[]>([])

  useEffect(() => {
    fetch(`/api/bankalar?hesap_tip=${hesapTip}`)
      .then((r) => r.json())
      .then(setBankalar)
  }, [hesapTip])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Banka Seçin" />
      </SelectTrigger>
      <SelectContent>
        {bankalar.map((b) => (
          <SelectItem key={b.banGuid} value={b.banKod}>
            {b.banKod} - {b.banIsmi} ({b.banIBANKodu})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

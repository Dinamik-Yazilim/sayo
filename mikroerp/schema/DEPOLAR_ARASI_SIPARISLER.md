# DEPOLAR_ARASI_SIPARISLER (Şube Sipariş Hareket)

## Genel Bakış

Şubeler ve depolar arası stok transfer siparişlerini yönetir. Merkez-şube veya depo-depo transferleri için kullanılır.

## Alan Kategorileri

### Sistem Alanları (0-15)

- `ssip_Guid` - PRIMARY KEY (Uniqueidentifier)
- `ssip_DBCno`, `ssip_SpecRECno`, `ssip_iptal`, `ssip_fileid`
- `ssip_hidden`, `ssip_kilitli`, `ssip_degisti`, `ssip_checksum`
- `ssip_create_user`, `ssip_create_date`, `ssip_lastup_user`, `ssip_lastup_date`
- `ssip_special1`, `ssip_special2`, `ssip_special3`

### Evrak Bilgileri (16-24)

- `ssip_firmano` - Firma no
- `ssip_subeno` - Şube no
- `ssip_tarih` - Sipariş tarihi
- `ssip_teslim_tarih` - Teslim tarihi
- `ssip_evrakno_seri` - Evrak seri (UNIQUE)
- `ssip_evrakno_sira` - Evrak sıra (UNIQUE)
- `ssip_satirno` - Satır no (UNIQUE)
- `ssip_belgeno` - Belge no
- `ssip_belge_tarih` - Belge tarihi

### Stok ve Miktar (25-29)

- `ssip_stok_kod` - Stok kodu
- `ssip_miktar` - Sipariş miktarı
- `ssip_b_fiyat` - Birim fiyat
- `ssip_tutar` - Sipariş tutarı
- `ssip_teslim_miktar` - Teslim edilen miktar

### Diğer Bilgiler (30-43)

- `ssip_aciklama` - Açıklama
- `ssip_girdepo` - Giriş depo no (talep eden)
- `ssip_cikdepo` - Çıkış depo no (gönderen)
- `ssip_kapat_fl` - Sipariş kapandı mı?
- `ssip_birim_pntr` - Birim bağlantısı
- `ssip_fiyat_liste_no` - Fiyat liste no
- `ssip_stal_uid` - Satın alma şartları GUID
- `ssip_paket_kod` - Paket kodu
- `ssip_kapatmanedenkod` - Kapatma nedeni
- `ssip_projekodu` - Proje kodu
- `ssip_sormerkezi` - Sorumluluk merkezi
- `ssip_gecerlilik_tarihi` - Geçerlilik tarihi
- `ssip_rezervasyon_miktari` - Rezervasyon miktarı
- `ssip_rezerveden_teslim_edilen` - Rezerveden teslim edilen

## İlişkiler

- **STOKLAR** ← KOD: `ssip_stok_kod` → `sto_kod`
- **DEPOLAR** (Giriş) ← KOD: `ssip_girdepo` → `dep_no`
- **DEPOLAR** (Çıkış) ← KOD: `ssip_cikdepo` → `dep_no`
- **PROJELER** ← KOD: `ssip_projekodu` → `pro_kodu`
- **SORUMLULUK_MERKEZLERI** ← KOD: `ssip_sormerkezi` → `som_kod`
- **SATINALMA_SARTLARI** ← GUID: `ssip_stal_uid` → `sas_Guid`

## Indexler

```sql
PRIMARY KEY: ssip_Guid
UNIQUE: (ssip_evrakno_seri, ssip_evrakno_sira, ssip_satirno)
INDEX: ssip_teslim_tarih
INDEX: ssip_tarih
INDEX: (ssip_stok_kod, ssip_teslim_tarih)
```

## SQL Örnekleri

### 1. Açık Transfer Siparişleri

```sql
SELECT
  s.ssip_evrakno_seri + '-' + CAST(s.ssip_evrakno_sira AS VARCHAR) AS siparis_no,
  st.sto_isim,
  d1.dep_adi AS cikis_depo,
  d2.dep_adi AS giris_depo,
  s.ssip_miktar,
  s.ssip_teslim_miktar,
  s.ssip_miktar - s.ssip_teslim_miktar AS kalan,
  s.ssip_teslim_tarih
FROM DEPOLAR_ARASI_SIPARISLER s
INNER JOIN STOKLAR st ON s.ssip_stok_kod = st.sto_kod
INNER JOIN DEPOLAR d1 ON s.ssip_cikdepo = d1.dep_no
INNER JOIN DEPOLAR d2 ON s.ssip_girdepo = d2.dep_no
WHERE s.ssip_kapat_fl = 0
  AND s.ssip_iptal = 0
  AND s.ssip_miktar > s.ssip_teslim_miktar
ORDER BY s.ssip_teslim_tarih
```

### 2. Depo Bazında Transfer Raporu

```sql
SELECT
  d.dep_adi AS depo,
  COUNT(*) AS siparis_adedi,
  SUM(s.ssip_miktar) AS toplam_miktar,
  SUM(s.ssip_teslim_miktar) AS teslim_edilen,
  SUM(s.ssip_miktar - s.ssip_teslim_miktar) AS kalan_miktar
FROM DEPOLAR_ARASI_SIPARISLER s
INNER JOIN DEPOLAR d ON s.ssip_girdepo = d.dep_no
WHERE s.ssip_kapat_fl = 0
  AND s.ssip_iptal = 0
GROUP BY d.dep_adi
ORDER BY kalan_miktar DESC
```

### 3. Vadesi Geçen Transferler

```sql
SELECT
  s.ssip_evrakno_seri + '-' + CAST(s.ssip_evrakno_sira AS VARCHAR) AS siparis_no,
  st.sto_isim,
  d1.dep_adi AS kaynak,
  d2.dep_adi AS hedef,
  s.ssip_teslim_tarih,
  DATEDIFF(day, s.ssip_teslim_tarih, GETDATE()) AS gecikme_gun,
  s.ssip_miktar - s.ssip_teslim_miktar AS kalan_miktar
FROM DEPOLAR_ARASI_SIPARISLER s
INNER JOIN STOKLAR st ON s.ssip_stok_kod = st.sto_kod
INNER JOIN DEPOLAR d1 ON s.ssip_cikdepo = d1.dep_no
INNER JOIN DEPOLAR d2 ON s.ssip_girdepo = d2.dep_no
WHERE s.ssip_teslim_tarih < GETDATE()
  AND s.ssip_kapat_fl = 0
  AND s.ssip_iptal = 0
ORDER BY gecikme_gun DESC
```

## TypeScript Interface

```typescript
interface DepolarArasiSiparis {
  ssipGuid: string
  ssipFirmano: number
  ssipSubeno: number
  ssipTarih: Date
  ssipTeslimTarih: Date
  ssipEvraknoSeri: string
  ssipEvraknoSira: number
  ssipSatirno: number
  ssipBelgeno?: string
  ssipBelgeTarih?: Date
  ssipStokKod: string
  ssipMiktar: number
  ssipBFiyat: number
  ssipTutar: number
  ssipTeslimMiktar: number
  ssipAciklama?: string
  ssipGirdepo: number // Talep eden depo
  ssipCikdepo: number // Gönderen depo
  ssipKapatFl: boolean
  ssipBirimPntr: number
  ssipFiyatListeNo?: number
  ssipStalUid?: string
  ssipPaketKod?: string
  ssipKapatmanedenkod?: string
  ssipProjekodu?: string
  ssipSormerkezi?: string
  ssipGecerlilikTarihi?: Date
  ssipRezervasyonMiktari?: number
  ssipRezervedenTeslimEdilen?: number
  ssipIptal: boolean
}
```

## API Endpoint Örneği

```typescript
// app/api/depolar-arasi-siparisler/route.ts
import { query } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const depoNo = searchParams.get("depo_no")
  const stokKod = searchParams.get("stok_kod")
  const acikSiparisler = searchParams.get("acik") === "true"

  const result = await query(
    `
    SELECT 
      s.ssip_Guid as ssipGuid,
      s.ssip_evrakno_seri as ssipEvraknoSeri,
      s.ssip_evrakno_sira as ssipEvraknoSira,
      s.ssip_tarih as ssipTarih,
      s.ssip_teslim_tarih as ssipTeslimTarih,
      s.ssip_stok_kod as ssipStokKod,
      st.sto_isim as stokIsim,
      s.ssip_miktar as ssipMiktar,
      s.ssip_teslim_miktar as ssipTeslimMiktar,
      s.ssip_girdepo as ssipGirdepo,
      d1.dep_adi as girisDepoAdi,
      s.ssip_cikdepo as ssipCikdepo,
      d2.dep_adi as cikisDepoAdi,
      s.ssip_kapat_fl as ssipKapatFl
    FROM DEPOLAR_ARASI_SIPARISLER s
    INNER JOIN STOKLAR st ON s.ssip_stok_kod = st.sto_kod
    INNER JOIN DEPOLAR d1 ON s.ssip_girdepo = d1.dep_no
    INNER JOIN DEPOLAR d2 ON s.ssip_cikdepo = d2.dep_no
    WHERE s.ssip_iptal = 0
      ${
        depoNo
          ? "AND (s.ssip_girdepo = @depoNo OR s.ssip_cikdepo = @depoNo)"
          : ""
      }
      ${stokKod ? "AND s.ssip_stok_kod = @stokKod" : ""}
      ${acikSiparisler ? "AND s.ssip_kapat_fl = 0" : ""}
    ORDER BY s.ssip_teslim_tarih, s.ssip_evrakno_sira
  `,
    {
      depoNo: depoNo ? parseInt(depoNo) : undefined,
      stokKod,
    }
  )

  return Response.json(result.recordset)
}
```

## React Component Örneği

```typescript
// components/depo-transfer-list.tsx
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function DepoTransferList({
  siparisler,
}: {
  siparisler: DepolarArasiSiparis[]
}) {
  const kalanMiktar = (s: DepolarArasiSiparis) =>
    s.ssipMiktar - s.ssipTeslimMiktar

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sipariş No</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead>Transfer Yönü</TableHead>
          <TableHead className="text-right">Miktar</TableHead>
          <TableHead className="text-right">Teslim</TableHead>
          <TableHead className="text-right">Kalan</TableHead>
          <TableHead>Teslim Tarihi</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {siparisler.map((s) => (
          <TableRow key={s.ssipGuid}>
            <TableCell className="font-mono">
              {s.ssipEvraknoSeri}-{s.ssipEvraknoSira}
            </TableCell>
            <TableCell>{s.stokIsim}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="text-sm">{s.cikisDepoAdi}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{s.girisDepoAdi}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{s.ssipMiktar}</TableCell>
            <TableCell className="text-right">{s.ssipTeslimMiktar}</TableCell>
            <TableCell className="text-right font-medium">
              {kalanMiktar(s).toFixed(2)}
            </TableCell>
            <TableCell>
              {new Date(s.ssipTeslimTarih).toLocaleDateString("tr-TR")}
            </TableCell>
            <TableCell>
              {s.ssipKapatFl ? (
                <Badge variant="outline">Kapalı</Badge>
              ) : kalanMiktar(s) > 0 ? (
                <Badge variant="destructive">Açık</Badge>
              ) : (
                <Badge variant="success">Tamamlandı</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Notlar

- **44 alanlı** depolar arası transfer sipariş tablosu
- **Giriş/Çıkış Depo**: İki depo arasında transfer yönü
- **Rezervasyon**: Stok rezervasyonu ve kısmi teslim takibi
- Composite unique: `(evrak_seri, evrak_sira, satir_no)`
- SIPARISLER tablosuna benzer yapı ama depo-odaklı
- Şube/merkez transfer yönetimi için kritik

/**
 * MikroERP - Dashboard Sorguları
 * 
 * Dashboard istatistikleri ve raporları için SQL sorguları
 */

/**
 * En Çok Satan Ürünler
 * @param days - Kaç günlük veri (varsayılan: 30)
 * @param limit - Kaç ürün (varsayılan: 10)
 * @returns En çok satan ürünler listesi (Net satış - İadeler)
 */
export const getTopSellingProducts = (days: number = 30, limit: number = 10) => `
  SELECT TOP ${limit}
    s.sto_kod,
    s.sto_isim,
    SUM(
      CASE 
        WHEN sth.sth_normal_iade = 0 THEN 
          (sth.sth_tutar + sth.sth_vergi)
        ELSE 
          -1 * (sth.sth_tutar + sth.sth_vergi)
      END
    ) as net_tutar,
    SUM(
      CASE 
        WHEN sth.sth_normal_iade = 0 THEN sth.sth_miktar
        ELSE -1 * sth.sth_miktar
      END
    ) as toplam_miktar
  FROM STOK_HAREKETLERI sth
  INNER JOIN STOKLAR s ON s.sto_kod = sth.sth_stok_kod
  WHERE 
    sth.sth_iptal = 0
    AND sth.sth_evraktip = 4  -- Çıkış Faturası
    AND sth.sth_tip = 1  -- Çıkış
    AND sth.sth_tarih >= DATEADD(DAY, -${days}, GETDATE())
    AND s.sto_iptal = 0
  GROUP BY s.sto_kod, s.sto_isim
  ORDER BY net_tutar DESC
`

/**
 * Toplam Stok Sayısı
 */
export const getTotalStockCount = () => `
  SELECT COUNT(*) as total
  FROM STOKLAR
  WHERE sto_iptal = 0
`

/**
 * Günlük Satış Toplamı
 */
export const getDailySales = () => `
  SELECT 
    SUM(sth.sth_tutar - (sth_iskonto1+sth_iskonto2+sth_iskonto3+sth_iskonto4+sth_iskonto5+sth_iskonto6) + 
    (sth_masraf1+sth_masraf2+sth_masraf3+sth_masraf4) + sth.sth_vergi) as daily_total
  FROM STOK_HAREKETLERI sth
  WHERE 
    sth.sth_iptal = 0
    AND sth.sth_evraktip = 4  -- Çıkış Faturası
    AND sth.sth_tip = 1  -- Çıkış
    AND sth.sth_normal_iade = 0  -- Normal satış (iade değil)
    AND CAST(sth.sth_tarih AS DATE) = CAST(GETDATE() AS DATE)
`

/**
 * Aylık Ciro
 */
export const getMonthlySales = () => `
  SELECT 
    SUM(sth.sth_tutar - (sth_iskonto1+sth_iskonto2+sth_iskonto3+sth_iskonto4+sth_iskonto5+sth_iskonto6) + 
    (sth_masraf1+sth_masraf2+sth_masraf3+sth_masraf4) + sth.sth_vergi)  as monthly_total
  FROM STOK_HAREKETLERI sth
  WHERE 
    sth.sth_iptal = 0
    AND sth.sth_evraktip = 4  -- Çıkış Faturası
    AND sth.sth_tip = 1  -- Çıkış
    AND sth.sth_normal_iade = 0  -- Normal satış (iade değil)
    AND MONTH(sth.sth_tarih) = MONTH(GETDATE())
    AND YEAR(sth.sth_tarih) = YEAR(GETDATE())
`

/**
 * Aktif Müşteri Sayısı
 */
export const getActiveCustomerCount = () => `
  SELECT COUNT(*) as total
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
    AND (cari_baglanti_tipi = 0 OR cari_baglanti_tipi = 2)  -- Müşteri veya Müşteri/Tedarikçi
`

/**
 * Bekleyen Sipariş Sayısı
 */
export const getPendingOrderCount = () => `
  SELECT COUNT(DISTINCT sip_evrakno_seri + CAST(sip_evrakno_sira AS NVARCHAR)) as total
  FROM SIPARISLER
  WHERE sip_iptal = 0
    AND sip_cins = 1  -- Satış siparişi
    AND sip_teslim_miktar < sip_miktar  -- Tam teslim edilmemiş
`

/**
 * Aylık Fatura Sayısı
 */
export const getMonthlyInvoiceCount = () => `
  SELECT COUNT(DISTINCT sth_evrakno_seri + CAST(sth_evrakno_sira AS NVARCHAR)) as total
  FROM STOK_HAREKETLERI
  WHERE sth_iptal = 0
    AND sth_evraktip = 4  -- Çıkış Faturası
    AND MONTH(sth_tarih) = MONTH(GETDATE())
    AND YEAR(sth_tarih) = YEAR(GETDATE())
`

/**
 * Kritik Stok Sayısı (Minimum seviyenin altında)
 */
export const getCriticalStockCount = () => `
  SELECT COUNT(*) as total
  FROM STOKLAR s
  LEFT JOIN (
    SELECT 
      sth_stok_kod,
      SUM(CASE WHEN sth_tip = 0 THEN sth_miktar ELSE -sth_miktar END) as bakiye
    FROM STOK_HAREKETLERI
    WHERE sth_iptal = 0
    GROUP BY sth_stok_kod
  ) h ON h.sth_stok_kod = s.sto_kod
  WHERE s.sto_iptal = 0
   
`

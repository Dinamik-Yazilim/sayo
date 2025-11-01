/**
 * MikroERP - Stok Sorguları
 * 
 * STOKLAR, STOK_ANA_GRUPLARI, STOK_ALT_GRUPLARI, STOK_KATEGORILERI,
 * STOK_MARKALARI, BARKOD_TANIMLARI tabloları için SQL sorguları
 */

/**
 * Stok Ana Grupları - Tüm ana grupları listeler (alt grup ve stok sayılarıyla)
 */
export const getStokAnaGruplari = () => `
  SELECT 
    san_kod,
    san_isim,
    (SELECT COUNT(*) FROM STOK_ALT_GRUPLARI WHERE sta_ana_grup_kod = san_kod AND sta_iptal = 0) as alt_grup_sayisi,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_anagrup_kod = san_kod AND sto_iptal = 0) as stok_sayisi
  FROM STOK_ANA_GRUPLARI
  WHERE san_iptal = 0
  ORDER BY san_kod
`

/**
 * Stok Ana Grupları - Arama ile
 * @param searchTerm - Arama terimi (kod veya isim)
 */
export const searchStokAnaGruplari = (searchTerm: string) => `
  SELECT 
    san_kod,
    san_isim,
    (SELECT COUNT(*) FROM STOK_ALT_GRUPLARI WHERE sta_ana_grup_kod = san_kod AND sta_iptal = 0) as alt_grup_sayisi,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_anagrup_kod = san_kod AND sto_iptal = 0) as stok_sayisi
  FROM STOK_ANA_GRUPLARI
  WHERE san_iptal = 0
    AND (san_kod LIKE '%${searchTerm}%' OR san_isim LIKE '%${searchTerm}%')
  ORDER BY san_kod
`

/**
 * Stok Alt Grupları - Tüm alt grupları listeler
 * @param anaGrupKod - Ana grup kodu (opsiyonel, filtrele için)
 */
export const getStokAltGruplari = (anaGrupKod?: string) => `
  SELECT 
    sta.sta_kod,
    sta.sta_isim,
    sta.sta_ana_grup_kod,
    san.san_isim as ana_grup_isim,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_altgrup_kod = sta.sta_kod AND sto_iptal = 0) as stok_sayisi
  FROM STOK_ALT_GRUPLARI sta
  LEFT JOIN STOK_ANA_GRUPLARI san ON san.san_kod = sta.sta_ana_grup_kod
  WHERE sta.sta_iptal = 0
    ${anaGrupKod && anaGrupKod !== 'all' ? `AND sta.sta_ana_grup_kod = '${anaGrupKod}'` : ''}
  ORDER BY sta.sta_kod
`

/**
 * Stok Alt Grupları - Arama ile
 * @param searchTerm - Arama terimi
 * @param anaGrupKod - Ana grup kodu (opsiyonel)
 */
export const searchStokAltGruplari = (searchTerm: string, anaGrupKod?: string) => `
  SELECT 
    sta.sta_kod,
    sta.sta_isim,
    sta.sta_ana_grup_kod,
    san.san_isim as ana_grup_isim,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_altgrup_kod = sta.sta_kod AND sto_iptal = 0) as stok_sayisi
  FROM STOK_ALT_GRUPLARI sta
  LEFT JOIN STOK_ANA_GRUPLARI san ON san.san_kod = sta.sta_ana_grup_kod
  WHERE sta.sta_iptal = 0
    AND (sta.sta_kod LIKE '%${searchTerm}%' OR sta.sta_isim LIKE '%${searchTerm}%')
    ${anaGrupKod && anaGrupKod !== 'all' ? `AND sta.sta_ana_grup_kod = '${anaGrupKod}'` : ''}
  ORDER BY sta.sta_kod
`

/**
 * Stok Kategorileri - Tüm kategorileri listeler
 */
export const getStokKategorileri = () => `
  SELECT ktg_kod, ktg_isim
  FROM STOK_KATEGORILERI
  WHERE ktg_iptal = 0
  ORDER BY ktg_kod
`

/**
 * Stok Markaları - Tüm markaları listeler
 */
export const getStokMarkalari = () => `
  SELECT mrk_kod, mrk_ismi
  FROM STOK_MARKALARI
  WHERE mrk_iptal = 0
  ORDER BY mrk_ismi
`

/**
 * Stoklar - Gelişmiş filtreleme ile (TOP 200)
 * @param searchTerm - Arama terimi (kod, isim veya barkod)
 * @param anaGrupKod - Ana grup filtresi
 * @param altGrupKod - Alt grup filtresi
 * @param kategoriKod - Kategori filtresi
 * @param markaKod - Marka filtresi
 */
export const getStoklar = (
  searchTerm?: string,
  anaGrupKod?: string,
  altGrupKod?: string,
  kategoriKod?: string,
  markaKod?: string
) => {
  const searchCondition = searchTerm
    ? `AND (s.sto_kod LIKE '%${searchTerm}%' OR s.sto_isim LIKE '%${searchTerm}%' OR EXISTS (SELECT 1 FROM BARKOD_TANIMLARI WHERE bar_stokkodu = s.sto_kod AND bar_kodu LIKE '%${searchTerm}%' AND bar_iptal = 0))`
    : ''

  const anaGrupCondition = anaGrupKod && anaGrupKod !== 'all'
    ? `AND s.sto_anagrup_kod = '${anaGrupKod}'`
    : ''

  const altGrupCondition = altGrupKod && altGrupKod !== 'all'
    ? `AND s.sto_altgrup_kod = '${altGrupKod}'`
    : ''

  const kategoriCondition = kategoriKod && kategoriKod !== 'all'
    ? `AND s.sto_kategori_kodu = '${kategoriKod}'`
    : ''

  const markaCondition = markaKod && markaKod !== 'all'
    ? `AND s.sto_marka_kodu = '${markaKod}'`
    : ''

  return `
    SELECT TOP 200
      s.sto_kod,
      s.sto_isim,
      s.sto_anagrup_kod,
      san.san_isim as ana_grup_isim,
      s.sto_altgrup_kod,
      sta.sta_isim as alt_grup_isim,
      s.sto_kategori_kodu,
      ktg.ktg_isim as kategori_isim,
      s.sto_marka_kodu,
      mrk.mrk_ismi as marka_isim,
      s.sto_sat_cari_kod,
      car.cari_unvan1 as satici_unvan,
      s.sto_birim1_ad,
      s.sto_birim2_ad,
      s.sto_birim2_katsayi,
      s.sto_birim3_ad,
      s.sto_birim3_katsayi,
      (SELECT TOP 1 bar_kodu FROM BARKOD_TANIMLARI WHERE bar_stokkodu = s.sto_kod AND bar_iptal = 0 ORDER BY bar_master DESC, bar_kodu) as barkod1,
      (SELECT bar_kodu FROM (SELECT bar_kodu, ROW_NUMBER() OVER (ORDER BY bar_master DESC, bar_kodu) as rn FROM BARKOD_TANIMLARI WHERE bar_stokkodu = s.sto_kod AND bar_iptal = 0) t WHERE t.rn = 2) as barkod2,
      (SELECT bar_kodu FROM (SELECT bar_kodu, ROW_NUMBER() OVER (ORDER BY bar_master DESC, bar_kodu) as rn FROM BARKOD_TANIMLARI WHERE bar_stokkodu = s.sto_kod AND bar_iptal = 0) t WHERE t.rn = 3) as barkod3,
      (SELECT TOP 1 sfiyat_fiyati FROM STOK_SATIS_FIYAT_LISTELERI WHERE sfiyat_stokkod = s.sto_kod AND sfiyat_listesirano = 1 AND sfiyat_deposirano = 0) as fiyat1,
      (SELECT TOP 1 sfiyat_fiyati FROM STOK_SATIS_FIYAT_LISTELERI WHERE sfiyat_stokkod = s.sto_kod AND sfiyat_listesirano = 2 AND sfiyat_deposirano = 0) as fiyat2
    FROM STOKLAR s
    LEFT JOIN STOK_ANA_GRUPLARI san ON san.san_kod = s.sto_anagrup_kod
    LEFT JOIN STOK_ALT_GRUPLARI sta ON sta.sta_kod = s.sto_altgrup_kod
    LEFT JOIN STOK_KATEGORILERI ktg ON ktg.ktg_kod = s.sto_kategori_kodu
    LEFT JOIN STOK_MARKALARI mrk ON mrk.mrk_kod = s.sto_marka_kodu
    LEFT JOIN CARI_HESAPLAR car ON car.cari_kod = s.sto_sat_cari_kod
    WHERE s.sto_iptal = 0
    ${searchCondition}
    ${anaGrupCondition}
    ${altGrupCondition}
    ${kategoriCondition}
    ${markaCondition}
    ORDER BY s.sto_kod
  `
}

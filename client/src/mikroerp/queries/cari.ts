/**
 * MikroERP - Cari Hesaplar Sorguları
 * 
 * CARI_HESAPLAR tablosu için SQL sorguları
 */

/**
 * Tüm Cari Hesapları Listele
 */
export const getCariHesaplar = () => `
  SELECT 
    dbo.fn_CariBaglantiTip(cari_baglanti_tipi) as baglanti_tipi,
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    cari_vdaire_adi,
    cari_vdaire_no
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
  ORDER BY cari_kod
`

/**
 * Cari Hesap Ara
 * @param searchTerm - Arama terimi (kod, ünvan)
 */
export const searchCariHesaplar = (searchTerm: string) => `
  SELECT 
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    cari_vdaire_adi,
    cari_vdaire_no
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
    AND (
      cari_kod LIKE '%${searchTerm}%' 
      OR cari_unvan1 LIKE '%${searchTerm}%'
      OR cari_unvan2 LIKE '%${searchTerm}%'
    )
  ORDER BY cari_kod
`

/**
 * Müşterileri Listele
 */
export const getMusteriler = () => `
  SELECT 
    dbo.fn_CariBaglantiTip(cari_baglanti_tipi) as baglanti_tipi,
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    cari_vdaire_adi,
    cari_vdaire_no
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
 
  ORDER BY cari_kod
`

/**
 * Tedarikçileri Listele
 */
export const getTedarikciler = () => `
  SELECT 
    dbo.fn_CariBaglantiTip(cari_baglanti_tipi) as baglanti_tipi,
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    cari_vdaire_adi,
    cari_vdaire_no
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
   
  ORDER BY cari_kod
`

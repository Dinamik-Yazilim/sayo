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
    c.cari_kod,
    c.cari_unvan1,
    c.cari_unvan2,
    c.cari_vdaire_no,
    c.cari_CepTel,
    (SELECT TOP 1 adr_ilce FROM CARI_HESAP_ADRESLERI WHERE adr_cari_kod = c.cari_kod AND adr_iptal = 0 ORDER BY adr_adres_no) as ilce,
    (SELECT TOP 1 adr_il FROM CARI_HESAP_ADRESLERI WHERE adr_cari_kod = c.cari_kod AND adr_iptal = 0 ORDER BY adr_adres_no) as il,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_sat_cari_kod = c.cari_kod AND sto_iptal = 0) as urun_sayisi
  FROM CARI_HESAPLAR c
  WHERE c.cari_iptal = 0
    AND c.cari_baglanti_tipi IN (1, 2)
  ORDER BY c.cari_kod
`

/**
 * Tedarikçileri Ara
 * @param searchTerm - Arama terimi (kod, ünvan)
 */
export const searchTedarikciler = (searchTerm: string) => `
  SELECT 
    c.cari_kod,
    c.cari_unvan1,
    c.cari_unvan2,
    c.cari_vdaire_no,
    c.cari_CepTel,
    (SELECT TOP 1 adr_ilce FROM CARI_HESAP_ADRESLERI WHERE adr_cari_kod = c.cari_kod AND adr_iptal = 0 ORDER BY adr_adres_no) as ilce,
    (SELECT TOP 1 adr_il FROM CARI_HESAP_ADRESLERI WHERE adr_cari_kod = c.cari_kod AND adr_iptal = 0 ORDER BY adr_adres_no) as il,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_sat_cari_kod = c.cari_kod AND sto_iptal = 0) as urun_sayisi
  FROM CARI_HESAPLAR c
  WHERE c.cari_iptal = 0
    AND c.cari_baglanti_tipi IN (1, 2)
    AND (
      c.cari_kod LIKE '%${searchTerm}%' 
      OR c.cari_unvan1 LIKE '%${searchTerm}%'
      OR c.cari_unvan2 LIKE '%${searchTerm}%'
      OR c.cari_vdaire_no LIKE '%${searchTerm}%'
    )
  ORDER BY c.cari_kod
`

/**
 * Tedarikçileri Listele - Modal için basit liste
 * Mağaza siparişi için kullanılır
 */
export const getTedarikcilerModal = () => `
  SELECT 
    cari_kod,
    cari_unvan1,
    cari_unvan2,
    (SELECT COUNT(*) FROM STOKLAR WHERE sto_sat_cari_kod = cari_kod AND sto_iptal = 0) as urun_sayisi
  FROM CARI_HESAPLAR
  WHERE cari_iptal = 0
    AND cari_baglanti_tipi IN (1, 2)
  ORDER BY cari_unvan1
`

/**
 * MikroERP - Depo Sorguları
 * 
 * DEPOLAR tablosu için SQL sorguları
 */

/**
 * Depolar - Tüm depoları listeler
 * @param depTipi - Depo tipi filtresi (0-16)
 */
export const getDepolar = (depTipi?: string) => {
  const tipCondition = depTipi && depTipi !== 'all'
    ? `AND dep_tipi = ${depTipi}`
    : ''

  return `
    SELECT 
      dep_no,
      dep_adi,
      dep_tipi,
      dep_sor_mer_kodu,
      dep_proje_kodu
    FROM DEPOLAR
    WHERE dep_iptal = 0
    ${tipCondition}
    ORDER BY dep_no
  `
}

/**
 * Depolar - Arama ile
 * @param searchTerm - Arama terimi
 * @param depTipi - Depo tipi filtresi
 */
export const searchDepolar = (searchTerm: string, depTipi?: string) => {
  const tipCondition = depTipi && depTipi !== 'all'
    ? `AND dep_tipi = ${depTipi}`
    : ''

  return `
    SELECT 
      dep_no,
      dep_adi,
      dep_tipi,
      dep_sor_mer_kodu,
      dep_proje_kodu
    FROM DEPOLAR
    WHERE dep_iptal = 0
      AND (
        CAST(dep_no AS NVARCHAR) LIKE '%${searchTerm}%' 
        OR dep_adi LIKE '%${searchTerm}%'
        OR dep_sor_mer_kodu LIKE '%${searchTerm}%'
        OR dep_proje_kodu LIKE '%${searchTerm}%'
      )
      ${tipCondition}
    ORDER BY dep_no
  `
}

/**
 * Depolar - Mağazalar (Sadece mağaza tipindeki depolar)
 * Mağaza siparişi için kullanılır
 */
export const getDepolarMagazalar = () => `
  SELECT 
    dep_no,
    dep_adi,
    dep_tipi,
    dep_sor_mer_kodu,
    dep_proje_kodu
  FROM DEPOLAR
  WHERE dep_iptal = 0
    AND dep_tipi IN (1, 2, 3)
  ORDER BY dep_adi
`

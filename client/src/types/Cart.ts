export interface CartLine {
  itemCode: string           // sto_kod
  itemName: string           // sto_isim
  unitCode?: string          // sto_birim1_ad
  price: number              // Birim fiyat
  quantity: number           // Miktar
  kdvYuzde: number           // KDV yüzdesi

  // İskonto bilgileri
  isk1Yuzde: number          // İskonto 1 %
  isk1Tutar: number          // İskonto 1 tutarı
  isk2Yuzde: number          // İskonto 2 %
  isk2Tutar: number          // İskonto 2 tutarı

  // Tedarikçi bilgileri
  tedarikciKod?: string      // sto_sat_cari_kod
  tedarikciUnvan?: string    // satici_unvan

  // Satır toplamları
  satirTutari: number        // price * quantity
  satirKdv: number           // KDV tutarı
  satirToplam: number        // İskontolar ve KDV sonrası toplam

  _id?: string
}

export interface Cart {
  _id: string
  organization: string       // Organization ID
  db: string                 // MikroERP database name
  tarih: Date                // Sipariş tarihi
  depoNo: number             // Mağaza/Depo numarası

  // Sipariş kalemleri
  lines: CartLine[]

  // Genel toplamlar
  total: number              // Ara toplam (iskonto öncesi)
  isk1Top: number            // İskonto 1 toplamı
  isk2Top: number            // İskonto 2 toplamı
  isk3Top: number            // İskonto 3 toplamı
  araToplam: number          // İskontolar sonrası ara toplam
  kdvToplam: number          // Toplam KDV
  genelToplam: number        // Genel toplam (KDV dahil)

  // Durum bilgileri
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled'

  // Kullanıcı bilgileri
  createdBy?: string         // Member ID
  updatedBy?: string         // Member ID

  // Notlar
  notes?: string

  // Sipariş numarası (MikroERP'ye aktarıldığında)
  siparisNo?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Virtual fields
  lineCount?: number
  totalQuantity?: number
}

export interface CartCreateInput {
  organization: string
  db: string
  depoNo: number
  lines?: CartLine[]
  notes?: string
  createdBy?: string
}

export interface CartUpdateInput {
  lines?: CartLine[]
  notes?: string
  status?: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled'
  updatedBy?: string
}

export interface CartLineInput {
  itemCode: string
  itemName: string
  unitCode?: string
  price: number
  quantity: number
  kdvYuzde?: number
  isk1Yuzde?: number
  isk2Yuzde?: number
  tedarikciKod?: string
  tedarikciUnvan?: string
}

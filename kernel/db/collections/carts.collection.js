const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organizations', required: true, index: true },
      db: { type: String, required: true, index: true }, // MikroERP database name
      tarih: { type: Date, default: Date.now, index: true },
      depoNo: { type: Number, required: true, index: true }, // Mağaza/Depo numarası

      // Sipariş kalemleri
      lines: [{
        itemCode: { type: String, required: true }, // sto_kod
        itemName: { type: String, required: true }, // sto_isim
        unitCode: { type: String, default: '' }, // sto_birim1_ad
        price: { type: Number, default: 0 }, // Birim fiyat
        quantity: { type: Number, default: 0, required: true }, // Miktar
        kdvYuzde: { type: Number, default: 0 }, // KDV yüzdesi

        // İskonto bilgileri
        isk1Yuzde: { type: Number, default: 0 }, // İskonto 1 yüzdesi
        isk1Tutar: { type: Number, default: 0 }, // İskonto 1 tutarı
        isk2Yuzde: { type: Number, default: 0 }, // İskonto 2 yüzdesi
        isk2Tutar: { type: Number, default: 0 }, // İskonto 2 tutarı

        // Tedarikçi bilgileri
        tedarikciKod: { type: String, default: '' }, // sto_sat_cari_kod
        tedarikciUnvan: { type: String, default: '' }, // satici_unvan

        // Satır toplamları
        satirTutari: { type: Number, default: 0 }, // price * quantity
        satirKdv: { type: Number, default: 0 }, // KDV tutarı
        satirToplam: { type: Number, default: 0 }, // İskontolar ve KDV sonrası toplam
      }],

      // Genel toplamlar
      total: { type: Number, default: 0 }, // Ara toplam (iskonto öncesi)
      isk1Top: { type: Number, default: 0 }, // İskonto 1 toplamı
      isk2Top: { type: Number, default: 0 }, // İskonto 2 toplamı
      isk3Top: { type: Number, default: 0 }, // İskonto 3 toplamı
      araToplam: { type: Number, default: 0 }, // İskontolar sonrası ara toplam
      kdvToplam: { type: Number, default: 0 }, // Toplam KDV
      genelToplam: { type: Number, default: 0 }, // Genel toplam (KDV dahil)

      // Durum bilgileri
      status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'completed', 'cancelled'],
        default: 'draft',
        index: true
      },

      // Arşiv durumu
      isArchived: { type: Boolean, default: false, index: true },

      // Oluşturan kullanıcı
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'members' },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'members' },

      // Notlar
      notes: { type: String, default: '' },

      sipGuid: { type: String, default: '', index: true },
      sipEvrakSeri: { type: String, default: '', index: true },
      sipEvrakSira: { type: Number, default: 0, index: true },
    },
    {
      timestamps: true, // createdAt, updatedAt otomatik eklenir
      collection: collectionName
    }
  )

  // İndeksler
  schema.index({ organization: 1, tarih: -1 })
  schema.index({ organization: 1, depoNo: 1, status: 1 })
  schema.index({ organization: 1, createdBy: 1 })
  schema.index({ createdAt: -1 })

  // Virtual fields
  schema.virtual('lineCount').get(function () {
    return this.lines ? this.lines.length : 0
  })

  schema.virtual('totalQuantity').get(function () {
    return this.lines ? this.lines.reduce((sum, line) => sum + (line.quantity || 0), 0) : 0
  })

  // Methods
  schema.methods.calculateTotals = function () {
    let total = 0
    let isk1Top = 0
    let isk2Top = 0
    let kdvToplam = 0

    this.lines.forEach(line => {
      // Satır tutarı (iskonto öncesi)
      line.satirTutari = line.price * line.quantity

      // İskonto tutarları hesapla
      line.isk1Tutar = line.satirTutari * (line.isk1Yuzde / 100)
      let tutar1 = line.satirTutari - line.isk1Tutar

      line.isk2Tutar = tutar1 * (line.isk2Yuzde / 100)
      let tutar2 = tutar1 - line.isk2Tutar

      // Satır KDV
      line.satirKdv = tutar2 * (line.kdvYuzde / 100)

      // Satır toplam
      line.satirToplam = tutar2 + line.satirKdv

      // Genel toplamları artır
      total += line.satirTutari
      isk1Top += line.isk1Tutar
      isk2Top += line.isk2Tutar
      kdvToplam += line.satirKdv
    })

    this.total = total
    this.isk1Top = isk1Top
    this.isk2Top = isk2Top
    this.araToplam = total - isk1Top - isk2Top - this.isk3Top
    this.kdvToplam = kdvToplam
    this.genelToplam = this.araToplam + kdvToplam

    return this
  }

  // Pre-save hook - totalleri otomatik hesapla
  schema.pre('save', function (next) {
    if (this.isModified('lines')) {
      this.calculateTotals()
    }
    next()
  })

  // Statics
  schema.statics.findByOrganization = function (organizationId, options = {}) {
    const query = { organization: organizationId }
    if (options.db) query.db = options.db
    if (options.status) query.status = options.status
    if (options.depoNo) query.depoNo = options.depoNo
    if (options.isArchived !== undefined) query.isArchived = options.isArchived

    return this.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
  }

  schema.statics.findDrafts = function (organizationId, depoNo, dbName) {
    const query = {
      organization: organizationId,
      depoNo: depoNo,
      status: 'draft'
    }
    if (dbName) query.db = dbName

    return this.find(query)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
  }

  schema.pre('save', (next) => next())
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
  return model
}

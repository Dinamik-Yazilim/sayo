const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      organization: { type: ObjectId, ref: 'organizations', default: null, index: true },
      username: { type: String, required: true, index: true },
      password: { type: String, default: null, index: true, select: false },
      role: { type: String, default: 'user', enum: ['user', 'owner', 'purchase', 'sales', 'admin', 'sysadmin', 'sysuser'] },
      name: { type: String, default: '', index: true },
      passive: { type: Boolean, default: false, index: true },

      // ✨ DEPO YETKİLERİ 
      depoYetkileri: [{
        db: { type: String, required: true }, // MikroERP database adı
        depoNos: [{ type: Number, required: true }], // Yetkili olunan depo numaraları
        _id: false // Alt dokümanlara _id ekleme
      }],

      // Opsiyonel: Tüm depolar için yetki (super user gibi)
      tumDepoYetkisi: { type: Boolean, default: false }
    },
    { versionKey: false, timestamps: true }
  )

  // Index: Depo bazlı sorgular için
  schema.index({ 'depoYetkileri.db': 1, 'depoYetkileri.depoNos': 1 })

  // Helper method: Kullanıcının depoya erişimi var mı?
  schema.methods.hasDepoAccess = function (db, depoNo) {
    if (this.tumDepoYetkisi) return true

    const dbYetki = this.depoYetkileri.find(y => y.db === db)
    if (!dbYetki) return false

    return dbYetki.depoNos.includes(depoNo)
  }

  // Helper method: Kullanıcının tüm yetkili depoları
  schema.methods.getAuthorizedDepos = function (db) {
    if (this.tumDepoYetkisi) return 'ALL'

    const dbYetki = this.depoYetkileri.find(y => y.db === db)
    return dbYetki ? dbYetki.depoNos : []
  }

  // Static: Belirli depoya erişimi olan kullanıcılar
  schema.statics.findByDepoAccess = function (db, depoNo) {
    return this.find({
      $or: [
        { tumDepoYetkisi: true },
        {
          depoYetkileri: {
            $elemMatch: {
              db: db,
              depoNos: depoNo
            }
          }
        }
      ],
      passive: false
    })
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
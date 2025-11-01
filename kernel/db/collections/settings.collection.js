const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      organization: { type: ObjectId, ref: 'organizations', index: true },
      db: { type: String, required: true, index: true },

      // Email Gönderim Ayarları
      emailSettings: {
        // Genel ayarlar
        enabled: { type: Boolean, default: false }, // Email gönderimi aktif mi?
        provider: { type: String, enum: ['smtp', 'gmail'], default: 'smtp' }, // SMTP veya Gmail
        fromEmail: { type: String, default: '' }, // Gönderen email adresi
        fromName: { type: String, default: '' }, // Gönderen adı

        // SMTP Ayarları
        smtp: {
          host: { type: String, default: '' }, // SMTP sunucu adresi (örn: smtp.gmail.com)
          port: { type: Number, default: 587 }, // SMTP port (587 veya 465)
          secure: { type: Boolean, default: false }, // SSL/TLS kullanımı (465 için true)
          username: { type: String, default: '' }, // SMTP kullanıcı adı
          password: { type: String, default: '' }, // SMTP şifre
        },

        // Gmail OAuth Ayarları (gelecekte kullanılabilir)
        gmail: {
          clientId: { type: String, default: '' },
          clientSecret: { type: String, default: '' },
          refreshToken: { type: String, default: '' },
        },

        // Email Şablonları
        templates: {
          orderCreated: {
            enabled: { type: Boolean, default: true },
            subject: { type: String, default: 'Yeni Sipariş Oluşturuldu' },
            recipients: [{ type: String }] // CC alıcılar
          },
          orderApproved: {
            enabled: { type: Boolean, default: true },
            subject: { type: String, default: 'Sipariş Onaylandı' },
            recipients: [{ type: String }]
          },
          orderCompleted: {
            enabled: { type: Boolean, default: true },
            subject: { type: String, default: 'Sipariş Tamamlandı' },
            recipients: [{ type: String }]
          }
        }
      }

    },
    { versionKey: false, timestamps: true }
  )

  schema.pre('save', (next) => next())
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
  return model
}

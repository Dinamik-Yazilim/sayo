const { getList, executeSql } = require('../../lib/mikro/mikroHelper')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.params.param1) {
      case 'get':
        getList(sessionDoc, orgDoc, req.getValue('query'), '').then(resolve).catch(reject)
        break
      // case 'getWorkData':
      //   getList(sessionDoc, orgDoc, req.getValue('query'), '_WORKDATA').then(resolve).catch(reject)
      //   break
      case 'depolar':
        try {
          // Kullanıcı bilgisini çek
          const member = await dbModel.members.findById(sessionDoc.member)
          if (!member) {
            return reject(new Error('Member not found'))
          }

          // Admin, sysadmin, sysuser rollerinden biri ise tüm depoları getir
          const isAdmin = ['admin', 'sysadmin', 'sysuser'].includes(member.role)

          let query = req.getValue('query')

          // Eğer admin değilse ve yetkili depoları varsa, filtrele
          if (!isAdmin && !member.tumDepoYetkisi) {
            const yetkiliDepoNos = member.getAuthorizedDepos(sessionDoc.db)

            if (yetkiliDepoNos === 'ALL') {
              // Tüm depolar için yetki varsa filtreleme yapma
              getList(sessionDoc, orgDoc, query, '').then(resolve).catch(reject)
            } else if (yetkiliDepoNos.length === 0) {
              // Hiç yetkisi yoksa boş sonuç dön
              resolve([])
            } else {
              // Sorguya WHERE dep_no IN (...) ekle
              const depoFilter = `dep_no IN (${yetkiliDepoNos.join(',')})`

              // Query'de WHERE varsa AND ile ekle, yoksa WHERE ile ekle
              if (query.toUpperCase().includes('WHERE')) {
                query = query.replace(/WHERE/i, `WHERE ${depoFilter} AND`)
              } else {
                // FROM tablodan sonra WHERE ekle
                query = query.replace(/FROM\s+DEPOLAR/i, `FROM DEPOLAR WHERE ${depoFilter}`)
              }

              getList(sessionDoc, orgDoc, query, '').then(resolve).catch(reject)
            }
          } else {
            // Admin veya tumDepoYetkisi varsa filtreleme yapma
            getList(sessionDoc, orgDoc, query, '').then(resolve).catch(reject)
          }
        } catch (error) {
          reject(error)
        }
        break
      case 'save':
        executeSql(sessionDoc, orgDoc, req.getValue('query'), '').then(resolve).catch(reject)
        break
      // case 'saveWorkData':
      //   executeSql(sessionDoc, orgDoc, req.getValue('query'), '_WORKDATA').then(resolve).catch(reject)
      //   break
      default:
        restError.method(req, reject)
        break
    }
  })


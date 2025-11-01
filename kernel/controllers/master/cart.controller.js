const { ObjectId } = require('mongodb')

// Depo yetki kontrolü
async function checkDepoAccess(db, session, depoNo, dbName) {
  const member = await db.members.findById(session.member)

  if (!member) {
    throw new Error('Member not found')
  }

  // Admin, sysadmin, sysuser rollerinde olanlar tüm depolara erişebilir
  const isAdmin = ['admin', 'sysadmin', 'sysuser'].includes(member.role)
  if (isAdmin) {
    return true
  }

  // Tüm depo yetkisi varsa direkt geçir
  if (member.tumDepoYetkisi) {
    return true
  }

  // Belirli depo yetkisi kontrolü
  if (!member.hasDepoAccess(dbName || session.db, depoNo)) {
    throw new Error('Bu depoya erişim yetkiniz yok')
  }

  return true
}

module.exports = (db, session, req, org) =>
  new Promise(async (resolve, reject) => {
    try {
      const func = req.params.param1
      const param2 = req.params.param2
      const param3 = req.params.param3

      switch (func) {
        // GET /api/v1/cart/list
        case 'list':
          try {
            const { status, depoNo, showArchived } = req.query
            console.log('Cart list - req.query:', req.query)
            console.log('Cart list - showArchived:', showArchived, 'type:', typeof showArchived)
            console.log('Cart list - session.db:', session.db)

            const options = {}
            // Aktif database'e göre filtrele
            options.db = session.db

            if (status) options.status = status
            if (depoNo) {
              await checkDepoAccess(db, session, parseInt(depoNo), session.db)
              options.depoNo = parseInt(depoNo)
            }

            // Default olarak arşivlenmemişleri göster
            if (showArchived === 'true') {
              options.isArchived = true
            } else {
              options.isArchived = false
            }

            console.log('Cart list - options:', options)

            const carts = await db.carts.findByOrganization(session.organization, options)
            console.log('Cart list - carts found:', carts.length)
            resolve(carts)
          } catch (error) {
            console.error('Cart list error:', error)
            reject(error)
          }
          break

        // GET /api/v1/cart/get/:id
        case 'get':
          try {
            const id = param2

            const cart = await db.carts
              .findOne({ _id: new ObjectId(id), organization: session.organization })
              .populate('createdBy', 'name email')
              .populate('updatedBy', 'name email')

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            resolve(cart)
          } catch (error) {
            console.error('Cart get error:', error)
            reject(error)
          }
          break

        // GET /api/v1/cart/drafts
        case 'drafts':
          try {
            const { depoNo } = req.query

            if (!depoNo) {
              throw new Error('Depo number required')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, parseInt(depoNo), session.db)

            const carts = await db.carts.findDrafts(session.organization, parseInt(depoNo), session.db)
            resolve(carts)
          } catch (error) {
            console.error('Cart drafts error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/create
        case 'create':
          try {
            const { db: dbName, depoNo, lines, notes } = req.body

            if (!dbName || !depoNo) {
              throw new Error('Database name and depo number required')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, parseInt(depoNo), dbName)

            const cartData = {
              organization: session.organization,
              db: dbName,
              depoNo: parseInt(depoNo),
              lines: lines || [],
              notes: notes || '',
              createdBy: session.member,
              status: 'draft'
            }

            const cart = new db.carts(cartData)
            cart.calculateTotals()
            await cart.save()

            const populatedCart = await db.carts
              .findById(cart._id)
              .populate('createdBy', 'name email')

            resolve(populatedCart)
          } catch (error) {
            console.error('Cart create error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/update/:id
        case 'update':
          try {
            const id = param2
            const { lines, notes, status } = req.body

            const cart = await db.carts.findOne({
              _id: new ObjectId(id),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            // Güncelleme
            if (lines !== undefined) cart.lines = lines
            if (notes !== undefined) cart.notes = notes
            if (status !== undefined) cart.status = status
            cart.updatedBy = session.member

            cart.calculateTotals()
            await cart.save()

            const populatedCart = await db.carts
              .findById(cart._id)
              .populate('createdBy', 'name email')
              .populate('updatedBy', 'name email')

            resolve(populatedCart)
          } catch (error) {
            console.error('Cart update error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/addLine/:id
        case 'addLine':
          try {
            const id = param2
            const lineData = req.body

            const cart = await db.carts.findOne({
              _id: new ObjectId(id),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            // Aynı ürün varsa miktarı artır
            const existingLineIndex = cart.lines.findIndex(
              line => line.itemCode === lineData.itemCode
            )

            if (existingLineIndex >= 0) {
              cart.lines[existingLineIndex].quantity += lineData.quantity || 1
            } else {
              cart.lines.push({
                itemCode: lineData.itemCode,
                itemName: lineData.itemName,
                unitCode: lineData.unitCode || '',
                price: lineData.price || 0,
                quantity: lineData.quantity || 1,
                kdvYuzde: lineData.kdvYuzde || 0,
                isk1Yuzde: lineData.isk1Yuzde || 0,
                isk1Tutar: 0,
                isk2Yuzde: lineData.isk2Yuzde || 0,
                isk2Tutar: 0,
                tedarikciKod: lineData.tedarikciKod || '',
                tedarikciUnvan: lineData.tedarikciUnvan || '',
                satirTutari: 0,
                satirKdv: 0,
                satirToplam: 0
              })
            }

            cart.updatedBy = session.member
            cart.calculateTotals()
            await cart.save()

            const populatedCart = await db.carts.findById(cart._id)
            resolve(populatedCart)
          } catch (error) {
            console.error('Cart addLine error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/removeLine/:cartId/:lineId
        case 'removeLine':
          try {
            const cartId = param2
            const lineId = param3

            const cart = await db.carts.findOne({
              _id: new ObjectId(cartId),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            cart.lines = cart.lines.filter(line => line._id.toString() !== lineId)
            cart.updatedBy = session.member
            cart.calculateTotals()
            await cart.save()

            const populatedCart = await db.carts.findById(cart._id)
            resolve(populatedCart)
          } catch (error) {
            console.error('Cart removeLine error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/updateQuantity/:cartId/:lineId
        case 'updateQuantity':
          try {
            const cartId = param2
            const lineId = param3
            const { quantity } = req.body

            if (quantity === undefined || quantity < 0) {
              throw new Error('Valid quantity required')
            }

            const cart = await db.carts.findOne({
              _id: new ObjectId(cartId),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            const line = cart.lines.id(lineId)
            if (!line) {
              throw new Error('Line not found')
            }

            if (quantity === 0) {
              cart.lines = cart.lines.filter(l => l._id.toString() !== lineId)
            } else {
              line.quantity = quantity
            }

            cart.updatedBy = session.member
            cart.calculateTotals()
            await cart.save()

            const populatedCart = await db.carts.findById(cart._id)
            resolve(populatedCart)
          } catch (error) {
            console.error('Cart updateQuantity error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/delete/:id
        case 'delete':
          try {
            const id = param2

            const cart = await db.carts.findOne({
              _id: new ObjectId(id),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            // Draft ise sil, değilse arşivle
            if (cart.status === 'draft') {
              await db.carts.deleteOne({ _id: new ObjectId(id) })
              resolve({ message: 'Cart deleted successfully', deleted: true })
            } else {
              cart.isArchived = true
              cart.updatedBy = session.member
              await cart.save()
              resolve({ message: 'Cart archived successfully', deleted: false, archived: true })
            }
          } catch (error) {
            console.error('Cart delete error:', error)
            reject(error)
          }
          break

        // POST /api/v1/cart/changeStatus/:id
        case 'changeStatus':
          try {
            const id = param2
            const { status } = req.body

            const validStatuses = ['draft', 'pending', 'approved', 'completed', 'cancelled']
            if (!validStatuses.includes(status)) {
              throw new Error('Invalid status')
            }

            const cart = await db.carts.findOne({
              _id: new ObjectId(id),
              organization: session.organization
            })

            if (!cart) {
              throw new Error('Cart not found')
            }

            // Depo yetki kontrolü
            await checkDepoAccess(db, session, cart.depoNo, cart.db)

            cart.status = status
            cart.updatedBy = session.member
            await cart.save()

            const populatedCart = await db.carts
              .findById(cart._id)
              .populate('createdBy', 'name email')
              .populate('updatedBy', 'name email')

            resolve(populatedCart)
          } catch (error) {
            console.error('Cart changeStatus error:', error)
            reject(error)
          }
          break

        default:
          reject(new Error(`Unknown function: ${func}`))
      }
    } catch (error) {
      console.error('Cart controller error:', error)
      reject(error)
    }
  })

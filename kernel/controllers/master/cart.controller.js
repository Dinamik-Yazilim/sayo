const { ObjectId } = require('mongodb')

// Depo yetki kontrolü
async function checkDepoAccess(db, session, depoNo, dbName) {
  const member = await db.members.findById(session.member)

  if (!member) {
    throw new Error('Member not found')
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

// GET /api/v1/cart/list
module.exports.list = async (db, session, req, org) => {
  try {
    const { status, depoNo } = req.query

    const options = {}
    if (status) options.status = status
    if (depoNo) {
      // Depo filtreleme yapılıyorsa yetki kontrolü
      await checkDepoAccess(db, session, parseInt(depoNo), session.db)
      options.depoNo = parseInt(depoNo)
    }

    const carts = await db.carts.findByOrganization(session.organization, options)

    return carts
  } catch (error) {
    console.error('Cart list error:', error)
    throw error
  }
}

// GET /api/v1/cart/get/:id
module.exports.get = async (db, session, req, org) => {
  try {
    const { param1: id } = req.params

    const cart = await db.carts
      .findOne({ _id: ObjectId(id), organization: session.organization })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')

    if (!cart) {
      throw new Error('Cart not found')
    }

    // Depo yetki kontrolü
    await checkDepoAccess(db, session, cart.depoNo, cart.db)

    return cart
  } catch (error) {
    console.error('Cart get error:', error)
    throw error
  }
}

// GET /api/v1/cart/drafts
module.exports.drafts = async (db, session, req, org) => {
  try {
    const { depoNo } = req.query

    if (!depoNo) {
      throw new Error('Depo number required')
    }

    // Depo yetki kontrolü
    await checkDepoAccess(db, session, parseInt(depoNo), session.db)

    const carts = await db.carts.findDrafts(session.organization, parseInt(depoNo))

    return carts
  } catch (error) {
    console.error('Cart getDrafts error:', error)
    throw error
  }
}

// POST /api/v1/cart/create
module.exports.create = async (db, session, req, org) => {
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

    // Totalleri hesapla
    cart.calculateTotals()

    await cart.save()

    const populatedCart = await db.carts
      .findById(cart._id)
      .populate('createdBy', 'name email')

    return populatedCart
  } catch (error) {
    console.error('Cart create error:', error)
    throw error
  }
}

// POST /api/v1/cart/update/:id
module.exports.update = async (db, session, req, org) => {
  try {
    const { param1: id } = req.params
    const { lines, notes, status } = req.body

    const cart = await db.carts.findOne({
      _id: ObjectId(id),
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

    // Totalleri hesapla
    cart.calculateTotals()

    await cart.save()

    const populatedCart = await db.carts
      .findById(cart._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')

    return populatedCart
  } catch (error) {
    console.error('Cart update error:', error)
    throw error
  }
}

// POST /api/v1/cart/addLine/:id
module.exports.addLine = async (db, session, req, org) => {
  try {
    const { param1: id } = req.params
    const lineData = req.body

    const cart = await db.carts.findOne({
      _id: ObjectId(id),
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
    return populatedCart
  } catch (error) {
    console.error('Cart addLine error:', error)
    throw error
  }
}

// POST /api/v1/cart/removeLine/:cartId/:lineId
module.exports.removeLine = async (db, session, req, org) => {
  try {
    const { param1: cartId, param2: lineId } = req.params

    const cart = await db.carts.findOne({
      _id: ObjectId(cartId),
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
    return populatedCart
  } catch (error) {
    console.error('Cart removeLine error:', error)
    throw error
  }
}

// POST /api/v1/cart/updateQuantity/:cartId/:lineId
module.exports.updateQuantity = async (db, session, req, org) => {
  try {
    const { param1: cartId, param2: lineId } = req.params
    const { quantity } = req.body

    if (quantity === undefined || quantity < 0) {
      throw new Error('Valid quantity required')
    }

    const cart = await db.carts.findOne({
      _id: ObjectId(cartId),
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
      // Miktar 0 ise satırı kaldır
      cart.lines = cart.lines.filter(l => l._id.toString() !== lineId)
    } else {
      line.quantity = quantity
    }

    cart.updatedBy = session.member
    cart.calculateTotals()

    await cart.save()

    const populatedCart = await db.carts.findById(cart._id)
    return populatedCart
  } catch (error) {
    console.error('Cart updateQuantity error:', error)
    throw error
  }
}

// POST /api/v1/cart/delete/:id
module.exports.delete = async (db, session, req, org) => {
  try {
    const { param1: id } = req.params

    const cart = await db.carts.findOne({
      _id: ObjectId(id),
      organization: session.organization
    })

    if (!cart) {
      throw new Error('Cart not found')
    }

    // Depo yetki kontrolü
    await checkDepoAccess(db, session, cart.depoNo, cart.db)

    await cart.remove()

    return { message: 'Cart deleted successfully' }
  } catch (error) {
    console.error('Cart delete error:', error)
    throw error
  }
}

// POST /api/v1/cart/changeStatus/:id
module.exports.changeStatus = async (db, session, req, org) => {
  try {
    const { param1: id } = req.params
    const { status } = req.body

    const validStatuses = ['draft', 'pending', 'approved', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status')
    }

    const cart = await db.carts.findOne({
      _id: ObjectId(id),
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

    return populatedCart
  } catch (error) {
    console.error('Cart changeStatus error:', error)
    throw error
  }
}

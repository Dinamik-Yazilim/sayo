const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { socketSend } = require('../../lib/socketHelper')
const { getList, executeSql, getListDb, executeSqlDb } = require('../../lib/mikro/mikroHelper')
const workData = require('../../lib/mikro/workdata')
const { mikroV16WorkDataAktar, mikroV17WorkDataAktar } = require('./mikro_workDataAktar')
const { mikroV16SatisAktar, mikroV17SatisAktar } = require('./mikro_satisAktar')

exports.test = function (webServiceUrl, webServiceUsername, webServicePassword) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/auth/loginuser`,
      timeout: 120 * 60 * 1000,
      headers: { 'Content-Type': 'application/json' },
      data: { username: webServiceUsername, password: webServicePassword },

    })
      .then(result => {
        resolve(result.data)
      })
      .catch(reject)
  })

}

exports.login = function (webServiceUrl, webServiceUsername, webServicePassword) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/auth/loginuser`,
      timeout: 120 * 60 * 1000,
      headers: { 'Content-Type': 'application/json' },
      data: { username: webServiceUsername, password: webServicePassword },

    })
      .then(result => {

        if (result.data.authToken) {
          resolve(result.data.authToken)
        } else {
          console.log('result:', result.data)
          reject(result.data)
        }

      })
      .catch(reject)
  })

}


function GetDepartments(webServiceUrl, token, body) {
  return new Promise((resolve, reject) => {
    resolve([{
      "id": 1,
      "name": "KDV %0",
      "type": 1,
      "taxValue": 0.0000,
      "ecrCode": 1
    },
    {
      "id": 2,
      "name": "KDV %1",
      "type": 1,
      "taxValue": 1.0000,
      "ecrCode": 2
    },
    {
      "id": 3,
      "name": "KDV %10",
      "type": 1,
      "taxValue": 10.0000,
      "ecrCode": 3
    },
    {
      "id": 4,
      "name": "KDV %20",
      "type": 1,
      "taxValue": 20.0000,
      "ecrCode": 4
    }])
    // fetch(`${webServiceUrl}/integration/getdepartments`, {
    //   method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify(body || {}),
    // })
    //   .then(resp => {
    //     if (resp.ok) {
    //       resp
    //         .json()
    //         .then(result => {
    //           resolve(result)
    //         })
    //         .catch(reject)
    //     } else reject(resp.statusText)
    //   })
    //   .catch(reject)
  })
}

function SetStock2(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/setstocks`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        // eventLog('resp:', resp.data)
        resolve(resp.data)
      })
      .catch(err => {
        // errorLog('[pos312 SetStock] Error:', err)
        reject(err.response.data.errors || err.response.data.error)
      })

  })
}

exports.syncItems_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    let token312 = ''


    try {
      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)


      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `Mikrodan stok, barkod ve fiyatlar listeleniyor` })
      let Kdvler = []
      try {
        Kdvler = await GetDepartments(storeDoc.posIntegration.pos312.webServiceUrl, token312, {})
      } catch (err) {
        errorLog(`[syncItems_pos312] Error:`, err)
        return reject(`Departmanlar 312Pos tan cekilemedi`)
      }
      devLog('Kdvler:', Kdvler)

      let docs = await getList(sessionDoc, orgDoc, `SELECT TOP 3000 sto_kod as code, sto_isim as [name], 
          CASE WHEN sto_kisa_ismi<>'' THEN sto_kisa_ismi ELSE SUBSTRING(sto_isim,1,20) END as shortName, 
          sto_birim1_ad as unit, sto_birim2_ad as unit2, dbo.fn_VergiYuzde(sto_perakende_vergi) as vatRate ,
          sto_lastup_date as updatedAt , sto_reyon_kodu as rayon, sto_anagrup_kod
           FROM STOKLAR WITH (NOLOCK)
            WHERE sto_kod in (SELECT sfiyat_stokkod FROM STOK_SATIS_FIYAT_LISTELERI WITH (NOLOCK) WHERE sfiyat_listesirano=1)
            AND (sto_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}' 
              OR sto_kod IN (SELECT bar_stokkodu FROM BARKOD_TANIMLARI WITH (NOLOCK) WHERE bar_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}') 
              OR sto_kod IN (SELECT sfiyat_stokkod FROM STOK_SATIS_FIYAT_LISTELERI WITH (NOLOCK) WHERE sfiyat_lastup_date>'${storeDoc.posIntegration.lastUpdate_items || ''}') 
            )
            ORDER BY sto_lastup_date`)

      console.log('docs.length', docs.length)
      if (docs.length == 0) {
        socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        return resolve('stok kartlari zaten guncel')
      }
      let barcodeDocs = await getList(sessionDoc, orgDoc, `SELECT  bar_kodu as barcode, bar_stokkodu as code,
         B.bar_birimpntr, bar_icerigi,
        CASE 
            WHEN B.bar_birimpntr=1 OR B.bar_birimpntr=0 THEN S.sto_birim1_katsayi 
            WHEN B.bar_birimpntr=2 THEN S.sto_birim2_katsayi 
            WHEN B.bar_birimpntr=3 THEN S.sto_birim3_katsayi 
            WHEN B.bar_birimpntr=4 THEN S.sto_birim4_katsayi 
            ELSE 1 END as Multiplier, bar_lastup_date as updatedAt FROM BARKOD_TANIMLARI B  INNER JOIN
         STOKLAR S ON S.sto_kod=B.bar_stokkodu
        WHERE B.bar_stokkodu IN ('${docs.map(e => e.code).join("','")}') `)
      console.log('barcodeDocs.length', barcodeDocs.length)

      let priceDocs = await getList(sessionDoc, orgDoc, `SELECT sfiyat_stokkod as code, 0 as isBarcode, sfiyat_listesirano as ordr, 0 as storeId, GETDATE() as startDate, GETDATE() as endDate, sfiyat_fiyati as price, sfiyat_fiyati as newPrice, 0 as [deleted] FROM STOK_SATIS_FIYAT_LISTELERI F 
        INNER JOIN STOKLAR S ON S.sto_kod=F.sfiyat_stokkod
        WHERE (sfiyat_listesirano=1 OR sfiyat_listesirano>=100)  and sfiyat_deposirano in (0)
        AND S.sto_kod IN ('${docs.map(e => e.code).join("','")}')
       `)

      console.log('priceDocs.length', priceDocs.length)

      socketSend(sessionDoc, { event: 'syncItems_progress', caption: `Mikrodan Kartlar cekildi` })
      resolve(`${docs.length} adet stok karti aktarilacak. baslama:${new Date().toString()}`)
      let i = 0
      function calistir() {
        return new Promise((resolve, reject) => {
          if (i >= docs.length) return resolve(true)
          let t1 = new Date().getTime() / 1000
          let Scale = false
          let unit = 1
          // if (['KİLOGRAM', 'KILOGRAM', 'KG', 'kg', 'Kg', 'kilogram', 'KİLO', 'kilo', 'Kilogram'].includes(docs[i].unit)) {
          //   unit = 2
          //   Scale = true
          // }
          let DepartmentId = 0
          let StockBarcodes = []
          let StockPrices = []
          const Kdv = Kdvler.find(e => e.taxValue == docs[i].vatRate)
          if (Kdv) {
            DepartmentId = Kdv.id
            StockBarcodes = (barcodeDocs || []).filter(e => e.code == docs[i].code).map(e => {
              if (e.Multiplier <= 0) e.Multiplier = 1
              if (e.bar_icerigi > 1) {
                unit = 1
                Scale = true
                return {
                  "barcode": e.barcode,
                  "stockCode": e.code,
                  "multiplier": e.Multiplier
                }
              } else if (e.bar_icerigi == 1) {
                unit = 2
                Scale = true
                return {
                  "barcode": e.barcode,
                  "stockCode": e.code,
                  "multiplier": e.Multiplier
                }
              } else {
                unit = 1
                Scale = false
                return {
                  "barcode": e.barcode,
                  "stockCode": e.code,
                  "multiplier": e.Multiplier
                }
              }
            })
            // let tartiliUrunMu = StockBarcodes.find(e => (e.barcode.startsWith('27') || e.barcode.startsWith('28') || e.barcode.startsWith('29')) && e.barcode.length == 7)

            // let tartiliUrunMu = StockBarcodes.find(e => e.bar_birimpntr == 1 && e.barcode.length == 7)
            // if (tartiliUrunMu) {
            //   unit = 2
            //   Scale = true
            // }
            StockPrices = ((priceDocs || []).filter(e => e.code == docs[i].code).map(e => {
              return {
                master: e.code,
                isBarcode: false,
                ordr: e.ordr,
                storeId: 0,
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 12)).toISOString(),
                price: e.price,
                newPrice: e.newPrice,
                deleted: false
              }
            }) || []).sort((a, b) => a.ordr - b.ordr)


            let dataItem = {
              "Code": docs[i].code,
              "Name": docs[i].name.replaceAll('İ', 'I'),
              "ShortName": docs[i].shortName,
              "Unit": unit,
              "Status": true,
              "Scale": Scale,
              "CancelTimeout": 0,
              "NoDiscount": false,
              "NoPromotion": false,
              "FreePrice": false,
              "Tare": 0,
              "MaxSale": 0,
              "LastSaleTime": "00:00:00",
              "TagUnit": 0,
              "UnitWeight": 0,
              "Returnable": true,
              "Manufacturer": "TANIMSIZ",  // TODO: buraya markasini getirelim
              "Contents": "",
              "StorageConditions": null,
              "ProductionPlace": "TR",
              "LegalDocument": "",
              "Warnings": "",
              "ImprintNumber": "",
              "ImprintName": "",
              "ProductionMethod": "",
              "ProductionDate": "2000-01-01T00:00:00",
              "BusinessName": "",
              "DomesticProduction": null,
              "StockBarcodes": StockBarcodes,
              "StockDepartments": [
                {
                  "DepartmentId": DepartmentId,
                  "StockCode": docs[i].code,
                  "Type": 1
                }
              ],
              "StockGroups": [
                {
                  "GroupId": !isNaN(Number(docs[i].sto_anagrup_kod)) && Number(docs[i].sto_anagrup_kod) != 0 ? Number(docs[i].sto_anagrup_kod) : 1,
                  "StockCode": docs[i].code
                }
              ],
              "StockPrices": StockPrices,
              "StockRayons": [
                {
                  "RayonId": !isNaN(Number(docs[i].rayon)) && Number(docs[i].rayon) != 0 ? Number(docs[i].rayon) : 1,
                  "StockCode": docs[i].code
                }
              ],
              "StockStores": null,
              "StockOptionGroups": null,
              "isNew": null,
              "Barcode": null,
              "Price": null,
              "LastChange": null,
              "CreateDate": null,
              "UpdateDate": null
            }
            process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', '!!__setStock.json.txt'), JSON.stringify(dataItem, null, 2), 'utf8')
            SetStock2(storeDoc.posIntegration.pos312.webServiceUrl, token312, [dataItem])
              .then(async sonuc => {
                if (sonuc) {
                  storeDoc.posIntegration.lastUpdate_items = docs[i].updatedAt
                  await storeDoc.save()
                }

                let t2 = new Date().getTime() / 1000
                socketSend(sessionDoc, {
                  event: 'syncItems_progress',
                  max: docs.length,
                  position: i + 1,
                  percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                  caption: `Time:${Math.round(10 * (t2 - t1)) / 10}sn ${i + 1}/${docs.length} ${docs[i].code} - ${docs[i].shortName}`
                })
                i++
                setTimeout(() => calistir().then(resolve).catch(reject), 5)
              })
              .catch(err => {
                errorLog(`[syncItems_pos312] calistir() Error:`, err)
                i++
                return reject(err)
                //setTimeout(() => calistir().then(resolve).catch(reject), 50)
              })
          } else {
            i++
            setTimeout(() => calistir().then(resolve).catch(reject), 50)
          }
        })
      }

      calistir()
        .then(() => {
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        })
        .catch(err => {
          errorLog(`[syncItems_pos312] Error:`, err)
          socketSend(sessionDoc, { event: 'syncItems_progress_end' })
        })
    } catch (err) {
      errorLog(`[syncItems_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncItems_progress_end' })
      reject(err)
    }



  })

}

function AddCustomer(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/addcustomer`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        eventLog('resp:', resp.data)
        resolve(resp.data)
      })
      .catch(err => {
        // errorLog('[pos312 AddCustomer] Error:', err)
        reject(err.response.data.errors || err.response.data.error)
      })

  })
}


function GetCustomerById(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    //return resolve([ddd])
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/getcustomerbyid`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        // errorLog('[pos312 SetStock] Error:', err.response.data.errors || err.response.data.error)
        reject((err.response && err.response.data.errors || err.response.data.error) || 'error')
      })

  })
}

exports.syncFirms_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    let token312 = ''


    try {
      socketSend(sessionDoc, { event: 'syncFirms_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)


      socketSend(sessionDoc, { event: 'syncFirms_progress', caption: `Mikrodan cari kartlar listeleniyor` })


      let docs = await getList(sessionDoc, orgDoc, `SELECT cari_Guid as id, cari_kod as code, cari_unvan1 as [name], cari_CepTel as phone , 
          cari_efatura_fl as eInvoice, cari_eirsaliye_fl as eWaybill,cari_vdaire_adi as taxOffice,
          cari_vdaire_no as taxNumber, cari_lastup_date as updatedAt , (cari_satis_fk-1) as priceOrdr
          FROM CARI_HESAPLAR WITH (NOLOCK)
          WHERE (cari_lastup_date>'${storeDoc.posIntegration.lastUpdate_firs || ''}' 
    			  OR cari_kod in (SELECT adr_cari_kod FROM CARI_HESAP_ADRESLERI WITH (NOLOCK) WHERE adr_lastup_date>='${storeDoc.posIntegration.lastUpdate_firs || ''}')
			    ) 
			    ORDER BY cari_lastup_date`)

      if (docs.length == 0) {
        socketSend(sessionDoc, { event: 'syncFirms_progress_end' })
        return resolve('cari kartlar zaten guncel')
      }
      let addressDocs = await getList(sessionDoc, orgDoc, `SELECT adr_cari_kod as code, adr_adres_no-1 as ordr, 
        LTRIM(adr_cadde + ' ' + adr_mahalle + ' ' + adr_sokak + ' ' + adr_Apt_No + ' ' + 
        adr_Daire_No + ' ' + adr_posta_kodu + ' ' + adr_ilce + ' ' + adr_il + ' ' + adr_ulke) as [address] FROM CARI_HESAP_ADRESLERI A INNER JOIN
        CARI_HESAPLAR C ON C.cari_kod=A.adr_cari_kod
        WHERE (C.cari_lastup_date>'${storeDoc.posIntegration.lastUpdate_firms || ''}' OR A.adr_lastup_date>'${storeDoc.posIntegration.lastUpdate_firms || ''}')
        ORDER BY adr_adres_no
        `)


      socketSend(sessionDoc, { event: 'syncFirms_progress', caption: `Mikrodan Cari Kartlar cekildi` })
      resolve(`${docs.length} adet cari kart aktarilacak. baslama:${new Date(new Date().setMinutes(new Date().getMinutes() + (-1 * new Date().getTimezoneOffset()))).toISOString().substring(0, 19)}`)
      let i = 0
      function calistir() {
        return new Promise((resolve, reject) => {
          if (i >= docs.length) return resolve(true)
          let t1 = new Date().getTime() / 1000

          let adresler = (addressDocs || []).filter(e => e.code == docs[i].code).map(e => {
            return {
              address: e.address,
              ordr: e.ordr
            }
          })


          let dataItem = {
            "id": docs[i].id,
            "name": docs[i].name.replaceAll('İ', 'I') + '#' + docs[i].code,
            "taxOffice": docs[i].taxOffice,
            "taxNumber": docs[i].taxNumber,
            "eInvoice": docs[i].eInvoice ? true : false,
            "eWaybill": docs[i].eWaybill ? true : false,
            "fsd": false,
            "status": 1,
            "priceOrdr": docs[i].priceOrdr,
            "addresses": adresler,
            "cards": [],
            "groups": [{ "id": 1, "name": "Genel" }],
            "phones": [{ "ordr": 0, "phone": docs[i].phone }]
          }
          process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', '!!__customerDataItem.json.txt'), JSON.stringify(dataItem, null, 2), 'utf8')
          AddCustomer(storeDoc.posIntegration.pos312.webServiceUrl, token312, dataItem)
            .then(async sonuc => {
              eventLog('[syncFirms_pos312] AddCustomer sonuc:', sonuc)
              if (sonuc) {
                storeDoc.posIntegration.lastUpdate_firms = docs[i].updatedAt
                await storeDoc.save()
              }

              let t2 = new Date().getTime() / 1000
              socketSend(sessionDoc, {
                event: 'syncFirms_progress',
                max: docs.length,
                position: i + 1,
                percent: Math.round(10 * 100 * (i + 1) / docs.length) / 10,
                caption: `Time:${Math.round(10 * (t2 - t1)) / 10}sn ${i + 1}/${docs.length} ${docs[i].code} - ${docs[i].name}`
              })
              i++
              setTimeout(() => calistir().then(resolve).catch(reject), 50)
            })
            .catch(err => {
              errorLog(`[syncFirms_progress] calistir() Error:`, err)
              i++
              return reject(err)
              //setTimeout(() => calistir().then(resolve).catch(reject), 50)
            })

        })
      }

      calistir()
        .then(() => {
          socketSend(sessionDoc, { event: 'syncFirms_progress_end' })
        })
        .catch(err => {
          errorLog(`[syncFirms_pos312] Error:`, err)
          socketSend(sessionDoc, { event: 'syncFirms_progress_end', caption: 'Error' })
        })
    } catch (err) {
      errorLog(`[syncFirms_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncFirms_progress_end' })
      reject(err)
    }



  })

}
function GetDocuments(webServiceUrl, token, data) {
  return new Promise((resolve, reject) => {
    //return resolve([ddd])
    axios({
      method: 'post',
      url: `${webServiceUrl}/integration/getdocuments`,
      timeout: 120 * 60 * 1000, // 120 dakika
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      data: data
    })
      .then(resp => {
        resolve(resp.data)
      })
      .catch(err => {
        // errorLog('[pos312 SetStock] Error:', err.response.data.errors || err.response.data.error)
        reject((err.response && err.response.data.errors || err.response.data.error) || 'error')
      })

  })
}

exports.syncSales_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    let token312 = ''
    const startDate = (req.getValue('startDate') || '').substring(0, 10) + 'T00:00:00'
    const endDate = (req.getValue('endDate') || '').substring(0, 10) + 'T23:59:59'
    eventLog('[syncGetSales_pos312]'.green, 'startDate:', startDate, 'endDate:', endDate)
    try {
      if (!storeDoc.warehouseId) return reject(`${storeDoc.name} magaza depo no tanimlanmamis`)
      if (!storeDoc.defaultFirmId) return reject(`${storeDoc.name} magaza varsayilan cari tanimlanmamis`)
      if (endDate < startDate) return reject(`baslangic tarihi bitisten buyuk olamaz`)

      if (orgDoc.mainApp == 'mikro16_workdata' || orgDoc.mainApp == 'mikro17_workdata') {
        socketSend(sessionDoc, { event: 'syncSales_progress', caption: `Mikro WorkData olusturuluyor` })
        await mikroWorkDataOlustur(orgDoc, storeDoc, startDate.substring(0, 10), endDate.substring(0, 10))
      }

      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos login in` })
      token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)

      eventLog('[syncGetSales_pos312]'.green, 'GetDocuments started')
      socketSend(sessionDoc, { event: 'syncSales_progress', caption: `312 Pos GetDocuments` })
      GetDocuments(storeDoc.posIntegration.pos312.webServiceUrl, token312, { startDate: startDate, endDate: endDate })
        .then(fisler => {
          eventLog('[syncGetSales_pos312] fisler adet:'.green, fisler.length)

          resolve('Mikroya Aktarim Basliyor. Evrak Sayisi:' + fisler.length)
          socketSend(sessionDoc, { event: 'syncSales_progress', caption: `Aktariliyor`, max: fisler.length, position: 0, percent: 0 })
          let i = 0
          function calistir() {
            return new Promise(async (resolve, reject) => {
              if (i >= fisler.length) return resolve()
              if ((fisler[i].customers || []).length > 0) {
                if (fisler[i].customers[0].customerId) {
                  try {
                    const customer = await GetCustomerById(storeDoc.posIntegration.pos312.webServiceUrl, token312, fisler[i].customers[0].customerId)
                    fisler[i].musteri = customer
                  } catch (err) {
                    errorLog('[syncGetSales_pos312] customer error:', err)
                  }

                }
              }
              process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', '!!__fisData.json.txt'), JSON.stringify(fisler[i], null, 2), 'utf8')
              satislariAktar(orgDoc, storeDoc, fisler[i])
                .then(sonuc => {
                  // eventLog('[syncGetSales_pos312]'.green, 'sonuc:', sonuc)
                  socketSend(sessionDoc, { event: 'syncSales_progress', caption: `${fisler[i].date} Kalem:${fisler[i].sales.length} Station:${fisler[i].stationId} Batch:${fisler[i].batchNo}/${fisler[i].stanNo}`, max: fisler.length, position: (i + 1), percent: 100 * (i + 1) / fisler.length })
                  i++
                  setTimeout(() => calistir().then(resolve).catch(reject), 50)
                })
                .catch(reject)
            })
          }
          calistir()
            .then(() => {
              eventLog('[syncGetSales_pos312]'.green, 'Bitti')
              socketSend(sessionDoc, { event: 'syncSales_progress_end' })
              process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', '!!__syncSales.json.txt'), JSON.stringify(fisler, null, 2), 'utf8')
            })
            .catch(err => {
              errorLog('[syncGetSales_pos312]'.green, 'Error:', err)
              process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', '!!__syncSales.json.txt'), JSON.stringify(fisler, null, 2), 'utf8')
            })
            .finally(() => socketSend(sessionDoc, { event: 'syncSales_progress_end' }))

        })
        .catch(err => {
          errorLog(`[syncSales_pos312] Error:`, err)
          socketSend(sessionDoc, { event: 'syncSales_progress_end' })
          reject(err)
        })
    } catch (err) {
      errorLog(`[syncSales_pos312] Error:`, err)
      socketSend(sessionDoc, { event: 'syncSales_progress_end' })
      reject(err)
    }
  })
}


function satislariAktar(orgDoc, storeDoc, fisData) {
  return new Promise((resolve, reject) => {
    switch (orgDoc.mainApp) {
      case 'mikro16':
        mikroV16SatisAktar(orgDoc, storeDoc, fisData).then(resolve).catch(reject)
        break
      case 'mikro17':
        mikroV17SatisAktar(orgDoc, storeDoc, fisData).then(resolve).catch(reject)
        break
      case 'mikro16_workdata':
        mikroV16WorkDataAktar(orgDoc, storeDoc, fisData).then(resolve).catch(reject)
        break
      case 'mikro17_workdata':
        mikroV17WorkDataAktar(orgDoc, storeDoc, fisData).then(resolve).catch(reject)
        break
      default:
        reject(`organization mainApp not supported. mainApp:${orgDoc.mainApp}`)
        brak
    }
  })
}

function mikroWorkDataOlustur(orgDoc, storeDoc, startDate, endDate) {
  return new Promise((resolve, reject) => {
    let i = 0;
    console.log('startDate:', startDate, ' endDate:', endDate)
    let d1 = new Date(startDate + ' 11:00:00')
    let d2 = new Date(endDate + ' 11:00:00')
    let tarih = d1
    while (tarih <= d2) {
      let query = ``
      switch (orgDoc.mainApp) {
        case 'mikro16_workdata':
          query += workData.workDataV16CreatePOQuery(tarih, storeDoc.warehouseId) + '\n'
          query += workData.workDataV16CreatePRHQuery(tarih, storeDoc.warehouseId) + '\n'
          query += workData.workDataV16CreateSTHQuery(tarih, storeDoc.warehouseId) + '\n'
          break
        case 'mikro17_workdata':
          query += workData.workDataV17CreatePOQuery(tarih, storeDoc.warehouseId) + '\n'
          query += workData.workDataV17CreatePRHQuery(tarih, storeDoc.warehouseId) + '\n'
          query += workData.workDataV17CreateSTHQuery(tarih, storeDoc.warehouseId) + '\n'
          break
        default:
          return reject(`organization mainApp not supported. mainApp:${orgDoc.mainApp}`)
      }

      executeSqlDb(orgDoc, storeDoc.db + '_WORKDATA', query)
        .then(resolve)
        .catch(reject)
      tarih.setDate(tarih.getDate() + 1)
    }
    resolve()
  })
}

exports.syncPriceTrigger_pos312 = function (dbModel, sessionDoc, req, orgDoc, storeDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const token312 = await exports.login(storeDoc.posIntegration.pos312.webServiceUrl,
        storeDoc.posIntegration.pos312.webServiceUsername,
        storeDoc.posIntegration.pos312.webServicePassword)
      fetch(`${storeDoc.posIntegration.pos312.webServiceUrl}/integration/addtransfer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token312}` },
        body: JSON.stringify({
          "defination": false,
          "customer": false,
          "user": false,
          "stock": 2,
          "stores": [{
            "storeId": storeDoc.posIntegration.pos312.storeId
          }]
        }),
      })
        .then(async resp => {
          if (resp.ok) {
            resp
              .json()
              .then(result => {
                resolve(result)
              })
              .catch(reject)
          } else reject(`${await resp.json()}`)
        })
        .catch(reject)


    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}

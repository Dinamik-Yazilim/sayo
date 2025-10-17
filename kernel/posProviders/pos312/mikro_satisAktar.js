const { getList, executeSql, getListDb, executeSqlDb } = require('../../lib/mikro/mikroHelper')

exports.mikroV16SatisAktar = function (orgDoc, storeDoc, fisData) {
  return new Promise(async (resolve, reject) => {
    mikroSatisAktar('mikro16', orgDoc, storeDoc, fisData).then(resolve).catch(reject)
  })
}

exports.mikroV17SatisAktar = function (orgDoc, storeDoc, fisData) {
  return new Promise(async (resolve, reject) => {
    mikroSatisAktar('mikro17', orgDoc, storeDoc, fisData).then(resolve).catch(reject)
  })
}

function mikroSatisAktar(mainApp, orgDoc, storeDoc, fisData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (fisData.status != 1) return resolve()
      // if (!fisData.batchNo) return resolve()
      // if (!fisData.stanNo) return resolve()
      const posComputerDoc = await db.storePosComputers.findOne({
        organization: orgDoc._id,
        db: storeDoc.db,
        store: storeDoc._id,
        integrationCode: fisData.stationId,
      })
      if (!posComputerDoc) return reject(`POS Bilgisayari tanimlanmamis. stationId:${fisData.stationId}`)
      if (!posComputerDoc.cashAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} nakit kasa tanimlanmamis`)
      if (!posComputerDoc.bankAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} banka hesabi tanimlanmamis`)

      const tarih = util.yyyyMMdd(fisData.endDate)
      // const depoNo = util.pad(storeDoc.warehouseId, 3)

      let seriNo = posComputerDoc.salesDocNoSerial || ''
      const iade = fisData.type == 3 ? true : false

      let cha_m17fields = ''
      let cha_m17values = ''
      let cha_m16fields = ''
      let cha_m16values = ''
      let sth_m17fields = ''
      let sth_m17values = ''
      let cari_m17fields = ''
      let cari_m17values = ''
      let adr_m17fields = ''
      let adr_m17values = ''
      if (mainApp == 'mikro17') {
        cha_m17fields = `, cha_MainProgramNo, cha_VersionNo, cha_MenuNo, cha_MikroSpecial1, cha_MikroSpecial2, cha_MikroSpecial3, cha_ExternalProgramType, cha_ExternalProgramId, cha_Hash
        , cha_efatura_belge_tipi
        , cha_vergi11, cha_vergi12, cha_vergi13, cha_vergi14, cha_vergi15, cha_vergi16, cha_vergi17, cha_vergi18, cha_vergi19, cha_vergi20
        , cha_ilave_edilecek_kdv11, cha_ilave_edilecek_kdv12, cha_ilave_edilecek_kdv13, cha_ilave_edilecek_kdv14, 
            cha_ilave_edilecek_kdv15, cha_ilave_edilecek_kdv16, cha_ilave_edilecek_kdv17, cha_ilave_edilecek_kdv18, cha_ilave_edilecek_kdv19, cha_ilave_edilecek_kdv20
        , cha_tevkifat_sifirlandi_fl, cha_bsba_e_belge_mi, 
              cha_eticaret_kanal_kodu, cha_hizli_satis_kasa_no, cha_ebelge_Islemturu`
        cha_m17values = `, 21 /*cha_MainProgramNo*/, @MikroVersionNo /*cha_VersionNo*/, 61270 /*cha_MenuNo*/, '' /*cha_MikroSpecial1*/, '' /*cha_MikroSpecial2*/, '' /*cha_MikroSpecial3*/, 
          0 /*cha_ExternalProgramType*/, '${fisData.id}' /*cha_ExternalProgramId*/, 0 /*cha_Hash*/
        , 0 /*cha_efatura_belge_tipi*/
        , @Vergi11 /*cha_vergi11*/, @Vergi12 /*cha_vergi12*/, 0 /*cha_vergi13*/, 0 /*cha_vergi14*/, 0 /*cha_vergi15*/, 0 /*cha_vergi16*/, 0 /*cha_vergi17*/, 
        0 /*cha_vergi18*/, 0 /*cha_vergi19*/, 0 /*cha_vergi20*/
        , 0 /*cha_ilave_edilecek_kdv11*/, 0 /*cha_ilave_edilecek_kdv12*/, 0 /*cha_ilave_edilecek_kdv13*/, 0 /*cha_ilave_edilecek_kdv14*/, 0 /*cha_ilave_edilecek_kdv15*/, 0 /*cha_ilave_edilecek_kdv16*/, 
            0 /*cha_ilave_edilecek_kdv17*/, 0 /*cha_ilave_edilecek_kdv18*/, 0 /*cha_ilave_edilecek_kdv19*/, 0 /*cha_ilave_edilecek_kdv20*/
        , 0 /*cha_tevkifat_sifirlandi_fl*/, 0 /*cha_bsba_e_belge_mi*/, 
            '' /*cha_eticaret_kanal_kodu*/, 0 /*cha_hizli_satis_kasa_no*/, 0 /*cha_ebelge_Islemturu*/`

        sth_m17fields = `, sth_MainProgramNo, sth_VersionNo, sth_MenuNo, sth_MikroSpecial1, sth_MikroSpecial2, sth_MikroSpecial3, sth_ExternalProgramType, sth_ExternalProgramId, sth_Hash
        , sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu, sth_tevkifat_sifirlandi_fl`
        sth_m17values = `, 21 /*sth_MainProgramNo*/, @MikroVersionNo /*sth_VersionNo*/, 61270 /*sth_MenuNo*/, '' /*sth_MikroSpecial1*/, '' /*sth_MikroSpecial2*/, '' /*sth_MikroSpecial3*/, 
          0 /*sth_ExternalProgramType*/, '${fisData.id}' /*sth_ExternalProgramId*/, 0 /*sth_Hash*/
          , '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/`
        cari_m17fields = `,cari_MainProgramNo, cari_VersionNo, cari_MenuNo, cari_MikroSpecial1, cari_MikroSpecial2, cari_MikroSpecial3, cari_ExternalProgramType, cari_ExternalProgramId, cari_Hash, 
              , cari_siparis_avans_muh_kod, cari_siparis_avans_muh_kod1, cari_siparis_avans_muh_kod2
              , cari_ozel_butceli_kurum_carisi, cari_nakakincelenmesi, cari_vergimukellefidegil_mi, cari_tasiyicifirma_cari_kodu, cari_nacekodu_1, cari_nacekodu_2, 
              cari_nacekodu_3, cari_sirket_turu, cari_baba_adi, cari_faal_terk`
        cari_m17values = `, 46 /*cari_MainProgramNo*/, @MikroVersionNo /*cari_VersionNo*/, '41110' /*cari_MenuNo*/, '' /*cari_MikroSpecial1*/, '' /*cari_MikroSpecial2*/, '' /*cari_MikroSpecial3*/, 
            0 /*cari_ExternalProgramType*/, @CariId /*cari_ExternalProgramId*/, 0 /*cari_Hash*/
            , '' /*cari_siparis_avans_muh_kod*/, '' /*cari_siparis_avans_muh_kod1*/, '' /*cari_siparis_avans_muh_kod2*/  
            , '' /*cari_ozel_butceli_kurum_carisi*/, 0 /*cari_nakakincelenmesi*/, 0 /*cari_vergimukellefidegil_mi*/, '' /*cari_tasiyicifirma_cari_kodu*/, 
            '' /*cari_nacekodu_1*/, '' /*cari_nacekodu_2*/, '' /*cari_nacekodu_3*/, 0 /*cari_sirket_turu*/, '' /*cari_baba_adi*/, 0 /*cari_faal_terk*/`
        adr_m17fields = `,adr_MainProgramNo, adr_VersionNo, adr_MenuNo, adr_MikroSpecial1, adr_MikroSpecial2, adr_MikroSpecial3, 
            ,adr_ExternalProgramType, adr_ExternalProgramId, adr_Hash `
        adr_m17values = `,46 /*adr_MainProgramNo*/, @MikroVersionNo /*adr_VersionNo*/, 0 /*adr_MenuNo*/, '' /*adr_MikroSpecial1*/, '' /*adr_MikroSpecial2*/, '' /*adr_MikroSpecial3*/,
            0 /*adr_ExternalProgramType*/,  @CariId /*adr_ExternalProgramId*/, 0 /*adr_Hash*/ `
      } else if (mainApp == 'mikro16') {
        cha_m16fields = `, cha_disyazilimid ` //, cha_disyazilim_tip`
        cha_m16values = `, '${fisData.id}' /*cha_disyazilimid*/` //, 0 /*cha_disyazilim_tip*/`
      }

      let query = `
        DECLARE @Tarih DATETIME='${fisData.endDate.substring(0, 10)}'
        DECLARE @EvrakSeri VARCHAR(50)='${seriNo}';
        DECLARE @EvrakSira INT=0;
        DECLARE @BelgeNo VARCHAR(50)='${seriNo}-${fisData.batchNo || 0}${util.pad(fisData.stanNo || 0, 4)}';
        DECLARE @GirisDepoNo INT = ${iade ? storeDoc.warehouseId : 0};
        DECLARE @CikisDepoNo INT = ${iade ? 0 : storeDoc.warehouseId};
        DECLARE @CariKod VARCHAR(25) = '${storeDoc.defaultFirmId}';
        DECLARE @ProjeKodu VARCHAR(25) = '${posComputerDoc.responsibilityId || storeDoc.responsibilityId}';
        DECLARE @SorumlulukMerkezi VARCHAR(25) = '${posComputerDoc.projectId || storeDoc.projectId}';
        DECLARE @KasaKod VARCHAR(25) = '${posComputerDoc.cashAccountId}';
        DECLARE @BankaKod VARCHAR(25) = '${posComputerDoc.bankAccountId}';

        DECLARE @CHA_TIP INT = ${iade ? 1 : 0};
        DECLARE @CHA_CINS INT = 7;
        DECLARE @CHA_IADE INT = ${iade ? 1 : 0};
        DECLARE @CHA_EVRAKTIP INT = ${iade ? 0 : 63};
        DECLARE @CHA_TPOZ INT = 1;
        DECLARE @CHA_TICARET_TURU INT = ${iade ? 0 : 1};
        DECLARE @CHA_CARI_CINS INT = 4;

        DECLARE @STH_TIP INT = ${iade ? 0 : 1};
        DECLARE @STH_CINS INT = ${iade ? 0 : 1};
        DECLARE @STH_IADE INT = ${iade ? 1 : 0};
        DECLARE @STH_EVRAKTIP INT = ${iade ? 3 : 4};
        DECLARE @STH_DISTICARET_TURU INT = ${iade ? 1 : 0};

        DECLARE @CariVergiNo VARCHAR(15)='';
        
        DECLARE @MikroVersionNo nVARCHAR(10)='17.03d'
        DECLARE @MikroUserNo INT = 99;
        DECLARE @SatirNo INT = -1;
        DECLARE @VergiPntr INT = 0;
        DECLARE @VergiYuzde FLOAT = 0;
        DECLARE @VergiMatrah0 FLOAT=0,@VergiMatrah1 FLOAT=0, @VergiMatrah2 FLOAT=0, @VergiMatrah3 FLOAT=0, @VergiMatrah4 FLOAT=0;
        DECLARE @VergiMatrah5 FLOAT=0, @VergiMatrah6 FLOAT=0, @VergiMatrah7 FLOAT=0, @VergiMatrah8 FLOAT=0, @VergiMatrah9 FLOAT=0;
        DECLARE @VergiMatrah10 FLOAT=0, @VergiMatrah11 FLOAT=0, @VergiMatrah12 FLOAT=0;

        DECLARE @Vergi0 FLOAT=0, @Vergi1 FLOAT=0, @Vergi2 FLOAT=0, @Vergi3 FLOAT=0, @Vergi4 FLOAT=0, @Vergi5 FLOAT=0, @Vergi6 FLOAT=0; 
        DECLARE @Vergi7 FLOAT=0, @Vergi8 FLOAT=0, @Vergi9 FLOAT=0, @Vergi10 FLOAT=0, @Vergi11 FLOAT=0, @Vergi12 FLOAT=0; 
        
        DECLARE @OdemeOran FLOAT=0;
      `
      if (mainApp == 'mikro17') {
        query += `
        IF EXISTS(SELECT TOP 1 * FROM DEPOLAR) BEGIN
          SELECT TOP 1 @MikroVersionNo=dep_VersionNo FROM DEPOLAR ORDER BY dep_no DESC
        END
        `
      }
      if (fisData.musteri) {
        query += `
          DECLARE @CariHesapPattern VARCHAR(25)='${storeDoc.newFirm && storeDoc.newFirm.codePattern || '120.____'}';
          DECLARE @CariMuhKodu VARCHAR(255)='${storeDoc.newFirm && storeDoc.newFirm.accountingCode || '120'}';
          DECLARE @CariName VARCHAR(255)='${fisData.musteri.name.replaceAll("'", "''")}';
          DECLARE @CariUnvan1 VARCHAR(127)=SUBSTRING(@CariName,1,127);
          DECLARE @CariUnvan2 VARCHAR(127)=SUBSTRING(@CariName,128,127);
          DECLARE @CariId VARCHAR(50)='${fisData.musteri.id}';
          DECLARE @CariEmail VARCHAR(255)='${storeDoc.newFirm && storeDoc.newFirm.email || '120'}';
          DECLARE @CariVergiDairesi VARCHAR(50)='${fisData.musteri.taxOffice}';
          DECLARE @CariCepTel VARCHAR(20)=SUBSTRING('${fisData.musteri.phones && fisData.musteri.phones.length > 0 ? fisData.musteri.phones[0].phone : ''}',1,20);
          DECLARE @Adres VARCHAR(255)=SUBSTRING('${fisData.musteri.addresses && fisData.musteri.addresses.length > 0 ? fisData.musteri.addresses[0].address : ''}',1,255);
          DECLARE @AdresCadde VARCHAR(50)=SUBSTRING(@Adres,1,50);
          DECLARE @AdresMahalle VARCHAR(50)=SUBSTRING(@Adres,51,50);
          DECLARE @AdresSokak VARCHAR(50)=SUBSTRING(@Adres,101,50);
          DECLARE @AdresSemt VARCHAR(25)=SUBSTRING(@Adres,151,25);
          DECLARE @CariEInvoice INT = ${fisData.musteri.eInvoice ? 1 : 0};
          DECLARE @CariEInvoiceAlias VARCHAR(120)=SUBSTRING('',1,120);
          DECLARE @CariEWayBill INT = ${fisData.musteri.eWaybill ? 1 : 0};
          DECLARE @CariEWayBillAlias VARCHAR(120)=SUBSTRING('',1,120);

          DECLARE @MaxCariKod VARCHAR(25)='';
          DECLARE @YeniCariKod VARCHAR(25);
          DECLARE @NextCariKodInt BIGINT=1;

          SET @CariVergiNo = '${fisData.musteri.taxNumber || '11111111111'}';
        `
        if (mainApp == 'mikro16') {
          query += `SELECT @YeniCariKod = cari_kod FROM CARI_HESAPLAR WHERE (cari_Guid=@CariId);`
        } else if (mainApp == 'mikro17') {
          query += `SELECT @YeniCariKod = cari_kod FROM CARI_HESAPLAR WHERE (cari_Guid=@CariId or cari_ExternalProgramId=@CariId );`
        }

        query += `
          IF @YeniCariKod IS NULL BEGIN

            SELECT @MaxCariKod= REPLACE(RTRIM(MAX(cari_kod)),' ','.') FROM CARI_HESAPLAR WITH(NOLOCK) WHERE  cari_kod like @CariHesapPattern 
            and ISNUMERIC(REPLACE(REPLACE(cari_kod,' ',''),'.',''))=1;

            IF NOT @MaxCariKod IS NULL BEGIN
              SELECT TOP 1 @MaxCariKod=Item FROM SplitToItems(@MaxCariKod,'.') ORDER BY ItemNumber DESC
            END ELSE BEGIN
              SET @MaxCariKod=REPLACE(STR('',LEN(@CariHesapPattern)-LEN(REPLACE(@CariHesapPattern,'_',''))),' ','0');
              PRINT @MaxCariKod;
            END
            SET @NextCariKodInt=CAST(@MaxCariKod as bigint)+1

            SET @YeniCariKod=REPLACE(@CariHesapPattern,'_','') + REPLACE(STR(@NextCariKodInt,LEN(@MaxCariKod)),' ', '0')

            INSERT INTO CARI_HESAPLAR(cari_Guid, cari_DBCno, cari_SpecRECno, cari_iptal, cari_fileid, cari_hidden, cari_kilitli, cari_degisti, cari_checksum, cari_create_user,
              cari_create_date, cari_lastup_user, cari_lastup_date, cari_special1, cari_special2, cari_special3, 
              cari_kod, cari_unvan1, cari_unvan2, cari_hareket_tipi, cari_baglanti_tipi, 
              cari_stok_alim_cinsi, cari_stok_satim_cinsi, cari_muh_kod, cari_muh_kod1, cari_muh_kod2, cari_doviz_cinsi, cari_doviz_cinsi1, cari_doviz_cinsi2, cari_vade_fark_yuz, cari_vade_fark_yuz1,
              cari_vade_fark_yuz2, cari_KurHesapSekli, cari_vdaire_adi, cari_vdaire_no, cari_sicil_no, cari_VergiKimlikNo, cari_satis_fk, cari_odeme_cinsi, cari_odeme_gunu, cari_odemeplan_no, 
              cari_opsiyon_gun, cari_cariodemetercihi, cari_fatura_adres_no, cari_sevk_adres_no, cari_banka_tcmb_kod1, cari_banka_tcmb_subekod1, cari_banka_tcmb_ilkod1, cari_banka_hesapno1,
              cari_banka_swiftkodu1, cari_banka_tcmb_kod2, cari_banka_tcmb_subekod2, cari_banka_tcmb_ilkod2, cari_banka_hesapno2, cari_banka_swiftkodu2, cari_banka_tcmb_kod3, cari_banka_tcmb_subekod3,
              cari_banka_tcmb_ilkod3, cari_banka_hesapno3, cari_banka_swiftkodu3, cari_banka_tcmb_kod4, cari_banka_tcmb_subekod4, cari_banka_tcmb_ilkod4, cari_banka_hesapno4, cari_banka_swiftkodu4,
              cari_banka_tcmb_kod5, cari_banka_tcmb_subekod5, cari_banka_tcmb_ilkod5, cari_banka_hesapno5, cari_banka_swiftkodu5, cari_banka_tcmb_kod6, cari_banka_tcmb_subekod6, cari_banka_tcmb_ilkod6,
              cari_banka_hesapno6, cari_banka_swiftkodu6, cari_banka_tcmb_kod7, cari_banka_tcmb_subekod7, cari_banka_tcmb_ilkod7, cari_banka_hesapno7, cari_banka_swiftkodu7, cari_banka_tcmb_kod8, 
              cari_banka_tcmb_subekod8, cari_banka_tcmb_ilkod8, cari_banka_hesapno8, cari_banka_swiftkodu8, cari_banka_tcmb_kod9, cari_banka_tcmb_subekod9, cari_banka_tcmb_ilkod9, cari_banka_hesapno9, 
              cari_banka_swiftkodu9, cari_banka_tcmb_kod10, cari_banka_tcmb_subekod10, cari_banka_tcmb_ilkod10, cari_banka_hesapno10, cari_banka_swiftkodu10, cari_EftHesapNum, cari_Ana_cari_kodu, 
              cari_satis_isk_kod, cari_sektor_kodu, cari_bolge_kodu, cari_grup_kodu, cari_temsilci_kodu, cari_muhartikeli, cari_firma_acik_kapal, cari_BUV_tabi_fl, cari_cari_kilitli_flg, 
              cari_etiket_bas_fl, cari_Detay_incele_flg, cari_efatura_fl, cari_POS_ongpesyuzde, cari_POS_ongtaksayi, cari_POS_ongIskOran, cari_kaydagiristarihi, cari_KabEdFCekTutar, cari_hal_caritip, 
              cari_HalKomYuzdesi, cari_TeslimSuresi, cari_wwwadresi, cari_EMail, cari_CepTel, cari_VarsayilanGirisDepo, cari_VarsayilanCikisDepo, cari_Portal_Enabled, cari_Portal_PW, 
              cari_BagliOrtaklisa_Firma, cari_kampanyakodu, cari_b_bakiye_degerlendirilmesin_fl, cari_a_bakiye_degerlendirilmesin_fl, cari_b_irsbakiye_degerlendirilmesin_fl, 
              cari_a_irsbakiye_degerlendirilmesin_fl, cari_b_sipbakiye_degerlendirilmesin_fl, cari_a_sipbakiye_degerlendirilmesin_fl, cari_KrediRiskTakibiVar_flg, cari_ufrs_fark_muh_kod, 
              cari_ufrs_fark_muh_kod1, cari_ufrs_fark_muh_kod2, cari_odeme_sekli, cari_TeminatMekAlacakMuhKodu, cari_TeminatMekAlacakMuhKodu1, cari_TeminatMekAlacakMuhKodu2, cari_TeminatMekBorcMuhKodu, 
              cari_TeminatMekBorcMuhKodu1, cari_TeminatMekBorcMuhKodu2, cari_VerilenDepozitoTeminatMuhKodu, cari_VerilenDepozitoTeminatMuhKodu1, cari_VerilenDepozitoTeminatMuhKodu2, 
              cari_AlinanDepozitoTeminatMuhKodu, cari_AlinanDepozitoTeminatMuhKodu1, cari_AlinanDepozitoTeminatMuhKodu2, cari_def_efatura_cinsi, cari_otv_tevkifatina_tabii_fl, cari_KEP_adresi, 
              cari_efatura_baslangic_tarihi, cari_mutabakat_mail_adresi, cari_mersis_no, cari_istasyon_cari_kodu, cari_gonderionayi_sms, cari_gonderionayi_email, cari_eirsaliye_fl, 
              cari_eirsaliye_baslangic_tarihi, cari_vergidairekodu, cari_CRM_sistemine_aktar_fl, cari_efatura_xslt_dosya, cari_pasaport_no, cari_kisi_kimlik_bilgisi_aciklama_turu, 
              cari_kisi_kimlik_bilgisi_diger_aciklama, cari_uts_kurum_no, cari_kamu_kurumu_fl, cari_earsiv_xslt_dosya, cari_Perakende_fl, cari_yeni_dogan_mi, cari_eirsaliye_xslt_dosya, 
              cari_def_eirsaliye_cinsi
              ${cari_m17fields})
            VALUES(NEWID()	/*cari_Guid*/, 
            0 /*cari_DBCno*/, 0 /*cari_SpecRECno*/, 0 /*cari_iptal*/, 31 /*cari_fileid*/, 0 /*cari_hidden*/, 0 /*cari_kilitli*/, 0 /*cari_degisti*/, 0 /*cari_checksum*/, 
            @MikroUserNo /*cari_create_user*/, GETDATE(), @MikroUserNo /*cari_lastup_user*/, @MikroUserNo, '' /*cari_special1*/, '' /*cari_special2*/, '' /*cari_special3*/, 
            @YeniCariKod /*cari_kod*/, @CariUnvan1 /*cari_unvan1*/, @CariUnvan2 /*cari_unvan2*/,
            0 /*cari_hareket_tipi*/, 0 /*cari_baglanti_tipi*/, 0 /*cari_stok_alim_cinsi*/, 0 /*cari_stok_satim_cinsi*/,@CariMuhKodu /*cari_muh_kod*/, '' /*cari_muh_kod1*/, '' /*cari_muh_kod2*/,
            0 /*cari_doviz_cinsi*/, 255 /*cari_doviz_cinsi1*/, 255 /*cari_doviz_cinsi2*/, 25 /*cari_vade_fark_yuz*/, 0 /*cari_vade_fark_yuz1*/, 0 /*cari_vade_fark_yuz2*/, 1 /*cari_KurHesapSekli*/,
            @CariVergiDairesi /*cari_vdaire_adi*/, @CariVergiNo /*cari_vdaire_no*/, '' /*cari_sicil_no*/, '' /*cari_VergiKimlikNo*/, 1 /*cari_satis_fk*/, 0 /*cari_odeme_cinsi*/,
            0 /*cari_odeme_gunu*/, 0 /*cari_odemeplan_no*/, 0 /*cari_opsiyon_gun*/, 0 /*cari_cariodemetercihi*/, 1 /*cari_fatura_adres_no*/, 1 /*cari_sevk_adres_no*/,
            '' /*cari_banka_tcmb_kod1*/, '' /*cari_banka_tcmb_subekod1*/, '' /*cari_banka_tcmb_ilkod1*/, '' /*cari_banka_hesapno1*/, '' /*cari_banka_swiftkodu1*/, 
            '' /*cari_banka_tcmb_kod2*/, '' /*cari_banka_tcmb_subekod2*/, '' /*cari_banka_tcmb_ilkod2*/, '' /*cari_banka_hesapno2*/, '' /*cari_banka_swiftkodu2*/, 
            '' /*cari_banka_tcmb_kod3*/, '' /*cari_banka_tcmb_subekod3*/, '' /*cari_banka_tcmb_ilkod3*/, '' /*cari_banka_hesapno3*/, '' /*cari_banka_swiftkodu3*/,
            '' /*cari_banka_tcmb_kod4*/, '' /*cari_banka_tcmb_subekod4*/, '' /*cari_banka_tcmb_ilkod4*/, '' /*cari_banka_hesapno4*/, '' /*cari_banka_swiftkodu4*/, 
            '' /*cari_banka_tcmb_kod5*/, '' /*cari_banka_tcmb_subekod5*/, '' /*cari_banka_tcmb_ilkod5*/, '' /*cari_banka_hesapno5*/, '' /*cari_banka_swiftkodu5*/,
            '' /*cari_banka_tcmb_kod6*/, '' /*cari_banka_tcmb_subekod6*/, '' /*cari_banka_tcmb_ilkod6*/, '' /*cari_banka_hesapno6*/, '' /*cari_banka_swiftkodu6*/, 
            '' /*cari_banka_tcmb_kod7*/, '' /*cari_banka_tcmb_subekod7*/, '' /*cari_banka_tcmb_ilkod7*/, '' /*cari_banka_hesapno7*/, '' /*cari_banka_swiftkodu7*/, 
            '' /*cari_banka_tcmb_kod8*/, '' /*cari_banka_tcmb_subekod8*/, '' /*cari_banka_tcmb_ilkod8*/, '' /*cari_banka_hesapno8*/, '' /*cari_banka_swiftkodu8*/,
            '' /*cari_banka_tcmb_kod9*/, '' /*cari_banka_tcmb_subekod9*/, '' /*cari_banka_tcmb_ilkod9*/, '' /*cari_banka_hesapno9*/, '' /*cari_banka_swiftkodu9*/, 
            '' /*cari_banka_tcmb_kod10*/, '' /*cari_banka_tcmb_subekod10*/, '' /*cari_banka_tcmb_ilkod10*/, '' /*cari_banka_hesapno10*/, '' /*cari_banka_swiftkodu10*/,
            1  /*cari_EftHesapNum*/, '' /*cari_Ana_cari_kodu*/, '' /*cari_satis_isk_kod*/, '' /*cari_sektor_kodu*/, '' /*cari_bolge_kodu*/, '' /*cari_grup_kodu*/,
            '' /*cari_temsilci_kodu*/, '' /*cari_muhartikeli*/, 0 /*cari_firma_acik_kapal*/, 0 /*cari_BUV_tabi_fl*/, 0 /*cari_cari_kilitli_flg*/, 0 /*cari_etiket_bas_fl*/, 
            0 /*cari_Detay_incele_flg*/, @CariEInvoice /*cari_efatura_fl*/, 0 /*cari_POS_ongpesyuzde*/, 0 /*cari_POS_ongtaksayi*/, 0 /*cari_POS_ongIskOran*/,
            '1899-12-30 00:00:00.000' /*cari_kaydagiristarihi*/, 0 /*cari_KabEdFCekTutar*/, 0 /*cari_hal_caritip*/, 0 /*cari_HalKomYuzdesi*/, 0 /*cari_TeslimSuresi*/, 
            '' /*cari_wwwadresi*/, @CariEmail /*cari_EMail*/, @CariCepTel /*cari_CepTel*/, 0 /*cari_VarsayilanGirisDepo*/, 0 /*cari_VarsayilanCikisDepo*/, 
            0 /*cari_Portal_Enabled*/, '' /*cari_Portal_PW*/, 0 /*cari_BagliOrtaklisa_Firma*/, '' /*cari_kampanyakodu*/, 0 /*cari_b_bakiye_degerlendirilmesin_fl*/, 
            0 /*cari_a_bakiye_degerlendirilmesin_fl*/, 0 /*cari_b_irsbakiye_degerlendirilmesin_fl*/, 0 /*cari_a_irsbakiye_degerlendirilmesin_fl*/, 
            0 /*cari_b_sipbakiye_degerlendirilmesin_fl*/, 0 /*cari_a_sipbakiye_degerlendirilmesin_fl*/, 0 /*cari_KrediRiskTakibiVar_flg*/, 
            '' /*cari_ufrs_fark_muh_kod*/, '' /*cari_ufrs_fark_muh_kod1*/, '' /*cari_ufrs_fark_muh_kod2*/, 0 /*cari_odeme_sekli*/, '910' /*cari_TeminatMekAlacakMuhKodu*/,
            '' /*cari_TeminatMekAlacakMuhKodu1*/, '' /*cari_TeminatMekAlacakMuhKodu2*/, '912' /*cari_TeminatMekBorcMuhKodu*/, '' /*cari_TeminatMekBorcMuhKodu1*/, 
            '' /*cari_TeminatMekBorcMuhKodu2*/, '226' /*cari_VerilenDepozitoTeminatMuhKodu*/, '' /*cari_VerilenDepozitoTeminatMuhKodu1*/, '' /*cari_VerilenDepozitoTeminatMuhKodu2*/, 
            '326' /*cari_AlinanDepozitoTeminatMuhKodu*/, '' /*cari_AlinanDepozitoTeminatMuhKodu1*/, '' /*cari_AlinanDepozitoTeminatMuhKodu2*/, 
            0 /*cari_def_efatura_cinsi*/, 0 /*cari_otv_tevkifatina_tabii_fl*/, '' /*cari_KEP_adresi*/, '1899-12-31 00:00:00.000' /*cari_efatura_baslangic_tarihi*/, 
            '' /*cari_mutabakat_mail_adresi*/, '' /*cari_mersis_no*/, '' /*cari_istasyon_cari_kodu*/, 0 /*cari_gonderionayi_sms*/, 0 /*cari_gonderionayi_email*/,
            @CariEWayBill /*cari_eirsaliye_fl*/, '1899-12-31 00:00:00.000' /*cari_eirsaliye_baslangic_tarihi*/, '' /*cari_vergidairekodu*/, 0 /*cari_CRM_sistemine_aktar_fl*/, 
            '' /*cari_efatura_xslt_dosya*/, '' /*cari_pasaport_no*/, 0 /*cari_kisi_kimlik_bilgisi_aciklama_turu*/, '' /*cari_kisi_kimlik_bilgisi_diger_aciklama*/,
            '' /*cari_uts_kurum_no*/, 0 /*cari_kamu_kurumu_fl*/, '' /*cari_earsiv_xslt_dosya*/, 0 /*cari_Perakende_fl*/, 0 /*cari_yeni_dogan_mi*/, '' /*cari_eirsaliye_xslt_dosya*/, 
            0 /*cari_def_eirsaliye_cinsi*/
            ${cari_m17values});

            INSERT INTO CARI_HESAP_ADRESLERI(adr_Guid, adr_DBCno, adr_SpecRECno, adr_iptal, adr_fileid, adr_hidden, adr_kilitli, adr_degisti, adr_checksum, adr_create_user, adr_create_date, 
            adr_lastup_user, adr_lastup_date, adr_special1, adr_special2, adr_special3, 
            adr_cari_kod, adr_adres_no, adr_aprint_fl, adr_cadde, adr_mahalle, adr_sokak, adr_Semt, adr_Apt_No, adr_Daire_No, adr_posta_kodu, 
            adr_ilce, adr_il, adr_ulke, adr_Adres_kodu, adr_tel_ulke_kodu, adr_tel_bolge_kodu, adr_tel_no1, adr_tel_no2, adr_tel_faxno, adr_tel_modem, adr_yon_kodu, adr_uzaklik_kodu, adr_temsilci_kodu, 
            adr_ozel_not, adr_ziyaretperyodu, adr_ziyaretgunu, adr_gps_enlem, adr_gps_boylam, adr_ziyarethaftasi, adr_ziygunu2_1, adr_ziygunu2_2, adr_ziygunu2_3, adr_ziygunu2_4, adr_ziygunu2_5, 
            adr_ziygunu2_6, adr_ziygunu2_7, adr_efatura_alias, adr_eirsaliye_alias ${adr_m17fields})
            VALUES(NEWID() /*adr_Guid*/, 0, 0, 0, 0, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), '', '', '',
            @YeniCariKod /*adr_cari_kod*/, 1 /*adr_adres_no*/, 0 /*adr_aprint_fl*/, 
            @AdresCadde /*adr_cadde*/, @AdresMahalle /*adr_mahalle*/, @AdresSokak /*adr_sokak*/, @AdresSemt /*adr_Semt*/, '' /*adr_Apt_No*/, '' /*adr_Daire_No*/, 
            0 /*adr_posta_kodu*/, '' /*adr_ilce*/, '' /*adr_il*/, 'TÜRKİYE' /*adr_ulke*/, '' /*adr_Adres_kodu*/, '' /*adr_tel_ulke_kodu*/, '' /*adr_tel_bolge_kodu*/, 
            '' /*adr_tel_no1*/, '' /*adr_tel_no2*/, '' /*adr_tel_faxno*/, '' /*adr_tel_modem*/, '' /*adr_yon_kodu*/, 0 /*adr_uzaklik_kodu*/, '' /*adr_temsilci_kodu*/,
            '' /*adr_ozel_not*/, 0 /*adr_ziyaretperyodu*/, 0 /*adr_ziyaretgunu*/, 0 /*adr_gps_enlem*/, 0 /*adr_gps_boylam*/, 0 /*adr_ziyarethaftasi*/, 0 /*adr_ziygunu2_1*/, 
            0 /*adr_ziygunu2_2*/, 0 /*adr_ziygunu2_3*/, 0 /*adr_ziygunu2_4*/, 0 /*adr_ziygunu2_5*/, 0 /*adr_ziygunu2_6*/, 0 /*adr_ziygunu2_7*/,
            @CariEInvoiceAlias /*adr_efatura_alias*/, @CariEWayBillAlias /*adr_eirsaliye_alias*/
            ${adr_m17values});

            SET @CariKod=@YeniCariKod;  
          END
          
        `

      }
      query += `
        IF NOT EXISTS(SELECT * FROM CARI_HESAP_HAREKETLERI WHERE cha_Guid='${fisData.id}' ) BEGIN
        `
      let satisToplam = 0
      let vergiToplam = 0
      fisData.sales.forEach((e, rowIndex) => {
        if (e.status) {
          let netTutar = e.returnUnitPrice * e.quantity
          let tutar = netTutar / (1 + e.departmentValue / 100)
          let vergi = netTutar - tutar
          satisToplam += netTutar
          vergiToplam += vergi
          query += `
          
          SET @VergiYuzde=${e.departmentValue};
          SELECT @VergiPntr=CASE WHEN dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          WHEN dbo.fn_VergiYuzde(7)=@VergiYuzde THEN 7
          WHEN dbo.fn_VergiYuzde(8)=@VergiYuzde THEN 8
          WHEN dbo.fn_VergiYuzde(9)=@VergiYuzde THEN 9
          WHEN dbo.fn_VergiYuzde(10)=@VergiYuzde THEN 10
          WHEN dbo.fn_VergiYuzde(11)=@VergiYuzde THEN 11
          WHEN dbo.fn_VergiYuzde(12)=@VergiYuzde THEN 12
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah7=@VergiMatrah7 + CASE WHEN @VergiPntr=7 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah8=@VergiMatrah8 + CASE WHEN @VergiPntr=8 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah9=@VergiMatrah9 + CASE WHEN @VergiPntr=9 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah10=@VergiMatrah10 + CASE WHEN @VergiPntr=10 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah11=@VergiMatrah11 + CASE WHEN @VergiPntr=11 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah12=@VergiMatrah12 + CASE WHEN @VergiPntr=12 THEN ${tutar} ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi7=@Vergi7 + CASE WHEN @VergiPntr=7 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi8=@Vergi8 + CASE WHEN @VergiPntr=8 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi9=@Vergi9 + CASE WHEN @VergiPntr=9 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi10=@Vergi10 + CASE WHEN @VergiPntr=10 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi11=@Vergi11 + CASE WHEN @VergiPntr=11 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi12=@Vergi12 + CASE WHEN @VergiPntr=12 THEN ${vergi} ELSE 0 END;
          `
        }
      })
      query += `
        SELECT @EvrakSira=ISNULL(MAX(cha_evrakno_sira),0) + 1 FROM CARI_HESAP_HAREKETLERI WITH(NOLOCK)  WHERE cha_evrakno_seri=@EvrakSeri AND cha_evrak_tip=@CHA_EVRAKTIP;
      `
      query += `INSERT INTO CARI_HESAP_HAREKETLERI (cha_Guid, cha_DBCno, cha_SpecRecNo, cha_iptal, cha_fileid, cha_hidden, cha_kilitli, cha_degisti, cha_CheckSum, cha_create_user, 
            cha_create_date, cha_lastup_user, cha_lastup_date, cha_special1, cha_special2, cha_special3, cha_firmano, cha_subeno, cha_evrak_tip, cha_evrakno_seri, cha_evrakno_sira, 
            cha_satir_no, cha_tarihi, cha_tip, cha_cinsi, cha_normal_Iade, cha_tpoz, cha_ticaret_turu, cha_belge_no, cha_belge_tarih, cha_aciklama, cha_satici_kodu, cha_EXIMkodu, 
            cha_projekodu, cha_yat_tes_kodu, cha_cari_cins, cha_kod, cha_ciro_cari_kodu, cha_d_cins, cha_d_kur, cha_altd_kur, cha_grupno, cha_srmrkkodu, cha_kasa_hizmet, cha_kasa_hizkod, 
            cha_karsidcinsi, cha_karsid_kur, cha_karsidgrupno, cha_karsisrmrkkodu, cha_miktari, cha_meblag, cha_aratoplam, cha_vade, cha_Vade_Farki_Yuz, cha_ft_iskonto1, cha_ft_iskonto2, 
            cha_ft_iskonto3, cha_ft_iskonto4, cha_ft_iskonto5, cha_ft_iskonto6, cha_ft_masraf1, cha_ft_masraf2, cha_ft_masraf3, cha_ft_masraf4, cha_isk_mas1, cha_isk_mas2, cha_isk_mas3, 
            cha_isk_mas4, cha_isk_mas5, cha_isk_mas6, cha_isk_mas7, cha_isk_mas8, cha_isk_mas9, cha_isk_mas10, cha_sat_iskmas1, cha_sat_iskmas2, cha_sat_iskmas3, cha_sat_iskmas4, 
            cha_sat_iskmas5, cha_sat_iskmas6, cha_sat_iskmas7, cha_sat_iskmas8, cha_sat_iskmas9, cha_sat_iskmas10, cha_yuvarlama, cha_StFonPntr, cha_stopaj, cha_savsandesfonu, 
            cha_avansmak_damgapul, cha_vergipntr, cha_vergisiz_fl, cha_otvtutari, cha_otvvergisiz_fl, cha_oiv_pntr, cha_oivtutari, cha_oiv_vergi, cha_oivergisiz_fl, cha_fis_tarih, 
            cha_fis_sirano, cha_trefno, cha_sntck_poz, cha_reftarihi, cha_istisnakodu, cha_pos_hareketi, cha_meblag_ana_doviz_icin_gecersiz_fl, cha_meblag_alt_doviz_icin_gecersiz_fl, 
            cha_meblag_orj_doviz_icin_gecersiz_fl, cha_sip_uid, cha_kirahar_uid, cha_vardiya_tarihi, cha_vardiya_no, cha_vardiya_evrak_ti, cha_ebelge_turu, cha_tevkifat_toplam, 
            cha_e_islem_turu, cha_fatura_belge_turu, cha_diger_belge_adi, cha_uuid, cha_adres_no, cha_vergifon_toplam, cha_ilk_belge_tarihi, cha_ilk_belge_doviz_kuru, cha_HareketGrupKodu1, 
            cha_HareketGrupKodu2, cha_HareketGrupKodu3, cha_ebelgeno_seri, cha_ebelgeno_sira, cha_hubid, cha_hubglbid, cha_vergi1, cha_vergi2, cha_vergi3, cha_vergi4, cha_vergi5, cha_vergi6, 
            cha_vergi7, cha_vergi8, cha_vergi9, cha_vergi10, 
            cha_ilave_edilecek_kdv1, cha_ilave_edilecek_kdv2, cha_ilave_edilecek_kdv3, cha_ilave_edilecek_kdv4, cha_ilave_edilecek_kdv5, cha_ilave_edilecek_kdv6, cha_ilave_edilecek_kdv7, 
            cha_ilave_edilecek_kdv8, cha_ilave_edilecek_kdv9, cha_ilave_edilecek_kdv10
            ${cha_m17fields}${cha_m16fields})
            VALUES('${fisData.id}' /*cha_Guid*/, 0 /*cha_DBCno*/, 0 /*cha_SpecRecNo*/, 0 /*cha_iptal*/, 51 /*cha_fileid*/, 0 /*cha_hidden*/, 0 /*cha_kilitli*/, 0 /*cha_degisti*/,
            0 /*cha_CheckSum*/, @MikroUserNo /*cha_create_user*/, GETDATE() /*cha_create_date*/, @MikroUserNo /*cha_lastup_user*/, GETDATE() /*cha_lastup_date*/, 
            '' /*cha_special1*/, '' /*cha_special2*/, '' /*cha_special3*/, 0 /*cha_firmano*/, 0 /*cha_subeno*/, @CHA_EVRAKTIP /*cha_evrak_tip*/, @EvrakSeri /*cha_evrakno_seri*/,
            @EvrakSira /*cha_evrakno_sira*/, 0 /*cha_satir_no*/, @Tarih /*cha_tarihi*/, @CHA_TIP /*cha_tip*/, @CHA_CINS /*cha_cinsi*/, @CHA_IADE /*cha_normal_Iade*/,
            @CHA_TPOZ /*cha_tpoz*/, @CHA_TICARET_TURU /*cha_ticaret_turu*/, @BelgeNo /*cha_belge_no*/, @Tarih /*cha_belge_tarih*/, '' /*cha_aciklama*/, '' /*cha_satici_kodu*/, '' /*cha_EXIMkodu*/, 
            @ProjeKodu /*cha_projekodu*/, '' /*cha_yat_tes_kodu*/,@CHA_CARI_CINS /*cha_cari_cins*/, @KasaKod /*cha_kod*/, @CariKod /*cha_ciro_cari_kodu*/, 
        0 /*cha_d_cins*/, 1 /*cha_d_kur*/, 1 /*cha_altd_kur*/, 0 /*cha_grupno*/, @SorumlulukMerkezi /*cha_srmrkkodu*/, 0 /*cha_kasa_hizmet*/, '' /*cha_kasa_hizkod*/, 
            0 /*cha_karsidcinsi*/, 1 /*cha_karsid_kur*/, 0 /*cha_karsidgrupno*/, '' /*cha_karsisrmrkkodu*/, 0 /*cha_miktari*/, ${satisToplam} /*cha_meblag*/,
            ${satisToplam - vergiToplam} /*cha_aratoplam*/, 0 /*cha_vade*/, 0 /*cha_Vade_Farki_Yuz*/, 0 /*cha_ft_iskonto1*/, 0 /*cha_ft_iskonto2*/, 0 /*cha_ft_iskonto3*/, 0 /*cha_ft_iskonto4*/,
            0 /*cha_ft_iskonto5*/, 0 /*cha_ft_iskonto6*/, 0 /*cha_ft_masraf1*/, 0 /*cha_ft_masraf2*/, 0 /*cha_ft_masraf3*/, 0 /*cha_ft_masraf4*/, 0 /*cha_isk_mas1*/, 1 /*cha_isk_mas2*/,
            1 /*cha_isk_mas3*/, 1 /*cha_isk_mas4*/, 1 /*cha_isk_mas5*/, 1 /*cha_isk_mas6*/, 1 /*cha_isk_mas7*/, 1 /*cha_isk_mas8*/, 1 /*cha_isk_mas9*/, 1 /*cha_isk_mas10*/, 0 /*cha_sat_iskmas1*/,
            0 /*cha_sat_iskmas2*/, 0 /*cha_sat_iskmas3*/, 0 /*cha_sat_iskmas4*/, 0 /*cha_sat_iskmas5*/, 0 /*cha_sat_iskmas6*/, 0 /*cha_sat_iskmas7*/, 0 /*cha_sat_iskmas8*/, 0 /*cha_sat_iskmas9*/,
            0 /*cha_sat_iskmas10*/, 0 /*cha_yuvarlama*/, 0 /*cha_StFonPntr*/, 0 /*cha_stopaj*/, 0 /*cha_savsandesfonu*/, 0 /*cha_avansmak_damgapul*/, 0 /*cha_vergipntr*/, 0 /*cha_vergisiz_fl*/,
            0 /*cha_otvtutari*/, 0 /*cha_otvvergisiz_fl*/, 0 /*cha_oiv_pntr*/, 0 /*cha_oivtutari*/, 0 /*cha_oiv_vergi*/, 0 /*cha_oivergisiz_fl*/, '1899-12-30 00:00:00.000' /*cha_fis_tarih*/, 
            0 /*cha_fis_sirano*/, '' /*cha_trefno*/, 0 /*cha_sntck_poz*/, '1899-12-30 00:00:00.000' /*cha_reftarihi*/, 0 /*cha_istisnakodu*/, 0 /*cha_pos_hareketi*/, 
            0 /*cha_meblag_ana_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_alt_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_orj_doviz_icin_gecersiz_fl*/, '00000000-0000-0000-0000-000000000000' /*cha_sip_uid*/,
            '00000000-0000-0000-0000-000000000000' /*cha_kirahar_uid*/, '1899-12-30 00:00:00.000' /*cha_vardiya_tarihi*/, 0 /*cha_vardiya_no*/, 0 /*cha_vardiya_evrak_ti*/, ${iade ? 1 : 0} /*cha_ebelge_turu*/,
            0 /*cha_tevkifat_toplam*/, 0 /*cha_e_islem_turu*/, 0 /*cha_fatura_belge_turu*/, '' /*cha_diger_belge_adi*/, NEWID() /*cha_uuid*/, 1 /*cha_adres_no*/, 0 /*cha_vergifon_toplam*/,
            '1899-12-30 00:00:00.000' /*cha_ilk_belge_tarihi*/, 0 /*cha_ilk_belge_doviz_kuru*/, '' /*cha_HareketGrupKodu1*/, '' /*cha_HareketGrupKodu2*/, '' /*cha_HareketGrupKodu3*/, 
            '' /*cha_ebelgeno_seri*/, 0 /*cha_ebelgeno_sira*/, '' /*cha_hubid*/, '' /*cha_hubglbid*/, @Vergi1 /*cha_vergi1*/, @Vergi2 /*cha_vergi2*/, 
            @Vergi3 /*cha_vergi3*/, @Vergi4 /*cha_vergi4*/, @Vergi5 /*cha_vergi5*/, @Vergi6 /*cha_vergi6*/, @Vergi7 /*cha_vergi7*/, @Vergi8 /*cha_vergi8*/, @Vergi9 /*cha_vergi9*/, 
            @Vergi10 /*cha_vergi10*/, 0 /*cha_ilave_edilecek_kdv1*/, 0 /*cha_ilave_edilecek_kdv2*/,0 /*cha_ilave_edilecek_kdv3*/, 0 /*cha_ilave_edilecek_kdv4*/, 
            0 /*cha_ilave_edilecek_kdv5*/, 0 /*cha_ilave_edilecek_kdv6*/, 0 /*cha_ilave_edilecek_kdv7*/, 0 /*cha_ilave_edilecek_kdv8*/, 0 /*cha_ilave_edilecek_kdv9*/, 0 /*cha_ilave_edilecek_kdv10*/
            ${cha_m17values}${cha_m16values});

      `
      fisData.sales.forEach((e, rowIndex) => {
        if (e.status) {
          let netTutar = e.returnUnitPrice * e.quantity
          let tutar = netTutar / (1 + e.departmentValue / 100)
          let vergi = netTutar - tutar
          query += `

          SET @VergiYuzde=${e.departmentValue};
          SELECT @VergiPntr=CASE WHEN dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          WHEN dbo.fn_VergiYuzde(7)=@VergiYuzde THEN 7
          WHEN dbo.fn_VergiYuzde(8)=@VergiYuzde THEN 8
          WHEN dbo.fn_VergiYuzde(9)=@VergiYuzde THEN 9
          WHEN dbo.fn_VergiYuzde(10)=@VergiYuzde THEN 10
          WHEN dbo.fn_VergiYuzde(11)=@VergiYuzde THEN 11
          WHEN dbo.fn_VergiYuzde(12)=@VergiYuzde THEN 12
          ELSE 0 END;

          INSERT INTO STOK_HAREKETLERI (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, 
          sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, 
          sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, 
          sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, 
          sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, 
          sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, 
          sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, 
          sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, 
          sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, 
          sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, 
          sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, 
          sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, 
          sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru
           ${sth_m17fields})
          VALUES (NEWID() /*sth_Guid*/, 0 /*sth_DBCno*/, 0 /*sth_SpecRECno*/, 0 /*sth_iptal*/, 16 /*sth_fileid*/, 0 /*sth_hidden*/, 0 /*sth_kilitli*/, 0 /*sth_degisti*/, 0 /*sth_checksum*/, 
          @MikroUserNo /*sth_create_user*/, GETDATE() /*sth_create_date*/, @MikroUserNo /*sth_lastup_user*/, GETDATE() /*sth_lastup_date*/, '' /*sth_special1*/, '' /*sth_special2*/, 
          '' /*sth_special3*/, 0 /*sth_firmano*/, 0 /*sth_subeno*/, @Tarih /*sth_tarih*/, @STH_TIP /*sth_tip*/, @STH_CINS /*sth_cins*/, @STH_IADE /*sth_normal_iade*/, @STH_EVRAKTIP /*sth_evraktip*/, 
          @EvrakSeri /*sth_evrakno_seri*/, @EvrakSira /*sth_evrakno_sira*/, @SatirNo /*sth_satirno*/, @BelgeNo /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '${e.stockCode}' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 1 /*sth_isk_mas2*/, 1 /*sth_isk_mas3*/, 1 /*sth_isk_mas4*/, 1 /*sth_isk_mas5*/, 1 /*sth_isk_mas6*/, 
          1 /*sth_isk_mas7*/, 1 /*sth_isk_mas8*/, 1 /*sth_isk_mas9*/, 1 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/, 0 /*sth_sat_iskmas4*/, 
          0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/, 0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/,
          0 /*sth_cari_cinsi*/, @CariKod /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 
          0 /*sth_har_doviz_cinsi*/, 1 /*sth_har_doviz_kuru*/, 1 /*sth_alt_doviz_kuru*/, 0 /*sth_stok_doviz_cinsi*/, 1 /*sth_stok_doviz_kuru*/, 
          ${e.quantity} /*sth_miktar*/,  ${e.quantity} /*sth_miktar2*/, 1 /*sth_birim_pntr*/, ${tutar} /*sth_tutar*/, 
          0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 
          0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, ${vergi} /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 
          0 /*sth_odeme_op*/, '${e.barcode}' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '${fisData.id}' /*sth_fat_uid*/,
          @GirisDepoNo /*sth_giris_depo_no*/, @CikisDepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, 
          @SorumlulukMerkezi /*sth_cari_srm_merkezi*/, @SorumlulukMerkezi /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 1 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, @ProjeKodu /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 
          0 /*sth_otv_vergi*/, 0 /*sth_brutagirlik*/, @STH_DISTICARET_TURU /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 0 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, 
          '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, 
          '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 
          0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, @Tarih /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          1 /*sth_satis_fiyat_doviz_kuru*/
          ${sth_m17values});

          SET @SatirNo=@SatirNo+1;
          
        `
        }
      })
      let odemeToplam = 0
      let nakitToplam = 0
      let krediToplam = 0
      let digerToplam = 0
      fisData.payments.forEach(e => {
        if (e.status) {
          if (e.change == false) {
            odemeToplam += e.amount
          } else {
            odemeToplam -= e.amount
          }
          if (e.type == 1) {
            if (e.change == false) {
              nakitToplam += e.amount
            } else {
              nakitToplam -= e.amount
            }
          } else if (e.type == 2) {
            krediToplam += e.amount
          } else {
            digerToplam += e.amount
          }
        }
      })
      if (krediToplam > 0 || digerToplam > 0) {
        query += posHasilatDagilimDekontu(mainApp, krediToplam + digerToplam, fisData)
      }
      query += `END`

      process.env.NODE_ENV == 'development' && fs.writeFileSync(path.join(__dirname, 'logs', 'mikro16_satisAktar.sql'), query, 'utf8')
      executeSqlDb(orgDoc, storeDoc.db, query)
        .then(resolve)
        .catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}

function posHasilatDagilimDekontu(mainApp, tutar, fisData) {
  let cha_m16fields = ''
  let cha_m16values = ''
  let cha_m17fields = ''
  let cha_m17values = ''
  if (mainApp == 'mikro17') {
    cha_m17fields = `, cha_MainProgramNo, cha_VersionNo, cha_MenuNo, cha_MikroSpecial1, cha_MikroSpecial2, cha_MikroSpecial3, cha_ExternalProgramType, cha_ExternalProgramId, cha_Hash
        , cha_efatura_belge_tipi
        , cha_vergi11, cha_vergi12, cha_vergi13, cha_vergi14, cha_vergi15, cha_vergi16, cha_vergi17, cha_vergi18, cha_vergi19, cha_vergi20
        , cha_ilave_edilecek_kdv11, cha_ilave_edilecek_kdv12, cha_ilave_edilecek_kdv13, cha_ilave_edilecek_kdv14, 
            cha_ilave_edilecek_kdv15, cha_ilave_edilecek_kdv16, cha_ilave_edilecek_kdv17, cha_ilave_edilecek_kdv18, cha_ilave_edilecek_kdv19, cha_ilave_edilecek_kdv20
        , cha_tevkifat_sifirlandi_fl, cha_bsba_e_belge_mi, 
              cha_eticaret_kanal_kodu, cha_hizli_satis_kasa_no, cha_ebelge_Islemturu`
    cha_m17values = `, 21 /*cha_MainProgramNo*/, @MikroVersionNo /*cha_VersionNo*/, 61270 /*cha_MenuNo*/, '' /*cha_MikroSpecial1*/, '' /*cha_MikroSpecial2*/, '' /*cha_MikroSpecial3*/, 
          0 /*cha_ExternalProgramType*/, '${fisData.id}' /*cha_ExternalProgramId*/, 0 /*cha_Hash*/
        , 0 /*cha_efatura_belge_tipi*/
        , @Vergi11 /*cha_vergi11*/, @Vergi12 /*cha_vergi12*/, 0 /*cha_vergi13*/, 0 /*cha_vergi14*/, 0 /*cha_vergi15*/, 0 /*cha_vergi16*/, 0 /*cha_vergi17*/, 
        0 /*cha_vergi18*/, 0 /*cha_vergi19*/, 0 /*cha_vergi20*/
        , 0 /*cha_ilave_edilecek_kdv11*/, 0 /*cha_ilave_edilecek_kdv12*/, 0 /*cha_ilave_edilecek_kdv13*/, 0 /*cha_ilave_edilecek_kdv14*/, 0 /*cha_ilave_edilecek_kdv15*/, 0 /*cha_ilave_edilecek_kdv16*/, 
            0 /*cha_ilave_edilecek_kdv17*/, 0 /*cha_ilave_edilecek_kdv18*/, 0 /*cha_ilave_edilecek_kdv19*/, 0 /*cha_ilave_edilecek_kdv20*/
        , 0 /*cha_tevkifat_sifirlandi_fl*/, 0 /*cha_bsba_e_belge_mi*/, 
            '' /*cha_eticaret_kanal_kodu*/, 0 /*cha_hizli_satis_kasa_no*/, 0 /*cha_ebelge_Islemturu*/`
  } else if (mainApp == 'mikro16') {
    cha_m16fields = `, cha_disyazilimid ` //, cha_disyazilim_tip`
    cha_m16values = `, '${fisData.id}' /*cha_disyazilimid*/` //, 0 /*cha_disyazilim_tip*/`
  }
  let q = `-- POS HASILAT DAGILIM DEKONTU ---
          IF NOT EXISTS(SELECT * FROM CARI_HESAP_HAREKETLERI WHERE cha_evrak_tip=60 AND cha_evrakno_seri=@EvrakSeri and cha_evrakno_sira=@EvrakSira ) BEGIN
            INSERT INTO CARI_HESAP_HAREKETLERI (cha_Guid, cha_DBCno, cha_SpecRecNo, cha_iptal, cha_fileid, cha_hidden, cha_kilitli, cha_degisti, cha_CheckSum, cha_create_user, 
              cha_create_date, cha_lastup_user, cha_lastup_date, cha_special1, cha_special2, cha_special3, cha_firmano, cha_subeno, cha_evrak_tip, cha_evrakno_seri, cha_evrakno_sira, 
              cha_satir_no, cha_tarihi, cha_tip, cha_cinsi, cha_normal_Iade, cha_tpoz, cha_ticaret_turu, cha_belge_no, cha_belge_tarih, cha_aciklama, cha_satici_kodu, cha_EXIMkodu, 
              cha_projekodu, cha_yat_tes_kodu, cha_cari_cins, cha_kod, cha_ciro_cari_kodu, cha_d_cins, cha_d_kur, cha_altd_kur, cha_grupno, cha_srmrkkodu, cha_kasa_hizmet, cha_kasa_hizkod, 
              cha_karsidcinsi, cha_karsid_kur, cha_karsidgrupno, cha_karsisrmrkkodu, cha_miktari, cha_meblag, cha_aratoplam, cha_vade, cha_Vade_Farki_Yuz, cha_ft_iskonto1, cha_ft_iskonto2, 
              cha_ft_iskonto3, cha_ft_iskonto4, cha_ft_iskonto5, cha_ft_iskonto6, cha_ft_masraf1, cha_ft_masraf2, cha_ft_masraf3, cha_ft_masraf4, cha_isk_mas1, cha_isk_mas2, cha_isk_mas3, 
              cha_isk_mas4, cha_isk_mas5, cha_isk_mas6, cha_isk_mas7, cha_isk_mas8, cha_isk_mas9, cha_isk_mas10, cha_sat_iskmas1, cha_sat_iskmas2, cha_sat_iskmas3, cha_sat_iskmas4, 
              cha_sat_iskmas5, cha_sat_iskmas6, cha_sat_iskmas7, cha_sat_iskmas8, cha_sat_iskmas9, cha_sat_iskmas10, cha_yuvarlama, cha_StFonPntr, cha_stopaj, cha_savsandesfonu, 
              cha_avansmak_damgapul, cha_vergipntr, cha_vergisiz_fl, cha_otvtutari, cha_otvvergisiz_fl, cha_oiv_pntr, cha_oivtutari, cha_oiv_vergi, cha_oivergisiz_fl, cha_fis_tarih, 
              cha_fis_sirano, cha_trefno, cha_sntck_poz, cha_reftarihi, cha_istisnakodu, cha_pos_hareketi, cha_meblag_ana_doviz_icin_gecersiz_fl, cha_meblag_alt_doviz_icin_gecersiz_fl, 
              cha_meblag_orj_doviz_icin_gecersiz_fl, cha_sip_uid, cha_kirahar_uid, cha_vardiya_tarihi, cha_vardiya_no, cha_vardiya_evrak_ti, cha_ebelge_turu, cha_tevkifat_toplam, 
              cha_e_islem_turu, cha_fatura_belge_turu, cha_diger_belge_adi, cha_uuid, cha_adres_no, cha_vergifon_toplam, cha_ilk_belge_tarihi, cha_ilk_belge_doviz_kuru, cha_HareketGrupKodu1, 
              cha_HareketGrupKodu2, cha_HareketGrupKodu3, cha_ebelgeno_seri, cha_ebelgeno_sira, cha_hubid, cha_hubglbid, cha_vergi1, cha_vergi2, cha_vergi3, cha_vergi4, cha_vergi5, cha_vergi6, 
              cha_vergi7, cha_vergi8, cha_vergi9, cha_vergi10, 
              cha_ilave_edilecek_kdv1, cha_ilave_edilecek_kdv2, cha_ilave_edilecek_kdv3, cha_ilave_edilecek_kdv4, cha_ilave_edilecek_kdv5, cha_ilave_edilecek_kdv6, cha_ilave_edilecek_kdv7, 
              cha_ilave_edilecek_kdv8, cha_ilave_edilecek_kdv9, cha_ilave_edilecek_kdv10
              ${cha_m17fields}${cha_m16fields})
              VALUES(NEWID() /*cha_Guid*/, 0 /*cha_DBCno*/, 0 /*cha_SpecRecNo*/, 0 /*cha_iptal*/, 51 /*cha_fileid*/, 0 /*cha_hidden*/, 0 /*cha_kilitli*/, 0 /*cha_degisti*/,
              0 /*cha_CheckSum*/, @MikroUserNo /*cha_create_user*/, GETDATE() /*cha_create_date*/, @MikroUserNo /*cha_lastup_user*/, GETDATE() /*cha_lastup_date*/, 
              '' /*cha_special1*/, '' /*cha_special2*/, '' /*cha_special3*/, 0 /*cha_firmano*/, 0 /*cha_subeno*/, 60 /*cha_evrak_tip*/, @EvrakSeri /*cha_evrakno_seri*/,
              @EvrakSira /*cha_evrakno_sira*/, 0 /*cha_satir_no*/, @Tarih /*cha_tarihi*/, 1 /*cha_tip*/, 5 /*cha_cinsi*/, 0 /*cha_normal_Iade*/,
              0 /*cha_tpoz*/, 0 /*cha_ticaret_turu*/, @BelgeNo /*cha_belge_no*/, @Tarih /*cha_belge_tarih*/, '' /*cha_aciklama*/, '' /*cha_satici_kodu*/, '' /*cha_EXIMkodu*/, 
              @ProjeKodu /*cha_projekodu*/, '' /*cha_yat_tes_kodu*/,4 /*cha_cari_cins*/, @KasaKod /*cha_kod*/, '' /*cha_ciro_cari_kodu*/, 
          0 /*cha_d_cins*/, 1 /*cha_d_kur*/, 1 /*cha_altd_kur*/, 0 /*cha_grupno*/, @SorumlulukMerkezi /*cha_srmrkkodu*/, 0 /*cha_kasa_hizmet*/, '' /*cha_kasa_hizkod*/, 
              0 /*cha_karsidcinsi*/, 1 /*cha_karsid_kur*/, 0 /*cha_karsidgrupno*/, '' /*cha_karsisrmrkkodu*/, 0 /*cha_miktari*/, ${tutar} /*cha_meblag*/,
              0 /*cha_aratoplam*/, 0 /*cha_vade*/, 0 /*cha_Vade_Farki_Yuz*/, 0 /*cha_ft_iskonto1*/, 0 /*cha_ft_iskonto2*/, 0 /*cha_ft_iskonto3*/, 0 /*cha_ft_iskonto4*/,
              0 /*cha_ft_iskonto5*/, 0 /*cha_ft_iskonto6*/, 0 /*cha_ft_masraf1*/, 0 /*cha_ft_masraf2*/, 0 /*cha_ft_masraf3*/, 0 /*cha_ft_masraf4*/, 0 /*cha_isk_mas1*/, 1 /*cha_isk_mas2*/,
              1 /*cha_isk_mas3*/, 1 /*cha_isk_mas4*/, 1 /*cha_isk_mas5*/, 1 /*cha_isk_mas6*/, 1 /*cha_isk_mas7*/, 1 /*cha_isk_mas8*/, 1 /*cha_isk_mas9*/, 1 /*cha_isk_mas10*/, 0 /*cha_sat_iskmas1*/,
              0 /*cha_sat_iskmas2*/, 0 /*cha_sat_iskmas3*/, 0 /*cha_sat_iskmas4*/, 0 /*cha_sat_iskmas5*/, 0 /*cha_sat_iskmas6*/, 0 /*cha_sat_iskmas7*/, 0 /*cha_sat_iskmas8*/, 0 /*cha_sat_iskmas9*/,
              0 /*cha_sat_iskmas10*/, 0 /*cha_yuvarlama*/, 0 /*cha_StFonPntr*/, 0 /*cha_stopaj*/, 0 /*cha_savsandesfonu*/, 0 /*cha_avansmak_damgapul*/, 0 /*cha_vergipntr*/, 0 /*cha_vergisiz_fl*/,
              0 /*cha_otvtutari*/, 0 /*cha_otvvergisiz_fl*/, 0 /*cha_oiv_pntr*/, 0 /*cha_oivtutari*/, 0 /*cha_oiv_vergi*/, 0 /*cha_oivergisiz_fl*/, '1899-12-30 00:00:00.000' /*cha_fis_tarih*/, 
              0 /*cha_fis_sirano*/, '' /*cha_trefno*/, 0 /*cha_sntck_poz*/, '1899-12-30 00:00:00.000' /*cha_reftarihi*/, 0 /*cha_istisnakodu*/, 0 /*cha_pos_hareketi*/, 
              0 /*cha_meblag_ana_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_alt_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_orj_doviz_icin_gecersiz_fl*/, '00000000-0000-0000-0000-000000000000' /*cha_sip_uid*/,
              '00000000-0000-0000-0000-000000000000' /*cha_kirahar_uid*/, '1899-12-30 00:00:00.000' /*cha_vardiya_tarihi*/, 0 /*cha_vardiya_no*/, 0 /*cha_vardiya_evrak_ti*/, 0 /*cha_ebelge_turu*/,
              0 /*cha_tevkifat_toplam*/, 0 /*cha_e_islem_turu*/, 3 /*cha_fatura_belge_turu*/, 'Z Raporu' /*cha_diger_belge_adi*/, '' /*cha_uuid*/, 0 /*cha_adres_no*/, 0 /*cha_vergifon_toplam*/,
              '1899-12-30 00:00:00.000' /*cha_ilk_belge_tarihi*/, 0 /*cha_ilk_belge_doviz_kuru*/, '' /*cha_HareketGrupKodu1*/, '' /*cha_HareketGrupKodu2*/, '' /*cha_HareketGrupKodu3*/, 
              '' /*cha_ebelgeno_seri*/, 0 /*cha_ebelgeno_sira*/, '' /*cha_hubid*/, '' /*cha_hubglbid*/, 0 /*cha_vergi1*/, 0 /*cha_vergi2*/, 
              0 /*cha_vergi3*/, 0 /*cha_vergi4*/, 0 /*cha_vergi5*/, 0 /*cha_vergi6*/, 0 /*cha_vergi7*/, 0 /*cha_vergi8*/, 0 /*cha_vergi9*/, 
              0 /*cha_vergi10*/, 0 /*cha_ilave_edilecek_kdv1*/, 0 /*cha_ilave_edilecek_kdv2*/,0 /*cha_ilave_edilecek_kdv3*/, 0 /*cha_ilave_edilecek_kdv4*/, 
              0 /*cha_ilave_edilecek_kdv5*/, 0 /*cha_ilave_edilecek_kdv6*/, 0 /*cha_ilave_edilecek_kdv7*/, 0 /*cha_ilave_edilecek_kdv8*/, 0 /*cha_ilave_edilecek_kdv9*/, 0 /*cha_ilave_edilecek_kdv10*/
              ${cha_m17values}${cha_m16values});

            INSERT INTO CARI_HESAP_HAREKETLERI (cha_Guid, cha_DBCno, cha_SpecRecNo, cha_iptal, cha_fileid, cha_hidden, cha_kilitli, cha_degisti, cha_CheckSum, cha_create_user, 
              cha_create_date, cha_lastup_user, cha_lastup_date, cha_special1, cha_special2, cha_special3, cha_firmano, cha_subeno, cha_evrak_tip, cha_evrakno_seri, cha_evrakno_sira, 
              cha_satir_no, cha_tarihi, cha_tip, cha_cinsi, cha_normal_Iade, cha_tpoz, cha_ticaret_turu, cha_belge_no, cha_belge_tarih, cha_aciklama, cha_satici_kodu, cha_EXIMkodu, 
              cha_projekodu, cha_yat_tes_kodu, cha_cari_cins, cha_kod, cha_ciro_cari_kodu, cha_d_cins, cha_d_kur, cha_altd_kur, cha_grupno, cha_srmrkkodu, cha_kasa_hizmet, cha_kasa_hizkod, 
              cha_karsidcinsi, cha_karsid_kur, cha_karsidgrupno, cha_karsisrmrkkodu, cha_miktari, cha_meblag, cha_aratoplam, cha_vade, cha_Vade_Farki_Yuz, cha_ft_iskonto1, cha_ft_iskonto2, 
              cha_ft_iskonto3, cha_ft_iskonto4, cha_ft_iskonto5, cha_ft_iskonto6, cha_ft_masraf1, cha_ft_masraf2, cha_ft_masraf3, cha_ft_masraf4, cha_isk_mas1, cha_isk_mas2, cha_isk_mas3, 
              cha_isk_mas4, cha_isk_mas5, cha_isk_mas6, cha_isk_mas7, cha_isk_mas8, cha_isk_mas9, cha_isk_mas10, cha_sat_iskmas1, cha_sat_iskmas2, cha_sat_iskmas3, cha_sat_iskmas4, 
              cha_sat_iskmas5, cha_sat_iskmas6, cha_sat_iskmas7, cha_sat_iskmas8, cha_sat_iskmas9, cha_sat_iskmas10, cha_yuvarlama, cha_StFonPntr, cha_stopaj, cha_savsandesfonu, 
              cha_avansmak_damgapul, cha_vergipntr, cha_vergisiz_fl, cha_otvtutari, cha_otvvergisiz_fl, cha_oiv_pntr, cha_oivtutari, cha_oiv_vergi, cha_oivergisiz_fl, cha_fis_tarih, 
              cha_fis_sirano, cha_trefno, cha_sntck_poz, cha_reftarihi, cha_istisnakodu, cha_pos_hareketi, cha_meblag_ana_doviz_icin_gecersiz_fl, cha_meblag_alt_doviz_icin_gecersiz_fl, 
              cha_meblag_orj_doviz_icin_gecersiz_fl, cha_sip_uid, cha_kirahar_uid, cha_vardiya_tarihi, cha_vardiya_no, cha_vardiya_evrak_ti, cha_ebelge_turu, cha_tevkifat_toplam, 
              cha_e_islem_turu, cha_fatura_belge_turu, cha_diger_belge_adi, cha_uuid, cha_adres_no, cha_vergifon_toplam, cha_ilk_belge_tarihi, cha_ilk_belge_doviz_kuru, cha_HareketGrupKodu1, 
              cha_HareketGrupKodu2, cha_HareketGrupKodu3, cha_ebelgeno_seri, cha_ebelgeno_sira, cha_hubid, cha_hubglbid, cha_vergi1, cha_vergi2, cha_vergi3, cha_vergi4, cha_vergi5, cha_vergi6, 
              cha_vergi7, cha_vergi8, cha_vergi9, cha_vergi10, 
              cha_ilave_edilecek_kdv1, cha_ilave_edilecek_kdv2, cha_ilave_edilecek_kdv3, cha_ilave_edilecek_kdv4, cha_ilave_edilecek_kdv5, cha_ilave_edilecek_kdv6, cha_ilave_edilecek_kdv7, 
              cha_ilave_edilecek_kdv8, cha_ilave_edilecek_kdv9, cha_ilave_edilecek_kdv10
              ${cha_m17fields}${cha_m16fields})
              VALUES(NEWID() /*cha_Guid*/, 0 /*cha_DBCno*/, 0 /*cha_SpecRecNo*/, 0 /*cha_iptal*/, 51 /*cha_fileid*/, 0 /*cha_hidden*/, 0 /*cha_kilitli*/, 0 /*cha_degisti*/,
              0 /*cha_CheckSum*/, @MikroUserNo /*cha_create_user*/, GETDATE() /*cha_create_date*/, @MikroUserNo /*cha_lastup_user*/, GETDATE() /*cha_lastup_date*/, 
              '' /*cha_special1*/, '' /*cha_special2*/, '' /*cha_special3*/, 0 /*cha_firmano*/, 0 /*cha_subeno*/, 60 /*cha_evrak_tip*/, @EvrakSeri /*cha_evrakno_seri*/,
              @EvrakSira /*cha_evrakno_sira*/, 1 /*cha_satir_no*/, @Tarih /*cha_tarihi*/, 0 /*cha_tip*/, 5 /*cha_cinsi*/, 0 /*cha_normal_Iade*/,
              0 /*cha_tpoz*/, 0 /*cha_ticaret_turu*/, @BelgeNo /*cha_belge_no*/, @Tarih /*cha_belge_tarih*/, '' /*cha_aciklama*/, '' /*cha_satici_kodu*/, '' /*cha_EXIMkodu*/, 
              @ProjeKodu /*cha_projekodu*/, '' /*cha_yat_tes_kodu*/,2 /*cha_cari_cins*/, @BankaKod /*cha_kod*/, '' /*cha_ciro_cari_kodu*/, 
          0 /*cha_d_cins*/, 1 /*cha_d_kur*/, 1 /*cha_altd_kur*/, 0 /*cha_grupno*/, @SorumlulukMerkezi /*cha_srmrkkodu*/, 0 /*cha_kasa_hizmet*/, '' /*cha_kasa_hizkod*/, 
              0 /*cha_karsidcinsi*/, 1 /*cha_karsid_kur*/, 0 /*cha_karsidgrupno*/, '' /*cha_karsisrmrkkodu*/, 0 /*cha_miktari*/, ${tutar} /*cha_meblag*/,
              0 /*cha_aratoplam*/, 0 /*cha_vade*/, 0 /*cha_Vade_Farki_Yuz*/, 0 /*cha_ft_iskonto1*/, 0 /*cha_ft_iskonto2*/, 0 /*cha_ft_iskonto3*/, 0 /*cha_ft_iskonto4*/,
              0 /*cha_ft_iskonto5*/, 0 /*cha_ft_iskonto6*/, 0 /*cha_ft_masraf1*/, 0 /*cha_ft_masraf2*/, 0 /*cha_ft_masraf3*/, 0 /*cha_ft_masraf4*/, 0 /*cha_isk_mas1*/, 1 /*cha_isk_mas2*/,
              1 /*cha_isk_mas3*/, 1 /*cha_isk_mas4*/, 1 /*cha_isk_mas5*/, 1 /*cha_isk_mas6*/, 1 /*cha_isk_mas7*/, 1 /*cha_isk_mas8*/, 1 /*cha_isk_mas9*/, 1 /*cha_isk_mas10*/, 0 /*cha_sat_iskmas1*/,
              0 /*cha_sat_iskmas2*/, 0 /*cha_sat_iskmas3*/, 0 /*cha_sat_iskmas4*/, 0 /*cha_sat_iskmas5*/, 0 /*cha_sat_iskmas6*/, 0 /*cha_sat_iskmas7*/, 0 /*cha_sat_iskmas8*/, 0 /*cha_sat_iskmas9*/,
              0 /*cha_sat_iskmas10*/, 0 /*cha_yuvarlama*/, 0 /*cha_StFonPntr*/, 0 /*cha_stopaj*/, 0 /*cha_savsandesfonu*/, 0 /*cha_avansmak_damgapul*/, 0 /*cha_vergipntr*/, 0 /*cha_vergisiz_fl*/,
              0 /*cha_otvtutari*/, 0 /*cha_otvvergisiz_fl*/, 0 /*cha_oiv_pntr*/, 0 /*cha_oivtutari*/, 0 /*cha_oiv_vergi*/, 0 /*cha_oivergisiz_fl*/, '1899-12-30 00:00:00.000' /*cha_fis_tarih*/, 
              0 /*cha_fis_sirano*/, '' /*cha_trefno*/, 0 /*cha_sntck_poz*/, '1899-12-30 00:00:00.000' /*cha_reftarihi*/, 0 /*cha_istisnakodu*/, 0 /*cha_pos_hareketi*/, 
              0 /*cha_meblag_ana_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_alt_doviz_icin_gecersiz_fl*/, 0 /*cha_meblag_orj_doviz_icin_gecersiz_fl*/, '00000000-0000-0000-0000-000000000000' /*cha_sip_uid*/,
              '00000000-0000-0000-0000-000000000000' /*cha_kirahar_uid*/, '1899-12-30 00:00:00.000' /*cha_vardiya_tarihi*/, 0 /*cha_vardiya_no*/, 0 /*cha_vardiya_evrak_ti*/,0 /*cha_ebelge_turu*/,
              0 /*cha_tevkifat_toplam*/, 0 /*cha_e_islem_turu*/, 3 /*cha_fatura_belge_turu*/, 'Z Raporu' /*cha_diger_belge_adi*/, '' /*cha_uuid*/, 0 /*cha_adres_no*/, 0 /*cha_vergifon_toplam*/,
              '1899-12-30 00:00:00.000' /*cha_ilk_belge_tarihi*/, 0 /*cha_ilk_belge_doviz_kuru*/, '' /*cha_HareketGrupKodu1*/, '' /*cha_HareketGrupKodu2*/, '' /*cha_HareketGrupKodu3*/, 
              '' /*cha_ebelgeno_seri*/, 0 /*cha_ebelgeno_sira*/, '' /*cha_hubid*/, '' /*cha_hubglbid*/, 0 /*cha_vergi1*/, 0 /*cha_vergi2*/, 
              0 /*cha_vergi3*/, 0 /*cha_vergi4*/, 0 /*cha_vergi5*/, 0 /*cha_vergi6*/, 0 /*cha_vergi7*/, 0 /*cha_vergi8*/, 0 /*cha_vergi9*/, 
              0 /*cha_vergi10*/, 0 /*cha_ilave_edilecek_kdv1*/, 0 /*cha_ilave_edilecek_kdv2*/,0 /*cha_ilave_edilecek_kdv3*/, 0 /*cha_ilave_edilecek_kdv4*/, 
              0 /*cha_ilave_edilecek_kdv5*/, 0 /*cha_ilave_edilecek_kdv6*/, 0 /*cha_ilave_edilecek_kdv7*/, 0 /*cha_ilave_edilecek_kdv8*/, 0 /*cha_ilave_edilecek_kdv9*/, 0 /*cha_ilave_edilecek_kdv10*/
              ${cha_m17values}${cha_m16values});
          END
        `
  return q
}
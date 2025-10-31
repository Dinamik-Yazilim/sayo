const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Config dosyasını oku
const configPath = path.join(__dirname, 'db-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function connectAndQuery() {
  try {
    console.log('Connecting to SQL Server...');
    console.log(`Server: ${config.server}`);
    console.log(`Database: ${config.database}`);

    // SQL Server'a bağlan
    await sql.connect(config);
    console.log('Connected successfully!\n');

    // DEPOLAR tablosunu sorgula
    console.log('Querying DEPOLAR table...\n');
    const result = await sql.query`SELECT TOP 10 * FROM DEPOLAR WHERE dep_iptal = 0`;

    console.log(`Found ${result.recordset.length} records:\n`);
    console.log('='.repeat(100));

    // Her kaydı göster
    result.recordset.forEach((record, index) => {
      console.log(`\n[Record ${index + 1}]`);
      console.log('-'.repeat(100));

      // Sadece önemli alanları göster
      console.log(`Depo Kodu: ${record.dep_no}`);
      console.log(`Depo Adı: ${record.dep_adi}`);
      console.log(`Depo Tipi: ${record.dep_tipi}`);
      console.log(`Şube Kodu: ${record.dep_sube_kodu}`);
      console.log(`Proje Kodu: ${record.dep_proje_kodu}`);
      console.log(`Sorumluluk Merkezi: ${record.dep_sorumluluk_merkezi_kodu}`);
      console.log(`Adres: ${record.dep_adresi || 'Tanımsız'}`);
      console.log(`İl: ${record.dep_ili || 'Tanımsız'}`);
      console.log(`İlçe: ${record.dep_ilcesi || 'Tanımsız'}`);
      console.log(`Telefon: ${record.dep_telefon1 || 'Tanımsız'}`);
      console.log(`Yetkili: ${record.dep_yetkili || 'Tanımsız'}`);

      // Tüm alanlar
      console.log('\nTüm Alanlar:');
      Object.keys(record).forEach(key => {
        const value = record[key];
        if (value !== null && value !== '' && value !== 0 && value !== false) {
          console.log(`  ${key}: ${value}`);
        }
      });
    });

    console.log('\n' + '='.repeat(100));

    // Tablo yapısını göster
    console.log('\n\nTable Structure (Columns):');
    console.log('='.repeat(100));
    const columns = await sql.query`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'DEPOLAR'
      ORDER BY ORDINAL_POSITION
    `;

    columns.recordset.forEach((col, index) => {
      const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
      const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`${(index + 1).toString().padStart(3)}. ${col.COLUMN_NAME.padEnd(40)} ${(col.DATA_TYPE + length).padEnd(20)} ${nullable}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err);
  } finally {
    await sql.close();
    console.log('\n\nConnection closed.');
  }
}

connectAndQuery();

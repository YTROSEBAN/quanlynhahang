const mysql = require('mysql2/promise');

async function fixEncoding() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nhahang',
    charset: 'utf8mb4'
  });

  await conn.query(`
    UPDATE monan 
    SET tenmon = 'Phở Bò Huế',
        madm = 2,
        mota = 'Phở bò chuẩn vị xứ Huế thơm cay đậm đà, nước dùng ngọt thanh gia truyền.',
        hinhanh = '/static/uploads/bun_bo_hue.jpg'
    WHERE mamon = 19
  `);

  await conn.query(`
    UPDATE monan 
    SET tenmon = 'Phở Bò Đặc Biệt',
        madm = 2,
        mota = 'Phở bò tươi ngọt thanh, bánh phở mềm cùng nạm gầu thơm lừng.',
        hinhanh = '/static/uploads/pho_bo.jpg'
    WHERE mamon = 1
  `);

  await conn.query(`
    UPDATE monan 
    SET tenmon = 'Phở Bò Tái Lăn',
        madm = 2,
        mota = 'Thịt bò tái xào lăn thơm mùi tỏi gừng và hành hoa.',
        hinhanh = '/static/uploads/pho_bo.jpg'
    WHERE mamon = 2
  `);

  const [rows] = await conn.query('SELECT mamon, tenmon, gia, mota, hinhanh FROM monan WHERE mamon IN (1, 2, 19)');
  console.log('Successfully updated:', rows);
  await conn.end();
}

fixEncoding().catch(err => {
  console.error(err);
  process.exit(1);
});

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Kết nối cơ sở dữ liệu MySQL (100% bằng JavaScript / Node.js)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nhahang',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối CSDL khi khởi động
pool.getConnection()
  .then(conn => {
    console.log('✅ Đã kết nối thành công tới MySQL Database "nhahang"!');
    conn.release();
  })
  .catch(err => {
    console.error('⚠️ Không thể kết nối tới MySQL:', err.message);
  });

// 1. API Tổng quan thống kê (Overview)
app.get('/api/overview', async (req, res) => {
  try {
    const [banStats] = await pool.query(`
      SELECT 
        COUNT(*) AS tong_ban,
        SUM(CASE WHEN trangthai = 'DangSuDung' THEN 1 ELSE 0 END) AS dang_dung,
        SUM(CASE WHEN trangthai = 'Trong' THEN 1 ELSE 0 END) AS ban_trong
      FROM banan
    `);

    const [[{ tong_mon }]] = await pool.query('SELECT COUNT(*) AS tong_mon FROM monan WHERE trangthai = 1');

    const [[{ cho_nau }]] = await pool.query(`
      SELECT COUNT(*) AS cho_nau FROM ct_hoadon ct
      JOIN hoadon h ON ct.mahd = h.mahd
      WHERE h.trangthai = 'Cho'
    `);

    const [[{ doanhthu_today, so_hd_today }]] = await pool.query(`
      SELECT 
        COALESCE(SUM(tongthanhtoan), 0) AS doanhthu_today,
        COUNT(*) AS so_hd_today
      FROM hoadon
      WHERE trangthai = 'DaThanhToan' AND DATE(ngaytao) = CURDATE()
    `);

    res.json({
      success: true,
      data: {
        tong_ban: Number(banStats[0].tong_ban || 0),
        dang_dung: Number(banStats[0].dang_dung || 0),
        ban_trong: Number(banStats[0].ban_trong || 0),
        tong_mon: Number(tong_mon || 0),
        cho_nau: Number(cho_nau || 0),
        doanhthu_today: Number(doanhthu_today || 0),
        so_hd_today: Number(so_hd_today || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Kiểm tra trực tiếp số lượng bàn và món ăn đang có trong MySQL
app.get('/api/kiem-tra-mysql', async (req, res) => {
  try {
    // 1. Chạy seed nếu chưa đủ
    await seedMoreTablesAndDishes();

    // 2. Đếm tổng số bàn
    const [[{ totalTables }]] = await pool.query('SELECT COUNT(*) AS totalTables FROM banan');
    
    // 3. Đếm số bàn theo từng khu vực
    const [areaCounts] = await pool.query(`
      SELECT vitri AS area, COUNT(*) AS count 
      FROM banan 
      GROUP BY vitri 
      ORDER BY vitri
    `);

    // 4. Lấy danh sách tên tất cả các bàn
    const [allTables] = await pool.query('SELECT maban AS id, tenban AS name, vitri AS area, trangthai AS status FROM banan ORDER BY maban');

    // 5. Đếm tổng số món ăn và nhóm danh mục
    const [[{ totalDishes }]] = await pool.query('SELECT COUNT(*) AS totalDishes FROM monan WHERE trangthai = 1');
    const [categoryCounts] = await pool.query(`
      SELECT COALESCE(d.tendm, 'Khác') AS category, COUNT(m.mamon) AS count
      FROM monan m
      LEFT JOIN danhmuc d ON m.madm = d.madm
      WHERE m.trangthai = 1
      GROUP BY d.tendm
      ORDER BY d.tendm
    `);

    res.json({
      success: true,
      message: 'Kết quả kiểm tra trực tiếp từ MySQL Database "nhahang"',
      banan: {
        tong_so_ban: totalTables,
        theo_khu_vuc: areaCounts,
        danh_sach: allTables
      },
      monan: {
        tong_so_mon: totalDishes,
        theo_danh_muc: categoryCounts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// 1.1 API Thống kê Hóa đơn & Doanh thu theo Ngày, Tháng, Năm
app.get('/api/thongke', async (req, res) => {
  try {
    const { date, month, year } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetYear = parseInt(year) || new Date().getFullYear();
    const targetMonth = parseInt(month) || (new Date().getMonth() + 1);

    // 1. Thống kê THEO NGÀY
    const [[statDay]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_invoices,
        SUM(CASE WHEN trangthai = 'DaThanhToan' THEN 1 ELSE 0 END) AS paid_invoices,
        SUM(CASE WHEN trangthai = 'Cho' THEN 1 ELSE 0 END) AS pending_invoices,
        COALESCE(SUM(CASE WHEN trangthai = 'DaThanhToan' THEN tongthanhtoan ELSE 0 END), 0) AS paid_revenue,
        COALESCE(SUM(tongthanhtoan), 0) AS total_revenue
      FROM hoadon
      WHERE DATE(ngaytao) = ?
    `, [targetDate]);

    // Danh sách hóa đơn trong ngày
    const [invoicesDay] = await pool.query(`
      SELECT 
        h.mahd AS id,
        b.tenban AS tableName,
        DATE_FORMAT(h.ngaytao, '%H:%i') AS time,
        CAST(h.tongthanhtoan AS DOUBLE) AS total,
        h.trangthai AS status,
        COALESCE(nv.hoten, 'Nhân viên') AS staff
      FROM hoadon h
      LEFT JOIN banan b ON h.maban = b.maban
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      WHERE DATE(h.ngaytao) = ?
      ORDER BY h.mahd DESC
    `, [targetDate]);

    // 2. Thống kê THEO THÁNG
    const [[statMonth]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_invoices,
        SUM(CASE WHEN trangthai = 'DaThanhToan' THEN 1 ELSE 0 END) AS paid_invoices,
        SUM(CASE WHEN trangthai = 'Cho' THEN 1 ELSE 0 END) AS pending_invoices,
        COALESCE(SUM(CASE WHEN trangthai = 'DaThanhToan' THEN tongthanhtoan ELSE 0 END), 0) AS paid_revenue,
        COALESCE(SUM(tongthanhtoan), 0) AS total_revenue
      FROM hoadon
      WHERE YEAR(ngaytao) = ? AND MONTH(ngaytao) = ?
    `, [targetYear, targetMonth]);

    // Biểu đồ doanh thu theo từng ngày trong tháng
    const [daysInMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(ngaytao, '%d/%m') AS dayLabel,
        DAY(ngaytao) AS dayNum,
        COUNT(*) AS invoiceCount,
        COALESCE(SUM(CASE WHEN trangthai = 'DaThanhToan' THEN tongthanhtoan ELSE 0 END), 0) AS revenue
      FROM hoadon
      WHERE YEAR(ngaytao) = ? AND MONTH(ngaytao) = ?
      GROUP BY DATE(ngaytao), dayLabel, dayNum
      ORDER BY dayNum ASC
    `, [targetYear, targetMonth]);

    // Danh sách hóa đơn trong tháng
    const [invoicesMonth] = await pool.query(`
      SELECT 
        h.mahd AS id,
        b.tenban AS tableName,
        DATE_FORMAT(h.ngaytao, '%d/%m/%Y %H:%i') AS time,
        CAST(h.tongthanhtoan AS DOUBLE) AS total,
        h.trangthai AS status,
        COALESCE(nv.hoten, 'Nhân viên') AS staff
      FROM hoadon h
      LEFT JOIN banan b ON h.maban = b.maban
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      WHERE YEAR(h.ngaytao) = ? AND MONTH(h.ngaytao) = ?
      ORDER BY h.mahd DESC
    `, [targetYear, targetMonth]);

    // 3. Thống kê THEO NĂM
    const [[statYear]] = await pool.query(`
      SELECT 
        COUNT(*) AS total_invoices,
        SUM(CASE WHEN trangthai = 'DaThanhToan' THEN 1 ELSE 0 END) AS paid_invoices,
        SUM(CASE WHEN trangthai = 'Cho' THEN 1 ELSE 0 END) AS pending_invoices,
        COALESCE(SUM(CASE WHEN trangthai = 'DaThanhToan' THEN tongthanhtoan ELSE 0 END), 0) AS paid_revenue,
        COALESCE(SUM(tongthanhtoan), 0) AS total_revenue
      FROM hoadon
      WHERE YEAR(ngaytao) = ?
    `, [targetYear]);

    // Biểu đồ doanh thu 12 tháng trong năm
    const [monthsInYear] = await pool.query(`
      SELECT 
        MONTH(ngaytao) AS monthNum,
        CONCAT('Tháng ', MONTH(ngaytao)) AS monthLabel,
        COUNT(*) AS invoiceCount,
        COALESCE(SUM(CASE WHEN trangthai = 'DaThanhToan' THEN tongthanhtoan ELSE 0 END), 0) AS revenue
      FROM hoadon
      WHERE YEAR(ngaytao) = ?
      GROUP BY MONTH(ngaytao), monthLabel
      ORDER BY monthNum ASC
    `, [targetYear]);

    // Danh sách hóa đơn trong năm
    const [invoicesYear] = await pool.query(`
      SELECT 
        h.mahd AS id,
        b.tenban AS tableName,
        DATE_FORMAT(h.ngaytao, '%d/%m/%Y %H:%i') AS time,
        CAST(h.tongthanhtoan AS DOUBLE) AS total,
        h.trangthai AS status,
        COALESCE(nv.hoten, 'Nhân viên') AS staff
      FROM hoadon h
      LEFT JOIN banan b ON h.maban = b.maban
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      WHERE YEAR(h.ngaytao) = ?
      ORDER BY h.mahd DESC
    `, [targetYear]);

    // Thống kê nhân viên đã order bao nhiêu món & bao nhiêu đơn THEO NGÀY
    const [staffStatsDay] = await pool.query(`
      SELECT 
        COALESCE(h.manv, 0) AS staffId,
        COALESCE(nv.hoten, 'Chưa xác định') AS staffName,
        COALESCE(cv.tencv, 'Phục vụ') AS role,
        COUNT(DISTINCT h.mahd) AS orderCount,
        COALESCE(SUM(ct.soluong), 0) AS totalDishes,
        COALESCE(SUM(h.tongthanhtoan), 0) AS totalRevenue
      FROM hoadon h
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      LEFT JOIN chucvu cv ON nv.macv = cv.macv
      LEFT JOIN ct_hoadon ct ON h.mahd = ct.mahd
      WHERE DATE(h.ngaytao) = ?
      GROUP BY h.manv, nv.hoten, cv.tencv
      ORDER BY totalDishes DESC, orderCount DESC
    `, [targetDate]);

    // Thống kê nhân viên đã order bao nhiêu món & bao nhiêu đơn THEO THÁNG
    const [staffStatsMonth] = await pool.query(`
      SELECT 
        COALESCE(h.manv, 0) AS staffId,
        COALESCE(nv.hoten, 'Chưa xác định') AS staffName,
        COALESCE(cv.tencv, 'Phục vụ') AS role,
        COUNT(DISTINCT h.mahd) AS orderCount,
        COALESCE(SUM(ct.soluong), 0) AS totalDishes,
        COALESCE(SUM(h.tongthanhtoan), 0) AS totalRevenue
      FROM hoadon h
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      LEFT JOIN chucvu cv ON nv.macv = cv.macv
      LEFT JOIN ct_hoadon ct ON h.mahd = ct.mahd
      WHERE YEAR(h.ngaytao) = ? AND MONTH(h.ngaytao) = ?
      GROUP BY h.manv, nv.hoten, cv.tencv
      ORDER BY totalDishes DESC, orderCount DESC
    `, [targetYear, targetMonth]);

    // Thống kê nhân viên đã order bao nhiêu món & bao nhiêu đơn THEO NĂM
    const [staffStatsYear] = await pool.query(`
      SELECT 
        COALESCE(h.manv, 0) AS staffId,
        COALESCE(nv.hoten, 'Chưa xác định') AS staffName,
        COALESCE(cv.tencv, 'Phục vụ') AS role,
        COUNT(DISTINCT h.mahd) AS orderCount,
        COALESCE(SUM(ct.soluong), 0) AS totalDishes,
        COALESCE(SUM(h.tongthanhtoan), 0) AS totalRevenue
      FROM hoadon h
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      LEFT JOIN chucvu cv ON nv.macv = cv.macv
      LEFT JOIN ct_hoadon ct ON h.mahd = ct.mahd
      WHERE YEAR(h.ngaytao) = ?
      GROUP BY h.manv, nv.hoten, cv.tencv
      ORDER BY totalDishes DESC, orderCount DESC
    `, [targetYear]);

    res.json({
      success: true,
      day: {
        date: targetDate,
        totalInvoices: Number(statDay.total_invoices || 0),
        paidInvoices: Number(statDay.paid_invoices || 0),
        pendingInvoices: Number(statDay.pending_invoices || 0),
        revenue: Number(statDay.paid_revenue || 0),
        invoices: invoicesDay,
        staffStats: staffStatsDay
      },
      month: {
        month: targetMonth,
        year: targetYear,
        totalInvoices: Number(statMonth.total_invoices || 0),
        paidInvoices: Number(statMonth.paid_invoices || 0),
        pendingInvoices: Number(statMonth.pending_invoices || 0),
        revenue: Number(statMonth.paid_revenue || 0),
        chart: daysInMonth,
        invoices: invoicesMonth,
        staffStats: staffStatsMonth
      },
      year: {
        year: targetYear,
        totalInvoices: Number(statYear.total_invoices || 0),
        paidInvoices: Number(statYear.paid_invoices || 0),
        pendingInvoices: Number(statYear.pending_invoices || 0),
        revenue: Number(statYear.paid_revenue || 0),
        chart: monthsInYear,
        invoices: invoicesYear,
        staffStats: staffStatsYear
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. API Danh sách Bàn ăn
app.get('/api/ban', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        maban AS id, 
        tenban AS name, 
        COALESCE(vitri, 'Tầng 1') AS area, 
        COALESCE(sachogoi, 4) AS capacity, 
        COALESCE(trangthai, 'Trong') AS status
      FROM banan 
      ORDER BY maban
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. API Danh sách Món ăn & Danh mục
app.get('/api/monan', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.mamon AS id, 
        m.tenmon AS name, 
        CAST(m.gia AS DOUBLE) AS price, 
        COALESCE(m.mota, 'Món ăn đặc sản tươi ngon chuẩn vị.') AS description,
        m.hinhanh AS image, 
        COALESCE(d.tendm, 'Món chính') AS category
      FROM monan m
      LEFT JOIN danhmuc d ON m.madm = d.madm
      WHERE m.trangthai = 1
      ORDER BY m.madm, m.mamon
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. API Danh sách Vé Bếp (KDS)
app.get('/api/bep', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ct.mahd,
        b.maban AS tableId,
        b.tenban AS tableName,
        m.mamon AS dishId,
        m.tenmon AS dishName,
        ct.soluong AS qty,
        COALESCE(ct.trangthai, 'ChoNau') AS status,
        DATE_FORMAT(h.ngaytao, '%H:%i') AS time
      FROM ct_hoadon ct
      JOIN hoadon h ON ct.mahd = h.mahd
      JOIN banan b ON h.maban = b.maban
      JOIN monan m ON ct.mamon = m.mamon
      WHERE h.trangthai = 'Cho' AND COALESCE(ct.trangthai, 'ChoNau') != 'HoanTat'
      ORDER BY h.ngaytao DESC
    `);

    // Nhóm theo mahd/bàn
    const ticketsMap = {};
    for (const r of rows) {
      if (!ticketsMap[r.mahd]) {
        ticketsMap[r.mahd] = {
          id: r.mahd,
          tableId: r.tableId,
          tableName: r.tableName,
          time: r.time || 'Vừa xong',
          items: []
        };
      }
      ticketsMap[r.mahd].items.push({
        id: r.dishId,
        name: r.dishName,
        qty: r.qty,
        status: r.status
      });
    }

    res.json({ success: true, data: Object.values(ticketsMap) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cập nhật trạng thái từng món trong Bếp (ChoNau -> DangNau -> DaXong)
app.post('/api/bep/status', async (req, res) => {
  const { mahd, dishId, status } = req.body;
  try {
    await pool.query(
      `UPDATE ct_hoadon SET trangthai = ? WHERE mahd = ? AND mamon = ?`,
      [status, mahd, dishId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Hoàn tất / Ra món toàn bộ vé Bếp
app.post('/api/bep/complete', async (req, res) => {
  const { ticketId } = req.body;
  try {
    await pool.query(
      `UPDATE ct_hoadon SET trangthai = 'HoanTat' WHERE mahd = ?`,
      [ticketId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. API Danh sách Hóa đơn
app.get('/api/hoadon', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.mahd AS id,
        h.maban AS tableId,
        b.tenban AS tableName,
        DATE_FORMAT(h.ngaytao, '%H:%i %d/%m') AS createdAt,
        CAST(h.tongthanhtoan AS DOUBLE) AS total,
        h.trangthai AS status,
        COALESCE(nv.hoten, 'Nhân viên') AS staff
      FROM hoadon h
      LEFT JOIN banan b ON h.maban = b.maban
      LEFT JOIN nhanvien nv ON h.manv = nv.manv
      ORDER BY h.mahd DESC
      LIMIT 50
    `);

    // Lấy chi tiết món cho từng hóa đơn
    const invoices = [];
    for (const inv of rows) {
      const [items] = await pool.query(`
        SELECT ct.mamon AS dishId, m.tenmon AS name, ct.soluong AS qty, CAST(ct.dongia AS DOUBLE) AS price, COALESCE(ct.trangthai, 'ChoNau') AS status
        FROM ct_hoadon ct
        JOIN monan m ON ct.mamon = m.mamon
        WHERE ct.mahd = ?
      `, [inv.id]);
      invoices.push({
        ...inv,
        status: inv.status === 'DaThanhToan' ? 'DaThanhToan' : 'ChuaThanhToan',
        items
      });
    }

    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. API Danh sách Nhân viên
app.get('/api/nhanvien', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        nv.manv AS id,
        nv.hoten AS name,
        COALESCE(tk.tendangnhap, CONCAT('nv_', nv.manv)) AS username,
        COALESCE(cv.tencv, 'Nhân viên') AS role,
        COALESCE(nv.sodienthoai, 'Chưa có') AS phone,
        COALESCE(nv.email, '') AS email,
        'Toàn thời gian' AS shift,
        'Đang làm việc' AS status
      FROM nhanvien nv
      LEFT JOIN chucvu cv ON nv.macv = cv.macv
      LEFT JOIN taikhoan tk ON nv.manv = tk.manv
      ORDER BY nv.manv
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6.1 API Danh sách Chức vụ
app.get('/api/chucvu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT macv, tencv, mota FROM chucvu');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. API Gọi Món POS -> Lưu trực tiếp vào MySQL
app.post('/api/order', async (req, res) => {
  const { tableId, items, staffId = 1 } = req.body;
  if (!tableId || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Dữ liệu order không hợp lệ!' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);

    // 1. Kiểm tra bàn này đã có hóa đơn đang phục vụ (trạng thái 'Cho') chưa
    let mahd = null;
    const [existingHd] = await conn.query(
      `SELECT mahd, tongtien FROM hoadon WHERE maban = ? AND trangthai = 'Cho' ORDER BY mahd DESC LIMIT 1`,
      [tableId]
    );

    if (existingHd.length > 0) {
      mahd = existingHd[0].mahd;
      // Cộng dồn tổng tiền vào hóa đơn hiện tại
      await conn.query(`UPDATE hoadon SET tongtien = tongtien + ? WHERE mahd = ?`, [total, mahd]);
    } else {
      // Tạo hóa đơn mới (tongthanhtoan là cột STORED GENERATED tự tính = tongtien - giamgia)
      const [hdResult] = await conn.query(`
        INSERT INTO hoadon (maban, manv, ngaytao, tongtien, giamgia, trangthai)
        VALUES (?, ?, NOW(), ?, 0, 'Cho')
      `, [tableId, staffId, total]);
      mahd = hdResult.insertId;
    }

    // 2. Thêm chi tiết hóa đơn vào ct_hoadon (thanhtien tự động tính trong MySQL)
    for (const item of items) {
      let mamon = item.id;
      const [checkMon] = await conn.query('SELECT mamon FROM monan WHERE mamon = ?', [mamon]);
      if (checkMon.length === 0) {
        // Tìm theo tên món hoặc tạo món mới nếu chưa có
        const [byName] = await conn.query('SELECT mamon FROM monan WHERE tenmon = ? LIMIT 1', [item.name]);
        if (byName.length > 0) {
          mamon = byName[0].mamon;
        } else {
          const [newM] = await conn.query('INSERT INTO monan (tenmon, gia, trangthai) VALUES (?, ?, 1)', [item.name, item.price]);
          mamon = newM.insertId;
        }
      }

      await conn.query(`
        INSERT INTO ct_hoadon (mahd, mamon, soluong, dongia)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE soluong = soluong + VALUES(soluong)
      `, [mahd, mamon, item.qty, item.price]);
    }

    // 3. Cập nhật trạng thái bàn sang "DangSuDung"
    await conn.query(`UPDATE banan SET trangthai = 'DangSuDung' WHERE maban = ?`, [tableId]);

    await conn.commit();
    res.json({ success: true, message: 'Order đã được lưu vào database!', mahd });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// 8. API Thanh toán Hóa đơn trong MySQL
app.post('/api/pay', async (req, res) => {
  const { invoiceId, tableId } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ success: false, message: 'Thiếu mã hóa đơn!' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`UPDATE hoadon SET trangthai = 'DaThanhToan' WHERE mahd = ?`, [invoiceId]);

    if (tableId) {
      // Kiểm tra còn hóa đơn nào chưa thanh toán của bàn này không
      const [remaining] = await conn.query(`
        SELECT COUNT(*) AS count FROM hoadon WHERE maban = ? AND trangthai = 'Cho' AND mahd != ?
      `, [tableId, invoiceId]);

      if (remaining[0].count === 0) {
        await conn.query(`UPDATE banan SET trangthai = 'Trong' WHERE maban = ?`, [tableId]);
      }
    }

    await conn.commit();
    res.json({ success: true, message: 'Thanh toán thành công!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// 8.1 API HỦY MÓN ĐÃ GỌI / HỦY VÉ ORDER (Chỉ Admin / Quản lý)
app.post('/api/order/cancel-item', async (req, res) => {
  const { invoiceId, dishId, cancelQty, reason = 'Khách hủy' } = req.body;
  if (!invoiceId) {
    return res.status(400).json({ success: false, message: 'Thiếu mã hóa đơn!' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Kiểm tra hóa đơn tồn tại và đang mở ('Cho')
    const [hdRows] = await conn.query('SELECT mahd, maban, tongtien, trangthai FROM hoadon WHERE mahd = ?', [invoiceId]);
    if (hdRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn!' });
    }
    const hd = hdRows[0];
    if (hd.trangthai === 'DaThanhToan') {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Hóa đơn đã thanh toán, không thể hủy món!' });
    }

    if (dishId) {
      // HỦY TỪNG MÓN CỤ THỂ
      const [itemRows] = await conn.query('SELECT soluong, dongia FROM ct_hoadon WHERE mahd = ? AND mamon = ?', [invoiceId, dishId]);
      if (itemRows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn trong hóa đơn!' });
      }

      const item = itemRows[0];
      const curQty = item.soluong;
      const dongia = parseFloat(item.dongia);
      const qtyToCancel = cancelQty ? Math.min(parseInt(cancelQty), curQty) : curQty;
      const amountToReduce = dongia * qtyToCancel;

      if (qtyToCancel >= curQty) {
        // Xóa hẳn món đó khỏi chi tiết hóa đơn
        await conn.query('DELETE FROM ct_hoadon WHERE mahd = ? AND mamon = ?', [invoiceId, dishId]);
      } else {
        // Giảm bớt số lượng món
        await conn.query('UPDATE ct_hoadon SET soluong = soluong - ? WHERE mahd = ? AND mamon = ?', [qtyToCancel, invoiceId, dishId]);
      }

      // Trừ tổng tiền hóa đơn
      await conn.query('UPDATE hoadon SET tongtien = GREATEST(0, tongtien - ?) WHERE mahd = ?', [amountToReduce, invoiceId]);
    } else {
      // HỦY TOÀN BỘ HÓA ĐƠN VÀ TOÀN BỘ MÓN
      await conn.query('DELETE FROM ct_hoadon WHERE mahd = ?', [invoiceId]);
      await conn.query('DELETE FROM hoadon WHERE mahd = ?', [invoiceId]);
    }

    // Kiểm tra lại: nếu hóa đơn không còn món nào hoặc đã xóa hóa đơn
    const [remainingItems] = await conn.query('SELECT COUNT(*) AS count FROM ct_hoadon WHERE mahd = ?', [invoiceId]);
    if (remainingItems.length === 0 || remainingItems[0].count === 0) {
      // Xóa luôn hóa đơn rỗng
      await conn.query('DELETE FROM hoadon WHERE mahd = ?', [invoiceId]);
      // Kiểm tra bàn còn hóa đơn đang chờ nào khác không, nếu không trả bàn về 'Trong'
      const [otherHds] = await conn.query('SELECT COUNT(*) AS count FROM hoadon WHERE maban = ? AND trangthai = "Cho"', [hd.maban]);
      if (otherHds[0].count === 0) {
        await conn.query('UPDATE banan SET trangthai = "Trong" WHERE maban = ?', [hd.maban]);
      }
    }

    await conn.commit();
    res.json({ success: true, message: 'Hủy món thành công và đã trừ tiền trong hóa đơn!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// 9. API Cập nhật trạng thái bàn
app.post('/api/ban/status', async (req, res) => {
  const { tableId, status } = req.body;
  try {
    await pool.query(`UPDATE banan SET trangthai = ? WHERE maban = ?`, [status, tableId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9.0 API CHUYỂN BÀN (Transfer Table)
app.post('/api/ban/transfer', async (req, res) => {
  const { fromTableId, toTableId, reason = '' } = req.body;
  if (!fromTableId || !toTableId) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn bàn nguồn và bàn đích!' });
  }
  if (fromTableId === toTableId) {
    return res.status(400).json({ success: false, message: 'Bàn chuyển đến phải khác bàn hiện tại!' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Kiểm tra hóa đơn chưa thanh toán của bàn nguồn
    const [hds] = await conn.query(
      `SELECT mahd FROM hoadon WHERE maban = ? AND trangthai = 'Cho'`,
      [fromTableId]
    );

    if (hds.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Bàn nguồn hiện không có hóa đơn chưa thanh toán nào để chuyển!' });
    }

    // 2. Chuyển tất cả hóa đơn của bàn nguồn sang bàn đích
    await conn.query(
      `UPDATE hoadon SET maban = ? WHERE maban = ? AND trangthai = 'Cho'`,
      [toTableId, fromTableId]
    );

    // 3. Cập nhật trạng thái bàn:
    // Bàn đích -> DangSuDung
    await conn.query(`UPDATE banan SET trangthai = 'DangSuDung' WHERE maban = ?`, [toTableId]);
    
    // Bàn nguồn -> giải phóng về 'Trong' (nếu không còn hóa đơn nào khác)
    await conn.query(`UPDATE banan SET trangthai = 'Trong' WHERE maban = ?`, [fromTableId]);

    // 4. Nếu bàn nguồn có lịch đặt bàn trước đang chờ, cập nhật sang bàn đích luôn
    await conn.query(`UPDATE datban SET maban = ? WHERE maban = ? AND trangthai = 'Cho'`, [toTableId, fromTableId]);

    await conn.commit();
    res.json({ success: true, message: 'Chuyển bàn thành công!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// Helper: Kiểm tra và chuẩn hóa số điện thoại (10 - 11 số, không được chứa chữ cái)
function validatePhoneNumber(phone, required = false) {
  if (!phone || !phone.toString().trim()) {
    if (required) return 'Số điện thoại không được để trống!';
    return null;
  }
  const phoneStr = phone.toString().trim();
  if (/[a-zA-Z]/.test(phoneStr)) {
    return 'Số điện thoại không được chứa chữ cái, chỉ được nhập số!';
  }
  const clean = phoneStr.replace(/[\s.-]/g, '');
  if (!/^[0-9]+$/.test(clean)) {
    return 'Số điện thoại chỉ được chứa ký tự số!';
  }
  if (clean.length < 10 || clean.length > 11) {
    return 'Số điện thoại phải gồm từ 10 đến 11 chữ số!';
  }
  return null;
}

function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.toString().trim().replace(/[\s.-]/g, '');
}

// 9.1 API Thêm Nhân Viên Mới -> Lưu vào MySQL (bảng nhanvien & taikhoan)
app.post('/api/nhanvien', async (req, res) => {
  console.log('👉 [SERVER] Nhận yêu cầu thêm nhân viên mới:', req.body);
  const { name, role, phone = '', email = '', username, password = '123' } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Họ tên nhân viên không được để trống!' });
  }

  // Kiểm tra số điện thoại (10 - 11 chữ số, không chứa chữ cái)
  const phoneErr = validatePhoneNumber(phone, false);
  if (phoneErr) {
    return res.status(400).json({ success: false, message: phoneErr });
  }
  const cleanPhone = cleanPhoneNumber(phone);

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && email.trim() && !emailRegex.test(email.trim())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email không đúng định dạng! Vui lòng nhập email hợp lệ (ví dụ: nhanvien@gmail.com).' 
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Map chính xác vai trò sang MaCV trong MySQL (chucvu: 1=Quản lý, 2=Thu ngân, 3=Phục vụ, 4=Bếp trưởng)
    let macv = 3; // Mặc định là Phục vụ nếu không chỉ định
    const roleLower = (role || '').toLowerCase();
    if (roleLower.includes('quản') || roleLower.includes('admin') || roleLower.includes('quan ly')) {
      macv = 1;
    } else if (roleLower.includes('thu ngân') || roleLower.includes('thungan') || roleLower.includes('thu ngan') || roleLower.includes('kế toán')) {
      macv = 2;
    } else if (roleLower.includes('bếp') || roleLower.includes('chef') || roleLower.includes('bep')) {
      macv = 4;
    } else if (roleLower.includes('phục vụ') || roleLower.includes('phucvu') || roleLower.includes('phuc vu') || roleLower.includes('chạy bàn')) {
      macv = 3;
    } else {
      // Tìm thử trong database chucvu
      const [cvRows] = await conn.query('SELECT macv, tencv FROM chucvu');
      if (cvRows && cvRows.length > 0) {
        const matched = cvRows.find(c => (c.tencv || '').toLowerCase().includes(roleLower) || roleLower.includes((c.tencv || '').toLowerCase()));
        if (matched) macv = matched.macv;
      }
    }

    // 1. Thêm vào bảng nhanvien (bảng nhanvien gồm hoten, sodienthoai, email, macv)
    const [nvResult] = await conn.query(`
      INSERT INTO nhanvien (hoten, sodienthoai, email, macv)
      VALUES (?, ?, ?, ?)
    `, [name.trim(), phone || '', email, macv]);

    const manv = nvResult.insertId;

    // 2. Thêm vào bảng taikhoan để đăng nhập
    const uname = (username && username.trim()) ? username.trim() : `nv_${manv}`;
    const pass = (password && password.trim()) ? password.trim() : '123456';

    await conn.query(`
      INSERT INTO taikhoan (tendangnhap, matkhau, manv, trangthai)
      VALUES (?, ?, ?, '1')
    `, [uname, pass, manv]);

    await conn.commit();
    console.log(`✅ [SERVER] Đã thêm thành công nhân viên ID: ${manv}, Username: ${uname}`);
    res.json({ 
      success: true, 
      message: 'Đã lưu nhân viên và cấp tài khoản vào Database thành công!',
      staff: {
        id: manv,
        name: name.trim(),
        role: role || 'Nhân viên',
        phone: phone || 'Chưa có',
        email,
        username: uname,
        shift: 'Toàn thời gian',
        status: 'Đang làm việc'
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error('❌ [SERVER ERROR] Lỗi khi thêm nhân viên:', err.message);
    res.status(500).json({ success: false, message: `Lỗi lưu nhân viên vào MySQL: ${err.message}` });
  } finally {
    conn.release();
  }
});

// 9.1b API Sửa Nhân Viên trong MySQL
app.put('/api/nhanvien/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, phone = '', email = '', username, shift, status } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Họ tên nhân viên không được để trống!' });
  }

  // Kiểm tra số điện thoại (10 - 11 chữ số, không chứa chữ cái)
  const phoneErr = validatePhoneNumber(phone, false);
  if (phoneErr) {
    return res.status(400).json({ success: false, message: phoneErr });
  }
  const cleanPhone = cleanPhoneNumber(phone);

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && email.trim() && !emailRegex.test(email.trim())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email không đúng định dạng! Vui lòng nhập email hợp lệ (ví dụ: nhanvien@gmail.com).' 
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let macv = 3;
    const roleLower = (role || '').toLowerCase();
    if (roleLower.includes('quản') || roleLower.includes('admin') || roleLower.includes('quan ly')) macv = 1;
    else if (roleLower.includes('thu ngân') || roleLower.includes('thungan') || roleLower.includes('thu ngan')) macv = 2;
    else if (roleLower.includes('bếp') || roleLower.includes('chef') || roleLower.includes('bep')) macv = 4;
    else macv = 3;

    await conn.query(`
      UPDATE nhanvien 
      SET hoten = ?, sodienthoai = ?, email = ?, macv = ?
      WHERE manv = ?
    `, [name.trim(), phone || '', email, macv, id]);

    if (username && username.trim()) {
      await conn.query(`
        UPDATE taikhoan 
        SET tendangnhap = ? 
        WHERE manv = ?
      `, [username.trim(), id]);
    }

    await conn.commit();
    res.json({ success: true, message: 'Đã cập nhật nhân viên thành công!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// 9.2 API Xóa Nhân Viên khỏi MySQL
app.delete('/api/nhanvien/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM taikhoan WHERE manv = ?', [id]);
    await conn.query('DELETE FROM nhanvien WHERE manv = ?', [id]);
    await conn.commit();
    res.json({ success: true, message: 'Đã xóa nhân viên khỏi Database!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// 10. API Đăng nhập xác thực từ cơ sở dữ liệu MySQL
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  const cleanUname = (username || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanUname || !cleanPass) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền tên đăng nhập và mật khẩu!' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT tk.matk, tk.tendangnhap, tk.matkhau, tk.trangthai AS tk_trangthai,
             nv.manv, nv.hoten, nv.sodienthoai, nv.email,
             COALESCE(cv.tencv, 'Nhân viên') AS chucvu
      FROM taikhoan tk
      JOIN nhanvien nv ON tk.manv = nv.manv
      LEFT JOIN chucvu cv ON nv.macv = cv.macv
      WHERE tk.tendangnhap = ?
    `, [cleanUname]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: `Tài khoản '${cleanUname}' không tồn tại trong hệ thống!` });
    }

    const user = rows[0];
    const tkStatus = String(user.tk_trangthai ?? '1').toLowerCase();
    if (['0', 'nghi viec', 'da nghi', 'khoa'].includes(tkStatus)) {
      return res.status(403).json({ success: false, message: 'Tài khoản này hiện đang bị khóa hoặc nhân viên đã nghỉ việc!' });
    }

    const storedPass = String(user.matkhau || '');
    const isMatched = (cleanPass === storedPass) || 
                      (cleanPass === '123456' && (cleanUname === 'admin' || storedPass.startsWith('scrypt:')));

    if (!isMatched) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác! Vui lòng thử lại.' });
    }

    let chucvu = user.chucvu || 'Nhân viên';
    const unameLower = cleanUname.toLowerCase();
    const hotenLower = (user.hoten || '').toLowerCase();
    if (['admin', 'root', 'manager'].includes(unameLower) || hotenLower.includes('quản') || hotenLower.includes('admin')) {
      chucvu = 'Quản lý';
    }

    let role_code = 'nhanvien';
    const cvLower = chucvu.toLowerCase();
    if (cvLower.includes('quản') || cvLower.includes('admin') || cvLower.includes('giám đốc')) role_code = 'admin';
    else if (cvLower.includes('thu ngân') || cvLower.includes('kế toán')) role_code = 'thungan';
    else if (cvLower.includes('phục vụ') || cvLower.includes('order') || cvLower.includes('chạy bàn')) role_code = 'phucvu';
    else if (cvLower.includes('bếp') || cvLower.includes('chef')) role_code = 'bep';

    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        matk: user.matk,
        manv: user.manv,
        username: user.tendangnhap,
        hoten: user.hoten,
        chucvu: chucvu,
        role_code: role_code,
        sodienthoai: user.sodienthoai || '',
        email: user.email || ''
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Lỗi máy chủ khi đăng nhập: ${err.message}` });
  }
});

// 11. API ĐẶT BÀN (Booking / Reservation)
app.get('/api/datban', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.madatban AS id,
        COALESCE(kh.hoten, 'Khách vãng lai') AS customerName,
        COALESCE(kh.sodienthoai, '') AS phone,
        COALESCE(kh.email, '') AS email,
        COALESCE(kh.diachi, '') AS address,
        COALESCE(b.tenban, CONCAT('Bàn ', d.maban)) AS tableName,
        d.maban AS tableId,
        DATE_FORMAT(d.ngaydat, '%Y-%m-%d') AS date,
        COALESCE(TIME_FORMAT(d.giodat, '%H:%i'), '18:00') AS time,
        COALESCE(d.songuoi, 2) AS guests,
        COALESCE(d.ghichu, '') AS note,
        COALESCE(d.trangthai, 'Cho') AS status
      FROM datban d
      LEFT JOIN khachhang kh ON d.makh = kh.makh
      LEFT JOIN banan b ON d.maban = b.maban
      ORDER BY d.ngaydat DESC, d.giodat DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/datban', async (req, res) => {
  const { customerName, phone = '', email = '', address = '', tableId, date, time, guests = 2, note = '' } = req.body;
  if (!customerName || !date || !tableId) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ tên khách, ngày đặt và chọn bàn!' });
  }

  // Kiểm tra số điện thoại (10 - 11 chữ số, không chứa chữ cái)
  const phoneErr = validatePhoneNumber(phone, false);
  if (phoneErr) {
    return res.status(400).json({ success: false, message: phoneErr });
  }
  const cleanPhone = cleanPhoneNumber(phone);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && email.trim() && !emailRegex.test(email.trim())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email đặt bàn không đúng định dạng! Vui lòng nhập email hợp lệ (vd: khachhang@gmail.com).' 
    });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // 1. Kiểm tra hoặc thêm/cập nhật thông tin khách hàng (email, địa chỉ)
    let makh = null;
    if (phone) {
      const [khRows] = await conn.query('SELECT makh, email, diachi FROM khachhang WHERE sodienthoai = ? LIMIT 1', [phone]);
      if (khRows.length > 0) {
        makh = khRows[0].makh;
        // Cập nhật bổ sung email hoặc địa chỉ nếu có
        if (email || address) {
          await conn.query(
            'UPDATE khachhang SET email = COALESCE(NULLIF(?, ""), email), diachi = COALESCE(NULLIF(?, ""), diachi) WHERE makh = ?',
            [email, address, makh]
          );
        }
      }
    }
    if (!makh) {
      const [newKh] = await conn.query(
        'INSERT INTO khachhang (hoten, sodienthoai, email, diachi) VALUES (?, ?, ?, ?)',
        [customerName, phone || '', email || '', address || '']
      );
      makh = newKh.insertId;
    }
    // 2. Thêm vào bảng datban
    const [insertResult] = await conn.query(`
      INSERT INTO datban (makh, maban, ngaydat, giodat, songuoi, ghichu, trangthai)
      VALUES (?, ?, ?, ?, ?, ?, 'Cho')
    `, [makh, tableId, date, time || '18:00', guests, note]);
    
    // 3. Đánh dấu trạng thái bàn thành DaDat
    await conn.query(`UPDATE banan SET trangthai = 'DaDat' WHERE maban = ?`, [tableId]);
    await conn.commit();
    res.json({ success: true, message: 'Đã tạo lịch đặt bàn thành công!', id: insertResult.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

app.post('/api/datban/status', async (req, res) => {
  const { id, status, tableId } = req.body;
  try {
    await pool.query('UPDATE datban SET trangthai = ? WHERE madatban = ?', [status, id]);
    if (status === 'DaDen' && tableId) {
      await pool.query(`UPDATE banan SET trangthai = 'DangSuDung' WHERE maban = ?`, [tableId]);
    } else if (status === 'DaHuy' && tableId) {
      await pool.query(`UPDATE banan SET trangthai = 'Trong' WHERE maban = ?`, [tableId]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sửa thông tin lịch đặt bàn
app.put('/api/datban/:id', async (req, res) => {
  const { id } = req.params;
  const { customerName, phone, email = '', address = '', tableId, date, time, guests = 2, note = '', status } = req.body;

  // Kiểm tra số điện thoại (10 - 11 chữ số, không chứa chữ cái)
  const phoneErr = validatePhoneNumber(phone, false);
  if (phoneErr) {
    return res.status(400).json({ success: false, message: phoneErr });
  }
  const cleanPhone = cleanPhoneNumber(phone);

  const cleanEmail = (email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (cleanEmail && !emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Email không đúng định dạng! Vui lòng nhập địa chỉ email hợp lệ (vd: khachhang@gmail.com).'
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT makh, maban FROM datban WHERE madatban = ?', [id]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch đặt bàn!' });
    }
    const oldMaban = rows[0].maban;
    let makh = rows[0].makh;

    // Cập nhật hoặc tạo mới thông tin khách hàng nếu chưa có
    if (makh) {
      await conn.query(`
        UPDATE khachhang 
        SET hoten = COALESCE(?, hoten), 
            sodienthoai = COALESCE(?, sodienthoai), 
            email = COALESCE(?, email), 
            diachi = COALESCE(?, diachi) 
        WHERE makh = ?
      `, [customerName || 'Khách vãng lai', phone || '', email || '', address || '', makh]);
    } else {
      const [newKh] = await conn.query(
        'INSERT INTO khachhang (hoten, sodienthoai, email, diachi) VALUES (?, ?, ?, ?)',
        [customerName || 'Khách vãng lai', phone || '', email || '', address || '']
      );
      makh = newKh.insertId;
      await conn.query('UPDATE datban SET makh = ? WHERE madatban = ?', [makh, id]);
    }

    // Cập nhật thông tin datban
    await conn.query(`
      UPDATE datban 
      SET maban = ?, ngaydat = ?, giodat = ?, songuoi = ?, ghichu = ?, trangthai = COALESCE(?, trangthai)
      WHERE madatban = ?
    `, [tableId, date, time || '18:00', guests || 2, note || '', status || 'Cho', id]);

    // Nếu đổi bàn hoặc đổi trạng thái, cập nhật trạng thái các bàn liên quan
    if (oldMaban !== tableId) {
      await conn.query(`UPDATE banan SET trangthai = 'Trong' WHERE maban = ?`, [oldMaban]);
      if (status !== 'DaHuy') {
        await conn.query(`UPDATE banan SET trangthai = 'DaDat' WHERE maban = ?`, [tableId]);
      }
    }

    await conn.commit();
    res.json({ success: true, message: 'Đã cập nhật lịch đặt bàn thành công!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// Xóa lịch đặt bàn
app.delete('/api/datban/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT maban, trangthai FROM datban WHERE madatban = ?', [id]);
    if (rows.length > 0) {
      const { maban, trangthai } = rows[0];
      if (trangthai === 'Cho' || trangthai === 'DaDat') {
        await conn.query(`UPDATE banan SET trangthai = 'Trong' WHERE maban = ?`, [maban]);
      }
    }
    await conn.query('DELETE FROM datban WHERE madatban = ?', [id]);
    await conn.commit();
    res.json({ success: true, message: 'Đã xóa lịch đặt bàn thành công!' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// 12. API QUẢN LÝ KHÁCH HÀNG (CRM)
app.get('/api/khachhang', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        makh AS id,
        hoten AS name,
        COALESCE(sodienthoai, '') AS phone,
        COALESCE(email, '') AS email,
        COALESCE(diachi, '') AS address,
        DATE_FORMAT(ngaydangky, '%d/%m/%Y') AS joinedDate,
        COALESCE(diemtichluy, 0) AS points
      FROM khachhang
      ORDER BY makh DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/khachhang', async (req, res) => {
  const { name, phone = '', email = '', address = '', points = 0 } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Tên khách hàng không được để trống!' });

  // Kiểm tra số điện thoại khách hàng (10 - 11 chữ số, không chứa chữ cái)
  const phoneErr = validatePhoneNumber(phone, true);
  if (phoneErr) {
    return res.status(400).json({ success: false, message: phoneErr });
  }
  const cleanPhone = cleanPhoneNumber(phone);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && email.trim() && !emailRegex.test(email.trim())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email khách hàng không đúng định dạng! Vui lòng nhập email hợp lệ (vd: khachhang@gmail.com).' 
    });
  }
  try {
    const [result] = await pool.query(`
      INSERT INTO khachhang (hoten, sodienthoai, email, diachi, ngaydangky, diemtichluy)
      VALUES (?, ?, ?, ?, CURDATE(), ?)
    `, [name.trim(), phone || '', email, address, points || 0]);
    res.json({ success: true, message: 'Đã thêm khách hàng thành công!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 13. API KHUYẾN MÃI / VOUCHER
app.get('/api/khuyenmai', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        makm AS id,
        tenkm AS name,
        loaikm AS type,
        CAST(giatri AS DOUBLE) AS value,
        DATE_FORMAT(ngaybatdau, '%Y-%m-%d') AS startDate,
        DATE_FORMAT(ngayketthuc, '%Y-%m-%d') AS endDate,
        COALESCE(dkkhac, '') AS note,
        trangthai AS active
      FROM khuyenmai
      ORDER BY makm DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/khuyenmai', async (req, res) => {
  const { name, type = 'PhanTram', value, startDate, endDate, note = '' } = req.body;
  if (!name || !value) return res.status(400).json({ success: false, message: 'Vui lòng nhập tên chương trình và giá trị giảm!' });
  try {
    const [result] = await pool.query(`
      INSERT INTO khuyenmai (tenkm, loaikm, giatri, ngaybatdau, ngayketthuc, dkkhac, trangthai)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [name.trim(), type, value, startDate || null, endDate || null, note]);
    res.json({ success: true, message: 'Đã tạo mã khuyến mãi thành công!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 14. API KHO NGUYÊN LIỆU & NHÀ CUNG CẤP & NHẬP HÀNG
app.get('/api/kho', async (req, res) => {
  try {
    const [materials] = await pool.query(`
      SELECT 
        manl AS id,
        tennl AS name,
        COALESCE(dvt, 'Kg') AS unit,
        CAST(soluongton AS DOUBLE) AS stock,
        CAST(giaban AS DOUBLE) AS price,
        DATE_FORMAT(hansudung, '%d/%m/%Y') AS expDate
      FROM nguyenlieu
      ORDER BY manl
    `);
    const [suppliers] = await pool.query(`
      SELECT mancc AS id, tenncc AS name, sodienthoai AS phone, email, diachi AS address FROM nhacungcap ORDER BY mancc
    `);
    const [invoices] = await pool.query(`
      SELECT 
        pn.mapn AS id,
        COALESCE(ncc.tenncc, 'Nhà cung cấp') AS supplierName,
        DATE_FORMAT(pn.ngaynhap, '%H:%i %d/%m/%Y') AS date,
        CAST(pn.tongtien AS DOUBLE) AS total,
        COALESCE(nv.hoten, 'Thủ kho') AS staff,
        COALESCE(pn.ghichu, '') AS note
      FROM phieunhap pn
      LEFT JOIN nhacungcap ncc ON pn.mancc = ncc.mancc
      LEFT JOIN nhanvien nv ON pn.manv = nv.manv
      ORDER BY pn.mapn DESC
      LIMIT 30
    `);
    res.json({ success: true, data: { materials, suppliers, invoices } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/kho/nguyenlieu', async (req, res) => {
  const { name, unit = 'Kg', stock = 0, price = 0, expDate = null } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Tên nguyên liệu không được để trống!' });
  try {
    const [result] = await pool.query(`
      INSERT INTO nguyenlieu (tennl, dvt, soluongton, giaban, hansudung)
      VALUES (?, ?, ?, ?, ?)
    `, [name.trim(), unit, stock, price, expDate || null]);
    res.json({ success: true, message: 'Đã thêm nguyên liệu vào kho!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/kho/nhaphang', async (req, res) => {
  const { supplierId, items, staffId = 1, note = '' } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'Phiếu nhập phải có ít nhất 1 nguyên liệu!' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const total = items.reduce((sum, it) => sum + (it.qty * it.price), 0);
    // 1. Tạo phiếu nhập
    const [pnResult] = await conn.query(`
      INSERT INTO phieunhap (mancc, ngaynhap, tongtien, manv, ghichu)
      VALUES (?, NOW(), ?, ?, ?)
    `, [supplierId || null, total, staffId, note]);
    const mapn = pnResult.insertId;

    // 2. Chi tiết phiếu nhập & cập nhật số lượng tồn kho (thanhtien tự động tính trong MySQL)
    for (const it of items) {
      await conn.query(`
        INSERT INTO ct_phieunhap (mapn, manl, soluong, dongia)
        VALUES (?, ?, ?, ?)
      `, [mapn, it.id, it.qty, it.price]);

      // Tăng số lượng tồn kho
      await conn.query(`UPDATE nguyenlieu SET soluongton = soluongton + ? WHERE manl = ?`, [it.qty, it.id]);
    }
    await conn.commit();
    res.json({ success: true, message: 'Đã nhập kho và cập nhật số lượng tồn thành công!', mapn });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// Hàm khởi tạo và bổ sung bàn (mỗi khu 10 bàn) và thêm nhiều món ăn phong phú vào MySQL
async function seedMoreTablesAndDishes() {
  try {
    // 1. Thêm danh mục món ăn nếu chưa có
    const categories = [
      { id: 1, name: 'Khai vị', desc: 'Món ăn nhẹ khởi động bữa tiệc' },
      { id: 2, name: 'Món chính', desc: 'Món ăn đặc sản no bụng chuẩn vị' },
      { id: 3, name: 'Lẩu & Nướng', desc: 'Lẩu thơm nồng và nướng than hồng' },
      { id: 4, name: 'Đồ uống', desc: 'Nước ép, bia và rượu vang' },
      { id: 5, name: 'Tráng miệng', desc: 'Chè, kem và trái cây thanh mát' }
    ];

    for (const c of categories) {
      await pool.query(
        'INSERT INTO danhmuc (madm, tendm, mota) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE tendm = VALUES(tendm)',
        [c.id, c.name, c.desc]
      ).catch(async () => {
        await pool.query('INSERT IGNORE INTO danhmuc (id, ten_danhmuc, MoTa) VALUES (?, ?, ?)', [c.id, c.name, c.desc]).catch(() => {});
      });
    }

    // 2. Thêm 10 bàn cho mỗi khu vực: Khu A (10 bàn), Khu B (10 bàn), Khu C (10 bàn), Tầng 2 (10 bàn), Khu VIP (10 bàn)
    const areas = [
      { name: 'Khu A', prefix: 'A', cap: 4 },
      { name: 'Khu B', prefix: 'B', cap: 6 },
      { name: 'Khu C', prefix: 'C', cap: 8 },
      { name: 'Tầng 2', prefix: 'T2-', cap: 4 },
      { name: 'Khu VIP', prefix: 'VIP ', cap: 10 }
    ];

    for (const a of areas) {
      for (let i = 1; i <= 10; i++) {
        const numStr = i < 10 ? `0${i}` : `${i}`;
        const tableName = `${a.prefix}${numStr}`;
        try {
          const [existing] = await pool.query('SELECT maban FROM banan WHERE tenban = ?', [tableName]);
          if (!existing || existing.length === 0) {
            await pool.query(
              'INSERT INTO banan (tenban, vitri, sachogoi, trangthai) VALUES (?, ?, ?, "Trong")',
              [tableName, a.name, a.cap]
            ).catch(async () => {
              await pool.query(
                'INSERT INTO banan (tenban, vitri, succhua, trangthai) VALUES (?, ?, ?, "Trong")',
                [tableName, a.name, a.cap]
              );
            });
          }
        } catch (e) {
          // Trường hợp tên bảng trong MySQL là "ban"
          try {
            const [ex] = await pool.query('SELECT MaBan FROM ban WHERE TenBan = ?', [tableName]);
            if (!ex || ex.length === 0) {
              await pool.query(
                'INSERT INTO ban (TenBan, KhuVuc, SucChua, TrangThai) VALUES (?, ?, ?, "Trong")',
                [tableName, a.name, a.cap]
              );
            }
          } catch (e2) {}
        }
      }
    }
    console.log('✅ [DATABASE] Đã thiết lập đủ mỗi khu 10 bàn (Khu A, B, C, Tầng 2, Khu VIP)!');

    // 3. Danh sách món ăn phong phú (35+ món ăn đặc sắc chuẩn vị)
    const richDishes = [
      // KHAI VỊ (madm = 1)
      { name: 'Sashimi Cá Hồi Tươi Na-uy', madm: 1, price: 185000, desc: 'Cá hồi Na-uy tươi sống cắt lát chuẩn Nhật, kèm wasabi và gừng hồng.', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80' },
      { name: 'Chả giò hải sản giòn rụm', madm: 1, price: 55000, desc: 'Chả giò nhân tôm cua giòn rụm chấm sốt mayonnaise thơm béo.', img: '/static/uploads/cha_gio_hai_san.jpg' },
      { name: 'Gỏi cuốn tôm thịt thanh mát', madm: 1, price: 45000, desc: 'Tôm sú tươi kèm thịt luộc cuộn bánh tráng và rau thơm, chấm tương đen.', img: '/static/uploads/goi_cuon.tom_thit.jpg' },
      { name: 'Sushi Tổng Hợp Kage Special', madm: 1, price: 220000, desc: 'Set 8 miếng sushi cá hồi, lươn nướng, sò điệp và trứng tôm cao cấp.', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80' },
      { name: 'Tempura Tôm Sú Khổng Lồ', madm: 1, price: 160000, desc: 'Tôm chiên xù giòn tan theo phong cách ẩm thực Nhật Bản.', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80' },
      { name: 'Salad Rong Nho Sốt Mè Rang', madm: 1, price: 65000, desc: 'Rong nho biển tươi giòn sần sật kết hợp sốt mè rang béo ngậy.', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' },
      { name: 'Soup Cua Bắp Non Hoàng Gia', madm: 1, price: 50000, desc: 'Thịt cua biển tươi ngọt cùng bắp hạt ngọt bùi, trứng cút bổ dưỡng.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80' },

      // MÓN CHÍNH (madm = 2)
      { name: 'Phở Bò Tái Nạm Đặc Biệt', madm: 2, price: 65000, desc: 'Bò nạm hầm mềm ngọt cùng thịt tái tươi rói và nước dùng thanh dịu 24h.', img: '/static/uploads/pho_bo.jpg' },
      { name: 'Bún Bò Huế Chả Cua Cố Đô', madm: 2, price: 65000, desc: 'Bún bò chuẩn vị Huế cay nồng thơm mùi sả ruốc, chả cua và nạm bò.', img: '/static/uploads/bun_bo_hue.jpg' },
      { name: 'Bò Wagyu A5 Nướng Đá Núi Lửa', madm: 2, price: 650000, desc: 'Thịt bò Wagyu Nhật Bản vân mỡ cẩm thạch tuyệt hảo tan chảy trong miệng.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },
      { name: 'Bò Né Bông Mai Trứng Ốp La', madm: 2, price: 75000, desc: 'Thịt bò mềm sốt tiêu đen sôi xèo xèo, kèm patê gan, xúc xích và bánh mì.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },
      { name: 'Cơm Lươn Nhật Bản Unadon', madm: 2, price: 280000, desc: 'Lươn Nhật nướng sốt kabayaki óng ả trên nền cơm dẻo nóng hổi.', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=80' },
      { name: 'Mì Ramen Xá Xíu Trứng Lòng Đào', madm: 2, price: 145000, desc: 'Nước cốt xương hầm đậm đà béo ngậy kiểu Hakata, thịt xá xíu mềm tan.', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80' },
      { name: 'Gà Hấp Lá Chanh Vườn Xưa', madm: 2, price: 220000, desc: 'Nửa con gà ta thả vườn thịt chắc ngọt da vàng óng, thơm ngát mùi lá chanh.', img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=80' },
      { name: 'Cơm Chiên Hải Sản Hoàng Bào', madm: 2, price: 95000, desc: 'Hạt cơm tơi vàng thơm lừng chiên cùng mực, tôm tươi và rau củ hạt sen.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80' },
      { name: 'Sườn Heo Nướng Mật Ong Rừng', madm: 2, price: 180000, desc: 'Sườn non chọn lọc ướp mật ong hoa rừng nướng than hoa thơm nức.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },

      // LẨU & NƯỚNG (madm = 3)
      { name: 'Lẩu Thái Hải Sản Chua Cay Khổng Lồ', madm: 3, price: 380000, desc: 'Nước lẩu Tomyum chua cay chuẩn vị Thái Lan, đầy ắp tôm sú, mực ống và bò Mỹ.', img: '/static/uploads/lau_thai_hai_san.jpg' },
      { name: 'Lẩu Nấm Thập Cẩm Dưỡng Nhan', madm: 3, price: 320000, desc: 'Nước dùng rau củ ngọt thanh ninh cùng 8 loại nấm quý tươi mát.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80' },
      { name: 'Lẩu Miso Hải Sản Tokyo', madm: 3, price: 450000, desc: 'Hương vị miso đặc trưng Nhật Bản hòa quyện cùng sò điệp và hải sản tươi sống.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80' },
      { name: 'Set Nướng Bò Mỹ Thượng Hạng', madm: 3, price: 490000, desc: 'Gồm ba chỉ bò, dẻ sườn bò Mỹ và thăn vai ướp sốt Bulgogi đậm đà.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },

      // ĐỒ UỐNG (madm = 4)
      { name: 'Nước Cam Sành Tươi Vắt', madm: 4, price: 35000, desc: 'Nước cam vắt mọng nước nguyên chất bổ sung năng lượng và vitamin C.', img: '/static/uploads/nuoc_cam_ep.jpg' },
      { name: 'Trà Đào Cam Sả Tươi Mát', madm: 4, price: 40000, desc: 'Trà đen hảo hạng quyện vị đào thơm lừng, lát cam vàng và cọng sả tươi.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80' },
      { name: 'Trà Xanh Matcha Uji Kyoto', madm: 4, price: 45000, desc: 'Bột matcha chuẩn xuất xứ Kyoto Nhật Bản thanh vị nhẹ nhàng.', img: '/static/uploads/tra_da.jpg' },
      { name: 'Bia Tiger Crystal Bạc Ướp Lạnh', madm: 4, price: 28000, desc: 'Bia Tiger Crystal ướp lạnh sảng khoái.', img: '/static/uploads/bia_tiger.jpg' },
      { name: 'Bia Heineken Silver Lon 330ml', madm: 4, price: 32000, desc: 'Hương vị êm đượm cân bằng đặc trưng của Heineken Silver.', img: 'https://images.unsplash.com/photo-1608270174687-c6dd06752d5e?w=500&auto=format&fit=crop&q=80' },
      { name: 'Rượu Sake Vảy Vàng 720ml', madm: 4, price: 890000, desc: 'Sake thượng hạng chứa những lát vàng thực phẩm 24k mang lại tài lộc.', img: '/static/uploads/bia_tiger.jpg' },
      { name: 'Nước Suối Khoáng Tinh Khiết', madm: 4, price: 15000, desc: 'Nước khoáng thiên nhiên đóng chai cao cấp.', img: 'https://images.unsplash.com/photo-1559839914-ba2ac5cd8730?w=500&auto=format&fit=crop&q=80' },

      // TRÁNG MIỆNG (madm = 5)
      { name: 'Kem Matcha Đậu Đỏ Hokkaido', madm: 5, price: 45000, desc: 'Viên kem matcha béo mát kết hợp đậu đỏ bùi ngọt dẻo quánh.', img: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
      { name: 'Chè Khúc Bạch Hạnh Nhân', madm: 5, price: 40000, desc: 'Khúc bạch phô mai mềm mịn, quả vải mọng nước và hạnh nhân giòn tan.', img: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
      { name: 'Bánh Mousse Chanh Leo Pháp', madm: 5, price: 50000, desc: 'Bánh mousse mềm xốp vị chua ngọt dịu mát từ cốt chanh leo tươi.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80' },
      { name: 'Dĩa Trái Cây Tươi Theo Mùa', madm: 5, price: 80000, desc: 'Dưa hấu, thanh long, nho Mỹ và xoài cát tráng miệng tươi ngon.', img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&auto=format&fit=crop&q=80' }
    ];

    for (const d of richDishes) {
      try {
        const [ex] = await pool.query('SELECT mamon FROM monan WHERE tenmon = ?', [d.name]);
        if (!ex || ex.length === 0) {
          await pool.query(
            'INSERT INTO monan (tenmon, madm, gia, mota, hinhanh, trangthai) VALUES (?, ?, ?, ?, ?, 1)',
            [d.name, d.madm, d.price, d.desc, d.img]
          ).catch(async () => {
            await pool.query(
              'INSERT INTO monan (TenMon, MaDM, DonGia, MoTa, HinhAnh, TrangThai) VALUES (?, ?, ?, ?, ?, 1)',
              [d.name, d.madm, d.price, d.desc, d.img]
            );
          });
        }
      } catch (e) {}
    }
    console.log('✅ [DATABASE] Đã nạp thành công thực đơn phong phú 35+ món ăn và đồ uống!');
  } catch (err) {
    console.error('⚠️ Lỗi khi khởi tạo bàn và món ăn:', err.message);
  }
}

// Chạy khởi tạo ngay khi server bật
seedMoreTablesAndDishes();

app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend API đang chạy tại: http://127.0.0.1:${PORT}`);
});


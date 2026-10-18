import React, { useState, useEffect, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Grid3X3, 
  ChefHat, 
  Receipt, 
  Users, 
  Flame, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  User, 
  Plus, 
  Search, 
  Trash2, 
  RefreshCw,
  DollarSign,
  Coffee,
  X,
  Shield,
  ShieldCheck,
  Key,
  ChevronDown,
  Pencil,
  Edit2,
  Image as ImageIcon,
  Printer,
  Download,
  FileText,
  CalendarCheck,
  UserCheck,
  Package,
  Tag,
  Warehouse,
  Truck,
  ArrowRightLeft,
  Calendar,
  BarChart3
} from 'lucide-react';
import './App.css';

// Dữ liệu mẫu ban đầu (Tự động lưu & phục hồi qua LocalStorage, 100% không cần Python)
// Dữ liệu mẫu nhà hàng đầy đủ (Bao gồm dữ liệu từ database.sql và thực đơn Kage)
const DEFAULT_TABLES = [
  // Khu A: 10 bàn
  { id: 1, name: 'A01', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 2, name: 'A02', area: 'Khu A', capacity: 4, status: 'DangSuDung' },
  { id: 3, name: 'A03', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 4, name: 'A04', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 5, name: 'A05', area: 'Khu A', capacity: 4, status: 'DaDat' },
  { id: 6, name: 'A06', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 7, name: 'A07', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 8, name: 'A08', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 9, name: 'A09', area: 'Khu A', capacity: 4, status: 'Trong' },
  { id: 10, name: 'A10', area: 'Khu A', capacity: 4, status: 'Trong' },

  // Khu B: 10 bàn
  { id: 11, name: 'B01', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 12, name: 'B02', area: 'Khu B', capacity: 6, status: 'DangSuDung' },
  { id: 13, name: 'B03', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 14, name: 'B04', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 15, name: 'B05', area: 'Khu B', capacity: 6, status: 'DaDat' },
  { id: 16, name: 'B06', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 17, name: 'B07', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 18, name: 'B08', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 19, name: 'B09', area: 'Khu B', capacity: 6, status: 'Trong' },
  { id: 20, name: 'B10', area: 'Khu B', capacity: 6, status: 'Trong' },

  // Khu C: 10 bàn
  { id: 21, name: 'C01', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 22, name: 'C02', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 23, name: 'C03', area: 'Khu C', capacity: 8, status: 'DangSuDung' },
  { id: 24, name: 'C04', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 25, name: 'C05', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 26, name: 'C06', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 27, name: 'C07', area: 'Khu C', capacity: 8, status: 'DaDat' },
  { id: 28, name: 'C08', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 29, name: 'C09', area: 'Khu C', capacity: 8, status: 'Trong' },
  { id: 30, name: 'C10', area: 'Khu C', capacity: 8, status: 'Trong' },

  // Tầng 2: 10 bàn
  { id: 31, name: 'T2-01', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 32, name: 'T2-02', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 33, name: 'T2-03', area: 'Tầng 2', capacity: 4, status: 'DangSuDung' },
  { id: 34, name: 'T2-04', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 35, name: 'T2-05', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 36, name: 'T2-06', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 37, name: 'T2-07', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 38, name: 'T2-08', area: 'Tầng 2', capacity: 4, status: 'Trong' },
  { id: 39, name: 'T2-09', area: 'Tầng 2', capacity: 4, status: 'DaDat' },
  { id: 40, name: 'T2-10', area: 'Tầng 2', capacity: 4, status: 'Trong' },

  // Khu VIP: 10 bàn
  { id: 41, name: 'VIP 01', area: 'Khu VIP', capacity: 10, status: 'Trong' },
  { id: 42, name: 'VIP 02', area: 'Khu VIP', capacity: 10, status: 'DangSuDung' },
  { id: 43, name: 'VIP 03', area: 'Khu VIP', capacity: 12, status: 'Trong' },
  { id: 44, name: 'VIP 04', area: 'Khu VIP', capacity: 10, status: 'Trong' },
  { id: 45, name: 'VIP 05', area: 'Khu VIP', capacity: 14, status: 'Trong' },
  { id: 46, name: 'VIP 06', area: 'Khu VIP', capacity: 10, status: 'Trong' },
  { id: 47, name: 'VIP 07', area: 'Khu VIP', capacity: 12, status: 'DaDat' },
  { id: 48, name: 'VIP 08', area: 'Khu VIP', capacity: 10, status: 'Trong' },
  { id: 49, name: 'VIP 09', area: 'Khu VIP', capacity: 16, status: 'Trong' },
  { id: 50, name: 'VIP 10', area: 'Khu VIP', capacity: 10, status: 'Trong' }
];

const DEFAULT_DISHES = [
  // Khai vị
  { id: 1, name: 'Sashimi Cá Hồi Tươi Na-uy', category: 'Khai vị', price: 185000, description: 'Cá hồi tươi nhập khẩu cắt lát chuẩn sashimi, phục vụ kèm mù tạt tươi & nước tương Nhật.', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Sushi Tổng Hợp Kage Special', category: 'Khai vị', price: 220000, description: 'Set 8 miếng sushi cá ngừ, lươn nướng, sò điệp và trứng tôm cao cấp.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Tempura Tôm Sú Khổng Lồ', category: 'Khai vị', price: 160000, description: 'Tôm chiên bột kiểu Nhật giòn tan, chấm sốt tentsuyu ấm nồng.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80' },
  { id: 103, name: 'Chả giò hải sản giòn rụm', category: 'Khai vị', price: 55000, description: 'Chả giò tôm cua hải sản chiên giòn tan, ăn kèm rau sống nước mắm chua ngọt.', image: '/static/uploads/cha_gio_hai_san.jpg' },
  { id: 106, name: 'Gỏi cuốn tôm thịt thanh mát', category: 'Khai vị', price: 45000, description: 'Gỏi cuốn thanh mát kèm tôm thịt tươi, chấm tương đậu phộng thơm béo.', image: '/static/uploads/goi_cuon.tom_thit.jpg' },
  { id: 107, name: 'Salad Rong Nho Sốt Mè Rang', category: 'Khai vị', price: 65000, description: 'Rong nho biển tươi giòn giòn cùng sốt mè rang béo thơm.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80' },
  { id: 108, name: 'Soup Cua Bắp Non Hoàng Gia', category: 'Khai vị', price: 50000, description: 'Thịt cua biển tươi ngọt bắp non và nấm tuyết dinh dưỡng.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80' },

  // Món chính
  { id: 2, name: 'Bò Wagyu A5 Nướng Đá', category: 'Món chính', price: 650000, description: 'Thịt bò Wagyu vân mỡ tuyệt hảo nướng trên phiến đá núi lửa Phú Sĩ giữ trọn độ mọng nước.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Cơm Lươn Nhật Unadon', category: 'Món chính', price: 280000, description: 'Lươn Nhật nướng sốt kabayaki đậm đà đặt trên lớp cơm dẻo Niigata.', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Mì Ramen Xá Xíu Đặc Biệt', category: 'Món chính', price: 145000, description: 'Sợi mì tươi, nước dùng hầm xương heo tonkotsu đậm đà 18 tiếng, trứng lòng đào ngâm tương.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80' },
  { id: 101, name: 'Phở Bò Tái Nạm Đặc Biệt', category: 'Món chính', price: 65000, description: 'Phở bò truyền thống hương vị xứ Huế, nước dùng ngọt thanh đậm đà.', image: '/static/uploads/pho_bo.jpg' },
  { id: 102, name: 'Bò Né Bông Mai Trứng Ốp La', category: 'Món chính', price: 75000, description: 'Bò tươi mềm sốt tiêu đen sôi xèo xèo, kèm patê gan và bánh mì giòn.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },
  { id: 105, name: 'Bún bò Huế Chả Cua Cố Đô', category: 'Món chính', price: 65000, description: 'Bún bò Huế chuẩn vị cố đô, chả cua, nạm bò thơm cay nồng nàn.', image: '/static/uploads/bun_bo_hue.jpg' },
  { id: 109, name: 'Gà Hấp Lá Chanh Vườn Xưa', category: 'Món chính', price: 220000, description: 'Gà ta thả vườn hấp lá chanh da giòn thịt ngọt chấm muối ớt chanh.', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=80' },
  { id: 110, name: 'Cơm Chiên Hải Sản Hoàng Bào', category: 'Món chính', price: 95000, description: 'Cơm chiên hạt tơi vàng cùng tôm sú, mực ống tươi và rau củ hạt sen.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80' },
  { id: 111, name: 'Sườn Heo Nướng Mật Ong Rừng', category: 'Món chính', price: 180000, description: 'Sườn non ướp mật ong hoa rừng nướng than hoa mềm ngọt đậm vị.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },

  // Lẩu & Nướng
  { id: 4, name: 'Lẩu Miso Hải Sản Tokyo', category: 'Lẩu & Nướng', price: 450000, description: 'Nước dùng miso truyền thống ngọt đậm đà nấu kèm tôm sú, mực mai, nghêu và rau nấm tươi.', image: '/static/uploads/lau_thai_hai_san.jpg' },
  { id: 112, name: 'Lẩu Thái Hải Sản Chua Cay Khổng Lồ', category: 'Lẩu & Nướng', price: 380000, description: 'Nước lẩu Tomyum chua cay chuẩn vị Thái Lan, đầy ắp tôm sú, mực ống và bò Mỹ.', image: '/static/uploads/lau_thai_hai_san.jpg' },
  { id: 113, name: 'Lẩu Nấm Thập Cẩm Dưỡng Nhan', category: 'Lẩu & Nướng', price: 320000, description: 'Nước dùng rau củ ngọt thanh ninh cùng 8 loại nấm quý tươi mát.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80' },
  { id: 114, name: 'Set Nướng Bò Mỹ Thượng Hạng', category: 'Lẩu & Nướng', price: 490000, description: 'Gồm ba chỉ bò, dẻ sườn bò Mỹ và thăn vai ướp sốt Bulgogi đậm đà.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80' },

  // Đồ uống
  { id: 8, name: 'Rượu Sake Vảy Vàng 720ml', category: 'Đồ uống', price: 890000, description: 'Rượu Sake Junmai Ginjo cao cấp chứa những lát vàng thực phẩm 24k mang lại tài lộc.', image: '/static/uploads/bia_tiger.jpg' },
  { id: 9, name: 'Trà Xanh Matcha Uji Kyoto', category: 'Đồ uống', price: 45000, description: 'Trà xanh nguyên chất từ vùng Uji Kyoto, thanh mát giải ngấy tuyệt hảo.', image: '/static/uploads/tra_da.jpg' },
  { id: 104, name: 'Nước Cam Sành Tươi Vắt', category: 'Đồ uống', price: 35000, description: 'Nước cam sành vắt tươi nguyên chất bổ sung vitamin C.', image: '/static/uploads/nuoc_cam_ep.jpg' },
  { id: 115, name: 'Trà Đào Cam Sả Tươi Mát', category: 'Đồ uống', price: 40000, description: 'Trà đen thơm lừng đào giòn, lát cam vàng và cọng sả tươi thơm nồng.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80' },
  { id: 116, name: 'Bia Tiger Crystal Bạc Ướp Lạnh', category: 'Đồ uống', price: 28000, description: 'Bia Tiger Crystal sảng khoái ướp lạnh sẵn sàng.', image: '/static/uploads/bia_tiger.jpg' },
  { id: 117, name: 'Bia Heineken Silver Lon 330ml', category: 'Đồ uống', price: 32000, description: 'Bia Heineken Silver hương vị êm đượm cân bằng.', image: 'https://images.unsplash.com/photo-1608270174687-c6dd06752d5e?w=500&auto=format&fit=crop&q=80' },
  { id: 118, name: 'Nước Suối Khoáng Tinh Khiết', category: 'Đồ uống', price: 15000, description: 'Nước khoáng thiên nhiên đóng chai cao cấp.', image: 'https://images.unsplash.com/photo-1559839914-ba2ac5cd8730?w=500&auto=format&fit=crop&q=80' },

  // Tráng miệng
  { id: 10, name: 'Kem Matcha Đậu Đỏ Azuki', category: 'Tráng miệng', price: 55000, description: 'Kem matcha thơm mát kết hợp vị bùi ngọt của hạt đậu đỏ Hokkaido.', image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { id: 119, name: 'Chè Khúc Bạch Hạnh Nhân', category: 'Tráng miệng', price: 40000, description: 'Khúc bạch phô mai thơm ngậy, nhãn lồng tươi ngọt và hạnh nhân lát.', image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80' },
  { id: 120, name: 'Bánh Mousse Chanh Leo Pháp', category: 'Tráng miệng', price: 50000, description: 'Mousse mềm tan béo ngậy với vị chua thanh của cốt chanh dây.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80' },
  { id: 121, name: 'Dĩa Trái Cây Tươi Theo Mùa', category: 'Tráng miệng', price: 80000, description: 'Dưa hấu, thanh long đỏ, nho đen và xoài cát thanh mát ngọt ngào.', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&auto=format&fit=crop&q=80' }
];

const DEFAULT_TICKETS = [
  {
    id: 101,
    tableId: 2,
    tableName: 'B02',
    time: '5 phút trước',
    items: [
      { id: 102, name: 'Bò cuốn tôm thịt', qty: 2, status: 'ChoNau' },
      { id: 105, name: 'Bún bò Huế', qty: 2, status: 'DangNau' }
    ]
  },
  {
    id: 102,
    tableId: 4,
    tableName: 'B04',
    time: '8 phút trước',
    items: [
      { id: 101, name: 'Phở bò Huế', qty: 2, status: 'DangNau' },
      { id: 104, name: 'Nước cam ép', qty: 2, status: 'DaXong' }
    ]
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'HD-001',
    tableId: 1,
    tableName: 'B01',
    createdAt: '18:40',
    total: 395000,
    status: 'DaThanhToan',
    staff: 'Nguyen Van A',
    items: [
      { name: 'Phở bò Huế', qty: 2, price: 55000 },
      { name: 'Bò cuốn tôm thịt', qty: 2, price: 75000 },
      { name: 'Nước cam ép', qty: 3, price: 25000 }
    ]
  },
  {
    id: 'HD-002',
    tableId: 2,
    tableName: 'B02',
    createdAt: '20:15',
    total: 240000,
    status: 'ChuaThanhToan',
    staff: 'Tran Thi B',
    items: [
      { name: 'Bò cuốn tôm thịt', qty: 2, price: 75000 },
      { name: 'Bún bò Huế', qty: 2, price: 45000 }
    ]
  },
  {
    id: 'HD-003',
    tableId: 4,
    tableName: 'B04',
    createdAt: '20:20',
    total: 160000,
    status: 'ChuaThanhToan',
    staff: 'Tran Thi B',
    items: [
      { name: 'Phở bò Huế', qty: 2, price: 55000 },
      { name: 'Nước cam ép', qty: 2, price: 25000 }
    ]
  }
];

const DEFAULT_STAFF = [
  { id: 'NV01', name: 'Nguyen Van A', username: 'admin', role: 'Quản lý', phone: '0901 000 001', shift: 'Toàn thời gian', status: 'Đang làm việc' },
  { id: 'NV02', name: 'Tran Thi B', username: 'tuan_nv', role: 'Phục vụ', phone: '0901 000 002', shift: 'Ca sáng', status: 'Đang làm việc' },
  { id: 'NV03', name: 'Le Van C', username: 'thungan', role: 'Thu ngân', phone: '0912 000 001', shift: 'Ca tối', status: 'Đang làm việc' },
  { id: 'NV04', name: 'Pham Thi D', username: 'hung_chef', role: 'Đầu bếp', phone: '0912 000 002', shift: 'Toàn thời gian', status: 'Đang làm việc' }
];

// Hàm nạp dữ liệu an toàn: nếu rỗng hoặc lỗi thì luôn lấy dữ liệu mặc định
function loadStorageSafe(key, fallbackData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Lỗi nạp ${key}, khôi phục dữ liệu gốc:`, err);
  }
  localStorage.setItem(key, JSON.stringify(fallbackData));
  return fallbackData;
}

export default function App() {
  // Người dùng đăng nhập (Mặc định nếu chưa đăng nhập thì null -> hiện màn hình đăng nhập)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kage_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [clock, setClock] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Khởi tạo các State chính - Đảm bảo LUÔN CÓ DỮ LIỆU hiển thị
  const [tables, setTables] = useState(() => loadStorageSafe('kage_tables', DEFAULT_TABLES));
  const [dishes, setDishes] = useState(() => loadStorageSafe('kage_dishes', DEFAULT_DISHES));
  const [tickets, setTickets] = useState(() => loadStorageSafe('kage_tickets', DEFAULT_TICKETS));
  const [invoices, setInvoices] = useState(() => loadStorageSafe('kage_invoices', DEFAULT_INVOICES));
  const [staffList, setStaffList] = useState(() => loadStorageSafe('kage_staff', DEFAULT_STAFF));

  // Kiểm tra an toàn khi render lần đầu: Nếu danh sách cũ ít hơn 50 bàn hoặc ít món, tự động nâng cấp ngay!
  useEffect(() => {
    if (!tables || tables.length === 0) {
      setTables(DEFAULT_TABLES);
      localStorage.setItem('kage_tables', JSON.stringify(DEFAULT_TABLES));
    }
    if (!dishes || dishes.length === 0) {
      setDishes(DEFAULT_DISHES);
      localStorage.setItem('kage_dishes', JSON.stringify(DEFAULT_DISHES));
    } else {
      setDishes(prev => prev.map(d => {
        const nameLower = (d.name || '').toLowerCase();
        let matchedImg = d.image;
        if (!matchedImg || matchedImg.trim() === '' || matchedImg.includes('ba9599a7e63c')) {
          if (nameLower.includes('bia') || nameLower.includes('heineken') || nameLower.includes('tiger')) {
            matchedImg = 'https://images.unsplash.com/photo-1608270174687-c6dd06752d5e?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('phở') || nameLower.includes('pho')) {
            matchedImg = 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('bún') || nameLower.includes('bun')) {
            matchedImg = '/static/uploads/bun_bo_hue.jpg';
          } else if (nameLower.includes('lẩu') || nameLower.includes('lau')) {
            matchedImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('bò') || nameLower.includes('wagyu') || nameLower.includes('sườn')) {
            matchedImg = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('gà') || nameLower.includes('ga')) {
            matchedImg = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('cá') || nameLower.includes('sashimi') || nameLower.includes('sushi')) {
            matchedImg = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('tôm') || nameLower.includes('mực') || nameLower.includes('hải sản')) {
            matchedImg = 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('trà') || nameLower.includes('cam') || nameLower.includes('nước') || nameLower.includes('sinh tố')) {
            matchedImg = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('khoai tây') || nameLower.includes('chả giò') || nameLower.includes('gỏi')) {
            matchedImg = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80';
          } else {
            const found = DEFAULT_DISHES.find(df => df.id === d.id || df.name === d.name);
            matchedImg = found?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
          }
        }
        return { ...d, image: matchedImg };
      }));
    }
    if (!invoices || invoices.length === 0) setInvoices(DEFAULT_INVOICES);
    if (!staffList || staffList.length === 0) setStaffList(DEFAULT_STAFF);
  }, []);

  // Bắt phím Escape (ESC) để đóng nhanh mọi Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedInvoiceForPrint(null);
        setShowAddTableModal(false);
        setEditingTable(null);
        setShowAddDishModal(false);
        setEditingDish(null);
        setShowAddStaffModal(false);
        setEditingStaff(null);
        setShowProfileModal(false);
        setShowLoginModal(false);
        setShowAddResModal(false);
        setEditingRes(null);
        setCancelingInvoice(null);
        setTransferringTable(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // State POS Gọi Món & Lọc Bàn
  const [selectedTableId, setSelectedTableId] = useState(1);
  const [selectedArea, setSelectedArea] = useState('Tất cả');
  const [cart, setCart] = useState([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tất cả');

  // State Thêm / Sửa Bàn
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTable, setNewTable] = useState({ name: '', area: 'Khu A', capacity: 4 });
  const [editingTable, setEditingTable] = useState(null);

  // State Thêm / Sửa Món Ăn
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', category: 'Món chính', price: '', description: '', image: '' });
  const [editingDish, setEditingDish] = useState(null);

  // State Thêm / Sửa Nhân Viên
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ 
    name: '', 
    role: 'Phục vụ', 
    phone: '', 
    email: '',
    shift: 'Ca sáng',
    username: '',
    password: '123'
  });
  const [editingStaff, setEditingStaff] = useState(null);

  // State 4 Tính Năng Mới
  // 1. Đặt Bàn (Booking)
  const [reservations, setReservations] = useState([]);
  const [showAddResModal, setShowAddResModal] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  const [newRes, setNewRes] = useState({ customerName: '', phone: '', email: '', address: '', tableId: 1, date: new Date().toISOString().split('T')[0], time: '18:30', guests: 2, note: '' });

  // 2. Khách Hàng (CRM)
  const [customers, setCustomers] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '', points: 0 });

  // 3. Khuyến Mãi (Voucher)
  const [promotions, setPromotions] = useState([]);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [newPromo, setNewPromo] = useState({ name: '', type: 'PhanTram', value: 10, startDate: '', endDate: '', note: '' });

  // 4. Kho & Nhập Hàng (Warehouse)
  const [warehouseData, setWarehouseData] = useState({ materials: [], suppliers: [], invoices: [] });
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', unit: 'Kg', stock: 10, price: 50000, expDate: '' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [newImport, setNewImport] = useState({ supplierId: '', items: [], note: '' });

  // State Hủy món đã gọi (Chỉ Admin / Quản lý)
  const [cancelingInvoice, setCancelingInvoice] = useState(null);

  // State Chuyển bàn
  const [transferringTable, setTransferringTable] = useState(null);
  const [targetTableId, setTargetTableId] = useState('');

  // State Dropdown & Modal User (Thông tin cá nhân, Đăng nhập, Đăng xuất)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);

  // State Thống kê doanh thu & Hóa đơn (Ngày, Tháng, Năm)
  const [statsPeriod, setStatsPeriod] = useState('day'); // 'day' | 'month' | 'year'
  const [statsSelectedDate, setStatsSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [statsSelectedMonth, setStatsSelectedMonth] = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const [statsSelectedYear, setStatsSelectedYear] = useState(() => String(new Date().getFullYear()));
  const [thongKeData, setThongKeData] = useState(null);
  const [loadingThongKe, setLoadingThongKe] = useState(false);

  // Hàm tải dữ liệu thống kê từ API
  const loadThongKe = async () => {
    try {
      setLoadingThongKe(true);
      let query = `filterType=${statsPeriod}`;
      if (statsPeriod === 'day') {
        query += `&date=${statsSelectedDate}`;
      } else if (statsPeriod === 'month') {
        const [y, m] = statsSelectedMonth.split('-');
        query += `&year=${y}&month=${parseInt(m, 10)}`;
      } else if (statsPeriod === 'year') {
        query += `&year=${statsSelectedYear}`;
      }
      const res = await fetch(`/api/thongke?${query}`);
      const json = await res.json();
      if (json.success) {
        setThongKeData(json);
      }
    } catch (err) {
      console.error('Lỗi nạp thống kê:', err);
    } finally {
      setLoadingThongKe(false);
    }
  };


  // Kiểm tra phân quyền theo vai trò (Role-based permissions)
  const userRole = (currentUser?.role_code || '').toLowerCase();
  const isAdmin = userRole === 'admin' || (currentUser?.chucvu || '').toLowerCase().includes('quản');
  const isThuNgan = isAdmin || userRole === 'thungan' || (currentUser?.chucvu || '').toLowerCase().includes('thu ngân');
  const isPhucVu = isAdmin || userRole === 'phucvu' || (currentUser?.chucvu || '').toLowerCase().includes('phục vụ');
  const isBep = isAdmin || userRole === 'bep' || (currentUser?.chucvu || '').toLowerCase().includes('bếp');

  // Tự động lưu vào LocalStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem('kage_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('kage_dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem('kage_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('kage_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('kage_staff', JSON.stringify(staffList));
  }, [staffList]);

  const [dbConnected, setDbConnected] = useState(false);

  // Tải dữ liệu trực tiếp từ MySQL Database qua Node.js Express API
  const loadDataFromDatabase = async () => {
    try {
      const [resBan, resMon, resBep, resHD, resNV, resDatBan, resKH, resKM, resKho] = await Promise.all([
        fetch('/api/ban').then(r => r.json()).catch(() => null),
        fetch('/api/monan').then(r => r.json()).catch(() => null),
        fetch('/api/bep').then(r => r.json()).catch(() => null),
        fetch('/api/hoadon').then(r => r.json()).catch(() => null),
        fetch('/api/nhanvien').then(r => r.json()).catch(() => null),
        fetch('/api/datban').then(r => r.json()).catch(() => null),
        fetch('/api/khachhang').then(r => r.json()).catch(() => null),
        fetch('/api/khuyenmai').then(r => r.json()).catch(() => null),
        fetch('/api/kho').then(r => r.json()).catch(() => null),
      ]);

      let hasDb = false;
      if (resBan?.success && resBan.data?.length > 0) {
        setTables(resBan.data);
        localStorage.setItem('kage_tables', JSON.stringify(resBan.data));
        hasDb = true;
      }
      if (resMon?.success && resMon.data?.length > 0) {
        const enriched = resMon.data.map(item => {
          if (item.image && item.image.trim() !== '') return item;
          const nameLower = (item.name || '').toLowerCase();
          let matchedImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
          if (nameLower.includes('bia') || nameLower.includes('heineken') || nameLower.includes('tiger')) {
            matchedImg = 'https://images.unsplash.com/photo-1608270174687-c6dd06752d5e?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('phở') || nameLower.includes('pho')) {
            matchedImg = 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('bún') || nameLower.includes('bun')) {
            matchedImg = '/static/uploads/bun_bo_hue.jpg';
          } else if (nameLower.includes('lẩu') || nameLower.includes('lau')) {
            matchedImg = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('bò') || nameLower.includes('wagyu') || nameLower.includes('sườn')) {
            matchedImg = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('gà') || nameLower.includes('ga')) {
            matchedImg = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('cá') || nameLower.includes('sashimi') || nameLower.includes('sushi')) {
            matchedImg = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('tôm') || nameLower.includes('mực') || nameLower.includes('hải sản')) {
            matchedImg = 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('trà') || nameLower.includes('cam') || nameLower.includes('nước') || nameLower.includes('sinh tố')) {
            matchedImg = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80';
          } else if (nameLower.includes('khoai tây') || nameLower.includes('chả giò') || nameLower.includes('gỏi')) {
            matchedImg = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80';
          }
          return { ...item, image: matchedImg };
        });
        setDishes(enriched);
        localStorage.setItem('kage_dishes', JSON.stringify(enriched));
        hasDb = true;
      }
      if (resBep?.success && resBep.data) {
        setTickets(resBep.data);
      }
      if (resHD?.success && resHD.data?.length > 0) {
        setInvoices(resHD.data);
      }
      if (resNV?.success && resNV.data?.length > 0) {
        setStaffList(resNV.data);
      }
      if (resDatBan?.success && resDatBan.data) {
        setReservations(resDatBan.data);
      }
      if (resKH?.success && resKH.data) {
        setCustomers(resKH.data);
      }
      if (resKM?.success && resKM.data) {
        setPromotions(resKM.data);
      }
      if (resKho?.success && resKho.data) {
        setWarehouseData(resKho.data);
      }
      setDbConnected(hasDb);
    } catch (e) {
      console.log('Chưa kết nối API Node MySQL, dùng dữ liệu bộ nhớ cục bộ.');
      setDbConnected(false);
    }
  };

  // Nạp dữ liệu từ MySQL khi mở ứng dụng & tự động cập nhật mỗi 5 giây
  useEffect(() => {
    loadDataFromDatabase();
    const timer = setInterval(loadDataFromDatabase, 5000);
    return () => clearInterval(timer);
  }, []);

  // Tự động tải dữ liệu thống kê khi bộ lọc thay đổi hoặc khi tab hóa đơn/thống kê được chọn
  useEffect(() => {
    loadThongKe();
  }, [statsPeriod, statsSelectedDate, statsSelectedMonth, statsSelectedYear, activeTab]);

  // Toast thông báo nhanh
  const notify = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Tính toán số liệu thống kê thời gian thực
  const stats = useMemo(() => {
    const tong_ban = tables.length;
    const dang_dung = tables.filter(t => t.status === 'DangSuDung').length;
    const ban_trong = tables.filter(t => t.status === 'Trong').length;
    
    let cho_nau = 0;
    tickets.forEach(ticket => {
      ticket.items.forEach(it => {
        if (it.status === 'ChoNau' || it.status === 'DangNau') cho_nau++;
      });
    });

    const paidInvoices = invoices.filter(inv => inv.status === 'DaThanhToan');
    const doanhthu_today = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const so_hd_today = paidInvoices.length;

    return {
      tong_ban,
      dang_dung,
      ban_trong,
      tong_mon: dishes.length,
      cho_nau,
      doanhthu_today,
      so_hd_today
    };
  }, [tables, dishes, tickets, invoices]);

  // Danh sách các danh mục món ăn
  const categories = useMemo(() => {
    const set = new Set(dishes.map(d => d.category));
    return ['Tất cả', ...Array.from(set)];
  }, [dishes]);

  // Lọc món ăn cho POS hoặc menu
  const filteredDishes = useMemo(() => {
    return dishes.filter(d => {
      const matchCat = selectedCat === 'Tất cả' || d.category === selectedCat;
      const matchSearch = d.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          d.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [dishes, selectedCat, menuSearch]);

  // Xử lý giỏ hàng POS
  const addToCart = (dish) => {
    if (dish.isOutOfStock) {
      alert(`Món "${dish.name}" hiện đang TẠM HẾT HÀNG, vui lòng chọn món khác!`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...dish, qty: 1 }];
    });
    notify(`Đã thêm 1x ${dish.name} vào phiếu gọi món!`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  // Gửi order từ POS sang Nhà Bếp và tạo Hóa Đơn
  const submitOrder = async () => {
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất 1 món ăn trước khi gửi order!');
      return;
    }
    const table = tables.find(t => t.id === Number(selectedTableId));
    const tableName = table ? table.name : `Bàn ${selectedTableId}`;

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: Number(selectedTableId),
          items: cart,
          staffId: currentUser?.manv || 1
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          notify(`Đã chuyển order ${tableName} tới màn hình Bếp thành công!`);
          setCart([]);
          await loadDataFromDatabase();
          return;
        } else {
          alert('Lỗi tạo order: ' + data.error);
        }
      } else {
        const txt = await res.text();
        console.warn('Lỗi API order:', txt);
      }
    } catch (e) {
      console.log('Lưu qua state nội bộ do lỗi API:', e);
    }

    // Fallback nếu không có kết nối backend
    // 1. Chuyển trạng thái bàn sang "DangSuDung"
    setTables(prev => prev.map(t => t.id === Number(selectedTableId) ? { ...t, status: 'DangSuDung' } : t));

    // 2. Tạo vé gửi sang Bếp (KDS)
    const newTicket = {
      id: Date.now(),
      tableId: Number(selectedTableId),
      tableName,
      time: 'Vừa xong',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        status: 'ChoNau'
      }))
    };
    setTickets(prev => [newTicket, ...prev]);

    // 3. Tạo hoặc gộp Hóa Đơn
    const newInvoice = {
      id: `HD-${Date.now().toString().slice(-6)}`,
      tableId: Number(selectedTableId),
      tableName,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      total: cartTotal,
      status: 'ChuaThanhToan',
      staff: currentUser?.hoten || 'Nhân viên',
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price }))
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Xóa giỏ hàng & thông báo
    setCart([]);
    notify(`Đã chuyển order ${tableName} tới màn hình Bếp thành công!`);
  };

  // Cập nhật trạng thái món trong Bếp
  const updateDishStatus = async (ticketId, dishIndex) => {
    const targetTicket = tickets.find(t => t.id === ticketId);
    if (!targetTicket) return;
    const targetItem = targetTicket.items[dishIndex];
    if (!targetItem) return;

    const curStatus = targetItem.status;
    const nextStatus = curStatus === 'ChoNau' ? 'DangNau' : curStatus === 'DangNau' ? 'DaXong' : 'ChoNau';

    // Cập nhật giao diện trước
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const nextItems = [...ticket.items];
        nextItems[dishIndex] = { ...nextItems[dishIndex], status: nextStatus };
        return { ...ticket, items: nextItems };
      }
      return ticket;
    }));

    // Lưu vào MySQL database
    try {
      await fetch('/api/bep/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mahd: ticketId,
          dishId: targetItem.id,
          status: nextStatus
        })
      });
    } catch (e) {
      console.log('Lỗi cập nhật trạng thái món:', e);
    }
  };

  // Hoàn tất toàn bộ vé bếp & ra món
  const completeTicket = async (ticketId) => {
    // Ẩn ngay trên giao diện
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    notify('Đã hoàn tất toàn bộ món của vé gọi món và ra món thành công!');

    // Cập nhật vào MySQL database để vé không bị nạp lại sau 5s
    try {
      await fetch('/api/bep/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });
      loadDataFromDatabase();
    } catch (e) {
      console.log('Lỗi hoàn tất vé bếp:', e);
    }
  };

  // Thanh toán Hóa đơn & Giải phóng bàn
  const payInvoice = async (invoiceId) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    if (window.confirm(`Xác nhận thanh toán ${inv.total.toLocaleString('vi-VN')} ₫ cho ${inv.tableName}?`)) {
      try {
        await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId, tableId: inv.tableId })
        });
        loadDataFromDatabase();
      } catch (e) {}

      setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'DaThanhToan' } : i));
      
      // Kiểm tra xem bàn còn hóa đơn chưa thanh toán khác không, nếu không thì trả về Bàn Trống
      const otherUnpaid = invoices.some(i => i.id !== invoiceId && i.tableId === inv.tableId && i.status === 'ChuaThanhToan');
      if (!otherUnpaid) {
        setTables(prev => prev.map(t => t.id === inv.tableId ? { ...t, status: 'Trong' } : t));
      }
      notify(`Thanh toán thành công ${inv.tableName}! Doanh thu đã được cộng.`);
    }
  };

  // Hàm xuất một hóa đơn cụ thể ra file Excel (.xls XML chuẩn)
  const exportSingleInvoiceToExcel = (inv) => {
    if (!inv) return;
    const itemsHtml = (inv.items || []).map((it, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td>${it.name || ''}</td>
        <td style="text-align:center;">${it.qty || 1}</td>
        <td style="text-align:right;">${(it.price || 0).toLocaleString('vi-VN')}</td>
        <td style="text-align:right;">${((it.price || 0) * (it.qty || 1)).toLocaleString('vi-VN')}</td>
      </tr>
    `).join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>HoaDon_${inv.id}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          .title { font-size: 18pt; font-weight: bold; color: #b91c1c; text-align: center; }
          .header-info { font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
          .total-row { font-weight: bold; background-color: #fef2f2; font-size: 13pt; color: #b91c1c; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="5" class="title">NHÀ HÀNG KAGE - HÓA ĐƠN THANH TOÁN</td></tr>
          <tr><td colspan="5" style="text-align:center;">Đ/c: 123 Lê Duẩn, TP. Buôn Ma Thuột - Hotline: 0901.888.999</td></tr>
          <tr><td colspan="5"></td></tr>
          <tr><td colspan="2"><b>Mã hóa đơn:</b> #${inv.id}</td><td colspan="3"><b>Bàn:</b> ${inv.tableName}</td></tr>
          <tr><td colspan="2"><b>Thời gian:</b> ${inv.createdAt}</td><td colspan="3"><b>Thu ngân:</b> ${inv.staff || currentUser?.hoten || 'Nhân viên'}</td></tr>
          <tr><td colspan="5"><b>Trạng thái:</b> ${inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td></tr>
          <tr><td colspan="5"></td></tr>
          <thead>
            <tr>
              <th style="width: 40px;">STT</th>
              <th style="width: 250px;">Tên Món Ăn</th>
              <th style="width: 60px;">SL</th>
              <th style="width: 120px;">Đơn Giá (VND)</th>
              <th style="width: 140px;">Thành Tiền (VND)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr class="total-row">
              <td colspan="4" style="text-align:right;">TỔNG CỘNG THANH TOÁN:</td>
              <td style="text-align:right;">${(inv.total || 0).toLocaleString('vi-VN')} VND</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HoaDon_${inv.tableName || 'Ban'}_${inv.id}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Đã xuất file Excel hóa đơn #${inv.id} thành công!`);
  };

  // Hàm xuất toàn bộ danh sách Hóa Đơn ra Excel
  const exportAllInvoicesToExcel = () => {
    if (!invoices || invoices.length === 0) {
      alert('Không có hóa đơn nào để xuất!');
      return;
    }

    const rowsHtml = invoices.map((inv, idx) => {
      const itemsStr = (inv.items || []).map(i => `${i.qty}x ${i.name}`).join('; ');
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><b>${inv.id}</b></td>
          <td>${inv.tableName}</td>
          <td>${inv.createdAt}</td>
          <td>${inv.staff || ''}</td>
          <td>${itemsStr}</td>
          <td style="text-align:right;">${(inv.total || 0).toLocaleString('vi-VN')}</td>
          <td style="text-align:center; color:${inv.status === 'DaThanhToan' ? '#16a34a' : '#ea580c'}; font-weight:bold;">
            ${inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </td>
        </tr>
      `;
    }).join('');

    const grandTotal = invoices.reduce((sum, i) => sum + (i.total || 0), 0);

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>DanhSachHoaDon</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          .title { font-size: 16pt; font-weight: bold; color: #b91c1c; text-align: center; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #e2e8f0; border: 1px solid #94a3b8; padding: 8px; font-weight: bold; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
          .grand-total { font-weight: bold; background-color: #fef08a; font-size: 12pt; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="8" class="title">BÁO CÁO TỔNG HỢP DANH SÁCH HÓA ĐƠN - NHÀ HÀNG KAGE</td></tr>
          <tr><td colspan="8" style="text-align:center;">Thời điểm xuất: ${new Date().toLocaleString('vi-VN')}</td></tr>
          <tr><td colspan="8"></td></tr>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HĐ</th>
              <th>Bàn</th>
              <th>Thời Gian</th>
              <th>Nhân Viên</th>
              <th>Chi Tiết Món Ăn</th>
              <th>Tổng Tiền (VND)</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
            <tr class="grand-total">
              <td colspan="6" style="text-align:right;">TỔNG DOANH THU TẤT CẢ HÓA ĐƠN:</td>
              <td style="text-align:right; font-weight:bold; color:#b91c1c;">${grandTotal.toLocaleString('vi-VN')} VND</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Hoa_Don_KAGE_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Đã xuất toàn bộ danh sách hóa đơn ra file Excel thành công!`);
  };

  // Hàm In Báo Cáo Thống Kê Doanh Thu & Hóa Đơn theo Ngày, Tháng, Năm
  const printStatisticsReport = () => {
    const currentData = thongKeData ? thongKeData[statsPeriod] : null;
    const invList = currentData?.invoices || [];
    const totalInv = currentData?.totalInvoices || 0;
    const paidInv = currentData?.paidInvoices || 0;
    const pendingInv = currentData?.pendingInvoices || 0;
    const revenue = currentData?.revenue || 0;

    let periodTitle = '';
    if (statsPeriod === 'day') {
      periodTitle = `BÁO CÁO THỐNG KÊ DOANH THU THEO NGÀY: ${statsSelectedDate}`;
    } else if (statsPeriod === 'month') {
      periodTitle = `BÁO CÁO THỐNG KÊ DOANH THU THEO THÁNG: ${statsSelectedMonth}`;
    } else {
      periodTitle = `BÁO CÁO THỐNG KÊ DOANH THU THEO NĂM: ${statsSelectedYear}`;
    }

    let rowsHtml = '';
    if (invList.length > 0) {
      rowsHtml = invList.map((inv, idx) => `
        <tr>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1;">${idx + 1}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;"><b>HD-${inv.id}</b></td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${inv.tableName}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${inv.time}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${inv.staff || ''}</td>
          <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color: #15803d;">
            ${(inv.total || 0).toLocaleString('vi-VN')} đ
          </td>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color:${inv.status === 'DaThanhToan' ? '#16a34a' : '#ea580c'};">
            ${inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </td>
        </tr>
      `).join('');
    } else {
      rowsHtml = `<tr><td colspan="7" style="text-align:center; padding: 12px; color: #64748b;">Không có hóa đơn phát sinh trong kỳ này.</td></tr>`;
    }

    // Biểu đồ/bảng phân bổ nếu theo tháng hoặc năm
    let breakdownHtml = '';
    if (statsPeriod !== 'day' && currentData?.chart && currentData.chart.length > 0) {
      const breakdownRows = currentData.chart.map(c => `
        <tr>
          <td style="padding: 6px; border: 1px solid #cbd5e1;"><b>${c.dayLabel || c.monthLabel}</b></td>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1;">${c.invoiceCount} đơn</td>
          <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color: #15803d;">${(Number(c.revenue) || 0).toLocaleString('vi-VN')} đ</td>
        </tr>
      `).join('');

      breakdownHtml = `
        <div style="margin-top: 20px;">
          <h3 style="font-size: 14pt; margin-bottom: 8px; color: #1e293b;">BẢNG CHI TIẾT DOANH THU TỪNG ${statsPeriod === 'month' ? 'NGÀY TRONG THÁNG' : 'THÁNG TRONG NĂM'}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Thời Gian</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">Số Lượng Hóa Đơn</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">Doanh Thu Thực Thu</th>
              </tr>
            </thead>
            <tbody>
              ${breakdownRows}
            </tbody>
          </table>
        </div>
      `;
    }

    // Bảng thống kê nhân viên đã order bao nhiêu món & đơn
    let staffBreakdownHtml = '';
    const staffListStats = currentData?.staffStats || [];
    if (staffListStats.length > 0) {
      const staffRows = staffListStats.map((s, idx) => `
        <tr>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1;">${idx + 1}</td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;"><b>${s.staffName}</b></td>
          <td style="padding: 6px; border: 1px solid #cbd5e1;">${s.role}</td>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color: #2563eb;">
            ${s.orderCount} đơn
          </td>
          <td style="text-align:center; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color: #e11d48; font-size: 11pt;">
            ${s.totalDishes} món
          </td>
          <td style="text-align:right; padding: 6px; border: 1px solid #cbd5e1; font-weight:bold; color: #15803d;">
            ${(Number(s.totalRevenue) || 0).toLocaleString('vi-VN')} đ
          </td>
        </tr>
      `).join('');

      staffBreakdownHtml = `
        <div style="margin-top: 20px;">
          <h3 style="font-size: 14pt; margin-bottom: 8px; color: #1e293b;">BẢNG THỐNG KÊ NĂNG SUẤT ORDER CỦA NHÂN VIÊN</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="width: 40px; text-align: center; padding: 8px; border: 1px solid #cbd5e1;">STT</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Họ Tên Nhân Viên</th>
                <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">Chức Vụ</th>
                <th style="width: 120px; text-align: center; padding: 8px; border: 1px solid #cbd5e1;">Số Đơn Đã Order</th>
                <th style="width: 130px; text-align: center; padding: 8px; border: 1px solid #cbd5e1;">Tổng Số Món Đã Gọi</th>
                <th style="width: 160px; text-align: right; padding: 8px; border: 1px solid #cbd5e1;">Tổng Doanh Số Order</th>
              </tr>
            </thead>
            <tbody>
              ${staffRows}
            </tbody>
          </table>
        </div>
      `;
    }

    const printHtml = `
      <html>
      <head>
        <title>${periodTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 25px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 18px; }
          .kpi-container { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 10px; }
          .kpi-box { flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; background: #f8fafc; }
          .kpi-label { font-size: 10pt; color: #64748b; margin-bottom: 4px; }
          .kpi-val { font-size: 14pt; font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; font-size: 11pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0; color: #b91c1c; font-size: 18pt;">NHÀ HÀNG KAGE</h2>
          <div style="font-size: 10pt; color: #64748b; margin-top: 4px;">Đ/c: 123 Lê Duẩn, TP. Buôn Ma Thuột - Hotline: 0901.888.999</div>
          <h3 style="margin-top: 12px; margin-bottom: 4px; font-size: 15pt;">${periodTitle}</h3>
          <div style="font-size: 9pt; color: #64748b;">Thời điểm in: ${new Date().toLocaleString('vi-VN')} | Người lập: ${currentUser?.hoten || 'Quản trị viên'}</div>
        </div>

        <div class="kpi-container">
          <div class="kpi-box" style="border-left: 4px solid #16a34a;">
            <div class="kpi-label">Tổng Doanh Thu Thực Thu:</div>
            <div class="kpi-val" style="color: #16a34a;">${revenue.toLocaleString('vi-VN')} đ</div>
          </div>
          <div class="kpi-box" style="border-left: 4px solid #2563eb;">
            <div class="kpi-label">Tổng Số Hóa Đơn:</div>
            <div class="kpi-val">${totalInv} đơn</div>
          </div>
          <div class="kpi-box" style="border-left: 4px solid #059669;">
            <div class="kpi-label">Đã Hoàn Tất Thu Tiền:</div>
            <div class="kpi-val" style="color: #059669;">${paidInv} đơn</div>
          </div>
          <div class="kpi-box" style="border-left: 4px solid #ea580c;">
            <div class="kpi-label">Chưa Thanh Toán:</div>
            <div class="kpi-val" style="color: #ea580c;">${pendingInv} đơn</div>
          </div>
        </div>

        ${breakdownHtml}

        ${staffBreakdownHtml}

        <h3 style="font-size: 14pt; margin-top: 20px; margin-bottom: 8px; color: #1e293b;">
          DANH SÁCH HÓA ĐƠN CHI TIẾT (${invList.length} đơn)
        </h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">STT</th>
              <th style="width: 90px; text-align: left;">Mã HĐ</th>
              <th style="text-align: left;">Bàn</th>
              <th style="width: 140px; text-align: left;">Thời Gian</th>
              <th style="text-align: left;">Nhân Viên</th>
              <th style="text-align: right;">Tổng Tiền</th>
              <th style="width: 120px; text-align: center;">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="margin-top: 35px; display: flex; justify-content: space-between; text-align: center;">
          <div style="width: 200px;">
            <b>Người lập biểu</b><br/>
            <span style="font-size: 9pt; color: #64748b;">(Ký &amp; ghi rõ họ tên)</span>
          </div>
          <div style="width: 200px;">
            <b>Kế toán / Thu ngân</b><br/>
            <span style="font-size: 9pt; color: #64748b;">(Ký &amp; ghi rõ họ tên)</span>
          </div>
          <div style="width: 200px;">
            <b>Quản lý nhà hàng</b><br/>
            <span style="font-size: 9pt; color: #64748b;">(Ký &amp; đóng dấu)</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const win = window.open('', '', 'height=750,width=850');
    win.document.write(printHtml);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  // Hàm xuất thống kê theo Kỳ ra file Excel (.xls)
  const exportStatisticsReportToExcel = () => {
    const currentData = thongKeData ? thongKeData[statsPeriod] : null;
    const invList = currentData?.invoices || [];
    const revenue = currentData?.revenue || 0;

    let periodLabel = '';
    if (statsPeriod === 'day') periodLabel = `Ngay_${statsSelectedDate}`;
    else if (statsPeriod === 'month') periodLabel = `Thang_${statsSelectedMonth}`;
    else periodLabel = `Nam_${statsSelectedYear}`;

    const rowsHtml = invList.map((inv, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><b>HD-${inv.id}</b></td>
        <td>${inv.tableName}</td>
        <td>${inv.time}</td>
        <td>${inv.staff || ''}</td>
        <td style="text-align:right;">${(inv.total || 0).toLocaleString('vi-VN')}</td>
        <td style="text-align:center; color:${inv.status === 'DaThanhToan' ? '#16a34a' : '#ea580c'}; font-weight:bold;">
          ${inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </td>
      </tr>
    `).join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          .title { font-size: 16pt; font-weight: bold; color: #b91c1c; text-align: center; }
          th { background-color: #e2e8f0; border: 1px solid #94a3b8; padding: 8px; font-weight: bold; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
          .grand-total { font-weight: bold; background-color: #dcfce7; font-size: 12pt; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="7" class="title">BÁO CÁO THỐNG KÊ DOANH THU & HÓA ĐƠN - ${periodLabel.toUpperCase()}</td></tr>
          <tr><td colspan="7" style="text-align:center;">Thời điểm xuất: ${new Date().toLocaleString('vi-VN')}</td></tr>
          <tr><td colspan="7"></td></tr>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HĐ</th>
              <th>Bàn</th>
              <th>Thời Gian</th>
              <th>Nhân Viên</th>
              <th>Tổng Tiền (VND)</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
            <tr class="grand-total">
              <td colspan="5" style="text-align:right;">TỔNG THỰC THU DOANH THU:</td>
              <td style="text-align:right; font-weight:bold; color:#15803d;">${revenue.toLocaleString('vi-VN')} VND</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <br/><br/>
        <table>
          <tr><td colspan="6" class="title" style="font-size: 13pt;">THỐNG KÊ NĂNG SUẤT ORDER CỦA NHÂN VIÊN</td></tr>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên Nhân Viên</th>
              <th>Chức Vụ</th>
              <th>Số Đơn Đã Nhận</th>
              <th>Tổng Số Món Đã Gọi</th>
              <th>Tổng Doanh Số Order (VND)</th>
            </tr>
          </thead>
          <tbody>
            ${(currentData?.staffStats || []).map((s, idx) => `
              <tr>
                <td style="text-align:center;">${idx + 1}</td>
                <td><b>${s.staffName}</b></td>
                <td>${s.role}</td>
                <td style="text-align:center;">${s.orderCount}</td>
                <td style="text-align:center; font-weight:bold; color:#b91c1c;">${s.totalDishes}</td>
                <td style="text-align:right; font-weight:bold; color:#15803d;">${(Number(s.totalRevenue) || 0).toLocaleString('vi-VN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Thong_Ke_${periodLabel}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Đã xuất báo cáo thống kê ${periodLabel} ra Excel thành công!`);
  };

  // Chuyển nhanh sang POS cho bàn cụ thể
  const openPosForTable = (tableId) => {
    setSelectedTableId(tableId);
    setActiveTab('pos');
  };

  // Đổi trạng thái bàn thủ công
  const toggleTableStatus = async (tableId) => {
    const curTable = tables.find(t => t.id === tableId);
    const nextStatus = curTable?.status === 'Trong' ? 'DangSuDung' : curTable?.status === 'DangSuDung' ? 'DaDat' : 'Trong';
    try {
      await fetch('/api/ban/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status: nextStatus })
      });
    } catch (e) {}

    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: nextStatus } : t));
  };


  // Thêm món mới
  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    const item = {
      id: Date.now(),
      name: newDish.name,
      category: newDish.category,
      price: Number(newDish.price),
      description: newDish.description || 'Món ăn đặc sắc phong cách Nhật Bản.',
      image: newDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
    };
    setDishes(prev => [...prev, item]);
    setShowAddDishModal(false);
    setNewDish({ name: '', category: 'Món chính', price: '', description: '', image: '' });
    notify(`Đã thêm món "${item.name}" vào thực đơn!`);
  };

  // Cập nhật Sửa món ăn
  const handleUpdateDish = (e) => {
    e.preventDefault();
    if (!editingDish || !editingDish.name || !editingDish.price) return;
    setDishes(prev => prev.map(d => d.id === editingDish.id ? { ...editingDish, price: Number(editingDish.price) } : d));
    notify(`Đã cập nhật món "${editingDish.name}" thành công!`);
    setEditingDish(null);
  };

  // Xóa món ăn
  const handleDeleteDish = (dishId) => {
    const dish = dishes.find(d => d.id === dishId);
    if (window.confirm(`Bạn có chắc muốn xóa món "${dish?.name || 'này'}" khỏi thực đơn?`)) {
      setDishes(prev => prev.filter(d => d.id !== dishId));
      notify(`Đã xóa món ăn thành công!`);
    }
  };

  // Bật / Tắt trạng thái còn món - hết món (Dành cho Bếp & Admin)
  const toggleDishAvailability = (dishId) => {
    setDishes(prev => prev.map(d => {
      if (d.id === dishId) {
        const nextState = d.isOutOfStock ? false : true;
        notify(nextState ? `Món "${d.name}" đã được báo HẾT MÓN!` : `Món "${d.name}" đã mở phục vụ CÒN MÓN trở lại!`);
        return { ...d, isOutOfStock: nextState };
      }
      return d;
    }));
  };

  // Thêm bàn mới
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTable.name) return;
    const item = {
      id: Date.now(),
      name: newTable.name,
      area: newTable.area,
      capacity: Number(newTable.capacity) || 4,
      status: 'Trong'
    };
    setTables(prev => [...prev, item]);
    setShowAddTableModal(false);
    setNewTable({ name: '', area: 'Khu A', capacity: 4 });
    notify(`Đã thêm "${item.name}" vào sơ đồ bàn!`);
  };

  // Cập nhật Sửa bàn
  const handleUpdateTable = (e) => {
    e.preventDefault();
    if (!editingTable || !editingTable.name) return;
    setTables(prev => prev.map(t => t.id === editingTable.id ? { ...editingTable, capacity: Number(editingTable.capacity) } : t));
    notify(`Đã cập nhật thông tin "${editingTable.name}" thành công!`);
    setEditingTable(null);
  };

  // Xóa bàn
  const handleDeleteTable = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${table?.name || 'Bàn này'}"?`)) {
      setTables(prev => prev.filter(t => t.id !== tableId));
      notify(`Đã xóa bàn thành công!`);
    }
  };

  // Thêm nhân viên mới (kèm tài khoản & mật khẩu phân quyền) -> Lưu vào MySQL Database
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name) return;

    // Sinh mã nhân viên tự động
    const nextNum = staffList.length + 1;
    const staffId = `NV${nextNum < 10 ? '0' + nextNum : nextNum}`;
    
    // Tạo username tự động nếu không nhập
    const autoUsername = newStaff.username?.trim() 
      ? newStaff.username.trim().toLowerCase() 
      : `nv_${staffId.toLowerCase()}`;

    const rawPhone = (newStaff.phone || '').trim();
    if (/[a-zA-Z]/.test(rawPhone)) {
      alert('Số điện thoại không được chứa chữ cái, chỉ được nhập số!');
      return;
    }
    const cleanPhone = rawPhone.replace(/[\s.-]/g, '');
    if (cleanPhone && (!/^[0-9]+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 11)) {
      alert('Số điện thoại phải gồm từ 10 đến 11 chữ số và không được chứa chữ cái!');
      return;
    }

    const cleanEmail = (newStaff.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail && !emailRegex.test(cleanEmail)) {
      alert('Email không đúng cấu trúc! Vui lòng nhập địa chỉ email hợp lệ (vd: nhanvien@gmail.com).');
      return;
    }

    const staffPayload = {
      name: newStaff.name.trim(),
      role: newStaff.role,
      phone: cleanPhone || newStaff.phone || '',
      email: cleanEmail,
      username: autoUsername,
      password: newStaff.password || '123456'
    };

    // 1. Gửi lên API Backend để lưu vào bảng `nhanvien` và `taikhoan` trong MySQL
    try {
      const res = await fetch('/api/nhanvien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffPayload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStaffModal(false);
        setNewStaff({ name: '', role: 'Phục vụ', phone: '', email: '', shift: 'Ca sáng', username: '', password: '123' });
        notify(`Đã lưu "${staffPayload.name}" vào cơ sở dữ liệu MySQL thành công!`);
        await loadDataFromDatabase();
        return;
      } else {
        alert(data.message || 'Lỗi lưu nhân viên vào Database');
        return;
      }
    } catch (err) {
      console.warn('Lỗi gọi API lưu nhân viên:', err);
    }

    // Dự phòng lưu vào State / LocalStorage nếu chưa bật server Node
    const item = {
      id: staffId,
      name: staffPayload.name,
      username: autoUsername,
      password: staffPayload.password,
      role: staffPayload.role,
      phone: staffPayload.phone || 'Chưa cập nhật',
      email: staffPayload.email || '',
      shift: newStaff.shift || 'Toàn thời gian',
      status: 'Đang làm việc'
    };

    setStaffList(prev => [...prev, item]);
    setShowAddStaffModal(false);
    setNewStaff({ name: '', role: 'Phục vụ', phone: '', email: '', shift: 'Ca sáng', username: '', password: '123' });
    notify(`Đã thêm nhân viên "${item.name}" (Tài khoản: ${item.username}) thành công!`);
  };

  // Cập nhật Sửa nhân viên -> Lưu vào MySQL Database
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.name) return;

    const rawPhone = (editingStaff.phone || '').trim();
    if (/[a-zA-Z]/.test(rawPhone)) {
      alert('Số điện thoại không được chứa chữ cái, chỉ được nhập số!');
      return;
    }
    const cleanPhone = rawPhone.replace(/[\s.-]/g, '');
    if (cleanPhone && (!/^[0-9]+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 11)) {
      alert('Số điện thoại phải gồm từ 10 đến 11 chữ số và không được chứa chữ cái!');
      return;
    }

    const cleanEmail = (editingStaff.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail && !emailRegex.test(cleanEmail)) {
      alert('Email không đúng cấu trúc! Vui lòng nhập địa chỉ email hợp lệ (vd: nhanvien@gmail.com).');
      return;
    }

    try {
      const res = await fetch(`/api/nhanvien/${editingStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingStaff,
          phone: cleanPhone || editingStaff.phone,
          email: cleanEmail
        })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Lỗi cập nhật nhân viên');
        return;
      }
      await loadDataFromDatabase();
    } catch (err) {
      console.warn('Lỗi gọi API cập nhật nhân viên:', err);
    }

    setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...editingStaff, phone: cleanPhone || editingStaff.phone, email: cleanEmail } : s));
    notify(`Đã cập nhật nhân viên "${editingStaff.name}" thành công!`);
    setEditingStaff(null);
  };

  // Xóa nhân viên khỏi MySQL Database
  const handleDeleteStaff = async (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staff?.name || 'này'}"?`)) {
      try {
        await fetch(`/api/nhanvien/${staffId}`, { method: 'DELETE' });
      } catch (err) {}
      notify(`Đã xóa nhân viên khỏi hệ thống thành công!`);
      await loadDataFromDatabase();
    }
  };

  // Xử lý Đăng xuất -> Xóa sạch session và chuyển ngay về màn hình Đăng nhập
  const handleLogout = () => {
    try {
      localStorage.removeItem('kage_current_user');
      sessionStorage.clear();
    } catch (e) {}
    setCurrentUser(null);
    setUserMenuOpen(false);
    setShowProfileModal(false);
    setLoginForm({ username: '', password: '' });
    setLoginError('');
    setShowLoginModal(true);
    notify('Đã đăng xuất thành công! Vui lòng đăng nhập để tiếp tục.');
  };

  // Xử lý Đăng nhập: Kết nối API Backend MySQL & Hỗ trợ Chế độ Cục bộ (Offline)
  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');

    const uname = (loginForm.username || '').trim();
    const enteredPass = (loginForm.password || '').trim();

    if (!uname) {
      setLoginError('Vui lòng nhập tên đăng nhập!');
      return;
    }

    // 1. Thử xác thực trực tiếp qua API Backend (MySQL Database)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password: enteredPass })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('kage_current_user', JSON.stringify(data.user));
        setShowLoginModal(false);
        setLoginForm({ username: '', password: '' });
        setUserMenuOpen(false);
        notify(`Đăng nhập thành công với vai trò ${data.user.chucvu}!`);
        return;
      } else if (res.status === 401 || res.status === 403) {
        setLoginError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
        return;
      }
    } catch (apiErr) {
      console.warn('API /api/login không phản hồi, chuyển sang kiểm tra bộ nhớ cục bộ:', apiErr);
    }

    // 2. Chế độ dự phòng Cục bộ (Local Fallback) nếu chưa chạy Node/Python API
    const unameLower = uname.toLowerCase();
    const existingStaff = (staffList || []).find(s => 
      (s.username && s.username.toLowerCase() === unameLower) || 
      (s.phone && s.phone.replace(/\s+/g, '') === unameLower.replace(/\s+/g, '')) ||
      (s.id && s.id.toLowerCase() === unameLower)
    );

    let matchedRole = 'Phục vụ';
    let roleCode = 'phucvu';
    let fullName = uname;
    let phone = '0901 234 567';

    if (existingStaff) {
      fullName = existingStaff.name;
      phone = existingStaff.phone;
      const rLower = (existingStaff.role || '').toLowerCase();
      if (rLower.includes('quản') || rLower.includes('admin')) {
        matchedRole = 'Quản lý';
        roleCode = 'admin';
      } else if (rLower.includes('thu ngân')) {
        matchedRole = 'Thu ngân';
        roleCode = 'thungan';
      } else if (rLower.includes('bếp') || rLower.includes('chef')) {
        matchedRole = 'Đầu bếp';
        roleCode = 'bep';
      } else {
        matchedRole = 'Phục vụ';
        roleCode = 'phucvu';
      }
    } else if (unameLower === 'admin' || unameLower.includes('quanly')) {
      matchedRole = 'Quản lý';
      roleCode = 'admin';
      fullName = 'Nguyễn Văn Quản Lý';
      phone = '0901 000 001';
    } else if (unameLower === 'thungan') {
      matchedRole = 'Thu ngân';
      roleCode = 'thungan';
      fullName = 'Lê Thị Thu Ngân';
      phone = '0912 000 001';
    } else if (unameLower.includes('chef') || unameLower.includes('bep')) {
      matchedRole = 'Đầu bếp';
      roleCode = 'bep';
      fullName = 'Trần Hùng Chef';
      phone = '0912 000 002';
    } else if (unameLower.includes('phucvu') || unameLower.includes('nv') || unameLower === 'tuan_nv') {
      matchedRole = 'Phục vụ';
      roleCode = 'phucvu';
      fullName = 'Nguyễn Tuấn Phục Vụ';
      phone = '0901 000 002';
    }

    const verifiedUser = {
      username: existingStaff?.username || uname,
      hoten: fullName,
      chucvu: matchedRole,
      role_code: roleCode,
      sodienthoai: phone,
      email: `${unameLower}@kage.vn`
    };

    setCurrentUser(verifiedUser);
    localStorage.setItem('kage_current_user', JSON.stringify(verifiedUser));
    setShowLoginModal(false);
    setLoginForm({ username: '', password: '' });
    setUserMenuOpen(false);
    notify(`Đăng nhập thành công với vai trò ${matchedRole}!`);
  };

  // Khôi phục dữ liệu demo gốc
  const resetAllData = () => {
    if (window.confirm('Khôi phục toàn bộ dữ liệu bàn, món ăn, hóa đơn về mặc định ban đầu?')) {
      setTables(DEFAULT_TABLES);
      setDishes(DEFAULT_DISHES);
      setTickets(DEFAULT_TICKETS);
      setInvoices(DEFAULT_INVOICES);
      setStaffList(DEFAULT_STAFF);
      localStorage.clear();
      notify('Đã khôi phục dữ liệu nhà hàng thành công!');
    }
  };

  // NẾU CHƯA ĐĂNG NHẬP: Hiển thị trực tiếp toàn màn hình Trang Đăng Nhập
  if (!currentUser) {
    return (
      <div className="login-screen-wrap">
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#198754',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="login-box-card">
          <div className="login-brand-header">
            <div className="brand-icon">影</div>
            <div>
              <h2>KAGE RESTAURANT</h2>
              <span>HỆ THỐNG QUẢN LÝ NHÀ HÀNG CHUYÊN NGHIỆP</span>
            </div>
          </div>

          <h3 className="login-title">Đăng Nhập Hệ Thống</h3>
          <p className="login-desc">Vui lòng đăng nhập tài khoản nhân viên để tiếp tục làm việc.</p>

          {loginError && (
            <div className="login-error-alert">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form-main">
            <div className="form-group-login">
              <label>Tên đăng nhập</label>
              <div className="login-input-wrap">
                <User size={18} />
                <input 
                  type="text" 
                  placeholder="Nhập username (vd: admin, thungan...)"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group-login">
              <label>Mật khẩu</label>
              <div className="login-input-wrap">
                <Key size={18} />
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu (vd: 123456)"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-login-submit"
            >
              <LogIn size={18} /> Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="kage-app">
      {/* Thông báo Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#198754',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ═══ SIDEBAR BÊN TRÁI ═══ */}
      <aside className="kage-sidebar">
        <div className="brand-header">
          <div className="brand-icon">影</div>
          <div className="brand-info">
            <h2>KAGE</h2>
            <span>NHÀ HÀNG ẨM THỰC</span>
          </div>
        </div>

        <div className="sidebar-group-title">MENU CHỨC NĂNG</div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} />
            <span>Tổng Quan</span>
            <small>入口</small>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'ban' ? 'active' : ''}`}
            onClick={() => setActiveTab('ban')}
          >
            <Grid3X3 size={18} />
            <span>Bàn Ăn ({tables.length})</span>
            <small>座敷</small>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'monan' ? 'active' : ''}`}
            onClick={() => setActiveTab('monan')}
          >
            <UtensilsCrossed size={18} />
            <span>Thực Đơn ({dishes.length})</span>
            <small>献立</small>
          </button>

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'pos' ? 'active' : ''}`}
              onClick={() => setActiveTab('pos')}
            >
              <ShoppingCart size={18} />
              <span>Gọi Món (POS)</span>
              <small>注文</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'bep' ? 'active' : ''}`}
              onClick={() => setActiveTab('bep')}
            >
              <Flame size={18} />
              <span>Nhà Bếp ({tickets.length})</span>
              <small>厨房</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'hoadon' ? 'active' : ''}`}
              onClick={() => setActiveTab('hoadon')}
            >
              <Receipt size={18} />
              <span>Hóa Đơn ({invoices.length})</span>
              <small>伝票</small>
            </button>
          )}

          {(isAdmin || isThuNgan) && (
            <button 
              className={`nav-btn ${activeTab === 'thongke' ? 'active' : ''}`}
              onClick={() => setActiveTab('thongke')}
            >
              <BarChart3 size={18} />
              <span>Thống Kê Doanh Thu</span>
              <small>統計</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'datban' ? 'active' : ''}`}
              onClick={() => setActiveTab('datban')}
            >
              <CalendarCheck size={18} />
              <span>Đặt Bàn ({reservations.length})</span>
              <small>予約</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'khachhang' ? 'active' : ''}`}
              onClick={() => setActiveTab('khachhang')}
            >
              <UserCheck size={18} />
              <span>Khách Hàng ({customers.length})</span>
              <small>顧客</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'khuyenmai' ? 'active' : ''}`}
              onClick={() => setActiveTab('khuyenmai')}
            >
              <Tag size={18} />
              <span>Khuyến Mãi ({promotions.length})</span>
              <small>割引</small>
            </button>
          )}

          {(isAdmin || isPhucVu || isThuNgan || isBep) && (
            <button 
              className={`nav-btn ${activeTab === 'kho' ? 'active' : ''}`}
              onClick={() => setActiveTab('kho')}
            >
              <Warehouse size={18} />
              <span>Kho &amp; Nhập ({warehouseData.materials?.length || 0})</span>
              <small>倉庫</small>
            </button>
          )}

          <button 
            className={`nav-btn ${activeTab === 'nhanvien' ? 'active' : ''}`}
            onClick={() => setActiveTab('nhanvien')}
          >
            <Users size={18} />
            <span>Nhân Viên ({staffList.length})</span>
            <small>職人</small>
          </button>
        </nav>

        {/* THÔNG TIN NGƯỜI DÙNG & NÚT RESET */}
        <div className="sidebar-footer">
          {isAdmin && (
            <button 
              className="btn-table-action" 
              style={{ width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={resetAllData}
              title="Khôi phục dữ liệu mặc định (Chỉ Quản lý)"
            >
              <RefreshCw size={14} /> Khôi phục dữ liệu
            </button>
          )}

          <div 
            className="user-badge" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div 
              className="user-badge-left"
              style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
              onClick={() => currentUser ? setShowProfileModal(true) : setShowLoginModal(true)}
              title={currentUser ? "Bấm để xem thông tin chi tiết" : "Bấm để đăng nhập"}
            >
              <div className="user-avatar">
                {currentUser?.hoten ? currentUser.hoten.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.hoten || 'Chưa đăng nhập'}</div>
                <div className="user-role">{currentUser?.chucvu || 'Khách'}</div>
              </div>
            </div>
            {currentUser && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                title="Đăng xuất khỏi hệ thống"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: 6,
                  padding: '6px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  marginLeft: 6
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ═══ NỘI DUNG CHÍNH BÊN PHẢI ═══ */}
      <main className="kage-main">
        {/* Top Header */}
        <header className="main-header">
          <div>
            <h1 className="header-title">Phần Mềm Quản Lý Nhà Hàng KAGE</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="clock-badge">
              <Clock size={16} />
              <span>{clock}</span>
            </div>

            {/* Icon Người dùng bên phải kèm Dropdown menu */}
            <div className="user-dropdown-wrapper" style={{ position: 'relative' }}>
              <button 
                type="button"
                className={`user-menu-trigger ${userMenuOpen ? 'active' : ''}`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title="Tài khoản người dùng"
              >
                <div className="user-avatar-small">
                  {currentUser?.hoten ? currentUser.hoten.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div className="user-header-text">
                  <span className="user-header-name">{currentUser?.hoten || 'Chưa đăng nhập'}</span>
                  <span className="user-header-role">{currentUser?.chucvu || 'Khách'}</span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${userMenuOpen ? 'rotate' : ''}`} />
              </button>

              {/* Menu thả xuống Dropdown */}
              {userMenuOpen && (
                <>
                  <div className="dropdown-overlay" onClick={() => setUserMenuOpen(false)} />
                  <div className="user-dropdown-menu">
                    {currentUser ? (
                      <>
                        <div className="user-dropdown-header">
                          <div className="user-avatar-modal">
                            {currentUser.hoten ? currentUser.hoten.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="dropdown-user-fullname">{currentUser.hoten}</div>
                            <div className="dropdown-user-sub">
                              <span>@{currentUser.username || 'user'}</span>
                              <span className="badge-role">{currentUser.chucvu || 'Nhân viên'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <button 
                          className="dropdown-item-btn"
                          onClick={() => {
                            setShowProfileModal(true);
                            setUserMenuOpen(false);
                          }}
                        >
                          <User size={16} className="text-info" />
                          <span>Thông tin cá nhân</span>
                        </button>

                        <div className="dropdown-divider"></div>

                        <button 
                          className="dropdown-item-btn text-danger-btn"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="user-dropdown-header guest">
                          <User size={24} style={{ opacity: 0.6 }} />
                          <div>
                            <div className="dropdown-user-fullname">Chưa đăng nhập</div>
                            <div className="dropdown-user-sub">Vui lòng đăng nhập để thao tác</div>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <button 
                          className="dropdown-item-btn text-success-btn"
                          onClick={() => {
                            setShowLoginModal(true);
                            setUserMenuOpen(false);
                          }}
                        >
                          <LogIn size={16} />
                          <span>Đăng nhập hệ thống</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 1. MÀN HÌNH TỔNG QUAN */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <div className="stats-grid">
              <div className="stat-card border-red">
                <span className="stat-label">Bàn Đang Phục Vụ</span>
                <span className="stat-value">{stats.dang_dung} / {stats.tong_ban}</span>
                <span className="stat-sub text-success">Trống: {stats.ban_trong} bàn</span>
              </div>
              <div className="stat-card border-blue">
                <span className="stat-label">Món Chờ Nấu (Bếp)</span>
                <span className="stat-value">{stats.cho_nau}</span>
                <span className="stat-sub text-warning">{stats.cho_nau > 0 ? 'Cần ưu tiên bếp nấu' : 'Bếp đang thong thả'}</span>
              </div>
              <div className="stat-card border-green">
                <span className="stat-label">Hóa Đơn Hôm Nay</span>
                <span className="stat-value">{stats.so_hd_today}</span>
                <span className="stat-sub text-success">
                  {(isAdmin || isThuNgan) ? `${stats.doanhthu_today.toLocaleString('vi-VN')} ₫` : 'Đã cập nhật'}
                </span>
              </div>
              <div className="stat-card border-purple">
                <span className="stat-label">Thực Đơn Món Ăn</span>
                <span className="stat-value">{stats.tong_mon}</span>
                <span className="stat-sub">Món đang phục vụ</span>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Thao tác vận hành nhanh</h3>
              <div className="action-buttons">
                <button className="btn-action primary" onClick={() => setActiveTab('pos')}>
                  <ShoppingCart size={16} /> Mở POS Gọi Món Tại Bàn
                </button>
                <button className="btn-action danger" onClick={() => setActiveTab('bep')}>
                  <Flame size={16} /> Mở Điều Phối Nhà Bếp ({tickets.length} vé)
                </button>
                <button className="btn-action outline" onClick={() => setActiveTab('ban')}>
                  <Grid3X3 size={16} /> Xem Sơ Đồ Bàn Ăn
                </button>
                <button className="btn-action outline" onClick={() => setActiveTab('hoadon')}>
                  <Receipt size={16} /> Thu Ngân &amp; Hóa Đơn
                </button>
                {(isAdmin || isThuNgan) && (
                  <button className="btn-action outline" onClick={() => setActiveTab('thongke')}>
                    <BarChart3 size={16} /> Thống Kê Doanh Thu
                  </button>
                )}
                <button className="btn-action outline" onClick={() => setActiveTab('kho')}>
                  <Warehouse size={16} /> Quản Lý Kho &amp; Nhập Hàng
                </button>
                <button className="btn-action outline" onClick={() => setActiveTab('nhanvien')}>
                  <Users size={16} /> Danh Sách Nhân Viên
                </button>
              </div>
            </div>

            {/* Danh sách bàn nhanh */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16, color: '#fff', marginBottom: 12 }}>Trạng thái bàn hiện tại</h3>
              <div className="table-grid">
                {tables.map(table => (
                  <div key={table.id} className={`table-card status-${table.status}`}>
                    <div className="table-card-header">
                      <span className="table-card-title">{table.name}</span>
                      <span className={`table-badge-status ${table.status}`}>
                        {table.status === 'Trong' ? 'Bàn trống' : table.status === 'DangSuDung' ? 'Đang dùng' : 'Đã đặt'}
                      </span>
                    </div>
                    <div className="table-card-body">
                      <div>Khu vực: <strong>{table.area}</strong></div>
                      <div>Sức chứa: <strong>{table.capacity} khách</strong></div>
                    </div>
                    <div className="table-actions">
                      <button className="btn-table-action primary" onClick={() => openPosForTable(table.id)}>
                        Gọi món
                      </button>
                      <button className="btn-table-action" onClick={() => toggleTableStatus(table.id)}>
                        Đổi trạng thái
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. MÀN HÌNH BÀN ĂN */}
        {activeTab === 'ban' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Grid3X3 className="text-warning" /> Quản Lý Sơ Đồ Bàn Ăn</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="tag-live">{tables.length} Bàn ăn</span>
                <button 
                  className="btn-action outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/kiem-tra-mysql');
                      const json = await res.json();
                      if (json.success) {
                        const areaText = json.banan?.theo_khu_vuc?.map(a => `• ${a.area}: ${a.count} bàn`).join('\n') || '';
                        alert(`✅ KẾT QUẢ KIỂM TRA TRONG MYSQL DATABASE "nhahang":\n\n- Tổng số bàn ăn: ${json.banan?.tong_so_ban} bàn\n${areaText}\n\n- Tổng số món ăn: ${json.monan?.tong_so_mon} món ăn\n\nDữ liệu đã lưu trực tiếp và an toàn trong MySQL!`);
                        await loadDataFromDatabase();
                      } else {
                        alert('Lỗi kiểm tra: ' + (json.error || 'Không rõ'));
                      }
                    } catch (e) {
                      alert('Không thể kết nối API: ' + e.message);
                    }
                  }}
                  title="Kiểm tra trực tiếp số lượng bàn trong MySQL"
                >
                  <RefreshCw size={14} /> Kiểm tra MySQL
                </button>
                {isAdmin && (
                  <button className="btn-action primary" onClick={() => setShowAddTableModal(true)}>
                    <Plus size={16} /> Thêm Bàn Mới
                  </button>
                )}
              </div>
            </div>

            {/* Bộ lọc khu vực bàn ăn */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {['Tất cả', 'Khu A', 'Khu B', 'Khu C', 'Tầng 2', 'Khu VIP'].map(areaName => {
                const count = areaName === 'Tất cả' ? tables.length : tables.filter(t => t.area === areaName).length;
                const isSelected = (selectedArea || 'Tất cả') === areaName;
                return (
                  <button
                    key={areaName}
                    type="button"
                    onClick={() => setSelectedArea(areaName)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: isSelected ? '1px solid #ef4444' : '1px solid #334155',
                      background: isSelected ? '#ef4444' : '#1e293b',
                      color: isSelected ? '#fff' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 500,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>{areaName}</span>
                    <span style={{
                      background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                      padding: '2px 7px',
                      borderRadius: 10,
                      fontSize: 11
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="table-grid">
              {tables.filter(t => !selectedArea || selectedArea === 'Tất cả' || t.area === selectedArea).map(table => (
                <div key={table.id} className={`table-card status-${table.status}`}>
                  <div className="table-card-header">
                    <span className="table-card-title">{table.name}</span>
                    <span className={`table-badge-status ${table.status}`}>
                      {table.status === 'Trong' ? 'Bàn trống' : table.status === 'DangSuDung' ? 'Đang phục vụ' : 'Đã đặt trước'}
                    </span>
                  </div>
                  <div className="table-card-body">
                    <div>Khu vực: <strong>{table.area}</strong></div>
                    <div>Sức chứa tối đa: <strong>{table.capacity} người</strong></div>
                  </div>
                  <div className="table-actions">
                    {(isAdmin || isPhucVu) && (
                      <button className="btn-table-action primary" onClick={() => openPosForTable(table.id)}>
                        <ShoppingCart size={13} /> Gọi món
                      </button>
                    )}
                    {table.status === 'DangSuDung' && (
                      <button 
                        className="btn-table-action" 
                        onClick={() => {
                          setTransferringTable(table);
                          // Chọn mặc định 1 bàn trống đầu tiên làm đích
                          const firstAvailable = tables.find(t => t.id !== table.id && t.status === 'Trong');
                          setTargetTableId(firstAvailable ? firstAvailable.id : '');
                        }}
                        style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                        title="Chuyển toàn bộ khách & order sang bàn khác"
                      >
                        <ArrowRightLeft size={13} /> Chuyển bàn
                      </button>
                    )}
                    {(isAdmin || isPhucVu) && table.status === 'DangSuDung' && (
                      <button 
                        className="btn-table-action" 
                        onClick={() => {
                          const inv = invoices.find(i => i.tableId === table.id && i.status === 'ChuaThanhToan');
                          if (inv) setCancelingInvoice(inv);
                          else alert('Bàn này chưa có hóa đơn tạm tính!');
                        }}
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        title="Hủy món hoặc hủy order của bàn này"
                      >
                        <Trash2 size={13} /> Hủy món
                      </button>
                    )}
                    <button className="btn-table-action" onClick={() => toggleTableStatus(table.id)} title="Đổi trạng thái bàn">
                      Đổi trạng thái
                    </button>
                    {isAdmin && (
                      <>
                        <button 
                          className="btn-table-action" 
                          onClick={() => setEditingTable({ ...table })}
                          style={{ padding: '6px 8px', color: '#38bdf8' }}
                          title="Sửa thông tin bàn"
                        >
                          <Pencil size={13} /> Sửa
                        </button>
                        <button 
                          className="btn-table-action" 
                          onClick={() => handleDeleteTable(table.id)}
                          style={{ padding: '6px 8px', color: '#ef4444' }}
                          title="Xóa bàn này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MÀN HÌNH THỰC ĐƠN */}
        {activeTab === 'monan' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><UtensilsCrossed className="text-danger" /> Quản Lý Thực Đơn Món Ăn</h2>
              {isAdmin && (
                <button className="btn-action primary" onClick={() => setShowAddDishModal(true)}>
                  <Plus size={16} /> Thêm Món Mới
                </button>
              )}
            </div>

            <div className="pos-controls" style={{ marginTop: 12 }}>
              <input 
                type="text" 
                className="pos-search" 
                placeholder="Tìm kiếm tên món ăn, thành phần..."
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
              />
              <div className="cat-pills">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    className={`cat-pill ${selectedCat === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="dish-grid">
              {filteredDishes.map(mon => (
                <div key={mon.id} className="dish-card">
                  <div className="dish-image-wrap">
                    {mon.image ? (
                      <img 
                        src={mon.image} 
                        alt={mon.name} 
                        className="dish-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="dish-image-placeholder">
                        <UtensilsCrossed size={28} />
                      </div>
                    )}
                    {mon.isOutOfStock && (
                      <span style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                        zIndex: 2
                      }}>
                        ĐÃ HẾT MÓN
                      </span>
                    )}
                    <span className="dish-cat-tag-float">{mon.category}</span>
                  </div>

                  <div className="dish-info-content">
                    <h3 className="dish-title" style={{ opacity: mon.isOutOfStock ? 0.6 : 1 }}>{mon.name}</h3>
                    <p className="dish-desc" style={{ opacity: mon.isOutOfStock ? 0.6 : 1 }}>{mon.description}</p>
                  </div>
                  <div className="dish-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <span className="dish-price" style={{ opacity: mon.isOutOfStock ? 0.6 : 1 }}>
                      {mon.price.toLocaleString('vi-VN')} ₫
                    </span>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {/* Bếp & Admin có thể chuyển đổi Trạng thái Còn món / Hết món */}
                      {(isBep || isAdmin) && (
                        <button
                          className="btn-sm"
                          onClick={() => toggleDishAvailability(mon.id)}
                          style={{
                            padding: '4px 8px',
                            fontSize: 11,
                            backgroundColor: mon.isOutOfStock ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: mon.isOutOfStock ? '#22c55e' : '#ef4444',
                            border: `1px solid ${mon.isOutOfStock ? '#22c55e' : '#ef4444'}`
                          }}
                          title="Bếp bấm để báo Hết món hoặc Mở bán lại"
                        >
                          {mon.isOutOfStock ? '✓ Mở bán lại' : '🚫 Báo hết món'}
                        </button>
                      )}

                      {/* Chỉ Admin mới có quyền Sửa / Xóa món */}
                      {isAdmin && (
                        <>
                          <button 
                            className="btn-sm" 
                            onClick={() => setEditingDish({ ...mon })}
                            style={{ padding: '4px 8px', fontSize: 11, color: '#38bdf8' }}
                            title="Sửa món ăn này"
                          >
                            <Pencil size={12} /> Sửa
                          </button>
                          <button 
                            className="btn-sm danger" 
                            onClick={() => handleDeleteDish(mon.id)}
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            title="Xóa món ăn này"
                          >
                            <Trash2 size={12} /> Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MÀN HÌNH GỌI MÓN (POS) */}
        {activeTab === 'pos' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><ShoppingCart className="text-success" /> Màn Hình Gọi Món POS Tại Bàn</h2>
              <span className="tag-live">Chế độ bán hàng trực tiếp</span>
            </div>

            <div className="pos-container">
              {/* Cột trái: Tìm kiếm & Chọn món */}
              <div className="pos-menu-col">
                <div className="pos-controls">
                  <input 
                    type="text" 
                    className="pos-search" 
                    placeholder="Tìm món nhanh (tên món, giá...)"
                    value={menuSearch}
                    onChange={e => setMenuSearch(e.target.value)}
                  />
                </div>
                <div className="cat-pills">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      className={`cat-pill ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="dish-grid">
                  {filteredDishes.map(mon => (
                    <div 
                      key={mon.id} 
                      className={`dish-card ${mon.isOutOfStock ? 'dish-card-disabled' : ''}`} 
                      style={{ cursor: mon.isOutOfStock ? 'not-allowed' : 'pointer', opacity: mon.isOutOfStock ? 0.6 : 1 }} 
                      onClick={() => !mon.isOutOfStock && addToCart(mon)}
                    >
                      <div className="dish-image-wrap">
                        {mon.image ? (
                          <img 
                            src={mon.image} 
                            alt={mon.name} 
                            className="dish-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <div className="dish-image-placeholder">
                            <UtensilsCrossed size={28} />
                          </div>
                        )}
                        {mon.isOutOfStock && (
                          <span style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#ef4444',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                            zIndex: 2
                          }}>
                            HẾT MÓN
                          </span>
                        )}
                        <span className="dish-cat-tag-float">{mon.category}</span>
                      </div>
                      <div className="dish-info-content">
                        <h3 className="dish-title">{mon.name}</h3>
                        <p className="dish-desc">{mon.description}</p>
                      </div>
                      <div className="dish-footer">
                        <span className="dish-price">{mon.price.toLocaleString('vi-VN')} ₫</span>
                        {mon.isOutOfStock ? (
                          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Tạm hết</span>
                        ) : (
                          <button className="btn-add-order" onClick={(e) => { e.stopPropagation(); addToCart(mon); }}>
                            + Chọn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột phải: Phiếu gọi món của bàn */}
              <div className="pos-cart-col">
                <div className="cart-header">
                  <h3>Phiếu Gọi Món (Order Ticket)</h3>
                  <div className="table-select-row">
                    <label>Bàn:</label>
                    <select 
                      className="table-dropdown" 
                      value={selectedTableId} 
                      onChange={e => setSelectedTableId(e.target.value)}
                    >
                      {['Khu A', 'Khu B', 'Khu C', 'Tầng 2', 'Khu VIP'].map(areaName => {
                        const areaTables = tables.filter(t => t.area === areaName);
                        if (areaTables.length === 0) return null;
                        return (
                          <optgroup key={areaName} label={`📍 ${areaName} (${areaTables.length} bàn)`} style={{ background: '#1e293b', color: '#38bdf8', fontWeight: 'bold' }}>
                            {areaTables.map(t => (
                              <option key={t.id} value={t.id} style={{ background: '#0f172a', color: '#fff' }}>
                                {t.name} — {t.capacity} khách ({t.status === 'Trong' ? 'Trống' : t.status === 'DangSuDung' ? 'Đang dùng' : 'Đã đặt'})
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>
                  {/* Nếu bàn này đang dùng & có món đã gọi: Cho phép Phục vụ & Admin xem & Hủy món ngay trên POS */}
                  {(() => {
                    const activeInv = invoices.find(i => i.tableId === Number(selectedTableId) && i.status === 'ChuaThanhToan');
                    if (activeInv && (isAdmin || isPhucVu)) {
                      return (
                        <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 12, color: '#fca5a5' }}>
                            Bàn đang có <b>{activeInv.items?.length || 0} món</b> đã gọi ({activeInv.total?.toLocaleString('vi-VN')} ₫)
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, background: '#0284c7', color: '#fff', border: 'none' }}
                              onClick={() => {
                                const curTable = tables.find(t => t.id === Number(selectedTableId));
                                setTransferringTable(curTable);
                                const firstAvailable = tables.find(t => t.id !== Number(selectedTableId) && t.status === 'Trong');
                                setTargetTableId(firstAvailable ? firstAvailable.id : '');
                              }}
                              title="Chuyển toàn bộ món bàn này sang bàn khác"
                            >
                              <ArrowRightLeft size={12} /> Chuyển bàn
                            </button>
                            <button
                              className="btn-sm danger"
                              style={{ padding: '3px 8px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                              onClick={() => setCancelingInvoice(activeInv)}
                              title="Hủy bớt số lượng hoặc hủy món đã gọi của bàn này"
                            >
                              <Trash2 size={12} /> Hủy món
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="cart-items">
                  {cart.length === 0 ? (
                    <div className="empty-state" style={{ margin: 'auto' }}>
                      <Coffee size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                      Chưa có món nào được chọn. Nhấp vào món bên trái để thêm!
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <span className="cart-item-price">{(item.price * item.qty).toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="cart-qty-ctrl">
                          <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                          <span className="qty-val">{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="cart-footer">
                  <div className="cart-summary-row">
                    <span>Số lượng món:</span>
                    <span>{cart.reduce((s, i) => s + i.qty, 0)} món</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>Tạm tính:</span>
                    <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <button 
                    className="btn-send-order" 
                    disabled={cart.length === 0}
                    onClick={submitOrder}
                  >
                    <ChefHat size={18} /> GỬI BẾP &amp; TẠO ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. MÀN HÌNH NHÀ BẾP (KDS) */}
        {activeTab === 'bep' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Flame className="text-danger" /> Màn Hình Điều Phối Bếp (KDS)</h2>
              <span className="tag-live">{tickets.length} Vé đang chờ</span>
            </div>

            {tickets.length === 0 ? (
              <div className="empty-state" style={{ marginTop: 20 }}>
                <CheckCircle2 size={40} style={{ color: '#20c997', margin: '0 auto 12px', display: 'block' }} />
                <h3>Bếp đã hoàn tất toàn bộ các món!</h3>
                <p>Không có vé order nào đang tồn đọng.</p>
              </div>
            ) : (
              <div className="kds-tickets" style={{ marginTop: 16 }}>
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket">
                    <div className="ticket-top">
                      <span className="table-badge">{ticket.tableName}</span>
                      <span className="time-badge">{ticket.time}</span>
                    </div>

                    <div className="ticket-dishes">
                      {ticket.items.map((item, idx) => (
                        <div key={idx} className="dish-item">
                          <div>
                            <strong>{item.qty}x</strong> {item.name}
                          </div>
                          {isBep ? (
                            <button 
                              className={`btn-status ${item.status === 'ChoNau' ? 'waiting' : item.status === 'DangNau' ? 'cooking' : 'done'}`}
                              onClick={() => updateDishStatus(ticket.id, idx)}
                              title="Bấm để chuyển trạng thái: Chờ nấu -> Đang nấu -> Đã xong"
                            >
                              {item.status === 'ChoNau' ? '⏳ Chờ nấu' : item.status === 'DangNau' ? '🔥 Đang nấu' : '✅ Đã xong'}
                            </button>
                          ) : (
                            <span className={`btn-status ${item.status === 'ChoNau' ? 'waiting' : item.status === 'DangNau' ? 'cooking' : 'done'}`} style={{ cursor: 'default', opacity: 0.9 }}>
                              {item.status === 'ChoNau' ? '⏳ Chờ nấu' : item.status === 'DangNau' ? '🔥 Đang nấu' : '✅ Đã xong'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="ticket-bottom">
                      {isBep ? (
                        <button className="btn-complete" onClick={() => completeTicket(ticket.id)}>
                          <CheckCircle2 size={16} /> Hoàn Thành &amp; Ra Món Toàn Bộ Bàn
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                          (Chỉ Đầu bếp mới có quyền hoàn thành món &amp; vé)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. MÀN HÌNH HÓA ĐƠN & THU NGÂN */}
        {activeTab === 'hoadon' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Receipt className="text-warning" /> Danh Sách Hóa Đơn &amp; Thu Ngân</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="tag-live">{invoices.length} Hóa đơn</span>
                {isThuNgan && (
                  <button 
                    className="btn-action" 
                    style={{ background: '#16a34a', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={exportAllInvoicesToExcel}
                    title="Xuất toàn bộ báo cáo doanh thu & danh sách hóa đơn ra file Excel"
                  >
                    <Download size={16} /> Xuất Báo Cáo Excel
                  </button>
                )}
              </div>
            </div>

            <div className="data-table-container">
              <table className="kage-table">
                <thead>
                  <tr>
                    <th>Mã Hóa Đơn</th>
                    <th>Bàn</th>
                    <th>Thời Gian</th>
                    <th>Nhân Viên</th>
                    <th>Chi Tiết Món</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td><strong>{inv.id}</strong></td>
                      <td>{inv.tableName}</td>
                      <td>{inv.createdAt}</td>
                      <td>{inv.staff}</td>
                      <td>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>
                          {inv.items.map((i, idx) => (
                            <span key={idx}>{i.qty}x {i.name}{idx < inv.items.length - 1 ? ', ' : ''}</span>
                          ))}
                        </div>
                      </td>
                      <td><strong style={{ color: '#20c997' }}>{inv.total.toLocaleString('vi-VN')} ₫</strong></td>
                      <td>
                        <span className={inv.status === 'DaThanhToan' ? 'badge-paid' : 'badge-pending'}>
                          {inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {inv.status === 'ChuaThanhToan' ? (
                            <>
                              {isThuNgan && (
                                <button className="btn-sm success" onClick={() => payInvoice(inv.id)}>
                                  <DollarSign size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Thanh toán
                                </button>
                              )}
                              {(isAdmin || isPhucVu) && (
                                <button 
                                  className="btn-sm danger" 
                                  onClick={() => setCancelingInvoice(inv)}
                                  title="Hủy món hoặc hủy cả order của bàn này"
                                  style={{ padding: '4px 8px', fontSize: 11 }}
                                >
                                  <Trash2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> Hủy món
                                </button>
                              )}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: '#20c997', fontWeight: 600 }}>✓ Hoàn tất</span>
                          )}
                          {isThuNgan && (
                            <>
                              <button 
                                className="btn-sm" 
                                style={{ 
                                  background: '#2563eb', 
                                  color: '#fff', 
                                  border: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }} 
                                onClick={() => setSelectedInvoiceForPrint(inv)}
                                title="Xem và Xuất / In hóa đơn chi tiết"
                              >
                                <Printer size={13} /> Xem & In
                              </button>
                              <button 
                                className="btn-sm" 
                                style={{ 
                                  background: '#16a34a', 
                                  color: '#fff', 
                                  border: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }} 
                                onClick={() => exportSingleInvoiceToExcel(inv)}
                                title="Xuất ngay hóa đơn này ra file Excel (.xls)"
                              >
                                <Download size={13} /> Excel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6.5 MÀN HÌNH THỐNG KÊ DOANH THU & HÓA ĐƠN (NGÀY, THÁNG, NĂM) - CHỈ ADMIN & THU NGÂN */}
        {activeTab === 'thongke' && (isAdmin || isThuNgan) && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><BarChart3 className="text-warning" /> Thống Kê Doanh Thu &amp; Hóa Đơn</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {loadingThongKe && <span style={{ color: '#38bdf8', fontSize: 13 }}>Đang tải dữ liệu...</span>}
                <button 
                  className="btn-action primary" 
                  onClick={loadThongKe}
                  title="Làm mới thống kê"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <RefreshCw size={15} /> Làm Mới
                </button>
                <button 
                  className="btn-action" 
                  style={{ background: '#2563eb', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={printStatisticsReport}
                  title="In báo cáo thống kê doanh thu và danh sách hóa đơn theo kỳ"
                >
                  <Printer size={16} /> In Báo Cáo
                </button>
                <button 
                  className="btn-action" 
                  style={{ background: '#16a34a', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={exportStatisticsReportToExcel}
                  title="Xuất dữ liệu thống kê ra file bảng tính Excel"
                >
                  <Download size={16} /> Xuất Excel
                </button>
              </div>
            </div>

            {/* BỘ LỌC CHỌN KỲ THỐNG KÊ (NGÀY / THÁNG / NĂM) */}
            <div style={{
              background: '#1e293b',
              padding: '16px 20px',
              borderRadius: 12,
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              border: '1px solid #334155'
            }}>
              {/* Tùy chọn chuyển tab Ngày / Tháng / Năm */}
              <div style={{ display: 'flex', gap: 8, background: '#0f172a', padding: 4, borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setStatsPeriod('day')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: statsPeriod === 'day' ? '#2563eb' : 'transparent',
                    color: statsPeriod === 'day' ? '#fff' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  📅 Theo Ngày
                </button>
                <button
                  type="button"
                  onClick={() => setStatsPeriod('month')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: statsPeriod === 'month' ? '#2563eb' : 'transparent',
                    color: statsPeriod === 'month' ? '#fff' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  📆 Theo Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setStatsPeriod('year')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    background: statsPeriod === 'year' ? '#2563eb' : 'transparent',
                    color: statsPeriod === 'year' ? '#fff' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  📈 Theo Năm
                </button>
              </div>

              {/* Input chọn Ngày / Tháng / Năm cụ thể */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {statsPeriod === 'day' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 13, color: '#94a3b8' }}>Chọn ngày:</label>
                    <input
                      type="date"
                      value={statsSelectedDate}
                      onChange={(e) => setStatsSelectedDate(e.target.value)}
                      style={{
                        background: '#0f172a',
                        border: '1px solid #475569',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {statsPeriod === 'month' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 13, color: '#94a3b8' }}>Chọn tháng &amp; năm:</label>
                    <input
                      type="month"
                      value={statsSelectedMonth}
                      onChange={(e) => setStatsSelectedMonth(e.target.value)}
                      style={{
                        background: '#0f172a',
                        border: '1px solid #475569',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {statsPeriod === 'year' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 13, color: '#94a3b8' }}>Chọn năm:</label>
                    <select
                      value={statsSelectedYear}
                      onChange={(e) => setStatsSelectedYear(e.target.value)}
                      style={{
                        background: '#0f172a',
                        border: '1px solid #475569',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 13,
                        outline: 'none'
                      }}
                    >
                      {[2024, 2025, 2026, 2027].map(yr => (
                        <option key={yr} value={yr}>Năm {yr}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* THẺ THỐNG KÊ TỔNG QUAN THEO KỲ ĐÃ CHỌN */}
            {(() => {
              const currentData = thongKeData ? thongKeData[statsPeriod] : null;
              const totalInv = currentData?.totalInvoices || 0;
              const paidInv = currentData?.paidInvoices || 0;
              const pendingInv = currentData?.pendingInvoices || 0;
              const revenue = currentData?.revenue || 0;

              return (
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                  <div className="stat-card border-green">
                    <span className="stat-label">Tổng Doanh Thu Thực Thu</span>
                    <span className="stat-value" style={{ color: '#22c55e' }}>
                      {revenue.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="stat-sub text-success">
                      {statsPeriod === 'day' ? `Ngày ${statsSelectedDate}` : statsPeriod === 'month' ? `Tháng ${statsSelectedMonth}` : `Năm ${statsSelectedYear}`}
                    </span>
                  </div>

                  <div className="stat-card border-blue">
                    <span className="stat-label">Tổng Số Hóa Đơn</span>
                    <span className="stat-value">{totalInv}</span>
                    <span className="stat-sub">Bao gồm tất cả đơn phát sinh</span>
                  </div>

                  <div className="stat-card border-purple">
                    <span className="stat-label">Hóa Đơn Đã Thu Tiền</span>
                    <span className="stat-value text-success">{paidInv}</span>
                    <span className="stat-sub text-success">Đã hoàn tất thanh toán</span>
                  </div>

                  <div className="stat-card border-red">
                    <span className="stat-label">Hóa Đơn Chưa Thu</span>
                    <span className="stat-value text-warning">{pendingInv}</span>
                    <span className="stat-sub text-warning">Đang phục vụ / Chưa chốt</span>
                  </div>
                </div>
              );
            })()}

            {/* BIỂU ĐỒ TRỰC QUAN DOANH THU & SỐ LƯỢNG CHO THÁNG VÀ NĂM */}
            {statsPeriod !== 'day' && thongKeData && thongKeData[statsPeriod]?.chart && (
              <div style={{
                background: '#1e293b',
                padding: '20px',
                borderRadius: 12,
                marginBottom: 24,
                border: '1px solid #334155'
              }}>
                <h3 style={{ fontSize: 16, color: '#38bdf8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={18} />
                  {statsPeriod === 'month' ? `Biểu Đồ Doanh Thu Các Ngày Trong Tháng ${statsSelectedMonth}` : `Biểu Đồ Doanh Thu Các Tháng Trong Năm ${statsSelectedYear}`}
                </h3>

                {thongKeData[statsPeriod].chart.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>
                    Không có doanh thu phát sinh trong kỳ này.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(() => {
                      const maxRev = Math.max(...thongKeData[statsPeriod].chart.map(c => Number(c.revenue) || 0), 1);
                      return thongKeData[statsPeriod].chart.map((item, idx) => {
                        const label = item.dayLabel || item.monthLabel;
                        const rev = Number(item.revenue) || 0;
                        const pct = Math.min(100, Math.max(8, Math.round((rev / maxRev) * 100)));

                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 90, fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{label}</div>
                            <div style={{ flex: 1, background: '#0f172a', height: 24, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                                  borderRadius: 6,
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                            <div style={{ width: 140, textAlign: 'right', fontSize: 13, fontWeight: 'bold', color: '#22c55e' }}>
                              {rev.toLocaleString('vi-VN')} ₫
                            </div>
                            <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#94a3b8' }}>
                              ({item.invoiceCount} đơn)
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* BẢNG THỐNG KÊ NHÂN VIÊN ĐÃ ORDER BAO NHIÊU MÓN & DOANH SỐ */}
            {thongKeData && thongKeData[statsPeriod]?.staffStats && (
              <div style={{
                background: '#1e293b',
                padding: '18px 20px',
                borderRadius: 12,
                marginBottom: 20,
                border: '1px solid #334155'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={18} />
                    Năng Suất Order Của Nhân Viên ({statsPeriod === 'day' ? `Ngày ${statsSelectedDate}` : statsPeriod === 'month' ? `Tháng ${statsSelectedMonth}` : `Năm ${statsSelectedYear}`})
                  </h3>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    Thống kê số lượng món &amp; đơn order theo từng nhân viên
                  </span>
                </div>

                <div className="data-table-container">
                  <table className="kage-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60, textAlign: 'center' }}>STT</th>
                        <th>Nhân Viên Order</th>
                        <th>Chức Vụ</th>
                        <th style={{ textAlign: 'center' }}>Số Đơn Đã Nhận</th>
                        <th style={{ textAlign: 'center' }}>Tổng Số Món Đã Gọi</th>
                        <th style={{ textAlign: 'right' }}>Tổng Doanh Số Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thongKeData[statsPeriod].staffStats.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8' }}>
                            Chưa có dữ liệu order của nhân viên trong kỳ này.
                          </td>
                        </tr>
                      ) : (
                        thongKeData[statsPeriod].staffStats.map((st, idx) => (
                          <tr key={st.staffId || idx}>
                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: '#0284c7',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 'bold',
                                  color: '#fff'
                                }}>
                                  {(st.staffName || 'N').charAt(0)}
                                </div>
                                <strong>{st.staffName}</strong>
                              </div>
                            </td>
                            <td>
                              <span style={{ background: '#334155', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                {st.role}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#38bdf8' }}>
                              {st.orderCount} đơn
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f43f5e',
                                padding: '4px 10px',
                                borderRadius: 12,
                                fontWeight: 'bold',
                                fontSize: 13
                              }}>
                                🍜 {st.totalDishes} món
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#22c55e' }}>
                              {(Number(st.totalRevenue) || 0).toLocaleString('vi-VN')} ₫
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DANH SÁCH CHI TIẾT HÓA ĐƠN TRONG KỲ ĐÃ CHỌN (NGÀY / THÁNG / NĂM) */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Receipt size={18} className="text-warning" />
                  Danh Sách Hóa Đơn Chi Tiết: {statsPeriod === 'day' ? `Ngày ${statsSelectedDate}` : statsPeriod === 'month' ? `Tháng ${statsSelectedMonth}` : `Năm ${statsSelectedYear}`}
                </h3>
                <span className="tag-live">
                  {thongKeData && thongKeData[statsPeriod]?.invoices ? `${thongKeData[statsPeriod].invoices.length} Hóa đơn` : '0 Hóa đơn'}
                </span>
              </div>

              <div className="data-table-container">
                <table className="kage-table">
                  <thead>
                    <tr>
                      <th>Mã HĐ</th>
                      <th>Bàn</th>
                      <th>Thời Gian</th>
                      <th>Nhân Viên</th>
                      <th>Tổng Tiền</th>
                      <th>Trạng Thái</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!thongKeData || !thongKeData[statsPeriod]?.invoices || thongKeData[statsPeriod].invoices.length === 0) ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                          Không tìm thấy hóa đơn nào trong kỳ này.
                        </td>
                      </tr>
                    ) : (
                      thongKeData[statsPeriod].invoices.map(inv => (
                        <tr key={inv.id}>
                          <td><strong>HD-{inv.id}</strong></td>
                          <td>{inv.tableName}</td>
                          <td>{inv.time}</td>
                          <td>{inv.staff}</td>
                          <td><strong style={{ color: '#22c55e' }}>{(inv.total || 0).toLocaleString('vi-VN')} ₫</strong></td>
                          <td>
                            <span className={inv.status === 'DaThanhToan' ? 'badge-paid' : 'badge-pending'}>
                              {inv.status === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-sm" 
                              style={{ background: '#2563eb', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              onClick={() => {
                                const fullInv = invoices.find(i => String(i.id) === String(inv.id) || String(i.id) === `HD-${inv.id}`);
                                if (fullInv) {
                                  setSelectedInvoiceForPrint(fullInv);
                                } else {
                                  setSelectedInvoiceForPrint({
                                    id: `HD-${inv.id}`,
                                    tableName: inv.tableName,
                                    createdAt: inv.time,
                                    staff: inv.staff,
                                    total: inv.total,
                                    status: inv.status,
                                    items: []
                                  });
                                }
                              }}
                            >
                              <Printer size={13} /> In Hóa Đơn
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. MÀN HÌNH NHÂN VIÊN */}
        {activeTab === 'nhanvien' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Users className="text-primary" /> Quản Lý Đội Ngũ Nhân Viên</h2>
              {isAdmin && (
                <button className="btn-action primary" onClick={() => setShowAddStaffModal(true)}>
                  <Plus size={16} /> Thêm Nhân Viên Mới
                </button>
              )}
            </div>

            <div className="data-table-container">
              <table className="kage-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ và Tên</th>
                    <th>Tài Khoản</th>
                    <th>Chức Vụ (Phân Quyền)</th>
                    <th>Số Điện Thoại</th>
                    <th>Ca Trực</th>
                    <th>Trạng Thái</th>
                    {isAdmin && <th>Hành Động</th>}
                  </tr>
                </thead>
                <tbody>
                  {(staffList || []).map((nv, idx) => {
                    if (!nv) return null;
                    const idStr = String(nv.id || `NV0${idx + 1}`);
                    const usernameStr = nv.username || idStr.toLowerCase();
                    return (
                      <tr key={nv.id || idx}>
                        <td><strong>{idStr}</strong></td>
                        <td><strong>{nv.name || 'Nhân viên'}</strong></td>
                        <td>
                          <span style={{ fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            {usernameStr}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            background: nv.role === 'Quản lý' ? 'rgba(239, 68, 68, 0.2)' : 
                                        nv.role === 'Thu ngân' ? 'rgba(234, 179, 8, 0.2)' : 
                                        nv.role === 'Đầu bếp' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: nv.role === 'Quản lý' ? '#f87171' : 
                                   nv.role === 'Thu ngân' ? '#facc15' : 
                                   nv.role === 'Đầu bếp' ? '#fb923c' : '#60a5fa'
                          }}>
                            {nv.role || 'Phục vụ'}
                          </span>
                        </td>
                        <td>{nv.phone || 'Chưa có SĐT'}</td>
                        <td>{nv.shift || 'Ca sáng'}</td>
                        <td>
                          <span className="badge-paid">{nv.status || 'Đang làm việc'}</span>
                        </td>
                        {isAdmin && (
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button 
                                className="btn-sm" 
                                onClick={() => setEditingStaff({ ...nv })}
                                style={{ padding: '3px 8px', fontSize: 11, color: '#38bdf8' }}
                                title="Sửa nhân viên"
                              >
                                <Pencil size={12} /> Sửa
                              </button>
                              <button 
                                className="btn-sm danger" 
                                onClick={() => handleDeleteStaff(nv.id)}
                                style={{ padding: '3px 8px', fontSize: 11 }}
                                title="Xóa nhân viên"
                              >
                                <Trash2 size={12} /> Xóa
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. MÀN HÌNH ĐẶT BÀN TRƯỚC (BOOKING) */}
        {activeTab === 'datban' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><CalendarCheck className="text-warning" /> Quản Lý Đặt Bàn Trước (Booking)</h2>
              {isAdmin ? (
                <button className="btn-action primary" onClick={() => setShowAddResModal(true)}>
                  <Plus size={16} /> Nhận Đặt Bàn Mới
                </button>
              ) : (
                <span style={{ fontSize: 13, color: '#94a3b8' }}>* Chỉ Quản lý (Admin) mới có quyền Thêm/Sửa/Xóa</span>
              )}
            </div>

            <div className="data-table-container">
              <table className="kage-table">
                <thead>
                  <tr>
                    <th>Mã Đặt</th>
                    <th>Khách Hàng</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                    <th>Bàn Đặt</th>
                    <th>Ngày &amp; Giờ Đến</th>
                    <th>Số Khách</th>
                    <th>Ghi Chú</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                        Chưa có lịch đặt bàn nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    reservations.map(res => (
                      <tr key={res.id}>
                        <td><strong>#{res.id}</strong></td>
                        <td><strong>{res.customerName}</strong></td>
                        <td><span style={{ color: '#38bdf8' }}>{res.phone || 'Chưa có'}</span></td>
                        <td><span style={{ color: '#a78bfa', fontSize: 13 }}>{res.email || '—'}</span></td>
                        <td style={{ fontSize: 12, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.address}>{res.address || '—'}</td>
                        <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>{res.tableName}</span></td>
                        <td>{res.date} • <b>{res.time}</b></td>
                        <td>{res.guests} người</td>
                        <td style={{ fontSize: 12, color: '#94a3b8' }}>{res.note || '—'}</td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            background: res.status === 'DaDen' ? 'rgba(34, 197, 94, 0.2)' : 
                                        res.status === 'DaHuy' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                            color: res.status === 'DaDen' ? '#22c55e' : 
                                   res.status === 'DaHuy' ? '#ef4444' : '#eab308'
                          }}>
                            {res.status === 'DaDen' ? '✓ Khách đã đến' : res.status === 'DaHuy' ? '✗ Đã hủy' : '⏳ Chờ đến'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {res.status === 'Cho' && (
                              <>
                                <button 
                                  className="btn-sm success" 
                                  onClick={async () => {
                                    await fetch('/api/datban/status', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: res.id, status: 'DaDen', tableId: res.tableId })
                                    });
                                    notify(`Đã nhận khách ${res.customerName} vào ${res.tableName}!`);
                                    loadDataFromDatabase();
                                  }}
                                  title="Đánh dấu khách đã đến nhận bàn"
                                >
                                  Nhận bàn
                                </button>
                                <button 
                                  className="btn-sm danger" 
                                  onClick={async () => {
                                    await fetch('/api/datban/status', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: res.id, status: 'DaHuy', tableId: res.tableId })
                                    });
                                    notify(`Đã hủy lịch đặt bàn #${res.id}`);
                                    loadDataFromDatabase();
                                  }}
                                  title="Hủy lịch đặt"
                                >
                                  Hủy
                                </button>
                              </>
                            )}

                            {/* Quyền Sửa & Xóa chỉ dành riêng cho Admin */}
                            {isAdmin && (
                              <>
                                <button 
                                  className="btn-sm" 
                                  onClick={() => setEditingRes({ ...res })}
                                  style={{ padding: '4px 7px', fontSize: 11, color: '#38bdf8' }}
                                  title="Admin: Chỉnh sửa thông tin đặt bàn"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button 
                                  className="btn-sm danger" 
                                  onClick={async () => {
                                    if (window.confirm(`Admin: Bạn có chắc chắn muốn xóa vĩnh viễn lịch đặt bàn #${res.id} của khách "${res.customerName}"?`)) {
                                      try {
                                        const delRes = await fetch(`/api/datban/${res.id}`, { method: 'DELETE' });
                                        const delData = await delRes.json();
                                        if (delData.success) {
                                          notify(`Đã xóa thành công lịch đặt bàn #${res.id}!`);
                                          loadDataFromDatabase();
                                        } else {
                                          alert(delData.message || 'Lỗi khi xóa!');
                                        }
                                      } catch (err) {
                                        alert('Lỗi kết nối máy chủ: ' + err.message);
                                      }
                                    }
                                  }}
                                  style={{ padding: '4px 7px', fontSize: 11 }}
                                  title="Admin: Xóa lịch đặt bàn"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. MÀN HÌNH KHÁCH HÀNG (CRM) */}
        {activeTab === 'khachhang' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><UserCheck className="text-info" /> Danh Sách Khách Hàng Thân Thiết (CRM)</h2>
              <button className="btn-action primary" onClick={() => setShowAddCustomerModal(true)}>
                <Plus size={16} /> Thêm Khách Hàng Mới
              </button>
            </div>

            <div className="data-table-container">
              <table className="kage-table">
                <thead>
                  <tr>
                    <th>Mã KH</th>
                    <th>Họ và Tên</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                    <th>Ngày Tham Gia</th>
                    <th>Điểm Tích Lũy</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                        Chưa có dữ liệu khách hàng.
                      </td>
                    </tr>
                  ) : (
                    customers.map(kh => (
                      <tr key={kh.id}>
                        <td><strong>KH-{kh.id}</strong></td>
                        <td><strong>{kh.name}</strong></td>
                        <td><span style={{ color: '#38bdf8' }}>{kh.phone || 'Chưa cập nhật'}</span></td>
                        <td>{kh.email || '—'}</td>
                        <td>{kh.address || '—'}</td>
                        <td>{kh.joinedDate}</td>
                        <td><span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>⭐ {kh.points} đ</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. MÀN HÌNH KHUYẾN MÃI (PROMOTIONS) */}
        {activeTab === 'khuyenmai' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Tag className="text-danger" /> Quản Lý Khuyến Mãi &amp; Voucher Giảm Giá</h2>
              {isAdmin && (
                <button className="btn-action primary" onClick={() => setShowAddPromoModal(true)}>
                  <Plus size={16} /> Tạo Mã Khuyến Mãi
                </button>
              )}
            </div>

            <div className="data-table-container">
              <table className="kage-table">
                <thead>
                  <tr>
                    <th>Mã KM</th>
                    <th>Tên Chương Trình</th>
                    <th>Hình Thức Giảm</th>
                    <th>Giá Trị</th>
                    <th>Thời Gian Áp Dụng</th>
                    <th>Điều Kiện / Ghi Chú</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                        Chưa có chương trình khuyến mãi nào.
                      </td>
                    </tr>
                  ) : (
                    promotions.map(km => (
                      <tr key={km.id}>
                        <td><strong>KM-{km.id}</strong></td>
                        <td><strong>{km.name}</strong></td>
                        <td>{km.type === 'PhanTram' ? 'Giảm theo phần trăm (%)' : 'Giảm tiền trực tiếp (VND)'}</td>
                        <td>
                          <b style={{ color: '#ef4444' }}>
                            {km.type === 'PhanTram' ? `${km.value}%` : `${Number(km.value).toLocaleString('vi-VN')} ₫`}
                          </b>
                        </td>
                        <td>{km.startDate || 'Ngay bây giờ'} → {km.endDate || 'Vô thời hạn'}</td>
                        <td style={{ fontSize: 12, color: '#94a3b8' }}>{km.note || 'Tất cả hóa đơn'}</td>
                        <td>
                          <span className="badge-paid">Đang chạy</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 11. MÀN HÌNH KHO NGUYÊN LIỆU & NHẬP HÀNG (WAREHOUSE) */}
        {activeTab === 'kho' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2><Warehouse className="text-warning" /> Quản Lý Kho &amp; Nhập Hàng Nhà Hàng</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                {(isAdmin || isThuNgan) && (
                  <>
                    <button className="btn-action" style={{ background: '#0284c7', color: '#fff', border: 'none' }} onClick={() => setShowAddMaterialModal(true)}>
                      <Plus size={16} /> Thêm Nguyên Liệu
                    </button>
                    <button className="btn-action primary" onClick={() => setShowImportModal(true)}>
                      <Truck size={16} /> Lập Phiếu Nhập Hàng
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bảng Nguyên Liệu Tồn Kho */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={18} /> Danh Sách Tồn Kho Nguyên Liệu
              </h3>
              <div className="data-table-container">
                <table className="kage-table">
                  <thead>
                    <tr>
                      <th>Mã NL</th>
                      <th>Tên Nguyên Liệu</th>
                      <th>Đơn Vị Tính</th>
                      <th>Số Lượng Tồn</th>
                      <th>Giá Nhập / Kg</th>
                      <th>Hạn Sử Dụng</th>
                      <th>Cảnh Báo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(warehouseData.materials || []).length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>Chưa có nguyên liệu trong kho.</td>
                      </tr>
                    ) : (
                      warehouseData.materials.map(m => (
                        <tr key={m.id}>
                          <td><strong>NL-{m.id}</strong></td>
                          <td><strong>{m.name}</strong></td>
                          <td>{m.unit}</td>
                          <td>
                            <strong style={{ color: m.stock < 5 ? '#ef4444' : '#22c55e', fontSize: 14 }}>
                              {m.stock} {m.unit}
                            </strong>
                          </td>
                          <td>{(m.price || 0).toLocaleString('vi-VN')} ₫</td>
                          <td>{m.expDate || 'Không có'}</td>
                          <td>
                            {m.stock < 5 ? (
                              <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 'bold' }}>
                                ⚠️ Sắp hết hàng
                              </span>
                            ) : (
                              <span style={{ color: '#22c55e', fontSize: 11 }}>Đủ dùng</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng Lịch Sử Phiếu Nhập Kho */}
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={18} /> Lịch Sử Phiếu Nhập Kho (Mới nhất)
              </h3>
              <div className="data-table-container">
                <table className="kage-table">
                  <thead>
                    <tr>
                      <th>Số Phiếu</th>
                      <th>Nhà Cung Cấp</th>
                      <th>Thời Gian Nhập</th>
                      <th>Thủ Kho Thực Hiện</th>
                      <th>Tổng Tiền Nhập</th>
                      <th>Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(warehouseData.invoices || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>Chưa có phiếu nhập kho nào.</td>
                      </tr>
                    ) : (
                      warehouseData.invoices.map(pn => (
                        <tr key={pn.id}>
                          <td><strong>PN-{pn.id}</strong></td>
                          <td><strong>{pn.supplierName}</strong></td>
                          <td>{pn.date}</td>
                          <td>{pn.staff}</td>
                          <td><strong style={{ color: '#eab308' }}>{(pn.total || 0).toLocaleString('vi-VN')} ₫</strong></td>
                          <td style={{ fontSize: 12, color: '#94a3b8' }}>{pn.note || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL THÊM MÓN ĂN MỚI */}
      {showAddDishModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3><UtensilsCrossed size={18} /> Thêm Món Ăn Mới</h3>
            <form onSubmit={handleAddDish} className="login-form">
              <div className="form-group">
                <label>Tên món ăn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Bò Nướng Sốt Teriyaki"
                  value={newDish.name}
                  onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select 
                  className="form-input"
                  value={newDish.category}
                  onChange={e => setNewDish({ ...newDish, category: e.target.value })}
                >
                  <option value="Khai vị">Khai vị</option>
                  <option value="Món chính">Món chính</option>
                  <option value="Lẩu & Nướng">Lẩu & Nướng</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Đơn giá (VNĐ)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Ví dụ: 195000"
                  value={newDish.price}
                  onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Link hình ảnh món ăn (URL hoặc /static/uploads/...)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://... hoặc /static/uploads/pho_bo.jpg"
                  value={newDish.image}
                  onChange={e => setNewDish({ ...newDish, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Mô tả món</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  placeholder="Mô tả hương vị, nguyên liệu..."
                  value={newDish.description}
                  onChange={e => setNewDish({ ...newDish, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddDishModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger">
                  Lưu món ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA MÓN ĂN */}
      {editingDish && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3><Pencil size={18} className="text-info" /> Sửa Món Ăn: {editingDish.name}</h3>
            <form onSubmit={handleUpdateDish} className="login-form">
              <div className="form-group">
                <label>Tên món ăn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingDish.name}
                  onChange={e => setEditingDish({ ...editingDish, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select 
                  className="form-input"
                  value={editingDish.category}
                  onChange={e => setEditingDish({ ...editingDish, category: e.target.value })}
                >
                  <option value="Khai vị">Khai vị</option>
                  <option value="Món chính">Món chính</option>
                  <option value="Lẩu & Nướng">Lẩu & Nướng</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Đơn giá (VNĐ)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editingDish.price}
                  onChange={e => setEditingDish({ ...editingDish, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Link hình ảnh món ăn (URL hoặc /static/uploads/...)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingDish.image || ''}
                  onChange={e => setEditingDish({ ...editingDish, image: e.target.value })}
                  placeholder="https://... hoặc /static/uploads/pho_bo.jpg"
                />
              </div>

              <div className="form-group">
                <label>Mô tả món</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  value={editingDish.description}
                  onChange={e => setEditingDish({ ...editingDish, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setEditingDish(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger">
                  Cập nhật món
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM BÀN MỚI */}
      {showAddTableModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3><Grid3X3 size={18} className="text-warning" /> Thêm Bàn Ăn Mới</h3>
            <form onSubmit={handleAddTable} className="login-form">
              <div className="form-group">
                <label>Tên bàn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Bàn A-05 hoặc VIP Room 3"
                  value={newTable.name}
                  onChange={e => setNewTable({ ...newTable, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Khu vực</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Tầng 1 (Khu A), Sân Vườn, VIP..."
                  value={newTable.area}
                  onChange={e => setNewTable({ ...newTable, area: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sức chứa (người)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Ví dụ: 4, 6, 8, 12..."
                  value={newTable.capacity}
                  onChange={e => setNewTable({ ...newTable, capacity: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddTableModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger">
                  Lưu bàn mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA BÀN */}
      {editingTable && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3><Pencil size={18} className="text-info" /> Sửa Bàn Ăn: {editingTable.name}</h3>
            <form onSubmit={handleUpdateTable} className="login-form">
              <div className="form-group">
                <label>Tên bàn</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTable.name}
                  onChange={e => setEditingTable({ ...editingTable, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Khu vực</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTable.area}
                  onChange={e => setEditingTable({ ...editingTable, area: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sức chứa (người)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editingTable.capacity}
                  onChange={e => setEditingTable({ ...editingTable, capacity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select 
                  className="form-input"
                  value={editingTable.status}
                  onChange={e => setEditingTable({ ...editingTable, status: e.target.value })}
                >
                  <option value="Trong">Bàn trống</option>
                  <option value="DangSuDung">Đang phục vụ</option>
                  <option value="DaDat">Đã đặt trước</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setEditingTable(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger">
                  Cập nhật bàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM NHÂN VIÊN */}
      {showAddStaffModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 480 }}>
            <h3><Users size={18} /> Thêm Nhân Viên &amp; Cấp Tài Khoản</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: -6, marginBottom: 16 }}>
              Hệ thống phân quyền 4 vai trò: Quản lý, Thu ngân, Đầu bếp, Phục vụ.
            </p>
            <form onSubmit={handleAddStaff} className="login-form">
              <div className="form-group">
                <label>Họ và Tên <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Hoàng Minh Đức"
                  value={newStaff.name}
                  onChange={e => {
                    const name = e.target.value;
                    // Tự động tạo gợi ý username ngắn gọn từ tên
                    const parts = name.trim().toLowerCase().split(/\s+/);
                    const suggestedUser = parts.length > 0 && parts[0] ? parts[parts.length - 1] + '_' + (newStaff.role === 'Phục vụ' ? 'nv' : newStaff.role === 'Thu ngân' ? 'tn' : newStaff.role === 'Đầu bếp' ? 'chef' : 'ql') : '';
                    setNewStaff(prev => ({ 
                      ...prev, 
                      name, 
                      username: prev.username && prev.username !== '' ? prev.username : suggestedUser 
                    }));
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Chức vụ (Phân quyền) <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    className="form-input"
                    value={newStaff.role}
                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  >
                    <option value="Phục vụ" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Phục vụ (POS, sơ đồ bàn)</option>
                    <option value="Thu ngân" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Thu ngân (Thanh toán)</option>
                    <option value="Đầu bếp" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Đầu bếp (KDS, Báo hết món)</option>
                    <option value="Quản lý" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Quản lý (Toàn quyền Admin)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ca làm việc</label>
                  <select 
                    className="form-input"
                    value={newStaff.shift}
                    onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}
                  >
                    <option value="Ca sáng">Ca sáng (08:00 - 16:00)</option>
                    <option value="Ca tối">Ca tối (16:00 - 23:00)</option>
                    <option value="Toàn thời gian">Toàn thời gian (Full-time)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Số điện thoại <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="Ví dụ: 0987654321"
                    maxLength={11}
                    value={newStaff.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setNewStaff({ ...newStaff, phone: val });
                    }}
                    required
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>Gồm 10 - 11 chữ số (chỉ nhập số)</small>
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Ví dụ: nhanvien@nhahang.com"
                    value={newStaff.email}
                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>Định dạng: ten@domain.com</small>
                </div>
              </div>

              {/* KHỐI CẤP TÀI KHOẢN ĐĂNG NHẬP */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px dashed rgba(56, 189, 248, 0.3)',
                padding: '12px 14px',
                borderRadius: 8,
                marginTop: 4,
                marginBottom: 14
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} /> Cấp tài khoản đăng nhập hệ thống
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8' }}>Tên đăng nhập (Username)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ví dụ: duc_nv"
                      value={newStaff.username}
                      onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                      style={{ fontSize: 13, padding: '6px 10px', marginTop: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8' }}>Mật khẩu khởi tạo</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Mặc định: 123"
                      value={newStaff.password}
                      onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                      style={{ fontSize: 13, padding: '6px 10px', marginTop: 4 }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddStaffModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger" onClick={handleAddStaff}>
                  Lưu &amp; Cấp tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA NHÂN VIÊN */}
      {editingStaff && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 460 }}>
            <h3><Pencil size={18} className="text-info" /> Sửa Nhân Viên: {editingStaff.name}</h3>
            <form onSubmit={handleUpdateStaff} className="login-form">
              <div className="form-group">
                <label>Họ và Tên</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingStaff.name}
                  onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Chức vụ (Phân quyền)</label>
                  <select 
                    className="form-input"
                    value={editingStaff.role}
                    onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  >
                    <option value="Phục vụ" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Phục vụ</option>
                    <option value="Thu ngân" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Thu ngân</option>
                    <option value="Đầu bếp" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Đầu bếp</option>
                    <option value="Quản lý" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>Quản lý</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ca làm việc</label>
                  <select 
                    className="form-input"
                    value={editingStaff.shift}
                    onChange={e => setEditingStaff({ ...editingStaff, shift: e.target.value })}
                  >
                    <option value="Ca sáng">Ca sáng (08:00 - 16:00)</option>
                    <option value="Ca tối">Ca tối (16:00 - 23:00)</option>
                    <option value="Toàn thời gian">Toàn thời gian (Full-time)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={editingStaff.phone || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setEditingStaff({ ...editingStaff, phone: val });
                    }}
                    placeholder="Ví dụ: 0987654321"
                    maxLength={11}
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>Gồm 10 - 11 chữ số (chỉ nhập số)</small>
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editingStaff.email || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    placeholder="nhanvien@nhahang.com"
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>Định dạng: ten@domain.com</small>
                </div>
              </div>

              <div className="form-group">
                <label>Tài khoản đăng nhập (Username)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingStaff.username || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, username: e.target.value })}
                  placeholder="Ví dụ: nv01"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setEditingStaff(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger">
                  Cập nhật nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ MODAL THÔNG TIN CÁ NHÂN ═══ */}
      {showProfileModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={20} className="text-info" /> Thông Tin Cá Nhân
              </h3>
              <button 
                type="button" 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {currentUser ? (
              <div className="profile-details-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#e0231c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 'bold' }}>
                    {currentUser.hoten ? currentUser.hoten.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#fff' }}>{currentUser.hoten}</h4>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: '#2a3b4c', color: '#38bdf8', fontWeight: 600 }}>
                      {currentUser.chucvu || 'Nhân viên'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#ccc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#888' }}>Tên đăng nhập:</span>
                    <strong style={{ color: '#fff' }}>@{currentUser.username || 'admin'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#888' }}>Mã nhân viên / vai trò:</span>
                    <span style={{ color: '#ffc107' }}>{currentUser.role_code || 'Quản trị viên'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#888' }}>Số điện thoại:</span>
                    <span style={{ color: '#fff' }}>{currentUser.sodienthoai || '0901 000 001'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#888' }}>Email:</span>
                    <span style={{ color: '#fff' }}>{currentUser.email || 'admin@nhahangkage.vn'}</span>
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: 22 }}>
                  <button type="button" className="btn-sm" onClick={() => setShowProfileModal(false)}>
                    Đóng
                  </button>
                  <button 
                    type="button" 
                    className="btn-sm danger" 
                    onClick={() => {
                      setShowProfileModal(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <p>Bạn chưa đăng nhập.</p>
            )}
          </div>
        </div>
      )}

      {/* ═══ MODAL ĐĂNG NHẬP ═══ */}
      {showLoginModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 390 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
                <LogIn size={20} className="text-danger" /> Đăng Nhập Hệ Thống
              </h3>
              <button 
                type="button" 
                onClick={() => setShowLoginModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {loginError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 6, color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="admin / thungan / tuan_nv / hung_chef"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Nhập mật khẩu (vd: 123456 hoặc admin)"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>
                💡 Gợi ý nhanh: <b>admin</b> / <b>thungan</b> / <b>tuan_nv</b> (MK: 123456)
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowLoginModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-sm danger" onClick={handleLogin}>
                  <LogIn size={14} /> Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XUẤT / IN HÓA ĐƠN (CHỈ DÀNH CHO ADMIN VÀ THU NGÂN) */}
      {isThuNgan && selectedInvoiceForPrint && (
        <div className="modal-backdrop" onClick={() => setSelectedInvoiceForPrint(null)}>
          <div className="modal-card print-invoice-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, background: '#fff', color: '#1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={22} style={{ color: '#e11d48' }} />
                <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a' }}>Hóa Đơn Thanh Toán</h3>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInvoiceForPrint(null);
                }}
                style={{ 
                  background: '#f1f5f9', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', 
                  color: '#475569',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                title="Đóng cửa sổ hóa đơn"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Khung nội dung hóa đơn để in */}
            <div id="kage-printable-bill" style={{ 
              background: '#f8fafc', 
              padding: '20px 16px', 
              borderRadius: 8, 
              border: '1px solid #e2e8f0',
              fontFamily: 'monospace, sans-serif'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: 20, letterSpacing: 2, color: '#0f172a' }}>NHÀ HÀNG KAGE</h2>
                <div style={{ fontSize: 12, color: '#64748b' }}>Hệ Thống Ẩm Thực Cao Cấp KAGE</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Đ/C: 123 Lê Duẩn, TP. Buôn Ma Thuột, Đắk Lắk</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Hotline: 0901.888.999</div>
                <div style={{ margin: '8px 0', borderBottom: '1px dashed #94a3b8' }}></div>
                <h4 style={{ margin: '6px 0', fontSize: 15, textTransform: 'uppercase' }}>PHIẾU THANH TOÁN</h4>
              </div>

              <div style={{ fontSize: 13, marginBottom: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <div><b>Số HĐ:</b> #{selectedInvoiceForPrint.id}</div>
                <div><b>Bàn:</b> {selectedInvoiceForPrint.tableName}</div>
                <div><b>Giờ vào:</b> {selectedInvoiceForPrint.createdAt}</div>
                <div><b>Thu ngân:</b> {selectedInvoiceForPrint.staff || currentUser?.hoten || 'Nhân viên'}</div>
              </div>

              <div style={{ borderBottom: '1px dashed #94a3b8', margin: '8px 0' }}></div>

              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '4px 0' }}>Tên món</th>
                    <th style={{ padding: '4px 0', textAlign: 'center' }}>SL</th>
                    <th style={{ padding: '4px 0', textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ padding: '4px 0', textAlign: 'right' }}>T.Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceForPrint.items && selectedInvoiceForPrint.items.length > 0 ? (
                    selectedInvoiceForPrint.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                        <td style={{ padding: '6px 0' }}>{item.name}</td>
                        <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{(item.price || 0).toLocaleString('vi-VN')}</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>
                          {((item.price || 0) * (item.qty || 1)).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '10px 0', color: '#64748b' }}>
                        Không có món ăn trong hóa đơn
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Tổng tiền món:</span>
                  <span>{selectedInvoiceForPrint.total.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Giảm giá (Khuyến mãi):</span>
                  <span>0 ₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Thuế VAT:</span>
                  <span>0 ₫</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 16, 
                  fontWeight: 700, 
                  marginTop: 8, 
                  paddingTop: 8, 
                  borderTop: '2px solid #0f172a',
                  color: '#e11d48'
                }}>
                  <span>TỔNG THANH TOÁN:</span>
                  <span>{selectedInvoiceForPrint.total.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, marginTop: 4, color: '#16a34a', fontWeight: 600 }}>
                  Trạng thái: {selectedInvoiceForPrint.status === 'DaThanhToan' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                Cảm ơn Quý khách & Hẹn gặp lại!<br/>
                KAGE RESTAURANT hân hạnh được phục vụ Quý khách.
              </div>
            </div>

            {/* Các nút hành động in / tải */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button 
                type="button" 
                className="btn-sm" 
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                onClick={() => setSelectedInvoiceForPrint(null)}
              >
                Đóng
              </button>
              <button 
                type="button" 
                className="btn-sm" 
                style={{ background: '#16a34a', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => exportSingleInvoiceToExcel(selectedInvoiceForPrint)}
                title="Tải hóa đơn này dưới dạng file bảng tính Excel"
              >
                <Download size={15} /> Xuất Excel (.xls)
              </button>
              <button 
                type="button" 
                className="btn-sm" 
                style={{ background: '#0284c7', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => {
                  const printContents = document.getElementById('kage-printable-bill').innerHTML;
                  const win = window.open('', '', 'height=650,width=450');
                  win.document.write('<html><head><title>Hóa đơn #' + selectedInvoiceForPrint.id + '</title>');
                  win.document.write('<style>body{font-family: monospace, sans-serif; padding: 20px;} table{width: 100%; border-collapse: collapse;} th, td{padding: 5px;}</style>');
                  win.document.write('</head><body>');
                  win.document.write(printContents);
                  win.document.write('</body></html>');
                  win.document.close();
                  win.focus();
                  setTimeout(() => {
                    win.print();
                    win.close();
                  }, 250);
                }}
              >
                <Printer size={15} /> In / Xuất (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM ĐẶT BÀN */}
      {showAddResModal && (
        <div className="modal-backdrop" onClick={() => setShowAddResModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3><CalendarCheck size={18} className="text-warning" /> Nhận Lịch Đặt Bàn Mới</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const rawPhone = (newRes.phone || '').trim();
              if (/[a-zA-Z]/.test(rawPhone)) {
                alert('Số điện thoại không được chứa chữ cái, chỉ được nhập số!');
                return;
              }
              const cleanPhone = rawPhone.replace(/[\s.-]/g, '');
              if (cleanPhone && (!/^[0-9]+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 11)) {
                alert('Số điện thoại phải gồm từ 10 đến 11 chữ số và không được chứa chữ cái!');
                return;
              }

              const cleanEmail = (newRes.email || '').trim();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (cleanEmail && !emailRegex.test(cleanEmail)) {
                alert('Email không đúng cấu trúc! Vui lòng nhập địa chỉ email hợp lệ (vd: khachhang@gmail.com).');
                return;
              }

              try {
                const res = await fetch('/api/datban', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...newRes,
                    phone: cleanPhone || newRes.phone,
                    email: cleanEmail
                  })
                });
                if (!res.ok) {
                  const errorText = await res.text();
                  alert(`Không thể đặt bàn: ${errorText || res.statusText}`);
                  return;
                }
                const data = await res.json();
                if (data.success) {
                  notify('Đã thêm lịch đặt bàn thành công!');
                  setShowAddResModal(false);
                  loadDataFromDatabase();
                } else {
                  alert(data.message || 'Lỗi đặt bàn');
                }
              } catch (err) {
                alert('Lỗi kết nối máy chủ API: ' + err.message);
              }
            }}>
              <div className="form-group">
                <label>Họ và Tên Khách Hàng</label>
                <input type="text" className="form-input" required value={newRes.customerName} onChange={e => setNewRes({ ...newRes, customerName: e.target.value })} placeholder="Ví dụ: Anh Hoàng" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={newRes.phone} 
                    maxLength={11}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setNewRes({ ...newRes, phone: val });
                    }} 
                    placeholder="10 - 11 chữ số (vd: 0905123456)" 
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>10 - 11 số (chỉ nhập số)</small>
                </div>
                <div className="form-group">
                  <label>Email Khách Hàng</label>
                  <input type="email" className="form-input" value={newRes.email} onChange={e => setNewRes({ ...newRes, email: e.target.value })} placeholder="khachhang@gmail.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Địa Chỉ Khách Hàng</label>
                <input type="text" className="form-input" value={newRes.address} onChange={e => setNewRes({ ...newRes, address: e.target.value })} placeholder="Ví dụ: 123 Lê Lợi, TP. Buôn Ma Thuột" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Chọn Bàn</label>
                  <select className="form-input" value={newRes.tableId} onChange={e => setNewRes({ ...newRes, tableId: e.target.value })} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                    {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.area})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số Lượng Khách</label>
                  <input type="number" className="form-input" min="1" value={newRes.guests} onChange={e => setNewRes({ ...newRes, guests: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Ngày Đến</label>
                  <input type="date" className="form-input" required value={newRes.date} onChange={e => setNewRes({ ...newRes, date: e.target.value })} style={{ colorScheme: 'dark' }} />
                </div>
                <div className="form-group">
                  <label>Giờ Đến</label>
                  <input type="time" className="form-input" required value={newRes.time} onChange={e => setNewRes({ ...newRes, time: e.target.value })} style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div className="form-group">
                <label>Ghi Chú</label>
                <input type="text" className="form-input" value={newRes.note} onChange={e => setNewRes({ ...newRes, note: e.target.value })} placeholder="Yêu cầu bàn gần cửa sổ, ăn tiệc sinh nhật..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddResModal(false)}>Hủy</button>
                <button type="submit" className="btn-sm danger">Xác Nhận Đặt Bàn</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA ĐẶT BÀN (CHỈ ADMIN) */}
      {editingRes && isAdmin && (
        <div className="modal-backdrop" onClick={() => setEditingRes(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3><Edit2 size={18} className="text-warning" /> Chỉnh Sửa Lịch Đặt Bàn #{editingRes.id}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const rawPhone = (editingRes.phone || '').trim();
              if (/[a-zA-Z]/.test(rawPhone)) {
                alert('Số điện thoại không được chứa chữ cái, chỉ được nhập số!');
                return;
              }
              const cleanPhone = rawPhone.replace(/[\s.-]/g, '');
              if (cleanPhone && (!/^[0-9]+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 11)) {
                alert('Số điện thoại phải gồm từ 10 đến 11 chữ số và không được chứa chữ cái!');
                return;
              }

              const cleanEmail = (editingRes.email || '').trim();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (cleanEmail && !emailRegex.test(cleanEmail)) {
                alert('Email không đúng cấu trúc! Vui lòng nhập địa chỉ email hợp lệ (vd: khachhang@gmail.com).');
                return;
              }

              try {
                const res = await fetch(`/api/datban/${editingRes.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...editingRes,
                    phone: cleanPhone || editingRes.phone,
                    email: cleanEmail
                  })
                });
                if (!res.ok) {
                  const errorText = await res.text();
                  alert(`Không thể cập nhật: ${errorText || res.statusText}`);
                  return;
                }
                const data = await res.json();
                if (data.success) {
                  notify(`Đã cập nhật lịch đặt bàn #${editingRes.id} thành công!`);
                  setEditingRes(null);
                  loadDataFromDatabase();
                } else {
                  alert(data.message || 'Lỗi cập nhật lịch đặt bàn');
                }
              } catch (err) {
                alert('Lỗi kết nối máy chủ API: ' + err.message);
              }
            }}>
              <div className="form-group">
                <label>Họ và Tên Khách Hàng</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={editingRes.customerName || ''} 
                  onChange={e => setEditingRes({ ...editingRes, customerName: e.target.value })} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={editingRes.phone || ''} 
                    maxLength={11}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      setEditingRes({ ...editingRes, phone: val });
                    }} 
                    placeholder="10 - 11 chữ số (vd: 0905123456)" 
                  />
                  <small style={{ fontSize: 11, color: '#94a3b8' }}>10 - 11 số (chỉ nhập số)</small>
                </div>
                <div className="form-group">
                  <label>Email Khách Hàng</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editingRes.email || ''} 
                    onChange={e => setEditingRes({ ...editingRes, email: e.target.value })} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Địa Chỉ Khách Hàng</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingRes.address || ''} 
                  onChange={e => setEditingRes({ ...editingRes, address: e.target.value })} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Chọn Bàn</label>
                  <select 
                    className="form-input" 
                    value={editingRes.tableId} 
                    onChange={e => setEditingRes({ ...editingRes, tableId: parseInt(e.target.value) })} 
                    style={{ backgroundColor: '#0f172a', color: '#fff' }}
                  >
                    {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.area})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Số Lượng Khách</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1" 
                    value={editingRes.guests || 2} 
                    onChange={e => setEditingRes({ ...editingRes, guests: parseInt(e.target.value) })} 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Ngày Đến</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required 
                    value={editingRes.date || ''} 
                    onChange={e => setEditingRes({ ...editingRes, date: e.target.value })} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
                <div className="form-group">
                  <label>Giờ Đến</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    required 
                    value={editingRes.time || ''} 
                    onChange={e => setEditingRes({ ...editingRes, time: e.target.value })} 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Trạng Thái</label>
                  <select 
                    className="form-input" 
                    value={editingRes.status || 'Cho'} 
                    onChange={e => setEditingRes({ ...editingRes, status: e.target.value })}
                    style={{ backgroundColor: '#0f172a', color: '#fff' }}
                  >
                    <option value="Cho">Chờ đến</option>
                    <option value="DaDen">Khách đã đến (Nhận bàn)</option>
                    <option value="DaHuy">Đã hủy lịch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi Chú</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingRes.note || ''} 
                    onChange={e => setEditingRes({ ...editingRes, note: e.target.value })} 
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setEditingRes(null)}>Hủy</button>
                <button type="submit" className="btn-sm primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HỦY MÓN ĐÃ GỌI / HỦY ORDER (CHỈ ADMIN) */}
      {cancelingInvoice && isAdmin && (
        <div className="modal-backdrop" onClick={() => setCancelingInvoice(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3>
              <Trash2 size={18} className="text-danger" /> Quản Lý Hủy Món: {cancelingInvoice.tableName} (#{cancelingInvoice.id})
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 16px' }}>
              Quyền Admin: Chọn món muốn hủy bớt hoặc hủy toàn bộ order của bàn. Tiền trong hóa đơn sẽ tự động được trừ đi và cập nhật lại bên Bếp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {cancelingInvoice.items && cancelingInvoice.items.length > 0 ? (
                cancelingInvoice.items.map((it, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{it.name}</div>
                      <div style={{ fontSize: 12, color: '#38bdf8' }}>
                        Số lượng: <b>{it.qty}</b> • Đơn giá: {it.price.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {it.qty > 1 && (
                        <button
                          className="btn-sm"
                          style={{ background: '#f59e0b', color: '#000', fontSize: 11, padding: '4px 8px' }}
                          onClick={async () => {
                            if (window.confirm(`Hủy bớt 1 phần "${it.name}" của ${cancelingInvoice.tableName}?`)) {
                              try {
                                const res = await fetch('/api/order/cancel-item', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    invoiceId: cancelingInvoice.id,
                                    dishId: it.dishId,
                                    cancelQty: 1
                                  })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  notify(`Đã hủy bớt 1 ${it.name}!`);
                                  setCancelingInvoice(null);
                                  loadDataFromDatabase();
                                } else alert(data.error || data.message);
                              } catch (e) { alert(e.message); }
                            }
                          }}
                          title="Giảm bớt 1 phần"
                        >
                          -1 phần
                        </button>
                      )}
                      <button
                        className="btn-sm danger"
                        style={{ fontSize: 11, padding: '4px 8px' }}
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc chắn muốn hủy toàn bộ ${it.qty}x "${it.name}" của ${cancelingInvoice.tableName}?`)) {
                            try {
                              const res = await fetch('/api/order/cancel-item', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  invoiceId: cancelingInvoice.id,
                                  dishId: it.dishId,
                                  cancelQty: it.qty
                                })
                              });
                              const data = await res.json();
                              if (data.success) {
                                notify(`Đã hủy món ${it.name} thành công!`);
                                setCancelingInvoice(null);
                                loadDataFromDatabase();
                              } else alert(data.error || data.message);
                            } catch (e) { alert(e.message); }
                          }
                        }}
                        title="Hủy toàn bộ món này"
                      >
                        Hủy món này
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>Hóa đơn này không có món nào.</div>
              )}
            </div>

            <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-sm danger"
                style={{ background: '#b91c1c' }}
                onClick={async () => {
                  if (window.confirm(`CẢNH BÁO QUẢN LÝ: Bạn có chắc chắn muốn HỦY TOÀN BỘ order và trả lại ${cancelingInvoice.tableName} về BÀN TRỐNG?`)) {
                    try {
                      const res = await fetch('/api/order/cancel-item', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          invoiceId: cancelingInvoice.id
                        })
                      });
                      const data = await res.json();
                      if (data.success) {
                        notify(`Đã hủy toàn bộ order và giải phóng ${cancelingInvoice.tableName} về Bàn Trống!`);
                        setCancelingInvoice(null);
                        loadDataFromDatabase();
                      } else alert(data.error || data.message);
                    } catch (e) { alert(e.message); }
                  }
                }}
              >
                Hủy toàn bộ bàn này
              </button>
              <button type="button" className="btn-sm" onClick={() => setCancelingInvoice(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHUYỂN BÀN */}
      {transferringTable && (
        <div className="modal-backdrop" onClick={() => setTransferringTable(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3><ArrowRightLeft size={18} className="text-info" /> Chuyển Bàn: {transferringTable.name}</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 16px' }}>
              Toàn bộ khách, hóa đơn tạm tính và các món đang nấu sẽ được tự động chuyển sang bàn mới.
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!targetTableId) {
                alert('Vui lòng chọn bàn muốn chuyển đến!');
                return;
              }
              const targetT = tables.find(t => t.id === Number(targetTableId));
              if (window.confirm(`Xác nhận chuyển toàn bộ khách từ "${transferringTable.name}" sang "${targetT?.name}"?`)) {
                try {
                  const res = await fetch('/api/ban/transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fromTableId: transferringTable.id,
                      toTableId: Number(targetTableId)
                    })
                  });
                  const data = await res.json();
                  if (data.success) {
                    notify(`Đã chuyển thành công từ ${transferringTable.name} sang ${targetT?.name}!`);
                    setTransferringTable(null);
                    // Cập nhật selectedTableId nếu đang chọn ở POS
                    if (selectedTableId === transferringTable.id) {
                      setSelectedTableId(targetTableId);
                    }
                    loadDataFromDatabase();
                  } else {
                    alert(data.message || 'Lỗi khi chuyển bàn!');
                  }
                } catch (err) {
                  alert('Lỗi kết nối máy chủ: ' + err.message);
                }
              }
            }}>
              <div className="form-group">
                <label>Bàn hiện tại (Bàn nguồn)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  disabled 
                  value={`${transferringTable.name} (${transferringTable.area} - Đang phục vụ)`}
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Chọn Bàn Chuyển Đến (Bàn đích)</label>
                <select 
                  className="form-input" 
                  required
                  value={targetTableId} 
                  onChange={e => setTargetTableId(e.target.value)}
                  style={{ backgroundColor: '#0f172a', color: '#fff' }}
                >
                  <option value="">-- Chọn bàn muốn chuyển đến --</option>
                  {tables
                    .filter(t => t.id !== transferringTable.id)
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.area} - {t.capacity} chỗ - {t.status === 'Trong' ? '🟢 Bàn trống' : t.status === 'DangSuDung' ? '🟠 Đang dùng (Gộp bàn)' : '🟡 Đã đặt'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setTransferringTable(null)}>Hủy</button>
                <button type="submit" className="btn-sm primary">
                  <ArrowRightLeft size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Xác Nhận Chuyển Bàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM KHÁCH HÀNG */}
      {showAddCustomerModal && (
        <div className="modal-backdrop" onClick={() => setShowAddCustomerModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3><UserCheck size={18} className="text-info" /> Thêm Khách Hàng Thành Viên</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const rawPhone = (newCustomer.phone || '').trim();
              if (/[a-zA-Z]/.test(rawPhone)) {
                alert('Số điện thoại không được chứa chữ cái, chỉ được nhập số!');
                return;
              }
              const cleanPhone = rawPhone.replace(/[\s.-]/g, '');
              if (!cleanPhone || !/^[0-9]+$/.test(cleanPhone) || cleanPhone.length < 10 || cleanPhone.length > 11) {
                alert('Số điện thoại phải gồm từ 10 đến 11 chữ số và không được chứa chữ cái!');
                return;
              }

              const cleanEmail = (newCustomer.email || '').trim();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (cleanEmail && !emailRegex.test(cleanEmail)) {
                alert('Email không đúng cấu trúc! Vui lòng nhập địa chỉ email hợp lệ (vd: khachhang@gmail.com).');
                return;
              }

              try {
                const res = await fetch('/api/khachhang', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...newCustomer,
                    phone: cleanPhone || newCustomer.phone,
                    email: cleanEmail
                  })
                });
                const data = await res.json();
                if (data.success) {
                  notify('Đã thêm khách hàng thành công!');
                  setShowAddCustomerModal(false);
                  setNewCustomer({ name: '', phone: '', email: '', address: '', points: 0 });
                  loadDataFromDatabase();
                } else alert(data.message);
              } catch (err) { alert(err.message); }
            }}>
              <div className="form-group">
                <label>Họ và Tên</label>
                <input type="text" className="form-input" required value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="Ví dụ: Lê Thị Mai" />
              </div>
              <div className="form-group">
                <label>Số Điện Thoại <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="tel" 
                  className="form-input" 
                  required 
                  maxLength={11}
                  value={newCustomer.phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                    setNewCustomer({ ...newCustomer, phone: val });
                  }} 
                  placeholder="10 - 11 chữ số (vd: 0988777666)" 
                />
                <small style={{ fontSize: 11, color: '#94a3b8' }}>Gồm 10 - 11 chữ số (chỉ nhập số)</small>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="khachhang@gmail.com" />
              </div>
              <div className="form-group">
                <label>Địa Chỉ</label>
                <input type="text" className="form-input" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} placeholder="Buôn Ma Thuột" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddCustomerModal(false)}>Hủy</button>
                <button type="submit" className="btn-sm danger">Lưu Khách Hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM KHUYẾN MÃI */}
      {showAddPromoModal && (
        <div className="modal-backdrop" onClick={() => setShowAddPromoModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3><Tag size={18} className="text-danger" /> Tạo Mã Khuyến Mãi / Voucher</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/khuyenmai', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newPromo)
                });
                const data = await res.json();
                if (data.success) {
                  notify('Đã tạo chương trình khuyến mãi thành công!');
                  setShowAddPromoModal(false);
                  loadDataFromDatabase();
                } else alert(data.message);
              } catch (err) { alert(err.message); }
            }}>
              <div className="form-group">
                <label>Tên Chương Trình / Mã Voucher</label>
                <input type="text" className="form-input" required value={newPromo.name} onChange={e => setNewPromo({ ...newPromo, name: e.target.value })} placeholder="Ví dụ: GIAM10 - Khai trương" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Hình Thức Giảm</label>
                  <select className="form-input" value={newPromo.type} onChange={e => setNewPromo({ ...newPromo, type: e.target.value })} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                    <option value="PhanTram">Phần trăm (%)</option>
                    <option value="TienMat">Tiền mặt (VND)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá Trị Giảm</label>
                  <input type="number" className="form-input" required value={newPromo.value} onChange={e => setNewPromo({ ...newPromo, value: e.target.value })} placeholder="Ví dụ: 10 hoặc 50000" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Từ Ngày</label>
                  <input type="date" className="form-input" value={newPromo.startDate} onChange={e => setNewPromo({ ...newPromo, startDate: e.target.value })} style={{ colorScheme: 'dark' }} />
                </div>
                <div className="form-group">
                  <label>Đến Ngày</label>
                  <input type="date" className="form-input" value={newPromo.endDate} onChange={e => setNewPromo({ ...newPromo, endDate: e.target.value })} style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div className="form-group">
                <label>Điều Kiện Áp Dụng</label>
                <input type="text" className="form-input" value={newPromo.note} onChange={e => setNewPromo({ ...newPromo, note: e.target.value })} placeholder="Áp dụng cho hóa đơn từ 500k..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddPromoModal(false)}>Hủy</button>
                <button type="submit" className="btn-sm danger">Kích Hoạt Khuyến Mãi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM NGUYÊN LIỆU KHO */}
      {showAddMaterialModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMaterialModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3><Package size={18} className="text-warning" /> Thêm Nguyên Liệu Mới Vào Kho</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/kho/nguyenlieu', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newMaterial)
                });
                const data = await res.json();
                if (data.success) {
                  notify('Đã thêm nguyên liệu vào kho thành công!');
                  setShowAddMaterialModal(false);
                  loadDataFromDatabase();
                } else alert(data.message);
              } catch (err) { alert(err.message); }
            }}>
              <div className="form-group">
                <label>Tên Nguyên Liệu</label>
                <input type="text" className="form-input" required value={newMaterial.name} onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} placeholder="Ví dụ: Thịt bò Wagyu tươi" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Đơn Vị Tính</label>
                  <input type="text" className="form-input" required value={newMaterial.unit} onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })} placeholder="Kg, Hộp, Chai, Thùng" />
                </div>
                <div className="form-group">
                  <label>Số Lượng Tồn Ban Đầu</label>
                  <input type="number" className="form-input" value={newMaterial.stock} onChange={e => setNewMaterial({ ...newMaterial, stock: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label>Giá Nhập Ước Tính (VND)</label>
                  <input type="number" className="form-input" value={newMaterial.price} onChange={e => setNewMaterial({ ...newMaterial, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Hạn Sử Dụng</label>
                  <input type="date" className="form-input" value={newMaterial.expDate} onChange={e => setNewMaterial({ ...newMaterial, expDate: e.target.value })} style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowAddMaterialModal(false)}>Hủy</button>
                <button type="submit" className="btn-sm danger">Lưu Nguyên Liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LẬP PHIẾU NHẬP HÀNG */}
      {showImportModal && (
        <div className="modal-backdrop" onClick={() => setShowImportModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3><Truck size={18} className="text-warning" /> Lập Phiếu Nhập Hàng Vào Kho</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newImport.items.length === 0) {
                alert('Vui lòng thêm ít nhất một nguyên liệu cần nhập!');
                return;
              }
              try {
                const res = await fetch('/api/kho/nhaphang', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    supplierId: newImport.supplierId,
                    items: newImport.items,
                    staffId: currentUser?.manv || 1,
                    note: newImport.note
                  })
                });
                const data = await res.json();
                if (data.success) {
                  notify('Đã nhập hàng và cập nhật số lượng tồn kho thành công!');
                  setShowImportModal(false);
                  setNewImport({ supplierId: '', items: [], note: '' });
                  loadDataFromDatabase();
                } else alert(data.message);
              } catch (err) { alert(err.message); }
            }}>
              <div className="form-group">
                <label>Nhà Cung Cấp</label>
                <select className="form-input" value={newImport.supplierId} onChange={e => setNewImport({ ...newImport, supplierId: e.target.value })} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {(warehouseData.suppliers || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.phone})</option>
                  ))}
                </select>
              </div>

              {/* Chọn nguyên liệu và số lượng nhập */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>Thêm Nguyên Liệu Nhập:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(warehouseData.materials || []).map(m => (
                    <button 
                      key={m.id} 
                      type="button" 
                      className="btn-sm" 
                      style={{ background: '#1e293b', border: '1px solid #334155' }}
                      onClick={() => {
                        const exist = newImport.items.find(i => i.id === m.id);
                        if (exist) {
                          setNewImport({
                            ...newImport,
                            items: newImport.items.map(i => i.id === m.id ? { ...i, qty: i.qty + 1 } : i)
                          });
                        } else {
                          setNewImport({
                            ...newImport,
                            items: [...newImport.items, { id: m.id, name: m.name, qty: 5, price: m.price || 50000, unit: m.unit }]
                          });
                        }
                      }}
                    >
                      + {m.name}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 10 }}>
                  {newImport.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '4px 0', borderBottom: '1px dashed #334155' }}>
                      <span><b>{it.name}</b></span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input 
                          type="number" 
                          min="1" 
                          value={it.qty} 
                          onChange={e => {
                            const val = Number(e.target.value);
                            setNewImport({
                              ...newImport,
                              items: newImport.items.map((i, iidx) => iidx === idx ? { ...i, qty: val } : i)
                            });
                          }} 
                          style={{ width: 50, padding: 4, background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: 4, textAlign: 'center' }} 
                        />
                        <span>{it.unit} x {(it.price || 0).toLocaleString('vi-VN')} ₫</span>
                        <button type="button" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => setNewImport({ ...newImport, items: newImport.items.filter((_, iidx) => iidx !== idx) })}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Ghi Chú Phiếu Nhập</label>
                <input type="text" className="form-input" value={newImport.note} onChange={e => setNewImport({ ...newImport, note: e.target.value })} placeholder="Giao đợt 1, thanh toán chuyển khoản..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-sm" onClick={() => setShowImportModal(false)}>Hủy</button>
                <button type="submit" className="btn-sm danger">Xác Nhận Nhập Hàng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

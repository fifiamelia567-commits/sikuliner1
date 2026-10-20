/**
 * SIKULINER – Sistem Informasi Penjualan Kuliner
 * Data Dummy Awal (Initial Seed Data)
 * Pengembang: Fifi Amelia (XII RPL 1 - Absen 14)
 */

const DEFAULT_USERS = [
  {
    id: 1,
    nama: "Fifi Amelia",
    username: "owner",
    password: "123",
    role: "owner",
    roleName: "Pemilik UMKM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    username: "kasir",
    password: "123",
    role: "kasir",
    roleName: "Kasir",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    nama: "Budi Santoso",
    username: "karyawan",
    password: "123",
    role: "karyawan",
    roleName: "Karyawan / Dapur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    nama: "Rizky Pratama",
    username: "pelanggan",
    password: "123",
    role: "pelanggan",
    roleName: "Pelanggan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

const DEFAULT_CATEGORIES = [
  { id: 1, nama: "Makanan Utama", icon: "fa-bowl-rice", deskripsi: "Aneka hidangan nasi, mie, dan olahan daging lezat" },
  { id: 2, nama: "Minuman Segar", icon: "fa-mug-hot", deskripsi: "Es teh, kopi susu aren, jus buah, dan minuman dingin" },
  { id: 3, nama: "Snack & Cemilan", icon: "fa-cookie-bite", deskripsi: "Gorengan krispi, dimsum, dan kentang saus keju" },
  { id: 4, nama: "Dessert & Penutup", icon: "fa-ice-cream", deskripsi: "Pencuci mulut manis, es teler, dan roti bakar" }
];

const DEFAULT_MENUS = [
  {
    id: "MNU001",
    nama: "Nasi Goreng Spesial SIKULINER",
    kategori: "Makanan Utama",
    harga: 25000,
    deskripsi: "Nasi goreng bumbu rempah khas dengan suwiran ayam, telur mata sapi, sosis, dan kerupuk udang.",
    foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 142
  },
  {
    id: "MNU002",
    nama: "Ayam Bakar Madu Pedas",
    kategori: "Makanan Utama",
    harga: 28000,
    deskripsi: "Paha ayam bakar bumbu madu karamel dengan lumuran sambal pedas manis, lalapan, dan nasi hangat.",
    foto: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 118
  },
  {
    id: "MNU003",
    nama: "Mie Goreng Aceh Seafood",
    kategori: "Makanan Utama",
    harga: 26000,
    deskripsi: "Mie kuning tebal dengan bumbu rempah kari Aceh, cumi, udang segar, acar bawang, dan emping renyah.",
    foto: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 95
  },
  {
    id: "MNU004",
    nama: "Bebek Goreng Kremes Sambal Korek",
    kategori: "Makanan Utama",
    harga: 35000,
    deskripsi: "Bebek goreng empuk berbumbu gurih dengan taburan kremesan renyah dan cocolan sambal korek nendang.",
    foto: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 84
  },
  {
    id: "MNU005",
    nama: "Sate Ayam Madura (10 Tusuk)",
    kategori: "Makanan Utama",
    harga: 27000,
    deskripsi: "Sate daging ayam empuk dipanggang arang dengan bumbu kacang lembut gurih, kecap manis, dan lontong.",
    foto: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 110
  },
  {
    id: "MNU006",
    nama: "Es Kopi Susu Gula Aren",
    kategori: "Minuman Segar",
    harga: 18000,
    deskripsi: "Perpaduan espresso kopi robusta asli, susu fresh milk creamy, dan manis legit sirup gula aren murni.",
    foto: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 195
  },
  {
    id: "MNU007",
    nama: "Es Teh Manis Melati Jumbo",
    kategori: "Minuman Segar",
    harga: 6000,
    deskripsi: "Seduhan teh melati wangi alami disajikan dingin segar dalam gelas jumbo pengusir dahaga.",
    foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 230
  },
  {
    id: "MNU008",
    nama: "Jus Alpukat Kerok Cokelat",
    kategori: "Minuman Segar",
    harga: 16000,
    deskripsi: "Jus buah alpukat mentega kental dengan saus cokelat manis pekat di sekeliling gelas.",
    foto: "https://images.unsplash.com/photo-1638176066666-ffb2f5d22a57?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 78
  },
  {
    id: "MNU009",
    nama: "Lemon Tea Selasih Dingin",
    kategori: "Minuman Segar",
    harga: 12000,
    deskripsi: "Perasan sari lemon segar dipadu teh melati dingin dan butiran biji selasih yang kaya manfaat.",
    foto: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 62
  },
  {
    id: "MNU010",
    nama: "Dimsum Ayam Udang (4 Pcs)",
    kategori: "Snack & Cemilan",
    harga: 18000,
    deskripsi: "Dimsum siomay kukus isi adonan ayam dan udang juicy disajikan dengan saus cabai asam manis pedas.",
    foto: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 125
  },
  {
    id: "MNU011",
    nama: "Kentang Goreng Saus Keju",
    kategori: "Snack & Cemilan",
    harga: 15000,
    deskripsi: "Kentang goreng renyah keemasan bertabur parsley dengan lumuran saus keju gurih creamy.",
    foto: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 104
  },
  {
    id: "MNU012",
    nama: "Cireng Krispi Bumbu Rujak",
    kategori: "Snack & Cemilan",
    harga: 13000,
    deskripsi: "Camilan tapioka garing di luar kenyal di dalam, dicocol sambal rujak gula merah pedas segar.",
    foto: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80",
    status: "Habis",
    terjual: 88
  },
  {
    id: "MNU013",
    nama: "Pisang Bakar Cokelat Keju",
    kategori: "Dessert & Penutup",
    harga: 15000,
    deskripsi: "Pisang raja manis dipanggang harum mentega, diberi topping keju cheddar melimpah, meses, dan kental manis.",
    foto: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 73
  },
  {
    id: "MNU014",
    nama: "Es Teler Durian Spesial",
    kategori: "Dessert & Penutup",
    harga: 22000,
    deskripsi: "Es serut dengan topping durian montong manis, potongan alpukat, nangka wangi, kelapa muda, dan susu kental manis.",
    foto: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&auto=format&fit=crop&q=80",
    status: "Tersedia",
    terjual: 91
  }
];

const DEFAULT_BAHAN = [
  { id: "BHN001", nama: "Beras Rojolele Premium", satuan: "kg", stok: 45, stokMin: 20, updateTerakhir: "2026-10-19" },
  { id: "BHN002", nama: "Daging Ayam Fillet Segar", satuan: "kg", stok: 4, stokMin: 10, updateTerakhir: "2026-10-20" }, // Stok Menipis!
  { id: "BHN003", nama: "Minyak Goreng Sawit", satuan: "liter", stok: 8, stokMin: 15, updateTerakhir: "2026-10-20" }, // Stok Menipis!
  { id: "BHN004", nama: "Telur Ayam Negeri", satuan: "kg", stok: 24, stokMin: 10, updateTerakhir: "2026-10-18" },
  { id: "BHN005", nama: "Cabai Rawit Merah", satuan: "kg", stok: 2.5, stokMin: 5, updateTerakhir: "2026-10-20" }, // Stok Menipis!
  { id: "BHN006", nama: "Bawang Merah & Bawang Putih", satuan: "kg", stok: 14, stokMin: 6, updateTerakhir: "2026-10-19" },
  { id: "BHN007", nama: "Biji Kopi Robusta Blend", satuan: "kg", stok: 7.5, stokMin: 3, updateTerakhir: "2026-10-17" },
  { id: "BHN008", nama: "Gula Aren Cair Asli", satuan: "liter", stok: 3, stokMin: 6, updateTerakhir: "2026-10-20" }, // Stok Menipis!
  { id: "BHN009", nama: "Susu UHT Fresh Full Cream", satuan: "liter", stok: 16, stokMin: 8, updateTerakhir: "2026-10-19" },
  { id: "BHN010", nama: "Teh Melati Tubruk", satuan: "pack", stok: 18, stokMin: 8, updateTerakhir: "2026-10-15" },
  { id: "BHN011", nama: "Daging Bebek Potong", satuan: "ekor", stok: 15, stokMin: 8, updateTerakhir: "2026-10-19" },
  { id: "BHN012", nama: "Keju Cheddar Blok", satuan: "pack", stok: 9, stokMin: 4, updateTerakhir: "2026-10-18" }
];

const DEFAULT_PELANGGAN = [
  { id: "PLG001", nama: "Andi Kurniawan", noTelp: "0812-3456-7890", alamat: "Jl. Merdeka No. 12, Jakarta", totalTransaksi: 12 },
  { id: "PLG002", nama: "Dewi Lestari", noTelp: "0819-8765-4321", alamat: "Jl. Anggrek No. 5B, Kebayoran", totalTransaksi: 8 },
  { id: "PLG003", nama: "Hendra Wijaya", noTelp: "0857-1234-5678", alamat: "Komp. Graha Indah Blok C-4", totalTransaksi: 15 },
  { id: "PLG004", nama: "Maya Anggraini", noTelp: "0821-9988-7766", alamat: "Apartemen Senopati Tower B", totalTransaksi: 6 },
  { id: "PLG005", nama: "Ahmad Fauzi", noTelp: "0813-7788-9900", alamat: "Jl. Fatmawati No. 88, Cilandak", totalTransaksi: 9 },
  { id: "PLG006", nama: "Rina Kusuma", noTelp: "0878-2233-4455", alamat: "Jl. Kemang Raya No. 17", totalTransaksi: 4 }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "TRX-20261020-001",
    tanggal: "2026-10-20 09:30:15",
    kasir: "Siti Rahmawati",
    pelanggan: "Andi Kurniawan",
    tipePesanan: "Dine In (Meja 04)",
    items: [
      { id: "MNU001", nama: "Nasi Goreng Spesial SIKULINER", harga: 25000, qty: 2, subtotal: 50000 },
      { id: "MNU006", nama: "Es Kopi Susu Gula Aren", harga: 18000, qty: 2, subtotal: 36000 }
    ],
    totalHarga: 86000,
    diskon: 0,
    totalBayar: 86000,
    metodeBayar: "QRIS",
    jumlahUang: 86000,
    kembalian: 0,
    status: "Selesai"
  },
  {
    id: "TRX-20261020-002",
    tanggal: "2026-10-20 10:15:40",
    kasir: "Siti Rahmawati",
    pelanggan: "Dewi Lestari",
    tipePesanan: "Take Away",
    items: [
      { id: "MNU002", nama: "Ayam Bakar Madu Pedas", harga: 28000, qty: 1, subtotal: 28000 },
      { id: "MNU007", nama: "Es Teh Manis Melati Jumbo", harga: 6000, qty: 1, subtotal: 6000 },
      { id: "MNU010", nama: "Dimsum Ayam Udang (4 Pcs)", harga: 18000, qty: 1, subtotal: 18000 }
    ],
    totalHarga: 52000,
    diskon: 0,
    totalBayar: 52000,
    metodeBayar: "Tunai",
    jumlahUang: 100000,
    kembalian: 48000,
    status: "Selesai"
  },
  {
    id: "TRX-20261020-003",
    tanggal: "2026-10-20 11:05:22",
    kasir: "Siti Rahmawati",
    pelanggan: "Ahmad Fauzi",
    tipePesanan: "Dine In (Meja 02)",
    items: [
      { id: "MNU004", nama: "Bebek Goreng Kremes Sambal Korek", harga: 35000, qty: 2, subtotal: 70000 },
      { id: "MNU008", nama: "Jus Alpukat Kerok Cokelat", harga: 16000, qty: 2, subtotal: 32000 },
      { id: "MNU011", nama: "Kentang Goreng Saus Keju", harga: 15000, qty: 1, subtotal: 15000 }
    ],
    totalHarga: 117000,
    diskon: 7000,
    totalBayar: 110000,
    metodeBayar: "Tunai",
    jumlahUang: 150000,
    kembalian: 40000,
    status: "Selesai"
  },
  {
    id: "TRX-20261019-014",
    tanggal: "2026-10-19 13:45:10",
    kasir: "Siti Rahmawati",
    pelanggan: "Hendra Wijaya",
    tipePesanan: "Dine In (Meja 01)",
    items: [
      { id: "MNU005", nama: "Sate Ayam Madura (10 Tusuk)", harga: 27000, qty: 2, subtotal: 54000 },
      { id: "MNU007", nama: "Es Teh Manis Melati Jumbo", harga: 6000, qty: 2, subtotal: 12000 },
      { id: "MNU013", nama: "Pisang Bakar Cokelat Keju", harga: 15000, qty: 1, subtotal: 15000 }
    ],
    totalHarga: 81000,
    diskon: 0,
    totalBayar: 81000,
    metodeBayar: "Transfer Bank",
    jumlahUang: 81000,
    kembalian: 0,
    status: "Selesai"
  },
  {
    id: "TRX-20261019-015",
    tanggal: "2026-10-19 19:20:00",
    kasir: "Siti Rahmawati",
    pelanggan: "Maya Anggraini",
    tipePesanan: "Take Away",
    items: [
      { id: "MNU003", nama: "Mie Goreng Aceh Seafood", harga: 26000, qty: 2, subtotal: 52000 },
      { id: "MNU014", nama: "Es Teler Durian Spesial", harga: 22000, qty: 2, subtotal: 44000 }
    ],
    totalHarga: 96000,
    diskon: 0,
    totalBayar: 96000,
    metodeBayar: "QRIS",
    jumlahUang: 96000,
    kembalian: 0,
    status: "Selesai"
  },
  {
    id: "TRX-20261018-009",
    tanggal: "2026-10-18 12:10:33",
    kasir: "Siti Rahmawati",
    pelanggan: "Pelanggan Umum (Walk-in)",
    tipePesanan: "Dine In (Meja 06)",
    items: [
      { id: "MNU001", nama: "Nasi Goreng Spesial SIKULINER", harga: 25000, qty: 3, subtotal: 75000 },
      { id: "MNU007", nama: "Es Teh Manis Melati Jumbo", harga: 6000, qty: 3, subtotal: 18000 }
    ],
    totalHarga: 93000,
    diskon: 0,
    totalBayar: 93000,
    metodeBayar: "Tunai",
    jumlahUang: 100000,
    kembalian: 7000,
    status: "Selesai"
  }
];


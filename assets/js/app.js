/**
 * SIKULINER – Sistem Informasi Penjualan Kuliner
 * Core Application Logic & State Management
 * Pengembang: Fifi Amelia (Kelas XII RPL 1 - Absen 14)
 */

// Application State
const AppState = {
  currentUser: null,
  users: [],
  categories: [],
  menus: [],
  bahan: [],
  pelanggan: [],
  transactions: [],
  cart: [],
  cartCustomer: "Pelanggan Umum",
  cartOrderType: "Dine In (Meja 01)",
  cartDiscount: 0,
  currentView: "login",
  salesChartInstance: null,
  categoryChartInstance: null,
  activeReceipt: null
};

// ==========================================
// 1. DATA INITIALIZATION & PERSISTENCE
// ==========================================

function initData() {
  AppState.users = JSON.parse(localStorage.getItem("sikuliner_users")) || DEFAULT_USERS;
  AppState.categories = JSON.parse(localStorage.getItem("sikuliner_categories")) || DEFAULT_CATEGORIES;
  AppState.menus = JSON.parse(localStorage.getItem("sikuliner_menus")) || DEFAULT_MENUS;
  AppState.bahan = JSON.parse(localStorage.getItem("sikuliner_bahan")) || DEFAULT_BAHAN;
  AppState.pelanggan = JSON.parse(localStorage.getItem("sikuliner_pelanggan")) || DEFAULT_PELANGGAN;
  AppState.transactions = JSON.parse(localStorage.getItem("sikuliner_transactions")) || DEFAULT_TRANSACTIONS;

  const savedUser = localStorage.getItem("sikuliner_session");
  if (savedUser) {
    try {
      AppState.currentUser = JSON.parse(savedUser);
    } catch (e) {
      AppState.currentUser = null;
    }
  }

  saveAllData();
}

function saveAllData() {
  localStorage.setItem("sikuliner_users", JSON.stringify(AppState.users));
  localStorage.setItem("sikuliner_categories", JSON.stringify(AppState.categories));
  localStorage.setItem("sikuliner_menus", JSON.stringify(AppState.menus));
  localStorage.setItem("sikuliner_bahan", JSON.stringify(AppState.bahan));
  localStorage.setItem("sikuliner_pelanggan", JSON.stringify(AppState.pelanggan));
  localStorage.setItem("sikuliner_transactions", JSON.stringify(AppState.transactions));
}

function resetToDefaultData() {
  if (confirm("Apakah Anda yakin ingin mereset seluruh data kembali ke data dummy awal? Semua data baru yang Anda tambahkan akan direset.")) {
    localStorage.clear();
    initData();
    showToast("Data dummy berhasil direset ke pengaturan awal!", "success");
    renderCurrentView();
    updateStockBadge();
  }
}

// ==========================================
// 2. AUTHENTICATION & ROLE MANAGEMENT (Fitur 1 & 15)
// ==========================================

function handleLogin(e) {
  if (e) e.preventDefault();
  const usernameInput = document.getElementById("loginUsername").value.trim();
  const passwordInput = document.getElementById("loginPassword").value.trim();

  const user = AppState.users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

  if (user) {
    AppState.currentUser = user;
    localStorage.setItem("sikuliner_session", JSON.stringify(user));
    showToast(`Selamat datang, ${user.nama} (${user.roleName})!`, "success");
    showMainApp();
  } else {
    showToast("Username atau Password salah! (Coba demo login cepat di bawah)", "error");
  }
}

function quickLogin(role) {
  const user = AppState.users.find(u => u.role === role);
  if (user) {
    document.getElementById("loginUsername").value = user.username;
    document.getElementById("loginPassword").value = user.password;
    AppState.currentUser = user;
    localStorage.setItem("sikuliner_session", JSON.stringify(user));
    showToast(`Masuk sebagai ${user.nama} (${user.roleName})`, "success");
    showMainApp();
  }
}

function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar dari aplikasi SIKULINER?")) {
    AppState.currentUser = null;
    localStorage.removeItem("sikuliner_session");
    AppState.cart = [];
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("appScreen").classList.add("hidden");
    showToast("Anda telah berhasil logout.", "info");
  }
}

function showMainApp() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.remove("hidden");

  // Update User Info in UI
  document.getElementById("userDisplayName").textContent = AppState.currentUser.nama;
  document.getElementById("userRoleBadge").textContent = AppState.currentUser.roleName;
  document.getElementById("userAvatar").src = AppState.currentUser.avatar;

  // Apply Role-based visibility
  applyRolePermissions();

  // Navigate to appropriate default view
  if (AppState.currentUser.role === "pelanggan") {
    navigateTo("pos");
  } else if (AppState.currentUser.role === "karyawan") {
    navigateTo("bahan");
  } else {
    navigateTo("dashboard");
  }

  updateStockBadge();
}

function applyRolePermissions() {
  const role = AppState.currentUser.role;
  const navDashboard = document.getElementById("nav-dashboard");
  const navPos = document.getElementById("nav-pos");
  const navMenu = document.getElementById("nav-menu");
  const navKategori = document.getElementById("nav-kategori");
  const navBahan = document.getElementById("nav-bahan");
  const navNotifikasi = document.getElementById("nav-notifikasi");
  const navPelanggan = document.getElementById("nav-pelanggan");
  const navRiwayat = document.getElementById("nav-riwayat");
  const navLaporan = document.getElementById("nav-laporan");
  const navTerlaris = document.getElementById("nav-terlaris");

  // Show all by default
  [navDashboard, navPos, navMenu, navKategori, navBahan, navNotifikasi, navPelanggan, navRiwayat, navLaporan, navTerlaris].forEach(el => {
    if (el) el.classList.remove("hidden");
  });

  if (role === "kasir") {
    // Kasir has access to POS, Menu, Pelanggan, Riwayat, and Dashboard
    if (navKategori) navKategori.classList.add("hidden");
    if (navLaporan) navLaporan.classList.add("hidden");
  } else if (role === "karyawan") {
    // Dapur / Karyawan needs stock, notifications, menu view
    if (navPos) navPos.classList.add("hidden");
    if (navPelanggan) navPelanggan.classList.add("hidden");
    if (navLaporan) navLaporan.classList.add("hidden");
    if (navTerlaris) navTerlaris.classList.add("hidden");
  } else if (role === "pelanggan") {
    // Pelanggan only sees order / catalog
    [navDashboard, navKategori, navBahan, navNotifikasi, navPelanggan, navRiwayat, navLaporan, navTerlaris].forEach(el => {
      if (el) el.classList.add("hidden");
    });
  }
}

// ==========================================
// 3. NAVIGATION CONTROLLER
// ==========================================

function navigateTo(viewId) {
  AppState.currentView = viewId;

  // Toggle active views
  const views = document.querySelectorAll(".app-view");
  views.forEach(v => v.classList.add("hidden"));

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("animate-fade-in");
  }

  // Update active sidebar nav
  const navItems = document.querySelectorAll(".nav-item-btn");
  navItems.forEach(item => {
    item.classList.remove("bg-emerald-600", "text-white", "font-bold", "shadow-md");
    item.classList.add("text-slate-600", "hover:bg-emerald-50", "hover:text-emerald-700");
  });

  const activeBtn = document.getElementById(`nav-${viewId}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-600", "hover:bg-emerald-50", "hover:text-emerald-700");
    activeBtn.classList.add("bg-emerald-600", "text-white", "font-bold", "shadow-md");
  }

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Render view-specific content
  renderCurrentView();
}

function renderCurrentView() {
  switch (AppState.currentView) {
    case "dashboard":
      renderDashboard();
      break;
    case "pos":
      renderPosMenu();
      renderCart();
      populatePosCustomerSelect();
      break;
    case "menu":
      renderMenuTable();
      populateMenuCategoryOptions();
      break;
    case "kategori":
      renderKategoriGrid();
      break;
    case "bahan":
      renderBahanTable();
      break;
    case "notifikasi":
      renderNotifikasiView();
      break;
    case "pelanggan":
      renderPelangganTable();
      break;
    case "riwayat":
      renderRiwayatTable();
      break;
    case "laporan":
      renderLaporanPenjualan();
      break;
    case "terlaris":
      renderLaporanTerlaris();
      break;
  }
}

// ==========================================
// 4. DASHBOARD (Fitur 2)
// ==========================================

function renderDashboard() {
  // Calculate today's stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTrx = AppState.transactions.filter(t => t.tanggal.startsWith(todayStr));

  const totalPendapatan = todayTrx.reduce((sum, t) => sum + (t.totalBayar || 0), 0);
  const totalTransaksi = todayTrx.length;
  const totalMenu = AppState.menus.filter(m => m.status === "Tersedia").length;
  const bahanMenipisList = AppState.bahan.filter(b => b.stok <= b.stokMin);

  // Update DOM Cards
  document.getElementById("dashTotalPendapatan").textContent = formatRupiah(totalPendapatan);
  document.getElementById("dashTotalTransaksi").textContent = totalTransaksi;
  document.getElementById("dashTotalMenu").textContent = totalMenu;
  document.getElementById("dashBahanMenipis").textContent = bahanMenipisList.length;

  // Mini Table: Bahan Menipis di Dashboard
  const alertContainer = document.getElementById("dashAlertBahanContainer");
  if (bahanMenipisList.length > 0) {
    alertContainer.innerHTML = bahanMenipisList.map(b => `
      <div class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h5 class="text-sm font-bold text-slate-800">${b.nama}</h5>
            <p class="text-xs text-red-600 font-semibold">Tersisa: ${b.stok} ${b.satuan} (Min: ${b.stokMin} ${b.satuan})</p>
          </div>
        </div>
        <button onclick="quickRestock('${b.id}', 10)" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition">
          + Restock 10 ${b.satuan}
        </button>
      </div>
    `).join("");
  } else {
    alertContainer.innerHTML = `
      <div class="text-center py-6 text-slate-400">
        <i class="fa-solid fa-circle-check text-green-500 text-3xl mb-2"></i>
        <p class="text-sm font-medium">Semua stok bahan baku dalam kondisi aman!</p>
      </div>
    `;
  }

  // Recent Transactions in Dashboard
  const recentTable = document.getElementById("dashRecentTrxTable");
  const latestTrx = [...AppState.transactions].slice(0, 5);
  if (latestTrx.length > 0) {
    recentTable.innerHTML = latestTrx.map(t => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="py-3 px-4 text-xs font-bold text-emerald-600">${t.id}</td>
        <td class="py-3 px-4 text-xs text-slate-600">${t.pelanggan}</td>
        <td class="py-3 px-4 text-xs text-slate-500">${t.tipePesanan}</td>
        <td class="py-3 px-4 text-xs font-bold text-slate-800">${formatRupiah(t.totalBayar)}</td>
        <td class="py-3 px-4 text-xs">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">${t.metodeBayar}</span>
        </td>
        <td class="py-3 px-4 text-xs text-right">
          <button onclick="viewReceipt('${t.id}')" class="text-slate-600 hover:text-emerald-600 font-bold text-xs">
            <i class="fa-solid fa-receipt mr-1"></i> Struk
          </button>
        </td>
      </tr>
    `).join("");
  } else {
    recentTable.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-400 text-xs">Belum ada transaksi hari ini</td></tr>`;
  }

  // Render Charts
  renderDashboardCharts();
}

function renderDashboardCharts() {
  if (typeof Chart === "undefined") return;

  // Chart 1: Penjualan 7 Hari Terakhir
  const ctxSales = document.getElementById("chartSalesTrend");
  if (ctxSales) {
    if (AppState.salesChartInstance) AppState.salesChartInstance.destroy();

    // Generate last 7 days labels & values
    const labels = [];
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
      labels.push(dayName);

      const dayTotal = AppState.transactions
        .filter(t => t.tanggal.startsWith(dateStr))
        .reduce((sum, t) => sum + t.totalBayar, 0);

      salesData.push(dayTotal);
    }

    AppState.salesChartInstance = new Chart(ctxSales, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Pendapatan (Rp)",
          data: salesData,
          backgroundColor: "#059669",
          borderRadius: 6,
          hoverBackgroundColor: "#047857"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(val) {
                return "Rp " + (val / 1000) + "k";
              }
            }
          }
        }
      }
    });
  }

  // Chart 2: Kategori Menu Terjual
  const ctxCat = document.getElementById("chartCategoryDist");
  if (ctxCat) {
    if (AppState.categoryChartInstance) AppState.categoryChartInstance.destroy();

    const catLabels = AppState.categories.map(c => c.nama);
    const catCounts = catLabels.map(catName => {
      const menusInCat = AppState.menus.filter(m => m.kategori === catName);
      return menusInCat.reduce((sum, m) => sum + (m.terjual || 0), 0);
    });

    AppState.categoryChartInstance = new Chart(ctxCat, {
      type: "doughnut",
      data: {
        labels: catLabels,
        datasets: [{
          data: catCounts,
          backgroundColor: ["#059669", "#0284c7", "#f59e0b", "#ec4899", "#8b5cf6"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }
}

// ==========================================
// 5. NOTIFIKASI STOK MENIPIS (Fitur 6)
// ==========================================

function updateStockBadge() {
  const menipisCount = AppState.bahan.filter(b => b.stok <= b.stokMin).length;
  const badges = document.querySelectorAll(".badge-stok-menipis");
  badges.forEach(b => {
    b.textContent = menipisCount;
    if (menipisCount > 0) {
      b.classList.remove("hidden");
    } else {
      b.classList.add("hidden");
    }
  });

  const headerAlert = document.getElementById("headerStockAlert");
  if (headerAlert) {
    if (menipisCount > 0) {
      headerAlert.classList.remove("hidden");
      document.getElementById("headerStockAlertCount").textContent = `${menipisCount} Bahan Menipis!`;
    } else {
      headerAlert.classList.add("hidden");
    }
  }
}

function renderNotifikasiView() {
  const menipisList = AppState.bahan.filter(b => b.stok <= b.stokMin);
  const container = document.getElementById("notifikasiListContainer");

  if (menipisList.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fa-solid fa-clipboard-check"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800">Semua Stok Bahan Aman!</h3>
        <p class="text-sm text-slate-500 mt-1">Tidak ada bahan baku yang berada di bawah stok minimum saat ini.</p>
        <button onclick="navigateTo('bahan')" class="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition">
          Lihat Seluruh Stok Bahan
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-4">
      <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div>
        <h4 class="font-bold text-amber-900 text-base">Peringatan: Ada ${menipisList.length} Bahan Baku Membutuhkan Restock!</h4>
        <p class="text-xs text-amber-700 mt-0.5 leading-relaxed">
          Stok bahan di bawah ini telah mencapai atau melewati batas stok minimum. Segera lakukan pengadaan atau restock bahan agar operasional menu makanan & minuman tetap berjalan lancar tanpa kendala kehabisan bahan.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${menipisList.map(b => {
        const kekurangan = Math.max(0, (b.stokMin * 2) - b.stok);
        return `
          <div class="bg-white rounded-2xl p-5 border border-red-200 shadow-sm hover:shadow-md transition relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-extrabold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-600 pulse-warning"></span>
                Stok Menipis
              </span>
              <span class="text-xs font-bold text-slate-400">${b.id}</span>
            </div>

            <h4 class="font-bold text-slate-800 text-base mb-1">${b.nama}</h4>
            <div class="flex items-baseline gap-2 mb-3">
              <span class="text-2xl font-extrabold text-red-600">${b.stok}</span>
              <span class="text-xs font-medium text-slate-500">${b.satuan} tersisa</span>
              <span class="text-xs font-bold text-slate-400 ml-auto">Batas Min: ${b.stokMin} ${b.satuan}</span>
            </div>

            <div class="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
              <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(100, (b.stok / b.stokMin) * 50)}%"></div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Rekomendasi: +${kekurangan} ${b.satuan}</span>
              <button onclick="quickRestock('${b.id}', ${kekurangan > 0 ? kekurangan : 10})" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
                <i class="fa-solid fa-boxes-stacked"></i> Restock Cepat
              </button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ==========================================
// 6. KELOLA DATA MENU (Fitur 3)
// ==========================================

let menuFilterCategory = "Semua";
let menuSearchQuery = "";

function renderMenuTable() {
  const container = document.getElementById("menuTableBody");
  const filtered = AppState.menus.filter(m => {
    const matchCat = menuFilterCategory === "Semua" || m.kategori === menuFilterCategory;
    const matchSearch = m.nama.toLowerCase().includes(menuSearchQuery.toLowerCase()) || m.id.toLowerCase().includes(menuSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">Tidak ada menu yang sesuai dengan filter atau pencarian</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(m => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="py-3 px-4">
        <img src="${m.foto}" alt="${m.nama}" class="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-200" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'">
      </td>
      <td class="py-3 px-4">
        <span class="text-xs font-bold text-emerald-600">${m.id}</span>
        <h5 class="font-bold text-slate-800 text-sm">${m.nama}</h5>
        <p class="text-xs text-slate-400 truncate max-w-xs">${m.deskripsi}</p>
      </td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">${m.kategori}</span>
      </td>
      <td class="py-3 px-4 font-bold text-slate-800 text-sm">
        ${formatRupiah(m.harga)}
      </td>
      <td class="py-3 px-4">
        <span class="text-xs font-bold text-slate-600">${m.terjual || 0} porsi</span>
      </td>
      <td class="py-3 px-4">
        <button onclick="toggleMenuStatus('${m.id}')" class="px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${m.status === 'Tersedia' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}">
          <span class="w-1.5 h-1.5 rounded-full ${m.status === 'Tersedia' ? 'bg-green-500' : 'bg-red-500'}"></span>
          ${m.status}
        </button>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openEditMenuModal('${m.id}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition" title="Edit Menu">
            <i class="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button onclick="deleteMenu('${m.id}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 flex items-center justify-center transition" title="Hapus Menu">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function filterMenuByCategory(category) {
  menuFilterCategory = category;
  renderMenuTable();
}

function searchMenu(query) {
  menuSearchQuery = query;
  renderMenuTable();
}

function toggleMenuStatus(menuId) {
  const m = AppState.menus.find(item => item.id === menuId);
  if (m) {
    m.status = m.status === "Tersedia" ? "Habis" : "Tersedia";
    saveAllData();
    renderMenuTable();
    showToast(`Status menu "${m.nama}" diubah menjadi ${m.status}`, "info");
  }
}

function openAddMenuModal() {
  document.getElementById("menuModalTitle").textContent = "Tambah Menu Kuliner Baru";
  document.getElementById("menuFormId").value = "";
  document.getElementById("menuFormNama").value = "";
  document.getElementById("menuFormHarga").value = "";
  document.getElementById("menuFormDeskripsi").value = "";
  document.getElementById("menuFormFoto").value = "";
  document.getElementById("menuFormStatus").value = "Tersedia";
  populateMenuCategoryOptions();
  openModal("menuModal");
}

function openEditMenuModal(menuId) {
  const m = AppState.menus.find(item => item.id === menuId);
  if (!m) return;
  document.getElementById("menuModalTitle").textContent = "Edit Menu Kuliner";
  document.getElementById("menuFormId").value = m.id;
  document.getElementById("menuFormNama").value = m.nama;
  document.getElementById("menuFormKategori").value = m.kategori;
  document.getElementById("menuFormHarga").value = m.harga;
  document.getElementById("menuFormDeskripsi").value = m.deskripsi;
  document.getElementById("menuFormFoto").value = m.foto;
  document.getElementById("menuFormStatus").value = m.status;
  populateMenuCategoryOptions(m.kategori);
  openModal("menuModal");
}

function saveMenuForm(e) {
  e.preventDefault();
  const id = document.getElementById("menuFormId").value;
  const nama = document.getElementById("menuFormNama").value.trim();
  const kategori = document.getElementById("menuFormKategori").value;
  const harga = parseInt(document.getElementById("menuFormHarga").value, 10) || 0;
  const deskripsi = document.getElementById("menuFormDeskripsi").value.trim();
  let foto = document.getElementById("menuFormFoto").value.trim();
  const status = document.getElementById("menuFormStatus").value;

  if (!foto) {
    foto = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
  }

  if (id) {
    // Edit existing
    const idx = AppState.menus.findIndex(m => m.id === id);
    if (idx !== -1) {
      AppState.menus[idx] = { ...AppState.menus[idx], nama, kategori, harga, deskripsi, foto, status };
      showToast(`Menu "${nama}" berhasil diperbarui!`, "success");
    }
  } else {
    // Add new
    const newId = "MNU" + String(AppState.menus.length + 1).padStart(3, "0");
    AppState.menus.push({
      id: newId,
      nama,
      kategori,
      harga,
      deskripsi,
      foto,
      status,
      terjual: 0
    });
    showToast(`Menu baru "${nama}" berhasil ditambahkan!`, "success");
  }

  saveAllData();
  closeModal("menuModal");
  renderMenuTable();
}

function deleteMenu(menuId) {
  const m = AppState.menus.find(item => item.id === menuId);
  if (!m) return;
  if (confirm(`Apakah Anda yakin ingin menghapus menu "${m.nama}"?`)) {
    AppState.menus = AppState.menus.filter(item => item.id !== menuId);
    saveAllData();
    renderMenuTable();
    showToast(`Menu "${m.nama}" telah dihapus!`, "info");
  }
}

function populateMenuCategoryOptions(selectedCat = "") {
  const select = document.getElementById("menuFormKategori");
  if (!select) return;
  select.innerHTML = AppState.categories.map(c => `
    <option value="${c.nama}" ${c.nama === selectedCat ? "selected" : ""}>${c.nama}</option>
  `).join("");

  const filterSelect = document.getElementById("menuFilterCategorySelect");
  if (filterSelect) {
    filterSelect.innerHTML = `<option value="Semua">Semua Kategori</option>` + AppState.categories.map(c => `
      <option value="${c.nama}">${c.nama}</option>
    `).join("");
  }
}

// ==========================================
// 7. KELOLA KATEGORI MENU (Fitur 4)
// ==========================================

function renderKategoriGrid() {
  const container = document.getElementById("kategoriGridContainer");
  container.innerHTML = AppState.categories.map(cat => {
    const menuCount = AppState.menus.filter(m => m.kategori === cat.nama).length;
    return `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
            <i class="fa-solid ${cat.icon || 'fa-utensils'}"></i>
          </div>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">${menuCount} Menu</span>
        </div>
        <h4 class="font-bold text-slate-800 text-base mb-1">${cat.nama}</h4>
        <p class="text-xs text-slate-500 mb-4">${cat.deskripsi || "Kategori menu kuliner khas SIKULINER"}</p>
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <button onclick="openEditCategoryModal(${cat.id})" class="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button onclick="deleteCategory(${cat.id})" class="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1">
            <i class="fa-solid fa-trash-can"></i> Hapus
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function openAddCategoryModal() {
  document.getElementById("catModalTitle").textContent = "Tambah Kategori Menu";
  document.getElementById("catFormId").value = "";
  document.getElementById("catFormNama").value = "";
  document.getElementById("catFormIcon").value = "fa-utensils";
  document.getElementById("catFormDeskripsi").value = "";
  openModal("categoryModal");
}

function openEditCategoryModal(id) {
  const cat = AppState.categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById("catModalTitle").textContent = "Edit Kategori Menu";
  document.getElementById("catFormId").value = cat.id;
  document.getElementById("catFormNama").value = cat.nama;
  document.getElementById("catFormIcon").value = cat.icon || "fa-utensils";
  document.getElementById("catFormDeskripsi").value = cat.deskripsi || "";
  openModal("categoryModal");
}

function saveCategoryForm(e) {
  e.preventDefault();
  const id = document.getElementById("catFormId").value;
  const nama = document.getElementById("catFormNama").value.trim();
  const icon = document.getElementById("catFormIcon").value.trim() || "fa-utensils";
  const deskripsi = document.getElementById("catFormDeskripsi").value.trim();

  if (id) {
    const idx = AppState.categories.findIndex(c => c.id == id);
    if (idx !== -1) {
      AppState.categories[idx] = { ...AppState.categories[idx], nama, icon, deskripsi };
      showToast(`Kategori "${nama}" berhasil diubah!`, "success");
    }
  } else {
    const newId = AppState.categories.length > 0 ? Math.max(...AppState.categories.map(c => c.id)) + 1 : 1;
    AppState.categories.push({ id: newId, nama, icon, deskripsi });
    showToast(`Kategori "${nama}" berhasil ditambahkan!`, "success");
  }

  saveAllData();
  closeModal("categoryModal");
  renderKategoriGrid();
}

function deleteCategory(id) {
  const cat = AppState.categories.find(c => c.id === id);
  if (!cat) return;
  const inUse = AppState.menus.some(m => m.kategori === cat.nama);
  if (inUse) {
    showToast(`Kategori "${cat.nama}" tidak dapat dihapus karena masih digunakan oleh beberapa menu!`, "error");
    return;
  }
  if (confirm(`Hapus kategori "${cat.nama}"?`)) {
    AppState.categories = AppState.categories.filter(c => c.id !== id);
    saveAllData();
    renderKategoriGrid();
    showToast("Kategori berhasil dihapus", "info");
  }
}

// ==========================================
// 8. KELOLA STOK BAHAN BAKU (Fitur 5)
// ==========================================

let bahanSearchQuery = "";
let bahanFilterStatus = "all"; // "all" or "menipis"

function renderBahanTable() {
  const container = document.getElementById("bahanTableBody");
  const filtered = AppState.bahan.filter(b => {
    const matchSearch = b.nama.toLowerCase().includes(bahanSearchQuery.toLowerCase()) || b.id.toLowerCase().includes(bahanSearchQuery.toLowerCase());
    const matchStatus = bahanFilterStatus === "menipis" ? b.stok <= b.stokMin : true;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Tidak ada data bahan baku</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(b => {
    const isMenipis = b.stok <= b.stokMin;
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="py-3 px-4 text-xs font-bold text-emerald-600">${b.id}</td>
        <td class="py-3 px-4 font-bold text-slate-800 text-sm">${b.nama}</td>
        <td class="py-3 px-4 text-xs font-medium text-slate-600">${b.satuan}</td>
        <td class="py-3 px-4">
          <span class="text-base font-extrabold ${isMenipis ? 'text-red-600' : 'text-slate-800'}">${b.stok}</span>
        </td>
        <td class="py-3 px-4 text-xs font-bold text-slate-500">${b.stokMin} ${b.satuan}</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${isMenipis ? 'bg-red-100 text-red-700 pulse-warning' : 'bg-green-100 text-green-700'}">
            ${isMenipis ? 'Stok Menipis' : 'Stok Aman'}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="adjustBahanStock('${b.id}', -1)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 flex items-center justify-center font-bold text-xs" title="Kurangi 1">
              -1
            </button>
            <button onclick="adjustBahanStock('${b.id}', 1)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-700 flex items-center justify-center font-bold text-xs" title="Tambah 1">
              +1
            </button>
            <button onclick="adjustBahanStock('${b.id}', 5)" class="w-8 h-7 rounded-lg bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-700 flex items-center justify-center font-bold text-xs" title="Tambah 5">
              +5
            </button>
            <button onclick="openEditBahanModal('${b.id}')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-600 flex items-center justify-center text-xs ml-1" title="Edit Bahan">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteBahan('${b.id}')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-600 flex items-center justify-center text-xs" title="Hapus">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function adjustBahanStock(bahanId, delta) {
  const b = AppState.bahan.find(item => item.id === bahanId);
  if (!b) return;
  b.stok = Math.max(0, Math.round((b.stok + delta) * 10) / 10);
  b.updateTerakhir = new Date().toISOString().slice(0, 10);
  saveAllData();
  renderBahanTable();
  updateStockBadge();
  showToast(`Stok ${b.nama} diperbarui: ${b.stok} ${b.satuan}`, "info");
}

function quickRestock(bahanId, amount) {
  adjustBahanStock(bahanId, amount);
  if (AppState.currentView === "notifikasi") {
    renderNotifikasiView();
  } else if (AppState.currentView === "dashboard") {
    renderDashboard();
  }
}

function openAddBahanModal() {
  document.getElementById("bahanModalTitle").textContent = "Tambah Bahan Baku Baru";
  document.getElementById("bahanFormId").value = "";
  document.getElementById("bahanFormNama").value = "";
  document.getElementById("bahanFormSatuan").value = "kg";
  document.getElementById("bahanFormStok").value = "";
  document.getElementById("bahanFormStokMin").value = "";
  openModal("bahanModal");
}

function openEditBahanModal(bahanId) {
  const b = AppState.bahan.find(item => item.id === bahanId);
  if (!b) return;
  document.getElementById("bahanModalTitle").textContent = "Edit Bahan Baku";
  document.getElementById("bahanFormId").value = b.id;
  document.getElementById("bahanFormNama").value = b.nama;
  document.getElementById("bahanFormSatuan").value = b.satuan;
  document.getElementById("bahanFormStok").value = b.stok;
  document.getElementById("bahanFormStokMin").value = b.stokMin;
  openModal("bahanModal");
}

function saveBahanForm(e) {
  e.preventDefault();
  const id = document.getElementById("bahanFormId").value;
  const nama = document.getElementById("bahanFormNama").value.trim();
  const satuan = document.getElementById("bahanFormSatuan").value.trim();
  const stok = parseFloat(document.getElementById("bahanFormStok").value) || 0;
  const stokMin = parseFloat(document.getElementById("bahanFormStokMin").value) || 0;
  const today = new Date().toISOString().slice(0, 10);

  if (id) {
    const idx = AppState.bahan.findIndex(b => b.id === id);
    if (idx !== -1) {
      AppState.bahan[idx] = { ...AppState.bahan[idx], nama, satuan, stok, stokMin, updateTerakhir: today };
      showToast(`Bahan baku "${nama}" berhasil diupdate!`, "success");
    }
  } else {
    const newId = "BHN" + String(AppState.bahan.length + 1).padStart(3, "0");
    AppState.bahan.push({ id: newId, nama, satuan, stok, stokMin, updateTerakhir: today });
    showToast(`Bahan baku baru "${nama}" berhasil ditambahkan!`, "success");
  }

  saveAllData();
  closeModal("bahanModal");
  renderBahanTable();
  updateStockBadge();
}

function deleteBahan(bahanId) {
  const b = AppState.bahan.find(item => item.id === bahanId);
  if (!b) return;
  if (confirm(`Hapus data bahan baku "${b.nama}"?`)) {
    AppState.bahan = AppState.bahan.filter(item => item.id !== bahanId);
    saveAllData();
    renderBahanTable();
    updateStockBadge();
    showToast("Data bahan berhasil dihapus", "info");
  }
}

// ==========================================
// 9. PEMESANAN KASIR & POS (Fitur 7 & 8)
// ==========================================

let posSelectedCategory = "Semua";
let posSearchQuery = "";

function renderPosMenu() {
  const container = document.getElementById("posMenuGrid");
  const filtered = AppState.menus.filter(m => {
    const matchCat = posSelectedCategory === "Semua" || m.kategori === posSelectedCategory;
    const matchSearch = m.nama.toLowerCase().includes(posSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Render category pills
  renderPosCategoryPills();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i class="fa-solid fa-magnifying-glass text-3xl mb-2"></i>
        <p class="text-sm">Menu kuliner tidak ditemukan</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => {
    const isHabis = m.status === "Habis";
    return `
      <div class="pos-menu-card bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col justify-between ${isHabis ? 'opacity-60 grayscale-[50%]' : ''}">
        <div class="relative overflow-hidden rounded-xl mb-2.5 h-32 bg-slate-100">
          <img src="${m.foto}" alt="${m.nama}" class="w-full h-full object-cover transition duration-300 hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-sm">
            ${m.kategori}
          </span>
          ${isHabis ? `<span class="absolute inset-0 bg-red-900/70 text-white flex items-center justify-center font-extrabold text-xs uppercase tracking-wider">Stok Habis</span>` : ''}
        </div>

        <div>
          <h4 class="font-bold text-slate-800 text-xs mb-1 line-clamp-1" title="${m.nama}">${m.nama}</h4>
          <p class="text-[11px] text-slate-400 line-clamp-1 mb-2">${m.deskripsi}</p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <span class="font-extrabold text-emerald-600 text-xs">${formatRupiah(m.harga)}</span>
          <button onclick="addToCart('${m.id}')" ${isHabis ? 'disabled' : ''} class="w-8 h-8 rounded-xl ${isHabis ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-sm'} flex items-center justify-center transition">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderPosCategoryPills() {
  const pillContainer = document.getElementById("posCategoryPills");
  if (!pillContainer) return;

  const categories = ["Semua", ...AppState.categories.map(c => c.nama)];
  pillContainer.innerHTML = categories.map(cat => `
    <button onclick="filterPosByCategory('${cat}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${posSelectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
      ${cat}
    </button>
  `).join("");
}

function filterPosByCategory(category) {
  posSelectedCategory = category;
  renderPosMenu();
}

function searchPosMenu(query) {
  posSearchQuery = query;
  renderPosMenu();
}

function populatePosCustomerSelect() {
  const select = document.getElementById("posCustomerSelect");
  if (!select) return;
  select.innerHTML = `
    <option value="Pelanggan Umum">Pelanggan Umum (Walk-in)</option>
    ${AppState.pelanggan.map(p => `
      <option value="${p.nama}">${p.nama} (${p.noTelp})</option>
    `).join("")}
  `;
}

// Cart Logic
function addToCart(menuId) {
  const menu = AppState.menus.find(m => m.id === menuId);
  if (!menu || menu.status === "Habis") {
    showToast("Maaf, menu sedang habis!", "error");
    return;
  }

  const existing = AppState.cart.find(item => item.id === menuId);
  if (existing) {
    existing.qty += 1;
    existing.subtotal = existing.qty * existing.harga;
  } else {
    AppState.cart.push({
      id: menu.id,
      nama: menu.nama,
      harga: menu.harga,
      qty: 1,
      subtotal: menu.harga,
      foto: menu.foto
    });
  }

  renderCart();
  showToast(`+1 ${menu.nama}`, "info");
}

function updateCartQty(menuId, delta) {
  const item = AppState.cart.find(i => i.id === menuId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    AppState.cart = AppState.cart.filter(i => i.id !== menuId);
  } else {
    item.subtotal = item.qty * item.harga;
  }

  renderCart();
}

function removeCartItem(menuId) {
  AppState.cart = AppState.cart.filter(i => i.id !== menuId);
  renderCart();
}

function clearCart() {
  if (AppState.cart.length === 0) return;
  if (confirm("Kosongkan keranjang pesanan?")) {
    AppState.cart = [];
    AppState.cartDiscount = 0;
    renderCart();
    showToast("Keranjang telah dikosongkan", "info");
  }
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const countBadge = document.getElementById("cartTotalItemBadge");
  const subtotalEl = document.getElementById("cartSubtotal");
  const discountEl = document.getElementById("cartDiscountDisplay");
  const grandTotalEl = document.getElementById("cartGrandTotal");
  const checkoutBtn = document.getElementById("btnProceedPayment");

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - AppState.cartDiscount);

  if (countBadge) countBadge.textContent = `${totalItems} Item`;
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (discountEl) discountEl.textContent = formatRupiah(AppState.cartDiscount);
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(grandTotal);

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-300 text-2xl">
          <i class="fa-solid fa-basket-shopping"></i>
        </div>
        <p class="text-sm font-semibold text-slate-600">Keranjang Masih Kosong</p>
        <p class="text-xs text-slate-400 mt-1">Pilih menu di samping untuk menambahkan pesanan</p>
      </div>
    `;
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }

  container.innerHTML = AppState.cart.map(item => `
    <div class="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
      <img src="${item.foto}" alt="${item.nama}" class="w-12 h-12 object-cover rounded-lg border border-slate-200">
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-bold text-slate-800 truncate">${item.nama}</h5>
        <span class="text-[11px] font-bold text-emerald-600">${formatRupiah(item.harga)}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
        <button onclick="updateCartQty('${item.id}', -1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-red-600 font-bold text-xs">-</button>
        <span class="text-xs font-bold text-slate-800 px-1">${item.qty}</span>
        <button onclick="updateCartQty('${item.id}', 1)" class="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-green-600 font-bold text-xs">+</button>
      </div>
      <button onclick="removeCartItem('${item.id}')" class="text-slate-400 hover:text-red-500 text-xs p-1" title="Hapus">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join("");
}

// ==========================================
// 10. PEMBAYARAN & TRANSAKSI (Fitur 8 & 9)
// ==========================================

let activePaymentMethod = "Tunai";

function openPaymentModal() {
  if (AppState.cart.length === 0) {
    showToast("Keranjang pesanan masih kosong!", "error");
    return;
  }

  const customerSelect = document.getElementById("posCustomerSelect");
  const orderTypeSelect = document.getElementById("posOrderTypeSelect");

  AppState.cartCustomer = customerSelect ? customerSelect.value : "Pelanggan Umum";
  AppState.cartOrderType = orderTypeSelect ? orderTypeSelect.value : "Dine In (Meja 01)";

  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - AppState.cartDiscount);

  document.getElementById("payModalTotalBill").textContent = formatRupiah(grandTotal);
  document.getElementById("payCashInput").value = grandTotal; // Default set to exact amount
  setPaymentMethod("Tunai");
  calculatePaymentChange();

  openModal("paymentModal");
}

function setPaymentMethod(method) {
  activePaymentMethod = method;
  const methods = ["Tunai", "QRIS", "Transfer Bank", "Debit"];
  methods.forEach(m => {
    const btn = document.getElementById(`btnMethod-${m.replace(" ", "")}`);
    if (btn) {
      if (m === method) {
        btn.classList.add("border-emerald-600", "bg-emerald-50", "text-emerald-700", "font-bold");
        btn.classList.remove("border-slate-200", "text-slate-600");
      } else {
        btn.classList.remove("border-emerald-600", "bg-emerald-50", "text-emerald-700", "font-bold");
        btn.classList.add("border-slate-200", "text-slate-600");
      }
    }
  });

  const cashSection = document.getElementById("payCashSection");
  const qrisSection = document.getElementById("payQrisSection");
  const bankSection = document.getElementById("payBankSection");

  if (method === "Tunai") {
    cashSection.classList.remove("hidden");
    qrisSection.classList.add("hidden");
    bankSection.classList.add("hidden");
  } else if (method === "QRIS") {
    cashSection.classList.add("hidden");
    qrisSection.classList.remove("hidden");
    bankSection.classList.add("hidden");
  } else {
    cashSection.classList.add("hidden");
    qrisSection.classList.add("hidden");
    bankSection.classList.remove("hidden");
  }
}

function setQuickCash(amount) {
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - AppState.cartDiscount);

  if (amount === "pas") {
    document.getElementById("payCashInput").value = grandTotal;
  } else {
    document.getElementById("payCashInput").value = amount;
  }
  calculatePaymentChange();
}

function calculatePaymentChange() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - AppState.cartDiscount);
  const cashGiven = parseFloat(document.getElementById("payCashInput").value) || 0;
  const changeEl = document.getElementById("payChangeDisplay");
  const changeAlert = document.getElementById("payChangeAlert");

  if (activePaymentMethod === "Tunai") {
    const change = cashGiven - grandTotal;
    if (change < 0) {
      changeEl.textContent = "- " + formatRupiah(Math.abs(change));
      changeEl.className = "text-sm font-bold text-red-600";
      changeAlert.textContent = "Uang tunai kurang!";
      changeAlert.classList.remove("hidden");
    } else {
      changeEl.textContent = formatRupiah(change);
      changeEl.className = "text-sm font-bold text-green-600";
      changeAlert.classList.add("hidden");
    }
  } else {
    changeEl.textContent = "Rp 0";
    changeEl.className = "text-sm font-bold text-slate-800";
    changeAlert.classList.add("hidden");
  }
}

function processPaymentSubmission() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - AppState.cartDiscount);
  let cashGiven = parseFloat(document.getElementById("payCashInput").value) || 0;

  if (activePaymentMethod !== "Tunai") {
    cashGiven = grandTotal;
  }

  if (activePaymentMethod === "Tunai" && cashGiven < grandTotal) {
    showToast("Nominal uang yang dibayarkan masih kurang!", "error");
    return;
  }

  const change = Math.max(0, cashGiven - grandTotal);
  const now = new Date();
  const dateFormatted = now.toISOString().replace("T", " ").slice(0, 19);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const trxId = `TRX-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${randomSuffix}`;

  // Create Transaction Record
  const newTransaction = {
    id: trxId,
    tanggal: dateFormatted,
    kasir: AppState.currentUser.nama,
    pelanggan: AppState.cartCustomer,
    tipePesanan: AppState.cartOrderType,
    items: JSON.parse(JSON.stringify(AppState.cart)),
    totalHarga: subtotal,
    diskon: AppState.cartDiscount,
    totalBayar: grandTotal,
    metodeBayar: activePaymentMethod,
    jumlahUang: cashGiven,
    kembalian: change,
    status: "Selesai"
  };

  // Update sales counter on menus
  AppState.cart.forEach(cartItem => {
    const m = AppState.menus.find(item => item.id === cartItem.id);
    if (m) {
      m.terjual = (m.terjual || 0) + cartItem.qty;
    }
  });

  // Update customer purchase count
  const cust = AppState.pelanggan.find(p => p.nama === AppState.cartCustomer);
  if (cust) {
    cust.totalTransaksi = (cust.totalTransaksi || 0) + 1;
  }

  AppState.transactions.unshift(newTransaction);
  saveAllData();

  // Reset Cart
  AppState.cart = [];
  AppState.cartDiscount = 0;
  closeModal("paymentModal");

  showToast("Transaksi berhasil diselesaikan!", "success");

  // Automatically show thermal receipt
  viewReceipt(trxId);
}

// ==========================================
// 11. CETAK STRUK PEMBAYARAN (Fitur 10)
// ==========================================

function viewReceipt(trxId) {
  const trx = AppState.transactions.find(t => t.id === trxId);
  if (!trx) return;

  AppState.activeReceipt = trx;
  const receiptContainer = document.getElementById("receiptContent");

  receiptContainer.innerHTML = `
    <div class="print-only-receipt text-slate-800 text-xs font-mono leading-relaxed">
      <!-- Header -->
      <div class="text-center mb-3">
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-sm font-bold">
          <i class="fa-solid fa-utensils"></i>
        </div>
        <h2 class="text-base font-extrabold uppercase tracking-wider text-slate-900">SIKULINER</h2>
        <p class="text-[10px] text-slate-500 font-sans">Sistem Informasi Penjualan Kuliner</p>
        <p class="text-[10px] text-slate-500 font-sans">Jl. Raya Kuliner Nusantara No. 14, Indonesia</p>
        <p class="text-[10px] text-slate-500 font-sans">Telp / WA: 0812-3456-7890</p>
      </div>

      <div class="border-t border-b border-dashed border-slate-400 py-2 my-2 text-[11px]">
        <div class="flex justify-between">
          <span>No. Struk</span>
          <span class="font-bold">${trx.id}</span>
        </div>
        <div class="flex justify-between">
          <span>Waktu</span>
          <span>${trx.tanggal}</span>
        </div>
        <div class="flex justify-between">
          <span>Kasir</span>
          <span>${trx.kasir}</span>
        </div>
        <div class="flex justify-between">
          <span>Pelanggan</span>
          <span>${trx.pelanggan}</span>
        </div>
        <div class="flex justify-between">
          <span>Pesanan</span>
          <span>${trx.tipePesanan}</span>
        </div>
      </div>

      <!-- Item List -->
      <div class="py-1 text-[11px]">
        ${trx.items.map(item => `
          <div class="mb-1.5">
            <div class="font-bold text-slate-900 truncate">${item.nama}</div>
            <div class="flex justify-between text-slate-600">
              <span>${item.qty} x ${formatRupiah(item.harga)}</span>
              <span class="font-bold text-slate-900">${formatRupiah(item.subtotal)}</span>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Totals -->
      <div class="border-t border-dashed border-slate-400 pt-2 my-2 text-[11px]">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${formatRupiah(trx.totalHarga)}</span>
        </div>
        ${trx.diskon > 0 ? `
          <div class="flex justify-between text-red-600">
            <span>Diskon</span>
            <span>-${formatRupiah(trx.diskon)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-1 mt-1">
          <span>TOTAL</span>
          <span>${formatRupiah(trx.totalBayar)}</span>
        </div>
        <div class="flex justify-between text-[11px] mt-1">
          <span>Metode Bayar</span>
          <span class="font-bold">${trx.metodeBayar}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Bayar (Cash)</span>
          <span>${formatRupiah(trx.jumlahUang)}</span>
        </div>
        <div class="flex justify-between text-[11px] font-bold">
          <span>Kembalian</span>
          <span>${formatRupiah(trx.kembalian)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center pt-3 mt-3 border-t border-dashed border-slate-400 text-[10px] text-slate-500 font-sans">
        <p class="font-bold text-slate-800">Terima kasih atas kunjungan Anda!</p>
        <p>Selamat menikmati hidangan lezat kami.</p>
        <p class="mt-2 text-[9px] text-slate-400">SIKULINER ~ Karya: Fifi Amelia (XII RPL 1 - Absen 14)</p>
      </div>
    </div>
  `;

  openModal("receiptModal");
}

function printReceipt() {
  window.print();
}

// ==========================================
// 12. DATA PELANGGAN (Fitur 11)
// ==========================================

let pelangganSearchQuery = "";

function renderPelangganTable() {
  const container = document.getElementById("pelangganTableBody");
  const filtered = AppState.pelanggan.filter(p => {
    return p.nama.toLowerCase().includes(pelangganSearchQuery.toLowerCase()) ||
           p.noTelp.includes(pelangganSearchQuery) ||
           p.id.toLowerCase().includes(pelangganSearchQuery.toLowerCase());
  });

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Data pelanggan tidak ditemukan</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="py-3 px-4 text-xs font-bold text-emerald-600">${p.id}</td>
      <td class="py-3 px-4 font-bold text-slate-800 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            ${p.nama.charAt(0)}
          </div>
          ${p.nama}
        </div>
      </td>
      <td class="py-3 px-4 text-xs font-medium text-slate-600">
        <a href="https://wa.me/${p.noTelp.replace(/[^0-9]/g, '')}" target="_blank" class="text-green-600 hover:underline flex items-center gap-1">
          <i class="fa-brands fa-whatsapp"></i> ${p.noTelp}
        </a>
      </td>
      <td class="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">${p.alamat}</td>
      <td class="py-3 px-4 text-xs font-bold text-slate-700">
        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">${p.totalTransaksi || 0}x Order</span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openEditPelangganModal('${p.id}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 flex items-center justify-center text-xs" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deletePelanggan('${p.id}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 flex items-center justify-center text-xs" title="Hapus">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openAddPelangganModal() {
  document.getElementById("pelangganModalTitle").textContent = "Tambah Pelanggan Baru";
  document.getElementById("pelangganFormId").value = "";
  document.getElementById("pelangganFormNama").value = "";
  document.getElementById("pelangganFormTelp").value = "";
  document.getElementById("pelangganFormAlamat").value = "";
  openModal("pelangganModal");
}

function openEditPelangganModal(id) {
  const p = AppState.pelanggan.find(item => item.id === id);
  if (!p) return;
  document.getElementById("pelangganModalTitle").textContent = "Edit Data Pelanggan";
  document.getElementById("pelangganFormId").value = p.id;
  document.getElementById("pelangganFormNama").value = p.nama;
  document.getElementById("pelangganFormTelp").value = p.noTelp;
  document.getElementById("pelangganFormAlamat").value = p.alamat;
  openModal("pelangganModal");
}

function savePelangganForm(e) {
  e.preventDefault();
  const id = document.getElementById("pelangganFormId").value;
  const nama = document.getElementById("pelangganFormNama").value.trim();
  const noTelp = document.getElementById("pelangganFormTelp").value.trim();
  const alamat = document.getElementById("pelangganFormAlamat").value.trim();

  if (id) {
    const idx = AppState.pelanggan.findIndex(p => p.id === id);
    if (idx !== -1) {
      AppState.pelanggan[idx] = { ...AppState.pelanggan[idx], nama, noTelp, alamat };
      showToast(`Data pelanggan "${nama}" berhasil diupdate!`, "success");
    }
  } else {
    const newId = "PLG" + String(AppState.pelanggan.length + 1).padStart(3, "0");
    AppState.pelanggan.push({ id: newId, nama, noTelp, alamat, totalTransaksi: 0 });
    showToast(`Pelanggan baru "${nama}" berhasil didaftarkan!`, "success");
  }

  saveAllData();
  closeModal("pelangganModal");
  renderPelangganTable();
  populatePosCustomerSelect();
}

function deletePelanggan(id) {
  const p = AppState.pelanggan.find(item => item.id === id);
  if (!p) return;
  if (confirm(`Hapus data pelanggan "${p.nama}"?`)) {
    AppState.pelanggan = AppState.pelanggan.filter(item => item.id !== id);
    saveAllData();
    renderPelangganTable();
    populatePosCustomerSelect();
    showToast("Pelanggan berhasil dihapus", "info");
  }
}

// ==========================================
// 13. RIWAYAT TRANSAKSI (Fitur 12)
// ==========================================

let riwayatSearchQuery = "";
let riwayatDateFilter = "all"; // "today", "week", "all"

function renderRiwayatTable() {
  const container = document.getElementById("riwayatTableBody");
  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = AppState.transactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(riwayatSearchQuery.toLowerCase()) ||
                        t.pelanggan.toLowerCase().includes(riwayatSearchQuery.toLowerCase()) ||
                        t.kasir.toLowerCase().includes(riwayatSearchQuery.toLowerCase());

    let matchDate = true;
    if (riwayatDateFilter === "today") {
      matchDate = t.tanggal.startsWith(todayStr);
    }

    return matchSearch && matchDate;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Tidak ada riwayat transaksi</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const totalItems = t.items.reduce((s, i) => s + i.qty, 0);
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-bold text-emerald-600 text-xs">${t.id}</td>
        <td class="py-3 px-4 text-xs text-slate-500">${t.tanggal}</td>
        <td class="py-3 px-4 text-xs font-bold text-slate-800">${t.pelanggan}</td>
        <td class="py-3 px-4 text-xs text-slate-600">${t.tipePesanan}</td>
        <td class="py-3 px-4 text-xs text-slate-600">${totalItems} item</td>
        <td class="py-3 px-4 font-extrabold text-slate-900 text-xs">${formatRupiah(t.totalBayar)}</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">${t.metodeBayar}</span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="viewReceipt('${t.id}')" class="px-3 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition">
            <i class="fa-solid fa-receipt mr-1"></i> Struk
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ==========================================
// 14. LAPORAN PENJUALAN (Fitur 13)
// ==========================================

let laporanPeriode = "semua"; // "hari-ini", "7-hari", "bulan-ini", "semua"

function setLaporanPeriode(periode) {
  laporanPeriode = periode;
  document.querySelectorAll(".laporan-filter-btn").forEach(btn => {
    btn.classList.remove("bg-emerald-600", "text-white");
    btn.classList.add("bg-slate-100", "text-slate-600");
  });
  const activeBtn = document.getElementById(`btnLap-${periode}`);
  if (activeBtn) {
    activeBtn.classList.remove("bg-slate-100", "text-slate-600");
    activeBtn.classList.add("bg-emerald-600", "text-white");
  }
  renderLaporanPenjualan();
}

function getFilteredTransactionsForLaporan() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  return AppState.transactions.filter(t => {
    if (laporanPeriode === "hari-ini") {
      return t.tanggal.startsWith(todayStr);
    } else if (laporanPeriode === "7-hari") {
      const d = new Date(t.tanggal.replace(" ", "T"));
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    } else if (laporanPeriode === "bulan-ini") {
      return t.tanggal.startsWith(currentMonthStr);
    }
    return true; // semua
  });
}

function renderLaporanPenjualan() {
  const trxs = getFilteredTransactionsForLaporan();

  const totalOmset = trxs.reduce((sum, t) => sum + (t.totalBayar || 0), 0);
  const totalTrx = trxs.length;
  const avgTrx = totalTrx > 0 ? Math.round(totalOmset / totalTrx) : 0;
  const totalItemTerjual = trxs.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0), 0);

  document.getElementById("lapTotalOmset").textContent = formatRupiah(totalOmset);
  document.getElementById("lapTotalTransaksi").textContent = totalTrx;
  document.getElementById("lapRataRata").textContent = formatRupiah(avgTrx);
  document.getElementById("lapTotalPorsi").textContent = `${totalItemTerjual} Porsi`;

  const container = document.getElementById("laporanTableBody");
  if (trxs.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Tidak ada transaksi dalam periode ini</td></tr>`;
    return;
  }

  container.innerHTML = trxs.map(t => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="py-3 px-4 font-bold text-emerald-600 text-xs">${t.id}</td>
      <td class="py-3 px-4 text-xs text-slate-500">${t.tanggal}</td>
      <td class="py-3 px-4 text-xs font-bold text-slate-800">${t.pelanggan}</td>
      <td class="py-3 px-4 text-xs text-slate-600">${t.kasir}</td>
      <td class="py-3 px-4 text-xs">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${t.metodeBayar}</span>
      </td>
      <td class="py-3 px-4 font-extrabold text-slate-900 text-xs text-right">${formatRupiah(t.totalBayar)}</td>
      <td class="py-3 px-4 text-center">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Lunas</span>
      </td>
    </tr>
  `).join("");
}

function printLaporan() {
  const trxs = getFilteredTransactionsForLaporan();
  const totalOmset = trxs.reduce((sum, t) => sum + (t.totalBayar || 0), 0);
  const now = new Date().toLocaleString("id-ID");

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Penjualan - SIKULINER</title>
      <style>
        body { font-family: sans-serif; padding: 20px; font-size: 12px; color: #1e293b; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 4px 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f8fafc; font-weight: bold; }
        .text-right { text-align: right; }
        .summary-box { margin-top: 20px; float: right; width: 300px; border: 1px solid #ddd; padding: 10px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
        .footer { margin-top: 80px; text-align: center; font-size: 11px; color: #777; clear: both; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SIKULINER – SISTEM INFORMASI PENJUALAN KULINER</h1>
        <p>Laporan Rekapitulasi Penjualan Kuliner</p>
        <p>Dicetak pada: ${now} | Oleh: ${AppState.currentUser.nama}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>No. Transaksi</th>
            <th>Waktu</th>
            <th>Pelanggan</th>
            <th>Kasir</th>
            <th>Metode</th>
            <th class="text-right">Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          ${trxs.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.tanggal}</td>
              <td>${t.pelanggan}</td>
              <td>${t.kasir}</td>
              <td>${t.metodeBayar}</td>
              <td class="text-right">${formatRupiah(t.totalBayar)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-row">
          <span>Total Transaksi:</span>
          <span>${trxs.length} Transaksi</span>
        </div>
        <div class="summary-row">
          <span>Total Pendapatan:</span>
          <span>${formatRupiah(totalOmset)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Aplikasi SIKULINER – Pengembang: Fifi Amelia (XII RPL 1 - Absen 14)</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// ==========================================
// 15. LAPORAN MENU TERLARIS (Fitur 14)
// ==========================================

function renderLaporanTerlaris() {
  const container = document.getElementById("terlarisListContainer");
  const sorted = [...AppState.menus].sort((a, b) => (b.terjual || 0) - (a.terjual || 0));
  const maxSold = sorted.length > 0 ? (sorted[0].terjual || 1) : 1;

  container.innerHTML = sorted.map((m, idx) => {
    const rank = idx + 1;
    let badgeClass = "bg-slate-100 text-slate-600";
    let trophyIcon = "";

    if (rank === 1) {
      badgeClass = "bg-amber-100 text-amber-700 font-extrabold border border-amber-300";
      trophyIcon = "🥇 Juara 1";
    } else if (rank === 2) {
      badgeClass = "bg-slate-200 text-slate-700 font-bold border border-slate-300";
      trophyIcon = "🥈 Juara 2";
    } else if (rank === 3) {
      badgeClass = "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300";
      trophyIcon = "🥉 Juara 3";
    }

    const percentage = Math.round(((m.terjual || 0) / maxSold) * 100);
    const estimatedRevenue = (m.terjual || 0) * m.harga;

    return `
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${badgeClass}">
            ${rank <= 3 ? trophyIcon.slice(0, 2) : `#${rank}`}
          </div>
          <img src="${m.foto}" alt="${m.nama}" class="w-14 h-14 object-cover rounded-xl border border-slate-200 flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-slate-800 text-sm">${m.nama}</h4>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">${m.kategori}</span>
            </div>
            <p class="text-xs text-emerald-600 font-bold">${formatRupiah(m.harga)} / porsi</p>
          </div>
        </div>

        <div class="flex-1 max-w-xs w-full">
          <div class="flex justify-between text-xs font-bold mb-1">
            <span class="text-slate-600">Total Terjual</span>
            <span class="text-slate-900">${m.terjual || 0} Porsi</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
          </div>
        </div>

        <div class="text-right flex-shrink-0">
          <span class="text-[11px] text-slate-400 block font-medium">Estimasi Pendapatan</span>
          <span class="font-extrabold text-slate-900 text-sm">${formatRupiah(estimatedRevenue)}</span>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// 16. UTILITY HELPERS (Modal, Toast, Format)
// ==========================================

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount || 0);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  let bgClass = "bg-slate-900 text-white";
  let icon = "fa-circle-info";

  if (type === "success") {
    bgClass = "bg-green-600 text-white";
    icon = "fa-circle-check";
  } else if (type === "error") {
    bgClass = "bg-red-600 text-white";
    icon = "fa-triangle-exclamation";
  } else if (type === "warning") {
    bgClass = "bg-amber-500 text-white";
    icon = "fa-bell";
  }

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold ${bgClass} animate-fade-in transition duration-300`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("-translate-x-full");
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add("-translate-x-full");
  }
}

// ==========================================
// 17. INITIALIZATION ON DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initData();

  if (AppState.currentUser) {
    showMainApp();
  } else {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("appScreen").classList.add("hidden");
  }
});


// app.js

// Dummy data
const siswaData = [];
const petugasData = [
  { id: 1, nama: "Administrator", username: "admin", password: "admin123", role: "administrator" }
];
const kelasData = [
  { id: 1, nama: "X IPA 1" },
  { id: 2, nama: "X IPA 2" },
  { id: 3, nama: "X IPS 1" },
  { id: 4, nama: "X IPS 2" },
  { id: 5, nama: "XI IPA 1" },
  { id: 6, nama: "XI IPA 2" },
  { id: 7, nama: "XI IPS 1" },
  { id: 8, nama: "XI IPS 2" },
  { id: 9, nama: "XII IPA 1" },
  { id: 10, nama: "XII IPA 2" },
  { id: 11, nama: "XII IPS 1" },
  { id: 12, nama: "XII IPS 2" }
];
const sppData = [
  { id: 1, tahun: 2024, nominal: 250000 }
];
const historyData = [];

// Load siswa dari localStorage jika ada
function loadSiswaFromLocalStorage() {
  const savedSiswa = localStorage.getItem('siswaData');
  if (savedSiswa) {
    const parsedData = JSON.parse(savedSiswa);
    siswaData.length = 0; // Clear array
    parsedData.forEach(siswa => siswaData.push(siswa));
  }
}

// Panggil fungsi load saat halaman dimuat
loadSiswaFromLocalStorage();

// Listen untuk pesan dari halaman sign up
window.addEventListener('message', function(event) {
  if (event.data === 'refreshSignup') {
    loadSiswaFromLocalStorage();
  }
});

// Role-based access
const fiturRole = {
  administrator: ['crudSiswa', 'crudKelas', 'crudSpp', 'history', 'laporan'],
  petugas: ['crudSiswa', 'history', 'laporan'],
  siswa: ['history']
};

let currentRole = null;
let currentUser = null;

// Setup login navigation
document.getElementById('adminLoginBtn').onclick = function() {
  document.getElementById('loginOptions').classList.add('hidden');
  document.getElementById('adminLoginSection').classList.remove('hidden');
};

document.getElementById('siswaLoginBtn').onclick = function() {
  document.getElementById('loginOptions').classList.add('hidden');
  document.getElementById('siswaLoginSection').classList.remove('hidden');
  // Load siswa terbaru sebelum login
  loadSiswaFromLocalStorage();
};

// Buka halaman signup di tab baru
document.getElementById('signupBtn').onclick = function(e) {
  e.preventDefault();
  window.open('signup.html', '_blank');
};

document.getElementById('backToOptionsBtn').onclick = function() {
  document.getElementById('adminLoginSection').classList.add('hidden');
  document.getElementById('loginOptions').classList.remove('hidden');
};

document.getElementById('backToOptionsBtn2').onclick = function() {
  document.getElementById('siswaLoginSection').classList.add('hidden');
  document.getElementById('loginOptions').classList.remove('hidden');
};

// Admin Login
document.getElementById('adminLoginForm').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  
  const user = petugasData.find(p => p.username === username && p.password === password);
  
  if (user) {
    currentRole = 'administrator';
    currentUser = user;
    document.getElementById('adminLoginSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('userRole').textContent = "Administrator: " + user.nama;
    document.getElementById('logoutBtn').classList.remove('hidden');
    showMenuByRole();
    showSection(fiturRole[currentRole][0]);
  } else {
    alert("Username atau password salah!");
  }
};

// Siswa Login
document.getElementById('siswaLoginForm').onsubmit = function(e) {
  e.preventDefault();
  const nis = document.getElementById('siswaNIS').value;
  const password = document.getElementById('siswaPassword').value;
  
  // Reload siswa data terbaru
  loadSiswaFromLocalStorage();
  const siswa = siswaData.find(s => s.nis === nis && s.password === password);
  
  if (siswa) {
    currentRole = 'siswa';
    currentUser = siswa;
    document.getElementById('siswaLoginSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('userRole').textContent = "Siswa: " + siswa.nama;
    document.getElementById('logoutBtn').classList.remove('hidden');
    showMenuByRole();
    showSection('history'); // Langsung ke history untuk siswa
  } else {
    alert("NIS atau password salah!");
  }
};

// Logout
document.getElementById('logoutBtn').onclick = function() {
  currentRole = null;
  currentUser = null;
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('loginOptions').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('userRole').textContent = '';
};

// Menu navigation
document.querySelectorAll('.menuBtn').forEach(btn => {
  btn.onclick = function() {
    showSection(this.dataset.section);
  };
});

function showMenuByRole() {
  document.querySelectorAll('.menuBtn').forEach(btn => {
    if (fiturRole[currentRole].includes(btn.dataset.section)) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
  // Render content
  if (sectionId === 'crudSiswa') renderSiswa();
  if (sectionId === 'crudKelas') renderKelas();
  if (sectionId === 'crudSpp') renderSpp();
  if (sectionId === 'history') renderHistory();
  if (sectionId === 'laporan') renderLaporan();
}

// Render functions
function renderSiswa() {
  // Load siswa terbaru
  loadSiswaFromLocalStorage();
  
  let html = `
    <div class="mb-4">
      <button id="addSiswaBtn" class="bg-blue-700 text-white px-4 py-2 rounded action-btn">Tambah Mahasiswa</button>
    </div>`;
  
  if (siswaData.length === 0) {
    html += `<div class="bg-yellow-100 p-4 rounded">Belum ada data siswa. Silakan tambahkan siswa baru.</div>`;
  } else {
    html += `<table class="min-w-full border"><thead><tr>
      <th class="border px-2 py-1">NIS</th>
      <th class="border px-2 py-1">Nama</th>
      <th class="border px-2 py-1">Kelas</th>
      <th class="border px-2 py-1">Aksi</th>
    </tr></thead><tbody>`;
    siswaData.forEach(s => {
      html += `<tr>
        <td class="border px-2 py-1">${s.nis}</td>
        <td class="border px-2 py-1">${s.nama}</td>
        <td class="border px-2 py-1">${s.kelas}</td>
        <td class="border px-2 py-1">
          <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 action-btn" data-id="${s.id}">Edit</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded action-btn" data-id="${s.id}">Hapus</button>
        </td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }
  
  document.getElementById('siswaTable').innerHTML = html;
  
  // Tambah handler untuk tombol tambah siswa
  document.getElementById('addSiswaBtn')?.addEventListener('click', function() {
    renderAddSiswaForm();
  });
}

function renderAddSiswaForm() {
  const html = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full">
        <h3 class="text-lg font-bold mb-4">Tambah Mahasiswa Baru</h3>
        <form id="addSiswaForm">
          <label class="block mb-2">Nama Lengkap</label>
          <input type="text" id="addNama" class="w-full border px-2 py-1 mb-4 rounded" required>
          <label class="block mb-2">NIS</label>
          <input type="text" id="addNIS" class="w-full border px-2 py-1 mb-4 rounded" required>
          <label class="block mb-2">Kelas</label>
          <select id="addKelas" class="w-full border px-2 py-1 mb-4 rounded" required>
            <option value="">Pilih Kelas</option>
            ${kelasData.map(k => `<option value="${k.nama}">${k.nama}</option>`).join('')}
          </select>
          <label class="block mb-2">Password</label>
          <input type="password" id="addPassword" class="w-full border px-2 py-1 mb-4 rounded" required>
          <div class="flex justify-end">
            <button type="button" id="cancelAddSiswa" class="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Batal</button>
            <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv.firstElementChild);
  
  document.getElementById('cancelAddSiswa').addEventListener('click', function() {
    document.querySelector('.fixed.inset-0').remove();
  });
  
  document.getElementById('addSiswaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('addNama').value;
    const nis = document.getElementById('addNIS').value;
    const kelas = document.getElementById('addKelas').value;
    const password = document.getElementById('addPassword').value;
    
    if (siswaData.some(s => s.nis === nis)) {
      alert("NIS sudah terdaftar!");
      return;
    }
    
    const newSiswa = {
      id: siswaData.length > 0 ? Math.max(...siswaData.map(s => s.id)) + 1 : 1,
      nama,
      nis,
      kelas,
      password
    };
    
    siswaData.push(newSiswa);
    alert("Siswa berhasil ditambahkan!");
    document.querySelector('.fixed.inset-0').remove();
    renderSiswa();
  });
}

function renderKelas() {
  let html = `
    <div class="mb-4">
      <button id="addKelasBtn" class="bg-blue-700 text-white px-4 py-2 rounded action-btn">Tambah Program Studi</button>
    </div>
    <table class="min-w-full border"><thead><tr>
      <th class="border px-2 py-1">Nama Program Studi</th>
      <th class="border px-2 py-1">Aksi</th>
    </tr></thead><tbody>`;
  kelasData.forEach(k => {
    html += `<tr>
      <td class="border px-2 py-1">${k.nama}</td>
      <td class="border px-2 py-1">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 action-btn edit-kelas" data-id="${k.id}">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded action-btn delete-kelas" data-id="${k.id}">Hapus</button>
      </td>
    </tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById('kelasTable').innerHTML = html;

  // Event listener untuk tombol tambah kelas
  document.getElementById('addKelasBtn').addEventListener('click', function() {
    renderAddKelasForm();
  });

  // Event listener untuk tombol edit
  document.querySelectorAll('.edit-kelas').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      const kelas = kelasData.find(k => k.id === id);
      if (kelas) {
        renderEditKelasForm(kelas);
      }
    });
  });

  // Event listener untuk tombol hapus
  document.querySelectorAll('.delete-kelas').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      if (confirm('Apakah Anda yakin ingin menghapus Program Studi ini?')) {
        deleteKelas(id);
      }
    });
  });
}

function renderAddKelasForm() {
  const html = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full">
        <h3 class="text-lg font-bold mb-4">Tambah Program Studi Baru</h3>
        <form id="addKelasForm">
          <label class="block mb-2">Nama Program Studi</label>
          <input type="text" id="addNamaKelas" class="w-full border px-2 py-1 mb-4 rounded" required>
          <div class="flex justify-end">
            <button type="button" id="cancelAddKelas" class="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Batal</button>
            <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv.firstElementChild);
  
  document.getElementById('cancelAddKelas').addEventListener('click', function() {
    document.querySelector('.fixed.inset-0').remove();
  });
  
  document.getElementById('addKelasForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('addNamaKelas').value;
    
    if (kelasData.some(k => k.nama === nama)) {
      alert("Nama Program Studi sudah ada!");
      return;
    }
    
    const newKelas = {
      id: kelasData.length > 0 ? Math.max(...kelasData.map(k => k.id)) + 1 : 1,
      nama: nama
    };
    
    kelasData.push(newKelas);
    saveKelasToLocalStorage();
    alert("Program Studi berhasil ditambahkan!");
    document.querySelector('.fixed.inset-0').remove();
    renderKelas();
  });
}

function renderEditKelasForm(kelas) {
  const html = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full">
        <h3 class="text-lg font-bold mb-4">Edit Program Studi</h3>
        <form id="editKelasForm">
          <label class="block mb-2">Nama Program Studi</label>
          <input type="text" id="editNamaKelas" class="w-full border px-2 py-1 mb-4 rounded" value="${kelas.nama}" required>
          <div class="flex justify-end">
            <button type="button" id="cancelEditKelas" class="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Batal</button>
            <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv.firstElementChild);
  
  document.getElementById('cancelEditKelas').addEventListener('click', function() {
    document.querySelector('.fixed.inset-0').remove();
  });
  
  document.getElementById('editKelasForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('editNamaKelas').value;
    
    if (kelasData.some(k => k.nama === nama && k.id !== kelas.id)) {
      alert("Nama Program Studi sudah ada!");
      return;
    }
    
    // Update kelas
    kelas.nama = nama;
    saveKelasToLocalStorage();
    
    // Update kelas di data siswa
    updateKelasInSiswaData(kelas.id, nama);
    
    alert("Program Studi berhasil diupdate!");
    document.querySelector('.fixed.inset-0').remove();
    renderKelas();
  });
}

function deleteKelas(id) {
  // Cek apakah kelas masih digunakan oleh siswa
  const siswaUsingKelas = siswaData.some(s => s.kelas === kelasData.find(k => k.id === id)?.nama);
  if (siswaUsingKelas) {
    alert("Program Studi tidak dapat dihapus karena masih terdapat oleh Mahasiswa!");
    return;
  }
  
  // Hapus kelas
  const index = kelasData.findIndex(k => k.id === id);
  if (index !== -1) {
    kelasData.splice(index, 1);
    saveKelasToLocalStorage();
    alert("Program Studi berhasil dihapus!");
    renderKelas();
  }
}

// Fungsi untuk menyimpan data kelas ke localStorage
function saveKelasToLocalStorage() {
  localStorage.setItem('kelasData', JSON.stringify(kelasData));
}

// Fungsi untuk memuat data kelas dari localStorage
function loadKelasFromLocalStorage() {
  const savedKelas = localStorage.getItem('kelasData');
  if (savedKelas) {
    const parsedData = JSON.parse(savedKelas);
    kelasData.length = 0; // Clear array
    parsedData.forEach(kelas => kelasData.push(kelas));
  }
}

// Fungsi untuk update nama kelas di data siswa
function updateKelasInSiswaData(kelasId, newNama) {
  const oldNama = kelasData.find(k => k.id === kelasId)?.nama;
  if (oldNama) {
    siswaData.forEach(siswa => {
      if (siswa.kelas === oldNama) {
        siswa.kelas = newNama;
      }
    });
    localStorage.setItem('siswaData', JSON.stringify(siswaData));
  }
}

// Panggil loadKelasFromLocalStorage saat aplikasi dimulai
loadKelasFromLocalStorage();

function renderSpp() {
  let html = `
    <div class="mb-4">
      <button id="showTagihanFormBtn" class="bg-purple-700 text-white px-4 py-2 rounded">Buat Tagihan SPP</button>
    </div>
    <div id="tagihanFormContainer" class="hidden mt-8"></div>`;
  document.getElementById('sppTable').innerHTML = html;

  // Event untuk tombol tampilkan form tagihan
  document.getElementById('showTagihanFormBtn')?.addEventListener('click', function() {
    renderTagihanForm();
  });
}

// Tambahkan fungsi untuk simpan dan load historyData ke localStorage
function saveHistoryToLocalStorage() {
  localStorage.setItem('historyData', JSON.stringify(historyData));
}
function loadHistoryFromLocalStorage() {
  const savedHistory = localStorage.getItem('historyData');
  if (savedHistory) {
    historyData.length = 0;
    JSON.parse(savedHistory).forEach(h => historyData.push(h));
  }
}
// Panggil saat aplikasi dimulai
loadHistoryFromLocalStorage();

// Ubah renderTransaksi agar tidak lagi menampilkan form tagihan
function renderTransaksi() {
  loadSiswaFromLocalStorage();
  loadHistoryFromLocalStorage();
  let formHtml = `<div class="bg-gray-50 p-4 rounded shadow">`;
  
  if (siswaData.length === 0) {
    formHtml += `<div class="bg-yellow-100 p-4 rounded mb-4">Belum ada data siswa. Silakan tambahkan siswa terlebih dahulu.</div>`;
  } else {
    formHtml += `
      <form id="transaksiForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-2">NIS Siswa</label>
          <select id="transaksiNIS" class="border px-2 py-1 mb-2 w-full rounded" required>
            <option value="">Pilih Siswa</option>
            ${siswaData.map(s => `<option value="${s.nis}">${s.nis} - ${s.nama}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block mb-2">Bulan</label>
          <select id="transaksiBulan" class="border px-2 py-1 mb-2 w-full rounded" required>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Tahun</label>
          <input type="number" id="transaksiTahun" class="border px-2 py-1 mb-2 w-full rounded" value="2024" required>
        </div>
        <div>
          <label class="block mb-2">Jumlah</label>
          <input type="number" id="transaksiJumlah" class="border px-2 py-1 mb-2 w-full rounded" value="250000" required>
        </div>
        <div class="md:col-span-2">
          <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded action-btn">Simpan Pembayaran (Lunas)</button>
        </div>
      </form>
    `;
  }
  
  formHtml += `</div>`;
  document.getElementById('transaksiForm').innerHTML = formHtml;

  // Event untuk form pembayaran langsung (Lunas)
  document.getElementById('transaksiForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nis = document.getElementById('transaksiNIS').value;
    const bulan = document.getElementById('transaksiBulan').value;
    const tahun = document.getElementById('transaksiTahun').value;
    const jumlah = document.getElementById('transaksiJumlah').value;
    
    const siswa = siswaData.find(s => s.nis === nis);
    if (!siswa) {
      alert("Siswa tidak ditemukan!");
      return;
    }
    
    const newTransaksi = {
      id: historyData.length > 0 ? Math.max(...historyData.map(h => h.id || 0)) + 1 : 1,
      tanggal: new Date().toISOString().split('T')[0],
      bulan: bulan,
      tahun: parseInt(tahun),
      jumlah: parseInt(jumlah),
      status: 'Lunas',
      siswaId: siswa.id,
      siswaNis: siswa.nis,
      siswaNama: siswa.nama
    };
    
    historyData.push(newTransaksi);
    saveHistoryToLocalStorage();
    alert("Pembayaran berhasil disimpan!");
    this.reset();
  });
}

function renderTagihanForm() {
  // Selalu ambil data siswa dan history terbaru dari localStorage
  loadSiswaFromLocalStorage();
  loadHistoryFromLocalStorage();

  // Tampilkan form input tagihan SPP
  const tagihanFormHtml = `
    <form id="buatTagihanForm" class="bg-white p-4 rounded shadow border mt-4">
      <h4 class="font-bold mb-2 text-purple-700">Buat Tagihan SPP</h4>
      <div class="mb-2">
        <label class="block mb-1">NIS Siswa</label>
        <select id="tagihanNIS" class="border px-2 py-1 mb-2 w-full rounded" required>
          <option value="">Pilih Siswa</option>
          ${siswaData.map(s => `<option value="${s.nis}">${s.nis} - ${s.nama}</option>`).join('')}
        </select>
      </div>
      <div class="mb-2">
        <label class="block mb-1">Bulan</label>
        <select id="tagihanBulan" class="border px-2 py-1 mb-2 w-full rounded" required>
          <option value="Januari">Januari</option>
          <option value="Februari">Februari</option>
          <option value="Maret">Maret</option>
          <option value="April">April</option>
          <option value="Mei">Mei</option>
          <option value="Juni">Juni</option>
          <option value="Juli">Juli</option>
          <option value="Agustus">Agustus</option>
          <option value="September">September</option>
          <option value="Oktober">Oktober</option>
          <option value="November">November</option>
          <option value="Desember">Desember</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="block mb-1">Tahun</label>
        <input type="number" id="tagihanTahun" class="border px-2 py-1 mb-2 w-full rounded" value="2024" required>
      </div>
      <div class="mb-2">
        <label class="block mb-1">Jumlah</label>
        <input type="number" id="tagihanJumlah" class="border px-2 py-1 mb-2 w-full rounded" value="250000" required>
      </div>
      <button type="submit" class="bg-purple-700 text-white px-4 py-2 rounded">Buat Tagihan</button>
      <button type="button" id="closeTagihanFormBtn" class="ml-2 border border-gray-400 px-4 py-2 rounded">Batal</button>
    </form>
  `;
  const container = document.getElementById('tagihanFormContainer');
  container.innerHTML = tagihanFormHtml;
  container.classList.remove('hidden');

  // Tombol batal untuk menutup form
  document.getElementById('closeTagihanFormBtn').onclick = function() {
    container.classList.add('hidden');
    container.innerHTML = '';
  };

  // Proses submit form tagihan
  document.getElementById('buatTagihanForm').onsubmit = function(e) {
    e.preventDefault();
    // Ambil data input dari form
    loadSiswaFromLocalStorage();
    loadHistoryFromLocalStorage();
    const nis = document.getElementById('tagihanNIS').value;
    const bulan = document.getElementById('tagihanBulan').value;
    const tahun = document.getElementById('tagihanTahun').value;
    const jumlah = document.getElementById('tagihanJumlah').value;

    // Validasi: pastikan siswa dipilih
    if (!nis) {
      alert('Silakan pilih siswa!');
      return;
    }
    // Validasi: pastikan ada data siswa
    if (siswaData.length === 0) {
      alert('Tidak ada data siswa terdaftar!');
      return;
    }
    // Cari siswa berdasarkan NIS
    const siswa = siswaData.find(s => s.nis === nis);
    if (!siswa) {
      // Jika tidak ditemukan, log error di console (tidak tampilkan alert ke user)
      console.error('NIS tidak ditemukan di siswaData:', nis, siswaData);
      return;
    }
    // Cek apakah tagihan untuk bulan & tahun tsb sudah ada dan belum lunas
    const existing = historyData.find(h => h.siswaId === siswa.id && h.bulan === bulan && h.tahun === parseInt(tahun) && h.status === 'Belum Lunas');
    if (existing) {
      alert('Tagihan untuk bulan dan tahun ini sudah ada dan belum lunas!');
      return;
    }
    // Buat objek tagihan baru
    const newTagihan = {
      id: historyData.length > 0 ? Math.max(...historyData.map(h => h.id || 0)) + 1 : 1,
      tanggal: '', // belum dibayar
      bulan: bulan,
      tahun: parseInt(tahun),
      jumlah: parseInt(jumlah),
      status: 'Belum Lunas',
      siswaId: siswa.id,
      siswaNis: siswa.nis,
      siswaNama: siswa.nama
    };
    // Simpan tagihan ke historyData dan localStorage
    historyData.push(newTagihan);
    saveHistoryToLocalStorage();
    // Tampilkan notifikasi sukses
    alert('Tagihan berhasil dibuat!');
    // Tutup form dan refresh tampilan transaksi
    container.classList.add('hidden');
    container.innerHTML = '';
    renderTransaksi();
  };
}

// Update renderHistory agar selalu load history terbaru
function renderHistory() {
  loadHistoryFromLocalStorage();
  // Filter history berdasarkan user untuk siswa
  const displayData = currentRole === 'siswa' 
    ? historyData.filter(h => h.siswaId === currentUser.id)
    : historyData;

  let html = '';
  
  if (displayData.length === 0) {
    html = `<div class="bg-yellow-100 p-4 rounded">Belum ada data pembayaran.</div>`;
  } else {
    html = `<table class="min-w-full border"><thead><tr>
      <th class="border px-2 py-1">Tanggal</th>
      <th class="border px-2 py-1">Siswa</th>
      <th class="border px-2 py-1">Bulan</th>
      <th class="border px-2 py-1">Tahun</th>
      <th class="border px-2 py-1">Jumlah</th>
      <th class="border px-2 py-1">Status</th>
    </tr></thead><tbody>`;
    displayData.forEach(h => {
      html += `<tr>
        <td class="border px-2 py-1">${h.tanggal}</td>
        <td class="border px-2 py-1">${h.siswaNama || '-'}</td>
        <td class="border px-2 py-1">${h.bulan}</td>
        <td class="border px-2 py-1">${h.tahun}</td>
        <td class="border px-2 py-1">Rp${parseInt(h.jumlah).toLocaleString()}</td>
        <td class="border px-2 py-1">
          <span class="status-badge ${h.status === 'Lunas' ? 'status-lunas' : 'status-belum-lunas'}">
            ${h.status}
          </span>
        </td>
      </tr>`;
      if (currentRole === 'siswa' && h.status === 'Belum Lunas') {
        html += `<tr>
          <td colspan="6">
            <button onclick="bayarTagihan(${h.id})" class="bg-green-500 text-white px-2 py-1 rounded ml-2">Bayar</button>
          </td>
        </tr>`;
      }
    });
    html += `</tbody></table>`;
  }
  
  document.getElementById('historyTable').innerHTML = html;
}

// Update bayarTagihan agar simpan ke localStorage
function bayarTagihan(id) {
  loadHistoryFromLocalStorage();
  const tagihan = historyData.find(h => h.id === id);
  if (tagihan && tagihan.status === 'Belum Lunas') {
    tagihan.status = 'Lunas';
    tagihan.tanggal = new Date().toISOString().split('T')[0];
    saveHistoryToLocalStorage();
    alert('Pembayaran berhasil!');
    renderHistory();
  }
}

function renderLaporan() {
  document.getElementById('laporanContent').innerHTML = `
    <div class="bg-gray-50 p-4 rounded shadow">
      <h3 class="font-bold mb-2">Generate Laporan Pembayaran</h3>
      <form id="laporanForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-2">Periode Bulan</label>
          <select id="laporanBulan" class="border px-2 py-1 mb-2 w-full rounded">
            <option value="">Semua Bulan</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">Tahun</label>
          <input type="number" id="laporanTahun" class="border px-2 py-1 mb-2 w-full rounded" value="2024">
        </div>
        <div class="md:col-span-2">
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded action-btn">Download Laporan</button>
        </div>
      </form>
    </div>
  `;
  
  // Tambahkan event listener untuk form laporan
  document.getElementById('laporanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bulan = document.getElementById('laporanBulan').value;
    const tahun = document.getElementById('laporanTahun').value;
    
    if (historyData.length === 0) {
      alert("Belum ada data transaksi untuk diunduh.");
      return;
    }
    
    alert(`Laporan ${bulan ? bulan + ' ' : ''}${tahun} berhasil diunduh.`);
  });
}

function editStatusPembayaran(id) {
  // tampilkan modal/form untuk edit status
  // setelah submit, update status di historyData dan simpan ke localStorage
}
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  fetch('login_admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      alert("Login berhasil");
      // tampilkan halaman selanjutnya
    } else {
      alert("Login gagal");
    }
  });
});


# 💸 Sistem Pembayaran SPP Berbasis Web

Sistem ini adalah aplikasi manajemen pembayaran SPP (Sumbangan Pembinaan Pendidikan) berbasis web yang dirancang untuk membantu sekolah atau kampus mengelola data mahasiswa, petugas, kelas, tagihan, dan riwayat pembayaran. Dibangun dengan antarmuka sederhana dan ramah pengguna, aplikasi ini mendukung akses login untuk **Administrator**, **Petugas**, dan **Siswa**.

---

## 🚀 Fitur Utama

✅ Login multi-role (Administrator, Petugas, dan Siswa)  
✅ CRUD Data Mahasiswa dan Program Studi  
✅ Pembuatan Tagihan dan Pembayaran SPP  
✅ Riwayat Transaksi dan Pelaporan  
✅ Validasi dan notifikasi antarmuka  
✅ Desain responsif dan interaktif

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Kegunaan |
|----------|----------|
| **HTML + CSS (style.css)** | Menyusun struktur dan tampilan halaman. Digunakan untuk membangun antarmuka pengguna yang responsif dan menarik. |
| **JavaScript (app.js)** | Mengelola logika aplikasi, navigasi antar halaman, validasi form, serta menyimpan data siswa, kelas, dan transaksi menggunakan `localStorage`. |
| **PHP (db.php)** | Digunakan sebagai backend untuk koneksi ke database **MySQL**, serta otentikasi login admin via file `login_admin.php`. |
| **MySQL (phpMyAdmin via XAMPP)** | Menyimpan data otentikasi admin, dan dapat dikembangkan lebih lanjut untuk menyimpan data siswa dan pembayaran secara permanen. |

---

## ⚙️ Cara Menjalankan Aplikasi

### 📌 Persyaratan Awal

- Install [XAMPP](https://www.apachefriends.org/index.html)
- Pastikan Apache dan MySQL berjalan
- Browser modern (Chrome, Firefox, dll.)

### 🔧 Langkah-Langkah Instalasi

1. **Letakkan folder aplikasi ke direktori XAMPP:**

   Misalnya:
   ```
   C:\xampp\htdocs\spp-app\
   ```

2. **Jalankan XAMPP:**
   - Aktifkan **Apache** dan **MySQL** dari Control Panel.

3. **Import database (opsional):**
   - Buka http://localhost/phpmyadmin
   - Buat database misalnya `spp_db`
   - Tambahkan tabel yang diperlukan (lihat `db.php` sebagai referensi)

4. **Akses Aplikasi di Browser:**
   ```
   http://localhost/spp-app/
   ```

5. **Login dengan Role:**

   - **Admin**
     - Username: `admin`
     - Password: `admin123`

   - **Siswa**
     - Daftar melalui tombol *"Daftar Akun Baru"*

---

## 👤 Hak Akses Berdasarkan Role

| Role         | Akses Menu                            |
|--------------|----------------------------------------|
| Administrator| Data Mahasiswa, Program Studi, SPP, History, Laporan |
| Petugas      | Data Mahasiswa, History, Laporan      |
| Siswa        | Riwayat Pembayaran, Pembayaran Tagihan |

---

Created By
Muzaffar Ibrahim

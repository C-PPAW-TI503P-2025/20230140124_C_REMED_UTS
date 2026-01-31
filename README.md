# Library System Backend (UCP 1)

Backend sederhana untuk sistem manajemen perpustakaan dengan fitur peminjaman berbasis lokasi.

## Persiapan & Instalasi

1.  **Clone atau Download** repository ini.
2.  Instal dependensi:
    ```bash
    npm install
    ```
3.  Konfigurasi Database:
    - Buat file `.env` (bisa copy dari template jika ada, atau gunakan yang sudah dibuatkan).
    - Pastikan MySQL server berjalan.
    - Buat database dengan nama sesuai di `.env` (default: `library_db`), atau biarkan Sequelize membuatnya jika dikonfigurasi demikian (namun sebaiknya buat database kosong dulu manual jika error).

    Isi `.env`:
    ```env
    DB_NAME=library_db
    DB_USER=root
    DB_PASSWORD=
    DB_HOST=localhost
    PORT=3000
    ```

4.  Jalankan Aplikasi:
    ```bash
    node app.js
    ```
    *Aplikasi akan berjalan di `http://localhost:3000` dan otomatis melakukan sync ke database (membuat tabel).*
- **Swagger UI**: Visit `http://localhost:3000/api-docs` to interact with the API.
- **Postman**: Import `library_system.postman_collection.json` to get pre-configured requests.

## Struktur Project

- `app.js`: Entry point aplikasi.
- `config/database.js`: Konfigurasi koneksi Sequelize.
- `models/`: Definisi tabel database (`Book`, `BorrowLog`).
- `controllers/`: Logic untuk handle request (`bookController`, `borrowController`).
- `routes/`: Definisi endpoint API.
- `middleware/`: Middleware autentikasi custom.

## API Endpoints

### 1. Public
- **GET /api/books**: Mengambil semua data buku.
    - *Query Param*: `?search=Judul` (Optional, cari berdasarkan judul atau penulis)
- **GET /api/books/:id**: Mengambil detail buku berdasarkan ID.

### 2. Admin Mode
*Membutuhkan Header `x-user-role: admin`*

- **POST /api/books**: Tambah buku baru.
  - Body: `{ "title": "Judul", "author": "Penulis", "stock": 10 }`
- **PUT /api/books/:id**: Update buku.
- **DELETE /api/books/:id**: Hapus buku.

### 3. User Mode (Peminjaman)
*Membutuhkan Header `x-user-role: user` dan `x-user-id: [ID]`*

- **POST /api/borrow**: Meminjam buku.
  - Body:
    ```json
    {
      "bookId": 1,
      "latitude": -6.2088,
      "longitude": 106.8456
    }
    ```
  - *Logic*: Mengurangi stok buku dan mencatat log peminjaman.

## Struktur Database

1.  **Books**
    - `id` (PK, Auto Increment)
    - `title` (String)
    - `author` (String)
    - `stock` (Integer)

2.  **BorrowLogs**
    - `id` (PK, Auto Increment)
    - `userId` (Integer)
    - `bookId` (Integer)
    - `borrowDate` (DateTime)
    - `longitude` (Float)

## Troubleshooting
**Error: connect ECONNREFUSED 127.0.0.1:3306**
- Penyebab: MySQL Server belum berjalan (XAMPP/WAMP MySQL belum di-start).
- Solusi: Buka XAMPP Control Panel, Start module "MySQL".

**Error: Access denied for user 'root'@'localhost'**
- Penyebab: Password database salah.
- Solusi: Cek file `.env`. Kosongkan `DB_PASSWORD` jika menggunakan XAMPP default, atau isi sesuai password root MySQL Anda.

**Error: Unknown database 'library_db'**
- Penyebab: Database belum dibuat otomatis.
- Solusi: Buat database kosong bernama `library_db` di phpMyAdmin (localhost/phpmyadmin).


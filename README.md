# E-Siska API (Backend)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

## 📋 Tentang Proyek

**E-Siska (Sistem Informasi Sekolah)** adalah platform terpusat untuk mengelola administrasi dan akademik sekolah. Sistem ini dirancang untuk mendigitalisasi proses inti seperti manajemen data siswa, guru, kelas, penjadwalan, absensi, penilaian, hingga pembuatan rapor.

## 🏗️ Tech Stack

| Teknologi      | Deskripsi                      |
| -------------- | ------------------------------ |
| **Node.js**    | Runtime JavaScript server-side |
| **Express.js** | Web framework untuk REST API   |
| **Prisma**     | ORM untuk database             |
| **PostgreSQL** | Database relasional            |
| **TypeScript** | Type-safe JavaScript           |
| **JWT**        | Autentikasi berbasis token     |
| **bcrypt**     | Enkripsi password              |

## 📁 Struktur Proyek

```
e-siska-api/
├── src/
│   ├── config/         # Konfigurasi database & app
│   ├── controllers/    # Handler request HTTP
│   ├── middleware/     # Auth, validation, error handling
│   ├── repositories/   # Database queries
│   ├── routers/        # Route definitions
│   ├── service/        # Business logic
│   ├── utils/          # Helper functions
│   └── app.ts          # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── logs/               # Application logs
└── package.json
```

## 🔌 API Endpoints

### Autentikasi

| Method | Endpoint           | Deskripsi       |
| ------ | ------------------ | --------------- |
| POST   | `/api/auth/login`  | Login pengguna  |
| POST   | `/api/auth/logout` | Logout pengguna |

### Admin - Data Master

| Method   | Endpoint            | Deskripsi            |
| -------- | ------------------- | -------------------- |
| GET/POST | `/api/siswa`        | CRUD data siswa      |
| GET/POST | `/api/guru`         | CRUD data guru       |
| GET/POST | `/api/kelas`        | CRUD data kelas      |
| GET/POST | `/api/mapel`        | CRUD mata pelajaran  |
| GET/POST | `/api/ruangan`      | CRUD ruangan         |
| GET/POST | `/api/tingkatan`    | CRUD tingkatan kelas |
| GET/POST | `/api/tahun-ajaran` | CRUD tahun ajaran    |

### Admin - Operasional

| Method   | Endpoint          | Deskripsi             |
| -------- | ----------------- | --------------------- |
| GET/POST | `/api/jadwal`     | CRUD jadwal pelajaran |
| GET/POST | `/api/penugasan`  | CRUD penugasan guru   |
| GET/POST | `/api/penempatan` | CRUD penempatan siswa |
| GET/POST | `/api/pengumuman` | CRUD pengumuman       |
| GET/POST | `/api/dokumen`    | CRUD dokumen          |
| GET/POST | `/api/sekolah`    | Data profil sekolah   |
| POST     | `/api/backup`     | Backup database       |

### Guru

| Method   | Endpoint       | Deskripsi                   |
| -------- | -------------- | --------------------------- |
| GET/POST | `/api/nilai`   | Input nilai siswa           |
| GET/POST | `/api/absensi` | Input absensi               |
| GET/POST | `/api/capaian` | Input capaian kompetensi    |
| GET/POST | `/api/ekskul`  | Input nilai ekstrakurikuler |

### Wali Kelas

| Method   | Endpoint                | Deskripsi                   |
| -------- | ----------------------- | --------------------------- |
| GET      | `/api/wali-kelas/rekap` | Rekap nilai & absensi       |
| GET/POST | `/api/rapor`            | Finalisasi & generate rapor |

## 🚀 Instalasi & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repository-url>
cd e-siska-api

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda

# 4. Generate Prisma Client
npx prisma generate

# 5. Jalankan migrasi database
npx prisma migrate dev

# 6. Seed data awal (opsional)
npx prisma db seed

# 7. Jalankan server development
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/esiska"
JWT_SECRET="your-secret-key"
PORT=2020
NODE_ENV=development
```

## 👥 Peran Pengguna (Roles)

| Role           | Deskripsi               | Akses                         |
| -------------- | ----------------------- | ----------------------------- |
| **Admin**      | Pengelola utama sistem  | Full CRUD semua data master   |
| **Guru**       | Pengajar mata pelajaran | Input nilai, absensi, capaian |
| **Wali Kelas** | Penanggung jawab kelas  | Monitoring + Finalisasi rapor |
| **Siswa**      | Peserta didik           | View-only data pribadi        |

## 🔒 Keamanan

- **JWT Authentication** - Token-based auth dengan expiry
- **Password Hashing** - bcrypt dengan salt rounds
- **Role-based Access Control** - Middleware guard per role
- **Rate Limiting** - Proteksi brute force attack
- **Input Validation** - Sanitasi semua input user

## 📝 Scripts

```bash
npm run dev      # Development server dengan hot reload
npm run build    # Build untuk production
npm run start    # Jalankan production build
npm run lint     # Linting dengan ESLint
```

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<p align="center">
  Dibuat dengan ❤️ untuk SDN Ciater 02
</p>

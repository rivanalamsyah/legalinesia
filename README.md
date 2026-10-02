# Legalinesia (LegalConnect Platform)

> **Platform Konsultasi Hukum & Direktori Advokat Terpercaya di Indonesia**  
> Solusi digital legal-tech modern yang menghubungkan individu dan pelaku usaha dengan advokat profesional terverifikasi, layanan hukum transparan, serta edukasi hukum secara seamless, aman, dan mudah diakses.

---

## 📋 Daftar Isi

- [Tentang Legalinesia](#-tentang-legalinesia)
- [Visi & Tujuan Produk](#-visi--tujuan-produk)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Struktur Proyek](#-arsitektur--struktur-proyek)
- [Teknologi & Dependensi (Tech Stack)](#-teknologi--dependensi-tech-stack)
- [Prasyarat Sistem (Prerequisites)](#-prasyarat-sistem-prerequisites)
- [Panduan Instalasi & Jalankan Lokal](#-panduan-instalasi--jalankan-lokal)
- [Perintah Utilitas (Scripts & Commands)](#-perintah-utilitas-scripts--commands)
- [Panduan Pengujian & Kualitas Kode](#-panduan-pengujian--kualitas-kode)
- [Standar SEO, Aksesibilitas & Performa](#-standar-seo-aksesibilitas--performa)
- [Panduan Kontribusi & Git Workflow](#-panduan-kontribusi--git-workflow)
- [Lisensi](#-lisensi)

---

## 📘 Tentang Legalinesia

**Legalinesia** (menggunakan sebutan produk **LegalConnect**) adalah platform *legal-tech* enterprise-grade modern yang dirancang untuk mengatasi hambatan akses terhadap keadilan dan layanan hukum di Indonesia. Melalui sistem navigasi intuitif, transparansi biaya, direktori advokat terverifikasi, dan integrasi penjadwalan konsultasi, Legalinesia memberikan pengalaman hukum digital yang tepercaya, kredibel, dan berstandar tinggi.

Website ini dibangun menggunakan **Angular 19** standalone components, **Tailwind CSS**, dan arsitektur modular yang responsif (*mobile-first*), dioptimalkan secara teknis untuk *Search Engine Optimization* (SEO), performa web tinggi, serta memenuhi standar aksesibilitas web (WCAG 2.1 AA).

---

## 🎯 Visi & Tujuan Produk

1. **Demokratisasi Layanan Hukum**: Memudahkan siapapun menemukan advokat dan konsultasi hukum tanpa hambatan birokrasi atau biaya tersembunyi.
2. **Transparansi & Kredibilitas**: Menyediakan informasi profil advokat, verifikasi lisensi PERADI/KAI, pengalaman kerja, serta testimoni klien yang transparan.
3. **Pengalaman Pengguna (UX) Premium**: Menghadirkan antarmuka visual modern, minimalis, dan elegan—bebas dari visual *template dashboard* generik.
4. **Keamanan & Privasi Data**: Menjamin kerahasiaan informasi hukum pengguna melalui prinsip *privacy-by-design*.

---

## ✨ Fitur Utama

### 🏛️ 1. Halaman Publik & Platform Shell
- **Responsive Header & Mega Menu**: Navigasi intuitif untuk *Layanan Hukum* (berdasarkan *Practice Areas* & *Popular Services*), *Direktori Advokat*, *Cara Kerja*, *Insight*, dan *Tentang Kami*.
- **Mobile Navigation Layer**: Panel navigasi seluler yang responsif dengan dukungan interaksi sentuh dan *gesture-friendly*.
- **Announcement Layer & Global Banner**: Informasi penting atau promo konsultasi hukum yang dapat disesuaikan.
- **Global CTA & Footer Pattern**: Akses cepat konsultasi dan navigasi tautan penting di setiap halaman.

### 💼 2. Layanan Hukum (Legal Services)
- **Problem Finder Interactive Widget**: Fitur pencarian otomatis untuk membantu pengguna mengidentifikasi jenis kebutuhan hukum (Bisnis, Perdata, Pidana, Properti, Keluarga, dll.).
- **Kategori Layanan Populer**: Konsultasi pendirian badan usaha (PT/CV), pendaftaran hak kekayaan intelektual (HKI), peninjauan kontrak, hingga penyelesaian sengketa.
- **Detail Layanan & Kalkulator Estimasi**: Halaman komprehensif memuat ruang lingkup, estimasi waktu, prasyarat dokumen, hingga alur pengerjaan.

### 👨‍⚖️ 3. Direktori Advokat (Legal Professionals Directory)
- **Pencarian & Multi-Filter**: Filter advokat berdasarkan area spesialisasi, lokasi kota, pengalaman kerja, tarif per jam, serta status ketersediaan.
- **Profil Lengkap Advokat**: Memuat foto profesional, status verifikasi lisensi, riwayat pendidikan, rekam jejak kasus, ulasan klien, dan jadwal ketersediaan.
- **Penilaian & Testimoni Transparan**: Sistem ulasan terverifikasi untuk memastikan reputasi advokat.

### 📅 4. Sistem Alur Booking & Penjadwalan (Consultation Booking)
- **Multi-step Booking Form**: Proses mudah memilih paket konsultasi (Chat, Video Call, atau Tatap Muka), tanggal, jam ketersediaan, serta pengunggahan dokumen pendukung.
- **Konfirmasi & Ringkasan Transaksi**: Rincian biaya transparan sebelum melakukan pembayaran.

### 📚 5. Insight & Edukasi Hukum (Legal Insights & Articles)
- **Pusat Edukasi Hukum**: Artikel, panduan praktis, analisis regulasi terbaru, dan *case studies* hukum bisnis/perorangan.
- **Kategori & Pencarian Artikel**: Memudahkan pembaca menemukan materi edukasi relevan.
- **Rekomendasi Artikel & Penulis Advokat**: Terintegrasi langsung dengan profil advokat penyusun artikel.

### 🔐 6. Autentikasi & Akun Pengguna
- **Halaman Masuk (Login), Daftar (Register), & Lupa Password**: Desain antarmuka *auth* yang elegan dan responsif.
- **Dukungan Role**: Arsitektur yang siap diintegrasikan dengan role Klien, Advokat, dan Administrator.

### ⚠️ 7. Penanganan Kesalahan (Error Management)
- **Halaman 404 (Not Found)** & **500 (Server Error)** tersustomasi sesuai tema visual Legalinesia.

---

## 📁 Arsitektur & Struktur Proyek

Proyek ini menerapkan arsitektur **Clean Architecture & Modular Domain-Driven Design (DDD)** pada Angular 19:

```text
legalinesia/
├── src/
│   ├── app/
│   │   ├── core/                        # Modul Core (Singleton Services, Guards, Interceptors)
│   │   │   ├── config/                  # Konfigurasi aplikasi & konstanta global
│   │   │   ├── error-handler/           # Global Error Handler & Logging
│   │   │   ├── guards/                  # Route guards (AuthGuard, RoleGuard)
│   │   │   ├── interceptors/            # HTTP Interceptors (Auth, Error, Loading)
│   │   │   ├── models/                  # Interface & TypeScript Models
│   │   │   ├── repositories/            # Repository pattern untuk abstraksi data
│   │   │   └── services/                # Core Business Services (SEO, Auth, Notification, Data)
│   │   │
│   │   ├── features/                    # Modul Fitur Aplikasi (Domain-based)
│   │   │   ├── error/                   # Halaman 404 Not Found & Server Error
│   │   │   └── public/                  # Fitur Halaman Publik
│   │   │       ├── about/               # Halaman Tentang Kami
│   │   │       ├── auth/                # Halaman Login, Register, Forgot Password
│   │   │       ├── booking/             # Halaman Penjadwalan Konsultasi
│   │   │       ├── contact/             # Halaman Kontak & Lokasi Kantor
│   │   │       ├── faq/                 # Halaman Pertanyaan Umum
│   │   │       ├── home/                # Halaman Utama (Homepage)
│   │   │       ├── how-it-works/        # Halaman Cara Kerja Platform
│   │   │       ├── insights/            # Halaman Artikel & Edukasi Hukum
│   │   │       ├── professionals/       # Halaman Direktori & Profil Advokat
│   │   │       └── services/            # Halaman Catalog & Detail Layanan Hukum
│   │   │
│   │   ├── layouts/                     # Layout Shell Aplikasi
│   │   │   └── public-layout/           # Public Layout (Header, Mega Menu, Footer, Shell)
│   │   │
│   │   ├── shared/                      # UI Components, Directives & Pipes Reusable
│   │   │   └── components/ui/           # Reusable Atomic UI Components (Button, Input, Badge, Card, Modal, Empty State, etc.)
│   │   │
│   │   ├── app.component.ts             # Root Component
│   │   ├── app.config.ts                # Application Configuration (Providers, Routes)
│   │   └── app.routes.ts                # Deklarasi Routing & Page Title Strategy
│   │
│   ├── assets/                          # Static Assets (Gambar, Ikon, Ilustrasi, Fonts)
│   ├── index.html                       # HTML Template Root dengan SEO Meta Tags & OpenGraph
│   ├── main.ts                          # App Entrypoint
│   └── styles.css                       # Global Styles, CSS Custom Properties & Design Tokens
│
├── angular.json                         # Konfigurasi Angular CLI Build & Workspace
├── package.json                         # Dependensi NPM & Script Perintah
├── postcss.config.js                    # Konfigurasi PostCSS
├── tailwind.config.js                   # Konfigurasi Design System Tailwind CSS & Tokens
├── tsconfig.json                        # Konfigurasi Kompiler TypeScript
└── README.md                            # Dokumentasi Utama Proyek
```

---

## 🛠️ Teknologi & Dependensi (Tech Stack)

| Kategori | Teknologi / Framework | Versi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Angular (Standalone Components) | `^19.1.0` | Framework utama aplikasi web |
| **Bahasa Pemrograman** | TypeScript | `~5.7.2` | Type-safe JavaScript |
| **Styling & Design System** | Tailwind CSS + PostCSS | `^3.4.17` | Utility-first CSS Framework & Design Tokens |
| **Icons Set** | Lucide Angular | `^0.475.0` | Set ikon vektor modern & konsisten |
| **Reactive State** | RxJS | `~7.8.0` | Pemrosesan stream data asinkron |
| **Testing Framework** | Vitest / Angular CLI Test | `^19.1.0` | Unit test & integrasi komponen |
| **Build System** | Angular CLI / Esbuild | `^19.1.0` | Perangkat kompilasi & bundler produksi |

---

## 💻 Prasyarat Sistem (Prerequisites)

Sebelum memulai instalasi dan menjalankan proyek ini di lingkungan lokal Anda, pastikan sistem komputer telah terpasang:

- **Node.js**: Versi `v18.19.0` atau `v20.x` (LTS direkomendasikan).
- **NPM**: Versi `^9.0.0` atau lebih baru (biasanya otomatis terpasang bersama Node.js).
- **Angular CLI**: Versi `^19.0.0` (Opsional, dapat menggunakan `npx ng`).
- **Git**: Versi terbaru untuk kontrol versi.

Untuk memeriksa versi Node.js dan NPM di terminal Anda:
```bash
node -v
npm -v
```

---

## 🚀 Panduan Instalasi & Jalankan Lokal

Ikuti langkah-langkah berikut untuk mengkloning dan menjalankan proyek di lingkungan pengembangan lokal (*local development environment*):

### 1. Kloning Repository
```bash
git clone https://github.com/rivanalamsyah/legalinesia.git
cd legalinesia
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal seluruh dependensi paket yang dibutuhkan:
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Development Server)
Jalankan server lokal Angular:
```bash
npm start
```
atau menggunakan Angular CLI secara langsung:
```bash
ng serve
```

Setelah proses kompilasi selesai, buka peramban (*browser*) Anda dan akses:
```text
http://localhost:4200/
```
Aplikasi akan secara otomatis melakukan *hot-reload* setiap kali Anda mengubah file sumber (*source code*).

---

## 📜 Perintah Utilitas (Scripts & Commands)

Berikut adalah daftar perintah npm yang tersedia dalam proyek ini:

```bash
# Jalankan server pengembangan lokal (http://localhost:4200)
npm start

# Buat build produksi yang dioptimalkan di folder dist/
npm run build

# Mode build dengan peninjauan otomatis saat kode berubah
npm run watch

# Jalankan pengujian unit (unit tests)
npm test

# Generate komponen Angular baru
npx ng g c features/public/nama-komponen
```

---

## 🧪 Panduan Pengujian & Kualitas Kode

### 1. Pengujian Unit (Unit Testing)
Proyek ini mengintegrasikan runner pengujian Angular modern berbasis **Vitest**. Untuk menjalankan seluruh suite tes:
```bash
npm test
```

### 2. Pemeriksaan Tipe & Linter (TypeScript Verification)
Untuk memastikan tidak ada kesalahan tipe data TypeScript sebelum membuat *pull request*:
```bash
npx tsc --noEmit
```

---

## 🌐 Standar SEO, Aksesibilitas & Performa

### 🔍 Search Engine Optimization (SEO)
- **Title Strategy Dinamis**: Menggunakan `SeoService` dan Angular `TitleStrategy` untuk memperbarui tag `<title>`, meta description, OpenGraph (`og:title`, `og:description`, `og:image`), serta Twitter Card secara otomatis di setiap perpindahan rute.
- **Structured Data (JSON-LD)**: Menyediakan skema terstruktur untuk `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, dan `Service` guna meningkatkan keterbacaan di mesin pencari (Google).

### ♿ Aksesibilitas (WCAG 2.1 AA)
- **Semantic HTML5**: Menggunakan tag `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, dan `<footer>` secara konsisten.
- **Dukungan Keyboard & Focus Management**: Navigasi menggunakan tombol `Tab` dan indikator *focus outline* yang jelas.
- **Atribut ARIA**: Penerapan `aria-expanded`, `aria-controls`, `aria-label`, dan `role` pada komponen interaktif seperti modal, mega menu, dan accordion FAQ.

### ⚡ Performa Web (Web Vitals)
- **Lazy Loading Components**: Setiap rute halaman menggunakan fitur Angular `loadComponent` / `import()` untuk *code splitting* agar ukuran *bundle* awal tetap kecil.
- **Design Tokens CSS**: Penggunaan variabel CSS kustom untuk responsivitas instan tanpa membebankan runtime.

---

## 🔀 Panduan Kontribusi & Git Workflow

Kami menyambut kontribusi dari para pengembang! Untuk menjaga kualitas basis kode, ikuti alur kerja (*workflow*) berikut:

1. **Fork & Branching**: Buat cabang fitur baru dari cabang `main`:
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```
2. **Standard Komit (Conventional Commits)**:
   - `feat: tambah fitur kalkulator estimasi biaya hukum`
   - `fix: perbaiki alignment mega menu pada layar tablet`
   - `docs: perbarui panduan instalasi di README`
   - `style: sesuaikan design tokens warna kontras`
3. **Pemeriksaan Sebelum Commit**: Pastikan pengujian lokal dan pembentukan *build* berhasil:
   ```bash
   npm run build
   npm test
   ```
4. **Push & Pull Request (PR)**: Kirimkan cabang Anda ke repository remote dan buat Pull Request dengan deskripsi perubahan yang jelas.

---

## 📄 Lisensi

Hak Cipta © 2026 **Legalinesia / LegalConnect Team**. Hak Cipta Dilindungi Undang-Undang.

---

<p align="center">
  Dibuat dengan ⚖️ dan ☕ untuk memberikan akses layanan hukum yang lebih inklusif dan transparan di Indonesia.
</p>

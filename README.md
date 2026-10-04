# Legalinesia (Legalinesia Platform)

> **Platform Konsultasi Hukum & Direktori Advokat Terpercaya di Indonesia**  
> Solusi digital legal-tech modern yang menghubungkan individu dan pelaku usaha dengan advokat profesional terverifikasi, layanan hukum transparan, serta edukasi hukum secara seamless, aman, dan mudah diakses.

---

## 📋 Daftar Isi

- [Tentang Legalinesia](#-tentang-legalinesia)
- [Visi & Tujuan Produk](#-visi--tujuan-produk)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Struktur Proyek](#-arsitektur--struktur-proyek)
- [Arsitektur Backend Firebase & Keamanan](#-arsitektur-backend-firebase--keamanan)
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

**Legalinesia** (menggunakan sebutan produk **Legalinesia**) adalah platform *legal-tech* enterprise-grade modern yang dirancang untuk mengatasi hambatan akses terhadap keadilan dan layanan hukum di Indonesia. Melalui sistem navigasi intuitif, transparansi biaya, direktori advokat terverifikasi, dan integrasi penjadwalan konsultasi, Legalinesia memberikan pengalaman hukum digital yang tepercaya, kredibel, dan berstandar tinggi.

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
- **4-Step Booking Wizard**: Pilih jenis konsultasi (Video Online / Tatap Muka / Review Dokumen), tentukan tanggal & jam ketersediaan advokat, isi detail ringkasan kasus, dan upload dokumen pendukung.
- **Order Summary & Confirmation Modal**: Ringkasan biaya transparan tanpa biaya tersembunyi.
- **Manual Bank Transfer & VA Integration**: Referensi nomor Virtual Account otomatis beserta langkah konfirmasi pembayaran manual.

### 👤 5. Customer Portal
- **Dashboard Overview**: Metric card (Total Konsultasi, Konsultasi Mendatang, Pembayaran Pending, Selesai) dan *Upcoming Consultation Card*.
- **My Bookings & Detail View**: Manajemen alur konsultasi, tombol ruang video meeting, dan linimasa status.
- **Consultation Results & Documents**: Akses dokumen hasil review dan catatan konsultasi hukum dari advokat.
- **Reviews & Notifications**: Beri ulasan untuk sesi selesai dan kelola notifikasi real-time.

### ⚖️ 6. Legal Professional Portal
- **Professional Overview**: Hari ini schedule, upcoming bookings, pending requests, dan review summary.
- **Bookings Management**: Terima/tolak permintaan konsultasi, perbarui status booking, dan input link Google Meet / Zoom.
- **Calendar & Availability Builder**: Atur jadwal ketersediaan mingguan dengan pendeteksi otomatis slot bertabrakan (*overlap detection*).
- **Consultation Notes Writer**: Tulis analisis hukum, rekomendasi, dan tindakan lanjutan untuk klien.

### 🔐 7. Admin CMS
- **Operational Overview**: Metric platform, alert operasional, booking terbaru, dan pending verification.
- **Content Management (CMS)**: Pengelolaan Practice Areas taxonomy, Legal Services catalog, Legal Insights/Articles, FAQ, dan Testimonials.
- **Operations & Moderation**: Verifikasi pembayaran manual, konfirmasi/pembatalan booking, dan moderasi ulasan publik.
- **User & Verification Management**: Verifikasi lisensi advokat (PERADI/KAI) dan pengawasan akun pengguna.

---

## 🧱 Arsitektur & Struktur Proyek

```text
legalinesia/
├── firebase.json                 # Konfigurasi Firebase Hosting, Rules, Indexes, Emulator
├── .firebaserc                   # Target Firebase Project ID
├── firestore.rules               # Firestore Security Rules (RBAC, Ownership, State Machine)
├── firestore.indexes.json        # Composite Index Firestore
├── .env.example                  # Template variabel lingkungan client
├── scripts/
│   └── seed-firestore.mjs        # Script seeder data awal Firestore
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config/           # App, Router, & Firebase DI Config
│   │   │   ├── firebase/         # Firebase SDK services & Firestore Repositories
│   │   │   │   ├── firebase.app.ts
│   │   │   │   ├── firebase.config.ts
│   │   │   │   ├── firestore.types.ts
│   │   │   │   ├── firebase-error.handler.ts
│   │   │   │   ├── firebase-auth.service.ts
│   │   │   │   ├── firestore-booking.service.ts
│   │   │   │   ├── firestore-payment.service.ts
│   │   │   │   ├── firestore-review.service.ts
│   │   │   │   ├── firestore-notification.service.ts
│   │   │   │   ├── firestore-availability.service.ts
│   │   │   │   ├── firestore-public.service.ts
│   │   │   │   └── firestore-user.service.ts
│   │   │   ├── guards/           # Auth, Role, & Permission Guards
│   │   │   ├── models/           # Domain models & state machine
│   │   │   └── services/         # Angular facade services
│   │   ├── features/             # Feature Modules (Public, Customer, Pro, Admin)
│   │   ├── layouts/              # Platform & Portal Shell Layouts
│   │   └── shared/               # Reusable UI Design System & Domain Components
│   └── environments/             # Environment configs (dev, prod, emulator)
```

---

## 💥 Arsitektur Backend Firebase & Keamanan

### 1. Firebase Identity & Authentication Layer
* **Service**: `FirebaseAuthService` (`src/app/core/firebase/firebase-auth.service.ts`).
* **Fitur**: Login Email/Password, Registrasi Akun Baru, Logout, Reset Password, dan Pemulihan Sesi Otomatis (`onAuthStateChanged`).
* **Prinsip Keamanan Role**: Role pengguna **TIDAK PERNAH** dipercayai dari input client/payload registrasi. Setiap role selalu divalidasi dan dibaca dari dokumen Firestore `/users/{uid}.role` yang dikelola secara server-side.

### 2. Role-Based Access Control (RBAC) & Principle of Least Privilege
Setiap koleksi Firestore dilindungi oleh **[`firestore.rules`](file:///d:/legalinesia/firestore.rules)** dengan kebijakan *Default Deny* (`allow read, write: if false;`).

| Role | Akses Koleksi & Resource | Batasan & Aturan Keamanan |
| :--- | :--- | :--- |
| **Public / Unauthenticated** | Read-only `/practice_areas`, `/legal_services`, `/articles`, `/faqs`, `/testimonials`, `/professionals` (active/verified only). | Tidak dapat membaca data privat pengguna, booking, atau pembayaran. |
| **Customer** | Full access pada data milik sendiri (`customerId == auth.uid`) di `/bookings`, `/payments`, `/notifications`, `/reviews`. | Tidak dapat mengubah status pembayaran ke `PAID` secara langsung (harus via `VERIFYING` admin), tidak dapat mengubah `role` akun. |
| **Legal Professional** | Full access pada data milik sendiri (`professionalId == auth.uid`) di `/bookings`, `/availability`, `/consultation_notes`, `/reviews`. | Tidak dapat mengubah status verifikasi lisensi diri sendiri, tidak dapat mengakses booking advokat lain. |
| **Admin** | Full operational access pada seluruh koleksi (`users`, `professionals`, `bookings`, `payments`, `reviews`, `cms`). | Mengelola verifikasi advokat, verifikasi pembayaran manual, moderasi review, dan master data. |

### 3. Firestore Collections Schema Overview
* `/users/{uid}`: Schema pengguna (uid, email, fullName, phoneNumber, role, status, createdAt, updatedAt).
* `/professionals/{uid}`: Metadata advokat (title, barLicenseNumber, specializations, yearsOfExperience, consultationFee, isVerified, rating, reviewCount).
* `/bookings/{bookingId}`: Transaksi booking konsisten dengan snapshot data (`customerSnapshot`, `professionalSnapshot`, `serviceSnapshot`, `timeline`).
* `/payments/{paymentId}`: Rekaman transaksi pembayaran (amount, virtualAccountNumber, status: `WAITING_PAYMENT` | `VERIFYING` | `PAID` | `FAILED`).
* `/availability/{slotId}`: Slot waktu ketersediaan mingguan advokat.
* `/reviews/{reviewId}`: Ulasan terverifikasi (hanya untuk booking `COMPLETED`).
* `/notifications/{notifId}`: Notifikasi in-app real-time per user.
* `/practice_areas`, `/legal_services`, `/articles`, `/faqs`, `/testimonials`: Master data CMS.

### 4. Booking State Machine
Sistem menerapkan alur transisi status booking yang ketat:
```text
REQUESTED ➔ UNDER_REVIEW ➔ WAITING_PAYMENT ➔ PAYMENT_VERIFIED ➔ CONFIRMED ➔ IN_SESSION ➔ COMPLETED
   │             │               │
   ├─ REJECTED   ├─ REJECTED     └─ CANCELLED
   └─ CANCELLED  └─ CANCELLED
```

### 5. Firebase Emulator Suite & Lokal Testing
Proyek menyediakan dukungan penuh untuk **Firebase Emulator Suite** (Auth: port `9099`, Firestore: port `8080`, UI: port `4000`).
```bash
# Jalankan Firebase Emulator Suite secara lokal
npm run emulators

# Jalankan seeder data awal ke Firestore lokal/emulator
npm run seed
```

---

## 🛠️ Teknologi & Dependensi (Tech Stack)

### Core Technologies
- **Angular**: v19.1.0 (Standalone Components, Signals, Computed, Effects, New Control Flow `@if` / `@for`)
- **Firebase**: v11.10.0 (Web SDK: Firebase Auth & Cloud Firestore)
- **TypeScript**: v5.7.2 (Strict Type Checking)
- **CSS Engine**: Vanilla CSS Design Tokens + Tailwind CSS v3.4.17
- **Icon System**: `lucide-angular` v0.475.0 (Accessibility-ready SVG icons)
- **Reactive Extensions**: `rxjs` v7.8.0

---

## 💻 Prasyarat Sistem (Prerequisites)

Sebelum menjalankan proyek, pastikan lingkungan pengembangan Anda memenuhi persyaratan berikut:
- **Node.js**: `v18.x` atau `v20.x` (Direkomendasikan Node.js v20 LTS)
- **npm**: `v9.x` atau `v10.x`
- **Angular CLI**: `v19.x` (`npm i -g @angular/cli@19`)

---

## 🚀 Panduan Instalasi & Jalankan Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/rivanalamsyah/legalinesia.git
   cd legalinesia
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` menjadi `.env` jika memerlukan penyesuaian credential Firebase lokal:
   ```bash
   cp .env.example .env
   ```

4. **Jalankan Server Pengembang (Development Server)**:
   ```bash
   npm start
   ```
   Buka peramban dan akses [http://localhost:4200](http://localhost:4200).

---

## ⚡ Perintah Utilitas (Scripts & Commands)

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

# Jalankan Firebase Emulator Suite lokal (Auth & Firestore)
npm run emulators

# Jalankan script seeder data master Firestore
npm run seed
```

---

## 🧪 Panduan Pengujian & Kualitas Kode

### 1. Pengujian Unit (Unit Testing)
```bash
npm test
```

### 2. Pemeriksaan Tipe & Linter (TypeScript Verification)
Untuk memastikan tidak ada kesalahan tipe data TypeScript:
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

## ⚠️ Known Limitations & Architecture Decisions
1. **Client-Only Architecture (Tanpa Cloud Functions)**: Proyek MVP ini dirancang menggunakan Firebase Web SDK & Firestore Security Rules tanpa mengandalkan Node.js Cloud Functions.
2. **Manual Bank Transfer Verification**: Pembayaran menggunakan sistem transfer bank manual dengan referensi Virtual Account. Verifikasi status `PAID` memerlukan tindakan manual Admin melalui Admin CMS.
3. **Advisory Schedule Overlap Checks**: Pemeriksaan bentrok jadwal ketersediaan advokat dilakukan pada level client service & UI.

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
   npx tsc --noEmit
   ```
4. **Push & Pull Request (PR)**: Kirimkan cabang Anda ke repository remote dan buat Pull Request dengan deskripsi perubahan yang jelas.

---

## 📄 Lisensi

Hak Cipta © 2026 **Legalinesia / Legalinesia Team**. Hak Cipta Dilindungi Undang-Undang.

---

<p align="center">
  Dibuat dengan ⚖️ dan ☕ untuk memberikan akses layanan hukum yang lebih inklusif dan transparan di Indonesia.
</p>

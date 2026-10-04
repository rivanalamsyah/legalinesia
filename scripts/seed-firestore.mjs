/**
 * Firestore Database & Authentication Seeder Script
 *
 * Populates Firestore database and creates initial production seed accounts:
 * 1. Admin Account: admin@legalinesia.id / Password123! (Role: ADMIN)
 * 2. Advokat Account: advokat@legalinesia.id / Password123! (Role: LEGAL_PRO)
 * 3. Klien Account: klien@legalinesia.id / Password123! (Role: CUSTOMER)
 *
 * Populates Master Collections:
 * - Practice Areas (/practice_areas)
 * - Legal Services (/legal_services)
 * - FAQs (/faqs)
 * - Initial Users (/users & /professionals)
 *
 * Usage:
 *   node scripts/seed-firestore.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env['FIREBASE_API_KEY'] || 'AIzaSyD0toD_KPq3ttqAaHWiL_aleuUn0rK1iWw',
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || 'legalinesia1.firebaseapp.com',
  projectId: process.env['FIREBASE_PROJECT_ID'] || 'legalinesia1',
  storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || 'legalinesia1.firebasestorage.app',
  messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || '818889920291',
  appId: process.env['FIREBASE_APP_ID'] || '1:818889920291:web:70da123c465ab563724696',
  measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || 'G-ZWXZHT22MD'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const SEED_USERS = [
  {
    email: 'admin@legalinesia.id',
    password: 'Password123!',
    fullName: 'Administrator Legalinesia',
    role: 'ADMIN',
    department: 'Platform Operations & Governance',
    avatarUrl: '/images/avatars/avatar-admin.png'
  },
  {
    email: 'advokat@legalinesia.id',
    password: 'Password123!',
    fullName: 'Bambang Sutrisno, S.H., M.H.',
    role: 'LEGAL_PRO',
    title: 'Advokat Senior & Konsultan Hukum Bisnis',
    barLicenseNumber: 'PERADI-198420-001',
    organization: 'PERADI',
    yearsOfExperience: 12,
    rating: 4.9,
    reviewCount: 28,
    consultationFee: 350000,
    avatarUrl: '/images/avatars/avatar-male-1.png'
  },
  {
    email: 'klien@legalinesia.id',
    password: 'Password123!',
    fullName: 'Budi Pratama',
    role: 'CUSTOMER',
    customerType: 'INDIVIDUAL',
    city: 'Jakarta Selatan',
    avatarUrl: '/images/avatars/avatar-customer-default.png'
  }
];

const PRACTICE_AREAS = [
  {
    id: 'pa-bisnis-korporasi',
    slug: 'hukum-bisnis-korporasi',
    name: 'Hukum Bisnis & Korporasi',
    description: 'Pendirian PT, perizinan OSS RBA, kontrak bisnis, M&A, dan kepatuhan regulasi.',
    iconName: 'building-2',
    order: 1,
    isActive: true
  },
  {
    id: 'pa-hki',
    slug: 'hak-kekayaan-intelektual',
    name: 'Hak Kekayaan Intelektual (HKI)',
    description: 'Pendaftaran merek, hak cipta, paten, rahasia dagang, dan lisensi.',
    iconName: 'shield-check',
    order: 2,
    isActive: true
  },
  {
    id: 'pa-ketenagakerjaan',
    slug: 'hukum-ketenagakerjaan',
    name: 'Hukum Ketenagakerjaan',
    description: 'Perjanjian kerja (PKWT/PKWTT), PP/KPK, PHK, dan sengketa hubungan industrial.',
    iconName: 'briefcase',
    order: 3,
    isActive: true
  },
  {
    id: 'pa-pertanahan-properti',
    slug: 'hukum-pertanahan-properti',
    name: 'Pertanahan & Properti',
    description: 'Jual beli tanah, sertifikasi, HGB/HM, sewa menyewa, dan sengketa lahan.',
    iconName: 'home',
    order: 4,
    isActive: true
  },
  {
    id: 'pa-keluarga-waris',
    slug: 'hukum-keluarga-waris',
    name: 'Hukum Keluarga & Waris',
    description: 'Perceraian, hak asuh anak, pembagian harta gono-gini, dan penetapan ahli waris.',
    iconName: 'users',
    order: 5,
    isActive: true
  },
  {
    id: 'pa-pidana',
    slug: 'hukum-pidana',
    name: 'Hukum Pidana & Pendampingan',
    description: 'Pendampingan kepolisian, kejaksaan, tindak pidana umum, dan pidana khusus.',
    iconName: 'scale',
    order: 6,
    isActive: true
  }
];

const LEGAL_SERVICES = [
  {
    id: 'srv-pendirian-pt',
    slug: 'pendirian-pt-oss',
    title: 'Pendirian PT & Pengurusan NIB OSS RBA',
    practiceAreaId: 'pa-bisnis-korporasi',
    practiceAreaName: 'Hukum Bisnis & Korporasi',
    summary: 'Paket lengkap pendirian PT Akta Notaris, SK Kemenkumham, NPWP, dan NIB OSS RBA.',
    description: 'Konsultasi dan pendampingan lengkap dari penyusunan draft anggaran dasar, verifikasi nama PT, pembuatan Akta Notaris, pengesahan SK Kemenkumham, hingga penerbitan NIB berbasis risiko.',
    iconName: 'building-2',
    startingPrice: 3500000,
    priceUnit: 'flat rate',
    estimatedDuration: '3-5 Hari Kerja',
    deliverables: ['Akta Notaris Pendirian', 'SK Kemenkumham', 'NPWP Perusahaan', 'NIB OSS RBA'],
    isActive: true
  },
  {
    id: 'srv-pendaftaran-merek',
    slug: 'pendaftaran-merek-hki',
    title: 'Pendaftaran Merek & Cek Penelusuran HKI',
    practiceAreaId: 'pa-hki',
    practiceAreaName: 'Hak Kekayaan Intelektual (HKI)',
    summary: 'Penelusuran potensi kesamaan merek dan pendaftaran ke DJKI Kemenkumham.',
    description: 'Analisis kelayakan merek dagang/jasa, penelusuran database DJKI untuk meminimalisasi penolakan, serta pendampingan pengajuan permohonan hingga sertifikat terbit.',
    iconName: 'shield-check',
    startingPrice: 1800000,
    priceUnit: 'flat rate',
    estimatedDuration: '1-2 Hari Pengajuan',
    deliverables: ['Laporan Analisis Penelusuran', 'Bukti Pengajuan DJKI', 'Sertifikat Merek (setelah terbit)'],
    isActive: true
  },
  {
    id: 'srv-review-kontrak',
    slug: 'review-drafting-kontrak',
    title: 'Review & Drafting Perjanjian Kerjasama (MOU/Perjanjian)',
    practiceAreaId: 'pa-bisnis-korporasi',
    practiceAreaName: 'Hukum Bisnis & Korporasi',
    summary: 'Penyusunan atau telaah klausul kontrak bisnis untuk meminimalisasi risiko hukum.',
    description: 'Pemeriksaan komprehensif terhadap hak dan kewajiban, wanprestasi, dispute resolution, keadaan kahar (force majeure), serta klausul kerahasiaan (NDA).',
    iconName: 'file-text',
    startingPrice: 750000,
    priceUnit: 'per document',
    estimatedDuration: '1-2 Hari Kerja',
    deliverables: ['Dokumen Kontrak Final (Docx/PDF)', 'Catatan Risiko Hukum (Legal Opinion Ringkas)'],
    isActive: true
  }
];

const FAQS = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara melakukan konsultasi hukum di Legalinesia?',
    answer: 'Anda cukup memilih layanan atau konsultan hukum yang sesuai, tentukan tanggal dan jam konsultasi, lalu lakukan pembayaran. Link konsultasi video atau petunjuk sesi akan diberikan setelah pembayaran dikonfirmasi.',
    category: 'General',
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'Apakah kerahasiaan dokumen dan informasi kasus saya terjamin?',
    answer: 'Ya, seluruh konsultan hukum di Legalinesia terikat Kode Etik Advokat dan kewajiban kerahasiaan hukum (Attorney-Client Privilege). Dokumen Anda disimpan dengan enkripsi terkini.',
    category: 'Privacy',
    order: 2,
    isActive: true
  },
  {
    id: 'faq-3',
    question: 'Metode pembayaran apa saja yang didukung?',
    answer: 'Kami mendukung transfer bank melalui Virtual Account (BCA, Mandiri, BNI, BRI) dengan verifikasi otomatis atau manual admin.',
    category: 'Payment',
    order: 3,
    isActive: true
  }
];

async function seedData() {
  console.log('🌱 Starting Production Seed Operation for legalinesia1...');

  try {
    // 1. Create Seed Auth Accounts & User Docs
    for (const u of SEED_USERS) {
      let uid;
      try {
        const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
        uid = cred.user.uid;
        console.log(`  ✓ Auth account created: ${u.email} (${u.role})`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          const cred = await signInWithEmailAndPassword(auth, u.email, u.password);
          uid = cred.user.uid;
          console.log(`  ℹ Auth account existing, retrieved uid: ${u.email}`);
        } else {
          console.error(`  ❌ Failed to create auth for ${u.email}:`, authErr.message);
          continue;
        }
      }

      // Create /users document
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        uid,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        status: 'active',
        isEmailVerified: true,
        avatarUrl: u.avatarUrl,
        department: u.department || null,
        customerType: u.customerType || null,
        city: u.city || null,
        barLicenseNumber: u.barLicenseNumber || null,
        verificationStatus: u.role === 'LEGAL_PRO' ? 'VERIFIED' : 'N/A',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Seeded User Document: /users/${uid} (${u.email})`);

      // If Legal Pro, seed /professionals document as well
      if (u.role === 'LEGAL_PRO') {
        const proDocRef = doc(db, 'professionals', uid);
        await setDoc(proDocRef, {
          uid,
          email: u.email,
          fullName: u.fullName,
          title: u.title,
          licenseNumber: u.barLicenseNumber,
          organization: u.organization,
          yearsOfExperience: u.yearsOfExperience,
          rating: u.rating,
          reviewCount: u.reviewCount,
          isVerified: true,
          practiceAreaIds: ['pa-bisnis-korporasi', 'pa-hki'],
          bio: 'Advokat spesialis hukum korporasi, pendirian PT, transaksi M&A, dan perlindungan HKI.',
          consultationFee: u.consultationFee,
          avatarUrl: u.avatarUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        console.log(`  ✓ Seeded Professional Document: /professionals/${uid}`);
      }
    }

    // Sign in as Admin user to write master collections
    console.log('  🔑 Authenticating as admin@legalinesia.id for master data write...');
    await signInWithEmailAndPassword(auth, 'admin@legalinesia.id', 'Password123!');

    // 2. Seed Practice Areas
    for (const pa of PRACTICE_AREAS) {
      const ref = doc(db, 'practice_areas', pa.id);
      await setDoc(ref, {
        ...pa,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Seeded Practice Area: ${pa.name}`);
    }

    // 3. Seed Legal Services
    for (const srv of LEGAL_SERVICES) {
      const ref = doc(db, 'legal_services', srv.id);
      await setDoc(ref, {
        ...srv,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Seeded Legal Service: ${srv.title}`);
    }

    // 4. Seed FAQs
    for (const faq of FAQS) {
      const ref = doc(db, 'faqs', faq.id);
      await setDoc(ref, {
        ...faq,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Seeded FAQ: ${faq.question}`);
    }

    console.log('✅ Firestore & Auth seed completed successfully for legalinesia1!');
  } catch (err) {
    console.error('❌ Error during Firestore seed:', err);
  }
}

seedData();

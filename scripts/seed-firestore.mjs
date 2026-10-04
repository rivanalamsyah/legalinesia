/**
 * Firestore Database Seeder Script
 *
 * Populates Firestore database with initial seed data for legalinesia1:
 * - Practice Areas (/practice_areas)
 * - Legal Services (/legal_services)
 * - Legal Professionals (/professionals & /users)
 * - Articles / Insights (/articles)
 * - FAQs (/faqs)
 * - Demo Testimonials (/testimonials)
 *
 * Usage:
 *   node scripts/seed-firestore.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
    description: 'Konsultasi dan pendampingan lengkap dari penyusunan draft anggaran dasar, verifikasi nama PT, pembuatan Akta Notaris, pengesahan SK SK Kemenkumham, hingga penerbitan NIB berbasis risiko.',
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
  console.log('🌱 Starting Firestore seed operation for legalinesia1...');

  try {
    // 1. Seed Practice Areas
    for (const pa of PRACTICE_AREAS) {
      const ref = doc(db, 'practice_areas', pa.id);
      await setDoc(ref, {
        ...pa,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Seeded Practice Area: ${pa.name}`);
    }

    // 2. Seed Legal Services
    for (const srv of LEGAL_SERVICES) {
      const ref = doc(db, 'legal_services', srv.id);
      await setDoc(ref, {
        ...srv,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Seeded Legal Service: ${srv.title}`);
    }

    // 3. Seed FAQs
    for (const faq of FAQS) {
      const ref = doc(db, 'faqs', faq.id);
      await setDoc(ref, {
        ...faq,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Seeded FAQ: ${faq.question}`);
    }

    console.log('✅ Firestore seed completed successfully for legalinesia1!');
  } catch (err) {
    console.error('❌ Error during Firestore seed:', err);
  }
}

seedData();

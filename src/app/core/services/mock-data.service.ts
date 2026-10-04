import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LegalProfessional } from '../models/legal-professional.model';
import { LegalService } from '../models/legal-service.model';

export interface ReviewItem {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  caseCategory?: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly lawyers: LegalProfessional[] = [
    {
      id: 'lawyer-1',
      slug: 'bambang-sutrisno-sh-mh',
      fullName: 'Bambang Sutrisno, S.H., M.H.',
      title: 'Advokat Senior & Konsultan Hukum Bisnis',
      barLicenseNumber: 'PERADI/2012/84729',
      avatarUrl: '/images/avatars/avatar-male-1.svg',
      bio: 'Spesialis hukum perdata, sengketa bisnis, dan pendirian perseroan dengan pengalaman lebih dari 12 tahun.',
      locationCity: 'Jakarta Selatan',
      yearsOfExperience: 12,
      rating: 4.9,
      reviewCount: 128,
      consultationFee: 350000,
      specializations: ['Hukum Perdata', 'Hukum Bisnis & Korporasi', 'Pertanahan & Properti'],
      education: ['S1 Hukum Universitas Indonesia', 'S2 Hukum Bisnis Universitas Gadjah Mada'],
      languages: ['Indonesia', 'Inggris'],
      isVerified: true,
      isAvailableToday: true,
      casesCompleted: 240
    },
    {
      id: 'lawyer-2',
      slug: 'dr-anisa-rahmawati-sh-mkn',
      fullName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
      title: 'Advokat Specialist Hukum Keluarga & Waris',
      barLicenseNumber: 'PERADI/2015/92831',
      avatarUrl: '/images/avatars/avatar-female-1.svg',
      bio: 'Pakar hukum keluarga, perceraian, hak asuh anak, dan pembagian harta gana-gini secara kekeluargaan.',
      locationCity: 'Surabaya',
      yearsOfExperience: 9,
      rating: 4.8,
      reviewCount: 94,
      consultationFee: 300000,
      specializations: ['Perceraian & Keluarga', 'Waris & Hibah', 'Hukum Perdata'],
      education: ['S1 Hukum Universitas Airlangga', 'Magister Kenotariatan UNAIR', 'Doktor Hukum UNAIR'],
      languages: ['Indonesia'],
      isVerified: true,
      isAvailableToday: true,
      casesCompleted: 185
    },
    {
      id: 'lawyer-3',
      slug: 'hendra-wijaya-sh-llm',
      fullName: 'Hendra Wijaya, S.H., LL.M.',
      title: 'Advokat Konsultan HKI & Cyber Law',
      barLicenseNumber: 'PERADI/2017/63910',
      avatarUrl: '/images/avatars/avatar-male-2.svg',
      bio: 'Fokus pada pendaftaran merek HKI, paten, lisensi teknologi, serta penyelesaian sengketa hak cipta.',
      locationCity: 'Bandung',
      yearsOfExperience: 8,
      rating: 5.0,
      reviewCount: 76,
      consultationFee: 400000,
      specializations: ['Hak Kekayaan Intelektual', 'Hukum Bisnis & Korporasi', 'Ketenagakerjaan'],
      education: ['S1 Hukum Universitas Padjadjaran', 'LL.M Cyber Law University of Melbourne'],
      languages: ['Indonesia', 'Inggris'],
      isVerified: true,
      isAvailableToday: false,
      casesCompleted: 120
    }
  ];

  private readonly services: LegalService[] = [
    {
      id: 'srv-1',
      slug: 'pendirian-pt-cv',
      title: 'Pendirian PT / CV / PMA Kompleks',
      categorySlug: 'bisnis',
      categoryName: 'Hukum Bisnis & Korporasi',
      summary: 'Layanan legalitas lengkap pendirian badan usaha resmi dengan Akta Notaris & NIB OSS RBA.',
      description: 'Pengurusan Akta Pendirian Notaris, SK Kemenkumham, NIB OSS RBA, NPWP Badan, serta pendaftaran akun KBLI resmi.',
      iconName: 'building-2',
      startingPrice: 2500000,
      priceUnit: 'flat rate',
      estimatedDuration: '3-5 hari kerja',
      keyFeatures: ['Akta Notaris & SK Kemenkumham', 'NIB OSS RBA & NPWP Badan', 'Konsultasi KBLI Gratis'],
      deliverables: ['Akta Pendirian', 'SK Kemenkumham', 'NIB'],
      recommendedFor: ['Startup', 'UMKM Naik Kelas', 'Investor Asing (PMA)'],
      isPopular: true
    },
    {
      id: 'srv-2',
      slug: 'pendampingan-perceraian',
      title: 'Konsultasi & Pendampingan Perceraian',
      categorySlug: 'keluarga',
      categoryName: 'Perceraian & Keluarga',
      summary: 'Pendampingan hukum perceraian, hak asuh anak, dan pembagian harta bersama di Pengadilan Agama / Negeri.',
      description: 'Penyusunan gugatan/permohonan cerai, mediasi, pendampingan persidangan, hingga keluarnya Akta Cerai resmi.',
      iconName: 'heart-handshake',
      startingPrice: 5000000,
      priceUnit: 'per case',
      estimatedDuration: '1-3 bulan',
      keyFeatures: ['Drafting Gugatan/Permohonan', 'Pendampingan Mediasi', 'Pengurusan Akta Cerai'],
      deliverables: ['Salinan Putusan', 'Akta Cerai'],
      recommendedFor: ['Pasangan Suami Istri', 'Hak Asuh Anak', 'Gana Gini']
    },
    {
      id: 'srv-3',
      slug: 'pendaftaran-merek-hki',
      title: 'Pendaftaran Merek & Hak Cipta (HKI)',
      categorySlug: 'hki',
      categoryName: 'Hak Kekayaan Intelektual',
      summary: 'Perlindungan hukum merek usaha dan hak cipta karya agar tidak ditiru atau diklaim pihak lain.',
      description: 'Analisis penelusuran nama merek (Brand Search), pendaftaran resmi ke DJKI Kemenkumham, serta sertifikat HKI.',
      iconName: 'award',
      startingPrice: 1800000,
      priceUnit: 'per document',
      estimatedDuration: '7 hari proses permohonan',
      keyFeatures: ['Analisis Risiko Penolakan Merek', 'Pendaftaran Akun DJKI', 'Sertifikat Merek Resmi'],
      deliverables: ['Bukti Pendaftaran DJKI', 'Sertifikat Merek'],
      recommendedFor: ['Pemilik Brand', 'Kreator Konten', 'Pengusaha Makanan & Fashion'],
      isPopular: true
    }
  ];

  private readonly reviews: ReviewItem[] = [
    {
      id: 'rev-1',
      clientName: 'Budi Santoso',
      rating: 5,
      comment: 'Proses pendirian PT saya sangat cepat dan transparan. Pak Bambang sangat responsif menjelaskan KBLI yang cocok.',
      caseCategory: 'Pendirian PT',
      date: '2 Hari lalu'
    },
    {
      id: 'rev-2',
      clientName: 'Siti Aminah',
      rating: 5,
      comment: 'Sangat terbantu dalam penyelesaian hak asuh anak. Bu Dr. Anisa sangat empatik dan profesional.',
      caseCategory: 'Hukum Keluarga',
      date: '1 Minggu lalu'
    },
    {
      id: 'rev-3',
      clientName: 'Kevin Pratama',
      rating: 5,
      comment: 'Pendaftaran merek distro saya berjalan lancar tanpa kendala. Penjelasan hukumnya sangat mudah dipahami.',
      caseCategory: 'HKI Merek',
      date: '2 Minggu lalu'
    }
  ];

  public getLawyers(): Observable<LegalProfessional[]> {
    return of(this.lawyers);
  }

  public getServices(): Observable<LegalService[]> {
    return of(this.services);
  }

  public getReviews(): Observable<ReviewItem[]> {
    return of(this.reviews);
  }
}

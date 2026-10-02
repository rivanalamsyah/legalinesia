export interface SpecializationTag {
  id: string;
  name: string;
  slug: string;
}

export interface LawyerReview {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  serviceCategory: string;
}

export interface LegalProfessional {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  barLicenseNumber: string;
  avatarUrl: string;
  bio: string;
  locationCity: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  specializations: string[];
  education: string[];
  languages: string[];
  isVerified: boolean;
  isAvailableToday: boolean;
  officeAddress?: string;
  casesCompleted: number;
  reviews?: LawyerReview[];
}

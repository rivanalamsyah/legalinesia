export interface LegalServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  popularServicesCount: number;
}

export interface LegalService {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  summary: string;
  description: string;
  iconName: string;
  startingPrice: number;
  priceUnit: 'per consultation' | 'per document' | 'per case' | 'flat rate';
  estimatedDuration: string;
  keyFeatures: string[];
  deliverables: string[];
  recommendedFor: string[];
  isPopular?: boolean;
}

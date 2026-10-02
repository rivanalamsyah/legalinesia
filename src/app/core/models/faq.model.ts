export interface FaqItem {
  id: string;
  category: 'GENERAL' | 'BOOKING' | 'PAYMENT' | 'PRIVACY' | 'LAWYER_VERIFICATION';
  question: string;
  answer: string;
  isPopular?: boolean;
}

export interface FaqCategoryGroup {
  categoryKey: string;
  title: string;
  iconName: string;
  items: FaqItem[];
}

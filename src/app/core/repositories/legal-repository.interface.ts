import { Observable } from 'rxjs';
import { LegalProfessional } from '../models/legal-professional.model';
import { LegalService } from '../models/legal-service.model';
import { ReviewItem } from '../services/mock-data.service';

export interface ILegalRepository {
  getLawyers(): Observable<LegalProfessional[]>;
  getLawyerById(id: string): Observable<LegalProfessional | undefined>;
  getServices(): Observable<LegalService[]>;
  getServiceById(id: string): Observable<LegalService | undefined>;
  getReviews(): Observable<ReviewItem[]>;
}

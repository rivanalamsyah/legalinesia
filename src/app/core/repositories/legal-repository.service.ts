import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ILegalRepository } from './legal-repository.interface';
import { MockDataService, ReviewItem } from '../services/mock-data.service';
import { LegalProfessional } from '../models/legal-professional.model';
import { LegalService } from '../models/legal-service.model';

@Injectable({
  providedIn: 'root'
})
export class LegalRepositoryService implements ILegalRepository {
  private readonly dataSource = inject(MockDataService);

  public getLawyers(): Observable<LegalProfessional[]> {
    return this.dataSource.getLawyers();
  }

  public getLawyerById(id: string): Observable<LegalProfessional | undefined> {
    return this.dataSource.getLawyers().pipe(
      map(lawyers => lawyers.find(l => l.id === id || l.slug === id))
    );
  }

  public getServices(): Observable<LegalService[]> {
    return this.dataSource.getServices();
  }

  public getServiceById(id: string): Observable<LegalService | undefined> {
    return this.dataSource.getServices().pipe(
      map(services => services.find(s => s.id === id || s.slug === id))
    );
  }

  public getReviews(): Observable<ReviewItem[]> {
    return this.dataSource.getReviews();
  }
}

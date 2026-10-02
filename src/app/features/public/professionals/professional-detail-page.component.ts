import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { LegalRepositoryService } from '../../../core/repositories/legal-repository.service';
import {
  ContainerComponent, BreadcrumbComponent, BadgeComponent,
  ButtonComponent, AvatarComponent, RatingComponent, EmptyStateComponent
} from '../../../shared/components/ui';
import { CTASectionComponent } from '../../../shared/components/layout';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';
import { LegalProfessional } from '../../../core/models/legal-professional.model';

@Component({
  selector: 'app-professional-detail-page',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ContainerComponent, BreadcrumbComponent,
    BadgeComponent, ButtonComponent, AvatarComponent, RatingComponent,
    CurrencyIdrPipe, CTASectionComponent
  ],
  template: `
    <section *ngIf="lawyer()" class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Direktori Advokat', url: '/professionals' }, { label: lawyer()!.fullName }]"></app-breadcrumb>

        <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mt-6">
          <app-avatar
            [src]="lawyer()!.avatarUrl"
            [name]="lawyer()!.fullName"
            [online]="lawyer()!.isAvailableToday"
            size="xl">
          </app-avatar>

          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h1 class="font-heading text-2xl md:text-4xl font-extrabold text-white">
                {{ lawyer()!.fullName }}
              </h1>
              <app-badge variant="gold" size="sm" *ngIf="lawyer()!.isVerified">PERADI Terverifikasi</app-badge>
            </div>

            <p class="text-slate-300 text-sm md:text-base mb-3 font-medium">{{ lawyer()!.title }}</p>
            <p class="text-xs text-slate-400">Lisensi: {{ lawyer()!.barLicenseNumber }} • Pengalaman {{ lawyer()!.yearsOfExperience }} Tahun</p>
          </div>

          <div class="w-full md:w-auto">
            <app-button
              [routerLink]="['/booking']"
              [queryParams]="{ lawyerId: lawyer()!.id }"
              variant="gold"
              size="lg"
              [fullWidth]="true">
              Jadwalkan Konsultasi
            </app-button>
          </div>
        </div>
      </app-container>
    </section>

    <!-- Bio & Details -->
    <section *ngIf="lawyer()" class="section-padding bg-slate-50">
      <app-container size="lg">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div class="lg:col-span-8 space-y-8">
            <div class="surface-card p-6 md:p-8">
              <h2 class="font-heading font-bold text-xl text-slate-900 mb-4">Profil Advokat</h2>
              <p class="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line">{{ lawyer()!.bio }}</p>
            </div>

            <div class="surface-card p-6 md:p-8">
              <h2 class="font-heading font-bold text-xl text-slate-900 mb-4">Pendidikan & Sertifikasi</h2>
              <ul class="space-y-2">
                <li *ngFor="let edu of lawyer()!.education" class="text-sm text-slate-700 flex items-center gap-2">
                  <span class="text-brand-600 font-bold">🎓</span>
                  <span>{{ edu }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div class="surface-card p-6">
              <h3 class="font-heading font-bold text-base text-slate-900 mb-4">Tarif & Ketentuan</h3>
              <div class="mb-4">
                <span class="text-xs font-bold text-slate-400 uppercase">Tarif Konsultasi</span>
                <p class="font-heading font-extrabold text-2xl text-slate-900">{{ lawyer()!.consultationFee | currencyIdr }} /30mnt</p>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-600">
                <app-rating [value]="lawyer()!.rating"></app-rating>
                <span class="font-bold">{{ lawyer()!.rating }}</span>
                <span>({{ lawyer()!.reviewCount }} Ulasan)</span>
              </div>
            </div>
          </div>

        </div>
      </app-container>
    </section>

    <app-cta-section
      *ngIf="lawyer()"
      title="Siap Berdiskusi Kasus Anda?"
      subtitle="Jadwalkan konsultasi online terenkripsi sekarang."
      primaryLabel="Mulai Booking"
      primaryRoute="/booking">
    </app-cta-section>
  `
})
export class ProfessionalDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(LegalRepositoryService);
  private readonly seo = inject(SeoService);

  public readonly lawyer = signal<LegalProfessional | undefined>(undefined);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.repository.getLawyerById(id).subscribe(l => {
          this.lawyer.set(l);
          if (l) {
            this.seo.updateSeo({
              title: `${l.fullName} - Advokat PERADI`,
              description: l.bio
            });
          }
        });
      }
    });
  }
}

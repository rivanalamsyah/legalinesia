import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { RatingComponent } from '../../ui/rating/rating.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { CurrencyIdrPipe } from '../../../pipes/currency-idr.pipe';
import { LegalProfessional } from '../../../../core/models/legal-professional.model';

@Component({
  selector: 'app-professional-card',
  standalone: true,
  imports: [
    CommonModule, RouterLink, IconComponent, RatingComponent,
    BadgeComponent, ButtonComponent, AvatarComponent, CurrencyIdrPipe
  ],
  template: `
    <article class="surface-card p-6 flex flex-col justify-between h-full group hover:border-brand-300">
      <div>
        <!-- Top Metadata & Verification Badge -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-3">
            <app-avatar
              [src]="lawyer.avatarUrl"
              [name]="lawyer.fullName"
              [online]="lawyer.isAvailableToday"
              size="lg">
            </app-avatar>

            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-brand-600 transition-colors">
                  {{ lawyer.fullName }}
                </h3>
                <app-icon
                  *ngIf="lawyer.isVerified"
                  name="shield-check"
                  size="sm"
                  class="text-brand-600"
                  title="Advokat Terverifikasi PERADI">
                </app-icon>
              </div>

              <p class="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <app-icon name="map-pin" size="xs"></app-icon>
                {{ lawyer.locationCity }} • Pengalaman {{ lawyer.yearsOfExperience }} Thn
              </p>
            </div>
          </div>

          <app-badge variant="success" size="sm" *ngIf="lawyer.isAvailableToday">
            Tersedia Hari Ini
          </app-badge>
        </div>

        <!-- Specialization Badges -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          <app-badge
            *ngFor="let spec of lawyer.specializations | slice:0:3"
            variant="neutral"
            size="sm">
            {{ spec }}
          </app-badge>
        </div>

        <!-- Rating & Cases Stats -->
        <div class="flex items-center gap-4 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600">
          <div class="flex items-center gap-1">
            <app-rating [value]="lawyer.rating"></app-rating>
            <span class="font-bold text-slate-900">{{ lawyer.rating }}</span>
            <span>({{ lawyer.reviewCount }})</span>
          </div>
          <div class="w-px h-3 bg-slate-200"></div>
          <div>
            <span class="font-bold text-slate-900">{{ lawyer.casesCompleted }}</span> Kasus Selesai
          </div>
        </div>
      </div>

      <!-- Pricing & Actions -->
      <div class="pt-2 flex items-center justify-between gap-3">
        <div>
          <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Biaya Konsultasi</span>
          <span class="font-heading font-bold text-slate-900 text-lg">
            {{ lawyer.consultationFee | currencyIdr }}
          </span>
          <span class="text-xs text-slate-500">/30mnt</span>
        </div>

        <div class="flex items-center gap-2">
          <app-button
            [routerLink]="['/booking']"
            [queryParams]="{ lawyerId: lawyer.id }"
            variant="primary"
            size="sm"
            icon="calendar">
            Konsultasi
          </app-button>
        </div>
      </div>
    </article>
  `
})
export class ProfessionalCardComponent {
  @Input() lawyer!: LegalProfessional;
  @Output() selectLawyer = new EventEmitter<LegalProfessional>();
}

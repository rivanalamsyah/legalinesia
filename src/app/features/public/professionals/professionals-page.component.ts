import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { LegalRepositoryService } from '../../../core/repositories/legal-repository.service';
import {
  ContainerComponent, BreadcrumbComponent, SearchFieldComponent,
  EmptyStateComponent
} from '../../../shared/components/ui';
import { ProfessionalCardComponent } from '../../../shared/components/domain';
import { LegalProfessional } from '../../../core/models/legal-professional.model';

@Component({
  selector: 'app-professionals-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent, BreadcrumbComponent,
    SearchFieldComponent, ProfessionalCardComponent, EmptyStateComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="pt-28 pb-12 bg-gradient-to-br from-brand-900 to-navy-800 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Direktori Advokat' }]"></app-breadcrumb>

        <div class="mt-4 max-w-3xl">
          <h1 class="font-heading text-4xl md:text-5xl font-bold mb-4">
            Direktori <span class="text-gradient-gold">Advokat Profesional</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg max-w-2xl mb-8">
            Temukan advokat berlisensi PERADI sesuai bidang spesialisasi, lokasi, dan anggaran Anda.
          </p>
        </div>

        <!-- Search Field -->
        <div class="max-w-2xl mb-8">
          <app-search-field
            [value]="searchQuery()"
            placeholder="Cari nama advokat, kota, atau bidang hukum..."
            (search)="onSearch($event)">
          </app-search-field>
        </div>

        <!-- Specialization Filter Chips -->
        <div class="flex flex-wrap gap-2">
          <button
            *ngFor="let spec of specializations"
            type="button"
            class="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all duration-200"
            [ngClass]="activeFilter() === spec ? 'bg-white text-brand-900 border-white shadow-md' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'"
            (click)="setFilter(spec)">
            {{ spec }}
          </button>
        </div>
      </app-container>
    </section>

    <!-- Lawyers Directory Grid -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        
        <!-- Results count indicator -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <p class="text-sm font-semibold text-slate-700">
            Menampilkan <span class="text-brand-600 font-bold">{{ filteredLawyers().length }}</span> advokat terverifikasi
          </p>
          
          <button
            *ngIf="activeFilter() !== 'Semua' || searchQuery()"
            type="button"
            class="text-xs font-semibold text-brand-600 hover:text-brand-800 underline"
            (click)="resetFilters()">
            Reset Filter
          </button>
        </div>

        <!-- Grid -->
        <div *ngIf="filteredLawyers().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-professional-card *ngFor="let lawyer of filteredLawyers()" [lawyer]="lawyer"></app-professional-card>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="filteredLawyers().length === 0"
          icon="user-x"
          title="Tidak ada advokat ditemukan"
          description="Coba gunakan kata kunci pencarian atau kategori filter lainnya."
          actionLabel="Reset Semua Filter"
          (actionClick)="resetFilters()">
        </app-empty-state>

      </app-container>
    </section>
  `
})
export class ProfessionalsPageComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly repository = inject(LegalRepositoryService);
  private readonly route = inject(ActivatedRoute);

  public readonly allLawyers = signal<LegalProfessional[]>([]);
  public readonly activeFilter = signal<string>('Semua');
  public readonly searchQuery = signal<string>('');

  public readonly specializations = [
    'Semua', 'Hukum Perdata', 'Hukum Pidana', 'Hukum Bisnis & Korporasi',
    'Perceraian & Keluarga', 'Hak Kekayaan Intelektual', 'Ketenagakerjaan', 'Pertanahan & Properti'
  ];

  public readonly filteredLawyers = computed(() => {
    let result = this.allLawyers();
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();

    if (filter !== 'Semua') {
      result = result.filter(l => l.specializations.includes(filter));
    }

    if (query) {
      result = result.filter(l =>
        l.fullName.toLowerCase().includes(query) ||
        l.locationCity.toLowerCase().includes(query) ||
        l.specializations.some(s => s.toLowerCase().includes(query))
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Direktori Advokat Berlisensi PERADI',
      description: 'Temukan advokat berlisensi PERADI terbaik di Indonesia. Cari berdasarkan bidang spesialisasi, kota, dan rating.'
    });

    this.repository.getLawyers().subscribe(l => this.allLawyers.set(l));

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
    });
  }

  public setFilter(spec: string): void {
    this.activeFilter.set(spec);
  }

  public onSearch(q: string): void {
    this.searchQuery.set(q);
  }

  public resetFilters(): void {
    this.activeFilter.set('Semua');
    this.searchQuery.set('');
  }
}

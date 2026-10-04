import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustomerReviewService } from '../../../core/services/customer-review.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { RatingComponent } from '../../../shared/components/ui/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    PortalPageHeaderComponent,
    RatingComponent,
    ButtonComponent,
    ToastComponent
  ],
  template: `
    <div class="space-y-8">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Ulasan & Testimoni Advokat"
        subtitle="Berikan ulasan dan penilaian transparan terhadap sesi konsultasi hukum yang telah selesai dilaksanakan."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Ulasan Saya' }]">
      </app-portal-page-header>

      <!-- Section: Submit Review for Completed Eligible Sessions -->
      @if (reviewService.eligibleBookingsForReview().length > 0) {
        <div class="glass-panel p-6 rounded-2xl border-2 border-brand-500/40 bg-brand-500/5 space-y-4">
          <div class="flex items-center gap-2 text-brand-300 font-bold text-sm font-heading">
            <app-icon name="star" size="sm" className="text-amber-400"></app-icon>
            <span>Tulis Ulasan Konsultasi Selesai</span>
          </div>

          <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-white/70 uppercase mb-1.5">Pilih Sesi Konsultasi Selesai</label>
              <select formControlName="bookingId" class="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400">
                <option value="" disabled>-- Pilih Sesi Konsultasi --</option>
                @for (b of reviewService.eligibleBookingsForReview(); track b.id) {
                  <option [value]="b.id">{{ b.serviceTitle }} (Advokat: {{ b.professionalName }})</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-white/70 uppercase mb-1.5">Beri Penilaian Bintang (1-5)</label>
              <div class="flex items-center gap-2">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button
                    type="button"
                    (click)="selectedRating.set(star)"
                    class="p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <app-icon
                      name="star"
                      size="md"
                      [className]="star <= selectedRating() ? 'text-amber-400 fill-amber-400' : 'text-white/30'">
                    </app-icon>
                  </button>
                }
                <span class="text-xs font-bold text-amber-300 ml-2">{{ selectedRating() }} dari 5 Bintang</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-white/70 uppercase mb-1.5">Komentar & Pengalaman Konsultasi</label>
              <textarea
                formControlName="comment"
                rows="3"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="Tuliskan ulasan jujur mengenai keramahan, kecermatan legal opinion, dan solusi advokat...">
              </textarea>
              @if (reviewForm.get('comment')?.touched && reviewForm.get('comment')?.invalid) {
                <span class="text-[11px] text-rose-400 mt-1 block">Ulasan minimal 10 karakter.</span>
              }
            </div>

            <div class="flex items-center justify-end">
              <app-button
                type="submit"
                variant="primary"
                size="md"
                iconLeft="send"
                [loading]="isSubmitting">
                Kirim Ulasan Terverifikasi
              </app-button>
            </div>
          </form>
        </div>
      }

      <!-- List of Submitted Reviews -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Ulasan Terpublikasi Anda</h3>

        @if (reviewService.customerReviews().length > 0) {
          @for (review of reviewService.customerReviews(); track review.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-3">
                <div class="flex items-center gap-3">
                  <img
                    [src]="review.professionalAvatar || '/images/avatars/avatar-female-1.svg'"
                    [alt]="review.professionalName"
                    class="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 class="text-sm font-bold text-white font-heading">{{ review.professionalName }}</h4>
                    <p class="text-xs text-white/50">{{ review.serviceTitle }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <app-rating [rating]="review.rating"></app-rating>
                  <span class="text-xs text-white/40">• {{ review.createdAt }}</span>
                </div>
              </div>

              <p class="text-xs text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                "{{ review.comment }}"
              </p>
            </div>
          }
        } @else {
          <div class="glass-panel p-8 rounded-2xl border border-navy-800 text-center text-xs text-white/50">
            Belum ada ulasan yang Anda berikan. Ulasan dapat ditulis setelah sesi konsultasi dinyatakan Selesai.
          </div>
        }
      </div>

      <!-- Toast Container -->
      <app-toast></app-toast>

    </div>
  `
})
export class CustomerReviewsComponent {
  public readonly reviewService = inject(CustomerReviewService);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  public selectedRating = signal<number>(5);
  public isSubmitting = false;

  public reviewForm = this.fb.group({
    bookingId: ['', Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  public onSubmitReview(): void {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) return;

    const bookingId = this.reviewForm.get('bookingId')?.value as string;
    const comment = this.reviewForm.get('comment')?.value as string;

    this.isSubmitting = true;
    this.reviewService.submitReview(bookingId, this.selectedRating(), comment).subscribe(success => {
      this.isSubmitting = false;
      if (success) {
        this.notify.success('Ulasan Terpublikasi', 'Terima kasih! Ulasan dan rating advokat Anda berhasil dikirim.');
        this.reviewForm.reset();
        this.selectedRating.set(5);
      }
    });
  }
}

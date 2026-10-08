import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PUBLIC_NAVIGATION_CONFIG } from '../../../core/config/navigation.config';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <footer class="bg-navy-800 text-slate-300" role="contentinfo">
      
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2">
            <a routerLink="/" class="flex items-center gap-3 mb-5 group" aria-label="Legalinesia - Beranda">
              <img
                src="/logo-legalinesia.png"
                alt="Logo Legalinesia"
                class="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
              <span class="font-heading font-bold text-xl text-white tracking-tight">
                Legal<span class="text-brand-400">inesia</span>
              </span>
            </a>
            <p class="text-sm leading-relaxed text-slate-400 max-w-xs mb-6">
              Platform konsultasi hukum digital pertama di Indonesia yang menghubungkan Anda dengan advokat berlisensi PERADI secara transparan dan terpercaya.
            </p>
            
            <!-- Contact Info -->
            <div class="space-y-3">
              <a [href]="'tel:' + navConfig.contactInfo.phone" class="flex items-center gap-2 text-sm hover:text-white transition-colors group">
                <app-icon name="phone" size="sm" className="text-brand-400 group-hover:text-brand-300"></app-icon>
                {{ navConfig.contactInfo.phone }}
              </a>
              <a [href]="'mailto:' + navConfig.contactInfo.email" class="flex items-center gap-2 text-sm hover:text-white transition-colors group">
                <app-icon name="mail" size="sm" className="text-brand-400 group-hover:text-brand-300"></app-icon>
                {{ navConfig.contactInfo.email }}
              </a>
              <div class="flex items-start gap-2 text-sm">
                <app-icon name="map-pin" size="sm" className="text-brand-400 shrink-0 mt-0.5"></app-icon>
                <span class="text-slate-400">{{ navConfig.contactInfo.address }}</span>
              </div>
            </div>
          </div>

          <!-- Nav Columns -->
          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Layanan Hukum</h3>
            <ul class="space-y-2.5">
              @for (item of navConfig.footerNav.services; track item.route) {
                <li>
                  <a [routerLink]="item.route" class="text-sm text-slate-400 hover:text-white transition-colors leading-snug">
                    {{ item.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Perusahaan</h3>
            <ul class="space-y-2.5">
              @for (item of navConfig.footerNav.company; track item.route) {
                <li>
                  <a [routerLink]="item.route" class="text-sm text-slate-400 hover:text-white transition-colors">
                    {{ item.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Bantuan & Legal</h3>
            <ul class="space-y-2.5">
              @for (item of navConfig.footerNav.support; track item.route) {
                <li>
                  <a [routerLink]="item.route" class="text-sm text-slate-400 hover:text-white transition-colors">
                    {{ item.label }}
                  </a>
                </li>
              }
            </ul>
            <div class="mt-5 pt-5 border-t border-slate-700">
              @for (item of navConfig.footerNav.legal; track item.route) {
                <a [routerLink]="item.route" class="block text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2">
                  {{ item.label }}
                </a>
              }
            </div>
          </div>
        </div>

        <!-- WhatsApp CTA Banner -->
        <div class="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-800/60 to-brand-900/60 border border-brand-700/40 flex flex-col sm:flex-row items-center gap-4">
          <div class="flex-1">
            <p class="text-sm font-semibold text-white">Butuh bantuan sekarang?</p>
            <p class="text-xs text-slate-400 mt-0.5">Tim konsultan kami siap membantu Anda 24/7 via WhatsApp.</p>
          </div>
          <a
            [href]="navConfig.contactInfo.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-emerald-900/40 shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat WhatsApp
          </a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-slate-700/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-slate-500">
            &copy; {{ currentYear }} Legalinesia Indonesia. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p class="text-xs text-slate-600">
            Layanan ini tidak menggantikan nasihat hukum profesional terdaftar.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class PublicFooterComponent {
  protected readonly navConfig = PUBLIC_NAVIGATION_CONFIG;
  public readonly currentYear = new Date().getFullYear();
}

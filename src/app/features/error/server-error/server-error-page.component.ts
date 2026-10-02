import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-server-error-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, IconComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-navy-900 to-brand-950 text-white px-4">
      <div class="text-center max-w-lg">
        <div class="font-heading text-[9rem] font-bold leading-none text-red-400 mb-4">500</div>
        <app-icon name="shield-check" size="xl" className="text-red-400 mx-auto mb-5"></app-icon>
        <h1 class="font-heading text-3xl font-bold mb-3">Terjadi Kesalahan Server</h1>
        <p class="text-slate-400 leading-relaxed mb-8">
          Server kami mengalami kendala sementara. Tim teknis kami sudah diberitahu dan sedang menanganinya. Silakan coba lagi dalam beberapa saat.
        </p>
        <div class="flex justify-center gap-4">
          <app-button variant="primary" size="lg" (btnClick)="reload()">Coba Lagi</app-button>
          <app-button routerLink="/" variant="ghost" size="lg">Ke Beranda</app-button>
        </div>
      </div>
    </div>
  `
})
export class ServerErrorPageComponent {
  public reload(): void {
    window.location.reload();
  }
}

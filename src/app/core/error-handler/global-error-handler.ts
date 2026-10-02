import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    console.error('Unhandled Application Error:', error);

    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem yang tidak terduga.';

    // Run inside NgZone so UI signals update properly even if error originates outside Angular zone
    this.zone.run(() => {
      this.notificationService.error(
        'Sistem Error',
        `Aplikasi mengalami masalah: ${message.slice(0, 100)}`
      );
    });
  }
}

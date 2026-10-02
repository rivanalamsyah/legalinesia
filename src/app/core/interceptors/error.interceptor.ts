import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Gagal terhubung ke server.';

      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorMessage = 'Anda tidak memiliki akses ke sumber daya ini.';
      } else if (error.status === 404) {
        errorMessage = 'Data atau layanan yang diminta tidak ditemukan.';
      } else if (error.status === 500) {
        errorMessage = 'Terjadi kesalahan pada server kami. Coba beberapa saat lagi.';
      }

      notificationService.error('HTTP Error', errorMessage);
      return throwError(() => error);
    })
  );
};

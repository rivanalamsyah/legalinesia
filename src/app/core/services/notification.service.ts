import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public readonly toasts = signal<ToastMessage[]>([]);

  public show(type: NotificationType, title: string, message: string, durationMs = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { id, type, title, message, durationMs };

    this.toasts.update(current => [...current, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  public success(title: string, message: string, durationMs?: number): void {
    this.show('success', title, message, durationMs);
  }

  public error(title: string, message: string, durationMs?: number): void {
    this.show('error', title, message, durationMs);
  }

  public warning(title: string, message: string, durationMs?: number): void {
    this.show('warning', title, message, durationMs);
  }

  public info(title: string, message: string, durationMs?: number): void {
    this.show('info', title, message, durationMs);
  }

  public dismiss(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}

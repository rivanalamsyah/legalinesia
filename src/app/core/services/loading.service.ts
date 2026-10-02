import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingCount = signal<number>(0);

  public readonly isLoading = signal<boolean>(false);

  public show(): void {
    this.loadingCount.update(c => c + 1);
    this.isLoading.set(true);
  }

  public hide(): void {
    this.loadingCount.update(c => Math.max(0, c - 1));
    if (this.loadingCount() === 0) {
      this.isLoading.set(false);
    }
  }
}

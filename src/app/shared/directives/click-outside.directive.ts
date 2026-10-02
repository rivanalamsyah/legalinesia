import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);

  @Output() appClickOutside = new EventEmitter<Event>();

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  public onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target) return;

    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.appClickOutside.emit(event);
    }
  }
}

import { Directive, input, signal } from '@angular/core';

@Directive()
export abstract class InfoBaseComponent {
  text = input.required<string>();
  cssClass = input<string>('', { alias: 'class' });
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}

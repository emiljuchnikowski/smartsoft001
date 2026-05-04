import { Directive, input, output } from '@angular/core';

@Directive()
export abstract class ImportBaseComponent {
  accept = input<string | undefined>('application/json');
  cssClass = input<string>('', { alias: 'class' });

  set = output<File>();

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file: File | null = inputEl.files?.[0] ?? null;

    inputEl.value = '';

    if (file) {
      this.set.emit(file);
    } else {
      throw Error('ImportBaseComponent: File not found');
    }
  }

  triggerFileInput(inputEl: HTMLInputElement): void {
    inputEl.click();
  }
}

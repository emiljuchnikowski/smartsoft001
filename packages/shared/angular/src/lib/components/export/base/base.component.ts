import { Directive, input } from '@angular/core';

@Directive()
export abstract class ExportBaseComponent {
  value = input<any | undefined>(undefined);
  fileName = input<string | undefined>();
  handler = input.required<(value: any) => void>();
  cssClass = input<string>('', { alias: 'class' });

  async onClick(): Promise<void> {
    const value = this.value();
    if (value) {
      this.handler()(value);
      return;
    }
  }
}

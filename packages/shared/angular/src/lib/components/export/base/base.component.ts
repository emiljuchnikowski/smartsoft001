import { Directive, input } from '@angular/core';

@Directive()
export abstract class ExportBaseComponent {
  value = input<any | undefined>(undefined);
  /** Name for the exported file, passed to `handler` as its second argument. */
  fileName = input<string | undefined>();
  /**
   * Called with `value` and `fileName` on click. Serialise and download the
   * data here. The `fileName` argument is optional, so `(value) => void`
   * handlers keep working.
   */
  handler = input.required<(value: any, fileName?: string) => void>();
  /** Extra CSS classes applied to the rendered button. */
  cssClass = input<string>('', { alias: 'class' });

  async onClick(): Promise<void> {
    const value = this.value();
    if (value) {
      this.handler()(value, this.fileName());
      return;
    }
  }
}

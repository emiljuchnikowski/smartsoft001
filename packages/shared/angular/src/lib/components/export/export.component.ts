import { Component, input } from '@angular/core';

@Component({
  selector: 'smart-export',
  template: `
    <!--<ion-button title="export" (click)="onClick()" slot="icon-only">-->
    <!--  <ion-icon name="download"></ion-icon>-->
    <!--</ion-button>-->
  `,
})
export class ExportComponent {
  value = input<any | undefined>(undefined);
  fileName = input<string | undefined>();
  handler = input.required<(value: any) => void>();

  async onClick(): Promise<void> {
    const value = this.value();
    if (value) {
      this.handler()(value);
      return;
    }
  }
}

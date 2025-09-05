import { Component, Input } from '@angular/core';

@Component({
  selector: 'smart-export',
  template: `
    <!--<ion-button title="export" (click)="onClick()" slot="icon-only">-->
    <!--  <ion-icon name="download"></ion-icon>-->
    <!--</ion-button>-->
  `,
  styles: [
    `
      :host {
        cursor: pointer;
        font-size: 3rem;
        height: 3rem;
        margin: 10px;
      }
    `,
  ],
})
export class ExportComponent {
  @Input() value: any;
  @Input() fileName!: string;
  @Input() handler!: (value: any) => void;

  async onClick(): Promise<void> {
    if (this.handler) {
      this.handler(this.value);
      return;
    }
  }
}

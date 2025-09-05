import { Component } from '@angular/core';

@Component({
  selector: 'smart-accordion-header',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        width: 100%;
        padding-left: 1.6rem;
      }
    `,
  ],
})
export class AccordionHeaderComponent {}

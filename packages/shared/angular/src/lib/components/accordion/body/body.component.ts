import { Component } from '@angular/core';

@Component({
  selector: 'smart-accordion-body',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        width: 100%;
        padding: 0 1.2rem;
        display: block;
      }
    `,
  ],
})
export class AccordionBodyComponent {}

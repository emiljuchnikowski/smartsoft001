import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  ModelSignal,
  ViewEncapsulation,
} from '@angular/core';

import { AccordionDefaultComponent } from './default/default.component';
import { IAccordionOptions } from '../../models';

@Component({
  selector: 'smart-accordion',
  template: `
    <ng-template #headerTpl>
      <ng-content select="[accordionHeader]"></ng-content>
    </ng-template>
    <ng-template #bodyTpl>
      <ng-content select="[accordionBody]"></ng-content>
    </ng-template>

    <smart-accordion-default
      [(show)]="show"
      [options]="options()"
      [cssClass]="cssClass()"
      [headerTpl]="headerTpl"
      [bodyTpl]="bodyTpl"
    />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionDefaultComponent],
})
export class AccordionComponent {
  show: ModelSignal<boolean> = model<boolean>(false);
  options = input<IAccordionOptions>();
  cssClass = input<string>('', { alias: 'class' });
}

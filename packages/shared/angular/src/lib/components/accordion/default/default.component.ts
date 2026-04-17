import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { AccordionBaseComponent } from '@smartsoft001/angular';

import { AccordionBodyComponent } from '../body/body.component';
import { AccordionHeaderComponent } from '../header/header.component';

@Component({
  selector: 'smart-accordion-default',
  templateUrl: './default.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionHeaderComponent, AccordionBodyComponent, NgTemplateOutlet],
})
export class AccordionDefaultComponent extends AccordionBaseComponent {
  accordionClasses = computed(() => {
    const classes = [...this.sharedContainerClasses()];

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });
}

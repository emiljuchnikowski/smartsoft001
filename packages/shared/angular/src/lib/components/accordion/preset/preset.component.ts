import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  getAccordionPresetContainerClasses,
  getAccordionPresetContentClasses,
  getAccordionPresetIconClasses,
  getAccordionPresetToggleClasses,
} from './preset-classes.util';
import { AccordionBaseComponent } from '../base/base.component';

let nextId = 0;

/**
 * Styled accordion variation (preset) based on the Preline bordered accordion
 * (FRA-210).
 *
 * Unlike token-driven presets, accordion has NO standard-component token: use it
 * directly via the `<smart-accordion-preset>` selector, supplying the same
 * `headerTpl` / `bodyTpl` template inputs, `show` model and `cssClass` contract
 * as `AccordionDefaultComponent`. Expand/collapse is driven entirely by the
 * inherited `show` model signal plus `@if` — no Preline JS runtime is required.
 */
@Component({
  selector: 'smart-accordion-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class AccordionPresetComponent extends AccordionBaseComponent {
  protected readonly contentId = `smart-accordion-preset-${nextId++}`;
  protected readonly iconClasses = getAccordionPresetIconClasses();

  protected disabled = computed(() => this.options()?.disabled ?? false);

  protected containerClasses = computed(() => {
    const classes = getAccordionPresetContainerClasses(this.show());

    const extra = this.cssClass();
    if (extra) classes.push(extra);

    return classes.join(' ');
  });

  protected toggleClasses = computed(() =>
    getAccordionPresetToggleClasses(this.show()).join(' '),
  );

  protected contentClasses = computed(() =>
    getAccordionPresetContentClasses().join(' '),
  );
}

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getCardBodyClasses,
  getCardContainerClasses,
  getCardFooterClasses,
  getCardHeaderClasses,
} from './preset-classes.util';
import { CardBaseComponent } from '../base/base.component';

/**
 * Styled card variation (preset).
 *
 * Drop-in replacement for `CardStandardComponent` — register it through
 * `CARD_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-card>`, or use the
 * `<smart-card-preset>` selector directly.
 *
 * Renders the same header / body / footer template slots as the base, with the
 * Preline card look: `rounded-xl` surface, `shadow-2xs`, a bordered surface
 * header and footer. Honours `options.grayBody` / `options.grayFooter`.
 */
@Component({
  selector: 'smart-card-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPresetComponent extends CardBaseComponent {
  // NgComponentOutlet (used by CardComponent when this is registered through
  // CARD_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected containerClasses = computed(() =>
    [getCardContainerClasses(), this.cssClass()].filter(Boolean).join(' '),
  );

  override headerClasses = computed(() => getCardHeaderClasses());

  override bodyClasses = computed(() =>
    getCardBodyClasses(Boolean(this.options()?.grayBody)),
  );

  override footerClasses = computed(() =>
    getCardFooterClasses(Boolean(this.options()?.grayFooter)),
  );
}

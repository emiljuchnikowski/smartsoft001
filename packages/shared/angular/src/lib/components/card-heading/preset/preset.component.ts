import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CardHeadingVariant,
  getCardHeadingContainerClasses,
} from './preset-classes.util';
import { CardHeadingStandardComponent } from '../standard/standard.component';

/**
 * HyperUI-styled card-heading variation (preset).
 *
 * Drop-in replacement for `CardHeadingStandardComponent` — register it through
 * `CARD_HEADING_STANDARD_COMPONENT_TOKEN`, or use the
 * `<smart-card-heading-preset>` selector directly.
 *
 * Restyles the heading with one of four HyperUI card looks, driven by
 * `options.presentation.variant`: `author` (default), `stacked`, `overlay`, or
 * `outline`. Content comes from the shared `ICardHeadingOptions` slots (title,
 * description, avatarTpl, metaTpl, actionsTpl).
 *
 * Decorator metadata is not inherited, so the full `imports` list is repeated.
 */
@Component({
  selector: 'smart-card-heading-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class CardHeadingPresetComponent extends CardHeadingStandardComponent {
  // NgComponentOutlet forwards inputs canonically, so drop the `class` alias.
  override cssClass = input<string>('');

  variant = computed<CardHeadingVariant>(
    () => this.options()?.presentation?.variant ?? 'author',
  );

  containerClasses = computed(() =>
    [getCardHeadingContainerClasses(this.variant()), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}

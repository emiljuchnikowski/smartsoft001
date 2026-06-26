import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  getButtonPresetClasses,
  SmartButtonPresetVariant,
  toButtonPresetVariant,
} from './preset-classes.util';
import { IconComponent } from '../../icon';
import { ButtonBaseComponent } from '../base/base.component';

/**
 * Styled button variation (preset).
 *
 * Drop-in replacement for `ButtonStandardComponent` — register it through
 * `BUTTON_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-button>`, or use
 * the `<smart-button-preset>` selector directly.
 *
 * Groups the Preline button types into a single component, selected via the
 * existing `options.variant` (`primary` -> solid, `secondary` -> outline,
 * `soft` -> soft), across the full `SmartColor` palette and every `SmartSize`.
 * Honours `options.rounded` / `options.circular`, `options.loading`,
 * `options.confirm` and the `disabled` input.
 */
@Component({
  selector: 'smart-button-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [TranslatePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPresetComponent extends ButtonBaseComponent {
  // NgComponentOutlet (used by ButtonComponent when this is registered through
  // BUTTON_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected variant = computed<SmartButtonPresetVariant>(() =>
    toButtonPresetVariant(this.options()?.variant),
  );

  protected buttonClasses = computed(() =>
    getButtonPresetClasses(
      this.variant(),
      this.options()?.color ?? 'indigo',
      this.options()?.size ?? 'md',
      {
        rounded: Boolean(this.options()?.rounded),
        circular: Boolean(this.options()?.circular),
      },
    ),
  );
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SmartButtonGroupVariant } from '../../../models';
import { ButtonGroupBaseComponent } from '../base';
import {
  getButtonGroupButtonClasses,
  getButtonGroupCountClasses,
  getButtonGroupClasses,
  getButtonGroupIconClasses,
} from './preset-classes.util';

/**
 * Styled button group variation (preset).
 *
 * Drop-in replacement for `ButtonGroupStandardComponent` — register it through
 * `BUTTON_GROUP_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-button-group>`,
 * or use the `<smart-button-group-preset>` selector directly.
 *
 * Renders a horizontal segmented control following the Preline button-group look
 * (`bg-layer` surface, shared borders collapsed via `-ms-px`, rounded ends). The
 * active segment (matching `selected`) is emphasised. `options.variant` tweaks the
 * per-button content: `icon-only` hides labels, `with-stat` styles the count pill.
 */
@Component({
  selector: 'smart-button-group-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupPresetComponent extends ButtonGroupBaseComponent {
  // Redeclared without an alias so `[cssClass]` also binds when the preset is
  // used directly; the inherited `class` alias keeps working, and the wrapper
  // reaches either name through outletInputs().
  override cssClass = input<string>('');

  protected variant = computed<SmartButtonGroupVariant>(
    () => this.options()?.variant ?? 'basic',
  );

  protected iconOnly = computed(() => this.variant() === 'icon-only');

  protected groupClasses = computed(() => getButtonGroupClasses());
  protected countClasses = computed(() =>
    getButtonGroupCountClasses(this.variant()),
  );
  protected iconClasses = computed(() => getButtonGroupIconClasses());

  protected buttonClasses(active: boolean): string {
    // No size field exists on IButtonGroupOptions, so the medium Preline size is
    // used for every segment (see preset-classes.util for the sm/lg recipes).
    return getButtonGroupButtonClasses('md', active);
  }
}

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ToggleBaseComponent } from '../base';
import {
  getToggleContainerClasses,
  getToggleDescriptionClasses,
  getToggleLabelClasses,
  getToggleSwitchClasses,
  getToggleTextWrapClasses,
  getToggleThumbClasses,
  getToggleTrackClasses,
  TOGGLE_INPUT_CLASSES,
} from './preset-classes.util';

let nextTogglePresetId = 0;

/**
 * Styled toggle (switch) variation (preset).
 *
 * Drop-in replacement for `ToggleStandardComponent` — register it through
 * `TOGGLE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-toggle>`, or use
 * the `<smart-toggle-preset>` selector directly.
 *
 * Renders the Preline default switch: a hidden, accessible checkbox drives the
 * track / thumb visuals via `peer-*` states, while the `value` model holds the
 * checked state. Optional `options.label` / `options.description` render beside
 * the switch on the side given by `options.labelPosition` (defaults to right):
 * the label is a `<label for>` of the checkbox (its accessible name) and the
 * description is referenced by the checkbox's `aria-describedby`.
 * `options.ariaLabel` names the checkbox only when there is no `label`.
 */
@Component({
  selector: 'smart-toggle-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TogglePresetComponent extends ToggleBaseComponent {
  // NgComponentOutlet (used by ToggleComponent when this is registered through
  // TOGGLE_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  private readonly instanceId = `smart-toggle-preset-${nextTogglePresetId++}`;
  protected readonly inputId = `${this.instanceId}-input`;
  protected readonly descriptionId = `${this.instanceId}-description`;

  protected readonly inputClasses = TOGGLE_INPUT_CLASSES;

  protected label = computed(() => this.options()?.label ?? '');
  protected description = computed(() => this.options()?.description ?? '');
  protected ariaLabel = computed(() => this.options()?.ariaLabel ?? null);
  protected labelPosition = computed(
    () => this.options()?.labelPosition ?? 'right',
  );

  protected hasText = computed(() =>
    Boolean(this.label() || this.description()),
  );

  protected containerClasses = computed(() =>
    getToggleContainerClasses(this.hasText()),
  );
  protected switchClasses = computed(() => getToggleSwitchClasses());
  protected trackClasses = computed(() => getToggleTrackClasses());
  protected thumbClasses = computed(() => getToggleThumbClasses());
  protected textWrapClasses = computed(() => getToggleTextWrapClasses());
  protected labelClasses = computed(() => getToggleLabelClasses());
  protected descriptionClasses = computed(() => getToggleDescriptionClasses());

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
  }
}

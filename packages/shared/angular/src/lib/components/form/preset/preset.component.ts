import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import {
  getFormFieldClasses,
  getFormShellClasses,
} from './preset-classes.util';
import { InputComponent } from '../../input';
import { FormStandardComponent } from '../standard/standard.component';

/**
 * Styled form variation (preset).
 *
 * A minimal restyle of `FormStandardComponent`: the field iteration, statuses
 * and every inherited behaviour (FormFactory effect, submit-on-enter,
 * value/valid/partial outputs on the wrapper) are reused unchanged — only the
 * shell is re-spaced. The form root gets a vertical rhythm and each field row a
 * `data-role="field"` wrapper. Field *internals* are intentionally left to the
 * `<smart-input>` presets; register `INPUT_FIELD_COMPONENTS_TOKEN` with
 * `INPUT_PRESET_FIELD_COMPONENTS` alongside this to restyle them.
 *
 * Drop-in replacement for `FormStandardComponent`: register it through
 * `FORM_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-form>`, or use
 * `<smart-form-preset>` directly.
 */
@Component({
  selector: 'smart-form-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent],
})
export class FormPresetComponent<T> extends FormStandardComponent<T> {
  // NgComponentOutlet in FormComponent forwards inputs including the `'class'`
  // key, so the inherited `class` alias on `cssClass` must be kept (do NOT
  // override cssClass here).
  protected readonly fieldClasses = getFormFieldClasses();

  override containerClasses = computed(() => {
    const extra = this.cssClass();
    return `${getFormShellClasses()} ${extra}`.trim();
  });
}

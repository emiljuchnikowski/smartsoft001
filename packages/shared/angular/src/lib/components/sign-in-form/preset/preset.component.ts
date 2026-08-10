import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  getSignInFormCardClasses,
  getSignInFormColumnClasses,
  getSignInFormContainerClasses,
  getSignInFormHeroClasses,
  getSignInFormInputClasses,
  getSignInFormLabelClasses,
  getSignInFormLinkClasses,
  getSignInFormSocialClasses,
  getSignInFormSubmitClasses,
} from './preset-classes.util';
import { SmartSignInFormLayout } from '../../../models';
import { SignInFormStandardComponent } from '../standard/standard.component';

/**
 * Preset (OSS-styled) sign-in-form variation.
 *
 * Drop-in replacement for `SignInFormStandardComponent` — register it through
 * `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`, or use the
 * `<smart-sign-in-form-preset>` selector directly.
 *
 * Inherits all base form logic (email/password signals, submit/social emits,
 * mode reactivity) and restyles it with one of four `options.layout` looks:
 * `simple` (default, labeled single column), `simple-no-labels` (placeholders
 * only), `card` (bordered card wrapper), and `split-screen` (hero + form grid).
 *
 * Decorator metadata is not inherited, so the full `imports` list is repeated.
 */
@Component({
  selector: 'smart-sign-in-form-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class SignInFormPresetComponent extends SignInFormStandardComponent {
  // NgComponentOutlet forwards inputs canonically, so drop the `class` alias.
  override cssClass = input<string>('');

  protected layout = computed<SmartSignInFormLayout>(
    () => this.options()?.layout ?? 'simple',
  );

  protected showLabels = computed(() => {
    const showLabels = this.options()?.showLabels;
    if (this.layout() === 'simple-no-labels') return showLabels === true;
    return showLabels !== false;
  });

  protected containerClasses = computed(() =>
    [getSignInFormContainerClasses(this.layout()), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly cardClasses = getSignInFormCardClasses();
  protected readonly heroClasses = getSignInFormHeroClasses();
  protected readonly columnClasses = getSignInFormColumnClasses();
  protected readonly labelClasses = getSignInFormLabelClasses();
  protected readonly inputClasses = getSignInFormInputClasses();
  protected readonly submitClasses = getSignInFormSubmitClasses();
  protected readonly socialClasses = getSignInFormSocialClasses();
  protected readonly linkClasses = getSignInFormLinkClasses();
}

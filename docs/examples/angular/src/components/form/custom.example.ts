// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  FORM_STANDARD_COMPONENT_TOKEN,
  FormBaseComponent,
  FormComponent,
  IFormOptions,
  InputComponent,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'name' })
export class DocsAccount {
  @Field({ type: FieldType.text, create: true, required: true })
  name = '';

  @Field({ type: FieldType.email, create: true })
  email = '';
}

@Component({
  selector: 'docs-custom-form',
  template: `
    <div [class]="containerClasses()">
      <p class="docs-form__hint">All fields marked with * are required.</p>

      @for (field of fields; track field) {
        <div class="docs-form__row">
          <smart-input
            [options]="{
              treeLevel: treeLevel ?? 0,
              fieldKey: field,
              control: getUntypedFormControl(field),
              model: model,
              mode: mode,
            }"
          />
        </div>
      }

      <!--
        smart-form wraps this template in a <form>, so a submit button makes
        the wrapper emit its (invokeSubmit). Calling submit() from the base
        works too: the wrapper re-emits the body's invokeSubmit.
      -->
      <button type="submit" class="docs-form__submit">Create account</button>
    </div>
  `,
  imports: [InputComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFormComponent extends FormBaseComponent<DocsAccount> {
  // `cssClass` comes from the base (alias `class`): the wrapper hands the
  // consumer's class to it under that name.
  containerClasses = computed(() => {
    const classes = ['docs-form'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-form-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormComponent],
  // The token swaps the standard form shell for the custom one everywhere
  // below this component, so consumers keep writing `<smart-form>`.
  providers: [
    { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: CustomFormComponent },
  ],
  template: `
    <smart-form
      [options]="options"
      (valueChange)="value.set($event)"
      (invokeSubmit)="submitted.set(true)"
    />
  `,
})
export class FormCustomExampleComponent {
  value = signal<DocsAccount | null>(null);
  submitted = signal(false);

  // `<smart-form>` builds the FormGroup from the @Field metadata through
  // FormFactory; the custom shell only decides how the fields are laid out.
  options: IFormOptions<DocsAccount> = {
    model: new DocsAccount(),
    show: true,
    mode: 'create',
  };
}
// #endregion

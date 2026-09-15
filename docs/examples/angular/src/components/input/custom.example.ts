// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import {
  INPUT_FIELD_COMPONENTS_TOKEN,
  InputBaseComponent,
  InputComponent,
  InputOptions,
  ModelLabelPipe,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'nickname' })
export class DocsProfile {
  @Field({ type: FieldType.text })
  nickname = '';
}

@Component({
  selector: 'docs-custom-input-text',
  template: `
    @if (control) {
      <label class="docs-input__label">
        {{
          control?.parent?.value
            | smartModelLabel
              : internalOptions.fieldKey
              : internalOptions?.model?.constructor
        }}
        @if (required) {
          <span class="docs-input__required">*</span>
        }
      </label>
      <input
        type="text"
        [class]="fieldClasses()"
        [formControl]="formControl"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
      />
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputTextComponent<T> extends InputBaseComponent<T> {
  // InputComponent forwards the external class under its aliased name, so the
  // inherited `cssClass` input is used as is - do not redeclare it here.
  fieldClasses = computed(() => {
    const classes = ['docs-input__field'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  // `control`, `formControl`, `required`, `internalOptions` and
  // `fieldOptions()` are all set up by InputBaseComponent from the options
  // that `<smart-input>` forwards.
}

@Component({
  selector: 'docs-input-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent],
  // Inputs are swapped per field type: every FieldType.text field below this
  // component now renders CustomInputTextComponent instead of the built-in
  // one. A single field can also be overridden with `options.component`.
  providers: [
    {
      provide: INPUT_FIELD_COMPONENTS_TOKEN,
      useValue: { [FieldType.text]: CustomInputTextComponent },
    },
  ],
  template: `<smart-input [options]="options" />`,
})
export class InputCustomExampleComponent {
  control = new UntypedFormControl('', Validators.required);

  // `<smart-input>` reads the @Field metadata of `model[fieldKey]` to decide
  // which field component to render, so the model drives the dispatch.
  options: InputOptions<DocsProfile> = {
    control: this.control,
    fieldKey: 'nickname',
    model: new DocsProfile(),
    treeLevel: 0,
  };
}
// #endregion

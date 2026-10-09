// #region usage
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  cn,
  IFormOptions,
  SmartForm,
  SmartFormBaseProps,
  SmartInput,
  SmartProvider,
  useFormBase,
} from '@smartsoft001/react';

@Model({ titleKey: 'name' })
export class DocsAccount {
  @Field({ type: FieldType.text, create: true, required: true })
  name = '';

  @Field({ type: FieldType.email, create: true })
  email = '';
}

export function CustomForm<T>(props: SmartFormBaseProps<T>) {
  // useFormBase gives the fields to render, what every input gets and
  // submit(), which reports the form value through onInvokeSubmit.
  const { fields, model, mode, treeLevel, getControl, submit } =
    useFormBase(props);

  return (
    <div className={cn('docs-form', props.className)}>
      <p className="docs-form__hint">All fields marked with * are required.</p>

      {fields.map((field) => {
        const control = getControl(field);

        // Skip the fields an `enabled` specification turned off.
        if (!control || control.smartDisabled) return null;

        return (
          <div key={field} className="docs-form__row">
            <SmartInput
              options={{
                treeLevel: treeLevel ?? 0,
                fieldKey: field,
                control,
                model,
                mode,
              }}
            />
          </div>
        );
      })}

      <button type="button" className="docs-form__submit" onClick={submit}>
        Create account
      </button>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { form: CustomForm };

export function FormCustomExample() {
  const [model] = useState(() => new DocsAccount());
  const [value, setValue] = useState<DocsAccount | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // SmartForm builds the form from the @Field metadata; the custom body only
  // decides how the fields are laid out.
  const options: IFormOptions<DocsAccount> = {
    model,
    show: true,
    mode: 'create',
  };

  // Every SmartForm below the provider renders its body with CustomForm.
  return (
    <SmartProvider components={components}>
      <SmartForm
        options={options}
        onValueChange={setValue}
        onInvokeSubmit={() => setSubmitted(true)}
      />
      {value?.name && <p>Name: {value.name}</p>}
      {submitted && <p>Account created</p>}
    </SmartProvider>
  );
}
// #endregion

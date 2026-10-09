// #region usage
import { useId, useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  cn,
  InputOptions,
  SmartFormControl,
  SmartInput,
  SmartInputFieldProps,
  SmartProvider,
  SmartValidators,
  useInput,
} from '@smartsoft001/react';

@Model({ titleKey: 'nickname' })
export class DocsProfile {
  @Field({ type: FieldType.text })
  nickname = '';
}

export function CustomInput<T>(props: SmartInputFieldProps<T>) {
  // useInput gives the control's live state, the translated model label,
  // whether the field is required and the handlers that bind the element.
  const {
    control,
    value,
    label,
    required,
    disabled,
    autoFocus,
    setValue,
    markAsTouched,
  } = useInput(props);
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className="docs-input__label">
        {label}
        {required && <span className="docs-input__required">*</span>}
      </label>
      <input
        id={id}
        type="text"
        className={cn('docs-input__field', props.className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}

// Inputs are swapped per field type: every FieldType.text field below the
// provider renders CustomInput. A module constant, so the context is stable.
const inputFieldComponents = { [FieldType.text]: CustomInput };

export function InputCustomExample() {
  const [control] = useState(
    () => new SmartFormControl('', SmartValidators.required),
  );
  const [model] = useState(() => new DocsProfile());

  // SmartInput reads the @Field metadata of `model[fieldKey]` to pick the
  // field component, so the model drives the dispatch.
  const options: InputOptions<DocsProfile> = {
    control,
    fieldKey: 'nickname',
    model,
    treeLevel: 0,
  };

  return (
    <SmartProvider inputFieldComponents={inputFieldComponents}>
      <SmartInput options={options} />
    </SmartProvider>
  );
}
// #endregion

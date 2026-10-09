// #region usage
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  InputOptions,
  SmartFormControl,
  SmartInput,
  SmartValidators,
} from '@smartsoft001/react';

@Model({})
class Newsletter {
  @Field({ type: FieldType.email, required: true })
  email = '';
}

export function InputUsageExample() {
  // Created once, so the control keeps its value across renders.
  const [control] = useState(
    () =>
      new SmartFormControl('', [
        SmartValidators.required,
        SmartValidators.email,
      ]),
  );
  const [model] = useState(() => new Newsletter());

  // SmartInput reads the @Field metadata of `model[fieldKey]` and renders the
  // matching field component (here: an email input).
  const options: InputOptions<Newsletter> = {
    control,
    model,
    fieldKey: 'email',
    mode: 'create',
    treeLevel: 0,
  };

  return <SmartInput options={options} />;
}
// #endregion

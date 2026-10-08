import { render } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { getDefaultInputFieldComponents } from './default-field-components';
import { INPUT_PRESET_FIELD_COMPONENTS } from './preset-fields';
import { SmartAbstractControl } from '../../forms/abstract-control';
import { SmartFormArray } from '../../forms/form-array';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { SmartProvider } from '../../providers/smart-provider';

@Model({})
class ChildModel {
  @Field({ type: FieldType.text }) name = '';
}

@Model({})
class FieldsModel {
  @Field({ type: FieldType.object, classType: ChildModel } as any)
  object = new ChildModel();

  @Field({ type: FieldType.array, classType: ChildModel } as any)
  array: ChildModel[] = [];
}

const ARRAY_VALUED: FieldTypeDef[] = [
  FieldType.ints,
  FieldType.strings,
  FieldType.check,
  FieldType.enum,
];

function requiredControl(type: FieldTypeDef): SmartAbstractControl {
  let control: SmartAbstractControl;

  if (type === FieldType.address) {
    control = new SmartFormGroup({
      city: new SmartFormControl(''),
      zipCode: new SmartFormControl(''),
      street: new SmartFormControl(''),
      buildingNumber: new SmartFormControl(''),
      flatNumber: new SmartFormControl(''),
    });
  } else if (type === FieldType.object) {
    control = new SmartFormGroup({ name: new SmartFormControl('') });
  } else if (type === FieldType.array) {
    control = new SmartFormArray([]);
  } else {
    control = new SmartFormControl(ARRAY_VALUED.includes(type) ? [] : null);
  }

  control.setValidators(SmartValidators.required);
  control.updateValueAndValidity();

  return control;
}

function renderRequired(type: FieldTypeDef, Component: ComponentType<any>) {
  const control = requiredControl(type);
  new SmartFormGroup({ [type]: control });

  return render(
    <SmartProvider>
      <Component
        options={{
          control,
          fieldKey: type,
          model: new FieldsModel(),
          mode: 'create',
          treeLevel: 0,
          possibilities: [],
        }}
        fieldOptions={{ type, required: true }}
      />
    </SmartProvider>,
  );
}

const ASTERISK = [
  '[class~="smart:text-red-500"][class~="smart:ml-0.5"]',
  '[class~="smart:text-red-500"][class~="smart:ms-0.5"]',
].join(', ');

const cases = (map: Partial<Record<FieldTypeDef, ComponentType<any>>>) =>
  Object.entries(map) as Array<[FieldTypeDef, ComponentType<any>]>;

describe('@smartsoft001/react: required mark of the input fields', () => {
  // The Angular templates put the label and the `@if (required)` block on
  // separate lines, so a space separates the label from the asterisk.
  it.each(cases(getDefaultInputFieldComponents()))(
    'should separate the label of the %s field from its asterisk with a space',
    (type, Component) => {
      const { container } = renderRequired(type, Component);

      const asterisk = container.querySelector(ASTERISK);

      expect(asterisk?.parentElement?.textContent).toMatch(/\S \*$/);
    },
  );

  it.each(cases(INPUT_PRESET_FIELD_COMPONENTS))(
    'should separate the label of the %s preset from its asterisk with a space',
    (type, Component) => {
      const { container } = renderRequired(type, Component);

      const asterisk = container.querySelector(ASTERISK);

      expect(asterisk?.parentElement?.textContent).toMatch(/\S \*$/);
    },
  );
});

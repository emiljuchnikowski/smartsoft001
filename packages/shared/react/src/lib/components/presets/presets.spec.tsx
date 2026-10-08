import { render, screen } from '@testing-library/react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SMART_PRESET_COMPONENTS } from './presets';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartProvider } from '../../providers/smart-provider';
import { SmartButton } from '../button/button';
import { SmartButtonPreset } from '../button/preset/button-preset';
import { SmartInput } from '../input/input';

@Model({})
class Person {
  @Field({ type: FieldType.text, create: true })
  name!: string;
}

describe('@smartsoft001/react: SMART_PRESET_COMPONENTS', () => {
  it('should render a wrapper with its preset', () => {
    render(
      <SmartProvider {...SMART_PRESET_COMPONENTS}>
        <SmartButton options={{ click: jest.fn() }}>Save</SmartButton>
      </SmartProvider>,
    );
    const { container } = render(
      <SmartButtonPreset options={{ click: jest.fn() }}>
        Save
      </SmartButtonPreset>,
    );

    expect(screen.getAllByRole('button')[0].className).toBe(
      container.querySelector('button')?.className,
    );
  });

  it('should render fields with their preset', () => {
    const control = new SmartFormControl('');
    new SmartFormGroup({ name: control });

    const { container } = render(
      <SmartProvider {...SMART_PRESET_COMPONENTS}>
        <SmartInput
          options={{
            control,
            fieldKey: 'name',
            model: new Person(),
            mode: 'create',
            treeLevel: 0,
          }}
        />
      </SmartProvider>,
    );

    expect(container.querySelector('input')?.className).toContain(
      'smart:rounded-lg',
    );
  });

  it('should render a text field with the default field map', () => {
    const control = new SmartFormControl('');
    new SmartFormGroup({ name: control });

    render(
      <SmartInput
        options={{
          control,
          fieldKey: 'name',
          model: new Person(),
          mode: 'create',
          treeLevel: 0,
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

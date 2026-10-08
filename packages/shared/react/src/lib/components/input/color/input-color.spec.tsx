import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputColor } from './input-color';
import { SmartInputColorPreset } from './preset/input-color-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class Theme {
  @Field({ type: FieldType.color })
  color!: string;
}

const VARIANTS = [
  ['standard', SmartInputColor],
  ['preset', SmartInputColorPreset],
] as const;

function setup(
  Input: ComponentType<SmartInputFieldProps>,
  control = new SmartFormControl<string | null>('#ff0000'),
  className?: string,
) {
  new SmartFormGroup({ color: control });

  const result = render(
    <SmartProvider translations={{ MODEL: { color: 'Color' } }}>
      <Input
        options={{
          control,
          fieldKey: 'color',
          model: new Theme(),
          mode: 'create',
          treeLevel: 0,
        }}
        fieldOptions={{ type: FieldType.color }}
        className={className}
      />
    </SmartProvider>,
  );

  return { control, container: result.container };
}

const picker = () => screen.getByLabelText('Color') as HTMLInputElement;
const swatch = () => picker().previousElementSibling as HTMLElement;

describe('@smartsoft001/react: SmartInputColor', () => {
  it.each(VARIANTS)(
    '%s: should render a color input with the control color',
    (_name, Input) => {
      setup(Input);

      expect(picker()).toHaveAttribute('type', 'color');
      expect(picker()).toHaveValue('#ff0000');
    },
  );

  it.each(VARIANTS)(
    '%s: should fall back to black in the picker without a color',
    (_name, Input) => {
      setup(Input, new SmartFormControl<string | null>(null));

      expect(picker()).toHaveValue('#000000');
    },
  );

  it.each(VARIANTS)(
    '%s: should paint the swatch with the control color',
    (_name, Input) => {
      setup(Input);

      expect(swatch().style.background).toBe('rgb(255, 0, 0)');
    },
  );

  it.each(VARIANTS)(
    '%s: should set a picked color, mark the control dirty and touched',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.change(picker(), { target: { value: '#00ff00' } });

      expect(control.value).toBe('#00ff00');
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(swatch().style.background).toBe('rgb(0, 255, 0)');
    },
  );

  it.each(VARIANTS)(
    '%s: should clear the color with the clear button',
    (_name, Input) => {
      const { control } = setup(Input);

      fireEvent.click(screen.getByRole('button', { name: '×' }));

      expect(control.value).toBeNull();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(picker()).toHaveValue('#000000');
    },
  );

  it.each(VARIANTS)(
    '%s: should show the asterisk of a required control',
    (_name, Input) => {
      setup(
        Input,
        new SmartFormControl<string | null>(null, SmartValidators.required),
      );

      expect(screen.getByText('*')).toHaveClass('smart:text-red-500');
    },
  );

  it.each(VARIANTS)(
    '%s: should render nothing without a control',
    (_n, Input) => {
      const { container } = render(<Input fieldOptions={undefined} />);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it('standard: should merge className into the group classes', () => {
    setup(SmartInputColor, undefined, 'extra-user-class');

    expect(picker().parentElement).toHaveClass(
      'smart:mt-2',
      'smart:flex',
      'extra-user-class',
    );
  });

  it('standard: should leave the swatch unpainted without a color', () => {
    setup(SmartInputColor, new SmartFormControl<string | null>(null));

    expect(swatch().style.background).toBe('');
  });

  it('preset: should merge className into the frame classes', () => {
    const { container } = setup(
      SmartInputColorPreset,
      undefined,
      'extra-user-class',
    );

    expect(container.querySelector('[data-role="color-frame"]')).toHaveClass(
      'smart:rounded-lg',
      'smart:focus-within:ring-1',
      'extra-user-class',
    );
  });

  it('preset: should paint the swatch white without a color', () => {
    setup(SmartInputColorPreset, new SmartFormControl<string | null>(null));

    expect(swatch().style.background).toBe('rgb(255, 255, 255)');
  });

  it('preset: should show the hex of the color', () => {
    const { container } = setup(SmartInputColorPreset);

    expect(container.querySelector('[data-role="hex"]')).toHaveTextContent(
      '#ff0000',
    );
  });

  it('preset: should empty the hex once cleared', () => {
    const { container } = setup(SmartInputColorPreset);

    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(container.querySelector('[data-role="hex"]')).toBeEmptyDOMElement();
  });
});

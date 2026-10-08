import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartInputObject } from './input-object';
import { SmartInputObjectPreset } from './preset/input-object-preset';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { SmartValidators } from '../../../forms/validators';
import { IFormOptions, InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers/model-label.provider';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartFormBaseProps } from '../../form/form.types';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class ChildModel {
  @Field({ type: FieldType.text })
  name = '';
}

@Model({})
class ObjectModel {
  @Field({ type: FieldType.object })
  child: ChildModel = new ChildModel();
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return 'Mock Label';
  }
}

const LABELS = new MockModelLabelProvider();

/** Stands in for the form body, as the Angular spec's stub form did. */
const received: IFormOptions<unknown>[] = [];
function StubForm({ options }: SmartFormBaseProps) {
  received.push(options);
  return <div data-testid="stub-form">stub-form</div>;
}

const COMPONENTS = { form: StubForm };

function buildOptions(
  control = new SmartFormGroup({ name: new SmartFormControl('') }),
): InputOptions<ObjectModel> {
  new SmartFormGroup({ child: control });

  return {
    control,
    fieldKey: 'child',
    model: new ObjectModel(),
    mode: 'update',
    treeLevel: 1,
  };
}

function renderObject(
  Component: ComponentType<SmartInputFieldProps>,
  options = buildOptions(),
  className?: string,
) {
  return render(
    <SmartProvider modelLabelProvider={LABELS} components={COMPONENTS}>
      <Component
        options={options}
        fieldOptions={{ type: FieldType.object }}
        className={className}
      />
    </SmartProvider>,
  );
}

describe('@smartsoft001/react: SmartInputObject', () => {
  beforeEach(() => {
    received.length = 0;
  });

  describe.each([
    ['standard', SmartInputObject],
    ['preset', SmartInputObjectPreset],
  ])('%s', (_name, Component) => {
    it('should render the label with the model label text', () => {
      renderObject(Component);

      expect(screen.getByText('Mock Label').tagName).toBe('LABEL');
    });

    it('should render the nested form', () => {
      renderObject(Component);

      expect(screen.getByTestId('stub-form')).toBeInTheDocument();
    });

    it('should give the nested form the child options', () => {
      const options = buildOptions();

      renderObject(Component, options);

      expect(received[0]).toEqual({
        treeLevel: 2,
        mode: 'update',
        control: options.control,
        model: options.model.child,
        show: true,
      });
    });

    it('should render the required asterisk when the control is required', () => {
      const control = new SmartFormGroup(
        { name: new SmartFormControl('') },
        SmartValidators.required,
      );

      renderObject(Component, buildOptions(control));

      expect(screen.getByText('*')).toHaveClass(
        'smart:text-red-500',
        'smart:ml-0.5',
      );
    });

    it('should not render the asterisk when the control is optional', () => {
      renderObject(Component);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('standard', () => {
    it('should apply the label classes', () => {
      renderObject(SmartInputObject);

      expect(screen.getByText('Mock Label')).toHaveClass(
        'smart:block',
        'smart:text-sm/6',
        'smart:font-medium',
        'smart:text-gray-900',
        'smart:dark:text-white',
      );
    });

    it('should merge className into the group wrapper', () => {
      renderObject(SmartInputObject, buildOptions(), 'extra-user-class');

      expect(
        screen.getByTestId('stub-form').closest('.smart\\:mt-2'),
      ).toHaveClass('extra-user-class');
    });
  });

  describe('preset', () => {
    it('should mark the label with data-role="label"', () => {
      renderObject(SmartInputObjectPreset);

      expect(screen.getByText('Mock Label')).toHaveAttribute(
        'data-role',
        'label',
      );
    });

    it('should apply the preset classes to the styled object frame', () => {
      const { container } = renderObject(SmartInputObjectPreset);

      expect(container.querySelector('[data-role="object-frame"]')).toHaveClass(
        'smart:mt-2',
        'smart:p-4',
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:border',
        'smart:border-gray-200',
        'smart:dark:border-gray-700',
        'smart:rounded-lg',
      );
    });

    it('should render the nested form inside the frame', () => {
      const { container } = renderObject(SmartInputObjectPreset);

      expect(
        container.querySelector('[data-role="object-frame"]'),
      ).toContainElement(screen.getByTestId('stub-form'));
    });

    it('should merge className into the object frame', () => {
      const { container } = renderObject(
        SmartInputObjectPreset,
        buildOptions(),
        'extra-user-class',
      );

      expect(container.querySelector('[data-role="object-frame"]')).toHaveClass(
        'extra-user-class',
        'smart:p-4',
      );
    });
  });
});

import { act, fireEvent, render, screen } from '@testing-library/react';
import { useId } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartForm } from './form';
import { SmartFormBaseProps } from './form.types';
import { SmartFormPreset } from './preset/form-preset';
import { SmartFormStandard } from './standard/form-standard';
import { useFormBase } from './use-form-base';
import { FormFactory } from '../../factories/form/form.factory';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { IFormOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';
import { useInput } from '../input/base/use-input';
import { SmartInputFieldProps } from '../input/input.types';

@Model({})
class TestItemModel {
  @Field({ type: FieldType.text })
  firstName = '';

  @Field({ type: FieldType.text })
  lastName = '';
}

/** A minimal text field: the real one is ported separately. */
function TestText(props: SmartInputFieldProps) {
  const { value, setValue, markAsTouched, label, fieldKey, disabled } =
    useInput(props);
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={`field-${fieldKey}`}
        value={(value as string) ?? ''}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}

const FIELDS = { [FieldType.text]: TestText };

@Model({})
class PersonModel {
  @Field({ type: FieldType.text, create: true, update: true })
  firstName = 'Ann';

  @Field({ type: FieldType.text, create: true })
  lastName = 'Smith';
}

/**
 * Hands back a promise per `FormFactory.create` call that the spec settles by
 * hand, so builds can settle out of the order they started in.
 */
function deferFormFactory() {
  const groups: SmartFormGroup[] = [];
  const resolvers: Array<() => void> = [];

  jest.spyOn(FormFactory.prototype, 'create').mockImplementation(() => {
    const group = new SmartFormGroup({
      firstName: new SmartFormControl(''),
      lastName: new SmartFormControl(''),
    });
    groups.push(group);

    return new Promise<SmartFormGroup>((resolve) => {
      resolvers.push(() => resolve(group));
    });
  });

  return {
    groups,
    resolve: async (index: number) => {
      await act(async () => resolvers[index]());
    },
  };
}

function buildGroup(): SmartFormGroup {
  return new SmartFormGroup({
    firstName: new SmartFormControl('Ann'),
    lastName: new SmartFormControl('Smith'),
  });
}

function buildOptions(): IFormOptions<TestItemModel> {
  return { model: new TestItemModel(), show: true };
}

/** A custom form body built on the shared hook. */
function TestBody(props: SmartFormBaseProps<TestItemModel>) {
  const { fields, submit, treeLevel, mode } = useFormBase(props);

  return (
    <div data-testid="custom-body" data-tree={treeLevel} data-mode={mode}>
      <span data-testid="fields">{fields.join(',')}</span>
      <button type="button" onClick={submit}>
        custom submit
      </button>
    </div>
  );
}

describe('@smartsoft001/react: SmartForm', () => {
  describe('useFormBase', () => {
    it('should populate fields from the form controls', () => {
      render(<TestBody form={buildGroup()} options={buildOptions()} />);

      expect(screen.getByTestId('fields')).toHaveTextContent(
        'firstName,lastName',
      );
    });

    it('should default the mode to an empty string', () => {
      render(<TestBody form={buildGroup()} options={buildOptions()} />);

      expect(screen.getByTestId('custom-body')).toHaveAttribute(
        'data-mode',
        '',
      );
    });

    it('should emit onInvokeSubmit with the form value on submit()', () => {
      const onInvokeSubmit = jest.fn();
      render(
        <TestBody
          form={buildGroup()}
          options={buildOptions()}
          onInvokeSubmit={onInvokeSubmit}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom submit' }));

      expect(onInvokeSubmit).toHaveBeenCalledWith({
        firstName: 'Ann',
        lastName: 'Smith',
      });
    });

    it('should re-render when the form changes', () => {
      const form = buildGroup();
      render(<TestBody form={form} options={buildOptions()} />);

      act(() => form.addControl('email', new SmartFormControl('')));

      expect(screen.getByTestId('fields')).toHaveTextContent(
        'firstName,lastName,email',
      );
    });
  });

  describe('SmartFormStandard', () => {
    it('should render one input per form control', () => {
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormStandard form={buildGroup()} options={buildOptions()} />
        </SmartProvider>,
      );

      expect(screen.getAllByTestId(/^field-/)).toHaveLength(2);
    });

    it('should apply the container classes including divider styles', () => {
      const { container } = render(
        <SmartFormStandard form={buildGroup()} options={buildOptions()} />,
      );

      expect(container.firstChild).toHaveClass(
        'smart:space-y-4',
        'smart:divide-y',
        'smart:divide-gray-100',
        'smart:dark:divide-white/10',
      );
    });

    it('should append className to the container classes', () => {
      const { container } = render(
        <SmartFormStandard
          form={buildGroup()}
          options={buildOptions()}
          className="my-extra-class"
        />,
      );

      expect(container.firstChild).toHaveClass('my-extra-class');
    });

    it('should skip fields whose control is smartDisabled', () => {
      const form = buildGroup();
      form.controls['firstName'].smartDisabled = true;

      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormStandard form={form} options={buildOptions()} />
        </SmartProvider>,
      );

      expect(screen.queryByTestId('field-firstName')).not.toBeInTheDocument();
      expect(screen.getByTestId('field-lastName')).toBeInTheDocument();
    });

    it('should pass the input options of each field to the input', () => {
      const form = buildGroup();
      const seen: unknown[] = [];
      const Custom = ({ options }: SmartInputFieldProps) => {
        seen.push(options);
        return null;
      };
      const options: IFormOptions<TestItemModel> = {
        ...buildOptions(),
        mode: 'update',
        treeLevel: 3,
        possibilities: { firstName: [{ id: 1, text: 'A', checked: false }] },
        inputComponents: { firstName: Custom },
      };

      render(<SmartFormStandard form={form} options={options} />);

      expect(seen[0]).toEqual({
        treeLevel: 3,
        fieldKey: 'firstName',
        control: form.controls['firstName'],
        model: options.model,
        mode: 'update',
        possibilities: [{ id: 1, text: 'A', checked: false }],
        component: Custom,
      });
    });

    it('should render a removed then re-added control at its original position', () => {
      const form = buildGroup();
      const lastName = form.controls['lastName'];
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormStandard form={form} options={buildOptions()} />
        </SmartProvider>,
      );

      act(() => form.removeControl('firstName'));
      act(() => form.addControl('firstName', new SmartFormControl('')));

      expect(
        screen.getAllByTestId(/^field-/).map((el) => el.dataset['testid']),
      ).toEqual(['field-firstName', 'field-lastName']);
      expect(lastName).toBe(form.controls['lastName']);
    });

    it('should render a control first added after the first render at its model position', () => {
      const form = buildGroup();
      form.removeControl('firstName');
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormStandard form={form} options={buildOptions()} />
        </SmartProvider>,
      );

      act(() => form.addControl('firstName', new SmartFormControl('')));

      expect(
        screen.getAllByTestId(/^field-/).map((el) => el.dataset['testid']),
      ).toEqual(['field-firstName', 'field-lastName']);
    });

    it('should place the confirm control of a field right after it', () => {
      const form = new SmartFormGroup({
        lastName: new SmartFormControl(''),
      });
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormStandard form={form} options={buildOptions()} />
        </SmartProvider>,
      );

      act(() => {
        form.addControl('firstNameConfirm', new SmartFormControl(''));
        form.addControl('firstName', new SmartFormControl(''));
      });

      expect(
        screen.getAllByTestId(/^field-/).map((el) => el.dataset['testid']),
      ).toEqual([
        'field-firstName',
        'field-firstNameConfirm',
        'field-lastName',
      ]);
    });
  });

  describe('SmartFormPreset', () => {
    function renderPreset(form = buildGroup(), className?: string) {
      return render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartFormPreset
            form={form}
            options={buildOptions()}
            className={className}
          />
        </SmartProvider>,
      );
    }

    it('should render a single form shell marked with data-role="form"', () => {
      const { container } = renderPreset();

      expect(container.querySelectorAll('[data-role="form"]')).toHaveLength(1);
    });

    it('should render one data-role="field" wrapper per form control', () => {
      const { container } = renderPreset();

      expect(container.querySelectorAll('[data-role="field"]')).toHaveLength(2);
    });

    it('should expose the field key on each field wrapper via data-key', () => {
      const { container } = renderPreset();

      const keys = Array.from(
        container.querySelectorAll('[data-role="field"]'),
      ).map((el) => el.getAttribute('data-key'));

      expect(keys).toEqual(['firstName', 'lastName']);
    });

    it('should render one input per rendered field', () => {
      renderPreset();

      expect(screen.getAllByTestId(/^field-/)).toHaveLength(2);
    });

    it('should apply the spaced shell classes on the form root', () => {
      const { container } = renderPreset();

      expect(container.querySelector('[data-role="form"]')).toHaveClass(
        'smart:space-y-5',
      );
    });

    it('should apply the field classes on every field wrapper', () => {
      const { container } = renderPreset();

      expect(container.querySelector('[data-role="field"]')).toHaveClass(
        'smart:space-y-1.5',
      );
    });

    it('should land className on the form root', () => {
      const { container } = renderPreset(buildGroup(), 'my-extra-class');

      expect(container.querySelector('[data-role="form"]')).toHaveClass(
        'smart:space-y-5',
        'my-extra-class',
      );
    });

    it('should skip fields whose control is smartDisabled', () => {
      const form = buildGroup();
      form.controls['lastName'].smartDisabled = true;

      const { container } = renderPreset(form);

      expect(container.querySelectorAll('[data-role="field"]')).toHaveLength(1);
    });
  });

  describe('SmartForm (wrapper)', () => {
    function buildControlOptions(): IFormOptions<TestItemModel> {
      return { ...buildOptions(), control: buildGroup() };
    }

    it('should render the standard body inside a form element by default', () => {
      const { container } = render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartForm options={buildControlOptions()} />
        </SmartProvider>,
      );

      expect(container.querySelector('form')).toContainElement(
        screen.getByTestId('field-firstName'),
      );
    });

    it('should emit onInvokeSubmit with the form value when the form is submitted', () => {
      const onInvokeSubmit = jest.fn();
      const { container } = render(
        <SmartForm
          options={buildControlOptions()}
          onInvokeSubmit={onInvokeSubmit}
        />,
      );

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      expect(onInvokeSubmit).toHaveBeenCalledWith({
        firstName: 'Ann',
        lastName: 'Smith',
      });
    });

    it('should prevent the native submission', () => {
      const { container } = render(
        <SmartForm options={buildControlOptions()} />,
      );
      const event = new Event('submit', { bubbles: true, cancelable: true });

      act(() => {
        (container.querySelector('form') as HTMLFormElement).dispatchEvent(
          event,
        );
      });

      expect(event.defaultPrevented).toBe(true);
    });

    it('should emit onInvokeSubmit on Enter in a single-line input', () => {
      const onInvokeSubmit = jest.fn();
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartForm
            options={buildControlOptions()}
            onInvokeSubmit={onInvokeSubmit}
          />
        </SmartProvider>,
      );

      fireEvent.keyDown(screen.getByTestId('field-firstName'), {
        key: 'Enter',
      });

      expect(onInvokeSubmit).toHaveBeenCalledWith({
        firstName: 'Ann',
        lastName: 'Smith',
      });
    });

    it('should not emit onInvokeSubmit on other keys', () => {
      const onInvokeSubmit = jest.fn();
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartForm
            options={buildControlOptions()}
            onInvokeSubmit={onInvokeSubmit}
          />
        </SmartProvider>,
      );

      fireEvent.keyDown(screen.getByTestId('field-firstName'), { key: 'a' });

      expect(onInvokeSubmit).not.toHaveBeenCalled();
    });

    it('should stop the implicit submission of the handled Enter', () => {
      render(
        <SmartProvider inputFieldComponents={FIELDS}>
          <SmartForm
            options={buildControlOptions()}
            onInvokeSubmit={jest.fn()}
          />
        </SmartProvider>,
      );

      const notCancelled = fireEvent.keyDown(
        screen.getByTestId('field-firstName'),
        { key: 'Enter' },
      );

      expect(notCancelled).toBe(false);
    });

    it('should leave Enter in a textarea alone', () => {
      const onInvokeSubmit = jest.fn();
      const TestLongText = (props: SmartInputFieldProps) => {
        const { fieldKey } = useInput(props);

        return <textarea data-testid={`area-${fieldKey}`} />;
      };
      render(
        <SmartProvider
          inputFieldComponents={{ [FieldType.text]: TestLongText }}
        >
          <SmartForm
            options={buildControlOptions()}
            onInvokeSubmit={onInvokeSubmit}
          />
        </SmartProvider>,
      );

      fireEvent.keyDown(screen.getByTestId('area-firstName'), { key: 'Enter' });

      expect(onInvokeSubmit).not.toHaveBeenCalled();
    });

    it('should default the tree level to 1 on the root element', () => {
      const { container } = render(
        <SmartForm options={buildControlOptions()} />,
      );

      expect(container.firstChild).toHaveAttribute('tree-level', '1');
      expect(container.firstChild).toHaveAttribute('data-tree-level', '1');
    });

    it('should keep the tree level of the options', () => {
      const { container } = render(
        <SmartForm options={{ ...buildControlOptions(), treeLevel: 3 }} />,
      );

      expect(container.firstChild).toHaveAttribute('tree-level', '3');
    });

    it('should pass className to the body', () => {
      const { container } = render(
        <SmartForm options={buildControlOptions()} className="my-extra" />,
      );

      expect(container.querySelector('form > div')).toHaveClass(
        'smart:divide-y',
        'my-extra',
      );
    });

    describe('change outputs', () => {
      it('should emit the value and the validity once registered', () => {
        const onValueChange = jest.fn();
        const onValidChange = jest.fn();

        render(
          <SmartForm
            options={buildControlOptions()}
            onValueChange={onValueChange}
            onValidChange={onValidChange}
          />,
        );

        expect(onValueChange).toHaveBeenCalledWith({
          firstName: 'Ann',
          lastName: 'Smith',
        });
        expect(onValidChange).toHaveBeenCalledWith(true);
      });

      it('should emit onValueChange after every change', () => {
        const options = buildControlOptions();
        const onValueChange = jest.fn();
        render(<SmartForm options={options} onValueChange={onValueChange} />);

        act(() => options.control?.get('firstName')?.setValue('Ada'));

        expect(onValueChange).toHaveBeenLastCalledWith({
          firstName: 'Ada',
          lastName: 'Smith',
        });
      });

      it('should emit onValidChange with the form validity', () => {
        const options = buildControlOptions();
        options.control
          ?.get('lastName')
          ?.setValidators(SmartValidators.required);
        const onValidChange = jest.fn();
        render(<SmartForm options={options} onValidChange={onValidChange} />);

        act(() => options.control?.get('lastName')?.setValue(''));

        expect(onValidChange).toHaveBeenLastCalledWith(false);
      });

      it('should emit the dirty values without confirm controls as onValuePartialChange', () => {
        const form = buildGroup();
        form.addControl('lastNameConfirm', new SmartFormControl('Smith'));
        const onValuePartialChange = jest.fn();
        render(
          <SmartForm
            options={{ ...buildOptions(), control: form }}
            onValuePartialChange={onValuePartialChange}
          />,
        );

        act(() => {
          form.controls['lastNameConfirm'].markAsDirty();
          form.controls['firstName'].markAsDirty();
          form.controls['firstName'].setValue('Ada');
        });

        expect(onValuePartialChange).toHaveBeenLastCalledWith({
          firstName: 'Ada',
        });
      });

      it('should call the latest callbacks', () => {
        const options = buildControlOptions();
        const first = jest.fn();
        const second = jest.fn();
        const { rerender } = render(
          <SmartForm options={options} onValueChange={first} />,
        );
        rerender(<SmartForm options={options} onValueChange={second} />);
        first.mockClear();

        act(() => options.control?.get('firstName')?.setValue('Ada'));

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalled();
      });

      it('should stop emitting once unmounted', () => {
        const options = buildControlOptions();
        const onValueChange = jest.fn();
        const { unmount } = render(
          <SmartForm options={options} onValueChange={onValueChange} />,
        );
        unmount();
        onValueChange.mockClear();

        options.control?.get('firstName')?.setValue('Ada');

        expect(onValueChange).not.toHaveBeenCalled();
      });
    });

    describe('loading', () => {
      it('should disable the form while loading', () => {
        const options = buildControlOptions();

        render(<SmartForm options={{ ...options, loading: true }} />);

        expect(options.control?.disabled).toBe(true);
      });

      it('should enable the form again once loading ends', () => {
        const options = buildControlOptions();
        const { rerender } = render(
          <SmartForm options={{ ...options, loading: true }} />,
        );

        rerender(<SmartForm options={{ ...options, loading: false }} />);

        expect(options.control?.enabled).toBe(true);
      });

      it('should leave the form alone when loading is not set', () => {
        const options = buildControlOptions();
        options.control?.disable();

        render(<SmartForm options={options} />);

        expect(options.control?.disabled).toBe(true);
      });
    });

    describe('with components.form registered', () => {
      const COMPONENTS = { form: TestBody };

      it('should render the registered body instead of the standard one', () => {
        const { container } = render(
          <SmartProvider components={COMPONENTS}>
            <SmartForm options={buildControlOptions()} />
          </SmartProvider>,
        );

        expect(container.querySelector('form')).toContainElement(
          screen.getByTestId('custom-body'),
        );
        expect(container.querySelector('.smart\\:divide-y')).toBeNull();
      });

      it('should give the body the options with the default tree level', () => {
        render(
          <SmartProvider components={COMPONENTS}>
            <SmartForm options={buildControlOptions()} />
          </SmartProvider>,
        );

        expect(screen.getByTestId('custom-body')).toHaveAttribute(
          'data-tree',
          '1',
        );
      });

      it('should forward onInvokeSubmit emitted by the body', () => {
        const onInvokeSubmit = jest.fn();
        render(
          <SmartProvider components={COMPONENTS}>
            <SmartForm
              options={buildControlOptions()}
              onInvokeSubmit={onInvokeSubmit}
            />
          </SmartProvider>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'custom submit' }));

        expect(onInvokeSubmit).toHaveBeenCalledWith({
          firstName: 'Ann',
          lastName: 'Smith',
        });
      });
    });

    describe('without options.control', () => {
      afterEach(() => jest.restoreAllMocks());

      it('should build the form of the model with the form factory', async () => {
        render(
          <SmartProvider inputFieldComponents={FIELDS}>
            <SmartForm options={{ model: new PersonModel(), show: true }} />
          </SmartProvider>,
        );

        expect(await screen.findByTestId('field-firstName')).toHaveValue('Ann');
        expect(screen.getByTestId('field-lastName')).toHaveValue('Smith');
      });

      it('should build the fields of the mode', async () => {
        render(
          <SmartProvider inputFieldComponents={FIELDS}>
            <SmartForm
              options={{ model: new PersonModel(), show: true, mode: 'update' }}
            />
          </SmartProvider>,
        );

        await screen.findByTestId('field-firstName');

        expect(screen.queryByTestId('field-lastName')).not.toBeInTheDocument();
      });

      it('should render nothing until the form is built', () => {
        const factory = deferFormFactory();

        const { container } = render(
          <SmartForm options={{ model: new PersonModel(), show: true }} />,
        );

        expect(container).toBeEmptyDOMElement();
        expect(factory.groups).toHaveLength(1);
      });

      it('should render the group built for the latest model', async () => {
        const factory = deferFormFactory();
        const bodies: SmartFormGroup[] = [];
        const Body = ({ form }: SmartFormBaseProps) => {
          bodies.push(form);
          return null;
        };
        const components = { form: Body };
        const { rerender } = render(
          <SmartProvider components={components}>
            <SmartForm options={{ model: new PersonModel(), show: true }} />
          </SmartProvider>,
        );
        await factory.resolve(0);

        rerender(
          <SmartProvider components={components}>
            <SmartForm options={{ model: new PersonModel(), show: true }} />
          </SmartProvider>,
        );
        await factory.resolve(1);

        expect(bodies[bodies.length - 1]).toBe(factory.groups[1]);
      });

      it('should keep the latest group when an earlier build settles last', async () => {
        const factory = deferFormFactory();
        const bodies: SmartFormGroup[] = [];
        const Body = ({ form }: SmartFormBaseProps) => {
          bodies.push(form);
          return null;
        };
        const components = { form: Body };
        const { rerender } = render(
          <SmartProvider components={components}>
            <SmartForm options={{ model: new PersonModel(), show: true }} />
          </SmartProvider>,
        );
        rerender(
          <SmartProvider components={components}>
            <SmartForm options={{ model: new PersonModel(), show: true }} />
          </SmartProvider>,
        );

        await factory.resolve(1);
        await factory.resolve(0);

        expect(bodies[bodies.length - 1]).toBe(factory.groups[1]);
      });

      it('should emit onValueChange for the rendered group only', async () => {
        const factory = deferFormFactory();
        const onValueChange = jest.fn();
        const { rerender } = render(
          <SmartForm
            options={{ model: new PersonModel(), show: true }}
            onValueChange={onValueChange}
          />,
        );
        await factory.resolve(0);
        rerender(
          <SmartForm
            options={{ model: new PersonModel(), show: true }}
            onValueChange={onValueChange}
          />,
        );
        await factory.resolve(1);
        onValueChange.mockClear();

        act(() => {
          factory.groups[0].controls['firstName'].setValue('stale');
          factory.groups[1].controls['firstName'].setValue('current');
        });

        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange).toHaveBeenCalledWith(
          expect.objectContaining({ firstName: 'current' }),
        );
      });
    });

    describe('nested in another form', () => {
      it('should not render a form element inside the outer form', () => {
        const inner = new SmartFormGroup({
          firstName: new SmartFormControl('Ann'),
        });
        // Only the outer body nests a form, or the tree would never end.
        const Body = ({ options }: SmartFormBaseProps) =>
          options.treeLevel === 1 ? (
            <SmartForm
              options={{ ...buildOptions(), control: inner, treeLevel: 2 }}
            />
          ) : (
            <span data-testid="inner-body" />
          );

        const { container } = render(
          <SmartProvider components={{ form: Body }}>
            <SmartForm options={buildControlOptions()} />
          </SmartProvider>,
        );

        expect(screen.getByTestId('inner-body')).toBeInTheDocument();
        expect(container.querySelectorAll('form')).toHaveLength(1);
      });
    });
  });
});

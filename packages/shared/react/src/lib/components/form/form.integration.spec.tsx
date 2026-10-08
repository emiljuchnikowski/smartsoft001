import { act, fireEvent, render, screen } from '@testing-library/react';
import { useId } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartForm } from './form';
import { SmartFormProps } from './form.types';
import { SmartProvider } from '../../providers/smart-provider';
import { SmartInputArrayPreset } from '../input/array/preset/input-array-preset';
import { useInput } from '../input/base/use-input';
import { SmartInputFieldProps } from '../input/input.types';
import { SmartInputObject } from '../input/object/input-object';

/** Minimal leaf fields, standing in for the real ones. */
function TestText(props: SmartInputFieldProps) {
  const { value, setValue, markAsTouched, label, fieldKey } = useInput(props);
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={`field-${fieldKey}`}
        value={(value as string) ?? ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}

function TestFlag(props: SmartInputFieldProps) {
  const { value, setValue, fieldKey } = useInput(props);

  return (
    <input
      type="checkbox"
      data-testid={`field-${fieldKey}`}
      checked={!!value}
      onChange={(e) => setValue(e.target.checked)}
    />
  );
}

const FIELDS = {
  [FieldType.text]: TestText,
  [FieldType.flag]: TestFlag,
  [FieldType.object]: SmartInputObject,
  [FieldType.array]: SmartInputArrayPreset,
};

@Model({})
class ContactModel {
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  @Field({ type: FieldType.text, create: true })
  nickname = 'Ada';
}

@Model({})
class ToggleModel {
  @Field({ type: FieldType.flag, create: true })
  hasCompany!: boolean;

  @Field({
    type: FieldType.text,
    create: true,
    enabled: { criteria: { hasCompany: true } },
  })
  companyName!: string;

  @Field({ type: FieldType.text, create: true })
  note!: string;
}

@Model({})
class AddressModel {
  @Field({ type: FieldType.text, create: { required: true } })
  city!: string;
}

@Model({})
class CompanyModel {
  @Field({ type: FieldType.text, create: true })
  title = 'ACME';

  @Field({ type: FieldType.object, create: true })
  address: AddressModel = new AddressModel();
}

@Model({})
class LineModel {
  @Field({ type: FieldType.text, create: true })
  product!: string;
}

@Model({})
class OrderModel {
  @Field({ type: FieldType.array, classType: LineModel, create: true })
  lines: LineModel[] = [];
}

function line(product: string): LineModel {
  return Object.assign(new LineModel(), { product });
}

async function renderForm<T>(props: SmartFormProps<T>) {
  const result = render(
    <SmartProvider language="eng" inputFieldComponents={FIELDS}>
      <SmartForm {...props} />
    </SmartProvider>,
  );

  // The form factory builds the form asynchronously.
  await act(async () => undefined);

  return result;
}

describe('@smartsoft001/react: SmartForm (integration)', () => {
  it('should show the error of a required field once it is touched', async () => {
    await renderForm({ options: { model: new ContactModel(), show: true } });
    const name = screen.getByTestId('field-name');

    expect(screen.queryByText('field is required')).not.toBeInTheDocument();

    fireEvent.blur(name);

    expect(screen.getByText('field is required')).toBeInTheDocument();
  });

  it('should report the form invalid until the required field is filled', async () => {
    const onValidChange = jest.fn();
    await renderForm({
      options: { model: new ContactModel(), show: true },
      onValidChange,
    });

    expect(onValidChange).toHaveBeenLastCalledWith(false);

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Grace' },
    });

    expect(onValidChange).toHaveBeenLastCalledWith(true);
  });

  it('should emit the value on submit', async () => {
    const onInvokeSubmit = jest.fn();
    const { container } = await renderForm({
      options: { model: new ContactModel(), show: true },
      onInvokeSubmit,
    });

    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Grace' },
    });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onInvokeSubmit).toHaveBeenCalledWith({
      name: 'Grace',
      nickname: 'Ada',
    });
  });

  it('should emit the edited fields as the partial value', async () => {
    const onValuePartialChange = jest.fn();
    await renderForm({
      options: { model: new ContactModel(), show: true },
      onValuePartialChange,
    });

    // `useInput.setValue` marks the control dirty before setting the value, so
    // every keystroke emits the field; the last emission carries the full text.
    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Gr' },
    });
    fireEvent.change(screen.getByTestId('field-name'), {
      target: { value: 'Grace' },
    });

    expect(onValuePartialChange).toHaveBeenLastCalledWith({ name: 'Grace' });
  });

  describe('enabled specification', () => {
    it('should hide the field while the specification does not hold', async () => {
      await renderForm({ options: { model: new ToggleModel(), show: true } });

      expect(screen.queryByTestId('field-companyName')).not.toBeInTheDocument();
    });

    it('should show the field at its model position once the specification holds', async () => {
      await renderForm({ options: { model: new ToggleModel(), show: true } });

      fireEvent.click(screen.getByTestId('field-hasCompany'));

      expect(
        screen.getAllByTestId(/^field-/).map((el) => el.dataset['testid']),
      ).toEqual(['field-hasCompany', 'field-companyName', 'field-note']);
    });

    it('should hide the field again when the specification stops holding', async () => {
      await renderForm({ options: { model: new ToggleModel(), show: true } });

      fireEvent.click(screen.getByTestId('field-hasCompany'));
      fireEvent.click(screen.getByTestId('field-hasCompany'));

      expect(screen.queryByTestId('field-companyName')).not.toBeInTheDocument();
    });
  });

  describe('object field', () => {
    it('should render the inputs of the nested model', async () => {
      await renderForm({ options: { model: new CompanyModel(), show: true } });

      expect(screen.getByTestId('field-title')).toHaveValue('ACME');
      expect(screen.getByTestId('field-city')).toBeInTheDocument();
    });

    it('should render the nested form one tree level deeper without a nested form element', async () => {
      const { container } = await renderForm({
        options: { model: new CompanyModel(), show: true },
      });

      expect(container.querySelectorAll('form')).toHaveLength(1);
      expect(
        screen.getByTestId('field-city').closest('[tree-level]'),
      ).toHaveAttribute('tree-level', '2');
    });

    it('should update the root value from a nested input', async () => {
      const onValueChange = jest.fn();
      await renderForm({
        options: { model: new CompanyModel(), show: true },
        onValueChange,
      });

      fireEvent.change(screen.getByTestId('field-city'), {
        target: { value: 'Paris' },
      });

      expect(onValueChange).toHaveBeenLastCalledWith({
        title: 'ACME',
        address: { city: 'Paris' },
      });
    });

    it('should submit the outer form on Enter in a nested input', async () => {
      const onInvokeSubmit = jest.fn();
      await renderForm({
        options: { model: new CompanyModel(), show: true },
        onInvokeSubmit,
      });

      fireEvent.keyDown(screen.getByTestId('field-city'), { key: 'Enter' });

      expect(onInvokeSubmit).toHaveBeenCalledWith({
        title: 'ACME',
        address: { city: null },
      });
    });
  });

  describe('array field', () => {
    function buildOrder(): OrderModel {
      return Object.assign(new OrderModel(), {
        lines: [line('apple'), line('pear')],
      });
    }

    function products(): string[] {
      return screen
        .getAllByTestId('field-product')
        .map((el) => (el as HTMLInputElement).value);
    }

    it('should render the inputs of every item', async () => {
      await renderForm({ options: { model: buildOrder(), show: true } });

      expect(products()).toEqual(['apple', 'pear']);
    });

    it('should add an item and include it in the value', async () => {
      const onValueChange = jest.fn();
      await renderForm({
        options: { model: buildOrder(), show: true },
        onValueChange,
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'add' }));
      });
      fireEvent.change(screen.getAllByTestId('field-product')[2], {
        target: { value: 'plum' },
      });

      expect(onValueChange).toHaveBeenLastCalledWith({
        lines: [{ product: 'apple' }, { product: 'pear' }, { product: 'plum' }],
      });
    });

    it('should remove an item from the value', async () => {
      const onValueChange = jest.fn();
      await renderForm({
        options: { model: buildOrder(), show: true },
        onValueChange,
      });

      fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[0]);

      expect(products()).toEqual(['pear']);
      expect(onValueChange).toHaveBeenLastCalledWith({
        lines: [{ product: 'pear' }],
      });
    });

    it('should reorder the items by drag and drop', async () => {
      const onValueChange = jest.fn();
      const { container } = await renderForm({
        options: { model: buildOrder(), show: true },
        onValueChange,
      });
      const [first, second] = Array.from(
        container.querySelectorAll<HTMLElement>('[data-role="item"]'),
      );

      fireEvent.dragStart(first);
      fireEvent.dragOver(second);
      fireEvent.drop(second);

      expect(products()).toEqual(['pear', 'apple']);
      expect(onValueChange).toHaveBeenLastCalledWith({
        lines: [{ product: 'pear' }, { product: 'apple' }],
      });
    });

    it('should report the array as part of the partial value once changed', async () => {
      const onValuePartialChange = jest.fn();
      await renderForm({
        options: { model: buildOrder(), show: true },
        onValuePartialChange,
      });

      fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[1]);

      expect(onValuePartialChange).toHaveBeenLastCalledWith({
        lines: [{ product: 'apple' }],
      });
    });
  });
});

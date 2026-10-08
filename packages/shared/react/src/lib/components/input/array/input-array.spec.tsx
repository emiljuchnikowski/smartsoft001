import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';

import { Field, FieldType, getModelOptions, Model } from '@smartsoft001/models';

import { SmartInputArray } from './input-array';
import { SmartInputArrayPreset } from './preset/input-array-preset';
import { FormFactory } from '../../../factories/form/form.factory';
import { SmartFormArray } from '../../../forms/form-array';
import { SmartFormControl } from '../../../forms/form-control';
import { SmartFormGroup } from '../../../forms/form-group';
import { IFormOptions, InputOptions } from '../../../models';
import { IModelLabelProvider } from '../../../providers/model-label.provider';
import { SmartProvider } from '../../../providers/smart-provider';
import { SmartFormBaseProps } from '../../form/form.types';
import { SmartInputFieldProps } from '../input.types';

@Model({})
class ArrayChildModel {
  @Field({ type: FieldType.text })
  name = '';
}

@Model({})
class ArrayParentModel {
  @Field({ type: FieldType.array, classType: ArrayChildModel })
  items: ArrayChildModel[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  get() {
    return 'Mock Label';
  }
}

const LABELS = new MockModelLabelProvider();

/** Stands in for the form body of every item, as the Angular stub form did. */
const received: IFormOptions<ArrayChildModel>[] = [];
function StubForm({ options, form }: SmartFormBaseProps<ArrayChildModel>) {
  received.push(options);
  return <div data-testid="stub-form">{String(form.value['name'])}</div>;
}

const COMPONENTS = { form: StubForm };

function createItemControl(name: string): SmartFormGroup {
  return new SmartFormGroup({ name: new SmartFormControl(name) });
}

function buildOptions(
  control: SmartFormArray,
  mode?: string,
): InputOptions<ArrayParentModel> {
  new SmartFormGroup({ items: control });

  return {
    control,
    fieldKey: 'items',
    model: new ArrayParentModel(),
    mode,
    treeLevel: 1,
  };
}

function renderArray(
  Component: ComponentType<SmartInputFieldProps>,
  options: InputOptions<ArrayParentModel>,
  fieldOptions: SmartInputFieldProps['fieldOptions'] = {
    type: FieldType.array,
    classType: ArrayChildModel,
  },
  className?: string,
) {
  return render(
    <SmartProvider
      language="eng"
      modelLabelProvider={LABELS}
      components={COMPONENTS}
    >
      <Component
        options={options}
        fieldOptions={fieldOptions}
        className={className}
      />
    </SmartProvider>,
  );
}

describe('@smartsoft001/react: SmartInputArray', () => {
  beforeEach(() => {
    received.length = 0;
  });

  afterEach(() => jest.restoreAllMocks());

  describe.each([
    ['standard', SmartInputArray],
    ['preset', SmartInputArrayPreset],
  ])('%s', (_name, Component) => {
    it('should render the label with the model label text', () => {
      renderArray(Component, buildOptions(new SmartFormArray([])));

      expect(screen.getByText('Mock Label').tagName).toBe('LABEL');
    });

    it('should render the nested form of every item', () => {
      renderArray(
        Component,
        buildOptions(
          new SmartFormArray([createItemControl('a'), createItemControl('b')]),
        ),
      );

      expect(
        screen.getAllByTestId('stub-form').map((el) => el.textContent),
      ).toEqual(['a', 'b']);
    });

    it('should give every item the child options', () => {
      const control = new SmartFormArray([createItemControl('a')]);
      const options = buildOptions(control, 'update');

      renderArray(Component, options);

      expect(received[0]).toEqual({
        treeLevel: 2,
        mode: 'update',
        control: control.at(0),
        model: expect.any(ArrayChildModel),
        fieldOptions: expect.objectContaining({ classType: ArrayChildModel }),
        modelOptions: getModelOptions(ArrayChildModel),
        show: false,
      });
      expect(received[0].model.name).toBe('a');
    });
  });

  describe('standard', () => {
    it('should render the add button when possibilities are not static', () => {
      renderArray(SmartInputArray, buildOptions(new SmartFormArray([])), {
        type: FieldType.array,
        classType: ArrayChildModel,
        possibilities: {},
      });

      expect(screen.getByRole('button', { name: 'add' })).toHaveClass(
        'smart:bg-indigo-600',
      );
    });

    it('should not render the add button when possibilities are static', () => {
      renderArray(SmartInputArray, buildOptions(new SmartFormArray([])), {
        type: FieldType.array,
        classType: ArrayChildModel,
        possibilities: { static: true },
      });

      expect(
        screen.queryByRole('button', { name: 'add' }),
      ).not.toBeInTheDocument();
    });

    it('should merge className into the group wrapper', () => {
      renderArray(
        SmartInputArray,
        buildOptions(new SmartFormArray([])),
        undefined,
        'extra-user-class',
      );

      expect(
        screen.getByRole('button', { name: 'add' }).parentElement,
      ).toHaveClass('smart:mt-2', 'smart:space-y-2', 'extra-user-class');
    });

    it('should frame every item', () => {
      renderArray(
        SmartInputArray,
        buildOptions(new SmartFormArray([createItemControl('a')])),
      );

      expect(
        screen.getByTestId('stub-form').closest('.smart\\:p-2'),
      ).toHaveClass(
        'smart:rounded',
        'smart:border',
        'smart:border-gray-200',
        'smart:dark:border-gray-700',
      );
    });
  });

  describe.each([
    ['standard', SmartInputArray],
    ['preset', SmartInputArrayPreset],
  ])('%s: adding an item', (_name, Component) => {
    async function add(): Promise<void> {
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /add/ }));
      });
    }

    it('should build the item with the form factory for the mode and the root', async () => {
      const create = jest.spyOn(FormFactory.prototype, 'create');
      const control = new SmartFormArray([]);
      renderArray(Component, buildOptions(control, 'update'));

      await add();

      expect(create).toHaveBeenCalledWith(expect.any(ArrayChildModel), {
        mode: 'update',
        root: control.root,
      });
    });

    it('should push the new item into the array', async () => {
      const control = new SmartFormArray([createItemControl('a')]);
      renderArray(Component, buildOptions(control));

      await add();

      expect(control.length).toBe(2);
      expect(screen.getAllByTestId('stub-form')).toHaveLength(2);
    });

    it('should mark the array as dirty', async () => {
      const control = new SmartFormArray([]);
      renderArray(Component, buildOptions(control));

      await add();

      expect(control.dirty).toBe(true);
    });

    it('should show the nested form of the new item', async () => {
      const control = new SmartFormArray([createItemControl('a')]);
      renderArray(Component, buildOptions(control));

      await add();

      expect(received[received.length - 1]).toEqual(
        expect.objectContaining({ control: control.at(1), show: true }),
      );
    });
  });

  describe('preset', () => {
    it('should mark the label with data-role="label"', () => {
      renderArray(SmartInputArrayPreset, buildOptions(new SmartFormArray([])));

      expect(screen.getByText('Mock Label')).toHaveAttribute(
        'data-role',
        'label',
      );
    });

    it('should render a card per array item', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(
          new SmartFormArray([createItemControl('a'), createItemControl('b')]),
        ),
      );

      expect(container.querySelectorAll('[data-role="item"]')).toHaveLength(2);
    });

    it('should render the nested form inside every item', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(
          new SmartFormArray([createItemControl('a'), createItemControl('b')]),
        ),
      );

      const items = container.querySelectorAll('[data-role="item"]');

      expect(items[0]).toHaveTextContent('a');
      expect(items[1]).toHaveTextContent('b');
    });

    it('should apply the card classes to every item', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(new SmartFormArray([createItemControl('a')])),
      );

      expect(container.querySelector('[data-role="item"]')).toHaveClass(
        'smart:flex',
        'smart:items-start',
        'smart:gap-x-2',
        'smart:rounded-lg',
        'smart:border',
        'smart:border-gray-200',
        'smart:dark:border-gray-700',
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:p-3',
      );
    });

    it('should stack the items in the array wrapper', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(new SmartFormArray([createItemControl('a')])),
        undefined,
        'extra-user-class',
      );

      expect(container.querySelector('[data-role="array"]')).toHaveClass(
        'smart:mt-2',
        'smart:space-y-2',
        'extra-user-class',
      );
    });

    it('should render the outline add button with its icon', () => {
      renderArray(SmartInputArrayPreset, buildOptions(new SmartFormArray([])));

      const add = screen.getByRole('button', { name: 'add' });

      expect(add).toHaveAttribute('data-role', 'add');
      expect(add).toHaveClass('smart:inline-flex', 'smart:border-gray-200');
      expect(add.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should remove the item when its remove button is clicked', () => {
      const control = new SmartFormArray([
        createItemControl('a'),
        createItemControl('b'),
      ]);
      renderArray(SmartInputArrayPreset, buildOptions(control));

      fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[0]);

      expect(control.length).toBe(1);
      expect(control.value).toEqual([{ name: 'b' }]);
      expect(screen.getAllByTestId('stub-form')).toHaveLength(1);
    });

    it('should mark the array as dirty when an item is removed', () => {
      const control = new SmartFormArray([createItemControl('a')]);
      renderArray(SmartInputArrayPreset, buildOptions(control));

      fireEvent.click(screen.getByRole('button', { name: 'remove' }));

      expect(control.dirty).toBe(true);
    });

    it('should hide the remove symbol from assistive technologies', () => {
      renderArray(
        SmartInputArrayPreset,
        buildOptions(new SmartFormArray([createItemControl('a')])),
      );

      expect(
        screen.getByRole('button', { name: 'remove' }).firstChild,
      ).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render an empty state when the array has no items', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(new SmartFormArray([])),
      );

      expect(container.querySelector('[data-role="empty"]')).toHaveTextContent(
        '\u2014',
      );
      expect(container.querySelectorAll('[data-role="item"]')).toHaveLength(0);
    });

    it('should hide the add and remove buttons when possibilities are static', () => {
      const { container } = renderArray(
        SmartInputArrayPreset,
        buildOptions(new SmartFormArray([createItemControl('a')])),
        {
          type: FieldType.array,
          classType: ArrayChildModel,
          possibilities: { static: true },
        },
      );

      expect(container.querySelector('[data-role="add"]')).toBeNull();
      expect(container.querySelector('[data-role="remove"]')).toBeNull();
    });
  });

  describe.each([
    ['standard', SmartInputArray],
    ['preset', SmartInputArrayPreset],
  ])('%s: reordering', (_name, Component) => {
    /** The element that carries the drag handlers of every item. */
    function getItems(): HTMLElement[] {
      return screen
        .getAllByTestId('stub-form')
        .map((el) => el.closest('[draggable]') as HTMLElement);
    }

    function drag(from: HTMLElement, to: HTMLElement): void {
      fireEvent.dragStart(from);
      fireEvent.dragOver(to);
      fireEvent.drop(to);
      fireEvent.dragEnd(from);
    }

    it('should make every item draggable', () => {
      renderArray(
        Component,
        buildOptions(
          new SmartFormArray([createItemControl('a'), createItemControl('b')]),
        ),
      );

      expect(getItems().map((el) => el.getAttribute('draggable'))).toEqual([
        'true',
        'true',
      ]);
    });

    it('should move the dragged item to the place it is dropped on', () => {
      const control = new SmartFormArray([
        createItemControl('a'),
        createItemControl('b'),
        createItemControl('c'),
      ]);
      renderArray(Component, buildOptions(control));
      const [first, , third] = getItems();

      drag(first, third);

      expect(control.value).toEqual([
        { name: 'b' },
        { name: 'c' },
        { name: 'a' },
      ]);
      expect(
        screen.getAllByTestId('stub-form').map((el) => el.textContent),
      ).toEqual(['b', 'c', 'a']);
    });

    it('should mark the array as dirty when an item is moved', () => {
      const control = new SmartFormArray([
        createItemControl('a'),
        createItemControl('b'),
      ]);
      renderArray(Component, buildOptions(control));
      const [first, second] = getItems();

      drag(second, first);

      expect(control.dirty).toBe(true);
    });

    it('should leave the array alone when an item is dropped on itself', () => {
      const control = new SmartFormArray([
        createItemControl('a'),
        createItemControl('b'),
      ]);
      renderArray(Component, buildOptions(control));
      const [first] = getItems();

      drag(first, first);

      expect(control.value).toEqual([{ name: 'a' }, { name: 'b' }]);
      expect(control.dirty).toBe(false);
    });

    it('should ignore a drop that did not start on an item', () => {
      const control = new SmartFormArray([
        createItemControl('a'),
        createItemControl('b'),
      ]);
      renderArray(Component, buildOptions(control));
      const [, second] = getItems();

      fireEvent.drop(second);

      expect(control.value).toEqual([{ name: 'a' }, { name: 'b' }]);
    });

    it('should not make the items draggable when possibilities are static', () => {
      renderArray(
        Component,
        buildOptions(new SmartFormArray([createItemControl('a')])),
        {
          type: FieldType.array,
          classType: ArrayChildModel,
          possibilities: { static: true },
        },
      );

      expect(document.querySelector('[draggable="true"]')).toBeNull();
    });

    it('should mark the array as dirty on any later value change', () => {
      const control = new SmartFormArray([createItemControl('a')]);
      renderArray(Component, buildOptions(control));

      act(() => control.at(0).setValue({ name: 'x' }));

      expect(control.dirty).toBe(true);
    });
  });
});

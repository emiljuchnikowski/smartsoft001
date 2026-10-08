import { act, render, waitFor } from '@testing-library/react';

import { FieldType, IModelFilter } from '@smartsoft001/models';
import {
  IModelPossibilitiesProvider,
  SmartFormControl,
  SmartProvider,
  SmartProviderProps,
} from '@smartsoft001/react';

import { useCrudFilter, useCrudFilterControl } from './use-crud-filter';
import { useCrudFacade } from '../../../crud.context';
import { CrudProvider } from '../../../crud.provider';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';
import { CrudFacade } from '../../../state/crud.facade';
import { SmartCrudFilterProps } from '../filter.types';

class TodoModel {
  name?: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-base',
  type: TodoModel,
};

type CrudFilterApi = ReturnType<typeof useCrudFilter>;

interface ProbeResult {
  api: CrudFilterApi | null;
  facade: CrudFacade<any> | null;
  control: SmartFormControl | null;
}

function setup(
  props: SmartCrudFilterProps,
  options: {
    smart?: Omit<SmartProviderProps, 'children'>;
    controlType?: string | null;
  } = {},
) {
  const result: ProbeResult = { api: null, facade: null, control: null };
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  } as unknown as CrudService<any>;

  function Probe(probeProps: SmartCrudFilterProps) {
    result.api = useCrudFilter(probeProps);
    result.facade = useCrudFacade();
    return null;
  }

  function ControlProbe(probeProps: SmartCrudFilterProps) {
    result.api = useCrudFilter(probeProps);
    result.facade = useCrudFacade();
    result.control = useCrudFilterControl(
      result.api,
      options.controlType ?? null,
    );
    return null;
  }

  const Host = options.controlType === undefined ? Probe : ControlProbe;
  const ui = (hostProps: SmartCrudFilterProps) => (
    <SmartProvider {...options.smart}>
      <CrudProvider config={config} service={service}>
        <Host {...hostProps} />
      </CrudProvider>
    </SmartProvider>
  );
  const view = render(ui(props));

  return {
    result,
    rerender: (next: SmartCrudFilterProps) => view.rerender(ui(next)),
    /** Spies on `facade.read` of the feature the probe is rendered in. */
    spyOnRead: () => {
      if (!result.facade) throw new Error('The probe has not rendered');

      return jest.spyOn(result.facade, 'read');
    },
  };
}

function possibilitiesOf(
  value: unknown,
): IModelFilter['possibilities'] & object {
  return value as IModelFilter['possibilities'] & object;
}

describe('@smartsoft001/crud-shell-react: useCrudFilter', () => {
  describe('hasValue', () => {
    it('should be true when the filter has a matching entry with a value', () => {
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '=', value: 'abc' }],
      };

      const { result } = setup({ item: { key: 'name', type: '=' }, filter });

      expect(result.api?.hasValue).toBe(true);
    });

    it('should be false when no matching query entry exists', () => {
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '>=', value: 'abc' }],
      };

      const { result } = setup({ item: { key: 'name', type: '=' }, filter });

      expect(result.api?.hasValue).toBe(false);
    });

    it('should be false when the matching entry has an empty value', () => {
      const filter: ICrudFilter = {
        query: [{ key: 'name', type: '=', value: '' }],
      };

      const { result } = setup({ item: { key: 'name', type: '=' }, filter });

      expect(result.api?.hasValue).toBe(false);
    });
  });

  describe('hasMinValue / hasMaxValue', () => {
    it('should report the ">=" and "<=" entries of the item', () => {
      const filter: ICrudFilter = {
        query: [{ key: 'age', type: '>=', value: 0 }],
      };

      const { result } = setup({ item: { key: 'age', type: '=' }, filter });

      expect([result.api?.hasMinValue, result.api?.hasMaxValue]).toEqual([
        true,
        false,
      ]);
    });
  });

  describe('value / minValue / maxValue', () => {
    it('should read the value of the item type and of the range ends', () => {
      const filter: ICrudFilter = {
        query: [
          { key: 'age', type: '=', value: 5 },
          { key: 'age', type: '>=', value: 1 },
          { key: 'age', type: '<=', value: 9 },
        ],
      };

      const { result } = setup({ item: { key: 'age', type: '=' }, filter });

      expect([
        result.api?.value,
        result.api?.minValue,
        result.api?.maxValue,
      ]).toEqual([5, 1, 9]);
    });

    it('should be null without a filter query', () => {
      const { result } = setup({ item: { key: 'age', type: '=' }, filter: {} });

      expect([
        result.api?.value,
        result.api?.minValue,
        result.api?.maxValue,
      ]).toEqual([null, null, null]);
    });

    it('should be undefined when the query has no matching entry', () => {
      const { result } = setup({
        item: { key: 'age', type: '=' },
        filter: { query: [] },
      });

      expect(result.api?.value).toBeUndefined();
    });

    it('should read every matching value as a list for a check filter', () => {
      const filter: ICrudFilter = {
        query: [
          { key: 'tags', type: '=', value: 'a' },
          { key: 'other', type: '=', value: 'x' },
          { key: 'tags', type: '=', value: 'b' },
        ],
      };

      const { result } = setup({
        item: { key: 'tags', type: '=', fieldType: FieldType.check },
        filter,
      });

      expect(result.api?.value).toEqual(['a', 'b']);
    });
  });

  describe('refresh', () => {
    const title = { key: 'title', type: '=' as const, label: 'Title' };

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    function frozenFilter(
      ...query: ICrudFilter['query'] & object
    ): ICrudFilter {
      return Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze(query.map((q) => Object.freeze(q))),
      }) as unknown as ICrudFilter;
    }

    it('should not read before 500 ms passed', () => {
      const { result, spyOnRead } = setup({
        item: title,
        filter: { query: [] },
      });
      const read = spyOnRead();

      act(() => result.api?.refresh('Signals'));
      act(() => jest.advanceTimersByTime(499));

      expect(read).not.toHaveBeenCalled();
    });

    it('should add the entry with its label and go back to the first page on a frozen filter', () => {
      const filter = frozenFilter({ key: 'other', type: '=', value: 'x' });
      const { result, spyOnRead } = setup({ item: title, filter });
      const read = spyOnRead();

      act(() => result.api?.refresh('Signals'));
      act(() => jest.advanceTimersByTime(500));

      expect(read).toHaveBeenCalledWith({
        limit: 25,
        offset: 0,
        query: [
          { key: 'other', type: '=', value: 'x' },
          { key: 'title', type: '=', value: 'Signals', label: 'Title' },
        ],
      });
    });

    it('should only apply the last value refreshed within 500 ms', () => {
      const { result, spyOnRead } = setup({
        item: title,
        filter: { query: [] },
      });
      const read = spyOnRead();

      act(() => result.api?.refresh('Sig'));
      act(() => jest.advanceTimersByTime(300));
      act(() => result.api?.refresh('Signals'));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls).toEqual([
        [
          {
            offset: 0,
            query: [
              { key: 'title', type: '=', value: 'Signals', label: 'Title' },
            ],
          },
        ],
      ]);
    });

    it('should update an existing entry of the slot', () => {
      const filter: ICrudFilter = {
        query: [{ key: 'title', type: '=', value: 'old' }],
      };
      const { result, spyOnRead } = setup({ item: title, filter });
      const read = spyOnRead();

      act(() => result.api?.refresh('new'));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([
        { key: 'title', type: '=', value: 'new', label: 'Title' },
      ]);
    });

    it('should write to the given range slot', () => {
      const { result, spyOnRead } = setup({ item: title, filter: {} });
      const read = spyOnRead();

      act(() => result.api?.refresh(3, '>='));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([
        { key: 'title', type: '>=', value: 3, label: 'Title' },
      ]);
    });

    it('should remove the entry for an empty value on a frozen filter', () => {
      const filter = frozenFilter(
        { key: 'other', type: '=', value: 'x' },
        { key: 'title', type: '=', value: 'Signals', label: 'Title' },
      );
      const { result, spyOnRead } = setup({ item: title, filter });
      const read = spyOnRead();

      act(() => result.api?.refresh(null));
      act(() => jest.advanceTimersByTime(500));

      expect(read).toHaveBeenCalledWith({
        limit: 25,
        offset: 0,
        query: [{ key: 'other', type: '=', value: 'x' }],
      });
    });

    it('should replace every entry of a check filter with the given values', () => {
      const filter = frozenFilter({ key: 'tags', type: '=', value: 'old' });
      const { result, spyOnRead } = setup({
        item: { key: 'tags', type: '=', fieldType: FieldType.check },
        filter,
      });
      const read = spyOnRead();

      act(() => result.api?.refresh(['a', 'b']));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([
        { key: 'tags', type: '=', value: 'a' },
        { key: 'tags', type: '=', value: 'b' },
      ]);
    });

    it('should remove every entry of a check filter for an empty list', () => {
      const filter: ICrudFilter = {
        query: [
          { key: 'tags', type: '=', value: 'a' },
          { key: 'tags', type: '=', value: 'b' },
        ],
      };
      const { result, spyOnRead } = setup({
        item: { key: 'tags', type: '=', fieldType: FieldType.check },
        filter,
      });
      const read = spyOnRead();

      act(() => result.api?.refresh([]));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([]);
    });

    it('should not change the filter it was given', () => {
      const filter: ICrudFilter = {
        offset: 10,
        query: [{ key: 'title', type: '=', value: 'old' }],
      };
      const { result } = setup({ item: title, filter });

      act(() => result.api?.refresh('new'));
      act(() => jest.advanceTimersByTime(500));

      expect(filter).toEqual({
        offset: 10,
        query: [{ key: 'title', type: '=', value: 'old' }],
      });
    });

    it('should not read without a filter', () => {
      const { result, spyOnRead } = setup({ item: title });
      const read = spyOnRead();

      act(() => result.api?.refresh('Signals'));
      act(() => jest.advanceTimersByTime(500));

      expect(read).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove every entry of the item at once on a frozen filter', () => {
      const filter = Object.freeze({
        limit: 25,
        offset: 25,
        query: Object.freeze([
          Object.freeze({ key: 'other', type: '=', value: 'x' }),
          Object.freeze({ key: 'age', type: '>=', value: 1 }),
          Object.freeze({ key: 'age', type: '<=', value: 9 }),
        ]),
      }) as unknown as ICrudFilter;
      const { result, spyOnRead } = setup({
        item: { key: 'age', type: '=' },
        filter,
      });
      const read = spyOnRead();

      act(() => result.api?.clear());

      expect(read).toHaveBeenCalledWith({
        limit: 25,
        offset: 0,
        query: [{ key: 'other', type: '=', value: 'x' }],
      });
    });

    it('should not read when the filter has no query', () => {
      const { result, spyOnRead } = setup({
        item: { key: 'age', type: '=' },
        filter: {},
      });
      const read = spyOnRead();

      act(() => result.api?.clear());

      expect(read).not.toHaveBeenCalled();
    });
  });

  describe('pending working copy', () => {
    const title = { key: 'title', type: '=' as const };

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should read the values from the filter it pushed while the prop is unchanged', () => {
      const { result } = setup({ item: title, filter: { query: [] } });

      act(() => result.api?.refresh('abc'));
      act(() => jest.advanceTimersByTime(500));

      expect([result.api?.value, result.api?.hasValue]).toEqual(['abc', true]);
    });

    it('should read the new filter prop once the store update arrives', () => {
      const { result, rerender } = setup({
        item: title,
        filter: { query: [] },
      });
      act(() => result.api?.refresh('abc'));
      act(() => jest.advanceTimersByTime(500));

      rerender({
        item: title,
        filter: { query: [{ key: 'title', type: '=', value: 'from store' }] },
      });

      expect(result.api?.value).toBe('from store');
    });

    it('should build the next refresh on the pushed filter', () => {
      const age = { key: 'age', type: '=' as const };
      const { result, spyOnRead } = setup({ item: age, filter: { query: [] } });
      const read = spyOnRead();
      act(() => result.api?.setMinValue(1));
      act(() => jest.advanceTimersByTime(500));

      act(() => result.api?.setMaxValue(9));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[1][0]?.query).toEqual([
        { key: 'age', type: '>=', value: 1, label: undefined },
        { key: 'age', type: '<=', value: 9, label: undefined },
      ]);
    });

    it('should set the value of the item type', () => {
      const { result, spyOnRead } = setup({
        item: title,
        filter: { query: [] },
      });
      const read = spyOnRead();

      act(() => result.api?.setValue('abc'));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([
        { key: 'title', type: '=', value: 'abc', label: undefined },
      ]);
    });
  });

  describe('possibilities', () => {
    const list = [{ id: 99, text: 'fromItem' }];

    it('should read the item possibilities signal', () => {
      const { result } = setup({
        item: {
          key: 'name',
          type: '=',
          possibilities: possibilitiesOf(() => list),
        },
      });

      expect(result.api?.possibilities).toEqual(list);
    });

    it('should take the item possibilities given as a list', () => {
      const { result } = setup({
        item: { key: 'name', type: '=', possibilities: possibilitiesOf(list) },
      });

      expect(result.api?.possibilities).toEqual(list);
    });

    it('should be undefined without possibilities', () => {
      const { result } = setup({ item: { key: 'name', type: '=' } });

      expect(result.api?.possibilities).toBeUndefined();
    });

    it('should override the item possibilities with the provider ones for the key', async () => {
      const provider = {
        get: jest.fn(() => [{ id: 1, text: 'x', checked: false }]),
      } as unknown as IModelPossibilitiesProvider;

      const { result } = setup(
        {
          item: {
            key: 'name',
            type: '=',
            possibilities: possibilitiesOf(() => list),
          },
        },
        { smart: { modelPossibilitiesProvider: provider } },
      );

      await waitFor(() =>
        expect(result.api?.possibilities).toEqual([
          { id: 1, text: 'x', checked: false },
        ]),
      );
    });

    it('should ask the provider with the model type, the item key and a model instance', async () => {
      const get = jest.fn(async () => null);
      const provider = { get } as unknown as IModelPossibilitiesProvider;

      setup(
        { item: { key: 'name', type: '=' } },
        { smart: { modelPossibilitiesProvider: provider } },
      );

      await waitFor(() =>
        expect(get).toHaveBeenCalledWith({
          type: TodoModel,
          key: 'name',
          instance: expect.any(TodoModel),
        }),
      );
    });

    it('should keep the item possibilities when the provider has none for the key', async () => {
      const get = jest.fn(async () => null);
      const provider = { get } as unknown as IModelPossibilitiesProvider;

      const { result } = setup(
        {
          item: {
            key: 'name',
            type: '=',
            possibilities: possibilitiesOf(() => list),
          },
        },
        { smart: { modelPossibilitiesProvider: provider } },
      );
      await waitFor(() => expect(get).toHaveBeenCalled());
      await act(async () => undefined);

      expect(result.api?.possibilities).toEqual(list);
    });
  });

  describe('buildInputOptions', () => {
    it('should carry the control, the item key and a model instance', () => {
      const { result } = setup({ item: { key: 'name', type: '=' } });
      const control = new SmartFormControl(null);

      const options = result.api?.buildInputOptions(control);

      expect(options).toEqual({
        treeLevel: 0,
        control,
        model: expect.any(TodoModel),
        fieldKey: 'name',
      });
    });

    it('should map the possibilities to unchecked options when asked to', () => {
      const { result } = setup({
        item: {
          key: 'status',
          type: '=',
          possibilities: possibilitiesOf(() => [
            { id: 1, text: 'a' },
            { id: 2, text: 'b' },
          ]),
        },
      });

      const options = result.api?.buildInputOptions(
        new SmartFormControl(null),
        true,
      );

      expect(options?.possibilities).toEqual([
        { id: 1, text: 'a', checked: false },
        { id: 2, text: 'b', checked: false },
      ]);
    });
  });

  describe('useCrudFilterControl', () => {
    const age = { key: 'age', type: '=' as const };
    const filter: ICrudFilter = {
      query: [
        { key: 'age', type: '=', value: 5 },
        { key: 'age', type: '>=', value: 1 },
        { key: 'age', type: '<=', value: 9 },
      ],
    };

    afterEach(() => jest.useRealTimers());

    it.each([
      [null, 5],
      ['>=', 1],
      ['<=', 9],
    ])(
      'should seed the %s control with the current value of its slot',
      (type, expected) => {
        const { result } = setup({ item: age, filter }, { controlType: type });

        expect(result.control?.value).toBe(expected);
      },
    );

    it('should refresh its slot when the control value changes', () => {
      jest.useFakeTimers();
      const { result, spyOnRead } = setup(
        { item: age, filter: { query: [] } },
        { controlType: '<=' },
      );
      const read = spyOnRead();

      act(() => result.control?.setValue(42));
      act(() => jest.advanceTimersByTime(500));

      expect(read.mock.calls[0][0]?.query).toEqual([
        { key: 'age', type: '<=', value: 42, label: undefined },
      ]);
    });
  });
});

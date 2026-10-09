import { useCallback, useEffect, useRef } from 'react';
import type { DragEvent } from 'react';

import {
  getModelFieldOptions,
  getModelOptions,
  IFieldOptions,
  IModelOptions,
} from '@smartsoft001/models';
import { ObjectService } from '@smartsoft001/utils';

import { SmartAbstractControl } from '../../../forms/abstract-control';
import { SmartFormArray } from '../../../forms/form-array';
import { IFormOptions } from '../../../models';
import { useFormFactory } from '../../../providers/hooks';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

/** The options of the nested form of one array item. */
export type SmartInputArrayItemOptions<TChild> = IFormOptions<TChild> & {
  control: SmartAbstractControl;
  fieldOptions: IFieldOptions;
  modelOptions: IModelOptions;
};

/**
 * The options of the array field on the model, read through its first item when
 * the model is itself an array.
 */
function getArrayFieldOptions(
  model: unknown,
  fieldKey: string,
): IFieldOptions | undefined {
  if (!model) return undefined;

  const first = (model as Record<number, Record<string, unknown>>)[0];

  return first && first[fieldKey]
    ? getModelFieldOptions(first, fieldKey)
    : getModelFieldOptions(model, fieldKey);
}

/**
 * What the array field variants share:
 *
 * - `items`: the options of the nested form of every item, one tree level
 *   deeper, with a model of the field's `classType` made from the item value;
 * - `add()`: builds a new item with the form factory (for the form's mode,
 *   under the form's root) and appends it, shown;
 * - `remove(index)`: removes the item, as the preset's remove button does;
 * - `move(from, to)` and `getItemDragProps(index)`: reordering, with native
 *   drag and drop;
 * - `isStatic`: `possibilities.static`, no add / remove / reordering.
 *
 * Every change of the array's value marks it as dirty.
 */
export function useInputArray<T, TChild = unknown>(
  props: SmartInputFieldProps<T>,
) {
  const input = useInput(props);
  const { control, treeLevel, mode, model, fieldKey, fieldOptions } = input;
  const array = control as SmartFormArray | null;
  const factory = useFormFactory();
  const isStatic = !!fieldOptions?.possibilities?.static;

  // The item models are made once per control, from its value at the time; the
  // items added here are shown.
  const models = useRef(new WeakMap<SmartAbstractControl, TChild>());
  const shown = useRef(new WeakSet<SmartAbstractControl>());
  // A stable React key per item control.
  const keys = useRef({
    next: 0,
    ids: new WeakMap<SmartAbstractControl, number>(),
  });
  // The index of the item being dragged, while a drag started on this array.
  const dragged = useRef<number | null>(null);

  const arrayOptions = getArrayFieldOptions(model, fieldKey);
  const classType = arrayOptions?.classType;
  const modelOptions = classType ? getModelOptions(classType) : undefined;

  const items: SmartInputArrayItemOptions<TChild>[] = (
    array?.controls ?? []
  ).map((item) => {
    if (!models.current.has(item)) {
      models.current.set(
        item,
        classType
          ? ObjectService.createByType<TChild>(item.value, classType)
          : (item.value as TChild),
      );
    }

    return {
      treeLevel: treeLevel + 1,
      mode,
      control: item,
      model: models.current.get(item) as TChild,
      fieldOptions: arrayOptions as IFieldOptions,
      modelOptions: modelOptions as IModelOptions,
      show: shown.current.has(item),
    };
  });

  const getItemKey = useCallback((item: SmartAbstractControl) => {
    const { ids } = keys.current;

    if (!ids.has(item)) ids.set(item, keys.current.next++);

    return ids.get(item) as number;
  }, []);

  const add = useCallback(async () => {
    if (!array) return;

    const ItemType = fieldOptions?.classType;
    const item = await factory.create<IFieldOptions>(new ItemType(), {
      mode,
      root: array.root,
    });

    shown.current.add(item);
    array.push(item);
    array.markAsDirty();
  }, [array, factory, fieldOptions, mode]);

  const remove = useCallback(
    (index: number) => {
      if (!array) return;

      array.removeAt(index);
      // The remaining item models are made anew.
      models.current = new WeakMap();
      shown.current = new WeakSet();
      array.markAsDirty();
      array.setValue(array.controls.map((item) => item.value));
    },
    [array],
  );

  const move = useCallback(
    (from: number, to: number) => {
      if (!array) return;

      array.markAsDirty();
      array.move(from, to);
    },
    [array],
  );

  useEffect(() => {
    if (!array) return undefined;

    const subscription = array.valueChanges.subscribe(() =>
      array.markAsDirty(),
    );

    return () => subscription.unsubscribe();
  }, [array]);

  /**
   * The native drag and drop props of the item at `index`: an item dropped on
   * another one of the same array moves to its place.
   */
  const getItemDragProps = useCallback(
    (index: number) => {
      if (isStatic) return {};

      return {
        draggable: true,
        onDragStart: (event: DragEvent<HTMLElement>) => {
          // A nested array's item must not start a drag of the outer one.
          event.stopPropagation();
          dragged.current = index;
          event.dataTransfer?.setData('text/plain', String(index));
          if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        },
        onDragOver: (event: DragEvent<HTMLElement>) => {
          if (dragged.current === null) return;

          event.preventDefault();
          event.stopPropagation();
        },
        onDrop: (event: DragEvent<HTMLElement>) => {
          const from = dragged.current;

          if (from === null) return;

          event.preventDefault();
          event.stopPropagation();
          dragged.current = null;

          if (from !== index) move(from, index);
        },
        onDragEnd: () => {
          dragged.current = null;
        },
      };
    },
    [isStatic, move],
  );

  return {
    ...input,
    array,
    items,
    add,
    remove,
    move,
    getItemKey,
    getItemDragProps,
    isStatic,
  };
}

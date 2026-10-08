import { useCallback, useMemo, useState } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldEditMetadata,
} from '@smartsoft001/models';
import { IButtonOptions, useMenuService } from '@smartsoft001/react';

import { useCrudConfig, useCrudFacade } from '../../crud.context';
import { useCrudState } from '../../hooks';

interface PartialChange<T> {
  list: Array<T>;
  changes: Partial<T>;
}

/**
 * The behaviour of the multi-selection panel: `list` is the selection, `item`
 * a model of `config.type` holding the values the selected items share in
 * the fields with `update.multi` (`showForm` when there is such a field). The form
 * reports its changes with `onPartialChange(changes, list)` and its validity
 * with `onValidChange`; `buttonOptions` (with confirmation) apply the changes
 * to every selected item and close the end menu. `lock` is set again
 * whenever the selection changes, until the form reports.
 */
export function useCrudMultiselect<T extends IEntity<string>>() {
  const facade = useCrudFacade<T>();
  const config = useCrudConfig<T>();
  const menuService = useMenuService();
  const multiSelected = useCrudState<T, T[] | undefined>(
    (state) => state.multiSelected,
  );
  const list = useMemo(() => multiSelected || [], [multiSelected]);
  const [partial, setPartial] = useState<PartialChange<T> | null>(null);
  const [valid, setValid] = useState<boolean>(false);

  const { item, showForm } = useMemo(() => {
    const model = new config.type();

    const fieldsWithOptions = getModelFieldsWithOptions(model)?.filter(
      (f) => (f.options.update as IFieldEditMetadata)?.multi,
    );

    fieldsWithOptions.forEach(({ key }) => {
      const uniques = Array.from(
        new Set(list.map((i) => (i as Record<string, unknown>)[key])),
      );

      if (uniques.length === 1) {
        model[key] = uniques[0];
      }
    });

    return { item: model as T, showForm: !!fieldsWithOptions.length };
  }, [list, config.type]);

  const lock = partial?.list !== list;

  const buttonOptions: IButtonOptions = {
    click: async () => {
      const result = (partial?.list ?? []).map(
        (i): Partial<T> & { id: string } => ({
          ...(partial?.changes as Partial<T>),
          id: i.id,
        }),
      );

      facade.updatePartialMany(result);
      await menuService.closeEnd();
    },
    confirm: true,
  };

  const onClose = useCallback(async (): Promise<void> => {
    await menuService.closeEnd();
  }, [menuService]);

  const onPartialChange = useCallback(
    (changes: Partial<T>, current: Array<T>) => {
      setPartial({ list: current, changes });
    },
    [],
  );

  const onValidChange = useCallback((value: boolean) => {
    setValid(value);
  }, []);

  return {
    config,
    list,
    item,
    showForm,
    lock,
    valid,
    buttonOptions,
    onClose,
    onPartialChange,
    onValidChange,
  };
}

import { useEffect, useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IFormOptions, useModelForm } from '@smartsoft001/react';

import { SmartCrudItemPageBodyProps } from './item-page.types';
import { useCrudConfig, useCrudFacade } from '../../crud.context';
import { getCrudFormOptions } from '../../factories/form-options';
import { useCrudState } from '../../hooks';

/**
 * What every item page body shares: `config`, `facade`, the `selected` item
 * and, outside the details mode, the form of the item: `formOptions` (built
 * from `selected`, `mode`, `config.type`, `uniqueProvider` and
 * `config.inputComponents`, with the built form as `control`) and `form`,
 * which is put in `formRef` for the page to validate. Render
 * `<SmartForm options={formOptions}>` once both exist.
 *
 * A new form is built when the selected item, the mode or the provider
 * change; while creating, the selected item is ignored.
 */
export function useCrudItemPageBase<T extends IEntity<string>>({
  mode,
  uniqueProvider,
  formRef,
}: SmartCrudItemPageBodyProps<T>) {
  const config = useCrudConfig<T>();
  const facade = useCrudFacade<T>();
  const selected = useCrudState<T, T | null | undefined>(
    (state) => state.selected,
  );

  const item = mode === 'create' ? null : selected;
  const type = config?.type;
  const inputComponents = config.inputComponents;

  const options = useMemo(
    () =>
      mode && mode !== 'details'
        ? getCrudFormOptions<T>(
            item,
            mode,
            type,
            uniqueProvider,
            inputComponents,
          )
        : null,
    [item, mode, type, uniqueProvider, inputComponents],
  );

  const form = useModelForm(options?.model, {
    mode: options?.mode,
    uniqueProvider: options?.uniqueProvider as
      ((values: Record<string, any>) => Promise<boolean>) | undefined,
  });

  useEffect(() => {
    if (!formRef) return undefined;

    formRef.current = form;

    return () => {
      if (formRef.current === form) formRef.current = null;
    };
  }, [form, formRef]);

  const formOptions = useMemo<IFormOptions<T> | null>(
    () => (options && form ? { ...options, control: form } : null),
    [options, form],
  );

  return { config, facade, selected, formOptions, form };
}

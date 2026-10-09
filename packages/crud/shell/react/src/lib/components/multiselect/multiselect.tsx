import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { SmartButton, SmartForm, useTranslate } from '@smartsoft001/react';

import { useCrudMultiselect } from './use-crud-multiselect';
import { getCrudFormOptions } from '../../factories/form-options';

/**
 * The panel of the items selected in the list, opened in the end menu. A
 * header with the count and a close button, the `config.list.components.multi`
 * component with the selected `items`, and the `multiUpdate` form of the
 * model with the button applying it to every selected item. Render it inside
 * `<CrudProvider>`.
 */
export function SmartCrudMultiselect<T extends IEntity<string>>() {
  const t = useTranslate();
  const {
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
  } = useCrudMultiselect<T>();

  const Multi = config?.list?.components?.multi;

  // The `multiUpdate` form options of the shared values.
  const formOptions = useMemo(
    () => getCrudFormOptions(item, 'multiUpdate', config.type),
    [item, config.type],
  );

  return (
    <>
      <header className="smart:flex smart:items-center smart:justify-between smart:border-b smart:border-gray-200 smart:px-4 smart:py-3">
        <h2 className="smart:text-lg smart:font-semibold smart:text-gray-900">
          {t('selected')}: {list.length}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="smart:rounded smart:p-1 smart:text-gray-500 smart:hover:bg-gray-100"
        >
          ✕
        </button>
      </header>

      {Multi && (
        <div>
          <Multi items={list} />
        </div>
      )}

      {showForm && item && formOptions && (
        <div>
          <SmartForm
            options={formOptions}
            onValuePartialChange={(changes) => onPartialChange(changes, list)}
            onValidChange={onValidChange}
          />

          <SmartButton
            className="smart:float-right"
            disabled={lock || !valid}
            options={buttonOptions}
          >
            {t('change')}
          </SmartButton>
        </div>
      )}
    </>
  );
}

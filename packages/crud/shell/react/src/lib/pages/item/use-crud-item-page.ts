import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { getModelOptions } from '@smartsoft001/models';
import {
  ICellPipe,
  IDetailsOptions,
  IIconButtonOptions,
  IPageOptions,
  SmartAbstractControl,
  SmartFormArray,
  SmartFormControl,
  SmartFormGroup,
  SmartTranslateFn,
  useDetailsService,
  useNavigation,
  useToastService,
  useTranslate,
} from '@smartsoft001/react';
import { SpecificationService } from '@smartsoft001/utils';

import { SmartCrudItemPageProps } from './item-page.types';
import { CrudComponentSlots, CrudFullConfig } from '../../crud.config';
import { useCrudFacade, useCrudService } from '../../crud.context';
import { useCrudState } from '../../hooks';
import { ICrudFilter, ICrudFilterQueryItem } from '../../models';
import { useCrudPageConfig } from '../use-crud-page-config';

/** The `components` of an object `config.add` / `config.edit` / `config.details`. */
function getSlots(
  value: CrudFullConfig<any>['add' | 'edit' | 'details'],
): CrudComponentSlots | undefined {
  return value && typeof value === 'object' && 'components' in value
    ? value.components
    : undefined;
}

/** The first paragraph of an HTML text (`<p>a</p><p>b</p>` → `a`). */
function removeParagraph(val: string): string {
  if (!val || val.indexOf('<p>') !== 0) return val;

  if (typeof document === 'undefined') {
    return /^<p>([\s\S]*?)<\/p>/.exec(val)?.[1] ?? val;
  }

  const div = document.createElement('div');
  div.innerHTML = val;

  return div.querySelectorAll('p').item(0).innerHTML;
}

/** Whether the `edit` query param of `url` is set (`?edit=1`). */
function hasEditParam(url: string): boolean {
  const query = url.split('?')[1]?.split('#')[0] ?? '';

  return !!new URLSearchParams(query).get('edit');
}

/**
 * Collects the labels of the invalid controls under `control`: nested groups
 * as `parent > child`, array entries as `field(1)`, a `customMessage` error
 * in brackets.
 */
function getInvalidFields(
  control: SmartAbstractControl,
  invalidFields: string[],
  baseField: string,
  t: SmartTranslateFn,
  key: string | null = null,
): void {
  if (control.valid) return;

  const field = key ? baseField + ' > ' + t('MODEL.' + key) : baseField;

  if (control.errors?.['customMessage']) {
    invalidFields.push(field + ` (${control.errors['customMessage']})`);
    return;
  }

  if (control instanceof SmartFormControl) {
    invalidFields.push(field);
  }

  if (control instanceof SmartFormGroup) {
    Object.keys(control.controls).forEach((groupKey) => {
      getInvalidFields(
        control.controls[groupKey],
        invalidFields,
        field,
        t,
        groupKey,
      );
    });
  }

  if (control instanceof SmartFormArray) {
    control.controls.forEach((c, index) => {
      getInvalidFields(c, invalidFields, field + `(${index + 1})`, t);
    });
  }
}

/**
 * The logic of the item page, for `SmartCrudItemPage` or a page of your own
 * around the same feature:
 *
 * - `mode`: `'create'` without an `id`; with one `'details'` when
 *   `config.details` is set, else `'update'`; the `edit` query param (or the
 *   edit button) switches to `'update'`; the item of `id` is selected
 *   through the facade;
 * - `pageOptions`: the title (`add`, `<titleKey> - change`,
 *   `<titleKey> - details`), the back button, no menu button, `variant`, and
 *   the buttons of the mode: add (create), cancel + save (update), edit
 *   (details, with `config.edit` and the model's `update.enabled`). Add and
 *   save validate the form of the body first (`formRef`) and report the
 *   invalid fields in a toast; add creates the form value, save sends the
 *   changed values with the id (`updatePartial`). Afterwards the page leaves
 *   for `basePath` (back in the history without it), or shows the details
 *   again when there are details;
 * - `detailsOptions` (with `config.details`), `uniqueProvider` (asks the
 *   service whether another item has the values), the body callbacks and
 *   `formRef`;
 * - `TopComponent` / `BottomComponent`: the `components` of `config.add`
 *   while creating, of `config.edit` while updating.
 *
 * Switching between creating and an id needs a new page (a `key`): the mode
 * is set once, when the page is created.
 */
export function useCrudItemPage<T extends IEntity<string>>({
  id,
  basePath,
}: SmartCrudItemPageProps = {}) {
  const config = useCrudPageConfig<T>();
  const facade = useCrudFacade<T>();
  const service = useCrudService<T>();
  const navigation = useNavigation();
  const toastService = useToastService();
  const detailsService = useDetailsService();
  const t = useTranslate();

  const selected = useCrudState<T, T | null | undefined>(
    (state) => state.selected,
  );
  const create = id === undefined;

  const [mode, setMode] = useState<string>(() =>
    create ? 'create' : config.details ? 'details' : 'update',
  );

  // Before the body renders: the details set the root while rendering.
  useState(() => detailsService.init());

  const formRef = useRef<SmartFormGroup | null>(null);
  const formValue = useRef<T | undefined>(undefined);
  const formPartialValue = useRef<Partial<T> | undefined>(undefined);
  // The last reported validity; the buttons validate the form itself.
  const formValid = useRef(false);
  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  });

  useEffect(() => {
    if (id !== undefined) facade.select(id);
  }, [facade, id]);

  useEffect(() => {
    if (create) return undefined;

    const check = (url: string) => {
      if (hasEditParam(url)) setMode('update');
    };

    check(navigation.getCurrentUrl());

    return navigation.subscribe(check);
  }, [create, navigation]);

  // One provider for the page's lifetime: it is part of the form options,
  // and a new one would build the form again.
  const uniqueProvider = useCallback(
    async (values: Record<keyof T, any>): Promise<boolean> => {
      const query: ICrudFilterQueryItem[] = [];
      const filter: ICrudFilter = { query };

      Object.keys(values).forEach((key) => {
        query.push({
          key: key,
          value: (values as any)[key],
          type: '=',
        });
      });

      if (idRef.current) {
        query.push({ key: 'id', value: idRef.current, type: '!=' });
      }

      const { totalCount } = await service.getList(filter);

      return !totalCount;
    },
    [service],
  );

  const onPartialChange = useCallback((val: Partial<T>) => {
    formPartialValue.current = val;
  }, []);

  const onChange = useCallback((val: T) => {
    formValue.current = val;
  }, []);

  const onValidChange = useCallback((val: boolean) => {
    formValid.current = val;
  }, []);

  const checkFirstInvalid = useCallback((): boolean => {
    const form = formRef.current;

    // Nothing has been built yet, so there is nothing valid to submit.
    if (!form) return true;

    if (form.valid) return false;

    const invalidFields: string[] = [];

    getInvalidFields(form, invalidFields, '', t);

    void toastService.info({
      title: t('INPUT.ERRORS.requires'),
      message: invalidFields.slice(0, 3).join('<br/>'),
    });

    return true;
  }, [t, toastService]);

  const leave = useCallback(() => {
    if (basePath !== undefined) navigation.navigate(basePath);
    else navigation.back();
  }, [basePath, navigation]);

  const modelOptions = useMemo(() => getModelOptions(config.type), [config]);

  const endButtons = useMemo<Array<IIconButtonOptions> | undefined>(() => {
    switch (mode) {
      case 'create':
        return [
          {
            icon: 'add',
            text: 'add',
            handler: () => {
              if (checkFirstInvalid()) return;

              facade.create(formValue.current as T);
              leave();
            },
          },
        ];
      case 'update':
        return [
          ...(config.details
            ? [
                {
                  icon: 'close',
                  text: 'cancel',
                  handler: () => setMode('details'),
                  disabled: false,
                },
              ]
            : []),
          {
            icon: 'save',
            text: 'save',
            handler: () => {
              if (checkFirstInvalid()) return;

              facade.updatePartial({
                ...formPartialValue.current,
                id: id as string,
              } as Partial<T> & { id: string });

              if (config.details) setMode('details');
              else leave();
            },
          },
        ];
      case 'details':
        return config.edit &&
          (!modelOptions?.update?.enabled ||
            SpecificationService.valid(selected, modelOptions.update.enabled))
          ? [
              {
                icon: 'create',
                text: 'edit',
                handler: () => setMode('update'),
                disabled: false,
              },
            ]
          : [];
      default:
        return undefined;
    }
  }, [
    mode,
    config,
    modelOptions,
    selected,
    id,
    facade,
    checkFirstInvalid,
    leave,
  ]);

  const title = useMemo(() => {
    const titleKey = modelOptions?.titleKey;
    const prefix =
      titleKey && selected
        ? removeParagraph((selected as any)[titleKey]) + ' - '
        : '';

    switch (mode) {
      case 'create':
        return 'add';
      case 'update':
        return prefix + t('change');
      case 'details':
        return prefix + t('details');
      default:
        return undefined;
    }
  }, [mode, modelOptions, selected, t]);

  const pageOptions = useMemo<IPageOptions>(
    () => ({
      title: title || '',
      variant: config.variant,
      showBackButton: true,
      hideMenuButton: true,
      endButtons,
    }),
    [title, config, endButtons],
  );

  const detailsOptions = useMemo<IDetailsOptions<T> | undefined>(() => {
    if (!config.details) return undefined;

    const slots = getSlots(config.details);

    return {
      type: config.type,
      item: selected,
      cellPipe: (config.details as { cellPipe?: ICellPipe<T> }).cellPipe,
      componentFactories: { top: slots?.top, bottom: slots?.bottom },
    };
  }, [config, selected]);

  const slots =
    mode === 'create'
      ? getSlots(config.add)
      : mode === 'update'
        ? getSlots(config.edit)
        : undefined;
  const TopComponent: ComponentType | undefined = slots?.top;
  const BottomComponent: ComponentType | undefined = slots?.bottom;

  return {
    config,
    mode,
    pageOptions,
    detailsOptions,
    uniqueProvider,
    onPartialChange,
    onChange,
    onValidChange,
    formRef,
    TopComponent,
    BottomComponent,
  };
}

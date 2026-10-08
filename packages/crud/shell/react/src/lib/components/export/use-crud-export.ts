import { useEffect, useRef } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  IButtonOptions,
  StyleService,
  useModalService,
  useStyleService,
} from '@smartsoft001/react';

import { SmartCrudExportProps } from './export.types';
import { useCrud } from '../../crud.context';
import { useCrudState } from '../../hooks';
import { CrudStore } from '../../state/crud.store';

/**
 * Runs `callback` once the feature is loaded, now or after a later change.
 * Returns the unsubscribe function.
 */
function onceLoaded(store: CrudStore, callback: () => void): () => void {
  if (store.get().loaded) {
    callback();
    return () => undefined;
  }

  const unsubscribe = store.subscribe(() => {
    if (!store.get().loaded) return;

    unsubscribe();
    callback();
  });

  return unsubscribe;
}

/**
 * The behaviour of the export buttons: a click exports the list with the
 * current filter, without paging, in its format, and closes the overlay the
 * component is shown in once the export finished. The buttons are loading
 * while the feature is. Attach `elementRef` to the root element: it gets the
 * application style.
 */
export function useCrudExport<T extends IEntity<string>>({
  dismiss,
}: SmartCrudExportProps = {}) {
  const { facade, store } = useCrud<T>();
  const modalService = useModalService();
  const styleService = useStyleService();
  const elementRef = useRef<HTMLDivElement>(null);
  const loading = useCrudState((state) => !state.loaded);
  const dismissRef = useRef(dismiss);
  const subscriptions = useRef<Array<() => void>>([]);

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  // A local service writes the style, so the shared one is not redirected
  // to this element.
  useEffect(() => {
    new StyleService().init(elementRef.current, styleService.get());
  }, [styleService]);

  useEffect(() => {
    const current = subscriptions.current;

    return () => current.forEach((unsubscribe) => unsubscribe());
  }, []);

  // Closes the overlay the buttons are shown in.
  const close = () => {
    if (dismissRef.current) dismissRef.current();
    else void modalService.dismiss();
  };

  const initButtonExportOptions = (format: string): IButtonOptions => ({
    click: () => {
      facade.export(
        { ...facade.filter, offset: undefined, limit: undefined },
        format,
      );

      subscriptions.current.push(onceLoaded(store, close));
    },
    loading,
  });

  return {
    elementRef,
    buttonExportCsvOptions: initButtonExportOptions('csv'),
    buttonExportXlsxOptions: initButtonExportOptions('xlsx'),
  };
}

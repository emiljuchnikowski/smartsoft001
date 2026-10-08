import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IFormOptions } from '@smartsoft001/react';


/**
 * The form options of the item page (the Angular `smartFormOptions` pipe): a
 * fresh model for `create`, a model filled from `item` for any other mode.
 */
export function getCrudFormOptions<T extends IEntity<string>>(
  item: T | null | undefined,
  mode: string,
  type: any,
  uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>,
  inputComponents?: { [key: string]: ComponentType<any> },
): IFormOptions<T> | null {
  if (!mode || !type) return null;

  const model = new type();

  if (mode !== 'create' && item) {
    Object.keys(item).forEach((key) => {
      (model as any)[key] = (item as any)[key];
    });
  }

  return {
    mode,
    possibilities: {},
    inputComponents,
    uniqueProvider,
    model,
    show: true,
  };
}

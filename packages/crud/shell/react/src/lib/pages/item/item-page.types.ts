import type { ReactNode, RefObject } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IDetailsOptions, SmartFormGroup } from '@smartsoft001/react';

/** The props of `<SmartCrudItemPage>`. */
export interface SmartCrudItemPageProps {
  /**
   * The id of the item. Without it the page creates a new item.
   */
  id?: string;
  /**
   * The path of the list. After a create, or a save without details, the page
   * navigates there; without it, it goes back in the history.
   */
  basePath?: string;
  /**
   * Handed to the body. The standard body does not render it; a body
   * registered as `crud-item-page` can.
   */
  children?: ReactNode;
}

/**
 * The props of the item page body: `SmartCrudItemPageStandard` or a body
 * registered as `components['crud-item-page']` on `SmartProvider`.
 */
export interface SmartCrudItemPageBodyProps<T extends IEntity<string> = any> {
  detailsOptions?: IDetailsOptions<T>;
  /** `'create'`, `'update'` or `'details'`. */
  mode?: string;
  uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>;
  /** The values of the changed fields (`onPartialChange`). */
  onPartialChange?: (value: Partial<T>) => void;
  /** The form value (`onChange`). */
  onChange?: (value: T) => void;
  /** The form validity (`onValidChange`). */
  onValidChange?: (valid: boolean) => void;
  /**
   * Where the body keeps the form it renders: the page validates it before a
   * create or a save. `useCrudItemPageBase` fills
   * it.
   */
  formRef?: RefObject<SmartFormGroup | null>;
  children?: ReactNode;
}

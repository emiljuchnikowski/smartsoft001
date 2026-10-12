import type { ComponentType } from 'react';

import { IDetailsOptions } from '../../models';
import { SmartStore, useStore } from '../../store/store';

/** Props of `SmartListDetailsModal`. */
export interface SmartListDetailsModalProps {
  /** Rendered with the current options as its `value` prop. */
  component: ComponentType<any>;
  /** The details options, kept current by the list. */
  store: SmartStore<IDetailsOptions<any> | null>;
  /** Passed on by `ModalService`. */
  dismiss?: (data?: any) => void;
}

/**
 * What the list opens through `ModalService` for its details action: the
 * details component (`SmartDetailsPage` by default) with the list's current
 * `IDetailsOptions` as `value`. The options live in a store the list updates,
 * so the modal shows the item once the details provider has loaded it.
 */
export function SmartListDetailsModal({
  component: Component,
  store,
  dismiss,
}: SmartListDetailsModalProps) {
  const value = useStore(store);

  return <Component value={value ?? undefined} dismiss={dismiss} />;
}

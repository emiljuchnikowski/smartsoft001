import { useCallback } from 'react';
import type { ComponentType } from 'react';

import { useModalService } from '../../providers/hooks';

/** The `[smartDetails]` input of the Angular `DetailsDirective`. */
export interface IDetailsModalOptions {
  /** Rendered in the modal, with `params` as its `value` prop. */
  component: ComponentType<any>;
  params: any;
  /** Default `'bottom'`. */
  mode?: 'bottom' | 'default';
}

/** The outputs of the Angular `DetailsDirective`. */
export interface UseDetailsModalCallbacks {
  /** Once the modal is open (`smartDetailsShowed`). */
  onShowed?: () => void;
  /** Once the modal is closed (`smartDetailsDismissed`). */
  onDismissed?: () => void;
}

/**
 * The Angular `DetailsDirective` (`[smartDetails]`) as a hook: returns a
 * handler for the element's `onClick` that opens `options.component` in a
 * modal with `{ value: options.params }` as props (e.g. `SmartDetailsPage`
 * with `IDetailsOptions`), and resolves once the modal is closed.
 *
 * Without `options` or `options.component` it does nothing.
 */
export function useDetailsModal(
  options: IDetailsModalOptions | null | undefined,
  { onShowed, onDismissed }: UseDetailsModalCallbacks = {},
): () => Promise<void> {
  const modalService = useModalService();

  return useCallback(async () => {
    if (!options || !options.component) return;

    const modal = await modalService.show({
      component: options.component,
      props: {
        value: options.params,
      },
      mode: options.mode ? options.mode : 'bottom',
    });
    onShowed?.();

    await modal.onDidDismiss();

    onDismissed?.();
  }, [options, modalService, onShowed, onDismissed]);
}

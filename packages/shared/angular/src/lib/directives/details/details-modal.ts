import { Injector } from '@angular/core';

import { HardwareService, IModal, ModalService } from '../../services';

/** What `showDetailsModal` (and `[smartDetails]`) opens. */
export interface IDetailsModalOptions {
  /** Rendered in the modal, with `params` as its `value` input. */
  component: any;
  params: any;
  /** Default `'bottom'`. */
  mode?: 'bottom' | 'default';
}

/** The callbacks of `showDetailsModal`. */
export interface IDetailsModalCallbacks {
  /** Once the modal is open. */
  showed?: () => void;
  /** Once the modal is closed. */
  dismissed?: () => void;
}

/**
 * Opens `options.component` through `ModalService` with
 * `{ value: options.params }` as its inputs (e.g. `DetailsPage` with
 * `IDetailsOptions`), closes it when the browser goes back
 * (`HardwareService.onBackButtonClick`) and resolves once it is closed.
 * Without `options` or `options.component` it does nothing.
 */
export async function showDetailsModal(
  services: {
    modalService: ModalService;
    hardwareService: HardwareService;
    injector?: Injector;
  },
  options: IDetailsModalOptions | null | undefined,
  { showed, dismissed }: IDetailsModalCallbacks = {},
): Promise<void> {
  if (!options || !options.component) return;

  const modal: IModal = await services.modalService.show({
    component: options.component,
    props: {
      value: options.params,
    },
    mode: options.mode ? options.mode : 'bottom',
    injector: services.injector,
  });
  showed?.();

  const handler = await services.hardwareService.onBackButtonClick(() =>
    modal.dismiss(),
  );

  await modal.onDidDismiss();

  handler.remove();

  dismissed?.();
}

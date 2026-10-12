import {
  DestroyRef,
  Directive,
  HostListener,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';

import { IDetailsModalOptions, showDetailsModal } from './details-modal';
import { HardwareService, ModalService } from '../../services';

/**
 * Opens `component` in a modal on click (`ModalService`, mode `'bottom'` by
 * default) with `{ value: params }` as its inputs; the modal closes when the
 * browser goes back. Emits `smartDetailsShowed` once the modal is open and
 * `smartDetailsDismissed` once it is closed.
 */
@Directive({
  selector: '[smartDetails]',
})
export class DetailsDirective {
  private modalService = inject(ModalService);
  private hardwareService = inject(HardwareService);
  private injector = inject(Injector);
  private destroyed = false;

  options = input.required<IDetailsModalOptions>({ alias: 'smartDetails' });

  smartDetailsShowed = output();
  smartDetailsDismissed = output();

  constructor() {
    inject(DestroyRef).onDestroy(() => (this.destroyed = true));
  }

  @HostListener('click')
  async click(): Promise<void> {
    await showDetailsModal(
      {
        modalService: this.modalService,
        hardwareService: this.hardwareService,
        injector: this.injector,
      },
      this.options(),
      {
        showed: () => {
          if (!this.destroyed) this.smartDetailsShowed.emit();
        },
        dismissed: () => {
          if (!this.destroyed) this.smartDetailsDismissed.emit();
        },
      },
    );
  }
}

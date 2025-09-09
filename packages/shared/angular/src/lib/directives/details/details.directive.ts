import { Directive, HostListener, input, output, inject } from '@angular/core';

import { ModalService, HardwareService, IModal } from '../../services';

@Directive({
  selector: '[smartDetails]',
})
export class DetailsDirective {
  private modalService = inject(ModalService);
  private hardwareService = inject(HardwareService);

  options = input.required<{
    component: any;
    params: any;
    mode?: 'bottom' | 'default';
  }>({ alias: 'smartDetails' });

  smartDetailsShowed = output();
  smartDetailsDismissed = output();

  @HostListener('click')
  async click(): Promise<void> {
    if (!this.options() || !this.options().component) return;

    let modal: IModal | null = await this.modalService.show({
      component: this.options().component,
      props: {
        value: this.options().params,
      },
      mode: this.options().mode ? this.options().mode : 'bottom',
    });
    this.smartDetailsShowed.emit();

    const handler = await this.hardwareService.onBackButtonClick(async () => {
      if (modal) {
        await modal.dismiss();
      }
    });

    await modal.onDidDismiss();

    handler.remove();

    modal = null;

    this.smartDetailsDismissed.emit();
  }
}

import { Directive, HostListener, Input, Output, EventEmitter } from "@angular/core";

import { ModalService, HardwareService, IModal } from '../../services';

@Directive({
  selector: "[smartDetails]"
})
export class DetailsDirective {
  @Input("smartDetails")
  options!: { component: any; params: any, mode?: 'bottom' | 'default' };

  @Output() smartDetailsShowed = new EventEmitter();
  @Output() smartDetailsDismissed = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private hardwareService: HardwareService
  ) {}

  @HostListener("click")
  async click(): Promise<void> {
    if (!this.options || !this.options.component) return;

    let modal: IModal | null = await this.modalService.show({
      component: this.options.component,
      props: {
        value: this.options.params
      },
      mode: this.options.mode ? this.options.mode: "bottom"
    });
    this.smartDetailsShowed.emit();

    const handler = this.hardwareService.onBackButtonClick(async () => {
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

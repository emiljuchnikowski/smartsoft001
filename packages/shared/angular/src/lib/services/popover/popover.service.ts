import { Injectable } from '@angular/core';

@Injectable()
export class PopoverService {
  // constructor(private popoverCtrl: PopoverController) {}

  async close(): Promise<void> {
    // await this.popoverCtrl.dismiss();
  }
}

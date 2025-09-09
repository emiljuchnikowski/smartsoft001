import { Injectable } from '@angular/core';

@Injectable()
export class HardwareService {
  get isMobile(): boolean {
    // return this.platform.is('capacitor');
    return false;
  }

  get isMobileWeb(): boolean {
    // return this.platform.is('mobileweb');
    return false;
  }

  // constructor(private platform: Platform) {}

  async onBackButtonClick(
    callback: () => void,
  ): Promise</*PluginListenerHandle*/ any> {
    /*App.addListener('backButton', () => {
      callback();
    })*/
    return {} as any;
  }
}

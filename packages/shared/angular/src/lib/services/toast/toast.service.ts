import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable()
export class ToastService {
  static lockError = 0;

  constructor(private toastCtrl: ToastController) { }

  addLockError(): void {
    ++ToastService.lockError;
  }

  removeLockError(): void {
    --ToastService.lockError;
  }

  async error(config: IToastOptions): Promise<void> {
    if (ToastService.lockError) return;

    const toast = await this.toastCtrl.create({
      position: 'bottom',
      header: config.title,
      message: config.message,
      duration: config.duration ? config.duration : 2000,
      buttons: config.buttons ? config.buttons.map(b => { return {
        text: b.text,
        side: b.position,
        role: 'cancel',
        handler: b.handler
      }}) : null
    });

    await toast.present();
  }

  async info(config: IToastOptions): Promise<void> {
    const toast = await this.toastCtrl.create({
      position: 'bottom',
      header: config.title,
      message: config.message,
      duration: config.duration ? config.duration : 2000,
      buttons: config.buttons ? config.buttons.map(b => { return {
        text: b.text,
        side: b.position,
        handler: b.handler
      }}) : null
    });

    await toast.present();
  }
}

export interface IToastOptions {
  title?: string;
  message: string;
  duration?: number;
  buttons?: Array<IToastButton>;
}

export interface IToastButton {
  text: string;
  position: 'start' | 'end';
  handler: () => void;
}

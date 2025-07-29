import {Injectable, Optional} from "@angular/core";
import {ModalController, NavParams} from "@ionic/angular";
import { ModalOptions } from '@ionic/core';

@Injectable()
export class ModalService {
    constructor(private modalCtrl: ModalController, @Optional() private navParams: NavParams) { }

    getParam<T>(key: string): T {
        return this.navParams?.get(key);
    }

    async show(options: IModalOptions): Promise<IModal> {
        const modalOptions = {
            component: options.component,
            componentProps: options.props,
            cssClass: options.cssClass ? options.cssClass : [],
            backdropDismiss: options.backdropDismiss
        } as ModalOptions<any>;

        if (options.mode === "bottom") {
            (modalOptions.cssClass as string[]).push('smart-modal-bottom');
        }

        const modal = await this.modalCtrl.create(modalOptions);
        await modal.present();

        return modal as any;
    }

    async dismiss<T>(data: T | null = null): Promise<void> {
        await this.modalCtrl.dismiss(data);
    }
}

export interface IModalOptions {
    component: any;
    props?: any;
    mode?: 'default' | 'bottom';
    cssClass?: string[];
    backdropDismiss?: boolean;
}

export interface IModal {
    dismiss: () => void;
    onDidDismiss(): Promise<{ data: any }>
}

import {Injectable} from "@angular/core";
import {AlertController} from "@ionic/angular";

@Injectable()
export class AlertService {
    constructor(private readonly alertCtrl: AlertController) {}

    async show(options: IAlertOptions): Promise<void> {
        const alert = await this.alertCtrl.create(options);
        await alert.present();
    }
}

export interface IAlertOptions {
    header?: string;
    subHeader?: string;
    message?: string;
    backdropDismiss?: boolean;
    buttons?: Array<IAlertButton>;
}

export interface IAlertButton {
    text: string;
    role?: 'cancel' | 'destructive' | string;
    cssClass?: string | string[];
    handler?: (value: any) => boolean | void | {[key: string]: any};
}
import {Injectable} from "@angular/core";
import {App} from "@capacitor/core";
import {Platform} from "@ionic/angular";

@Injectable()
export class HardwareService {
    get isMobile(): boolean {
        return this.platform.is('capacitor');
    }

    get isMobileWeb(): boolean {
        return this.platform.is('mobileweb');
    }

    constructor(private platform: Platform) { }

    onBackButtonClick(callback: () => void): IHardwareBackHandler {
        return App.addListener('backButton', () => {
            callback();
        });
    }
}

export interface IHardwareBackHandler {
    remove: () => void;
}

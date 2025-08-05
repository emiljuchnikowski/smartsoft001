import {Injectable} from "@angular/core";
import {PopoverController} from "@ionic/angular";

@Injectable()
export class PopoverService {
    constructor(private popoverCtrl: PopoverController) {
    }

    async close(): Promise<void> {
        await this.popoverCtrl.dismiss();
    }
}

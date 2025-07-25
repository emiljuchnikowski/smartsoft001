import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NavParams, PopoverController} from "@ionic/angular";
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'smart-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    imports: [
        IonIcon
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent {
    @Input() text!: string;

    constructor(private popoverCtrl: PopoverController) {}

    async onClick(ev: any): Promise<void> {
        const popover = await this.popoverCtrl.create({
            backdropDismiss: true,
            component: InfoModalComponent,
            componentProps: {
                text: this.text
            },
            event: ev
        });

        await popover.present();
    }
}

@Component({
    selector: 'smart-info-modal',
    template: `
        <ion-content class="ion-padding" [innerHTML]="text | translate"></ion-content>
    `,
    imports: [
        IonContent,
        TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoModalComponent {
    text: string;

    constructor(params: NavParams) {
        this.text = params.get('text');
    }
}

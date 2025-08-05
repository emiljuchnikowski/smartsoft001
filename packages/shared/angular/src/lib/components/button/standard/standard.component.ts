import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import { TranslatePipe } from '@ngx-translate/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

import {ButtonBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-button-standard',
    templateUrl: './standard.component.html',
    styleUrls: ['./standard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        IonButton,
        IonSpinner,
        TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonStandardComponent extends ButtonBaseComponent {

}

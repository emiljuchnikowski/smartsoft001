import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";

import {ButtonBaseComponent} from "../base/base.component";

@Component({
    selector: 'smart-button-standard',
    templateUrl: './standard.component.html',
    styleUrls: ['./standard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonStandardComponent extends ButtonBaseComponent {

}
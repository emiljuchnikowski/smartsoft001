import {Component, Input} from "@angular/core";
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'smart-export',
    templateUrl: './export.component.html',
    imports: [
        IonButton,
        IonIcon
    ],
    styleUrls: ['./export.component.scss']
})
export class ExportComponent {

    @Input() value: any;
    @Input() fileName!: string;
    @Input() handler!: (value: any) => void;

    constructor() { }

    async onClick(): Promise<void> {
        if (this.handler) {
            this.handler(this.value);
            return;
        }
    }
}

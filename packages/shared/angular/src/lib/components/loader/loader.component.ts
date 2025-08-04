import { Component, input, InputSignal } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
    selector: 'smart-loader',
    template: `
        @if (show()) {
            <ion-spinner [style.height]="height()"></ion-spinner>
        }
    `,
    imports: [
        IonSpinner
    ],
    styleUrls: [
        './loader.component.scss'
    ]
})
export class LoaderComponent {
    readonly show: InputSignal<boolean> = input<boolean>(false);
    readonly height: InputSignal<string | null> = input<string | null>(null);
}

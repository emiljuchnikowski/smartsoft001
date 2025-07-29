import { Component, Input } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
    selector: 'smart-loader',
    template: `
        @if (show) {
            <ion-spinner [style.height]="height"></ion-spinner>
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
    @Input() show!: boolean;
    @Input() height: string | null = null;
}

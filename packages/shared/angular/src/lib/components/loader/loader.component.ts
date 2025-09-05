import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'smart-loader',
  template: `
    @if (show()) {
      <!--      <ion-spinner [style.height]="height()"></ion-spinner>-->
    }
  `,
})
export class LoaderComponent {
  readonly show: InputSignal<boolean> = input<boolean>(false);
  readonly height: InputSignal<string | null> = input<string | null>(null);
}

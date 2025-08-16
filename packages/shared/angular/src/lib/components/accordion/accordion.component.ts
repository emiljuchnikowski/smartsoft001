import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
} from '@angular/core';
import { IonIcon, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'smart-accordion',
  template: `
    <ion-item (click)="show = !show">
      <ng-content select="smart-accordion-header"></ng-content>
      @if (show) {
        <ion-icon name="caret-up-outline" slot="end"></ion-icon>
      } @else {
        <ion-icon name="caret-down-outline" slot="end"></ion-icon>
      }
    </ion-item>

    @if (show) {
      <ng-content select="smart-accordion-body"></ng-content>
    }
  `,
  imports: [IonItem, IonIcon],
  styles: [
    `
      ion-icon {
        margin-right: 1.6rem;
      }
    `,
  ],
})
export class AccordionComponent {
  private _show: WritableSignal<boolean> = signal<boolean>(false);

  @Input() set show(val: boolean) {
    this._show.set(val);
    this.showChange.emit(this._show);
  }
  get show(): boolean {
    return this._show();
  }

  @Output() showChange = new EventEmitter();
}

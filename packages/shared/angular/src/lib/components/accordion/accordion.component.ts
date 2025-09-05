import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'smart-accordion',
  template: `
    <!--    <ion-item (click)="show = !show">-->
    <ng-content select="smart-accordion-header"></ng-content>
    @if (show) {
      <!--      TODO: extend tailwind classes to have mr-6.5 = margin-right: 1.6rem-1.625rem-->
      <!--        <ion-icon class="mr-6.5" name="caret-up-outline" slot="end"></ion-icon>-->
    } @else {
      <!--        <ion-icon class="mr-6.5" name="caret-down-outline" slot="end"></ion-icon>-->
    }
    <!--    </ion-item>-->

    @if (show) {
      <ng-content select="smart-accordion-body"></ng-content>
    }
  `,
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

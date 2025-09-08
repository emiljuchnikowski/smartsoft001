import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'smart-accordion',
  template: `
<!--        <ion-item (click)="update()">-->
    <ng-content select="smart-accordion-header"></ng-content>
    @if (show()) {
      <!--      TODO: extend tailwind classes to have mr-6.5 = margin-right: 1.6rem-1.625rem-->
      <!--        <ion-icon class="mr-6.5" name="caret-up-outline" slot="end"></ion-icon>-->
    } @else {
      <!--        <ion-icon class="mr-6.5" name="caret-down-outline" slot="end"></ion-icon>-->
    }
    <!--    </ion-item>-->

    @if (show()) {
      <ng-content select="smart-accordion-body"></ng-content>
    }
  `,
})
export class AccordionComponent {
  show: ModelSignal<boolean> = model<boolean>(false);

  update() {
    this.show.update(val => !val);
  }
}

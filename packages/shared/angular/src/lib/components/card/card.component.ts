import { AsyncPipe } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { ICardOptions } from '../../models';

@Component({
  selector: 'smart-card',
  template: `
    <!--    <ion-card class="ion-padding">-->
    @let title = options()?.title;
    @let buttons = options()?.buttons;
    @if (title) {
      <!--        <ion-card-header>-->
      <!--          <ion-card-title>-->
      {{ title }}
      @if (buttons) {
        <!--              <ion-buttons style="float: right">-->
        @for (btn of options()!.buttons; track btn.number) {
          <!--                  <ion-button-->
          <!--                    (click)="btn?.handler()"-->
          <!--                    [disabled]="btn.disabled$ | async"-->
          <!--                  >-->
          <!--                    <ion-icon slot="icon-only" [name]="btn.icon"></ion-icon>-->
          <!--                  </ion-button>-->
        }
        <!--              </ion-buttons>-->
      }
      <!--          </ion-card-title>-->
      <!--        </ion-card-header>-->
    }
    <!--      <ion-card-content>-->
    <ng-content></ng-content>
    <!--      </ion-card-content>-->
    <!--    </ion-card>-->
  `,
  imports: [AsyncPipe],
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  readonly options: InputSignal<ICardOptions | undefined> =
    input<ICardOptions>();
}

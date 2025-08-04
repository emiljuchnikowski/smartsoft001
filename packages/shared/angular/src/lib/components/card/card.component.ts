import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon
} from '@ionic/angular/standalone';
import { Component, input, Input, InputSignal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {ICardOptions} from "../../models";

@Component({
  selector: 'smart-card',
  template: `
    <ion-card class="ion-padding">
      @let title = options()?.title;
      @let buttons = options()?.buttons;
      @if (title) {
        <ion-card-header>
          <ion-card-title>
            {{ title }}
            @if (buttons) {
              <ion-buttons style="float: right">
                @for (btn of options()!.buttons; track btn.number) {
                  <ion-button (click)="btn?.handler()" [disabled]="btn.disabled$ | async">
                    <ion-icon slot="icon-only" [name]="btn.icon"></ion-icon>
                  </ion-button>
                }
              </ion-buttons>
            }
          </ion-card-title>
        </ion-card-header>
      }
      <ion-card-content>
        <ng-content></ng-content>
      </ion-card-content>
    </ion-card>
  `,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCardContent,
    AsyncPipe
  ],
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  readonly options: InputSignal<ICardOptions | undefined> = input<ICardOptions>();

  constructor() { }

  ngOnInit() {
  }

}

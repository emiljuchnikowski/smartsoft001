import { Component } from '@angular/core';
import { IonButton, IonCol, IonIcon, IonInput, IonLabel, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import {IEntity} from "@smartsoft001/domain-core";

import {BaseComponent} from "../base/base.component";

@Component({
  selector: 'smart-crud-filter-text',
  template: `
    <ion-row>
      <ion-col>
        <ion-label position="floating">
          {{ item().label | translate }}
        </ion-label>
        <ion-input [(ngModel)]="value"></ion-input>
      </ion-col>
      @if (value) {
        <ion-col size="auto">
          <ion-button color="danger" (click)="refresh(null)" class="square-button">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-col>
      }
    </ion-row>
  `,
  imports: [
    IonRow,
    IonCol,
    IonLabel,
    TranslatePipe,
    IonInput,
    IonButton,
    IonIcon,
    FormsModule
  ],
  styleUrls: ['./text.component.scss']
})
export class FilterTextComponent<T extends IEntity<string>> extends BaseComponent<T> {

}

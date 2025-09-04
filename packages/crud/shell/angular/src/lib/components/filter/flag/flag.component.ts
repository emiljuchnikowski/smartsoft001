import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonIcon,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-flag',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <div class="flag-container">
      <!--          <ion-label position="static">-->
      {{ item().label | translate }}
      <!--          </ion-label>-->
      <!--          <ion-checkbox [(ngModel)]="value" slot="end"></ion-checkbox>-->
    </div>
    <!--      </ion-col>-->
    @if (typeof value === 'boolean') {
      <!--        <ion-col size="auto">-->
      <!--          <ion-button-->
      <!--            color="danger"-->
      <!--            (click)="refresh(null)"-->
      <!--            class="square-button"-->
      <!--          >-->
      <!--            <ion-icon slot="icon-only" name="close-outline"></ion-icon>-->
      <!--          </ion-button>-->
      <!--        </ion-col>-->
    }
    <!--    </ion-row>-->
  `,
  imports: [
    IonRow,
    IonCol,
    IonLabel,
    TranslatePipe,
    IonCheckbox,
    IonButton,
    IonIcon,
    FormsModule,
  ],
  styleUrls: ['./flag.component.scss'],
})
export class FilterFlagComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}

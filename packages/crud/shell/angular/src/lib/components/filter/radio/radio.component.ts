import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-radio',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <!--        <ion-radio-group [(ngModel)]="value">-->
    <!--          <ion-item-divider>-->
    <!--            <ion-icon slot="start" name="filter-outline"></ion-icon>-->
    <!--            <ion-label>-->
    {{ item().label | translate }}
    <!--            </ion-label>-->
    @if (value || value === false) {
      <!--              <ion-button-->
      <!--                slot="end"-->
      <!--                color="danger"-->
      <!--                (click)="refresh(null)"-->
      <!--                class="square-button"-->
      <!--              >-->
      <!--                <ion-icon slot="icon-only" name="close-outline"></ion-icon>-->
      <!--              </ion-button>-->
    }
    <!--          </ion-item-divider>-->

    @for (item of possibilities(); track item) {
      <!--            <ion-item>-->
      <!--              <ion-label>{{ item.text | translate }}</ion-label>-->
      <!--              <ion-radio [value]="item.id"></ion-radio>-->
      <!--            </ion-item>-->
    }
    <!--        </ion-radio-group>-->
    <!--      </ion-col>-->
    <!--    </ion-row>-->
  `,
  imports: [
    IonRow,
    IonCol,
    IonRadioGroup,
    IonItemDivider,
    IonIcon,
    IonLabel,
    IonButton,
    IonItem,
    IonRadio,
    TranslatePipe,
    FormsModule,
  ],
  styleUrls: ['./radio.component.scss'],
})
export class FilterRadioComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}

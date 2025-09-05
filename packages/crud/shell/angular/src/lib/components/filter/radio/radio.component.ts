import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-radio',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <!--        <ion-radio-group [(ngModel)]="value">-->
    <!--          <ion-item-divider class="font-light text-xl">-->
    <!--            <ion-icon class="mr-6 text-2xl" slot="start" name="filter-outline"></ion-icon>-->
    <!--            <ion-label>-->
    {{ item().label | translate }}
    <!--            </ion-label>-->
    @if (value || value === false) {
      <!--              <ion-button-->
      <!--                slot="end"-->
      <!--                color="danger"-->
      <!--                (click)="refresh(null)"-->
      <!--                class="square-button m-0 text-lg h-9 w-9 p-0"-->
      <!--              >-->
      <!--                <ion-icon class="mr-6 text-2xl m-0 p-0" slot="icon-only" name="close-outline"></ion-icon>-->
      <!--              </ion-button>-->
    }
    <!--          </ion-item-divider>-->

    @for (item of possibilities(); track item) {
      <!--            <ion-item>-->
      <!--              <ion-label>{{ item.text | translate }}</ion-label>-->
      <!--              <ion-radio class="mr-10" [value]="item.id"></ion-radio>-->
      <!--            </ion-item>-->
    }
    <!--        </ion-radio-group>-->
    <!--      </ion-col>-->
    <!--    </ion-row>-->
  `,
  imports: [TranslatePipe, FormsModule],
  styles: [
    `
      :host {
        width: 100%;
        margin-bottom: 1.2rem;
        ion-item-divider {
          //--padding-end: 0.8rem;
          //--ion-background-color: linear-gradient(
          //  90deg,
          //  transparent,
          //  var(--ion-color-light)
          //);
          ion-icon {
            //--color: var(--ion-color-primary);
          }
          ion-label {
            //--padding: var(--smart-button-padding-left) / 2
            //  var(--smart-button-padding-top) / 2 var(--smart-button-padding-right) /
            //  2 var(--smart-button-padding-bottom) / 2;
          }
          .square-button {
            //--padding-start: 0.2em;
            //--padding-end: 0.2em;
          }
        }
      }
    `,
  ],
})
export class FilterRadioComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}

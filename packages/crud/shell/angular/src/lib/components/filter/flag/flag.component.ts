import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-flag',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <div
      class="flag-container w-full flex flex-row flex-nowrap justify-between pr-5"
    >
      <!--          <ion-label class="align-middle my-6" position="static">-->
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
      <!--            class="square-button m-3"-->
      <!--          >-->
      <!--            <ion-icon slot="icon-only" name="close-outline"></ion-icon>-->
      <!--          </ion-button>-->
      <!--        </ion-col>-->
    }
    <!--    </ion-row>-->
  `,
  imports: [TranslatePipe, FormsModule],
  styles: [
    `
      :host {
        width: 100%;
        .flag-container {
          ion-label {
            /*--color: var(--smart-color-dark);*/
          }
        }
        .square-button {
          height: var(--smart-button-height) !important;
        }
      }
    `,
  ],
})
export class FilterFlagComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}

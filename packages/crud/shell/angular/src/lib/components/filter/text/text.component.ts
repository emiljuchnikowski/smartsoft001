import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-text',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <!--        <ion-label position="floating">-->
    {{ item()?.label || '' | translate }}
    <!--        </ion-label>-->
    <!--        <ion-input [(ngModel)]="value"></ion-input>-->
    <!--      </ion-col>-->
    @if (value) {
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
        .square-button {
          height: var(--smart-button-height) !important;
        }
      }
    `,
  ],
})
export class FilterTextComponent<
  T extends IEntity<string>,
> extends BaseComponent<T> {}

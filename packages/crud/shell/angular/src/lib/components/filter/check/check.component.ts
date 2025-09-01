import { AfterContentInit, Component, computed, Signal } from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-check',
  template: `
    <ion-row>
      <ion-col>
        <ion-item-divider>
          <ion-icon slot="start" name="filter-outline"></ion-icon>
          <ion-label>
            {{ item().label | translate }}
          </ion-label>
          @if (value?.length) {
            <ion-button
              slot="end"
              color="danger"
              (click)="refresh([])"
              class="square-button"
            >
              <ion-icon slot="icon-only" name="close-outline"></ion-icon>
            </ion-button>
          }
        </ion-item-divider>

        @for (entry of list(); track entry) {
          <ion-item>
            <ion-label>{{ entry.value.text | translate }}</ion-label>
            <ion-checkbox
              slot="end"
              [checked]="entry.isCheck"
              (ionChange)="onCheckChange($event.detail.checked, entry)"
            ></ion-checkbox>
          </ion-item>
        }
      </ion-col>
    </ion-row>
  `,
  imports: [
    IonRow,
    IonCol,
    IonItemDivider,
    IonIcon,
    IonLabel,
    TranslatePipe,
    IonButton,
    IonItem,
    IonCheckbox,
  ],
  styleUrls: ['./check.component.scss'],
})
export class FilterCheckComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements AfterContentInit
{
  list: Signal<{ value: any; isCheck: boolean }[]>;

  ngAfterContentInit(): void {
    this.list = computed(() => {
      const possibilities = this.possibilities();
      return possibilities.map((pos) => ({
        value: pos,
        isCheck: this.value.some((r) => r === pos.id),
      }));
    });
  }

  onCheckChange(checked: boolean, entry: { value: any; isCheck: boolean }) {
    if (checked && !this.value.some((r) => r === entry.value.id)) {
      this.value = [...this.value, entry.value.id];
    }

    if (!checked && this.value.some((r) => r === entry.value.id)) {
      this.value = this.value.filter((r) => r !== entry.value.id);
    }
  }
}

import { AfterContentInit, Component, computed, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-check',
  template: `
    <!--    <ion-row>-->
    <!--      <ion-col>-->
    <!--        <ion-item-divider class="text-xl font-light">-->
    <!--          <ion-icon class="mr-6 text-2xl" slot="start" name="filter-outline"></ion-icon>-->
    <!--          <ion-label>-->
    {{ item()?.label || '' | translate }}
    <!--          </ion-label>-->
    @if (value?.length) {
      <!--            <ion-button-->
      <!--              slot="end"-->
      <!--              color="danger"-->
      <!--              (click)="refresh([])"-->
      <!--              class="square-button m-0 p-0 text-lg h-9 w-9"-->
      <!--            >-->
      <!--              <ion-icon class="text-2xl m-0 p-0" slot="icon-only" name="close-outline"></ion-icon>-->
      <!--            </ion-button>-->
    }
    <!--        </ion-item-divider>-->

    @for (entry of list(); track entry) {
      <!--          <ion-item>-->
      <!--<ion-label>-->{{ entry.value.text | translate
      }}<!--</ion-label>-->
      <!--            <ion-checkbox-->
      <!--              slot="end"-->
      <!--              [checked]="entry.isCheck"-->
      <!--              (ionChange)="onCheckChange($event.detail.checked, entry)"-->
      <!--            ></ion-checkbox>-->
      <!--          </ion-item>-->
    }
    <!--      </ion-col>-->
    <!--    </ion-row>-->
  `,
  imports: [TranslatePipe],
  styleUrls: ['./check.component.scss'],
})
export class FilterCheckComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements AfterContentInit
{
  list!: Signal<{ value: any; isCheck: boolean }[]>;

  ngAfterContentInit(): void {
    this.list = computed(() => {
      const possibilities = this.possibilities();
      return possibilities.map((pos) => ({
        value: pos,
        isCheck: this.value.some((r: any) => r === pos.id),
      }));
    });
  }

  onCheckChange(checked: boolean, entry: { value: any; isCheck: boolean }) {
    if (checked && !this.value.some((r: any) => r === entry.value.id)) {
      this.value = [...this.value, entry.value.id];
    }

    if (!checked && this.value.some((r: any) => r === entry.value.id)) {
      this.value = this.value.filter((r: any) => r !== entry.value.id);
    }
  }
}

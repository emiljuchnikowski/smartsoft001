import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

// TODO: CardComponent moved to @smartsoft001-pro/angular (FRA-101)
// import { CardComponent } from '../../card';
import { DetailComponent } from '../../detail';
import { DetailsBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-details-standard',
  template: `
    <!--    <ion-list class="m-0 p-0">-->
    <div #topTpl class="text-xl py-2.5 separator"></div>

    <!-- TODO: CardComponent moved to @smartsoft001-pro/angular (FRA-101)
    <smart-card>
      @for (field of fields; track field.key) {
        <smart-detail
          [type]="type"
          [options]="{
            key: field.key,
            options: field.options,
            cellPipe: cellPipe() ?? undefined,
            item: item,
            loading: loading ?? undefined,
          }"
        ></smart-detail>
      }
    </smart-card>
    -->
    @for (field of fields; track field.key) {
      <smart-detail
        [type]="type"
        [options]="{
          key: field.key,
          options: field.options,
          cellPipe: cellPipe() ?? undefined,
          item: item,
          loading: loading ?? undefined,
        }"
      ></smart-detail>
    }

    <div #bottomTpl class="text-xl py-2.5 separator"></div>
    <!--    </ion-list>-->
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  // TODO: CardComponent moved to @smartsoft001-pro/angular (FRA-101)
  imports: [DetailComponent],
})
export class DetailsStandardComponent<
  T extends IEntity<string>,
> extends DetailsBaseComponent<T> {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';

import { IEntity } from '@smartsoft001/domain-core';

import { CardComponent } from '../../card';
import { DetailComponent } from '../../detail';
import { DetailsBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-details-standard',
  template: `
    <ion-list>
      <div #topTpl class="top-content"></div>

      <smart-card>
        @for (field of fields; track field.key) {
          <smart-detail
            [type]="type"
            [options]="{
              key: field.key,
              options: field.options,
              cellPipe: cellPipe() ?? undefined,
              item: item ?? undefined,
              loading: loading ?? undefined,
            }"
          ></smart-detail>
        }
      </smart-card>

      <div #bottomTpl class="bottom-content"></div>
    </ion-list>
  `,
  styleUrls: ['./standard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [IonList, CardComponent, DetailComponent],
})
export class DetailsStandardComponent<
  T extends IEntity<string>,
> extends DetailsBaseComponent<T> {}

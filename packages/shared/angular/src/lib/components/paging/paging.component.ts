import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  InputSignal,
  Output,
} from '@angular/core';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'smart-paging',
  template: `
    <ion-grid>
      <ion-row>
        @let page = this.page();
        @let totalPages = this.totalPages();
        <ion-col>
          <ion-button
            [disabled]="page === null || page! <= 1"
            (click)="prevPage.emit()"
            >{{ 'prev' | translate }}
          </ion-button>
        </ion-col>
        <ion-col>
          {{ 'page' | translate }} {{ page }} / {{ totalPages }}
        </ion-col>
        <ion-col>
          <ion-button
            [disabled]="
              page === null || totalPages === null || page! >= totalPages!
            "
            (click)="nextPage.emit()"
          >
            {{ 'next' | translate }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: `
    :host {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonGrid, IonRow, IonCol, IonButton, TranslatePipe],
})
export class PagingComponent {
  readonly page: InputSignal<number | null> = input<number | null>(null);
  readonly totalPages: InputSignal<number | null> = input<number | null>(null);

  @Output() nextPage = new EventEmitter();
  @Output() prevPage = new EventEmitter();
}

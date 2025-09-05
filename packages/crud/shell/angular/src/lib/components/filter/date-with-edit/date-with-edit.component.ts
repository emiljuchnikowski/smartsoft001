import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';
import { GuidService } from '@smartsoft001/utils';

import { FilterDateComponent } from '../date/date.component';

@Component({
  selector: 'smart-crud-filter-date-with-edit',
  templateUrl: './date-with-edit.component.html',
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
export class FilterDateWithEditComponent<T extends IEntity<string>>
  extends FilterDateComponent<T>
  implements OnInit, OnDestroy
{
  private _subscriptions = new Subscription();

  advanced: WritableSignal<boolean> = signal(false);
  id = GuidService.create();

  // @ViewChild(IonDatetime, { read: IonDatetime, static: false })
  // dateTimePicker: IonDatetime;

  toggleAdvanced(): void {
    this.advanced.update((val) => !val);
    if (this.advanced) {
      this.value = null;
    }
  }

  ngOnInit(): void {
    super.ngOnInit();

    // if (this.dateTimePicker) {
    //   this._subscriptions.add(
    //     this.dateTimePicker.ionChange.subscribe((val: CustomEvent) => {
    //       this.customValue = val.detail.value;
    //     }),
    //   );
    // } else {
    //   console.error('dateTimePicker not found!');
    // }
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}

import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { IEntity } from '@smartsoft001/domain-core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-int',
  templateUrl: './int.component.html',
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
export class FilterIntComponent<T extends IEntity<string>>
  extends BaseComponent<T>
  implements OnInit, OnDestroy
{
  private _subscriptions = new Subscription();

  advanced: WritableSignal<boolean> = signal<boolean>(false);

  get allowAdvanced(): boolean {
    return this.item()?.type === '=';
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  toggleAdvanced(): void {
    this.advanced.update((val) => !val);
    if (this.advanced()) this.value = null;
  }
}

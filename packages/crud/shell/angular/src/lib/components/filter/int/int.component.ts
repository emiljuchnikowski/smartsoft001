import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { IEntity } from '@smartsoft001/domain-core';
import { Subscription } from 'rxjs';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-filter-int',
  templateUrl: './int.component.html',
  imports: [
    IonRow,
    IonCol,
    IonLabel,
    TranslatePipe,
    FormsModule,
    IonInput,
    IonButton,
    IonIcon,
    IonItem,
  ],
  styleUrls: ['./int.component.scss'],
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

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }

  toggleAdvanced(): void {
    this.advanced.update((val) => !val);
    if (this.advanced) this.value = null;
  }
}

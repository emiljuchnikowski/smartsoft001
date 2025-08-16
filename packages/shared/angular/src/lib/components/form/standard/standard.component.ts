import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';

import { InputComponent } from '../../input';
import { FormBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-form-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.scss'],
  imports: [IonList, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStandardComponent<T> extends FormBaseComponent<T> {}

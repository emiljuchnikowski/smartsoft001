import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { ButtonComponent, FormComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { MultiselectBaseComponent } from './base/base.component';
import { FormOptionsPipe } from '../../pipes';

@Component({
  selector: 'smart-crud-multiselect',
  templateUrl: './multiselect.component.html',
  imports: [
    TranslatePipe,
    NgComponentOutlet,
    DynamicIoDirective,
    FormOptionsPipe,
    FormComponent,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiselectComponent<
  T extends IEntity<string>,
> extends MultiselectBaseComponent<T> {}

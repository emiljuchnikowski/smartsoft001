import { Component, Input } from '@angular/core';

import { FieldType, IModelFilter } from '@smartsoft001/models';

import { ICrudFilter } from '../../models';
import { FilterCheckComponent } from './check/check.component';
import { FilterDateComponent } from './date/date.component';
import { FilterDateTimeComponent } from './date-time/date-time.component';
import { FilterDateWithEditComponent } from './date-with-edit/date-with-edit.component';
import { FilterFlagComponent } from './flag/flag.component';
import { FilterIntComponent } from './int/int.component';
import { FilterRadioComponent } from './radio/radio.component';
import { FilterTextComponent } from './text/text.component';

@Component({
  selector: 'smart-crud-filter',
  templateUrl: './filter.component.html',
  imports: [
    FilterTextComponent,
    FilterIntComponent,
    FilterFlagComponent,
    FilterCheckComponent,
    FilterRadioComponent,
    FilterDateTimeComponent,
    FilterDateWithEditComponent,
    FilterDateComponent,
  ],
})
export class FilterComponent {
  FieldType = FieldType;

  @Input() item: IModelFilter;
  @Input() filter: ICrudFilter;
}

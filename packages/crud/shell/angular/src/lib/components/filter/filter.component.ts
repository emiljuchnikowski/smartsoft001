import { Component, Input, OnInit } from "@angular/core";
import { IonItem } from '@ionic/angular/standalone';

import {FieldType, IModelFilter} from "@smartsoft001/models";

import {ICrudFilter} from '../../models';
import { FilterTextComponent } from './text/text.component';
import { FilterIntComponent } from './int/int.component';
import { FilterFlagComponent } from './flag/flag.component';
import { FilterCheckComponent } from './check/check.component';
import { FilterRadioComponent } from './radio/radio.component';
import { FilterDateTimeComponent } from './date-time/date-time.component';
import { FilterDateWithEditComponent } from './date-with-edit/date-with-edit.component';
import { FilterDateComponent } from './date/date.component';

@Component({
  selector: 'smart-crud-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    FilterTextComponent,
    FilterIntComponent,
    FilterFlagComponent,
    FilterCheckComponent,
    FilterRadioComponent,
    FilterDateTimeComponent,
    FilterDateWithEditComponent,
    FilterDateComponent,
    IonItem
  ]
})
export class FilterComponent implements OnInit {
  FieldType = FieldType;

  @Input() item: IModelFilter;
  @Input() filter: ICrudFilter;

  constructor() {}

  ngOnInit(): void {}
}

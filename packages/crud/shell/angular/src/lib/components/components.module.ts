import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@smartsoft001/angular';
import { DynamicIoModule } from 'ng-dynamic-component';

import { ExportComponent } from './export/export.component';
import {
  FilterComponent,
  FilterDateComponent,
  FilterDateWithEditComponent,
  FilterFlagComponent,
  FilterRadioComponent,
  FilterTextComponent,
  FilterCheckComponent,
  FilterIntComponent,
  FilterDateTimeComponent,
} from './filter';
import { CrudPipesModule } from '../pipes';
import { FiltersComponent } from './filters/filters.component';
import { FiltersConfigComponent } from './filters-config/filters-config.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { CrudFacade } from '../+state/crud.facade';
import { GroupComponent } from './group/group.component';
import { CrudListPaginationFactory } from '../factories/list-pagination/list-pagination.factory';
import { CrudService } from '../services/crud/crud.service';

const COMPONENTS = [
  ExportComponent,
  FilterComponent,
  FilterTextComponent,
  FiltersConfigComponent,
  FilterDateComponent,
  FilterDateWithEditComponent,
  FilterDateTimeComponent,
  FilterRadioComponent,
  FiltersComponent,
  FilterFlagComponent,
  FilterCheckComponent,
  FilterIntComponent,
  MultiselectComponent,
  GroupComponent,
];

@NgModule({
  imports: [
    ...COMPONENTS,
    SharedModule,
    CrudPipesModule,
    FormsModule,
    CommonModule,
    DynamicIoModule,
  ],
  exports: [CrudPipesModule, ...COMPONENTS],
  providers: [CrudService, CrudFacade, CrudListPaginationFactory],
})
export class CrudComponentsModule {}

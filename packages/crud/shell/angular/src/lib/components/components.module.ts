import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicIoModule } from 'ng-dynamic-component';

import { SharedModule } from '@smartsoft001/angular';

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
import { FiltersConfigComponent } from './filters-config/filters-config.component';
import { FiltersComponent } from './filters/filters.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { SocketService } from '../services/socket/socket.service';
import { CrudPipesModule } from '../pipes/pipes.module';
import { CrudService } from '../services/crud/crud.service';
import { CrudEffects } from '../+state/crud.effects';
import { CrudFacade } from '../+state/crud.facade';
import { CrudListPaginationFactory } from '../factories/list-pagination/list-pagination.factory';
import { GroupComponent } from './group/group.component';

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
  declarations: [...COMPONENTS],
  imports: [
    //AuthSharedModule,
    StoreModule,
    SharedModule,
    CrudPipesModule,
    FormsModule,
    CommonModule,
    DynamicIoModule,
  ],
  exports: [CrudPipesModule, ...COMPONENTS],
  providers: [
    CrudService,
    CrudEffects,
    CrudFacade,
    SocketService,
    CrudListPaginationFactory,
  ],
})
export class CrudComponentsModule {}

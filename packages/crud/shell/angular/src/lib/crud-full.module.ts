import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from './+state/crud.facade';
import { CrudComponentsModule } from './components';
import { CrudListPaginationFactory } from './factories/list-pagination/list-pagination.factory';
import { ListComponent } from './pages';
import { ItemComponent } from './pages';
import { ListStandardComponent } from './pages';
import { ItemStandardComponent } from './pages';
import { CrudPipesModule } from './pipes';
import { CrudService } from './services/crud/crud.service';
import { CrudListGroupService } from './services/list-group/list-group.service';
import { PageService } from './services/page/page.service';

export const PAGES = [
  ItemComponent,
  ListComponent,
  ListStandardComponent,
  ItemStandardComponent,
];

@NgModule({
  imports: [
    ...PAGES,
    SharedModule,
    CrudPipesModule,
    RouterModule.forChild([
      { path: '', component: ListComponent },
      { path: 'add', component: ItemComponent },
      { path: ':id', component: ItemComponent },
    ]),
    FormsModule,
    CommonModule,
    CrudComponentsModule,
  ],
  exports: [...PAGES, CrudComponentsModule],
  providers: [
    CrudService,
    CrudListGroupService,
    PageService,
    CrudFacade,
    CrudListPaginationFactory,
  ],
})
export class CrudFullModule<T extends IEntity<string>> {}

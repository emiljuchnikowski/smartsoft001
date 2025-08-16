import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FILE_SERVICE_CONFIG,
  IFileServiceConfig,
  SharedModule,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from './+state/crud.facade';
import { CrudComponentsModule } from './components';
import { CrudFullModule } from './crud-full.module';
import { CrudConfig, CrudFullConfig } from './crud.config';
import { CrudListPaginationFactory } from './factories/list-pagination/list-pagination.factory';
import { CrudPipesModule } from './pipes';
import { CrudService } from './services/crud/crud.service';
import { CrudListGroupService } from './services/list-group/list-group.service';
import { PageService } from './services/page/page.service';

@NgModule({
  imports: [
    SharedModule,
    CrudPipesModule,
    FormsModule,
    CommonModule,
    CrudComponentsModule,
  ],
  exports: [CrudComponentsModule],
  providers: [
    CrudService,
    CrudListGroupService,
    PageService,
    CrudFacade,
    CrudListPaginationFactory,
  ],
})
export class CrudCoreModule{}

@NgModule({})
export class CrudModule<T extends IEntity<string>> {
  static forFeature<T extends IEntity<string>>(
    options:
      | ICrudModuleOptionsWithRoutng<T>
      | ICrudModuleOptionsWithoutRoutng<T>,
  ): ModuleWithProviders<CrudModule<any>> {
    return {
      ngModule: options.routing ? CrudFullModule : CrudCoreModule,
      providers: [
        { provide: CrudConfig, useValue: options.config },
        { provide: CrudFullConfig, useValue: options.config },
        {
          provide: FILE_SERVICE_CONFIG,
          useValue: { apiUrl: options.config.apiUrl } as IFileServiceConfig,
        },
      ],
    };
  }
}

export interface ICrudModuleOptionsWithRoutng<T> {
  config: CrudFullConfig<T>;
  socket?: boolean;
  routing: true;
}

export interface ICrudModuleOptionsWithoutRoutng<T> {
  config: CrudConfig<T>;
  socket?: boolean;
  routing: false;
}

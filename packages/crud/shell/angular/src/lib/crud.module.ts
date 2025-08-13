import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { IEntity } from "@smartsoft001/domain-core";
import {
  FILE_SERVICE_CONFIG,
  IFileServiceConfig,
  SharedModule,
} from "@smartsoft001/angular";

import { CrudConfig, CrudFullConfig } from "./crud.config";
import { CrudService } from "./services/crud/crud.service";
import { CrudFacade } from "./+state/crud.facade";
import { CrudPipesModule } from './pipes';
import { CrudFullModule } from "./crud-full.module";
import {NotSocketService, SocketService} from "./services/socket/socket.service";
import { CrudListPaginationFactory } from "./factories/list-pagination/list-pagination.factory";
import { CrudComponentsModule } from './components';
import {PageService} from "./services/page/page.service";
import {CrudListGroupService} from "./services/list-group/list-group.service";

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
    SocketService,
    CrudListPaginationFactory,
  ],
})
export class CrudCoreModule<T extends IEntity<string>> {
  constructor(config: CrudConfig<T>) {}
}

@NgModule({})
export class CrudModule<T extends IEntity<string>> {
  static forFeature<T extends IEntity<string>>(
    options:
      | ICrudModuleOptionsWithRoutng<T>
      | ICrudModuleOptionsWithoutRoutng<T>
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
        ...(
            options.socket
                ? [SocketService]
                : [{ provide: SocketService, useClass: NotSocketService }]
        ),
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

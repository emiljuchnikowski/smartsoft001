import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Store, StoreModule} from "@ngrx/store";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {NgrxStoreService, SharedModule} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";

import {CrudConfig} from "./crud.config";
import {CrudEffects} from "./+state/crud.effects";
import {getReducer} from "./+state/crud.reducer";
import {ListComponent} from "./pages/list/list.component";
import {ItemComponent} from "./pages/item/item.component";
import {CrudPipesModule} from "./pipes/pipes.module";
import { CrudService } from './services/crud/crud.service';
import { CrudFacade } from './+state/crud.facade';
import {CrudListPaginationFactory} from "./factories/list-pagination/list-pagination.factory";
import {CrudComponentsModule} from "./components/components.module";
import {PageService} from "./services/page/page.service";
import {ListStandardComponent} from "./pages/list/standard/standard.component";
import {ItemStandardComponent} from "./pages/item/standard/standard.component";
import {CrudListGroupService} from "./services/list-group/list-group.service";

export const PAGES = [
    ItemComponent,
    ListComponent,
    ListStandardComponent,
    ItemStandardComponent
];

@NgModule({
    declarations: [
        ...PAGES
    ],
    imports: [
        StoreModule,
        SharedModule,
        CrudPipesModule,
        RouterModule.forChild([
            { path: '', component: ListComponent },
            { path: 'add', component: ItemComponent },
            { path: ':id', component: ItemComponent }
        ]),
        FormsModule,
        CommonModule,
        CrudComponentsModule
    ],
    exports: [
        ...PAGES,
        CrudComponentsModule
    ],
    providers: [
        CrudService,
        CrudListGroupService,
        PageService,
        CrudEffects,
        CrudFacade,
        CrudListPaginationFactory,
    ]
})
export class CrudFullModule<T extends IEntity<string>> {
    constructor(store: Store<any>, config: CrudConfig<T>, effects: CrudEffects<any>) {
        NgrxStoreService.addReducer(
            config.entity,
            config.reducerFactory
                ? config.reducerFactory()
                : getReducer(config.entity)
        );
        effects.init();
    }
}

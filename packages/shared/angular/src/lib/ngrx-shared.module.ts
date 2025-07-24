import {NgModule} from "@angular/core";
import {EffectsModule} from "@ngrx/effects";
import {Store, StoreModule} from "@ngrx/store";
import {routerReducer} from "@ngrx/router-store";

import {ErrorEffects} from "./+state/error.effects";
import {SharedModule} from "./shared.module";
import {NgrxStoreService} from "./services/ngrx-store/ngrx-store.service";

@NgModule({
    providers: [
        NgrxStoreService
    ],
    imports: [
        SharedModule,
        StoreModule.forFeature('router', routerReducer),
        EffectsModule.forFeature([ ErrorEffects ])
    ]
})
export class NgrxSharedModule {
    constructor(store: Store<any>, storeService: NgrxStoreService) {
        storeService.connect(store);
    }
}

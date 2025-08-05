import {NgModule} from "@angular/core";

import {SharedModule} from "./shared.module";

@NgModule({
    imports: [
        SharedModule,
        // StoreModule.forFeature('router', routerReducer),
        // EffectsModule.forFeature([ ErrorEffects ])
    ]
})
export class NgrxSharedModule {
    constructor() {}
}

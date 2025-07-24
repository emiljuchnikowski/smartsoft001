import {NgModule} from "@angular/core";

import {FormOptionsPipe} from "./form-options/form-options.pipe";

@NgModule({
    declarations: [
        FormOptionsPipe
    ],
    exports: [
        FormOptionsPipe
    ]
})
export class CrudPipesModule {

}

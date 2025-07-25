import {NgModule} from "@angular/core";

import {ModelLabelPipe} from "./model-label/model-label.pipe";

export const PIPES = [
    ModelLabelPipe
];

@NgModule({
    declarations: [],
    imports: [
        PIPES
    ],
    exports: [...PIPES]
})
export class SharedPipesModule {

}

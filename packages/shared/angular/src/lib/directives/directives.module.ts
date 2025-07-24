import {NgModule} from "@angular/core";

import {SharedServicesModule} from "../services/services.module";
import {DynamicContentDirective} from "./dynamic-content/dynamic-content.directive";

const DIRECTIVES = [
    DynamicContentDirective,
];

@NgModule({
    imports: [
        SharedServicesModule
    ],
    declarations: [
        ...DIRECTIVES
    ],
    exports: [
        ...DIRECTIVES
    ]
})
export class SharedDirectivesModule {

}

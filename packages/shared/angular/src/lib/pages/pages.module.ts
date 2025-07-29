import {NgModule} from "@angular/core";
import {IonicModule} from "@ionic/angular";

import {SharedServicesModule} from "../services/services.module";
import {DetailsPage} from "./details/details.page";
import {SharedComponentsModule} from "../components/components.module";
import {SharedDirectivesModule} from "../directives/directives.module";

const COMPONENTS = [
    DetailsPage
];

@NgModule({
    imports: [
        IonicModule,
        SharedServicesModule,
        SharedComponentsModule,
        SharedDirectivesModule,
        COMPONENTS
    ],
    declarations: [

    ],
    exports: [
        ...COMPONENTS
    ]
})
export class SharedPagesModule {

}

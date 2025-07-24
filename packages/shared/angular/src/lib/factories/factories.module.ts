import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";

import {FormFactory} from "./form/form.factory";

@NgModule({
    imports: [
      ReactiveFormsModule
    ],
    providers: [
        FormFactory
    ]
})
export class SharedFactoriesModule {

}

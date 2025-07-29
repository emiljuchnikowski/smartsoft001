import {NgModule} from "@angular/core";

import {ModelLabelPipe} from "./model-label/model-label.pipe";
import { ListCellPipe } from './list-cell/list-cell.pipe';
import { TrustHtmlPipe } from './trust-html/trust-html.pipe';
import { ListHeaderPipe } from './list-header/list-header.pipe';

export const PIPES = [
    ModelLabelPipe,
    ListCellPipe,
    TrustHtmlPipe,
    ListHeaderPipe
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

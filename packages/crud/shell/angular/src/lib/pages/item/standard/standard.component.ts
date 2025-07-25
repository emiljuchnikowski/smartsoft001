import {Component} from "@angular/core";

import {IEntity} from "@smartsoft001/domain-core";

import {CrudItemPageBaseComponent} from "../base/base.component";
import { DetailsComponent, FormComponent } from '@smartsoft001/angular';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormOptionsPipe } from '../../../pipes';

@Component({
    selector: 'smart-crud-item-standard-page',
    template: `
        @if (mode === 'details') {
            @if (detailsOptions) {
                <smart-details [options]='detailsOptions'></smart-details>
            }
        } @else {
            <ng-container [ngTemplateOutlet]="editTpl"></ng-container>
        }

        <ng-template #editTpl>
            <smart-form
              [options]="(selected$ | async) | smartFormOptions : mode:config?.type:uniqueProvider : config.inputComponents"
              (valuePartialChange)="onPartialChange.emit($event)"
              (valueChange)="onChange.emit($event)"
              (validChange)="onValidChange.emit($event)"
            ></smart-form>
        </ng-template>

        <br/><br/>
    `,
    styleUrls: ['./standard.component.scss'],
    imports: [
        DetailsComponent,
        FormComponent,
        AsyncPipe,
        FormOptionsPipe,
        NgTemplateOutlet
    ]
})
export class ItemStandardComponent<T extends IEntity<string>> extends CrudItemPageBaseComponent<T> {}

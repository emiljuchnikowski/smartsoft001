import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { DetailsComponent, FormComponent } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { FormOptionsPipe } from '../../../pipes';
import { CrudItemPageBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-crud-item-standard-page',
  template: `
    @if (mode() === 'details') {
      @if (detailsOptions()) {
        <smart-details [options]="detailsOptions()"></smart-details>
      }
    } @else {
      <ng-container [ngTemplateOutlet]="editTpl"></ng-container>
    }

    <ng-template #editTpl>
      <smart-form
        [options]="
          selected()
            | smartFormOptions
              : mode()
              : config?.type
              : uniqueProvider()
              : config.inputComponents
        "
        (valuePartialChange)="onPartialChange.emit($event)"
        (valueChange)="onChange.emit($event)"
        (validChange)="onValidChange.emit($event)"
      ></smart-form>
    </ng-template>

    <br /><br />
  `,
  styleUrls: ['./standard.component.scss'],
  imports: [
    DetailsComponent,
    FormComponent,
    FormOptionsPipe,
    NgTemplateOutlet,
    FormComponent,
  ],
})
export class ItemStandardComponent<
  T extends IEntity<string>,
> extends CrudItemPageBaseComponent<T> {}

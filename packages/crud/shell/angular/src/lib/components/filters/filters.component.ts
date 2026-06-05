import { Component } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { FilterComponent } from '../filter';
import { FiltersBaseComponent } from './base/base.component';

/**
 * This component is only to use in crud module
 * @requires CrudModule
 * @example
 *
 * html: <smart-crud-filters></smart-crud-filters>
 *
 * use on the model:
 * @Model({
    titleKey: 'body',
    filters: [
        {
            label: 'testNegation',
            key: 'body',
            type: '!=',
        },
        {
            label: 'fromDate',
            key: 'createDate',
            type: '<=',
            fieldType: FieldType.dateWithEdit
        },
        {
            label: 'select',
            key: 'type',
            type: '=',
            fieldType: FieldType.radio,
            possibilities$: of([
                {
                    id: 1, text: 'Test 1'
                },
                {
                    id: 2, text: 'Test 2'
                }
            ])
        }
    ]
})
 *
 * use on the field (list.filter property):
 * @Field({
        create: modifyMetdata,
        update: {
            ...modifyMetdata,
            multi: true
        },
        type: FieldType.longText,
        details: true,
        list: {
            order: 2,
            filter: true
        }
    })
 body: string;
 */
@Component({
  selector: 'smart-crud-filters',
  template: `
    <!--<ion-header [hidden]="hideMenu()">-->
    <!--  <ion-toolbar>-->
    <!--    <ion-buttons slot="end">-->
    <!--      <ion-button (click)="onClose()">-->
    <!--        <ion-icon slot="icon-only" name="close"> </ion-icon>-->
    <!--      </ion-button>-->
    <!--    </ion-buttons>-->
    <!--    <ion-title>{{ 'filters' | translate }}</ion-title>-->
    <!--  </ion-toolbar>-->
    <!--</ion-header>-->
    <!--<ion-content style="height: 100vh">-->
    <!--  <ion-list>-->
    @for (item of list(); track item) {
      <smart-crud-filter [item]="item" [filter]="filter()"></smart-crud-filter>
    }
    <!--  </ion-list>-->
    <div class="h-20">&nbsp;</div>
    <!--</ion-content>-->
  `,
  imports: [FilterComponent],
})
export class FiltersComponent<
  T extends IEntity<string>,
> extends FiltersBaseComponent<T> {}

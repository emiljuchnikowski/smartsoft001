import { Component, ElementRef, input, InputSignal, OnInit, Signal, WritableSignal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import {MenuService, StyleService} from "@smartsoft001/angular";
import {
    FieldType,
    getModelFieldsWithOptions,
    getModelOptions,
    IFieldListMetadata,
    IModelFilter
} from "@smartsoft001/models";
import {IEntity} from "@smartsoft001/domain-core";

import {ICrudFilter} from '../../models';
import {CrudConfig} from "../../crud.config";
import {CrudFacade} from "../../+state/crud.facade";
import { FilterComponent } from '../filter';

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
  templateUrl: './filters.component.html',
  imports: [
    FilterComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonList,
    TranslatePipe
  ],
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent<T extends IEntity<string>> implements OnInit {
  list: WritableSignal<Array<IModelFilter>>;

  filter: Signal<ICrudFilter | undefined>;

    /**
     * Hide menu used only from MenuService
     */
  readonly hideMenu: InputSignal<boolean> = input<boolean>(false);

  constructor(
      private menuService: MenuService,
      private config: CrudConfig<T>,
      private facade: CrudFacade<T>,
      private styleService: StyleService,
      private elementRef: ElementRef
  ) { }

  async onClose(): Promise<void> {
    await this.menuService.closeEnd();
  }

  ngOnInit(): void {
      this.styleService.init(this.elementRef);

    const modelFilters = getModelOptions(this.config.type).filters;

    this.list.set([
        ...(modelFilters ? modelFilters.map(item => {
          if (!item.label) {
            item.label = 'MODEL.' + item.key;
          }
          return item;
        }) : []),
        ...getModelFieldsWithOptions(new this.config.type())
            .filter(item => (item.options?.list as IFieldListMetadata)?.filter)
            .map(item => ({
              key: item.key,
              type: item.options.type === FieldType.text || item.options.type === FieldType.longText
                  ? '~=' as '~=' : '=' as '=',
              label: 'MODEL.' + item.key,
              fieldType: item.options.type
            }))
    ]);
    this.filter = this.facade.filter;
  }
}

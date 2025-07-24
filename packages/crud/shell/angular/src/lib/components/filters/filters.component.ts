import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {AuthService, MenuService, StyleService} from "@smartsoft001/angular";
import {
    FieldType,
    getModelFieldsWithOptions,
    getModelOptions,
    IFieldListMetadata,
    IModelFilter
} from "@smartsoft001/models";
import {IEntity} from "@smartsoft001/domain-core";

import {ICrudFilter} from "../../models/interfaces";
import {CrudConfig} from "../../crud.config";
import {CrudFacade} from "../../+state/crud.facade";

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
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent<T extends IEntity<string>> implements OnInit {
  list: Array<IModelFilter>;

  filter$: Observable<ICrudFilter>;

    /**
     * Hide menu used only from MenuService
     */
  @Input() hideMenu: boolean;

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

    this.list = [
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
    ];
    this.filter$ = this.facade.filter$;
  }
}

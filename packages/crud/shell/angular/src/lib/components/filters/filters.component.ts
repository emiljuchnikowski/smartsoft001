import {
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  WritableSignal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MenuService, StyleService } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import {
  FieldType,
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldListMetadata,
  IModelFilter,
} from '@smartsoft001/models';

import { CrudFacade } from '../../+state/crud.facade';
import { CrudConfig } from '../../crud.config';
import { ICrudFilter } from '../../models';
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
  imports: [FilterComponent, TranslatePipe],
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent<T extends IEntity<string>> implements OnInit {
  private menuService = inject(MenuService);
  private config = inject(CrudConfig<T>);
  private facade = inject(CrudFacade<T>);
  private styleService = inject(StyleService);
  private elementRef = inject(ElementRef);

  list: WritableSignal<Array<IModelFilter>>;

  filter: Signal<ICrudFilter | undefined>;

  /**
   * Hide menu used only from MenuService
   */
  readonly hideMenu: InputSignal<boolean> = input<boolean>(false);

  async onClose(): Promise<void> {
    await this.menuService.closeEnd();
  }

  ngOnInit(): void {
    this.styleService.init(this.elementRef);

    const modelFilters = getModelOptions(this.config.type).filters;

    this.list.set([
      ...(modelFilters
        ? modelFilters.map((item) => {
            if (!item.label) {
              item.label = 'MODEL.' + item.key;
            }
            return item;
          })
        : []),
      ...getModelFieldsWithOptions(new this.config.type())
        .filter((item) => (item.options?.list as IFieldListMetadata)?.filter)
        .map((item) => ({
          key: item.key,
          type:
            item.options.type === FieldType.text ||
            item.options.type === FieldType.longText
              ? ('~=' as const)
              : ('=' as const),
          label: 'MODEL.' + item.key,
          fieldType: item.options.type,
        })),
    ]);
    this.filter = this.facade.filter;
  }
}

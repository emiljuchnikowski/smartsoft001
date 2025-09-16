import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  computed,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  Signal,
  TemplateRef,
  viewChild,
  viewChildren,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import {
  CreateDynamicComponent,
  DynamicComponentLoader,
  DynamicContentDirective,
  HardwareService,
  IIconButtonOptions,
  IListOptions,
  IPageOptions,
  ListMode,
  MenuService,
  PageComponent,
} from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldEditMetadata,
  IFieldListMetadata,
} from '@smartsoft001/models';
import { SpecificationService } from '@smartsoft001/utils';

import { CrudFacade } from '../../+state/crud.facade';
import { ExportComponent } from '../../components';
import { FiltersComponent } from '../../components';
import { MultiselectComponent } from '../../components';
import { CrudFullConfig } from '../../crud.config';
import { CrudListPageBaseComponent } from './base/base.component';
import { CrudListPaginationFactory } from '../../factories/list-pagination/list-pagination.factory';
import { ICrudFilter } from '../../models';
import { ListStandardComponent } from './standard/standard.component';
import { PageService } from '../../services/page/page.service';
import { CrudSearchService } from '../../services/search/search.service';

@Component({
  selector: 'smart-crud-list-page',
  imports: [PageComponent, ListStandardComponent, NgTemplateOutlet],
  template: `
    @if (filter()) {
      <smart-page [options]="pageOptions()">
        <div #topTpl></div>

        @if (template() === 'default') {
          <smart-crud-list-standard-page [listOptions]="listOptions()">
            <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
          </smart-crud-list-standard-page>
        }
        <ng-template #contentTpl>
          <ng-content></ng-content>
        </ng-template>
        <div class="dynamic-content"></div>
      </smart-page>
    }
  `,
})
export class ListComponent<T extends IEntity<string>>
  extends CreateDynamicComponent<CrudListPageBaseComponent<any>>(
    'crud-list-page',
  )
  implements OnInit, OnDestroy
{
  private facade = inject(CrudFacade<T>);
  private router = inject(Router);
  private dynamicComponentLoader = inject(DynamicComponentLoader<T>);
  private injector = inject(Injector);
  private cd = inject(ChangeDetectorRef);
  private menuService = inject(MenuService);
  private hardwareService = inject(HardwareService);
  private paginationFacade = inject(CrudListPaginationFactory<T>);
  private pageService = inject(PageService<T>);
  public config = inject(CrudFullConfig<T>);
  private searchService = inject(CrudSearchService);

  private _cleanMultiSelected$ = new Subject<void>();

  pageOptions!: Signal<IPageOptions>;
  listOptions!: WritableSignal<IListOptions<T>>;
  links: { next: any; prev: any };

  filter: Signal<ICrudFilter | undefined> = this.facade.filter;

  topTpl = viewChild<ViewContainerRef>('topTpl');

  override contentTpl = viewChild<TemplateRef<any>>('contentTpl');

  override dynamicContents = viewChildren<DynamicContentDirective>(
    DynamicContentDirective,
  );

  constructor() {
    super();

    this.links = this.facade.links();
  }

  override refreshProperties(): void {
    this.baseComponentRef.setInput('listOptions', this.listOptions());
  }

  async ngOnInit(): Promise<void> {
    this.pageService.checkPermissions();

    const options = getModelOptions(this.config.type);

    let newFilter = null;

    if (this.config.list?.resetQuery === 'beforeInit') {
      newFilter = {
        query: this.config.baseQuery ? [...this.config.baseQuery] : [],
        paginationMode: this.config.list!.paginationMode,
        limit: this.config.pagination
          ? this.config.pagination.limit
          : undefined,
        offset: this.config.pagination ? 0 : undefined,
        sortBy: this.config.sort
          ? (this.config.sort as any)['default']
          : undefined,
        sortDesc: this.config.sort
          ? (this.config.sort as any)['defaultDesc']
          : undefined,
        ...this.searchService.filter,
      };
    } else if (this.filter()) {
      newFilter = this.filter();
    } else {
      newFilter = {
        paginationMode: this.config.list!.paginationMode,
        limit: this.searchService.filter?.limit
          ? this.searchService.filter.limit
          : this.config.pagination
            ? this.config.pagination.limit
            : undefined,
        offset:
          this.searchService.filter?.offset ||
          this.searchService.filter?.offset === 0
            ? this.searchService.filter.offset
            : this.config.pagination
              ? 0
              : undefined,
        sortBy: this.searchService.filter?.sortBy
          ? this.searchService.filter.sortBy
          : this.config.sort
            ? (this.config.sort as any)['default']
            : undefined,
        sortDesc: this.searchService.filter?.sortDesc
          ? this.searchService.filter.sortDesc
          : this.config.sort
            ? (this.config.sort as any)['defaultDesc']
            : undefined,
        query: this.config.baseQuery ? [...this.config.baseQuery] : [],
        ...this.searchService.filter,
      };
    }

    this.facade.read(newFilter);

    const endButtons = this.getEndButtons();

    this.pageOptions = computed(() => ({
      title: this.config.title || '',
      search: this.config.search
        ? {
            text: computed(() => this.filter()?.searchText ?? ''),
            set: (txt) => {
              if (txt !== this.filter()?.searchText)
                this.facade.read({
                  ...this.filter(),
                  searchText: txt,
                  offset: 0,
                });
            },
          }
        : undefined,
      endButtons: endButtons,
    }));

    const compiledComponents =
      await this.dynamicComponentLoader.getComponentsWithFactories({
        components: [
          ...(this.config.details &&
          typeof this.config.details === 'object' &&
          'components' in this.config.details &&
          this.config.details.components?.top
            ? [this.config.details.components.top]
            : []),
          ...(this.config.details &&
          typeof this.config.details === 'object' &&
          'components' in this.config.details &&
          this.config.details.components?.bottom
            ? [this.config.details.components.bottom]
            : []),
          ...(this.config.list &&
          typeof this.config.list === 'object' &&
          'components' in this.config.list &&
          this.config.list.components?.top
            ? [this.config.list.components.top]
            : []),
        ],
      });

    this.listOptions.set({
      provider: {
        getData: (filter): void => {
          const global = {
            ...this.filter(),
            ...filter,
          };
          this.facade.read(global);
        },
        onChangeMultiSelected: async (list) => {
          if (list.length && !this.menuService.openedEnd) {
            await this.menuService.openEnd({
              injector: this.injector,
              component: MultiselectComponent,
            });
          } else if (!list.length && this.menuService.openedEnd) {
            await this.menuService.closeEnd();
          }

          this.facade.multiSelect(list);
        },
        list: computed(() => this.facade.list() || []),
        loading: this.facade.loading,
        onCleanMultiSelected$: this._cleanMultiSelected$,
      },
      cellPipe: this.config.list ? this.config.list.cellPipe : undefined,
      mode: this.config.list?.mode,
      type: this.config.type,
      details: this.config.details
        ? {
            provider: {
              getData: (id) => {
                this.facade.select(id);
              },
              clearData: () => {
                this.facade.unselect();
              },
              item: this.facade.selected,
              loading: this.facade.loading,
            },
            componentFactories: {
              top:
                this.config.details &&
                typeof this.config.details === 'object' &&
                'components' in this.config.details &&
                this.config.details.components?.top
                  ? compiledComponents.find(
                      (cc) =>
                        cc.component ===
                        (this.config.details as any).components.top,
                    )?.factory
                  : undefined,
              bottom:
                this.config.details &&
                typeof this.config.details === 'object' &&
                'components' in this.config.details &&
                this.config.details.components?.bottom
                  ? compiledComponents.find(
                      (cc) =>
                        cc.component ===
                        (this.config.details as any).components.bottom,
                    )?.factory
                  : undefined,
            },
          }
        : undefined,
      item:
        !!this.config.edit || this.config.details
          ? {
              options: {
                routingPrefix: '/' + this.router.routerState.snapshot.url + '/',
                edit: !!this.config.edit,
              },
            }
          : undefined,
      remove: this.config.remove
        ? {
            provider: {
              invoke: (id) => this.facade.delete(id),
              check: (item: T) => {
                return options?.remove?.enabled
                  ? SpecificationService.valid(item, options?.remove?.enabled)
                  : true;
              },
            },
          }
        : undefined,
      pagination: await this.paginationFacade.create({
        mode: this.config.list!.paginationMode,
        limit: this.config.pagination!.limit,
        provider: {
          getFilter: () => {
            return this.filter() || ({} as ICrudFilter);
          },
          getLinks: () => this.links,
        },
      }),
      sort: this.config.sort,
    });

    this.cd.detectChanges();

    this.initCloseMenu();
    this.initTopComponent(compiledComponents);

    this.refreshDynamicInstance();
  }

  private initCloseMenu() {
    this.router.events.pipe(this.takeUntilDestroy).subscribe(async () => {
      await this.clear();
    });
  }

  private async clear() {
    await this.menuService.closeEnd();

    this.listOptions.update((val) => ({
      ...val,
      select: undefined,
    }));

    this.facade.multiSelect([]);
  }

  private getEndButtons(): Array<IIconButtonOptions> {
    const fieldsWithOptions = getModelFieldsWithOptions(new this.config.type());
    const modelOptions = getModelOptions(this.config.type);

    const showFilters =
      fieldsWithOptions.some(
        (x) => (x.options?.list as IFieldListMetadata)?.filter,
      ) || modelOptions?.filters?.length;

    const showMultiEdit =
      this.config.list?.components?.multi ||
      (this.config.edit &&
        fieldsWithOptions.some(
          (x) => (x.options?.update as IFieldEditMetadata)?.multi,
        ) &&
        !this.hardwareService.isMobile &&
        (!this.config?.list?.mode ||
          this.config?.list?.mode === ListMode.desktop));

    return [
      ...(showMultiEdit
        ? [
            {
              icon: 'checkbox-outline',
              text: 'multi',
              handler: () => {
                this.facade.multiSelect([]);
                this._cleanMultiSelected$.next();

                setTimeout(async () => {
                  this.listOptions.update((val) => ({
                    ...val,
                    select: val.select === 'multi' ? undefined : 'multi',
                  }));
                  if (this.menuService.openedEnd)
                    await this.menuService.closeEnd();
                  this.cd.detectChanges();
                });
              },
            },
          ]
        : []),
      ...(showFilters
        ? [
            {
              icon: 'filter-outline',
              text: 'filters',
              handler: async () => {
                await this.menuService.openEnd({
                  injector: this.injector,
                  component: FiltersComponent,
                });
              },
            },
          ]
        : []),
      ...(this.config.add
        ? [
            {
              icon: 'add',
              text: 'add',
              handler: () => {
                this.router.navigate([
                  '/' + this.router.routerState.snapshot.url + '/add',
                ]);
              },
            },
          ]
        : []),
      ...(this.config.export
        ? [
            {
              text: 'export',
              icon: 'download-outline',
              type: 'popover' as const,
              component: ExportComponent,
            },
          ]
        : []),
      ...(this.config.buttons ? this.config.buttons : []),
    ];
  }

  private initTopComponent(
    compiledComponents: {
      component: any;
      factory: ComponentFactory<any>;
    }[],
  ) {
    const factory =
      this.config.list &&
      typeof this.config.list === 'object' &&
      'components' in this.config.list &&
      this.config.list.components?.top
        ? compiledComponents.find(
            (cc) => cc.component === (this.config.list as any).components.top,
          )?.factory
        : null;

    setTimeout(() => {
      if (factory && !this.topTpl()?.get(0)) {
        this.topTpl()?.createComponent(factory);
      }
    });
  }
}

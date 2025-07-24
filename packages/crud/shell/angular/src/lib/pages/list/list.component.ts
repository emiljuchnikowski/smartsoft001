import {
  ChangeDetectorRef,
  Component,
  ComponentFactory, ComponentFactoryResolver, ElementRef,
  Injector, NgModuleRef, OnDestroy,
  OnInit, QueryList, TemplateRef,
  ViewChild, ViewChildren,
  ViewContainerRef,
} from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import {Observable, Subject} from "rxjs";

import {
  CreateDynamicComponent,
  DynamicComponentLoader, DynamicContentDirective,
  HardwareService,
  IIconButtonOptions,
  IListOptions,
  IPageOptions,
  ListMode,
  MenuService, StyleService,
} from "@smartsoft001/angular";
import { IEntity } from "@smartsoft001/domain-core";
import {
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldEditMetadata,
  IFieldListMetadata,
} from "@smartsoft001/models";

import { CrudFacade } from "../../+state/crud.facade";
import { CrudFullConfig } from "../../crud.config";
import { ICrudFilter } from "../../models/interfaces";
import { ExportComponent } from "../../components/export/export.component";
import { FiltersComponent } from "../../components/filters/filters.component";
import { MultiselectComponent } from "../../components/multiselect/multiselect.component";
import { CrudListPaginationFactory } from "../../factories/list-pagination/list-pagination.factory";
import {PageService} from "../../services/page/page.service";
import {CrudListPageBaseComponent} from "./base/base.component";
import {CrudSearchService} from "../../services/search/search.service";
import { SpecificationService } from "@smartsoft001/utils";

@Component({
  selector: "smart-crud-list-page",
  template: `
    <smart-page [options]="pageOptions" *ngIf="filter$ | async">
      <div #topTpl></div>
      <smart-crud-list-standard-page *ngIf="template === 'default'" [listOptions]="listOptions">
      <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </smart-crud-list-standard-page>
      <ng-template #contentTpl>
        <ng-content></ng-content>
      </ng-template>
      <div class="dynamic-content"></div>
    </smart-page>
  `
})
export class ListComponent<T extends IEntity<string>>
    extends CreateDynamicComponent<CrudListPageBaseComponent<any>>('crud-list-page')
  implements OnInit, OnDestroy
{
  private _cleanMultiSelected$ = new Subject<void>();

  pageOptions: IPageOptions;
  listOptions: IListOptions<T>;
  filter: ICrudFilter;
  links: { next; prev };

  filter$: Observable<ICrudFilter> = this.facade.filter$.pipe(
    tap((filter) => {
      this.filter = filter;
    })
  );

  @ViewChild("topTpl", { read: ViewContainerRef, static: false })
  topTpl: ViewContainerRef;

  @ViewChild("contentTpl", { read: TemplateRef, static: false })
  contentTpl: TemplateRef<any>;

  @ViewChildren(DynamicContentDirective, { read: DynamicContentDirective })
  dynamicContents = new QueryList<DynamicContentDirective>();

  constructor(
    private facade: CrudFacade<T>,
    private router: Router,
    private dynamicComponentLoader: DynamicComponentLoader<T>,
    private injector: Injector,
    private cd: ChangeDetectorRef,
    private menuService: MenuService,
    private hardwareService: HardwareService,
    private paginationFacade: CrudListPaginationFactory<T>,
    private styleService: StyleService,
    private elementRef: ElementRef,
    private pageService: PageService<T>,
    public config: CrudFullConfig<T>,
    private searchService: CrudSearchService,
    private moduleRef: NgModuleRef<any>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(cd, moduleRef, componentFactoryResolver);

    this.facade.links$.pipe(this.takeUntilDestroy).subscribe((links) => {
      this.links = links;
    });
  }

  refreshProperties(): void {
    this.baseInstance.listOptions = this.listOptions;
  }

  async ngOnInit(): Promise<void> {
    await this.pageService.checkPermissions();

    const options = getModelOptions(this.config.type);

    let newFilter = null;

    if (this.config.list?.resetQuery === 'beforeInit') {
      newFilter = {
        query: this.config.baseQuery ? [ ...this.config.baseQuery ] : [],
        paginationMode: this.config.list.paginationMode,
        limit: this.config.pagination ? this.config.pagination.limit : null,
        offset: this.config.pagination ? 0 : null,
        sortBy: this.config.sort ? this.config.sort["default"] : null,
        sortDesc: this.config.sort ? this.config.sort["defaultDesc"] : null,
        ...this.searchService.filter
      };
    } else if (this.filter) {
      newFilter = this.filter;
    } else {
      newFilter = {
        paginationMode: this.config.list.paginationMode,
        limit: this.searchService.filter?.limit ? this.searchService.filter.limit : this.config.pagination
            ? this.config.pagination.limit : null,
        offset: this.searchService.filter?.offset || this.searchService.filter?.offset === 0
            ? this.searchService.filter.offset : this.config.pagination ? 0 : null,
        sortBy: this.searchService.filter?.sortBy ? this.searchService.filter.sortBy : this.config.sort
            ? this.config.sort["default"] : null,
        sortDesc: this.searchService.filter?.sortDesc ? this.searchService.filter.sortDesc :  this.config.sort
            ? this.config.sort["defaultDesc"] : null,
        query: this.config.baseQuery ? [ ...this.config.baseQuery ] : [],
        ...this.searchService.filter
      };
    }

    this.facade.read(newFilter);

    const endButtons = this.getEndButtons();

    this.pageOptions = {
      title: this.config.title,
      search: this.config.search
        ? {
            text$: this.filter$.pipe(map((f) => (f ? f.searchText : null))),
            set: (txt) => {
              if (txt !== this.filter.searchText)
                this.facade.read({
                  ...this.filter,
                  searchText: txt,
                  offset: 0,
                });
            },
          }
        : null,
      endButtons: endButtons,
    };

    const compiledComponents =
      await this.dynamicComponentLoader.getComponentsWithFactories({
        components: [
          ...(this.config.details &&
          this.config.details["components"] &&
          this.config.details["components"].top
            ? [this.config.details["components"].top]
            : []),
          ...(this.config.details &&
          this.config.details["components"] &&
          this.config.details["components"].bottom
            ? [this.config.details["components"].bottom]
            : []),
          ...(this.config.list &&
          this.config.list["components"] &&
          this.config.list["components"].top
            ? [this.config.list["components"].top]
            : []),
        ],
      });

    this.listOptions = {
      provider: {
        getData: (filter): void => {
          const global = {
            ...this.filter,
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
        list$: this.facade.list$,
        loading$: this.facade.loaded$.pipe(map((l) => !l)),
        onCleanMultiSelected$: this._cleanMultiSelected$
      },
      cellPipe: this.config.list ? this.config.list.cellPipe : null,
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
              item$: this.facade.selected$,
              loading$: this.facade.loaded$.pipe(map((l) => !l)),
            },
            componentFactories: {
              top:
                this.config.details &&
                this.config.details["components"] &&
                this.config.details["components"].top
                  ? compiledComponents.find(
                      (cc) =>
                        cc.component === this.config.details["components"].top
                    ).factory
                  : null,
              bottom:
                this.config.details &&
                this.config.details["components"] &&
                this.config.details["components"].bottom
                  ? compiledComponents.find(
                      (cc) =>
                        cc.component ===
                        this.config.details["components"].bottom
                    ).factory
                  : null,
            },
          }
        : null,
      item:
        !!this.config.edit || this.config.details
          ? {
              options: {
                routingPrefix: "/" + this.router.routerState.snapshot.url + "/",
                edit: !!this.config.edit,
              },
            }
          : null,
      remove: this.config.remove
        ? {
            provider: {
              invoke: (id) => this.facade.delete(id),
              check: (item: T) => {
                return options?.remove?.enabled ? SpecificationService.valid(item, options?.remove?.enabled) : true;
              }
            },
          }
        : null,
      pagination: await this.paginationFacade.create({
        mode: this.config.list.paginationMode,
        limit: this.config.pagination.limit,
        provider: {
          getFilter: () => {
            return this.filter;
          },
          getLinks: () => this.links,
        },
      }),
      sort: this.config.sort,
    };

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

    this.listOptions = {
      ...this.listOptions,
      select: null,
    };

    this.facade.multiSelect([]);
  }

  private getEndButtons(): Array<IIconButtonOptions> {
    const fieldsWithOptions = getModelFieldsWithOptions(new this.config.type());
    const modelOptions = getModelOptions(this.config.type);

    const showFilters =
      fieldsWithOptions.some(
        (x) => (x.options?.list as IFieldListMetadata)?.filter
      ) || modelOptions?.filters?.length;

    const showMultiEdit =
        this.config.list?.components?.multi ||
        (
            this.config.edit &&
            fieldsWithOptions.some(
                (x) => (x.options?.update as IFieldEditMetadata)?.multi
            ) &&
            !this.hardwareService.isMobile &&
            (!this.config?.list?.mode ||
                this.config?.list?.mode === ListMode.desktop)
        );

    return [
      ...(showMultiEdit
        ? [
            {
              icon: "checkbox-outline",
              text: "multi",
              handler: () => {
                this.facade.multiSelect([]);
                this._cleanMultiSelected$.next();

                setTimeout(async () => {
                  this.listOptions = {
                    ...this.listOptions,
                    select: this.listOptions.select === "multi" ? null : "multi",
                  };
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
              icon: "filter-outline",
              text: "filters",
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
              icon: "add",
              text: "add",
              handler: () => {
                this.router.navigate([
                  "/" + this.router.routerState.snapshot.url + "/add",
                ]);
              },
            },
          ]
        : []),
      ...(this.config.export
        ? [
            {
              text: "export",
              icon: "download-outline",
              type: "popover" as "popover",
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
    }[]
  ) {
    const factory =
      this.config.list &&
      this.config.list["components"] &&
      this.config.list["components"].top
        ? compiledComponents.find(
            (cc) => cc.component === this.config.list["components"].top
          ).factory
        : null;

    setTimeout(() => {
      if (factory && !this.topTpl.get(0)) {
        this.topTpl.createComponent(factory);
      }
    });
  }
}

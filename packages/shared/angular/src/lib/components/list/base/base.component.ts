import { CdkTableDataSourceInput } from '@angular/cdk/table';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Injector,
  Type,
  ViewContainerRef,
  inject,
  Signal,
  computed,
  effect,
  input,
  InputSignal,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import {
  FieldType,
  IFieldListMetadata,
  IFieldOptions,
} from '@smartsoft001/models';

import { showDetailsModal } from '../../../directives/details/details-modal';
import {
  IDetailsOptions,
  IListProvider,
  IButtonOptions,
  ICellPipe,
  DynamicComponentType,
  PaginationMode,
  IListInternalOptions,
  IRemoveProvider,
  IDetailsProvider,
  IDetailsComponentFactories,
} from '../../../models';
import { DetailsPage } from '../../../pages/details/details.page';
import { AlertService, HardwareService, ModalService } from '../../../services';
import { AuthService } from '../../../services';
import {
  getListAriaSort,
  getListDefaultSort,
  getListSortIndicator,
  getNextListSort,
  IListSortFilter,
  IListSortState,
  isListSortableKey,
} from '../list-sort';

@Directive()
export abstract class ListBaseComponent<T extends IEntity<string>> {
  static smartType: DynamicComponentType = 'list';

  private _fields!: Array<{ key: string; options: IFieldOptions }>;

  protected provider!: IListProvider<T>;
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected alertService = inject(AlertService);
  protected cd = inject(ChangeDetectorRef);
  protected translateService = inject(TranslateService);
  protected injector = inject(Injector);

  private loadingNextPage = false;

  detailsComponent: any;
  selectMode?: 'multi';
  detailsComponentProps!: IDetailsOptions<T>;
  select!: (id: string) => void;
  unselect!: () => void;
  itemHandler: ((id: string) => void) | null = null;
  removeHandler: ((item: T) => void) | null = null;
  /**
   * Opens the details of an item in a modal (`details` set): `DetailsPage`, or
   * `details.component`, with `detailsComponentProps` as its `value`; `null`
   * without `details`.
   */
  detailsHandler: ((item: T) => void) | null = null;
  checkRemoveHandler!: (item: T) => boolean;
  detailsButtonOptions: IButtonOptions;
  removed: Set<string> = new Set<string>();
  keys!: Array<string>;
  cellPipe: ICellPipe<T> | null = null;
  loadPrevPage: ((event?: any) => void) | null = null;
  loadNextPage: ((event?: any) => void) | null = null;

  list!: Signal<CdkTableDataSourceInput<T> | null>;
  loading!: Signal<boolean>;
  page!: Signal<number | null>;
  totalPages!: Signal<number | null>;

  FieldType = FieldType;
  PaginationMode = PaginationMode;

  type!: Type<T>;
  sort!:
    | boolean
    | {
        default?: string;
        defaultDesc?: boolean;
      };

  options = input.required<IListInternalOptions<T>>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  /** Whether the column headers sort the list (`options.sort` set). */
  sortable: Signal<boolean> = computed(() => !!this.options().sort);

  /**
   * The sort the headers show: `sort.default` / `sort.defaultDesc` at first,
   * then the last header clicked. It starts over when `options.sort` changes.
   */
  activeSort = linkedSignal<
    IListInternalOptions<T>['sort'],
    IListSortState | null
  >({
    source: () => this.options().sort,
    // The source runs again on every new options object; keep the clicked
    // sort as long as the `sort` option itself is the same.
    computation: (sort, previous) =>
      previous && previous.source === sort
        ? previous.value
        : getListDefaultSort(sort),
  });

  /**
   * `true` with `pagination.mode === PaginationMode.infiniteScroll` and a next
   * page: the modes render the `#infiniteScrollAnchor` element after the
   * items, and the next page loads when it scrolls into view.
   */
  infiniteScroll: Signal<boolean> = computed(() => {
    const pagination = this.options().pagination;

    return (
      pagination?.mode === PaginationMode.infiniteScroll &&
      (pagination.page?.() ?? 1) < (pagination.totalPages?.() ?? 0)
    );
  });

  infiniteScrollAnchor = viewChild<ElementRef<HTMLElement>>(
    'infiniteScrollAnchor',
  );

  constructor() {
    effect(() => {
      const options = this.options();
      this._fields = options.fields ?? [];
      this.provider = options.provider;
      this.sort = options.sort ?? {};
      this.cellPipe = options.cellPipe ?? null;
      this.selectMode = options.select;
      this.type = options.type;
      this.initKeys();
      this.initList(options);
      this.initLoading();

      const removeHandler = options.remove as {
        provider?: IRemoveProvider<T>;
      };

      if (options.remove) {
        if (removeHandler?.provider?.check) {
          this.checkRemoveHandler = removeHandler.provider.check;
        }
        this.removeHandler = async (obj: T) => {
          await this.alertService.show({
            header: this.translateService.instant('OBJECT.confirmDelete'),
            buttons: [
              {
                text: this.translateService.instant('cancel'),
                role: 'cancel',
              },
              {
                text: this.translateService.instant('confirm'),
                handler: () => {
                  removeHandler?.provider?.invoke?.(obj.id);
                },
              },
            ],
            backdropDismiss: false,
          });
        };
      }

      if (options.item) {
        const itemOptions = (
          options.item as {
            options?: { select: (id: string) => void; routingPrefix: string };
          }
        ).options;

        if (!itemOptions) throw Error('Must set edit options');

        this.itemHandler = (id) => {
          if (itemOptions?.routingPrefix) {
            setTimeout(async () => {
              await this.router.navigate([
                itemOptions.routingPrefix.replace('//', '/'),
                id,
              ]);
              this.cd.detectChanges();
            });
          } else if (itemOptions?.select) itemOptions.select(id);
        };
      }

      const details = options.details as {
        provider?: IDetailsProvider<T>;
        componentFactories?: IDetailsComponentFactories<T>;
        component?: Type<any>;
      };

      this.detailsHandler = null;

      if (options.details) {
        if (!details?.provider) throw Error('Must set details provider');

        this.detailsComponent = details.component;
        this.detailsComponentProps = {
          item: details.provider.item,
          type: options.type,
          loading: details.provider.loading,
          itemHandler: this.itemHandler ?? null,
          removeHandler: this.removeHandler,
          componentFactories: details.componentFactories,
        };

        this.select = details.provider.getData;
        this.unselect = details.provider.clearData;
        this.detailsHandler = (item: T) => {
          void this.openDetails(item);
        };
      }

      if (options.pagination) {
        this.loadNextPage = async (event = null) => {
          await options?.pagination?.loadNextPage?.();
          if (event) event.target.complete();

          setTimeout(() => {
            window.scrollTo(0, 0);
          });
        };

        this.loadPrevPage = async (event = null) => {
          await options?.pagination?.loadPrevPage?.();
          if (event) event.target.complete();

          setTimeout(() => {
            window.scrollTo(0, 10000);
          });
        };

        this.page = options.pagination.page;
        this.totalPages = options.pagination.totalPages;
      }

      this.afterInitOptions();
    });

    effect((onCleanup) => {
      const pagination = this.options().pagination;
      const target = this.infiniteScrollAnchor()?.nativeElement;

      // Read on every page, so the anchor is observed again after a page
      // loaded: a new observer reports it at once while it is still in view.
      pagination?.page?.();

      if (
        !this.infiniteScroll() ||
        !target ||
        typeof IntersectionObserver === 'undefined'
      ) {
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (
          this.loadingNextPage ||
          !entries.some((entry) => entry.isIntersecting)
        ) {
          return;
        }

        this.loadingNextPage = true;

        Promise.resolve(pagination?.loadNextPage?.()).finally(() => {
          this.loadingNextPage = false;
        });
      });

      observer.observe(target);
      onCleanup(() => observer.disconnect());
    });

    this.detailsButtonOptions = {
      loading: this.loading,
      click: () => {
        this.unselect();
      },
    };
  }

  protected initKeys(data: Array<T> | null = null): void {
    const result: Array<T> = [];

    this._fields
      .filter((field) => {
        if (
          field.options.list &&
          (field.options.list as IFieldListMetadata).permissions
        ) {
          return this.authService.expectPermissions(
            (field.options.list as IFieldListMetadata)?.permissions ?? null,
          );
        }

        return true;
      })
      .forEach((field) => {
        if ((field.options.list as IFieldListMetadata).dynamic) {
          if (!data?.length) return;

          ((data[0] as any)[field.key] as [])
            .map(
              (_, index) =>
                `__array.${field.key}.${index}.${
                  (field.options.list as IFieldListMetadata)?.dynamic
                    ?.headerKey ?? ''
                }.${
                  (field.options.list as IFieldListMetadata)?.dynamic?.rowKey ??
                  ''
                }`,
            )
            .forEach((item) => result.push(item as unknown as T));

          return;
        }

        result.push(field.key as unknown as T);
      });

    if (!this.keys || this.keys.length !== result.length)
      this.keys = result as unknown as string[];
  }

  //The parameter is used in the inherited classes
  protected initList(val: IListInternalOptions<T>): void {
    this.list = computed(() => {
      const list = this.provider.list();
      if (!list) return list;
      const result = list.filter((item) => !this.removed.has(item.id));
      this.initKeys(list);

      return result;
    });
  }

  protected initLoading(): void {
    this.loading = this.provider.loading;
  }

  protected afterInitOptions() {
    // No base functionality
  }

  /** Whether the header of `key` sorts the list. */
  isSortable(key: string): boolean {
    return this.sortable() && isListSortableKey(key);
  }

  /**
   * Sorts by `key`: ascending for another column, the opposite direction for
   * the active one, read from the first page through
   * `provider.getData({ offset: 0, sortBy, sortDesc })`.
   */
  sortBy(key: string): void {
    if (!this.isSortable(key)) return;

    const next = getNextListSort(this.activeSort(), key);
    const filter: IListSortFilter = {
      offset: 0,
      sortBy: next.key,
      sortDesc: next.desc,
    };

    this.activeSort.set(next);
    this.provider.getData(filter);
  }

  /** The `aria-sort` of the header of `key` (only the active one has it). */
  ariaSort(key: string): 'ascending' | 'descending' | null {
    return this.isSortable(key)
      ? getListAriaSort(this.activeSort(), key)
      : null;
  }

  /** The arrow shown in the header of `key`. */
  sortIndicator(key: string): string {
    return getListSortIndicator(this.activeSort(), key);
  }

  /**
   * Opens the details of `item` in a modal: clears the details provider,
   * opens the details component (`DetailsPage` by default) through
   * `ModalService` and asks the provider for the item (`select(id)`).
   */
  async openDetails(item: T): Promise<void> {
    if (!this.select) return;

    this.unselect?.();

    await showDetailsModal(
      {
        modalService: this.injector.get(ModalService),
        hardwareService: this.injector.get(HardwareService),
        injector: this.injector,
      },
      {
        component: this.detailsComponent ?? DetailsPage,
        params: this.detailsComponentProps,
        mode: 'bottom',
      },
      { showed: () => this.select(item.id) },
    );
  }

  handlePageChange(nextPage: number): void {
    const current = this.page?.() ?? 1;
    if (nextPage > current) {
      this.loadNextPage?.();
    } else if (nextPage < current) {
      this.loadPrevPage?.();
    }
  }
}

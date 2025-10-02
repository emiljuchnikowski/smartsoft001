import { CdkTableDataSourceInput } from '@angular/cdk/table';
import {
  ChangeDetectorRef,
  Directive,
  Type,
  ViewContainerRef,
  inject,
  Signal,
  computed,
  effect,
  input,
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
import { AlertService } from '../../../services';
import { AuthService } from '../../../services';

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

  detailsComponent: any;
  selectMode?: 'multi';
  detailsComponentProps!: IDetailsOptions<T>;
  select!: (id: string) => void;
  unselect!: () => void;
  itemHandler: ((id: string) => void) | null = null;
  removeHandler: ((item: T) => void) | null = null;
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

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

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

      if (options.details) {
        if (!details?.provider) throw Error('Must set details provider');
        if (!details?.component) throw Error('Must set details component');

        this.detailsComponent = details.component;
        this.detailsComponentProps = {
          item: details?.provider.item,
          type: options.type,
          loading: details?.provider.loading,
          itemHandler: this.itemHandler ?? null,
          removeHandler: this.removeHandler,
          componentFactories: details?.componentFactories,
        };

        this.select = details?.provider.getData;
        this.unselect = details?.provider.clearData;
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
}

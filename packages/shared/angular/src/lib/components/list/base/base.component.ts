import { CdkTableDataSourceInput } from '@angular/cdk/table';
import {
  ChangeDetectorRef,
  Input,
  Directive,
  Type,
  ViewChild,
  ViewContainerRef,
  inject,
  Signal,
  computed,
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
import { DetailsPage } from '../../../pages';
import { AlertService } from '../../../services';
import { AuthService } from '../../../services';

@Directive()
export abstract class ListBaseComponent<T extends IEntity<string>> {
  static smartType: DynamicComponentType = 'list';

  private _fields!: Array<{ key: string; options: IFieldOptions }>;
  private _internalOptions!: IListInternalOptions<T>;

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

  @Input() set options(val: IListInternalOptions<T>) {
    this._internalOptions = val;
    this._fields = val.fields ?? [];
    this.provider = val.provider;
    this.sort = val.sort ?? {};
    this.cellPipe = val.cellPipe ?? null;
    this.selectMode = val.select;
    this.type = val.type;
    this.initKeys();
    this.initList(val);
    this.initLoading();

    const removeHandler = val.remove as {
      provider?: IRemoveProvider<T>;
    };

    if (val.remove) {
      if (removeHandler?.provider?.check) {
        this.checkRemoveHandler = removeHandler.provider.check;
      }
      this.removeHandler = async (obj: T) => {
        const alertResult = await this.alertService.show({
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

    if (val.item) {
      const options = (
        val.item as {
          options?: { select: (id: string) => void; routingPrefix: string };
        }
      ).options;

      if (!options) throw Error('Must set edit options');

      this.itemHandler = (id) => {
        if (options?.routingPrefix) {
          setTimeout(async () => {
            await this.router.navigate([
              options.routingPrefix.replace('//', '/'),
              id,
            ]);
            this.cd.detectChanges();
          });
        } else if (options?.select) options.select(id);
      };
    }

    const details = val.details as {
      provider?: IDetailsProvider<T>;
      componentFactories?: IDetailsComponentFactories<T>;
    };

    if (val.details) {
      if (!details?.provider) throw Error('Must set details provider');

      this.detailsComponent = DetailsPage;
      this.detailsComponentProps = {
        item: details?.provider.item,
        type: val.type,
        loading: details?.provider.loading,
        itemHandler: this.itemHandler ?? null,
        removeHandler: this.removeHandler,
        componentFactories: details?.componentFactories,
      };

      this.select = details?.provider.getData;
      this.unselect = details?.provider.clearData;
    }

    if (val.pagination) {
      this.loadNextPage = async (event = null) => {
        await val?.pagination?.loadNextPage?.();
        if (event) event.target.complete();

        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      };

      this.loadPrevPage = async (event = null) => {
        await val?.pagination?.loadPrevPage?.();
        if (event) event.target.complete();

        setTimeout(() => {
          window.scrollTo(0, 10000);
        });
      };

      this.page = val.pagination.page;
      this.totalPages = val.pagination.totalPages;
    }

    this.afterInitOptions();
  }

  get options(): IListInternalOptions<T> {
    return this._internalOptions;
  }

  @ViewChild('contentTpl', { read: ViewContainerRef, static: true })
  contentTpl!: ViewContainerRef;

  constructor() {
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
  };
}

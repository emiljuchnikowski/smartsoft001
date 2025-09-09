import {
  AfterViewInit,
  ViewContainerRef,
  Directive,
  WritableSignal,
  signal,
  Signal,
  computed,
  untracked,
  viewChild,
  input,
  effect,
  inject,
} from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  IFieldDetailsMetadata,
  IFieldOptions,
  ISpecification,
} from '@smartsoft001/models';
import { ObjectService, SpecificationService } from '@smartsoft001/utils';

import {
  DynamicComponentType,
  ICellPipe,
  IDetailsComponentFactories,
  IDetailsOptions,
} from '../../../models';
import { AuthService } from '../../../services';
import { DetailsService } from '../../../services';

@Directive()
export abstract class DetailsBaseComponent<T extends IEntity<string>>
  implements AfterViewInit
{
  private authService = inject(AuthService);
  private detailsService = inject(DetailsService);

  static smartType: DynamicComponentType = 'details';

  private _fields: WritableSignal<Array<{
    key: string;
    options: IFieldOptions;
  }> | null> = signal(null);
  private _type: any | null = null; //!Is being instantiated with the "new" and doesn't quite work with signals

  componentFactories: IDetailsComponentFactories<T> | null = null;
  cellPipe: WritableSignal<ICellPipe<T> | null> = signal(null);

  get fields(): Array<{ key: string; options: IFieldOptions }> | null {
    return this._fields();
  }

  get type(): any {
    return this._type;
  }

  item: Signal<T | undefined> | undefined;
  loading: Signal<boolean> | undefined;

  contentTpl = viewChild<ViewContainerRef | undefined>('contentTpl');
  topTpl = viewChild<ViewContainerRef | undefined>('topTpl');
  bottomTpl = viewChild<ViewContainerRef | undefined>('bottomTpl');

  options = input<IDetailsOptions<T> | undefined>(undefined);

  constructor() {
    effect(() => {
      const options = this.options();
      this._type = options?.type;

      const enabledDefinitions: Array<{
        key: string;
        spec: ISpecification | null;
      }> = [];

      this._fields.set(
        getModelFieldsWithOptions(new this._type())
          .filter((f) => f.options.details)
          .filter((field) => {
            if ((field.options.details as IFieldDetailsMetadata).enabled) {
              enabledDefinitions.push({
                key: field.key,
                spec:
                  (field.options.details as IFieldDetailsMetadata)?.enabled ??
                  null,
              });
            } else if (field.options.enabled) {
              enabledDefinitions.push({
                key: field.key,
                spec: field.options.enabled,
              });
            }

            return !(
              (field.options.details as IFieldDetailsMetadata).permissions &&
              !this.authService.expectPermissions(
                (field.options.details as IFieldDetailsMetadata)?.permissions ??
                  null,
              )
            );
          }),
      );
      if (options) {
        this.item = computed<T | undefined>(() => {
          const item = options?.item();
          if (!item) return item;

          let result = null;

          const type = options?.type;
          if (type && item instanceof type) result = item;
          else result = ObjectService.createByType(item, options);

          const removeFields = enabledDefinitions
            .filter((def) => {
              return SpecificationService.invalid(
                result,
                def.spec as ISpecification,
                {
                  $root: this.detailsService.$root,
                },
              );
            })
            .map((def) => def.key);

          untracked(() => {
            if (this._fields()) {
              this._fields.update((val) =>
                val?.length
                  ? val.filter((f) => !removeFields.some((rf) => rf === f.key))
                  : null,
              );
            }
          });

          return result as T;
        });

        this.loading = options?.loading;
        this.componentFactories = options.componentFactories ?? null;
        this.cellPipe.set(options.cellPipe ?? null);
      }

      this.generateDynamicComponents();
    });
  }

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  protected generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    const topTpl = this.topTpl();
    if (this.componentFactories.top && topTpl) {
      if (!topTpl.get(0)) {
        topTpl.createComponent(this.componentFactories.top);
      }
    }

    const bottomTpl = this.bottomTpl();
    if (this.componentFactories.bottom && bottomTpl) {
      if (!bottomTpl.get(0)) {
        bottomTpl.createComponent(this.componentFactories.bottom);
      }
    }
  }
}

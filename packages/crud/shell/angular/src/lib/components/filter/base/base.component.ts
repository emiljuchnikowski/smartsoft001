import {
  computed,
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Debounce } from 'lodash-decorators';

import { InputOptions } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, IModelFilter } from '@smartsoft001/models';

import { CrudFacade } from '../../../+state/crud.facade';
import { CrudConfig } from '../../../crud.config';
import { ICrudFilter } from '../../../models';
import { CRUD_MODEL_POSSIBILITIES_PROVIDER } from '../../../providers/model-possibilities/model-possibilities.provider';

@Directive()
export class BaseComponent<T extends IEntity<string>> implements OnInit {
  protected facade = inject(CrudFacade<T>);
  protected translateService = inject(TranslateService);
  protected config = inject(CrudConfig<T>);
  protected modelPossibilitiesProvider = inject(
    CRUD_MODEL_POSSIBILITIES_PROVIDER,
    { optional: true },
  );
  protected injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);

  private _model: T | undefined;

  possibilities!: Signal<{ id: any; text: string }[]>;

  readonly item: InputSignal<IModelFilter | undefined> = input<IModelFilter>();
  readonly filter: InputSignal<ICrudFilter | undefined> = input<ICrudFilter>();

  /**
   * OnPush-safe replacement for `@if (value)` in templates (partial GAP-19).
   * True when filter().query has a matching entry (key + type) with a
   * non-empty value.
   */
  readonly hasValue = computed<boolean>(() => {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return false;

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === item.type,
    );

    if (!query) return false;

    const val = query.value;
    return val !== null && val !== undefined && val !== '';
  });

  /** Lazily-built model instance used to derive field options/labels. */
  protected get model(): T {
    return (this._model ??= new this.config.type());
  }

  get value(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === item.type)
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === item.type,
    );
    return query?.value;
  }

  set value(val: any) {
    this.refresh(val);
  }

  get minValue(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === '>=')
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === '>=',
    );
    return query?.value;
  }

  set minValue(val: any) {
    this.refresh(val, '>=');
  }

  get maxValue(): any {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return null;

    if (this.isArrayType()) {
      return filter.query
        .filter((q) => q.key === item.key && q.type === '<=')
        .map((q) => q.value);
    }

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === '<=',
    );
    return query?.value;
  }

  set maxValue(val: any) {
    this.refresh(val, '<=');
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  @Debounce(500)
  refresh(val: any, type: string | null = null): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item) return;

    if (!type) type = item.type;
    if (!filter.query) filter.query = [];

    filter.offset = 0;

    if (this.isArrayType()) {
      this.refreshForArray(val as [], type);
      return;
    }

    let query = filter.query!.find(
      (q) => q.key === item.key && q.type === type,
    );

    if (val === null || val === undefined || val === '') {
      if (query) {
        const index = filter.query!.indexOf(query);
        if (index > -1) {
          filter.query!.splice(index, 1);
        }
      }

      this.facade.read(filter);
      return;
    }

    if (!query) {
      query = {
        key: item.key,
        type: type as '=' | '!=' | '>=' | '<=' | '<' | '>',
        value: null,
      };

      filter.query!.push(query);
    }

    query.value = val;
    query.label = item.label;

    this.facade.read(filter);
  }

  /**
   * Builds the `InputOptions` consumed by shared `smart-input-*` components for
   * a single reactive control. Omits possibilities (text filters do not need
   * them).
   */
  protected buildInputOptions(control: UntypedFormControl): InputOptions<any> {
    return {
      treeLevel: 0,
      control,
      model: this.model,
      fieldKey: this.item()?.key ?? '',
    };
  }

  /**
   * Creates a reactive control bridged to the legacy filter state: seeded from
   * the current `value` getter, and wired so every change re-runs the
   * (debounced) `refresh`.
   */
  protected bindValueControl(): UntypedFormControl {
    const control = new UntypedFormControl(this.value);

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.refresh(v));

    // TODO(GAP-19): re-sync control when filter() changes externally
    return control;
  }

  clear(): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item || !filter.query) return;

    filter.query = filter.query?.filter((q) => q.key !== item.key);
    filter.offset = 0;
    this.facade.read(filter);
  }

  ngOnInit(): void {
    this.initPossibilities();
  }

  private initPossibilities(): void {
    const item = this.item();
    if (!item) return;

    let possibilities = item.possibilities;

    if (this.modelPossibilitiesProvider) {
      const fromProvider = this.modelPossibilitiesProvider.get(
        this.config.type,
      );
      if (fromProvider && fromProvider[item.key]) {
        possibilities = toSignal(fromProvider[item.key], {
          initialValue: [] as { id: any; text: string }[],
          injector: this.injector,
        });
      }
    }

    if (possibilities) this.possibilities = possibilities;
  }

  private isArrayType(): boolean {
    const item = this.item();
    return item?.fieldType === FieldType.check;
  }

  private refreshForArray(vals: [], type: string): void {
    const filter = this.filter();
    const item = this.item();
    if (!filter || !item) return;
    if (!filter.query) filter.query = [];

    const queries =
      filter.query?.filter((q) => q.key === item.key && q.type === type) || [];

    queries.forEach((query) => {
      const index = filter.query!.indexOf(query);
      if (index > -1) {
        filter.query!.splice(index, 1);
      }
    });

    if (vals === null || vals === undefined || !vals.length) {
      this.facade.read(filter);
      return;
    }

    vals.forEach((val) => {
      const query = {
        key: item.key,
        type: type as '=' | '!=' | '>=' | '<=' | '<' | '>',
        value: val,
      };

      filter.query!.push(query);
    });

    this.facade.read(filter);
  }
}

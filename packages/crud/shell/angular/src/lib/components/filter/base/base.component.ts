import {
  computed,
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  signal,
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

  /**
   * Local, mutation-free working copy of the last filter this component pushed
   * to `facade.read(...)`. The store-bound `filter()` input is frozen under
   * NgRx `strictStateImmutability`, so refresh/clear operate on a clone; the
   * read getters (`value`, `minValue`, `maxValue`, `hasValue`, …) prefer this
   * pending copy until the real store update flows back through the input.
   */
  private _pendingFilter = signal<ICrudFilter | undefined>(undefined);

  /** Snapshot of `filter()` that `_pendingFilter` was derived from. */
  private _pendingFilterSource: ICrudFilter | undefined;

  possibilities!: Signal<{ id: any; text: string }[]>;

  readonly item: InputSignal<IModelFilter | undefined> = input<IModelFilter>();
  readonly filter: InputSignal<ICrudFilter | undefined> = input<ICrudFilter>();

  /**
   * The filter the component should read from: the pending working copy when it
   * is still in sync with the current input, otherwise the raw input. Once the
   * store update arrives (a new `filter()` reference), the pending copy is
   * considered stale and the fresh input wins.
   */
  protected readonly effectiveFilter = computed<ICrudFilter | undefined>(() => {
    const source = this.filter();
    const pending = this._pendingFilter();
    if (pending && source === this._pendingFilterSource) return pending;
    return source;
  });

  /**
   * OnPush-safe replacement for `@if (value)` in templates (partial GAP-19).
   * True when filter().query has a matching entry (key + type) with a
   * non-empty value.
   */
  readonly hasValue = computed<boolean>(() => {
    const filter = this.effectiveFilter();
    const item = this.item();
    if (!filter || !item || !filter.query) return false;

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === item.type,
    );

    if (!query) return false;

    const val = query.value;
    return val !== null && val !== undefined && val !== '';
  });

  /**
   * OnPush-safe replacement for `@if (minValue)` in templates (partial
   * GAP-19). True when filter().query has a matching `>=` entry (range "from")
   * with a non-empty value.
   */
  readonly hasMinValue = computed<boolean>(() => this.hasQueryValue('>='));

  /**
   * OnPush-safe replacement for `@if (maxValue)` in templates (partial
   * GAP-19). True when filter().query has a matching `<=` entry (range "to")
   * with a non-empty value.
   */
  readonly hasMaxValue = computed<boolean>(() => this.hasQueryValue('<='));

  /** Lazily-built model instance used to derive field options/labels. */
  protected get model(): T {
    return (this._model ??= new this.config.type());
  }

  get value(): any {
    const filter = this.effectiveFilter();
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
    const filter = this.effectiveFilter();
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
    const filter = this.effectiveFilter();
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

  /**
   * Returns a filter object safe to mutate. The store-bound `filter()` input is
   * frozen under NgRx `strictStateImmutability`, so when (any part of) the
   * source is frozen we hand back a deep-enough clone — object + query array +
   * query entries — leaving the store untouched. When the source is a plain,
   * extensible object (no immutability checks active) we keep operating on it in
   * place so consumers that hold the same reference still observe the change.
   */
  private cloneFilter(): ICrudFilter | undefined {
    const source = this.effectiveFilter();
    if (!source) return undefined;

    if (!this.isMutationSafe(source)) {
      return {
        ...source,
        query: source.query ? source.query.map((q) => ({ ...q })) : [],
      };
    }

    return source;
  }

  /**
   * True when `filter` (and its query array + entries) can be mutated directly,
   * i.e. nothing is frozen.
   */
  private isMutationSafe(filter: ICrudFilter): boolean {
    if (Object.isFrozen(filter)) return false;
    const query = filter.query;
    if (!query) return true;
    if (Object.isFrozen(query)) return false;
    return query.every((q) => !Object.isFrozen(q));
  }

  /**
   * Records the mutated clone as the pending working copy (so read getters
   * reflect it immediately) and dispatches it through the facade.
   */
  private commitFilter(filter: ICrudFilter): void {
    this._pendingFilterSource = this.filter();
    this._pendingFilter.set(filter);
    this.facade.read(filter);
  }

  @Debounce(500)
  refresh(val: any, type: string | null = null): void {
    const filter = this.cloneFilter();
    const item = this.item();
    if (!filter || !item) return;

    if (!type) type = item.type;
    if (!filter.query) filter.query = [];

    filter.offset = 0;

    if (this.isArrayType()) {
      this.refreshForArray(filter, val as [], type);
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

      this.commitFilter(filter);
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

    this.commitFilter(filter);
  }

  /**
   * Builds the `InputOptions` consumed by shared `smart-input-*` components for
   * a single reactive control. When `withPossibilities` is true (radio/select
   * style filters) the base `possibilities` signal is mapped into the
   * `{ id, text, checked }` shape the shared inputs expect; otherwise it is
   * omitted (text/flag filters do not need possibilities).
   */
  protected buildInputOptions(
    control: UntypedFormControl,
    withPossibilities = false,
  ): InputOptions<any> {
    const options: InputOptions<any> = {
      treeLevel: 0,
      control,
      model: this.model,
      fieldKey: this.item()?.key ?? '',
    };

    if (withPossibilities) {
      const source = this.possibilities ? this.possibilities() : [];
      options.possibilities = signal(
        source.map(({ id, text }) => ({ id, text, checked: false })),
      );
    }

    return options;
  }

  /**
   * Creates a reactive control bridged to the legacy filter state for a given
   * query slot: seeded from the current query value for that slot (`null` ->
   * `value` / `item.type`, `'>='` -> `minValue`, `'<='` -> `maxValue`), and
   * wired so every change re-runs the (debounced) `refresh` for that slot.
   */
  protected bindControl(type: string | null = null): UntypedFormControl {
    const seed =
      type === '>='
        ? this.minValue
        : type === '<='
          ? this.maxValue
          : this.value;

    const control = new UntypedFormControl(seed);

    control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.refresh(v, type));

    // TODO(GAP-19): re-sync control when filter() changes externally
    return control;
  }

  /**
   * Creates a reactive control bridged to the default (`value` / `item.type`)
   * query slot.
   */
  protected bindValueControl(): UntypedFormControl {
    return this.bindControl(null);
  }

  clear(): void {
    const filter = this.cloneFilter();
    const item = this.item();
    if (!filter || !item || !filter.query) return;

    filter.query = filter.query?.filter((q) => q.key !== item.key);
    filter.offset = 0;
    this.commitFilter(filter);
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

  private hasQueryValue(type: string): boolean {
    const filter = this.effectiveFilter();
    const item = this.item();
    if (!filter || !item || !filter.query) return false;

    const query = filter.query.find(
      (q) => q.key === item.key && q.type === type,
    );

    if (!query) return false;

    const val = query.value;
    return val !== null && val !== undefined && val !== '';
  }

  private isArrayType(): boolean {
    const item = this.item();
    return item?.fieldType === FieldType.check;
  }

  private refreshForArray(filter: ICrudFilter, vals: [], type: string): void {
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
      this.commitFilter(filter);
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

    this.commitFilter(filter);
  }
}

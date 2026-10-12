import {
  computed,
  Directive,
  effect,
  inject,
  linkedSignal,
  signal,
  Signal,
  Type,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { getModelFieldOptions } from '@smartsoft001/models';

import { InputBaseComponent } from './base.component';
import { MODEL_POSSIBILITIES_PROVIDER } from '../../../providers';

type InputPossibilities = Array<{
  id: any;
  text: string;
  checked: boolean;
}> | null;

interface IInputPossibilitiesSources {
  provider: Signal<InputPossibilities | undefined> | null;
  options: Signal<InputPossibilities | undefined> | null;
  model: InputPossibilities;
}

/**
 * Base of the fields with a list of possibilities (radio, check, enum preset).
 * `possibilities` holds the list the `MODEL_POSSIBILITIES_PROVIDER` signal
 * returns (asked again 500 ms after the parent form's value changed), else the
 * input options' `possibilities`, else the field's own `possibilities`
 * (`getModelPossibilities()`). A subclass that overrides
 * `afterSetOptionsHandler()` calls `super.afterSetOptionsHandler()` first.
 */
@Directive()
export abstract class InputPossibilitiesBaseComponent<
  T,
> extends InputBaseComponent<T> {
  private modelPossibilitiesProvider = inject(MODEL_POSSIBILITIES_PROVIDER, {
    optional: true,
  });

  private readonly possibilitiesSources = signal<IInputPossibilitiesSources>({
    provider: null,
    options: null,
    model: null,
  });

  private readonly resolvedPossibilities: WritableSignal<InputPossibilities> =
    linkedSignal(() => {
      const { provider, options, model } = this.possibilitiesSources();

      return provider?.() ?? options?.() ?? model ?? null;
    });

  private providerRefresh: Subscription | null = null;

  override possibilities: WritableSignal<InputPossibilities> =
    this.resolvedPossibilities;

  constructor() {
    super();

    effect(() => {
      this.resolvedPossibilities();

      untracked(() => this.afterPossibilitiesChange());
    });
  }

  protected override afterSetOptionsHandler(): void {
    untracked(() => {
      this.possibilitiesSources.set({
        provider: this.getPossibilitiesFromProvider(),
        options: this.internalOptions.possibilities ?? null,
        model: this.getModelPossibilities(),
      });
      this.possibilities = this.resolvedPossibilities;

      this.afterPossibilitiesChange();
      this.watchProviderPossibilities();
    });
  }

  /**
   * Runs whenever the resolved possibilities may have changed: after the
   * options are set, after the provider was asked again and when a signal
   * holding them changes. No base functionality.
   */
  protected afterPossibilitiesChange(): void {
    // No base functionality
  }

  /**
   * The field's own `possibilities` (from its `@Field()` metadata, read
   * through the first item of an array model) when they are an object map
   * `{ text: id }`, e.g. an enum, as a list; `null` otherwise.
   */
  protected getModelPossibilities(): InputPossibilities {
    const possibilities = this.getModelFieldPossibilities();

    if (!possibilities || Array.isArray(possibilities)) return null;

    return Object.keys(possibilities).map((key) => ({
      id: possibilities[key],
      text: key,
      checked: false,
    }));
  }

  /**
   * The raw `possibilities` of the field's `@Field()` metadata, read through
   * the first item of an array model when the model itself has none.
   */
  protected getModelFieldPossibilities(): any {
    const model = this.internalOptions?.model as any;
    const fieldKey = this.internalOptions?.fieldKey;
    if (!model || !fieldKey) return null;

    let fieldOptions = getModelFieldOptions(model, fieldKey);

    if (!fieldOptions && model[0])
      fieldOptions = getModelFieldOptions(model[0], fieldKey);

    return fieldOptions?.possibilities ?? null;
  }

  protected getPossibilitiesFromProvider(): WritableSignal<
    { id: any; text: string; checked: boolean }[] | null
  > {
    if (!this.modelPossibilitiesProvider) return signal(null);

    return this.modelPossibilitiesProvider.get({
      type: this.internalOptions?.model?.constructor as Type<any>,
      key: this.internalOptions.fieldKey,
      instance: this.internalOptions.control.parent?.value,
    });
  }

  // Asks the provider again; its former list stays shown until the new signal
  // holds one.
  private refreshProviderPossibilities(): void {
    const sources = this.possibilitiesSources();
    const previous = sources.provider?.() ?? null;
    const next = this.getPossibilitiesFromProvider();

    this.possibilitiesSources.set({
      ...sources,
      provider: previous ? computed(() => next() ?? previous) : next,
    });
  }

  private watchProviderPossibilities(): void {
    this.providerRefresh?.unsubscribe();
    this.providerRefresh = null;

    const changes = this.internalOptions.control.parent?.valueChanges;
    if (!this.modelPossibilitiesProvider || !changes) return;

    this.providerRefresh = changes
      .pipe(debounceTime(500), this.takeUntilDestroy)
      .subscribe(() => {
        this.refreshProviderPossibilities();
        this.afterPossibilitiesChange();
        this.cd.detectChanges();
      });
  }
}

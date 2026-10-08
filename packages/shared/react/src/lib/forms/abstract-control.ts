import { SmartEmitter } from './emitter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SmartValidationErrors = Record<string, any>;

export type SmartValidatorResult =
  SmartValidationErrors | null | undefined | void;

export type SmartValidatorFn = (
  control: SmartAbstractControl,
) => SmartValidatorResult;

export type SmartAsyncValidatorFn = (
  control: SmartAbstractControl,
) => Promise<SmartValidatorResult>;

export type SmartControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

export interface SmartControlUpdateOptions {
  /** Do not propagate the change to the parent group or array. */
  onlySelf?: boolean;
  /** `false` keeps `valueChanges` / `statusChanges` silent. */
  emitEvent?: boolean;
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];

  return Array.isArray(value) ? [...value] : [value];
}

function mergeErrors(
  results: SmartValidatorResult[],
): SmartValidationErrors | null {
  let merged: SmartValidationErrors | null = null;

  for (const result of results) {
    if (result) merged = { ...(merged ?? {}), ...result };
  }

  return merged;
}

/**
 * The state shared by every node of a form tree: value, validation status,
 * errors and the touched / dirty flags.
 *
 * The model follows Angular's reactive forms closely, because the form
 * factory, the inputs and the CRUD screens were written against it: a change
 * of a control recomputes its validity, then its parent's, up to the root;
 * async validators only run when the sync ones pass and leave the control
 * `PENDING` meanwhile; a disabled control is left out of its parent's value.
 *
 * It holds no React state. Components re-render through the hooks in
 * `hooks.ts`, which subscribe to `changes` and read `version`.
 */
export abstract class SmartAbstractControl<TValue = any> {
  /** Emits the new value after every value or validity update. */
  readonly valueChanges = new SmartEmitter<TValue>();
  /** Emits the new status after every validity update. */
  readonly statusChanges = new SmartEmitter<SmartControlStatus>();
  /**
   * Emits after any observable change: value, status, errors, touched, dirty
   * or disabled. It is a render signal, so it fires even for updates made with
   * `emitEvent: false`.
   */
  readonly changes = new SmartEmitter<void>();

  status: SmartControlStatus = 'VALID';
  errors: SmartValidationErrors | null = null;
  touched = false;
  dirty = false;
  /**
   * Set by the form factory while the field's `enabled` specification does not
   * hold. The Angular library stored the same flag as `__smartDisabled`.
   */
  smartDisabled = false;

  protected _value!: TValue;

  private _version = 0;
  private _parent: SmartAbstractControl | null = null;
  private _validators: SmartValidatorFn[] = [];
  private _asyncValidators: SmartAsyncValidatorFn[] = [];
  private _asyncRun = 0;

  constructor(
    validators?: SmartValidatorFn | SmartValidatorFn[] | null,
    asyncValidators?: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null,
  ) {
    this._validators = toArray(validators);
    this._asyncValidators = toArray(asyncValidators);
  }

  get value(): TValue {
    return this._value;
  }

  /** Increases on every change; the React hooks use it as their snapshot. */
  get version(): number {
    return this._version;
  }

  get parent(): SmartAbstractControl | null {
    return this._parent;
  }

  get root(): SmartAbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: SmartAbstractControl = this;

    while (current.parent) current = current.parent;

    return current;
  }

  get valid(): boolean {
    return this.status === 'VALID';
  }

  get invalid(): boolean {
    return this.status === 'INVALID';
  }

  get pending(): boolean {
    return this.status === 'PENDING';
  }

  get disabled(): boolean {
    return this.status === 'DISABLED';
  }

  get enabled(): boolean {
    return this.status !== 'DISABLED';
  }

  get pristine(): boolean {
    return !this.dirty;
  }

  get untouched(): boolean {
    return !this.touched;
  }

  /** The sync validators composed into one function, or `null`. */
  get validator(): SmartValidatorFn | null {
    if (!this._validators.length) return null;

    const validators = [...this._validators];

    return (control) => mergeErrors(validators.map((fn) => fn(control)));
  }

  /** The async validators composed into one function, or `null`. */
  get asyncValidator(): SmartAsyncValidatorFn | null {
    if (!this._asyncValidators.length) return null;

    const validators = [...this._asyncValidators];

    return async (control) =>
      mergeErrors(await Promise.all(validators.map((fn) => fn(control))));
  }

  get validators(): readonly SmartValidatorFn[] {
    return this._validators;
  }

  get asyncValidators(): readonly SmartAsyncValidatorFn[] {
    return this._asyncValidators;
  }

  setValidators(
    validators: SmartValidatorFn | SmartValidatorFn[] | null,
  ): void {
    this._validators = toArray(validators);
  }

  setAsyncValidators(
    validators: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null,
  ): void {
    this._asyncValidators = toArray(validators);
  }

  addValidators(validators: SmartValidatorFn | SmartValidatorFn[]): void {
    for (const validator of toArray(validators)) {
      if (!this._validators.includes(validator))
        this._validators.push(validator);
    }
  }

  removeValidators(validators: SmartValidatorFn | SmartValidatorFn[]): void {
    const removed = toArray(validators);

    this._validators = this._validators.filter((fn) => !removed.includes(fn));
  }

  hasValidator(validator: SmartValidatorFn): boolean {
    return this._validators.includes(validator);
  }

  clearValidators(): void {
    this._validators = [];
  }

  clearAsyncValidators(): void {
    this._asyncValidators = [];
  }

  setParent(parent: SmartAbstractControl | null): void {
    this._parent = parent;
  }

  markAsTouched(options: { onlySelf?: boolean } = {}): void {
    this.touched = true;
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.markAsTouched(options);
  }

  markAllAsTouched(): void {
    this.markAsTouched({ onlySelf: true });
    this.forEachChild((control) => control.markAllAsTouched());
  }

  markAsUntouched(options: { onlySelf?: boolean } = {}): void {
    this.touched = false;
    this.forEachChild((control) => control.markAsUntouched({ onlySelf: true }));
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.updateTouched(options);
  }

  markAsDirty(options: { onlySelf?: boolean } = {}): void {
    this.dirty = true;
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.markAsDirty(options);
  }

  markAsPristine(options: { onlySelf?: boolean } = {}): void {
    this.dirty = false;
    this.forEachChild((control) => control.markAsPristine({ onlySelf: true }));
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.updatePristine(options);
  }

  disable(options: SmartControlUpdateOptions = {}): void {
    this._asyncRun++;
    this.status = 'DISABLED';
    this.errors = null;
    this.forEachChild((control) =>
      control.disable({ ...options, onlySelf: true }),
    );
    this.updateValue();

    if (options.emitEvent !== false) {
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }

    this.notify();
    this.updateAncestors(options);
  }

  enable(options: SmartControlUpdateOptions = {}): void {
    this.status = 'VALID';
    this.forEachChild((control) =>
      control.enable({ ...options, onlySelf: true }),
    );
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: options.emitEvent,
    });
    this.updateAncestors(options);
  }

  /**
   * Recomputes the value and the validity of this control and, unless
   * `onlySelf` is set, of every ancestor.
   */
  updateValueAndValidity(options: SmartControlUpdateOptions = {}): void {
    this.status = this.allControlsDisabled() ? 'DISABLED' : 'VALID';
    this.updateValue();

    if (this.enabled) {
      this._asyncRun++;
      this.errors = this.runValidator();
      this.status = this.calculateStatus();

      if (this.status === 'VALID' || this.status === 'PENDING') {
        this.runAsyncValidator(options.emitEvent);
      }
    }

    if (options.emitEvent !== false) {
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }

    this.notify();

    if (this._parent && !options.onlySelf) {
      this._parent.updateValueAndValidity(options);
    }
  }

  /** Sets errors by hand, as an async validator would. */
  setErrors(
    errors: SmartValidationErrors | null,
    options: { emitEvent?: boolean } = {},
  ): void {
    this.errors = errors;
    this.updateControlsErrors(options.emitEvent !== false);
  }

  getError(code: string, path?: string | Array<string | number>): unknown {
    const control = path ? this.get(path) : this;

    return control?.errors ? control.errors[code] : null;
  }

  hasError(code: string, path?: string | Array<string | number>): boolean {
    return !!this.getError(code, path);
  }

  /** The descendant at `path` (`'address.city'` or `['items', 0]`). */
  get(path: string | Array<string | number>): SmartAbstractControl | null {
    const segments = Array.isArray(path) ? path : path.split('.');

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: SmartAbstractControl | null = this;

    for (const segment of segments) {
      if (!current) return null;
      current = current.child(segment);
    }

    return current;
  }

  abstract setValue(value: TValue, options?: SmartControlUpdateOptions): void;

  abstract patchValue(
    value: Partial<TValue> | TValue,
    options?: SmartControlUpdateOptions,
  ): void;

  abstract reset(value?: unknown, options?: SmartControlUpdateOptions): void;

  /** The value including disabled descendants. */
  abstract getRawValue(): TValue;

  /** The direct child named `key`, for groups and arrays. */
  protected child(key: string | number): SmartAbstractControl | null {
    void key;
    return null;
  }

  protected abstract updateValue(): void;

  protected abstract forEachChild(
    callback: (control: SmartAbstractControl, key: string | number) => void,
  ): void;

  protected abstract allControlsDisabled(): boolean;

  protected anyControlsHaveStatus(status: SmartControlStatus): boolean {
    let found = false;

    this.forEachChild((control) => {
      if (control.status === status) found = true;
    });

    return found;
  }

  protected anyControls(
    predicate: (control: SmartAbstractControl) => boolean,
  ): boolean {
    let found = false;

    this.forEachChild((control) => {
      if (predicate(control)) found = true;
    });

    return found;
  }

  /** Bumps the version and tells the React hooks to re-read the control. */
  protected notify(): void {
    this._version++;
    this.changes.emit();
  }

  private runValidator(): SmartValidationErrors | null {
    const validator = this.validator;

    // Validators may return nothing (`void`); the cast keeps the fallback
    // valid for consumers compiling without `strictNullChecks`.
    return validator
      ? ((validator(this) as SmartValidationErrors | null | undefined) ?? null)
      : null;
  }

  private runAsyncValidator(emitEvent?: boolean): void {
    const validator = this.asyncValidator;

    if (!validator) return;

    this.status = 'PENDING';

    const run = ++this._asyncRun;

    validator(this).then(
      (errors) => {
        if (run !== this._asyncRun) return;
        this.setErrors(
          (errors as SmartValidationErrors | null | undefined) ?? null,
          { emitEvent },
        );
      },
      () => {
        if (run !== this._asyncRun) return;
        // A validator that cannot reach its backend must not let the value
        // through as valid.
        this.setErrors({ asyncValidator: true }, { emitEvent });
      },
    );
  }

  private calculateStatus(): SmartControlStatus {
    if (this.allControlsDisabled()) return 'DISABLED';
    if (this.errors) return 'INVALID';
    if (this.anyControlsHaveStatus('INVALID')) return 'INVALID';
    if (this.anyControlsHaveStatus('PENDING')) return 'PENDING';

    return 'VALID';
  }

  private updateControlsErrors(emitEvent: boolean): void {
    this.status = this.calculateStatus();

    if (emitEvent) this.statusChanges.emit(this.status);

    this.notify();

    if (this._parent) this._parent.updateControlsErrors(emitEvent);
  }

  private updateAncestors(options: SmartControlUpdateOptions): void {
    if (this._parent && !options.onlySelf) {
      this._parent.updateValueAndValidity(options);
      this._parent.updatePristine({});
      this._parent.updateTouched({});
    }
  }

  private updatePristine(options: { onlySelf?: boolean }): void {
    this.dirty = this.anyControls((control) => control.dirty);
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.updatePristine(options);
  }

  private updateTouched(options: { onlySelf?: boolean }): void {
    this.touched = this.anyControls((control) => control.touched);
    this.notify();

    if (this._parent && !options.onlySelf) this._parent.updateTouched(options);
  }
}

import {
  SmartAbstractControl,
  SmartAsyncValidatorFn,
  SmartControlUpdateOptions,
  SmartValidatorFn,
} from './abstract-control';

/** A single value: the leaf of a form tree. */
export class SmartFormControl<
  TValue = any,
> extends SmartAbstractControl<TValue> {
  /**
   * What `reset()` falls back to: always `null`, so resetting clears the field
   * rather than restoring the value it was created with.
   */
  readonly defaultValue: TValue = null as TValue;

  constructor(
    value: TValue = null as TValue,
    validators?: SmartValidatorFn | SmartValidatorFn[] | null,
    asyncValidators?: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null,
  ) {
    super(validators, asyncValidators);
    this._value = value;
    this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  setValue(value: TValue, options: SmartControlUpdateOptions = {}): void {
    this._value = value;
    this.updateValueAndValidity(options);
  }

  patchValue(value: TValue, options: SmartControlUpdateOptions = {}): void {
    this.setValue(value, options);
  }

  reset(
    value: TValue = this.defaultValue,
    options: SmartControlUpdateOptions = {},
  ): void {
    this._value = value;
    this.markAsPristine({ onlySelf: true });
    this.markAsUntouched({ onlySelf: true });
    this.updateValueAndValidity(options);
  }

  getRawValue(): TValue {
    return this._value;
  }

  protected updateValue(): void {
    // A control owns its value; nothing to derive.
  }

  protected forEachChild(): void {
    // A control has no children.
  }

  protected allControlsDisabled(): boolean {
    return this.disabled;
  }
}

import {
  SmartAbstractControl,
  SmartAsyncValidatorFn,
  SmartControlUpdateOptions,
  SmartValidatorFn,
} from './abstract-control';

/**
 * A set of named controls whose value is an object. Disabled controls are
 * left out of `value` (use `getRawValue()` to read them), so a submitted
 * value holds only the fields the user could edit.
 */
export class SmartFormGroup<
  TValue extends Record<string, any> = Record<string, any>,
> extends SmartAbstractControl<TValue> {
  controls: Record<string, SmartAbstractControl>;

  constructor(
    controls: Record<string, SmartAbstractControl> = {},
    validators?: SmartValidatorFn | SmartValidatorFn[] | null,
    asyncValidators?: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null,
  ) {
    super(validators, asyncValidators);
    this.controls = { ...controls };

    for (const control of Object.values(this.controls)) {
      control.setParent(this);
    }

    this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  static create(): SmartFormGroup {
    return new SmartFormGroup({});
  }

  /** Adds `control` under `name`; does nothing when the name is taken. */
  addControl(
    name: string,
    control: SmartAbstractControl,
    options: { emitEvent?: boolean } = {},
  ): void {
    if (this.controls[name]) return;

    this.controls[name] = control;
    control.setParent(this);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  removeControl(name: string, options: { emitEvent?: boolean } = {}): void {
    if (!this.controls[name]) return;

    delete this.controls[name];
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  setControl(
    name: string,
    control: SmartAbstractControl,
    options: { emitEvent?: boolean } = {},
  ): void {
    delete this.controls[name];
    this.controls[name] = control;
    control.setParent(this);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  /** True when the group has an enabled control named `name`. */
  contains(name: string): boolean {
    return !!this.controls[name] && this.controls[name].enabled;
  }

  setValue(value: TValue, options: SmartControlUpdateOptions = {}): void {
    this.patchValue(value, options);
  }

  patchValue(
    value: Partial<TValue>,
    options: SmartControlUpdateOptions = {},
  ): void {
    if (!value) return;

    for (const key of Object.keys(value)) {
      this.controls[key]?.setValue((value as Record<string, unknown>)[key], {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    }

    this.updateValueAndValidity(options);
  }

  reset(
    value: Partial<TValue> = {},
    options: SmartControlUpdateOptions = {},
  ): void {
    this.forEachChild((control, key) =>
      control.reset((value as Record<string, unknown>)?.[key], {
        onlySelf: true,
        emitEvent: options.emitEvent,
      }),
    );
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.updateValueAndValidity(options);
  }

  getRawValue(): TValue {
    const result: Record<string, unknown> = {};

    this.forEachChild((control, key) => {
      result[key] = control.getRawValue();
    });

    return result as TValue;
  }

  /**
   * Replaces the controls named in `form` with the ones `form` holds and keeps
   * the others, e.g. to take over the controls a form built for an imported
   * value.
   */
  setForm(form: SmartFormGroup): void {
    for (const key of Object.keys(form.controls)) {
      if (this.controls[key]) this.removeControl(key);
      this.addControl(key, form.controls[key]);
    }
  }

  protected override child(key: string | number): SmartAbstractControl | null {
    return this.controls[key] ?? null;
  }

  protected updateValue(): void {
    const result: Record<string, unknown> = {};

    this.forEachChild((control, key) => {
      if (control.enabled || this.disabled) result[key] = control.value;
    });

    this._value = result as TValue;
  }

  protected forEachChild(
    callback: (control: SmartAbstractControl, key: string) => void,
  ): void {
    for (const key of Object.keys(this.controls)) {
      const control = this.controls[key];

      if (control) callback(control, key);
    }
  }

  protected allControlsDisabled(): boolean {
    const keys = Object.keys(this.controls);

    if (!keys.length) return this.disabled;

    return keys.every((key) => this.controls[key].disabled);
  }
}

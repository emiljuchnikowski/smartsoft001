import {
  SmartAbstractControl,
  SmartAsyncValidatorFn,
  SmartControlUpdateOptions,
  SmartValidatorFn,
} from './abstract-control';

/** An ordered list of controls whose value is an array. */
export class SmartFormArray<TItem = any> extends SmartAbstractControl<TItem[]> {
  controls: SmartAbstractControl<TItem>[];

  constructor(
    controls: SmartAbstractControl<TItem>[] = [],
    validators?: SmartValidatorFn | SmartValidatorFn[] | null,
    asyncValidators?: SmartAsyncValidatorFn | SmartAsyncValidatorFn[] | null,
  ) {
    super(validators, asyncValidators);
    this.controls = [...controls];

    for (const control of this.controls) control.setParent(this);

    this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  get length(): number {
    return this.controls.length;
  }

  at(index: number): SmartAbstractControl<TItem> {
    return this.controls[index];
  }

  push(
    control: SmartAbstractControl<TItem>,
    options: { emitEvent?: boolean } = {},
  ): void {
    this.controls.push(control);
    control.setParent(this);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  insert(
    index: number,
    control: SmartAbstractControl<TItem>,
    options: { emitEvent?: boolean } = {},
  ): void {
    this.controls.splice(index, 0, control);
    control.setParent(this);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  removeAt(index: number, options: { emitEvent?: boolean } = {}): void {
    this.controls.splice(index, 1);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  setControl(
    index: number,
    control: SmartAbstractControl<TItem>,
    options: { emitEvent?: boolean } = {},
  ): void {
    this.controls.splice(index, 1, control);
    control.setParent(this);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  /** Moves the control at `from` to `to` (drag-and-drop reordering). */
  move(from: number, to: number, options: { emitEvent?: boolean } = {}): void {
    if (from === to || from < 0 || from >= this.controls.length) return;

    const [control] = this.controls.splice(from, 1);
    const target = Math.max(0, Math.min(to, this.controls.length));

    this.controls.splice(target, 0, control);
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  clear(options: { emitEvent?: boolean } = {}): void {
    if (!this.controls.length) return;

    this.controls = [];
    this.updateValueAndValidity({ emitEvent: options.emitEvent });
  }

  setValue(value: TItem[], options: SmartControlUpdateOptions = {}): void {
    this.patchValue(value, options);
  }

  patchValue(value: TItem[], options: SmartControlUpdateOptions = {}): void {
    if (!value) return;

    value.forEach((item, index) => {
      this.controls[index]?.setValue(item, {
        onlySelf: true,
        emitEvent: options.emitEvent,
      });
    });

    this.updateValueAndValidity(options);
  }

  reset(value: TItem[] = [], options: SmartControlUpdateOptions = {}): void {
    this.forEachChild((control, index) =>
      control.reset(value?.[index as number], {
        onlySelf: true,
        emitEvent: options.emitEvent,
      }),
    );
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.updateValueAndValidity(options);
  }

  getRawValue(): TItem[] {
    return this.controls.map((control) => control.getRawValue());
  }

  protected override child(key: string | number): SmartAbstractControl | null {
    return this.controls[Number(key)] ?? null;
  }

  protected updateValue(): void {
    this._value = this.controls
      .filter((control) => control.enabled || this.disabled)
      .map((control) => control.value);
  }

  protected forEachChild(
    callback: (control: SmartAbstractControl, index: number) => void,
  ): void {
    this.controls.forEach((control, index) => callback(control, index));
  }

  protected allControlsDisabled(): boolean {
    if (!this.controls.length) return this.disabled;

    return this.controls.every((control) => control.disabled);
  }
}

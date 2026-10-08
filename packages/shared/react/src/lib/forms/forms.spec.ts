import { SmartFormArray } from './form-array';
import { SmartFormControl } from './form-control';
import { SmartFormGroup } from './form-group';
import { isControlRequired, SmartValidators } from './validators';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('@smartsoft001/react: form model', () => {
  describe('SmartFormControl', () => {
    it('should be valid without validators', () => {
      const control = new SmartFormControl('a');

      expect(control.status).toBe('VALID');
    });

    it('should report the required error while empty', () => {
      const control = new SmartFormControl('', SmartValidators.required);

      expect(control.errors).toEqual({ required: true });
    });

    it('should clear the error once a value is set', () => {
      const control = new SmartFormControl('', SmartValidators.required);

      control.setValue('x');

      expect(control.valid).toBe(true);
    });

    it('should emit valueChanges on setValue', () => {
      const control = new SmartFormControl<string | null>(null);
      const values: Array<string | null> = [];
      control.valueChanges.subscribe((value) => values.push(value));

      control.setValue('a');

      expect(values).toEqual(['a']);
    });

    it('should keep valueChanges silent with emitEvent false', () => {
      const control = new SmartFormControl<string | null>(null);
      const values: Array<string | null> = [];
      control.valueChanges.subscribe((value) => values.push(value));

      control.setValue('a', { emitEvent: false });

      expect(values).toEqual([]);
    });

    it('should still notify changes with emitEvent false', () => {
      const control = new SmartFormControl<string | null>(null);
      const listener = jest.fn();
      control.changes.subscribe(listener);

      control.setValue('a', { emitEvent: false });

      expect(listener).toHaveBeenCalled();
    });

    it('should reset to null and pristine', () => {
      const control = new SmartFormControl('a');
      control.markAsDirty();
      control.markAsTouched();

      control.reset();

      expect([control.value, control.dirty, control.touched]).toEqual([
        null,
        false,
        false,
      ]);
    });

    it('should be pending while an async validator runs', () => {
      const control = new SmartFormControl(
        'a',
        null,
        () => new Promise(() => undefined),
      );

      control.updateValueAndValidity();

      expect(control.status).toBe('PENDING');
    });

    it('should apply the async validator result', async () => {
      const control = new SmartFormControl('a', null, async () => ({
        taken: true,
      }));

      control.updateValueAndValidity();
      await flush();

      expect(control.errors).toEqual({ taken: true });
    });

    it('should drop a stale async result', async () => {
      let resolveFirst!: (value: unknown) => void;
      const results = [
        new Promise((resolve) => (resolveFirst = resolve)),
        Promise.resolve(null),
      ];
      let call = 0;
      const control = new SmartFormControl(
        'a',
        null,
        () => results[call++] as Promise<null>,
      );

      control.updateValueAndValidity();
      control.setValue('b');
      await flush();
      resolveFirst({ stale: true });
      await flush();

      expect(control.errors).toBeNull();
    });

    it('should not run async validators while sync ones fail', () => {
      const asyncValidator = jest.fn(async () => null);
      const control = new SmartFormControl(
        '',
        SmartValidators.required,
        asyncValidator,
      );

      control.updateValueAndValidity();

      expect(asyncValidator).not.toHaveBeenCalled();
    });
  });

  describe('SmartFormGroup', () => {
    it('should aggregate the values of its controls', () => {
      const group = new SmartFormGroup({
        a: new SmartFormControl(1),
        b: new SmartFormControl(2),
      });

      expect(group.value).toEqual({ a: 1, b: 2 });
    });

    it('should be invalid while a child is invalid', () => {
      const group = new SmartFormGroup({
        a: new SmartFormControl('', SmartValidators.required),
      });

      expect(group.status).toBe('INVALID');
    });

    it('should update its value when a child changes', () => {
      const group = new SmartFormGroup({ a: new SmartFormControl(1) });

      group.controls['a'].setValue(5);

      expect(group.value).toEqual({ a: 5 });
    });

    it('should leave a disabled control out of its value', () => {
      const group = new SmartFormGroup({
        a: new SmartFormControl(1),
        b: new SmartFormControl(2),
      });

      group.controls['b'].disable();

      expect([group.value, group.getRawValue()]).toEqual([
        { a: 1 },
        { a: 1, b: 2 },
      ]);
    });

    it('should become valid when the invalid control is removed', () => {
      const group = new SmartFormGroup({
        a: new SmartFormControl('', SmartValidators.required),
      });

      group.removeControl('a');

      expect(group.valid).toBe(true);
    });

    it('should mark the parent touched and dirty', () => {
      const group = new SmartFormGroup({ a: new SmartFormControl(1) });

      group.controls['a'].markAsTouched();
      group.controls['a'].markAsDirty();

      expect([group.touched, group.dirty]).toEqual([true, true]);
    });

    it('should patch nested groups', () => {
      const group = new SmartFormGroup({
        address: new SmartFormGroup({ city: new SmartFormControl('') }),
      });

      group.patchValue({ address: { city: 'Warsaw' } });

      expect(group.value).toEqual({ address: { city: 'Warsaw' } });
    });

    it('should resolve a dotted path', () => {
      const city = new SmartFormControl('');
      const group = new SmartFormGroup({
        address: new SmartFormGroup({ city }),
      });

      expect(group.get('address.city')).toBe(city);
    });

    it('should report pending while a child validates asynchronously', () => {
      const group = new SmartFormGroup({
        a: new SmartFormControl('a', null, () => new Promise(() => undefined)),
      });

      group.controls['a'].updateValueAndValidity();

      expect(group.status).toBe('PENDING');
    });

    it('should mark every descendant as touched', () => {
      const city = new SmartFormControl('');
      const group = new SmartFormGroup({
        address: new SmartFormGroup({ city }),
      });

      group.markAllAsTouched();

      expect(city.touched).toBe(true);
    });
  });

  describe('SmartFormArray', () => {
    it('should aggregate the values of its controls in order', () => {
      const array = new SmartFormArray([
        new SmartFormControl('a'),
        new SmartFormControl('b'),
      ]);

      expect(array.value).toEqual(['a', 'b']);
    });

    it('should move a control', () => {
      const array = new SmartFormArray([
        new SmartFormControl('a'),
        new SmartFormControl('b'),
        new SmartFormControl('c'),
      ]);

      array.move(0, 2);

      expect(array.value).toEqual(['b', 'c', 'a']);
    });

    it('should remove a control', () => {
      const array = new SmartFormArray([
        new SmartFormControl('a'),
        new SmartFormControl('b'),
      ]);

      array.removeAt(0);

      expect(array.value).toEqual(['b']);
    });
  });

  describe('SmartValidators', () => {
    it.each([
      [
        'minLength',
        SmartValidators.minLength(3),
        'ab',
        { minlength: { requiredLength: 3, actualLength: 2 } },
      ],
      [
        'maxLength',
        SmartValidators.maxLength(1),
        'ab',
        { maxlength: { requiredLength: 1, actualLength: 2 } },
      ],
      ['min', SmartValidators.min(5), 3, { min: { min: 5, actual: 3 } }],
      ['max', SmartValidators.max(5), 7, { max: { max: 5, actual: 7 } }],
      ['email', SmartValidators.email, 'nope', { email: true }],
      [
        'pattern',
        SmartValidators.pattern('[0-9]+'),
        'x',
        { pattern: { requiredPattern: '/^[0-9]+$/', actualValue: 'x' } },
      ],
    ])('should report the %s error', (_name, validator, value, expected) => {
      const control = new SmartFormControl(value, validator);

      expect(control.errors).toEqual(expected);
    });

    it('should skip minLength for an empty value', () => {
      const control = new SmartFormControl('', SmartValidators.minLength(3));

      expect(control.valid).toBe(true);
    });

    it('should detect a required control', () => {
      const control = new SmartFormControl('x', SmartValidators.required);

      expect(isControlRequired(control)).toBe(true);
    });

    it('should not detect an optional control as required', () => {
      const control = new SmartFormControl('x', SmartValidators.minLength(2));

      expect(isControlRequired(control)).toBe(false);
    });
  });
});

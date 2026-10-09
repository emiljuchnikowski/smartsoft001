import {
  SmartAbstractControl,
  SmartValidationErrors,
  SmartValidatorFn,
} from './abstract-control';

function isEmptyInputValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
  );
}

function hasValidLength(value: unknown): value is { length: number } {
  return (
    value !== null &&
    value !== undefined &&
    typeof (value as { length?: unknown }).length === 'number'
  );
}

// The WHATWG email pattern, capped at 254 characters in all and 64 before `@`.
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * The built-in validators. Their error keys and payloads (`required`,
 * `min: { min, actual }`, `minlength: { requiredLength, actualLength }`, ...)
 * are what the input error messages read, so a custom validator that reports
 * the same keys gets the same messages.
 */
export class SmartValidators {
  static required(control: SmartAbstractControl): SmartValidationErrors | null {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }

  static requiredTrue(
    control: SmartAbstractControl,
  ): SmartValidationErrors | null {
    return control.value === true ? null : { required: true };
  }

  static email(control: SmartAbstractControl): SmartValidationErrors | null {
    if (isEmptyInputValue(control.value)) return null;

    return EMAIL_REGEXP.test(String(control.value)) ? null : { email: true };
  }

  static min(min: number): SmartValidatorFn {
    return (control) => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(min))
        return null;

      const value = parseFloat(control.value);

      return !isNaN(value) && value < min
        ? { min: { min, actual: control.value } }
        : null;
    };
  }

  static max(max: number): SmartValidatorFn {
    return (control) => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(max))
        return null;

      const value = parseFloat(control.value);

      return !isNaN(value) && value > max
        ? { max: { max, actual: control.value } }
        : null;
    };
  }

  static minLength(minLength: number): SmartValidatorFn {
    return (control) => {
      if (isEmptyInputValue(control.value) || !hasValidLength(control.value))
        return null;

      return control.value.length < minLength
        ? {
            minlength: {
              requiredLength: minLength,
              actualLength: control.value.length,
            },
          }
        : null;
    };
  }

  static maxLength(maxLength: number): SmartValidatorFn {
    return (control) => {
      if (!hasValidLength(control.value)) return null;

      return control.value.length > maxLength
        ? {
            maxlength: {
              requiredLength: maxLength,
              actualLength: control.value.length,
            },
          }
        : null;
    };
  }

  static pattern(pattern: string | RegExp): SmartValidatorFn {
    const regex =
      typeof pattern === 'string'
        ? new RegExp(
            `${pattern.startsWith('^') ? '' : '^'}${pattern}${pattern.endsWith('$') ? '' : '$'}`,
          )
        : pattern;

    return (control) => {
      if (isEmptyInputValue(control.value)) return null;

      const value = String(control.value);

      // A global or sticky regex keeps `lastIndex` between calls.
      regex.lastIndex = 0;

      return regex.test(value)
        ? null
        : {
            pattern: { requiredPattern: regex.toString(), actualValue: value },
          };
    };
  }

  static nullValidator(): null {
    return null;
  }
}

/**
 * True when the control's validators report `required` for an empty value.
 * The inputs use it to decide whether to draw the asterisk: it calls the
 * composed validator with an empty control, which also catches a required
 * rule added by a custom validators provider.
 */
export function isControlRequired(
  control: SmartAbstractControl | null | undefined,
): boolean {
  const validator = control?.validator;

  if (!validator) return false;

  try {
    const errors = validator({ value: undefined } as SmartAbstractControl);

    return !!errors && !!errors['required'];
  } catch {
    return false;
  }
}

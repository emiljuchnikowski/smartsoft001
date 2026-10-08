import { SmartFormGroup } from '../../forms/form-group';
import { IFormOptions } from '../../models';

/** The props of `<SmartForm>` (`<smart-form>`). */
export interface SmartFormProps<T = any> {
  options: IFormOptions<T>;
  className?: string;
  /** The form value, on submit or Enter (`invokeSubmit`). */
  onInvokeSubmit?: (value: any) => void;
  /** The form value after every change (`valueChange`). */
  onValueChange?: (value: T) => void;
  /** The dirty controls' values, `*Confirm` left out (`valuePartialChange`). */
  onValuePartialChange?: (value: Partial<T>) => void;
  /** The form validity after every change (`validChange`). */
  onValidChange?: (valid: boolean) => void;
}

/**
 * The props of a form body: `SmartFormStandard`, `SmartFormPreset` or an
 * implementation registered as `components.form` (the inputs and the output
 * of the Angular `FormBaseComponent`).
 */
export interface SmartFormBaseProps<T = any> {
  form: SmartFormGroup;
  options: IFormOptions<T>;
  className?: string;
  onInvokeSubmit?: (value: any) => void;
}

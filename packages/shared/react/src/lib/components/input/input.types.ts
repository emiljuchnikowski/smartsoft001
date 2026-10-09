import { IFieldOptions } from '@smartsoft001/models';

import { InputOptions } from '../../models';

/** The props of `<SmartInput>`. */
export interface SmartInputProps<T = any> {
  options?: InputOptions<T>;
  className?: string;
}

/**
 * The props every field component receives from `<SmartInput>`: the input
 * options (control, model, field key, mode, tree level, possibilities) and the
 * field's options for the current mode.
 */
export interface SmartInputFieldProps<T = any> {
  options?: InputOptions<T>;
  fieldOptions?: IFieldOptions;
  className?: string;
}

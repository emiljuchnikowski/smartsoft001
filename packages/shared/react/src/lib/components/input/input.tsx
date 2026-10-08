import { useMemo } from 'react';

import { getDefaultInputFieldComponents } from './default-field-components';
import { useControlState } from '../../forms/hooks';
import {
  useInputFieldComponents,
  useSmartComponent,
} from '../../providers/hooks';
import { SmartInfo } from '../info/info';
import { SmartLoader } from '../loader/loader';
import { SmartInputError } from './error/input-error';
import { resolveInputFieldOptions } from './field-options';
import { SmartInputProps } from './input.types';

/**
 * `<smart-input>`: renders the field component of the control's field type
 * (or `options.component`), with the field's info tooltip, a loader while an
 * async validator runs, and the validation messages once the control is
 * touched.
 *
 * Field components are resolved from `inputFieldComponents` on
 * `SmartProvider` (the Angular `INPUT_FIELD_COMPONENTS_TOKEN`) over the
 * library's own; register `INPUT_PRESET_FIELD_COMPONENTS` there for the
 * preset look. The messages render through `components['input-error']`.
 */
export function SmartInput<T>({ options, className }: SmartInputProps<T>) {
  const control = options?.control ?? null;
  const state = useControlState(control);
  const fieldComponents = useInputFieldComponents(
    getDefaultInputFieldComponents(),
  );
  const ErrorComponent = useSmartComponent('input-error', SmartInputError);

  const fieldOptions = useMemo(
    () => resolveInputFieldOptions(options),
    // The resolved options only depend on these three.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options?.model, options?.fieldKey, options?.mode],
  );

  if (fieldOptions?.hide) return null;

  const type = fieldOptions?.type;
  const Component =
    options?.component ?? (type ? fieldComponents[type] : undefined) ?? null;

  return (
    <>
      <div className="smart:relative">
        {fieldOptions?.info && (
          <div className="smart:absolute smart:right-0 smart:top-0">
            <SmartInfo options={{ text: fieldOptions.info ?? '' }} />
          </div>
        )}
        <SmartLoader show={state?.status === 'PENDING'} />
        {Component && (
          <Component
            options={options}
            fieldOptions={fieldOptions}
            className={className}
          />
        )}
      </div>
      {state?.errors && state.touched && (
        <ErrorComponent errors={state.errors} />
      )}
    </>
  );
}

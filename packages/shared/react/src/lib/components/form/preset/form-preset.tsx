import { getFormFieldClasses, getFormShellClasses } from './preset-classes';
import { cn } from '../../../utils/class-names';
import { SmartInput } from '../../input/input';
import { SmartFormBaseProps } from '../form.types';
import { useFormBase } from '../use-form-base';

/**
 * Styled form variation (preset).
 *
 * A minimal restyle of `SmartFormStandard`: the field iteration and every
 * behaviour of `useFormBase` are reused unchanged — only the shell is
 * re-spaced. The form root gets a vertical rhythm and each field row a
 * `data-role="field"` wrapper. Field *internals* are left to the input
 * presets; register them as `inputFieldComponents` on `SmartProvider`.
 *
 * Register it as `components.form` on `SmartProvider` to restyle every
 * `<SmartForm>`, or render it directly.
 */
export function SmartFormPreset<T>(props: SmartFormBaseProps<T>) {
  const { className } = props;
  const {
    fields,
    model,
    mode,
    possibilities,
    inputComponents,
    treeLevel,
    getControl,
  } = useFormBase(props);

  return (
    <div className={cn(getFormShellClasses(), className)} data-role="form">
      {fields.map((field) => {
        const control = getControl(field);

        if (!control || control.smartDisabled) return null;

        return (
          <div
            key={field}
            className={getFormFieldClasses()}
            data-role="field"
            data-key={field}
          >
            <SmartInput
              options={{
                treeLevel: treeLevel ?? 0,
                fieldKey: field,
                control,
                model,
                mode,
                possibilities: possibilities[field],
                component: inputComponents[field],
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

import { cn } from '../../../utils/class-names';
import { SmartInput } from '../../input/input';
import { SmartFormBaseProps } from '../form.types';
import { useFormBase } from '../use-form-base';

/** The default form body (`<smart-form-standard>`): one input per control. */
export function SmartFormStandard<T>(props: SmartFormBaseProps<T>) {
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
    <div
      className={cn(
        'smart:space-y-4 smart:divide-y smart:divide-gray-100 smart:dark:divide-white/10',
        className,
      )}
    >
      {fields.map((field) => {
        const control = getControl(field);

        if (!control || control.smartDisabled) return null;

        return (
          <div key={field} className="smart:py-2">
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

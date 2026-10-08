import { cn } from '../../../../utils/class-names';
import { SmartForm } from '../../../form/form';
import { SmartInputFieldProps } from '../../input.types';
import { useInputObject } from '../use-input-object';

/**
 * Styled object field variation (preset), `<smart-input-object-preset>`: the
 * nested `SmartForm` sits in a bordered card frame.
 */
export function SmartInputObjectPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, label, required, childOptions } = useInputObject(props);

  if (!control || !childOptions) return null;

  return (
    <>
      <label
        className="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white"
        data-role="label"
      >
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn(
          'smart:mt-2 smart:p-4 smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-lg',
          className,
        )}
        data-role="object-frame"
      >
        <SmartForm options={childOptions} />
      </div>
    </>
  );
}

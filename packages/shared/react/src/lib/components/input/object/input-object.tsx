import { useInputObject } from './use-input-object';
import { cn } from '../../../utils/class-names';
import { SmartForm } from '../../form/form';
import { SmartInputFieldProps } from '../input.types';

/**
 * The label of an `object` field and a nested `SmartForm` for its group.
 */
export function SmartInputObject<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, label, required, childOptions } = useInputObject(props);

  if (!control || !childOptions) return null;

  return (
    <>
      <label className="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white">
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2', className)}>
        <SmartForm options={childOptions} />
      </div>
    </>
  );
}

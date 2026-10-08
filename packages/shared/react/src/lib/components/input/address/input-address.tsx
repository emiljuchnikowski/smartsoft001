import { SmartAbstractControl } from '../../../forms/abstract-control';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';
import {
  SmartInputAddressPart,
  useInputAddressPart,
} from './use-input-address';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const FIELD_INPUT_CLASSES =
  'smart:mt-1 smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-2 smart:py-1 smart:text-sm smart:text-gray-900 smart:outline-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10';

function AddressPart({
  group,
  name,
}: {
  group: SmartAbstractControl;
  name: SmartInputAddressPart;
}) {
  const t = useTranslate();
  const { id, value, disabled, onChange, onBlur } = useInputAddressPart(
    group,
    name,
  );

  return (
    <div>
      <label
        htmlFor={id}
        className="smart:block smart:text-xs smart:text-gray-600 smart:dark:text-gray-400"
      >
        {t('MODEL.' + name)}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={FIELD_INPUT_CLASSES}
      />
    </div>
  );
}

/**
 * `<smart-input-address>` (Angular `InputAddressComponent`): the control is
 * the address group the form factory builds; each part (city, zip code,
 * street, building and flat number) has its own labelled text input bound to
 * its control. `className` goes on the container of the parts.
 */
export function SmartInputAddress<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, required, label } = useInput(props);

  if (!control) return null;

  return (
    <>
      <label className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2', 'smart:space-y-2', className)}>
        <AddressPart group={control} name="city" />
        <AddressPart group={control} name="zipCode" />
        <AddressPart group={control} name="street" />
        <div className="smart:grid smart:grid-cols-2 smart:gap-2">
          <AddressPart group={control} name="buildingNumber" />
          <AddressPart group={control} name="flatNumber" />
        </div>
      </div>
    </>
  );
}

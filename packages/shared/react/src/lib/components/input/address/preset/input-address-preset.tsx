import { SmartAbstractControl } from '../../../../forms/abstract-control';
import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';
import {
  SmartInputAddressPart,
  useInputAddressPart,
} from '../use-input-address';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const SUB_LABEL_CLASSES =
  'smart:block smart:text-xs smart:font-medium smart:text-gray-500 smart:dark:text-gray-400 smart:mb-1';

// Preline text-input look reused for every address sub-field.
const FIELD_INPUT_CLASSES =
  'smart:block smart:w-full smart:py-2.5 smart:sm:py-3 smart:px-4 smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-lg smart:sm:text-sm smart:text-gray-900 smart:dark:text-white smart:focus:border-blue-700 smart:dark:focus:border-blue-600 smart:focus:ring-blue-700 smart:dark:focus:ring-blue-600 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

function AddressPresetPart({
  group,
  name,
  className,
}: {
  group: SmartAbstractControl;
  name: SmartInputAddressPart;
  className?: string;
}) {
  const t = useTranslate();
  const { id, value, disabled, onChange, onBlur } = useInputAddressPart(
    group,
    name,
  );

  return (
    <div className={className}>
      <label htmlFor={id} className={SUB_LABEL_CLASSES}>
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
        data-role={name}
      />
    </div>
  );
}

/**
 * Styled address field (preset, Angular `InputAddressPresetComponent`): the
 * parts of the address group as Preline text inputs in a two-column grid
 * (street across both columns, then building and flat number, zip code and
 * city), each labelled and bound to its control. `className` goes on the
 * grid.
 */
export function SmartInputAddressPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, required, label } = useInput(props);

  if (!control) return null;

  return (
    <>
      <label className={LABEL_CLASSES} data-role="label">
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn(
          'smart:mt-2',
          'smart:grid',
          'smart:grid-cols-1',
          'smart:sm:grid-cols-2',
          'smart:gap-3',
          className,
        )}
        data-role="address-grid"
      >
        <AddressPresetPart
          group={control}
          name="street"
          className="smart:sm:col-span-2"
        />
        <AddressPresetPart group={control} name="buildingNumber" />
        <AddressPresetPart group={control} name="flatNumber" />
        <AddressPresetPart group={control} name="zipCode" />
        <AddressPresetPart group={control} name="city" />
      </div>
    </>
  );
}

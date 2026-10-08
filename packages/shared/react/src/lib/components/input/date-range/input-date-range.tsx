import { IDateRange } from '@smartsoft001/domain-core';

import { cn } from '../../../utils/class-names';
import { SmartDateRange } from '../../date-range/date-range';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm/6',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const WIDGET_CLASSES = ['smart:mt-2', 'smart:block', 'smart:w-full'].join(' ');

/**
 * The `dateRange` field: the model label and the `<SmartDateRange>` picker
 * showing the control's range. A picked or cleared range sets the value and
 * marks the control dirty. `className` is appended to the picker's classes.
 *
 * A click on the picker marks the control touched: the picker is wrapped in a
 * box-less (`display: contents`) element that does it.
 */
export function SmartInputDateRange<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, value, required, label, setValue, markAsTouched } =
    useInput(props);

  if (!control) return null;

  return (
    <>
      <label className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className="smart:contents" onClick={markAsTouched}>
        <SmartDateRange
          className={cn(WIDGET_CLASSES, className)}
          value={(value as IDateRange | null | undefined) ?? null}
          onValueChange={setValue}
        />
      </div>
    </>
  );
}

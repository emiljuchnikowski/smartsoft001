import { cn } from '../../../utils/class-names';
import { SmartDateEdit } from '../../date-edit/date-edit';
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
 * The `dateWithEdit` field: the model label and the `<SmartDateEdit>` editor
 * (eight digit inputs) bound to the control: an edit sets the value and marks
 * the control dirty and touched.
 *
 * The widget classes and `className` go on a `<div>` around `SmartDateEdit`, a
 * block box around the editor, so the editor keeps its own layout.
 *
 * The label has no `htmlFor`: the editor has no single input it could point at.
 */
export function SmartInputDateWithEdit<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, required, label } = useInput(props);

  if (!control) return null;

  return (
    <>
      <label className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(WIDGET_CLASSES, className)}>
        <SmartDateEdit control={control} />
      </div>
    </>
  );
}

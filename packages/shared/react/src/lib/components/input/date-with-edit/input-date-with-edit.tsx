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
 * The `dateWithEdit` field (the Angular `InputDateWithEditComponent`,
 * `<smart-input-date-with-edit>`): the model label and the `<SmartDateEdit>`
 * editor (eight digit inputs) bound to the control as `[formControl]` did:
 * an edit sets the value and marks the control dirty and touched.
 *
 * Angular set the widget classes and `className` on the editor's host
 * element, a block box around the editor; here a `<div>` around
 * `SmartDateEdit` carries them, so the editor keeps its own layout.
 *
 * The label has no `htmlFor`, as in Angular: the editor has no single input
 * it could point at.
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

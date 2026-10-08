import { cn } from '../../../../utils/class-names';
import { SmartDateEdit } from '../../../date-edit/date-edit';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const LABEL_CLASSES = [
  // Preline label: block mb-2 text-sm font-medium text-foreground
  'smart:block',
  'smart:mb-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const WIDGET_CLASSES = ['smart:mt-2', 'smart:block', 'smart:w-full'].join(' ');

/**
 * Styled `dateWithEdit` field (preset, the Angular
 * `InputDateWithEditPresetComponent`, `<smart-input-date-with-edit-preset>`):
 * the Preline label and the `<SmartDateEdit variant="preset">` editor (a
 * read-only trigger with a calendar popover) bound to the control. Register
 * it as `inputFieldComponents[FieldType.dateWithEdit]` on `SmartProvider`.
 *
 * Angular set the widget classes and `className` on the editor's host
 * element, a block box around the inline-block trigger; here a `<div>`
 * around `SmartDateEdit` carries them, so the trigger keeps its own layout.
 */
export function SmartInputDateWithEditPreset<T>(
  props: SmartInputFieldProps<T>,
) {
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
        <SmartDateEdit variant="preset" control={control} />
      </div>
    </>
  );
}

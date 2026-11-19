import { useId } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';
import { SmartRichTextEditor } from './rich-text-editor';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const EDITOR_CLASSES = [
  'smart:mt-2',
  'smart:block',
  'smart:w-full',
  'smart:rounded-md',
  'smart:bg-white',
  'smart:text-gray-900',
  'smart:outline-1',
  '-outline-offset-1',
  'smart:outline-gray-300',
  'smart:dark:bg-white/5',
  'smart:dark:text-white',
  'smart:dark:outline-white/10',
];

/**
 * The long text field: a rich-text editor whose value is HTML.
 *
 * It renders `SmartRichTextEditor`, a dependency-free `contentEditable` editor
 * with a menu (bold, italic, underline, strike, code, blockquote, lists,
 * headings, link, image, text and background colour, alignment). The value is
 * shown sanitised (`toInnerHtml`) when it is loaded or set from outside.
 */
export function SmartInputLongText<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const labelId = useId();
  const t = useTranslate();
  const { control, value, required, disabled, label, setValue, markAsTouched } =
    useInput(props);

  if (!control) return null;

  return (
    <>
      <label id={labelId} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn(EDITOR_CLASSES, className)}
        style={{ minHeight: '220px' }}
      >
        <SmartRichTextEditor
          value={value}
          placeholder={t('writeHere') + '...'}
          disabled={disabled}
          labelledBy={labelId}
          onChange={setValue}
          onBlur={markAsTouched}
        />
      </div>
    </>
  );
}

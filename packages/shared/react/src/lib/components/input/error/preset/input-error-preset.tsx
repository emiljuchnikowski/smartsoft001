import { useTranslate } from '../../../../providers/hooks';
import { SmartInputErrorProps } from '../input-error';
import { getInputErrorMessages } from '../input-error-messages';

const ROW_CLASSES =
  'smart:flex smart:items-center smart:gap-x-2 smart:text-sm smart:text-red-500 smart:dark:text-red-400 smart:mt-2';
const ICON_CLASSES =
  'smart:shrink-0 smart:size-4 smart:text-red-500 smart:dark:text-red-400';

/**
 * Styled validation messages (preset), each with an alert icon and
 * `role="alert"`. Not a field type, so not part of the preset field map:
 * register it as `components['input-error']` or render it directly.
 */
export function SmartInputErrorPreset({ errors }: SmartInputErrorProps) {
  const t = useTranslate();

  return (
    <>
      {getInputErrorMessages(errors, t).map((message) => (
        <p
          key={message.key}
          className={ROW_CLASSES}
          data-role="error-message"
          role="alert"
        >
          <svg
            className={ICON_CLASSES}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{message.text}</span>
        </p>
      ))}
    </>
  );
}

import { getInputErrorMessages } from './input-error-messages';
import { SmartValidationErrors } from '../../../forms/abstract-control';
import { useTranslate } from '../../../providers/hooks';

export interface SmartInputErrorProps {
  errors?: SmartValidationErrors | null;
}

const ERROR_CLASSES =
  'smart:block smart:text-sm smart:text-red-600 smart:dark:text-red-400 smart:mt-1';

/** `<smart-input-error>`: the messages of a field's validation errors. */
export function SmartInputError({ errors }: SmartInputErrorProps) {
  const t = useTranslate();

  return (
    <>
      {getInputErrorMessages(errors, t).map((message) => (
        <span key={message.key} className={ERROR_CLASSES}>
          {message.text}
        </span>
      ))}
    </>
  );
}

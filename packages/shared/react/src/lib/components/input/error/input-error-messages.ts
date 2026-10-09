import { SmartValidationErrors } from '../../../forms/abstract-control';
import { SmartTranslateFn } from '../../../i18n/translate';

/**
 * The messages a field shows for its validation errors, in a fixed order.
 * `required` hides `confirm`: an empty confirmation field only reports that it
 * is empty. `pesel` (form factory) and `invalidPesel` (pesel preset field)
 * share the `INPUT.ERRORS.invalidPeselFormat` message, shown once.
 */
export function getInputErrorMessages(
  errors: SmartValidationErrors | null | undefined,
  t: SmartTranslateFn,
): Array<{ key: string; text: string }> {
  if (!errors) return [];

  const messages: Array<{ key: string; text: string }> = [];

  if (errors['required']) {
    messages.push({ key: 'required', text: t('INPUT.ERRORS.required') });
  } else if (errors['confirm']) {
    messages.push({ key: 'confirm', text: t('INPUT.ERRORS.confirm') });
  }

  if (errors['invalidNip']) {
    messages.push({ key: 'invalidNip', text: t('INPUT.ERRORS.invalidNip') });
  }

  if (errors['invalidUnique']) {
    messages.push({
      key: 'invalidUnique',
      text: t('INPUT.ERRORS.invalidUnique'),
    });
  }

  if (errors['email']) {
    messages.push({ key: 'email', text: t('INPUT.ERRORS.invalidEmailFormat') });
  }

  if (errors['phoneNumber']) {
    messages.push({
      key: 'phoneNumber',
      text: t('INPUT.ERRORS.invalidPhoneNumberFormat'),
    });
  }

  // `pesel` comes from the form factory, `invalidPesel` from the pesel preset
  // field: both report the same malformed PESEL, so they share one message.
  if (errors['pesel'] || errors['invalidPesel']) {
    messages.push({ key: 'pesel', text: t('INPUT.ERRORS.invalidPeselFormat') });
  }

  if (errors['minlength']) {
    messages.push({
      key: 'minlength',
      text: `${t('INPUT.ERRORS.invalidMinLength')}: ${errors['minlength']?.requiredLength}`,
    });
  }

  if (errors['maxlength']) {
    messages.push({
      key: 'maxlength',
      text: `${t('INPUT.ERRORS.invalidMaxLength')}: ${errors['maxlength']?.requiredLength}`,
    });
  }

  if (errors['min']) {
    messages.push({
      key: 'min',
      text: `${t('INPUT.ERRORS.invalidMin')}: ${errors['min']?.min}`,
    });
  }

  if (errors['max']) {
    messages.push({
      key: 'max',
      text: `${t('INPUT.ERRORS.invalidMax')}: ${errors['max']?.max}`,
    });
  }

  if (errors['customMessage']) {
    messages.push({
      key: 'customMessage',
      text: String(errors['customMessage']),
    });
  }

  return messages;
}

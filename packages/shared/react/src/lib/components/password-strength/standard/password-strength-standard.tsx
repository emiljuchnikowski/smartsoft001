import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartPasswordStrengthProps } from '../password-strength.types';
import { usePasswordStrength } from '../use-password-strength';

/** The default password strength meter (`<smart-password-strength-standard>`). */
export function SmartPasswordStrengthStandard(
  props: SmartPasswordStrengthProps,
) {
  const { showHint } = props;
  const t = useTranslate();
  const { result, msg, barClasses, msgClass, containerClasses } =
    usePasswordStrength(props);

  return (
    <div className={containerClasses}>
      <ul className="smart:flex smart:list-none smart:gap-0.5 smart:p-0 smart:mb-2">
        <li
          className={cn(
            'smart:h-1 smart:flex-1 smart:rounded-sm',
            barClasses[0],
          )}
        ></li>
        <li
          className={cn(
            'smart:h-1 smart:flex-1 smart:rounded-sm',
            barClasses[1],
          )}
        ></li>
        <li
          className={cn(
            'smart:h-1 smart:flex-1 smart:rounded-sm',
            barClasses[2],
          )}
        ></li>
      </ul>
      {msg && (
        <p className={cn('smart:font-bold', msgClass)}>
          {t('INPUT.PASSWORD-STRENGTH.' + msg)}
        </p>
      )}
      {showHint && (
        <ul className={msgClass || undefined}>
          {!result.passLength && (
            <li>{t('INPUT.ERRORS.invalidMinLength')} 7</li>
          )}
          {!result.upperLetters && <li>{t('INPUT.ERRORS.upperLetters')}</li>}
          {!result.lowerLetters && <li>{t('INPUT.ERRORS.lowerLetters')}</li>}
          {!result.symbols && <li>{t('INPUT.ERRORS.symbols')}</li>}
        </ul>
      )}
    </div>
  );
}

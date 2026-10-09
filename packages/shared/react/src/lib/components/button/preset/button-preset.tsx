import {
  getButtonPresetClasses,
  toButtonPresetVariant,
} from './preset-classes';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartIcon } from '../../icon';
import { SmartButtonProps } from '../button.types';
import { useButton } from '../use-button';

/**
 * Styled button variation (preset). Register it as `components.button` on
 * `SmartProvider` to restyle every `<SmartButton>`, or render it directly.
 *
 * Groups the Preline button types into one component selected by
 * `options.variant` (`primary` -> solid, `secondary` -> outline, `soft` ->
 * soft), across every `SmartColor` and `SmartSize`. Honours
 * `options.rounded` / `options.circular`, `options.loading`,
 * `options.confirm` and `disabled`.
 */
export function SmartButtonPreset(props: SmartButtonProps) {
  const { options, disabled = false, className, children } = props;
  const t = useTranslate();
  const { mode, loading, invoke, confirmInvoke, confirmCancel } =
    useButton(props);

  const buttonClasses = getButtonPresetClasses(
    toButtonPresetVariant(options?.variant),
    options?.color ?? 'indigo',
    options?.size ?? 'md',
    {
      rounded: Boolean(options?.rounded),
      circular: Boolean(options?.circular),
    },
  );

  if (mode !== 'confirm') {
    return (
      <button
        type={options?.type ?? 'button'}
        className={cn(buttonClasses, className)}
        disabled={disabled || loading}
        onClick={invoke}
      >
        {loading ? <SmartIcon name="spinner" /> : children}
      </button>
    );
  }

  return (
    <div className="smart:inline-flex smart:flex-wrap smart:gap-2">
      <button
        type="button"
        className="smart:inline-flex smart:items-center smart:justify-center smart:gap-x-2 smart:rounded-lg smart:border smart:border-gray-200 smart:bg-white smart:px-4 smart:py-3 smart:text-sm smart:font-medium smart:text-gray-800 smart:shadow-2xs smart:transition-colors smart:hover:bg-gray-50 smart:focus:outline-none smart:focus:bg-gray-50 smart:dark:border-gray-700 smart:dark:bg-gray-800 smart:dark:text-gray-200 smart:dark:hover:bg-gray-700 smart:dark:focus:bg-gray-700"
        onClick={confirmCancel}
      >
        {t('cancel')}
      </button>
      <button
        type="button"
        className="smart:inline-flex smart:items-center smart:justify-center smart:gap-x-2 smart:rounded-lg smart:border smart:border-blue-600 smart:bg-blue-600 smart:px-4 smart:py-3 smart:text-sm smart:font-medium smart:text-white smart:transition-colors smart:hover:bg-blue-700 smart:focus:outline-none smart:focus:bg-blue-700 smart:dark:border-blue-500 smart:dark:bg-blue-500 smart:dark:hover:bg-blue-600 smart:dark:focus:bg-blue-600"
        onClick={confirmInvoke}
      >
        {t('confirm')}
      </button>
    </div>
  );
}

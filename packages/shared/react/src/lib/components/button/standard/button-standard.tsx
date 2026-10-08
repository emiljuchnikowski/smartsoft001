import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartIcon } from '../../icon';
import { SmartButtonProps } from '../button.types';
import { useButton } from '../use-button';

/** The default button rendering (`<smart-button-standard>`). */
export function SmartButtonStandard(props: SmartButtonProps) {
  const { options, disabled = false, className, children } = props;
  const t = useTranslate();
  const {
    mode,
    loading,
    variantClasses,
    invoke,
    confirmInvoke,
    confirmCancel,
  } = useButton(props);

  const size = options?.size ?? 'md';
  const classes = [
    ...variantClasses,
    'smart:inline-flex',
    'smart:items-center',
    'smart:justify-center',
  ];

  if (size === 'xs' || size === 'sm') {
    classes.push('smart:rounded-sm');
  } else {
    classes.push('smart:rounded-md');
  }

  if (size === 'xs') classes.push('smart:px-2', 'smart:py-1', 'smart:text-xs');
  else if (size === 'sm')
    classes.push('smart:px-2', 'smart:py-1', 'smart:text-sm');
  else if (size === 'md')
    classes.push('smart:px-2.5', 'smart:py-1.5', 'smart:text-sm');
  else if (size === 'lg')
    classes.push('smart:px-3', 'smart:py-2', 'smart:text-sm');
  else classes.push('smart:px-3.5', 'smart:py-2.5', 'smart:text-sm');

  if (mode !== 'confirm') {
    return (
      <button
        type={options?.type ?? 'button'}
        className={cn(classes, className)}
        disabled={disabled || loading}
        onClick={invoke}
      >
        {loading ? <SmartIcon name="spinner" /> : children}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="smart:rounded-md smart:bg-white smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:text-gray-900 smart:shadow-xs smart:inset-ring smart:inset-ring-gray-300 smart:hover:bg-gray-50"
        onClick={confirmCancel}
      >
        {t('cancel')}
      </button>
      <button
        type="button"
        className="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:text-white smart:shadow-xs smart:hover:bg-indigo-500 smart:focus-visible:outline-2 smart:focus-visible:outline-offset-2 smart:focus-visible:outline-indigo-600"
        onClick={confirmInvoke}
      >
        {t('confirm')}
      </button>
    </>
  );
}

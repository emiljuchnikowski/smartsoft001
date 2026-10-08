import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail } from '../../use-detail';

/**
 * Styled colour detail (preset, `DetailColorPresetComponent`): a swatch next
 * to the colour code.
 */
export function SmartDetailColorPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key) return null;

  return (
    <div
      data-role="color"
      className={cn(
        ['smart:inline-flex', 'smart:items-center', 'smart:gap-x-2'],
        className,
      )}
    >
      <span
        data-role="swatch"
        className="smart:size-6 smart:rounded-md smart:border smart:border-gray-200 smart:dark:border-white/10"
        style={{ backgroundColor: value }}
      />
      <span
        data-role="value"
        className="smart:font-mono smart:text-sm smart:text-gray-700 smart:dark:text-gray-300"
      >
        {value}
      </span>
    </div>
  );
}

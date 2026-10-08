import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { getBadgeClasses } from '../../../badge/preset/preset-classes';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailEnum } from '../use-detail-enum';

/**
 * Styled enum detail (preset, `DetailEnumPresetComponent`): a soft blue
 * badge per translated value.
 */
export function SmartDetailEnumPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { item, key, values } = useDetailEnum(props);

  if (!item || !key) return null;

  const badgeClasses = getBadgeClasses('soft', 'blue', false, 'sm');

  return (
    <div
      data-role="badges"
      className={cn(
        ['smart:flex', 'smart:flex-wrap', 'smart:gap-1.5'],
        className,
      )}
    >
      {values.map((val) => (
        <span key={val} data-role="badge" className={badgeClasses}>
          {t(val)}
        </span>
      ))}
    </div>
  );
}

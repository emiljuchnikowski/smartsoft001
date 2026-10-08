import { cn } from '../../../../utils/class-names';
import { getBadgeClasses } from '../../../badge/preset/preset-classes';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail } from '../../use-detail';

/**
 * Styled flag detail (preset, `DetailFlagPresetComponent`): a soft green
 * `✓` badge when the flag is set, a soft red `✗` badge otherwise.
 */
export function SmartDetailFlagPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key) return null;

  return value ? (
    <span
      data-role="badge"
      className={cn(getBadgeClasses('soft', 'green', false, 'sm'), className)}
    >
      ✓
    </span>
  ) : (
    <span
      data-role="badge"
      className={cn(getBadgeClasses('soft', 'red', false, 'sm'), className)}
    >
      ✗
    </span>
  );
}

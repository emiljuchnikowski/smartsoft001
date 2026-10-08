import { cn } from '../../../../utils/class-names';
import { toInnerHtml } from '../../../../utils/html';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetail, useDetailCellValue } from '../../use-detail';

/**
 * Styled text detail (preset, `DetailTextPresetComponent`): the sanitised HTML
 * of the value with Preline typography, an em dash when it is empty.
 */
export function SmartDetailTextPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key } = useDetail(props);
  const value = useDetailCellValue(props);

  if (!item || !key) return null;

  if (!value) {
    return (
      <p
        data-role="empty"
        className="smart:text-sm smart:text-gray-400 smart:dark:text-gray-500"
      >
        —
      </p>
    );
  }

  return (
    <p
      data-role="text"
      className={cn(
        [
          'smart:text-sm',
          'smart:text-pretty',
          'smart:text-gray-900',
          'smart:dark:text-white',
        ],
        className,
      )}
      dangerouslySetInnerHTML={toInnerHtml(value)}
    />
  );
}

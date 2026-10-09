import { cn } from '../../../utils/class-names';
import { toInnerHtml } from '../../../utils/html';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail, useDetailCellValue } from '../use-detail';

/**
 * The text detail: the value of the field, or what `options.cellPipe` makes of
 * it, rendered as HTML. The HTML is sanitised; a `trustHtml(...)` value from
 * the cell pipe renders as is.
 */
export function SmartDetailText<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key } = useDetail(props);
  const value = useDetailCellValue(props);

  if (!item || !key) return null;

  return (
    <p
      className={cn(
        ['smart:text-sm', 'smart:text-gray-900', 'smart:dark:text-gray-100'],
        className,
      )}
      dangerouslySetInnerHTML={toInnerHtml(value)}
    />
  );
}

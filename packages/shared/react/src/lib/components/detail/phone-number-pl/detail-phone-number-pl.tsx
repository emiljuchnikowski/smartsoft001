import { cn } from '../../../utils/class-names';
import { toInnerHtml } from '../../../utils/html';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailCellValue } from '../use-detail';

/**
 * `<smart-detail-phone-number-pl>` (`DetailPhoneNumberPlComponent`): a
 * `tel:` link with the `48` country prefix, labelled with the (sanitised)
 * value of the cell.
 */
export function SmartDetailPhoneNumberPl<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const value = useDetailCellValue(props);

  if (!value) return null;

  return (
    <a
      className={cn(
        [
          'smart:inline-flex',
          'smart:items-center',
          'smart:rounded-md',
          'smart:bg-gray-100',
          'smart:px-2',
          'smart:py-1',
          'smart:text-sm',
          'smart:font-medium',
          'smart:text-gray-700',
          'smart:dark:bg-gray-800',
          'smart:dark:text-gray-200',
        ],
        className,
      )}
      href={'tel:48' + value}
      dangerouslySetInnerHTML={toInnerHtml(value)}
    />
  );
}

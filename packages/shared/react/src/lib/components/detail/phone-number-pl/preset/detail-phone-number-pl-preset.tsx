import { cn } from '../../../../utils/class-names';
import { toInnerHtml } from '../../../../utils/html';
import { getBadgeClasses } from '../../../badge/preset/preset-classes';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailCellValue } from '../../use-detail';

/**
 * Styled phone detail (preset): the `tel:` link as a soft blue badge.
 */
export function SmartDetailPhoneNumberPlPreset<T>(
  props: SmartDetailFieldProps<T>,
) {
  const { className } = props;
  const value = useDetailCellValue(props);

  if (!value) return null;

  return (
    <a
      data-role="link"
      className={cn(getBadgeClasses('soft', 'blue', false, 'sm'), className)}
      href={'tel:48' + value}
      dangerouslySetInnerHTML={toInnerHtml(value)}
    />
  );
}

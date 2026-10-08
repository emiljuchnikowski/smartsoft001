import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/** `<smart-detail-logo>` (`DetailLogoComponent`): the image at the URL in the field. */
export function SmartDetailLogo<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, value } = useDetail(props);

  if (!item || !key || !value) return null;

  return (
    <img
      className={cn(
        [
          'smart:h-[150px]',
          'smart:w-[150px]',
          'smart:rounded-lg',
          'smart:object-contain',
        ],
        className,
      )}
      src={value}
      alt=""
    />
  );
}

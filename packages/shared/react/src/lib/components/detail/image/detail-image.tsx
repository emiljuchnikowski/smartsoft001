import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailImage } from './use-detail-image';

/** `<smart-detail-image>` (`DetailImageComponent`): the uploaded image. */
export function SmartDetailImage<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { imageUrl } = useDetailImage(props);

  if (!imageUrl) return null;

  return (
    <img
      className={cn(
        [
          'smart:h-[150px]',
          'smart:w-[150px]',
          'smart:rounded-lg',
          'smart:object-cover',
        ],
        className,
      )}
      src={imageUrl}
      alt=""
    />
  );
}

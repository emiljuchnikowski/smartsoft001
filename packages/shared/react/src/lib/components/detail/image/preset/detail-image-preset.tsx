import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailImage } from '../use-detail-image';

/**
 * Styled image detail (preset): the uploaded image in a rounded frame.
 */
export function SmartDetailImagePreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { imageUrl } = useDetailImage(props);

  if (!imageUrl) return null;

  return (
    <img
      data-role="image"
      className={cn(
        [
          'smart:size-[150px]',
          'smart:rounded-xl',
          'smart:object-cover',
          'smart:border',
          'smart:border-gray-200',
          'smart:dark:border-gray-700',
          'smart:shadow-2xs',
        ],
        className,
      )}
      src={imageUrl}
      alt=""
    />
  );
}

import { cn } from '../../../../utils/class-names';
import { SmartDetailFieldProps } from '../../detail.types';
import { useDetailVideo } from '../use-detail-video';

/**
 * Styled video detail (preset, `DetailVideoPresetComponent`): the uploaded
 * mp4 video in a rounded frame.
 */
export function SmartDetailVideoPreset<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, url } = useDetailVideo(props);

  if (!item || !key) return null;

  return (
    <video
      data-role="video"
      className={cn(
        [
          'smart:w-full',
          'smart:rounded-xl',
          'smart:border',
          'smart:border-gray-200',
          'smart:dark:border-gray-700',
          'smart:shadow-2xs',
        ],
        className,
      )}
      controls
      controlsList="nodownload"
    >
      <source type="video/mp4" src={url ?? undefined} />
      Your browser does not support the video tag.
    </video>
  );
}

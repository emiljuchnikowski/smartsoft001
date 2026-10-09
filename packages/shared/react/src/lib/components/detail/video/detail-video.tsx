import { cn } from '../../../utils/class-names';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetailVideo } from './use-detail-video';

/** The video detail: the uploaded mp4 video. */
export function SmartDetailVideo<T>(props: SmartDetailFieldProps<T>) {
  const { className } = props;
  const { item, key, url } = useDetailVideo(props);

  if (!item || !key) return null;

  return (
    <video
      className={cn(['smart:w-full', 'smart:rounded-lg'], className)}
      controls
      controlsList="nodownload"
    >
      <source type="video/mp4" src={url ?? undefined} />
      Your browser does not support the video tag.
    </video>
  );
}

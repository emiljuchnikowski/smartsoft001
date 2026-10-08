import { cn } from '../../../utils/class-names';
import { SmartMediaObjectProps } from '../media-object.types';
import {
  getMediaObjectBodyClasses,
  getMediaObjectMediaClasses,
  getMediaObjectRootClasses,
} from './preset-classes';

/**
 * Styled media-object variation (preset). Register it as
 * `components['media-object']` on `SmartProvider` to restyle every
 * `<SmartMediaObject>`, or render it directly.
 *
 * Lays a rounded thumbnail beside the `children` body, honouring
 * `IMediaObjectOptions`: `position` (left/right), `alignment`
 * (top/center/bottom/stretched), `responsive` folding, `nested` spacing and a
 * `wide` media footprint. Keeps the standard `data-position` /
 * `data-alignment` attributes and the `.smart-media-object-body` marker.
 */
export function SmartMediaObjectPreset({
  mediaUrl,
  mediaAlt,
  options,
  className,
  children,
}: SmartMediaObjectProps) {
  return (
    <div
      className={cn(getMediaObjectRootClasses(options), className)}
      data-role="root"
      data-position={options?.position ?? 'left'}
      data-alignment={options?.alignment ?? undefined}
    >
      <img
        className={getMediaObjectMediaClasses(options)}
        src={mediaUrl}
        alt={mediaAlt}
        data-role="media"
      />
      <div
        className={cn('smart-media-object-body', getMediaObjectBodyClasses())}
        data-role="body"
      >
        {children}
      </div>
    </div>
  );
}

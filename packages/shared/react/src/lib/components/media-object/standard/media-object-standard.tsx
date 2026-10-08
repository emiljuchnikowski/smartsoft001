import { SmartMediaObjectProps } from '../media-object.types';

/**
 * The default media-object rendering (`<smart-media-object-standard>`): the
 * media `<img>` and a `.smart-media-object-body` holding `children`. The
 * position and alignment options are exposed as `data-position` (default
 * `left`) and `data-alignment` for styling.
 */
export function SmartMediaObjectStandard({
  mediaUrl,
  mediaAlt,
  options,
  className,
  children,
}: SmartMediaObjectProps) {
  return (
    <div
      className={className}
      data-position={options?.position ?? 'left'}
      data-alignment={options?.alignment ?? undefined}
    >
      <img src={mediaUrl} alt={mediaAlt} />
      <div className="smart-media-object-body">{children}</div>
    </div>
  );
}

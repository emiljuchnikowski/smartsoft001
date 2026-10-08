import { SmartAvatarProps } from '../avatar.types';
import { useAvatar } from '../use-avatar';

/**
 * The default avatar rendering: unstyled markup exposing `size`, `shape`,
 * `options.placeholderType` and, for a group, `options.stackDirection` as
 * `data-*` attributes.
 */
export function SmartAvatarStandard(props: SmartAvatarProps) {
  const {
    imageUrl,
    initials,
    size = 'md',
    shape = 'circle',
    group,
    options,
    className,
  } = props;
  const { isGroup } = useAvatar(props);

  return (
    <span
      className={className}
      data-size={size}
      data-shape={shape}
      data-placeholder-type={options?.placeholderType ?? 'icon'}
      data-stack-direction={
        isGroup ? (options?.stackDirection ?? 'top-to-bottom') : undefined
      }
    >
      {isGroup
        ? group?.map((item) => (
            <span key={item.id} className="smart-avatar-group-item">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" />
              ) : (
                <span className="smart-avatar-initials">{item.initials}</span>
              )}
            </span>
          ))
        : renderSingle(imageUrl, initials)}
    </span>
  );
}

function renderSingle(imageUrl?: string, initials?: string) {
  if (imageUrl) return <img src={imageUrl} alt="" />;

  if (initials)
    return <span className="smart-avatar-initials">{initials}</span>;

  return (
    <span aria-hidden="true" className="smart-avatar-placeholder">
      ·
    </span>
  );
}

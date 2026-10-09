// #region usage
import {
  IAvatarItem,
  SmartAvatar,
  SmartAvatarProps,
  SmartAvatarSize,
  SmartProvider,
  useAvatar,
} from '@smartsoft001/react';

export function CustomAvatar({
  imageUrl,
  initials,
  size = 'md',
  shape = 'circle',
  notificationPosition,
  group,
  className,
}: SmartAvatarProps) {
  const { isGroup } = useAvatar({ group });

  const containerClasses = [
    'docs-avatar',
    `docs-avatar--${size}`,
    `docs-avatar--${shape}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={containerClasses}>
      {isGroup ? (
        group?.map((item) => (
          <span key={item.id} className="docs-avatar__group-item">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" />
            ) : (
              <span className="docs-avatar__initials">{item.initials}</span>
            )}
          </span>
        ))
      ) : imageUrl ? (
        <img src={imageUrl} alt="" />
      ) : initials ? (
        <span className="docs-avatar__initials">{initials}</span>
      ) : (
        <span className="docs-avatar__placeholder" aria-hidden="true">
          &middot;
        </span>
      )}

      {notificationPosition && (
        <span
          className="docs-avatar__notification"
          data-position={notificationPosition}
        />
      )}
    </span>
  );
}

// A module constant: a new object on every render would change the context.
const components = { avatar: CustomAvatar };

const team: IAvatarItem[] = [
  { id: 'ana', initials: 'AK' },
  { id: 'bo', initials: 'BS' },
  { id: 'cai', initials: 'CL' },
];

export function AvatarCustomExample({
  size = 'md',
}: {
  size?: SmartAvatarSize;
}) {
  return (
    <SmartProvider components={components}>
      <SmartAvatar
        initials="TW"
        size={size}
        shape="rounded"
        notificationPosition="top"
      />

      <SmartAvatar group={team} size="sm" />
    </SmartProvider>
  );
}
// #endregion

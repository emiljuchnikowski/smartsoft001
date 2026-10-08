import { cn } from '../../../utils/class-names';
import { SmartAvatarProps } from '../avatar.types';
import { useAvatar } from '../use-avatar';
import {
  AVATAR_STATUS_WRAPPER,
  getAvatarGroupContainerClasses,
  getAvatarGroupItemImageClasses,
  getAvatarGroupItemInitialsClasses,
  getAvatarIconWrapperClasses,
  getAvatarImageClasses,
  getAvatarInitialsClasses,
  getAvatarStatusClasses,
} from './preset-classes';

type AvatarMode = 'image' | 'initials' | 'icon';

/**
 * Styled avatar variation (preset, `<smart-avatar-preset>`). Register it as
 * `components.avatar` on `SmartProvider` to restyle every `<SmartAvatar>`, or
 * render it directly.
 *
 * Renders an image, initials or icon placeholder across the `SmartAvatarSize`
 * scale in `circle` / `rounded` shapes, with an optional corner status dot
 * (`notificationPosition`) and a stacked group layout (`group` +
 * `options.stackDirection`). `className` goes on the outermost element: the
 * group container, the status wrapper, or the avatar itself.
 */
export function SmartAvatarPreset(props: SmartAvatarProps) {
  const {
    imageUrl,
    initials,
    size = 'md',
    shape = 'circle',
    notificationPosition,
    group,
    options,
    className,
  } = props;
  const { isGroup } = useAvatar(props);

  if (isGroup) {
    const itemImageClasses = getAvatarGroupItemImageClasses(size, shape);
    const itemInitialsClasses = getAvatarGroupItemInitialsClasses(size, shape);

    return (
      <div
        className={cn(
          getAvatarGroupContainerClasses(options?.stackDirection),
          className,
        )}
      >
        {group?.map((item) =>
          item.imageUrl ? (
            <img
              key={item.id}
              className={itemImageClasses}
              src={item.imageUrl}
              alt=""
            />
          ) : (
            <span key={item.id} className={itemInitialsClasses}>
              {item.initials}
            </span>
          ),
        )}
      </div>
    );
  }

  let mode: AvatarMode = 'icon';
  if (imageUrl) mode = 'image';
  else if (initials || options?.placeholderType === 'initials') {
    mode = 'initials';
  }

  const body = (cls: string | undefined) => {
    switch (mode) {
      case 'image':
        return (
          <img
            className={cn(getAvatarImageClasses(size, shape), cls)}
            src={imageUrl}
            alt=""
          />
        );
      case 'initials':
        return (
          <span className={cn(getAvatarInitialsClasses(size, shape), cls)}>
            {initials}
          </span>
        );
      default:
        return (
          <span className={cn(getAvatarIconWrapperClasses(size, shape), cls)}>
            <svg
              className="smart:size-full smart:text-gray-500 smart:dark:text-gray-400"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="0.62854"
                y="0.359985"
                width="15"
                height="15"
                rx="7.5"
                fill="currentColor"
                className="smart:fill-white smart:dark:fill-gray-800"
              />
              <path
                d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                fill="currentColor"
              />
              <path
                d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                fill="currentColor"
              />
            </svg>
          </span>
        );
    }
  };

  if (notificationPosition) {
    return (
      <div className={cn(AVATAR_STATUS_WRAPPER, className)}>
        {body(undefined)}
        <span
          className={getAvatarStatusClasses(size, notificationPosition)}
        ></span>
      </div>
    );
  }

  return body(className);
}

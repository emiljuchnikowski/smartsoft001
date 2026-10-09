// #region usage
import {
  IAvatarItem,
  IAvatarOptions,
  SmartAvatar,
  SmartAvatarShape,
  SmartAvatarSize,
} from '@smartsoft001/react';

const initials = 'JD';
const size: SmartAvatarSize = 'lg';
const shape: SmartAvatarShape = 'rounded';

const team: IAvatarItem[] = [
  { id: 'u1', imageUrl: 'https://i.pravatar.cc/64?img=1' },
  { id: 'u2', imageUrl: 'https://i.pravatar.cc/64?img=2' },
  { id: 'u3', initials: 'AK' },
];

const groupOptions: IAvatarOptions = {
  placeholderType: 'initials',
  stackDirection: 'bottom-to-top',
};

export function AvatarUsageExample() {
  return (
    <>
      <SmartAvatar initials={initials} size={size} shape={shape} />

      <SmartAvatar group={team} options={groupOptions} size="sm" />
    </>
  );
}
// #endregion

import { SmartAvatarProps } from './avatar.types';

/**
 * The state every avatar variant shares: whether `group` holds avatars to
 * stack.
 */
export function useAvatar({ group }: Pick<SmartAvatarProps, 'group'>) {
  return { isGroup: !!group?.length };
}

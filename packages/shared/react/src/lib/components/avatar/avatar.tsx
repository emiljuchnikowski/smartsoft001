import { SmartAvatarProps } from './avatar.types';
import { SmartAvatarStandard } from './standard/avatar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.avatar` on
 * `SmartProvider`, `SmartAvatarStandard` by default.
 */
export function SmartAvatar(props: SmartAvatarProps) {
  const Component = useSmartComponent('avatar', SmartAvatarStandard);

  return <Component {...props} />;
}

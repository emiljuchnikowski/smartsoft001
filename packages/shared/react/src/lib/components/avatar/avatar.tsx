import { SmartAvatarProps } from './avatar.types';
import { SmartAvatarStandard } from './standard/avatar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-avatar>`: renders the implementation registered as
 * `components.avatar` on `SmartProvider` (the Angular
 * `AVATAR_STANDARD_COMPONENT_TOKEN`), `SmartAvatarStandard` by default.
 */
export function SmartAvatar(props: SmartAvatarProps) {
  const Component = useSmartComponent('avatar', SmartAvatarStandard);

  return <Component {...props} />;
}

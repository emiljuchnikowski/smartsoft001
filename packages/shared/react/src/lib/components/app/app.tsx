import { SmartAppProps } from './app.types';
import { SmartAppStandard } from './standard/app-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * The application shell: renders the implementation registered as
 * `components.app` on `SmartProvider`, `SmartAppStandard` by default.
 * Implementations call `useApp(props)`.
 */
export function SmartApp(props: SmartAppProps) {
  const Component = useSmartComponent('app', SmartAppStandard);

  return <Component {...props} />;
}

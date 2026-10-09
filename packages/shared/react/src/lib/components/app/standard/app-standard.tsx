import { SmartAppProps } from '../app.types';
import { useApp } from '../use-app';

/**
 * The default application shell: only a root element running `useApp`
 * (title, menu items, style, permission classes, favicon) around `children`.
 * Register an implementation of your own as `components.app`, built on
 * `useApp`, to render the menu, logo and user.
 */
export function SmartAppStandard(props: SmartAppProps) {
  const { className, children } = props;
  const { rootRef } = useApp(props);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}

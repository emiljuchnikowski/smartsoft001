import { SmartDrawerProps } from '../drawer.types';
import { useDrawer } from '../use-drawer';

/** The default drawer rendering. */
export function SmartDrawerStandard(props: SmartDrawerProps) {
  const { title, options, className, children } = props;
  const { open, close } = useDrawer(props);

  if (!open) return null;

  return (
    <>
      {options?.withOverlay && (
        <div className="drawer-overlay" onClick={close} />
      )}
      <aside
        role="dialog"
        aria-modal="true"
        className={className}
        data-position={options?.position ?? 'right'}
        aria-labelledby={title ? 'smart-drawer-title' : undefined}
      >
        {title && (
          <header>
            <h2 id="smart-drawer-title">{title}</h2>
            <button type="button" aria-label="Close" onClick={close}>
              &times;
            </button>
          </header>
        )}
        {children}
      </aside>
    </>
  );
}

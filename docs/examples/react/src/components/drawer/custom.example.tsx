// #region usage
import {
  IDrawerOptions,
  SmartDrawer,
  SmartDrawerProps,
  SmartProvider,
  useDrawer,
} from '@smartsoft001/react';

/**
 * A custom drawer built on `useDrawer`.
 *
 * The hook owns the `open` state (controlled or not) and `close()`, which
 * hides the drawer and reports `onOpenChange(false)` and `onClosed`.
 */
export function CustomDrawer(props: SmartDrawerProps) {
  const { title, options, className } = props;
  const { open, close } = useDrawer(props);

  if (!open) return null;

  const panelClasses = [
    'docs-drawer__panel',
    options?.wide && 'docs-drawer__panel--wide',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {options?.withOverlay && (
        <div className="docs-drawer__overlay" onClick={close} />
      )}
      <aside
        role="dialog"
        aria-modal="true"
        className={panelClasses}
        data-position={options?.position ?? 'right'}
      >
        {title && (
          <header className="docs-drawer__header">
            <h2>{title}</h2>
            <button
              type="button"
              className="docs-drawer__close"
              aria-label="Close"
              onClick={close}
            >
              &times;
            </button>
          </header>
        )}
        {/* SmartDrawer passes its children on as `children`; this one
            renders a fixed body instead. */}
        <p className="docs-drawer__body">Your cart is empty.</p>
      </aside>
    </>
  );
}

// A module constant: a new object on every render would change the context.
const components = { drawer: CustomDrawer };

const options: IDrawerOptions = { position: 'right', withOverlay: true };

// Every <SmartDrawer> below the provider renders CustomDrawer.
export function DrawerCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartDrawer defaultOpen title="Shopping cart" options={options} />
    </SmartProvider>
  );
}
// #endregion

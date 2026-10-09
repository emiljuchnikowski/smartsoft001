// #region usage
import {
  IModalAction,
  IModalOptions,
  SmartModal,
  SmartModalProps,
  SmartProvider,
  useModal,
} from '@smartsoft001/react';

/**
 * A custom modal built on `useModal`: the hook keeps the open state
 * (controlled or from `defaultOpen`) and provides `invokeAction(id)` and
 * `close()`, which already report `onActionClick` and `onClosed`. It binds no
 * keyboard or backdrop listeners, so the implementation wires the backdrop
 * click itself.
 */
export function CustomModal(props: SmartModalProps) {
  const {
    title,
    description,
    actions = [],
    options,
    className,
    children,
  } = props;
  const { open, invokeAction, close } = useModal(props);

  if (!open) return null;

  const classes = [
    'docs-modal',
    options?.variant && `docs-modal--${options.variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="docs-modal__backdrop" onClick={close} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={options?.ariaLabel ?? title}
        className={classes}
      >
        {options?.withDismiss && (
          <button
            type="button"
            className="docs-modal__dismiss"
            aria-label="Close"
            onClick={close}
          >
            &times;
          </button>
        )}

        {title && <h2 className="docs-modal__title">{title}</h2>}
        {description && (
          <p className="docs-modal__description">{description}</p>
        )}

        {children}

        <footer
          className={`docs-modal__footer docs-modal__footer--${options?.footerStyle ?? 'default'}`}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="docs-modal__action"
              data-variant={action.variant ?? 'primary'}
              onClick={() => invokeAction(action.id)}
            >
              {action.label}
            </button>
          ))}
        </footer>
      </div>
    </>
  );
}

// A module constant: a new object on every render would change the context.
const components = { modal: CustomModal };

const actions: IModalAction[] = [
  { id: 'cancel', label: 'Cancel', variant: 'secondary' },
  { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
];

const options: IModalOptions = {
  variant: 'centered',
  footerStyle: 'gray',
  withDismiss: true,
};

/**
 * Every `SmartModal` below this provider, and every modal opened through
 * `ModalService.show`, renders `CustomModal` instead of the standard
 * rendering.
 */
export function ModalCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartModal
        defaultOpen
        title="Deactivate account"
        description="Once the account is deactivated all of its data will be permanently removed."
        actions={actions}
        options={options}
      />
    </SmartProvider>
  );
}
// #endregion

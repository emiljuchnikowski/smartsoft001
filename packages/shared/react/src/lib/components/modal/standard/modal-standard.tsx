import { SmartModalProps } from '../modal.types';
import { useModal } from '../use-modal';

/**
 * The default modal rendering (`<smart-modal-standard>`): a native `<dialog>`
 * always in the DOM, shown through its `open` attribute (not `showModal()`).
 * Its native `close` event closes the modal as well.
 */
export function SmartModalStandard(props: SmartModalProps) {
  const {
    title,
    description,
    actions = [],
    options,
    className,
    children,
  } = props;
  const { open, invokeAction, close } = useModal(props);

  return (
    <dialog
      open={open}
      className={className}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'smart-modal-title' : undefined}
      aria-label={!title ? (options?.ariaLabel ?? undefined) : undefined}
      onClose={close}
    >
      {options?.withDismiss && (
        <button
          type="button"
          className="smart-modal-dismiss"
          aria-label="Close"
          onClick={close}
        >
          &times;
        </button>
      )}
      {title && <h2 id="smart-modal-title">{title}</h2>}
      {description && <p>{description}</p>}
      {children}
      {actions.length > 0 && (
        <footer>
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              data-variant={action.variant ?? 'primary'}
              onClick={() => invokeAction(action.id)}
            >
              {action.label}
            </button>
          ))}
        </footer>
      )}
    </dialog>
  );
}

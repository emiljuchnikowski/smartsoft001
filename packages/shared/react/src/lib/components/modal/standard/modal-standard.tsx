import { cn } from '../../../utils/class-names';
import { SmartModalProps } from '../modal.types';
import { useModal } from '../use-modal';

/**
 * Minimal positioning of the `bottom-sheet` variant on the native dialog:
 * docked to the bottom of the viewport, full width (centred under a max width
 * from `sm`, with rounded top corners), at most 85% of the viewport high with
 * its own scroll. The other variants keep the browser's dialog layout.
 */
const BOTTOM_SHEET_CLASSES = [
  'smart:fixed',
  'smart:inset-x-0',
  'smart:top-auto',
  'smart:bottom-0',
  'smart:z-[80]',
  'smart:m-0',
  'smart:w-full',
  'smart:max-w-none',
  'smart:max-h-[85dvh]',
  'smart:overflow-y-auto',
  'smart:sm:mx-auto',
  'smart:sm:max-w-2xl',
  'smart:sm:rounded-t-xl',
];

/**
 * The default modal rendering: a native `<dialog>` always in the DOM, shown
 * through its `open` attribute (not `showModal()`). Its native `close` event
 * closes the modal as well. `options.variant` is exposed as `data-variant`;
 * the `bottom-sheet` variant docks the dialog to the bottom of the viewport.
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
  const bottomSheet = options?.variant === 'bottom-sheet';

  return (
    <dialog
      open={open}
      className={
        cn(bottomSheet && BOTTOM_SHEET_CLASSES, className) || undefined
      }
      data-variant={options?.variant}
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

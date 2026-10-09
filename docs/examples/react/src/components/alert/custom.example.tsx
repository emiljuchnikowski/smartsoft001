// #region usage
import { useEffect, useState } from 'react';

import {
  IAlertOptions,
  SmartAlert,
  SmartAlertProps,
  SmartProvider,
  useAlert,
} from '@smartsoft001/react';

/**
 * A custom confirm dialog built on `useAlert`.
 *
 * The hook owns the behaviour: `invoke(button)` runs the button's handler and
 * calls `onDismissed`, `onEscape()` dismisses with the cancel button,
 * `trapFocus()` keeps Tab inside the panel. It binds no listeners itself, so
 * the component wires the backdrop click, the keydown and the document Escape.
 */
export function CustomAlert(props: SmartAlertProps) {
  const { options, className } = props;
  const {
    headerId,
    messageId,
    buttons,
    invoke,
    onEscape,
    onBackdropClick,
    trapFocus,
  } = useAlert(props);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [onEscape]);

  return (
    <div className="docs-alert__backdrop" onClick={onBackdropClick}>
      <div
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={headerId}
        aria-describedby={options.message ? messageId : undefined}
        className={['docs-alert', className].filter(Boolean).join(' ')}
        onKeyDown={(event) => trapFocus(event, event.currentTarget)}
      >
        <h2 className="docs-alert__header" id={headerId}>
          {options.header}
        </h2>
        {options.message && (
          <p className="docs-alert__message" id={messageId}>
            {options.message}
          </p>
        )}
        <footer className="docs-alert__footer">
          {buttons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="docs-alert__button"
              data-role={button.role}
              onClick={() => invoke(button)}
            >
              {button.text}
            </button>
          ))}
        </footer>
      </div>
    </div>
  );
}

// Registered under 'alert', it renders every <SmartAlert> below the provider
// and the dialogs of AlertService.show(). A module constant: a new object on
// every render would change the context.
const components = { alert: CustomAlert };

export function AlertCustomExample() {
  const [open, setOpen] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const options: IAlertOptions = {
    header: 'Delete this record?',
    message: 'The record is removed permanently. This cannot be undone.',
    backdropDismiss: false,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive', handler: () => setDeleted(true) },
    ],
  };

  return (
    <SmartProvider components={components}>
      {open && (
        <SmartAlert options={options} onDismissed={() => setOpen(false)} />
      )}
      {deleted && <p>Record deleted.</p>}
    </SmartProvider>
  );
}
// #endregion

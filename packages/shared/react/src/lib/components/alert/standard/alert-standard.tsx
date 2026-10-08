import { useEffect, useRef } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartAlertProps } from '../alert.types';
import { useAlert } from '../use-alert';

/**
 * The default alert dialog (`<smart-alert-standard>`): a modal
 * `alertdialog` on a full-screen backdrop, rendered where it is placed (the
 * alert host of `SmartProvider` decides where that is).
 *
 * On mount it focuses its first button (or the panel), keeps Tab inside the
 * panel, and cancels on Escape and on a click on the backdrop; see
 * `SmartAlertProps.onDismissed`.
 */
export function SmartAlertStandard(props: SmartAlertProps) {
  const { options, className } = props;
  const {
    headerId,
    messageId,
    buttons,
    invoke,
    onEscape,
    onBackdropClick,
    trapFocus,
    buttonClasses,
  } = useAlert(props);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [onEscape]);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) return;

    const target = panel.querySelector<HTMLElement>('button') ?? panel;

    target.focus?.();
  }, []);

  return (
    <div
      className="smart:fixed smart:inset-0 smart:z-[90] smart:flex smart:items-center smart:justify-center smart:p-4 smart:bg-gray-900/50 smart:dark:bg-gray-900/80"
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={options.header ? headerId : undefined}
        aria-describedby={options.message ? messageId : undefined}
        className={cn(
          'smart:w-full smart:max-w-md smart:rounded-xl smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:shadow-xl smart:p-5 smart:focus:outline-none',
          className,
        )}
        onKeyDown={(event) => trapFocus(event, event.currentTarget)}
      >
        {options.header && (
          <h2
            id={headerId}
            className="smart:text-lg smart:font-semibold smart:text-gray-900 smart:dark:text-white"
          >
            {options.header}
          </h2>
        )}
        {options.subHeader && (
          <h3 className="smart:mt-1 smart:text-sm smart:font-medium smart:text-gray-700 smart:dark:text-gray-300">
            {options.subHeader}
          </h3>
        )}
        {options.message && (
          <p
            id={messageId}
            className="smart:mt-2 smart:text-sm smart:text-gray-600 smart:dark:text-gray-400"
          >
            {options.message}
          </p>
        )}
        {buttons.length > 0 && (
          <div className="smart:mt-5 smart:flex smart:justify-end smart:gap-x-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                type="button"
                data-role={button.role}
                className={buttonClasses(button)}
                onClick={() => invoke(button)}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

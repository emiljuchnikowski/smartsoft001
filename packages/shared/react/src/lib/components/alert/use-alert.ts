import { useCallback, useId } from 'react';

import { SmartAlertProps } from './alert.types';
import { IAlertButton } from '../../models';
import { cn } from '../../utils/class-names';

const BUTTON_BASE =
  'smart:rounded-md smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:shadow-sm smart:focus:outline-none smart:focus-visible:outline-2 smart:focus-visible:outline-offset-2';

const BUTTON_CANCEL =
  'smart:bg-white smart:text-gray-900 smart:border smart:border-gray-300 smart:hover:bg-gray-50 smart:dark:bg-gray-700 smart:dark:text-white smart:dark:border-gray-600 smart:dark:hover:bg-gray-600';

const BUTTON_DESTRUCTIVE =
  'smart:bg-red-600 smart:text-white smart:hover:bg-red-500 smart:dark:bg-red-500 smart:dark:hover:bg-red-400';

const BUTTON_PRIMARY =
  'smart:bg-blue-600 smart:text-white smart:hover:bg-blue-500 smart:dark:bg-blue-500 smart:dark:hover:bg-blue-400';

/**
 * Classes of an alert button by `role` (`cancel` -> secondary,
 * `destructive` -> red, anything else -> primary), followed by its
 * `cssClass`.
 */
export function getAlertButtonClasses(button: IAlertButton): string {
  const role =
    button.role === 'cancel'
      ? BUTTON_CANCEL
      : button.role === 'destructive'
        ? BUTTON_DESTRUCTIVE
        : BUTTON_PRIMARY;

  const custom = Array.isArray(button.cssClass)
    ? button.cssClass.join(' ')
    : button.cssClass;

  return cn(BUTTON_BASE, role, custom);
}

/** The part of a keyboard event the focus trap reads (DOM or React). */
export interface SmartAlertKeyEvent {
  key: string;
  shiftKey: boolean;
  preventDefault(): void;
}

/** The part of a mouse event the backdrop click reads (DOM or React). */
export interface SmartAlertBackdropEvent {
  target: EventTarget | null;
  currentTarget: EventTarget | null;
}

function trapFocus(event: SmartAlertKeyEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return;

  const buttons = Array.from(
    container.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
  );

  if (!buttons.length) return;

  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  const active = container.ownerDocument.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * The behaviour every alert variant shares: the ids linking the dialog to its
 * header and message, the buttons, and the ways to close it, all reported
 * through `onDismissed`:
 *
 * - `invoke(button)` runs `button.handler` and dismisses with the button,
 *   unless the handler of a non-cancel button returned `false`;
 * - `cancel()` / `onEscape()` dismiss with the cancel button (or `null`),
 *   without running its handler;
 * - `onBackdropClick(event)` cancels on a click on the backdrop itself,
 *   unless `options.backdropDismiss === false`;
 * - `trapFocus(event, panel)` keeps Tab / Shift+Tab on the panel's buttons.
 */
export function useAlert({
  options,
  onDismissed,
}: Pick<SmartAlertProps, 'options' | 'onDismissed'>) {
  const instanceId = 'smart-alert-' + useId();
  const buttons = options.buttons ?? [];
  const cancelButton =
    buttons.find((button) => button.role === 'cancel') ?? null;
  const backdropDismiss = options.backdropDismiss;

  const invoke = useCallback(
    (button: IAlertButton) => {
      const result = button.handler?.();

      if (result === false && button.role !== 'cancel') return;

      onDismissed?.(button);
    },
    [onDismissed],
  );

  const cancel = useCallback(() => {
    onDismissed?.(cancelButton);
  }, [onDismissed, cancelButton]);

  const onBackdropClick = useCallback(
    (event: SmartAlertBackdropEvent) => {
      if (event.target !== event.currentTarget) return;
      if (backdropDismiss === false) return;

      cancel();
    },
    [backdropDismiss, cancel],
  );

  return {
    headerId: instanceId + '-header',
    messageId: instanceId + '-message',
    buttons,
    cancelButton,
    invoke,
    cancel,
    onEscape: cancel,
    onBackdropClick,
    trapFocus,
    buttonClasses: getAlertButtonClasses,
  };
}

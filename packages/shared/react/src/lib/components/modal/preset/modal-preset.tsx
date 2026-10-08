import { useEffect } from 'react';
import type { MouseEvent } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartModalProps } from '../modal.types';
import { useModal } from '../use-modal';
import {
  getModalActionClasses,
  getModalFooterClasses,
  getModalPanelClasses,
  getModalWrapperClasses,
  MODAL_BACKDROP,
  MODAL_BODY,
  MODAL_DESCRIPTION,
  MODAL_DISMISS,
  MODAL_HEADER,
  MODAL_TITLE,
} from './preset-classes';

/**
 * Styled modal variation (preset). Register it as `components.modal` on
 * `SmartProvider` to restyle every `<SmartModal>`, or render it directly.
 *
 * Preline's Overlay JS plugin is NOT used: open/close is driven by the shared
 * `open` state; a click on the backdrop itself (not the panel) and Escape on
 * the document close the modal, as the dismiss button does. Rendered inline
 * (no portal): the backdrop is `fixed` over the viewport.
 */
export function SmartModalPreset(props: SmartModalProps) {
  const {
    title,
    description,
    actions = [],
    options,
    className,
    children,
  } = props;
  const { open, invokeAction, close } = useModal(props);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') close();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  if (!open) return null;

  const variant = options?.variant ?? 'centered';
  const footerStyle = options?.footerStyle ?? 'default';
  const withDismiss = Boolean(options?.withDismiss);

  const onBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    // Only dismiss when the backdrop itself is clicked, not the panel.
    if (event.target === event.currentTarget) {
      close();
    }
  };

  return (
    <div
      className={MODAL_BACKDROP}
      role="presentation"
      onClick={onBackdropClick}
    >
      <div className={cn(getModalWrapperClasses(variant), className)}>
        <div
          className={getModalPanelClasses(variant)}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-labelledby={title ? 'smart-modal-preset-title' : undefined}
          aria-label={!title ? (options?.ariaLabel ?? undefined) : undefined}
        >
          {(title || withDismiss) && (
            <div className={MODAL_HEADER}>
              {title && (
                <h3 id="smart-modal-preset-title" className={MODAL_TITLE}>
                  {title}
                </h3>
              )}
              {withDismiss && (
                <button
                  type="button"
                  className={MODAL_DISMISS}
                  aria-label="Close"
                  onClick={close}
                >
                  <span className="smart:sr-only">Close</span>
                  <svg
                    className="smart:shrink-0 smart:size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className={MODAL_BODY}>
            {description && <p className={MODAL_DESCRIPTION}>{description}</p>}
            {children}
          </div>

          {actions.length > 0 && (
            <div className={getModalFooterClasses(variant, footerStyle)}>
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={getModalActionClasses(action.variant)}
                  onClick={() => invokeAction(action.id)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

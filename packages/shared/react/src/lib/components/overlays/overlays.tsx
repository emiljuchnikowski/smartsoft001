import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { IModalOptions } from '../../models';
import { useSmart } from '../../providers/smart-context';
import { IModalRequest } from '../../services/modal/modal.service';
import { IToast } from '../../services/toast/toast.service';
import { useStore } from '../../store/store';
import { cn } from '../../utils/class-names';
import { SmartAlert } from '../alert/alert';
import { SmartModal } from '../modal/modal';
import { SmartNotification } from '../notification/notification';

/** Renders `children` at the end of `<body>`, once mounted in the browser. */
function BodyPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(children, document.body);
}

/** The toasts of `ToastService`, rendered through `<SmartNotification>`. */
export function SmartToastHost() {
  const { toastService } = useSmart();
  const toasts = useStore(toastService.toasts);

  if (!toasts.length) return null;

  return (
    <BodyPortal>
      <div
        className="smart:pointer-events-none smart:fixed smart:inset-x-0 smart:bottom-0 smart:z-50 smart:flex smart:flex-col smart:items-center smart:gap-2 smart:p-4 smart:sm:items-end"
        data-role="toasts"
      >
        {toasts.map((toast: IToast) => (
          <div
            key={toast.id}
            className="smart:pointer-events-auto smart:w-full smart:max-w-sm"
          >
            <SmartNotification
              title={toast.title ?? toast.message}
              description={toast.title ? toast.message : undefined}
              dismissible
              actions={toast.buttons?.map((button, index) => ({
                id: String(index),
                label: button.text,
              }))}
              options={{
                variant: toast.buttons?.length ? 'condensed' : 'simple',
                ariaLive: toast.type === 'error' ? 'assertive' : 'polite',
              }}
              onActionClick={({ actionId }) =>
                toast.buttons?.[Number(actionId)]?.handler()
              }
              onDismissed={() => toastService.dismiss(toast.id)}
            />
          </div>
        ))}
      </div>
    </BodyPortal>
  );
}

/** The dialogs `AlertService.show` opened, rendered through `<SmartAlert>`. */
export function SmartAlertHost() {
  const { alertService } = useSmart();
  const alerts = useStore(alertService.alerts);

  if (!alerts.length) return null;

  return (
    <BodyPortal>
      {alerts.map((alert) => (
        <SmartAlert
          key={alert.id}
          options={alert.options}
          onDismissed={alert.resolve}
        />
      ))}
    </BodyPortal>
  );
}

/** The modals of `ModalService` show their close button. */
const MODAL_HOST_OPTIONS: IModalOptions = { withDismiss: true };

/**
 * With `backdropDismiss: false`, stops a click that lands in the modal but
 * outside its dialog (the backdrop) before the modal sees it.
 */
function keepOpenOnBackdrop(
  request: IModalRequest,
  event: MouseEvent<HTMLDivElement>,
): void {
  if (request.backdropDismiss !== false) return;

  const target = event.target as Element | null;

  if (!target?.closest?.('[role="dialog"]')) event.stopPropagation();
}

/**
 * The components `ModalService.show` opened, each in a `<SmartModal>` with its
 * close button, the last one on top. The component gets its `props` and a
 * `dismiss(data)` prop that closes the modal with a result. `cssClass` (and
 * `smart-modal-bottom` for `mode: 'bottom'`) goes on the modal; with
 * `backdropDismiss: false` a click on the backdrop leaves it open.
 */
export function SmartModalHost() {
  const { modalService } = useSmart();
  const modals = useStore(modalService.modals);

  if (!modals.length) return null;

  return (
    <BodyPortal>
      {modals.map((request) => {
        const {
          id,
          component: Component,
          props,
          dismiss,
          cssClass,
          mode,
        } = request;

        return (
          <div
            key={id}
            className="smart:contents"
            data-role="modal"
            data-mode={mode ?? 'default'}
            onClickCapture={(event) => keepOpenOnBackdrop(request, event)}
          >
            <SmartModal
              open
              className={
                cn(cssClass, mode === 'bottom' && 'smart-modal-bottom') ||
                undefined
              }
              options={MODAL_HOST_OPTIONS}
              onClosed={() => dismiss()}
            >
              <Component {...(props ?? {})} dismiss={dismiss} />
            </SmartModal>
          </div>
        );
      })}
    </BodyPortal>
  );
}

/**
 * The hosts of everything the services open: toasts, alerts and modals.
 * `SmartProvider` renders it unless given other `overlays`.
 */
export function SmartOverlays() {
  return (
    <>
      <SmartToastHost />
      <SmartAlertHost />
      <SmartModalHost />
    </>
  );
}

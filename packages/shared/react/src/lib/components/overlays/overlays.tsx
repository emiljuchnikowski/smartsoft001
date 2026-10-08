import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useSmart } from '../../providers/smart-context';
import { IToast } from '../../services/toast/toast.service';
import { useStore } from '../../store/store';
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

/**
 * The components `ModalService.show` opened, each in a `<SmartModal>`. The
 * component gets its `props` and a `dismiss(data)` prop that closes the
 * modal with a result.
 */
export function SmartModalHost() {
  const { modalService } = useSmart();
  const modals = useStore(modalService.modals);

  if (!modals.length) return null;

  return (
    <BodyPortal>
      {modals.map(({ id, component: Component, props, dismiss, cssClass }) => (
        <SmartModal
          key={id}
          open
          className={cssClass?.join(' ')}
          onClosed={() => dismiss()}
        >
          <Component {...(props ?? {})} dismiss={dismiss} />
        </SmartModal>
      ))}
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

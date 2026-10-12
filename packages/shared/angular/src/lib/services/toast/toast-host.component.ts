import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import type { IToast } from './toast.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import {
  INotificationAction,
  INotificationOptions,
  SmartNotificationVariant,
} from '../../models';

/** A click on the button at `index` of the toast `id`. */
export interface IToastHostActionClick {
  id: number;
  index: number;
}

interface IToastView {
  id: number;
  type: IToast['type'];
  title: string;
  description?: string;
  actions: INotificationAction[];
  options: INotificationOptions;
}

/**
 * The notification variant of a toast: `simple` without buttons (it renders no
 * actions), `condensed` for a message with buttons, `with-actions-below` for a
 * title, its message and buttons (`condensed` would drop the message).
 */
function getToastVariant(toast: IToast): SmartNotificationVariant {
  if (!toast.buttons?.length) return 'simple';

  return toast.title ? 'with-actions-below' : 'condensed';
}

function toView(toast: IToast): IToastView {
  return {
    id: toast.id,
    type: toast.type,
    title: toast.title || toast.message,
    description: toast.title ? toast.message : undefined,
    actions: (toast.buttons ?? []).map((button, index) => ({
      id: String(index),
      label: button.text,
    })),
    options: {
      variant: getToastVariant(toast),
      ariaLive: toast.type === 'error' ? 'assertive' : 'polite',
    },
  };
}

/**
 * The toasts of `ToastService`, rendered through `<smart-notification>` (so
 * through the implementation registered for
 * `NOTIFICATION_STANDARD_COMPONENT_TOKEN`) in a stack fixed to the bottom of
 * the viewport, above the modals. `ToastService` mounts it at the end of
 * `<body>` while it has toasts; it is not meant to be placed in a template.
 */
@Component({
  selector: 'smart-toast-host',
  template: `
    <div
      class="smart:pointer-events-none smart:fixed smart:inset-x-0 smart:bottom-0 smart:z-[100] smart:flex smart:flex-col smart:items-center smart:gap-2 smart:p-4 smart:sm:items-end"
      data-role="toasts"
    >
      @for (toast of views(); track toast.id) {
        <div
          class="smart:pointer-events-auto smart:w-full smart:max-w-sm"
          [attr.data-type]="toast.type"
        >
          <smart-notification
            [title]="toast.title"
            [description]="toast.description"
            [dismissible]="true"
            [actions]="toast.actions"
            [options]="toast.options"
            (actionClick)="onActionClick(toast.id, $event.actionId)"
            (dismissed)="dismissed.emit(toast.id)"
          />
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [NotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHostComponent {
  toasts = input<IToast[]>([]);

  /** The close button of the toast `id` was clicked. */
  dismissed = output<number>();
  /** A button of a toast was clicked. */
  actionClick = output<IToastHostActionClick>();

  // One view per toast object, so a toast keeps its inputs while others come
  // and go.
  private readonly cache = new WeakMap<IToast, IToastView>();

  protected readonly views = computed(() =>
    this.toasts().map((toast) => {
      let view = this.cache.get(toast);

      if (!view) {
        view = toView(toast);
        this.cache.set(toast, view);
      }

      return view;
    }),
  );

  protected onActionClick(id: number, actionId: string): void {
    this.actionClick.emit({ id, index: Number(actionId) });
  }
}

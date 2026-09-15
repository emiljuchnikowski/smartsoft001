// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  INotificationAction,
  INotificationOptions,
  NOTIFICATION_STANDARD_COMPONENT_TOKEN,
  NotificationBaseComponent,
  NotificationComponent,
} from '@smartsoft001/angular';

/**
 * A custom notification built on `NotificationBaseComponent`.
 *
 * The base contributes every input plus the `dismiss()` and
 * `invokeAction(id)` helpers, which already emit the `dismissed` and
 * `actionClick` outputs - the implementation only decides the markup.
 */
@Component({
  selector: 'docs-custom-notification',
  template: `
    <section
      role="status"
      [attr.aria-live]="options()?.ariaLive ?? 'polite'"
      [class]="containerClasses()"
    >
      @if (avatarUrl()) {
        <img class="docs-notification__avatar" [src]="avatarUrl()" alt="" />
      } @else if (iconName()) {
        <span class="docs-notification__icon" aria-hidden="true">{{
          iconName()
        }}</span>
      }

      <div class="docs-notification__body">
        <h3 class="docs-notification__title">{{ title() }}</h3>
        @if (description()) {
          <p class="docs-notification__description">{{ description() }}</p>
        }

        @if (actions().length) {
          <div class="docs-notification__actions">
            @for (action of actions(); track action.id) {
              <button
                type="button"
                class="docs-notification__action"
                [attr.data-variant]="action.variant ?? 'primary'"
                (click)="invokeAction(action.id)"
              >
                {{ action.label }}
              </button>
            }
          </div>
        }
      </div>

      @if (dismissible()) {
        <button
          type="button"
          class="docs-notification__dismiss"
          aria-label="Close"
          (click)="dismiss()"
        >
          &times;
        </button>
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomNotificationComponent extends NotificationBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['docs-notification'];
    const variant = this.options()?.variant;
    if (variant) classes.push(`docs-notification--${variant}`);
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against
 * `NOTIFICATION_STANDARD_COMPONENT_TOKEN` makes every `<smart-notification>`
 * in this injector render it instead of the standard variation.
 *
 * NgComponentOutlet does not forward outputs, so the wrapper's `(dismissed)`
 * and `(actionClick)` stay silent - a consumer listens on the custom component.
 */
@Component({
  selector: 'docs-notification-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationComponent],
  providers: [
    {
      provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
      useValue: CustomNotificationComponent,
    },
  ],
  template: `
    <smart-notification
      title="App notifications"
      description="Notifications may include alerts, sounds and icon badges."
      [avatarUrl]="avatarUrl"
      [actions]="actions"
      [dismissible]="true"
      [options]="options"
    />
  `,
})
export class NotificationCustomExampleComponent {
  avatarUrl =
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  actions: INotificationAction[] = [
    { id: 'deny', label: "Don't allow", variant: 'secondary' },
    { id: 'allow', label: 'Allow', variant: 'primary' },
  ];

  options: INotificationOptions = {
    variant: 'with-actions-below',
    ariaLive: 'polite',
  };
}
// #endregion

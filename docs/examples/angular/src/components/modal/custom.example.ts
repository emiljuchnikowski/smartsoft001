// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  IModalAction,
  IModalOptions,
  MODAL_STANDARD_COMPONENT_TOKEN,
  ModalBaseComponent,
  ModalComponent,
} from '@smartsoft001/angular';

/**
 * A custom modal built on `ModalBaseComponent`.
 *
 * The base contributes the `open` model plus the `invokeAction(id)` and
 * `close()` helpers, which already emit `actionClick` and `closed`. The base
 * binds no keyboard or backdrop listeners, so the implementation wires the
 * backdrop click itself.
 */
@Component({
  selector: 'docs-custom-modal',
  template: `
    @if (open()) {
      <div class="docs-modal__backdrop" (click)="close()"></div>

      <div
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="options()?.ariaLabel ?? title()"
        [class]="containerClasses()"
      >
        @if (options()?.withDismiss) {
          <button
            type="button"
            class="docs-modal__dismiss"
            aria-label="Close"
            (click)="close()"
          >
            &times;
          </button>
        }

        @if (title()) {
          <h2 class="docs-modal__title">{{ title() }}</h2>
        }
        @if (description()) {
          <p class="docs-modal__description">{{ description() }}</p>
        }

        <!-- The content of <smart-modal> is projected here. -->
        <div class="docs-modal__body">
          <ng-content />
        </div>

        <footer [class]="footerClasses()">
          @for (action of actions(); track action.id) {
            <button
              type="button"
              class="docs-modal__action"
              [attr.data-variant]="action.variant ?? 'primary'"
              (click)="invokeAction(action.id)"
            >
              {{ action.label }}
            </button>
          }
        </footer>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomModalComponent extends ModalBaseComponent {
  containerClasses = computed(() => {
    const classes = ['docs-modal'];
    const variant = this.options()?.variant;
    if (variant) classes.push(`docs-modal--${variant}`);
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  footerClasses = computed(() =>
    [
      'docs-modal__footer',
      `docs-modal__footer--${this.options()?.footerStyle ?? 'default'}`,
    ].join(' '),
  );
}

/**
 * Registering the implementation against `MODAL_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-modal>` in this injector render it instead of the
 * standard variation. The wrapper forwards its inputs, its content and the
 * implementation's `actionClick`, `closed` and `open` changes.
 */
@Component({
  selector: 'docs-modal-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent],
  providers: [
    { provide: MODAL_STANDARD_COMPONENT_TOKEN, useValue: CustomModalComponent },
  ],
  template: `
    <smart-modal
      [open]="true"
      title="Deactivate account"
      description="Once the account is deactivated all of its data will be permanently removed."
      [actions]="actions"
      [options]="options"
      (actionClick)="lastAction.set($event.actionId)"
    >
      <p>Your invoices stay available for 30 days.</p>
    </smart-modal>

    <p class="docs-modal__last-action">
      Last action: {{ lastAction() ?? 'none' }}
    </p>
  `,
})
export class ModalCustomExampleComponent {
  lastAction = signal<string | null>(null);

  actions: IModalAction[] = [
    { id: 'cancel', label: 'Cancel', variant: 'secondary' },
    { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
  ];

  options: IModalOptions = {
    variant: 'centered',
    footerStyle: 'gray',
    withDismiss: true,
  };
}
// #endregion

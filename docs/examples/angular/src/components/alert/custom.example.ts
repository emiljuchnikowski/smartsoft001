// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ALERT_STANDARD_COMPONENT_TOKEN,
  AlertBaseComponent,
  AlertComponent,
  IAlertOptions,
} from '@smartsoft001/angular';

/**
 * A custom confirm dialog built on `AlertBaseComponent`.
 *
 * The base owns the behaviour: `invoke(button)` runs the button's handler and
 * emits `dismissed`, `cancel()` emits the cancel button, `trapFocus()` keeps
 * Tab inside the panel. It binds no listeners itself, so the template wires
 * the backdrop click, the keydown and the document Escape.
 */
@Component({
  selector: 'docs-custom-alert',
  template: `
    <div class="docs-alert__backdrop" (click)="onBackdropClick($event)">
      <div
        role="alertdialog"
        aria-modal="true"
        tabindex="-1"
        [attr.aria-labelledby]="headerId"
        [attr.aria-describedby]="options().message ? messageId : null"
        [class]="panelClasses()"
        (keydown)="trapFocus($event, panel)"
        #panel
      >
        <h2 class="docs-alert__header" [id]="headerId">
          {{ options().header }}
        </h2>
        @if (options().message) {
          <p class="docs-alert__message" [id]="messageId">
            {{ options().message }}
          </p>
        }
        <footer class="docs-alert__footer">
          @for (button of buttons(); track $index) {
            <button
              type="button"
              class="docs-alert__button"
              [attr.data-role]="button.role ?? null"
              (click)="invoke(button)"
            >
              {{ button.text }}
            </button>
          }
        </footer>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class CustomAlertComponent extends AlertBaseComponent {
  // The wrapper and AlertService create the component by type, so inputs
  // arrive by canonical name: no 'class' alias here.
  override cssClass = input<string>('');

  panelClasses = computed(() => {
    const classes = ['docs-alert'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

/**
 * Registering the implementation against `ALERT_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-alert>` in this injector render it instead of the
 * standard variation. Provided at the application root, `AlertService.show()`
 * renders it as well.
 */
@Component({
  selector: 'docs-alert-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent],
  providers: [
    { provide: ALERT_STANDARD_COMPONENT_TOKEN, useValue: CustomAlertComponent },
  ],
  template: `<smart-alert [options]="options" />`,
})
export class AlertCustomExampleComponent {
  deleted = false;

  options: IAlertOptions = {
    header: 'Delete this record?',
    message: 'The record is removed permanently. This cannot be undone.',
    backdropDismiss: false,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleted = true;
        },
      },
    ],
  };
}
// #endregion

// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
  EmptyStateBaseComponent,
  EmptyStateComponent,
  IEmptyStateOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-empty-state',
  template: `
    <div class="docs-empty-state" [class]="cssClass()">
      @if (options()?.title) {
        <h3 class="docs-empty-state__title">{{ options()?.title }}</h3>
      }
      @if (options()?.description) {
        <p class="docs-empty-state__description">
          {{ options()?.description }}
        </p>
      }
      @for (action of options()?.actions ?? []; track action.id) {
        <button
          type="button"
          class="docs-empty-state__action"
          [attr.data-variant]="action.variant ?? 'primary'"
          (click)="actionClick.emit({ actionId: action.id })"
        >
          {{ action.label }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomEmptyStateComponent extends EmptyStateBaseComponent {}

@Component({
  selector: 'docs-empty-state-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStateComponent],
  // The token swaps the standard empty state for the custom one everywhere
  // below this component, so consumers keep writing `<smart-empty-state>`.
  providers: [
    {
      provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
      useValue: CustomEmptyStateComponent,
    },
  ],
  // The wrapper re-emits the implementation's `actionClick` and `itemClick`,
  // so the handlers stay on `<smart-empty-state>`.
  template: `
    <smart-empty-state
      [options]="options"
      (actionClick)="lastAction.set($event.actionId)"
    />
  `,
})
export class EmptyStateCustomExampleComponent {
  lastAction = signal<string | null>(null);

  options: IEmptyStateOptions = {
    title: 'No draft invoices',
    description: 'Draft an invoice and send it to a customer.',
    actions: [
      { id: 'create', label: 'Create a new invoice', variant: 'primary' },
      { id: 'template', label: 'Use a template', variant: 'secondary' },
    ],
  };
}
// #endregion

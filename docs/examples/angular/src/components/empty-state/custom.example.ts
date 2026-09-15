// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  input,
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
export class CustomEmptyStateComponent extends EmptyStateBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class'
  // alias, so an empty state registered through the token declares it
  // explicitly.
  override cssClass = input<string>('');
}

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
  // NgComponentOutlet forwards inputs but not outputs, so `(actionClick)` and
  // `(itemClick)` on the wrapper stay silent once a custom implementation is
  // registered - handle the click inside the custom component instead.
  template: `<smart-empty-state [options]="options" />`,
})
export class EmptyStateCustomExampleComponent {
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

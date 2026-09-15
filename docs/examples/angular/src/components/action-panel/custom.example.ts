// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ActionPanelBaseComponent,
  ActionPanelComponent,
  ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
  IActionPanelOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-action-panel',
  template: `
    <section class="docs-action-panel" [class]="cssClass()">
      @if (options()?.title) {
        <h3 class="docs-action-panel__title">{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p class="docs-action-panel__description">
          {{ options()!.description }}
        </p>
      }
      @for (action of options()?.actions ?? []; track action.id) {
        <button
          type="button"
          class="docs-action-panel__action"
          (click)="actionClick.emit({ actionId: action.id })"
        >
          {{ action.label }}
        </button>
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomActionPanelComponent extends ActionPanelBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}

@Component({
  selector: 'docs-action-panel-custom-example',
  imports: [ActionPanelComponent],
  providers: [
    {
      provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
      useValue: CustomActionPanelComponent,
    },
  ],
  template: `<smart-action-panel [options]="options" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPanelCustomExampleComponent {
  options: IActionPanelOptions = {
    layout: 'simple',
    title: 'Transfer ownership',
    description: 'Move this project to another workspace member.',
    actions: [
      { id: 'transfer', label: 'Transfer', variant: 'primary' },
      { id: 'cancel', label: 'Cancel' },
    ],
  };
}
// #endregion

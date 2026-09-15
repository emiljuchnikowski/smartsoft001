// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  ButtonGroupBaseComponent,
  ButtonGroupComponent,
  BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
  IButtonGroupButton,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-button-group',
  template: `
    <div role="group" class="docs-button-group" [class]="cssClass()">
      @for (button of buttons(); track button.id) {
        <button
          type="button"
          class="docs-button-group__button"
          [disabled]="button.disabled ?? false"
          [attr.aria-pressed]="selected() === button.id"
          (click)="select(button.id)"
        >
          {{ button.label }}

          @if (button.count !== undefined) {
            <span class="docs-button-group__count">{{ button.count }}</span>
          }
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomButtonGroupComponent extends ButtonGroupBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}

@Component({
  selector: 'docs-button-group-custom-example',
  imports: [ButtonGroupComponent],
  providers: [
    {
      provide: BUTTON_GROUP_STANDARD_COMPONENT_TOKEN,
      useValue: CustomButtonGroupComponent,
    },
  ],
  template: ` <smart-button-group [buttons]="buttons" selected="month" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupCustomExampleComponent {
  buttons: IButtonGroupButton[] = [
    { id: 'years', label: 'Years' },
    { id: 'month', label: 'Month' },
    { id: 'date', label: 'Date' },
  ];
}
// #endregion

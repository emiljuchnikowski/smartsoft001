// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  ButtonBaseComponent,
  ButtonComponent,
  BUTTON_STANDARD_COMPONENT_TOKEN,
  IButtonOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-button',
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="invoke()"
    >
      <ng-content />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomButtonComponent extends ButtonBaseComponent {
  buttonClasses = computed(() =>
    ['docs-button', ...this.variantClasses(), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}

// Registering the token makes every <smart-button> in this injector render
// CustomButtonComponent; the label between the tags reaches its <ng-content>.
@Component({
  selector: 'docs-button-custom-example',
  imports: [ButtonComponent],
  providers: [
    {
      provide: BUTTON_STANDARD_COMPONENT_TOKEN,
      useValue: CustomButtonComponent,
    },
  ],
  template: `
    <smart-button [options]="options">Save</smart-button>
    @if (saved()) {
      <p>Saved.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCustomExampleComponent {
  saved = signal(false);

  options: IButtonOptions = {
    color: 'emerald',
    click: () => this.saved.set(true),
  };
}
// #endregion

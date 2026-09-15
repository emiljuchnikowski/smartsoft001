// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  ButtonBaseComponent,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  buttonClasses = computed(() =>
    ['docs-button', ...this.variantClasses(), this.cssClass()]
      .filter(Boolean)
      .join(' '),
  );
}

@Component({
  selector: 'docs-button-custom-example',
  imports: [CustomButtonComponent],
  // Registering the token makes the custom button the replacement for every
  // <smart-button>. It is rendered here through its own selector because
  // content projection does not cross the NgComponentOutlet the wrapper uses
  // for injected components, so the projected label stays visible.
  providers: [
    {
      provide: BUTTON_STANDARD_COMPONENT_TOKEN,
      useValue: CustomButtonComponent,
    },
  ],
  template: `<docs-custom-button [options]="options">Save</docs-custom-button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCustomExampleComponent {
  saved = signal(false);

  options: IButtonOptions = {
    click: () => this.saved.set(true),
    variant: 'primary',
    color: 'indigo',
    size: 'md',
  };
}
// #endregion

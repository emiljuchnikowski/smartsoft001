// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  IToggleOptions,
  TOGGLE_STANDARD_COMPONENT_TOKEN,
  ToggleBaseComponent,
  ToggleComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-custom-toggle',
  template: `
    <label [class]="containerClasses()">
      @if (options()?.labelPosition === 'left' && options()?.label) {
        <span class="docs-toggle__label">{{ options()!.label }}</span>
      }

      <input
        type="checkbox"
        class="docs-toggle__input"
        [checked]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="options()?.ariaLabel ?? null"
        (change)="onChange($event)"
      />

      @if (options()?.labelPosition !== 'left' && options()?.label) {
        <span class="docs-toggle__label">{{ options()!.label }}</span>
      }
      @if (options()?.description) {
        <span class="docs-toggle__description">{{
          options()!.description
        }}</span>
      }
    </label>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomToggleComponent extends ToggleBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    [
      'docs-toggle',
      `docs-toggle--label-${this.options()?.labelPosition ?? 'right'}`,
      this.disabled() ? 'docs-toggle--disabled' : '',
      this.cssClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  // A change handler reads the checkbox state; a click handler would instead
  // call the inherited toggle(), which already respects `disabled`.
  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLInputElement).checked);
  }
}

@Component({
  selector: 'docs-toggle-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleComponent],
  // The token swaps the standard toggle for the custom one everywhere below
  // this component, so consumers keep writing `<smart-toggle>`.
  providers: [
    {
      provide: TOGGLE_STANDARD_COMPONENT_TOKEN,
      useValue: CustomToggleComponent,
    },
  ],
  // NgComponentOutlet forwards inputs only, so the [(value)] write-back stays
  // silent here and `enabled` below is the initial state.
  template: `<smart-toggle [value]="enabled" [options]="options" />`,
})
export class ToggleCustomExampleComponent {
  enabled = false;

  options: IToggleOptions = {
    label: 'Allow notifications',
    description: 'Send me an email when someone comments on my work.',
    labelPosition: 'right',
    ariaLabel: 'Allow notifications',
  };
}
// #endregion

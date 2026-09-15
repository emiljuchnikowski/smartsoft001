// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  DividerBaseComponent,
  DividerComponent,
  DIVIDER_STANDARD_COMPONENT_TOKEN,
  IDividerOptions,
} from '@smartsoft001/angular';

/**
 * A custom divider built on `DividerBaseComponent`.
 *
 * The base contributes the `label`, `iconName`, `title`, `actionLabel`,
 * `options` and `class` inputs plus the `actionClick` output. Which of them an
 * implementation honours is up to its template.
 */
@Component({
  selector: 'docs-custom-divider',
  template: `
    <div role="separator" [class]="containerClasses()">
      @if (title()) {
        <h3 class="docs-divider__title">{{ title() }}</h3>
      } @else if (label()) {
        <span class="docs-divider__label">{{ label() }}</span>
      }
      @if (actionLabel()) {
        <button type="button" (click)="actionClick.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDividerComponent extends DividerBaseComponent {
  // The wrapper hands inputs to NgComponentOutlet by canonical name, so the
  // consumer's class arrives as `cssClass` rather than through the alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-divider', this.cssClass()].filter(Boolean).join(' '),
  );
}

/**
 * Registering the implementation against `DIVIDER_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-divider>` in this injector render it instead of the
 * standard variation.
 *
 * NgComponentOutlet forwards inputs only, so `actionClick` is observed on the
 * implementation itself rather than on `<smart-divider>`.
 */
@Component({
  selector: 'docs-divider-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerComponent],
  providers: [
    {
      provide: DIVIDER_STANDARD_COMPONENT_TOKEN,
      useValue: CustomDividerComponent,
    },
  ],
  template: `
    <smart-divider
      [title]="'Team members'"
      [actionLabel]="'Add member'"
      [options]="options"
    />
  `,
})
export class DividerCustomExampleComponent {
  options: IDividerOptions = { variant: 'with-button', position: 'left' };
}
// #endregion

// #region usage
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CardHeadingBaseComponent,
  CardHeadingComponent,
  CARD_HEADING_STANDARD_COMPONENT_TOKEN,
  ICardHeadingOptions,
} from '@smartsoft001/angular';

/**
 * A custom card heading built on `CardHeadingBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs; the implementation
 * owns the markup, including where the optional `TemplateRef` slots of
 * `ICardHeadingOptions` are projected.
 */
@Component({
  selector: 'docs-custom-card-heading',
  template: `
    <div [class]="containerClasses()">
      <div class="docs-card-heading__content">
        @if (options()?.title) {
          <h3 class="docs-card-heading__title">{{ options()!.title }}</h3>
        }
        @if (options()?.description) {
          <p class="docs-card-heading__description">
            {{ options()!.description }}
          </p>
        }
      </div>
      @if (options()?.actionsTpl) {
        <div class="docs-card-heading__actions">
          <ng-container [ngTemplateOutlet]="options()!.actionsTpl!" />
        </div>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCardHeadingComponent extends CardHeadingBaseComponent {
  // The wrapper hands inputs to NgComponentOutlet by canonical name, so the
  // consumer's class arrives as `cssClass` rather than through the alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-card-heading', this.cssClass()].filter(Boolean).join(' '),
  );
}

/**
 * Registering the implementation against `CARD_HEADING_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-card-heading>` in this injector render it instead of the
 * standard variation.
 */
@Component({
  selector: 'docs-card-heading-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardHeadingComponent],
  providers: [
    {
      provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
      useValue: CustomCardHeadingComponent,
    },
  ],
  template: `
    <smart-card-heading
      [options]="options"
      [class]="'docs-card-heading--demo'"
    />
  `,
})
export class CardHeadingCustomExampleComponent {
  options: ICardHeadingOptions = {
    title: 'Applicant information',
    description: 'Personal details and application.',
  };
}
// #endregion

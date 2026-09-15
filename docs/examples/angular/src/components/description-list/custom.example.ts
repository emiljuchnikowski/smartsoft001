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
  DescriptionListBaseComponent,
  DescriptionListComponent,
  DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
  IDescriptionListOptions,
} from '@smartsoft001/angular';

/**
 * A custom description list built on `DescriptionListBaseComponent`.
 *
 * The base contributes the `options` and `class` inputs. Each item carries
 * either a plain `value` or a `valueTpl` template, so an implementation that
 * wants to stay compatible with the standard one projects both.
 */
@Component({
  selector: 'docs-custom-description-list',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3 class="docs-description-list__title">{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p class="docs-description-list__description">
          {{ options()!.description }}
        </p>
      }
      <dl>
        @for (item of options()?.items ?? []; track $index) {
          <div class="docs-description-list__row">
            <dt>{{ item.label }}</dt>
            <dd>
              @if (item.valueTpl) {
                <ng-container [ngTemplateOutlet]="item.valueTpl" />
              } @else {
                {{ item.value }}
              }
            </dd>
          </div>
        }
      </dl>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDescriptionListComponent extends DescriptionListBaseComponent {
  // The wrapper hands inputs to NgComponentOutlet by canonical name, so the
  // consumer's class arrives as `cssClass` rather than through the alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-description-list', this.cssClass()].filter(Boolean).join(' '),
  );
}

/**
 * Registering the implementation against
 * `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN` makes every
 * `<smart-description-list>` in this injector render it instead of the
 * standard variation.
 */
@Component({
  selector: 'docs-description-list-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DescriptionListComponent],
  providers: [
    {
      provide: DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
      useValue: CustomDescriptionListComponent,
    },
  ],
  template: `<smart-description-list [options]="options" />`,
})
export class DescriptionListCustomExampleComponent {
  options: IDescriptionListOptions = {
    title: 'Applicant information',
    description: 'Personal details and application.',
    items: [
      { label: 'Full name', value: 'Margot Foster' },
      { label: 'Application for', value: 'Backend Developer' },
      { label: 'Salary expectation', value: '$120,000' },
    ],
  };
}
// #endregion

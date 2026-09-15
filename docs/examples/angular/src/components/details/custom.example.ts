// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  DetailsBaseComponent,
  DetailsComponent,
  DETAILS_STANDARD_COMPONENT_TOKEN,
  IDetailsOptions,
} from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

@Model({})
class ApplicantModel {
  id = 'applicant-1';

  @Field({ details: true })
  name = 'Margot Foster';

  @Field({ details: true })
  position = 'Backend Developer';
}

/**
 * A custom details layout built on `DetailsBaseComponent`.
 *
 * The base reads the `@Field({ details: ... })` metadata off the model class
 * given in `options.type` and exposes the result as `fields`, alongside the
 * `item` and `loading` signals taken from the options. A custom implementation
 * decides only how a row looks — here a flat definition list instead of the
 * grid of the standard variation.
 */
@Component({
  selector: 'docs-custom-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl class="docs-details">
      @for (field of fields; track field.key) {
        <div class="docs-details__row">
          <dt>{{ field.key }}</dt>
          <dd>{{ display(field.key) }}</dd>
        </div>
      }
    </dl>
  `,
})
export class CustomDetailsComponent extends DetailsBaseComponent<ApplicantModel> {
  // `item` is a signal of the model instance, so values are read by field key.
  display(key: string): string {
    const item = this.item?.() as Record<string, unknown> | undefined;
    return String(item?.[key] ?? '');
  }
}

/**
 * Registering the implementation against `DETAILS_STANDARD_COMPONENT_TOKEN`
 * makes every `<smart-details>` in this injector render it instead of the
 * standard variation.
 */
@Component({
  selector: 'docs-details-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailsComponent],
  providers: [
    {
      provide: DETAILS_STANDARD_COMPONENT_TOKEN,
      useValue: CustomDetailsComponent,
    },
  ],
  template: `<smart-details [options]="options" />`,
})
export class DetailsCustomExampleComponent {
  options: IDetailsOptions<ApplicantModel> = {
    type: ApplicantModel,
    item: signal(new ApplicantModel()),
  };
}
// #endregion

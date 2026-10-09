// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DetailsComponent, IDetailsOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

// Each label is the `MODEL.<key>` translation: the library's dictionary
// already has `firstName`, `lastName` and `email`.
@Model({})
class Applicant {
  id = 'applicant-1';

  @Field({ details: true })
  firstName = 'Margot';

  @Field({ details: true })
  lastName = 'Foster';

  @Field({ details: true, type: FieldType.email })
  email = 'margot.foster@example.com';
}

@Component({
  selector: 'docs-details-usage-example',
  imports: [DetailsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsUsageExampleComponent {
  readonly applicant = signal(new Applicant());

  readonly options: IDetailsOptions<Applicant> = {
    type: Applicant,
    item: this.applicant,
  };
}
// #endregion

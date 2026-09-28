// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DetailsComponent, IDetailsOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class Applicant {
  id = 'applicant-1';

  @Field({ details: true })
  name = 'Margot Foster';

  @Field({ details: true, type: FieldType.email })
  email = 'margot.foster@example.com';

  @Field({ details: true })
  position = 'Backend Developer';
}

@Component({
  selector: 'docs-details-usage-example',
  imports: [DetailsComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsUsageExampleComponent {
  readonly applicant = signal(new Applicant());
  readonly loading = signal(false);

  readonly options: IDetailsOptions<Applicant> = {
    type: Applicant,
    item: this.applicant,
    loading: this.loading,
  };
}
// #endregion

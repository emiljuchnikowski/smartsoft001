// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DetailComponent, IDetailOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

// Each label is the `MODEL.<key>` translation: the library's dictionary
// already has `firstName` and `email`.
@Model({})
class ApplicantModel {
  id = 'applicant-1';

  @Field({ details: true, type: FieldType.text })
  firstName = 'Margot';

  @Field({ details: true, type: FieldType.email })
  email = 'margot@example.com';
}

@Component({
  selector: 'docs-detail-usage-example',
  imports: [DetailComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailUsageExampleComponent {
  readonly type = ApplicantModel;
  readonly applicant = signal(new ApplicantModel());

  readonly firstNameOptions: IDetailOptions<ApplicantModel> = {
    key: 'firstName',
    options: { type: FieldType.text },
    item: this.applicant,
  };

  readonly emailOptions: IDetailOptions<ApplicantModel> = {
    key: 'email',
    options: { type: FieldType.email },
    item: this.applicant,
  };
}
// #endregion

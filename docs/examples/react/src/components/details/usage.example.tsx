// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import { IDetailsOptions, SmartDetails } from '@smartsoft001/react';

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

const options: IDetailsOptions<Applicant> = {
  type: Applicant,
  item: new Applicant(),
};

export function DetailsUsageExample() {
  return <SmartDetails options={options} />;
}
// #endregion

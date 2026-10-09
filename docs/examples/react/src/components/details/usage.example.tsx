// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import { IDetailsOptions, SmartDetails } from '@smartsoft001/react';

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

const options: IDetailsOptions<Applicant> = {
  type: Applicant,
  item: new Applicant(),
  loading: false,
};

export function DetailsUsageExample() {
  return <SmartDetails options={options} />;
}
// #endregion

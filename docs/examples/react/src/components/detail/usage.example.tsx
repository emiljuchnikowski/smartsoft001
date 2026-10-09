// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import { IDetailOptions, SmartDetail } from '@smartsoft001/react';

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

const applicant = new ApplicantModel();

const firstNameOptions: IDetailOptions<ApplicantModel> = {
  key: 'firstName',
  options: { type: FieldType.text },
  item: applicant,
};

const emailOptions: IDetailOptions<ApplicantModel> = {
  key: 'email',
  options: { type: FieldType.email },
  item: applicant,
};

export function DetailUsageExample() {
  return (
    <>
      <SmartDetail type={ApplicantModel} options={firstNameOptions} />
      <SmartDetail type={ApplicantModel} options={emailOptions} />
    </>
  );
}
// #endregion

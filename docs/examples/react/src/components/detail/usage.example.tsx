// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import { IDetailOptions, SmartDetail } from '@smartsoft001/react';

@Model({})
class ApplicantModel {
  id = 'applicant-1';

  @Field({ details: true, type: FieldType.text })
  name = 'Margot Foster';

  @Field({ details: true, type: FieldType.email })
  email = 'margot@example.com';
}

const applicant = new ApplicantModel();

const nameOptions: IDetailOptions<ApplicantModel> = {
  key: 'name',
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
      <SmartDetail type={ApplicantModel} options={nameOptions} />
      <SmartDetail type={ApplicantModel} options={emailOptions} />
    </>
  );
}
// #endregion

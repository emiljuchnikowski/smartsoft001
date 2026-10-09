// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  IDetailOptions,
  SmartDetail,
  SmartDetailFieldProps,
  SmartProvider,
  useDetail,
} from '@smartsoft001/react';

/**
 * A custom renderer for one detail field, built on `useDetail`.
 *
 * The hook unwraps the item, the field key and its value from `options`;
 * `SmartDetail` passes the consumer's `className` on. Everything else is the
 * implementation's own markup.
 */
export function CustomDetail(props: SmartDetailFieldProps) {
  const { value } = useDetail(props);

  return (
    <p
      className={['docs-detail-text', props.className]
        .filter(Boolean)
        .join(' ')}
    >
      {String(value ?? '')}
    </p>
  );
}

@Model({})
class ApplicantModel {
  @Field({ details: true, type: FieldType.text })
  name = 'Margot Foster';
}

// <SmartDetail> picks the renderer by the field's `type`, so a custom one is
// registered per FieldType through `detailFieldComponents`. The entries are
// merged over the built-in map, so only the listed types change. A module
// constant: a new object on every render would change the context.
const detailFieldComponents = { [FieldType.text]: CustomDetail };

const options: IDetailOptions<ApplicantModel> = {
  key: 'name',
  options: { type: FieldType.text },
  item: new ApplicantModel(),
};

export function DetailCustomExample() {
  return (
    <SmartProvider detailFieldComponents={detailFieldComponents}>
      <SmartDetail
        type={ApplicantModel}
        options={options}
        className="docs-detail-text--demo"
      />
    </SmartProvider>
  );
}
// #endregion

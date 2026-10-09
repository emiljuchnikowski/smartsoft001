// #region usage
import { Field, Model } from '@smartsoft001/models';
import {
  IDetailsOptions,
  SmartDetails,
  SmartDetailsProps,
  SmartProvider,
  useDetails,
} from '@smartsoft001/react';

/**
 * A custom details layout built on `useDetails`.
 *
 * The hook reads the `@Field({ details: ... })` metadata off the model class
 * given in `options.type` and returns the result as `fields`, alongside the
 * `item` and `loading` taken from the options. A custom implementation decides
 * only how a row looks: here a flat definition list instead of the grid of the
 * standard rendering.
 */
export function CustomDetails(props: SmartDetailsProps) {
  const { fields, item } = useDetails(props);

  return (
    <dl className={['docs-details', props.className].filter(Boolean).join(' ')}>
      {fields?.map((field) => (
        <div key={field.key} className="docs-details__row">
          <dt>{field.key}</dt>
          {/* `item` is the model instance, so values are read by field key. */}
          <dd>{String(item?.[field.key] ?? '')}</dd>
        </div>
      ))}
    </dl>
  );
}

@Model({})
class ApplicantModel {
  id = 'applicant-1';

  @Field({ details: true })
  name = 'Margot Foster';

  @Field({ details: true })
  position = 'Backend Developer';
}

// A module constant: a new object on every render would change the context.
const components = { details: CustomDetails };

const options: IDetailsOptions<ApplicantModel> = {
  type: ApplicantModel,
  item: new ApplicantModel(),
};

// Every <SmartDetails> below the provider renders CustomDetails.
export function DetailsCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartDetails options={options} />
    </SmartProvider>
  );
}
// #endregion

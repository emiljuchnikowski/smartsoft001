// #region usage
import {
  IDescriptionListOptions,
  SmartDescriptionList,
  SmartDescriptionListProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom description list taking `SmartDescriptionListProps`.
 *
 * Each item carries either a plain `value` or a `valueTpl` node, so an
 * implementation that wants to stay compatible with the standard one renders
 * both.
 */
export function CustomDescriptionList({
  options,
  className,
}: SmartDescriptionListProps) {
  return (
    <div
      className={['docs-description-list', className].filter(Boolean).join(' ')}
    >
      {options?.title && (
        <h3 className="docs-description-list__title">{options.title}</h3>
      )}
      {options?.description && (
        <p className="docs-description-list__description">
          {options.description}
        </p>
      )}
      <dl>
        {(options?.items ?? []).map((item, index) => (
          <div key={index} className="docs-description-list__row">
            <dt>{item.label}</dt>
            <dd>{item.valueTpl ?? item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'description-list': CustomDescriptionList };

const options: IDescriptionListOptions = {
  title: 'Applicant information',
  description: 'Personal details and application.',
  items: [
    { label: 'Full name', value: 'Margot Foster' },
    { label: 'Application for', value: 'Backend Developer' },
    { label: 'Salary expectation', value: '$120,000' },
  ],
};

// Every <SmartDescriptionList> below the provider renders CustomDescriptionList.
export function DescriptionListCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartDescriptionList
        options={options}
        className="docs-description-list--compact"
      />
    </SmartProvider>
  );
}
// #endregion

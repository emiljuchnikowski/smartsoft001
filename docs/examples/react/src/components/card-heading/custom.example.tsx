// #region usage
import {
  ICardHeadingOptions,
  SmartCardHeading,
  SmartCardHeadingProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom card heading built on `SmartCardHeadingProps`: the implementation
 * owns the markup, including where the optional slots of
 * `ICardHeadingOptions` are rendered.
 */
export function CustomCardHeading({
  options,
  className,
}: SmartCardHeadingProps) {
  return (
    <div className={['docs-card-heading', className].filter(Boolean).join(' ')}>
      <div className="docs-card-heading__content">
        {options?.title && (
          <h3 className="docs-card-heading__title">{options.title}</h3>
        )}
        {options?.description && (
          <p className="docs-card-heading__description">
            {options.description}
          </p>
        )}
      </div>
      {options?.actionsTpl && (
        <div className="docs-card-heading__actions">{options.actionsTpl}</div>
      )}
    </div>
  );
}

// Registered under 'card-heading', it renders every <SmartCardHeading> below
// the provider. A module constant: a new object on every render would change
// the context.
const components = { 'card-heading': CustomCardHeading };

const options: ICardHeadingOptions = {
  title: 'Applicant information',
  description: 'Personal details and application.',
};

export function CardHeadingCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartCardHeading options={options} className="docs-card-heading--demo" />
    </SmartProvider>
  );
}
// #endregion

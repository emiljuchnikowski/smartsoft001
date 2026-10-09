// #region usage
import {
  cn,
  ISectionHeadingOptions,
  SmartProvider,
  SmartSectionHeading,
  SmartSectionHeadingProps,
} from '@smartsoft001/react';

// There is no section heading hook: the custom component takes the same props
// as SmartSectionHeading, slots included, and renders them its own way.
export function CustomSectionHeading({
  options,
  className,
}: SmartSectionHeadingProps) {
  return (
    <div className={cn('docs-section-heading', className)}>
      <div className="docs-section-heading__text">
        {options?.label && (
          <p className="docs-section-heading__label">{options.label}</p>
        )}

        {options?.title && (
          <h2 className="docs-section-heading__title">{options.title}</h2>
        )}

        {options?.description && (
          <p className="docs-section-heading__description">
            {options.description}
          </p>
        )}
      </div>

      {options?.actionsTpl && (
        <div className="docs-section-heading__actions">
          {options.actionsTpl}
        </div>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'section-heading': CustomSectionHeading };

const options: ISectionHeadingOptions = {
  label: 'New',
  title: 'Manage your team in one place',
  description: 'Invite people, set their roles and remove access.',
  actionsTpl: (
    <a href="#" className="docs-section-heading__cta">
      Get started
    </a>
  ),
};

export function SectionHeadingCustomExample() {
  // Every SmartSectionHeading below the provider renders CustomSectionHeading.
  return (
    <SmartProvider components={components}>
      <SmartSectionHeading options={options} />
    </SmartProvider>
  );
}
// #endregion

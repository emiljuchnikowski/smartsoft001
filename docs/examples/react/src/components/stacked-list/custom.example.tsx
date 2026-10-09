// #region usage
import {
  IStackedListOptions,
  SmartProvider,
  SmartStackedList,
  SmartStackedListProps,
} from '@smartsoft001/react';

// The stacked list has no behaviour hook: an implementation only renders its
// props, and decides what the withDividers / fullWidthOnMobile hints mean.
export function CustomStackedList({
  options,
  className,
}: SmartStackedListProps) {
  const containerClasses = [
    'docs-stacked-list',
    options?.withDividers && 'docs-stacked-list--divided',
    options?.fullWidthOnMobile && 'docs-stacked-list--bleed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {options?.title && (
        <h3 className="docs-stacked-list__title">{options.title}</h3>
      )}
      {options?.description && (
        <p className="docs-stacked-list__description">{options.description}</p>
      )}

      <ul role="list">
        {(options?.items ?? []).map((item, index) => (
          <li key={item.id ?? index} className="docs-stacked-list__item">
            {item.avatarUrl && (
              <img
                className="docs-stacked-list__avatar"
                src={item.avatarUrl}
                alt=""
              />
            )}
            <span className="docs-stacked-list__body">
              {item.href ? (
                <a href={item.href}>{item.title}</a>
              ) : (
                <span>{item.title}</span>
              )}
              {item.description && (
                <span className="docs-stacked-list__meta">
                  {item.description}
                </span>
              )}
            </span>
            {item.meta && (
              <span className="docs-stacked-list__joined">{item.meta}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'stacked-list': CustomStackedList };

const options: IStackedListOptions = {
  title: 'Team members',
  description: 'People with access to this workspace.',
  withDividers: true,
  items: [
    {
      id: '1',
      title: 'Lindsay Walton',
      description: 'lindsay.walton@example.com',
      meta: 'Joined 12 January 2026',
    },
    {
      id: '2',
      title: 'Courtney Henry',
      description: 'courtney.henry@example.com',
      meta: 'Joined 3 February 2026',
    },
    {
      id: '3',
      title: 'Tom Cook',
      description: 'tom.cook@example.com',
      meta: 'Joined 27 February 2026',
    },
  ],
};

// Every <SmartStackedList> below the provider renders CustomStackedList.
export function StackedListCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartStackedList options={options} />
    </SmartProvider>
  );
}
// #endregion

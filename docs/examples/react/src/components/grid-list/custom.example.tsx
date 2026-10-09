// #region usage
import {
  cn,
  IGridListOptions,
  SmartGridList,
  SmartGridListProps,
  SmartProvider,
} from '@smartsoft001/react';

export function CustomGridList({ options, className }: SmartGridListProps) {
  return (
    <div className={cn('docs-grid-list', className)}>
      {options?.title && (
        <h3 className="docs-grid-list__title">{options.title}</h3>
      )}

      <ul className="docs-grid-list__items" data-columns={options?.columns}>
        {(options?.items ?? []).map((item, index) => (
          <li key={item.id ?? index} className="docs-grid-list__item">
            {item.imageUrl && (
              <img
                className="docs-grid-list__image"
                src={item.imageUrl}
                alt={item.imageAlt ?? ''}
              />
            )}
            {item.href ? (
              <a className="docs-grid-list__link" href={item.href}>
                {item.title}
              </a>
            ) : (
              <span className="docs-grid-list__label">{item.title}</span>
            )}
            {item.description && (
              <p className="docs-grid-list__description">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'grid-list': CustomGridList };

const options: IGridListOptions = {
  title: 'Team',
  columns: 3,
  layout: 'cards',
  items: [
    {
      id: 'lindsay',
      title: 'Lindsay Walton',
      description: 'Front-end Developer',
      href: '/team/lindsay-walton',
    },
    { id: 'courtney', title: 'Courtney Henry', description: 'Designer' },
    { id: 'tom', title: 'Tom Cook', description: 'Director of Product' },
  ],
};

export function GridListCustomExample() {
  // Every SmartGridList below the provider renders CustomGridList.
  return (
    <SmartProvider components={components}>
      <SmartGridList options={options} />
    </SmartProvider>
  );
}
// #endregion

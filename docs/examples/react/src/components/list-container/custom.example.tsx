// #region usage
import {
  IListContainerOptions,
  SmartListContainer,
  SmartListContainerProps,
  SmartProvider,
} from '@smartsoft001/react';

/**
 * A custom list container: it receives the props of `SmartListContainer`
 * (`options`, `className`, `children`) and decides how the rows are framed
 * and separated.
 */
export function CustomListContainer({
  options,
  className,
  children,
}: SmartListContainerProps) {
  const classes = [
    'docs-list-container',
    options?.variant && `docs-list-container--${options.variant}`,
    options?.fullWidthOnMobile && 'docs-list-container--full-width-mobile',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul role="list" className={classes}>
      {children}
    </ul>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'list-container': CustomListContainer };

const options: IListContainerOptions = {
  variant: 'separate-cards',
  fullWidthOnMobile: true,
};

const members = [
  { name: 'Lindsay Walton', role: 'Front-end Developer' },
  { name: 'Courtney Henry', role: 'Designer' },
  { name: 'Tom Cook', role: 'Director of Product' },
];

/**
 * Every `SmartListContainer` below this provider renders
 * `CustomListContainer` instead of the standard rendering.
 */
export function ListContainerCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartListContainer options={options}>
        {members.map((member) => (
          <li key={member.name} className="docs-list-container__item">
            <span className="docs-list-container__name">{member.name}</span>
            <span className="docs-list-container__role">{member.role}</span>
          </li>
        ))}
      </SmartListContainer>
    </SmartProvider>
  );
}
// #endregion

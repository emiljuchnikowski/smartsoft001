import { render } from '@testing-library/react';

import { GridListCustomExample } from './custom.example';

describe('docs-examples-react: GridListCustomExample', () => {
  it('should render the custom grid list instead of the standard one', () => {
    const { container } = render(<GridListCustomExample />);

    expect(container.querySelector('.docs-grid-list')).not.toBeNull();
    expect(container.querySelector('.grid-list')).toBeNull();
    expect(container.querySelector('.docs-grid-list__title')).toHaveTextContent(
      'Team',
    );
  });

  it('should render one cell per item and expose the column count', () => {
    const { container } = render(<GridListCustomExample />);

    expect(container.querySelectorAll('.docs-grid-list__item')).toHaveLength(3);
    expect(container.querySelector('.docs-grid-list__items')).toHaveAttribute(
      'data-columns',
      '3',
    );
  });

  it('should render a link for an item with href and plain text otherwise', () => {
    const { container } = render(<GridListCustomExample />);

    expect(container.querySelector('.docs-grid-list__link')).toHaveAttribute(
      'href',
      '/team/lindsay-walton',
    );
    expect(container.querySelectorAll('.docs-grid-list__label')).toHaveLength(
      2,
    );
  });
});

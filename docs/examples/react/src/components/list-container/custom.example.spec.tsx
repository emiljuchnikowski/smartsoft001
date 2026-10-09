import { render, screen } from '@testing-library/react';

import { ListContainerCustomExample } from './custom.example';

describe('docs-examples-react: ListContainerCustomExample', () => {
  it('should render the custom list container instead of the standard one', () => {
    const { container } = render(<ListContainerCustomExample />);

    expect(screen.getByRole('list').tagName).toBe('UL');
    expect(container.querySelector('[data-variant]')).toBeNull();
  });

  it('should render one row per member', () => {
    const { container } = render(<ListContainerCustomExample />);

    const rows = container.querySelectorAll('.docs-list-container__item');

    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Lindsay Walton');
  });

  it('should turn the options into modifier classes', () => {
    render(<ListContainerCustomExample />);

    const list = screen.getByRole('list');

    expect(list).toHaveClass('docs-list-container');
    expect(list).toHaveClass('docs-list-container--separate-cards');
    expect(list).toHaveClass('docs-list-container--full-width-mobile');
  });
});

import { render } from '@testing-library/react';

import { StackedListCustomExample } from './custom.example';

describe('docs-examples-react: StackedListCustomExample', () => {
  it('should render the custom list instead of the standard one', () => {
    const { container } = render(<StackedListCustomExample />);

    expect(container.querySelector('.docs-stacked-list')).not.toBeNull();
    expect(container.querySelector('.stacked-list')).toBeNull();
  });

  it('should render one row per item with its title and description', () => {
    const { container } = render(<StackedListCustomExample />);

    const items = container.querySelectorAll('.docs-stacked-list__item');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Lindsay Walton');
    expect(items[0]).toHaveTextContent('lindsay.walton@example.com');
  });

  it('should add the divider modifier because the options ask for it', () => {
    const { container } = render(<StackedListCustomExample />);

    expect(container.querySelector('.docs-stacked-list')).toHaveClass(
      'docs-stacked-list--divided',
    );
    expect(container.querySelector('.docs-stacked-list')).not.toHaveClass(
      'docs-stacked-list--bleed',
    );
  });
});

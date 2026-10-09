import { render } from '@testing-library/react';

import { StatsCustomExample } from './custom.example';

describe('docs-examples-react: StatsCustomExample', () => {
  it('should render the custom stats instead of the standard one', () => {
    const { container } = render(<StatsCustomExample />);

    expect(container.querySelector('.docs-stats')).not.toBeNull();
    expect(container.querySelector('.stats')).toBeNull();
  });

  it('should render one entry per item with its label and value', () => {
    const { container } = render(<StatsCustomExample />);

    const items = container.querySelectorAll('.docs-stats__item');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Accuracy rate');
    expect(items[0]).toHaveTextContent('99.95%');
  });

  it('should expose the column count and the trend of a changed item', () => {
    const { container } = render(<StatsCustomExample />);

    expect(container.querySelector('.docs-stats')).toHaveAttribute(
      'data-columns',
      '3',
    );
    expect(container.querySelector('.docs-stats__change')).toHaveAttribute(
      'data-trend',
      'up',
    );
  });
});

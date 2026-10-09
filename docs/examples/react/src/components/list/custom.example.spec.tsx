import { render } from '@testing-library/react';

import { ListCustomExample } from './custom.example';

describe('docs-examples-react: ListCustomExample', () => {
  it('should render the custom list for the desktop mode instead of the built-in one', () => {
    const { container } = render(<ListCustomExample />);

    expect(container.querySelector('table.docs-list')).not.toBeNull();
    expect(container.querySelectorAll('table')).toHaveLength(1);
  });

  it('should render one row per item supplied by the provider', () => {
    const { container } = render(<ListCustomExample />);

    expect(container.querySelectorAll('.docs-list__row')).toHaveLength(3);
  });

  it('should render one cell per field the model marks as list', () => {
    const { container } = render(<ListCustomExample />);

    const cells = container.querySelectorAll(
      '.docs-list__row:first-child .docs-list__cell',
    );

    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveTextContent('Jan');
    expect(cells[1]).toHaveTextContent('jan@example.com');
  });

  it('should render a header per key resolved from the model metadata', () => {
    const { container } = render(<ListCustomExample />);

    const headers = container.querySelectorAll('.docs-list__header');

    expect(headers).toHaveLength(3);
    expect(headers[2]).toHaveTextContent('role');
  });
});

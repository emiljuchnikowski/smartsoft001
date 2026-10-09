import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ListContainerUsageExample } from './usage.example';

describe('docs-examples-react: ListContainerUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <ListContainerUsageExample />
      </SmartProvider>,
    );
  }

  it('should apply the variant from the options', () => {
    setup();

    expect(screen.getByRole('list')).toHaveAttribute(
      'data-variant',
      'card-dividers',
    );
  });

  it('should render one list item per notification', () => {
    setup();

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Invoice #1042 was paid');
  });
});

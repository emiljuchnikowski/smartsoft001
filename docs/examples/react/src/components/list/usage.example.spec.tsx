import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ListUsageExample } from './usage.example';

describe('docs-examples-react: ListUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <ListUsageExample />
      </SmartProvider>,
    );
  }

  it('should render a row per record from the provider', () => {
    const { container } = setup();

    expect(screen.getByText('Lindsay Walton')).toBeInTheDocument();
    expect(screen.getByText('courtney.henry@example.com')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('should hand the id of the opened row to the select handler', () => {
    const { container } = setup();

    fireEvent.click(
      container.querySelector('tbody td button') as HTMLButtonElement,
    );

    expect(screen.getByText('Selected member: 1')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DropdownUsageExample } from './usage.example';

describe('docs-examples-react: DropdownUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <DropdownUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the trigger label with the menu closed', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('should render the header and the items when opened', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Options' }));

    const menu = screen.getByRole('menu');
    expect(menu).toHaveTextContent('Signed in as tom@example.com');
    expect(menu).toHaveTextContent('Account settings');
    expect(screen.getByRole('button', { name: 'License' })).toBeDisabled();
  });

  it('should hand the selected item id to the handler and close the menu', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));

    fireEvent.click(screen.getByRole('button', { name: 'Account settings' }));

    expect(screen.getByText('Selected: settings')).toBeInTheDocument();
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

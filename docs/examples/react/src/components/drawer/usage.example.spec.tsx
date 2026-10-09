import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DrawerUsageExample } from './usage.example';

describe('docs-examples-react: DrawerUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DrawerUsageExample />
      </SmartProvider>,
    );
  }

  it('should keep the drawer closed until it is opened', () => {
    setup();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the title and the content when opened', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'View cart' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Shopping cart');
    expect(dialog).toHaveTextContent('Throwback Hip Bag');
    expect(dialog).toHaveAttribute('data-position', 'right');
  });

  it('should close the drawer and call the handler from the close button', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'View cart' }));

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Times closed: 1')).toBeInTheDocument();
  });
});

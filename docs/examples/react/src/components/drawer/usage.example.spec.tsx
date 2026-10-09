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
    // Arrange
    setup();

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the title and the content when opened', () => {
    // Arrange
    setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'View cart' }));

    // Assert
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Shopping cart');
    expect(dialog).toHaveTextContent('Throwback Hip Bag');
    expect(dialog).toHaveAttribute('data-position', 'right');
  });

  it('should close the drawer from the close button and count it', () => {
    // Arrange
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'View cart' }));

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Times closed: 1')).toBeInTheDocument();
  });

  it('should close the drawer from the overlay', () => {
    // Arrange
    const { container } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'View cart' }));

    // Act
    fireEvent.click(container.querySelector('.drawer-overlay') as Element);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Times closed: 1')).toBeInTheDocument();
  });
});

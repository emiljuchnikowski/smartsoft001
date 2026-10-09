import { fireEvent, render, screen } from '@testing-library/react';

import { SidebarNavigationUsageExample } from './usage.example';

describe('docs-examples-react: SidebarNavigationUsageExample', () => {
  it('should render the items from the options', () => {
    // Act
    render(<SidebarNavigationUsageExample />);

    // Assert
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveTextContent(
      'Dashboard',
    );
    expect(screen.getByRole('button', { name: /Reports/ })).toBeInTheDocument();
    expect(screen.getByText('Anna Kowalska')).toBeInTheDocument();
  });

  it('should show the clicked item under the navigation', () => {
    // Arrange
    render(<SidebarNavigationUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Dashboard' }));

    // Assert
    expect(screen.getByText('Active item: dashboard')).toBeInTheDocument();
  });

  it('should show the toggled section and open its children', () => {
    // Arrange
    render(<SidebarNavigationUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Reports/ }));

    // Assert
    expect(screen.getByText('Expanded section: reports')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Revenue' })).toBeInTheDocument();
  });

  it('should clear the expanded section when it is closed again', () => {
    // Arrange
    render(<SidebarNavigationUsageExample />);
    const toggle = screen.getByRole('button', { name: /Reports/ });
    fireEvent.click(toggle);

    // Act
    fireEvent.click(toggle);

    // Assert
    expect(screen.queryByText(/Expanded section/)).not.toBeInTheDocument();
  });
});

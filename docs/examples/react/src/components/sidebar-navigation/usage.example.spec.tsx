import { fireEvent, render, screen } from '@testing-library/react';

import { SidebarNavigationUsageExample } from './usage.example';

describe('docs-examples-react: SidebarNavigationUsageExample', () => {
  it('should render the items from the options', () => {
    render(<SidebarNavigationUsageExample />);

    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveTextContent(
      'Dashboard',
    );
    expect(screen.getByRole('button', { name: /Reports/ })).toBeInTheDocument();
    expect(screen.getByText('Anna Kowalska')).toBeInTheDocument();
  });

  it('should hand the clicked item id to the handler', () => {
    render(<SidebarNavigationUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Dashboard' }));

    expect(screen.getByText('Active item: dashboard')).toBeInTheDocument();
  });

  it('should hand the toggled item to the handler and open its children', () => {
    render(<SidebarNavigationUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: /Reports/ }));

    expect(screen.getByText('Expanded section: reports')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Revenue' })).toBeInTheDocument();
  });

  it('should clear the expanded section when it is closed again', () => {
    render(<SidebarNavigationUsageExample />);
    const toggle = screen.getByRole('button', { name: /Reports/ });

    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(screen.queryByText(/Expanded section/)).not.toBeInTheDocument();
  });
});

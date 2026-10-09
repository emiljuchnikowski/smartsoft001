import { fireEvent, render, screen } from '@testing-library/react';

import { SidebarNavigationCustomExample } from './custom.example';

describe('docs-examples-react: SidebarNavigationCustomExample', () => {
  it('should render the custom navigation instead of the standard one', () => {
    render(<SidebarNavigationCustomExample />);

    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveClass(
      'docs-sidebar-navigation',
      'docs-sidebar-navigation--light',
    );
  });

  it('should group the flat items and the named group the hook resolves', () => {
    const { container } = render(<SidebarNavigationCustomExample />);

    expect(
      container.querySelectorAll('.docs-sidebar-navigation__group'),
    ).toHaveLength(2);
    expect(screen.getByText('Your teams')).toHaveClass(
      'docs-sidebar-navigation__group-title',
    );
    expect(screen.getByRole('link', { name: 'Tom Cook' })).toHaveClass(
      'docs-sidebar-navigation__profile',
    );
  });

  it('should expand a collapsed section through the hook', () => {
    const { container } = render(<SidebarNavigationCustomExample />);

    expect(
      container.querySelector('.docs-sidebar-navigation__children'),
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Teams' }));

    expect(
      container.querySelectorAll('.docs-sidebar-navigation__children a'),
    ).toHaveLength(2);
  });

  it('should report the clicked link through onItemClick', () => {
    render(<SidebarNavigationCustomExample />);

    fireEvent.click(screen.getByRole('link', { name: /Team\s*5/ }));

    expect(screen.getByText('Active item: team')).toBeInTheDocument();
  });
});

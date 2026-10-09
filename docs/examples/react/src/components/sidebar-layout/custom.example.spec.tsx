import { render, screen, within } from '@testing-library/react';

import { SidebarLayoutCustomExample } from './custom.example';

describe('docs-examples-react: SidebarLayoutCustomExample', () => {
  it('should render the custom layout instead of the standard one', () => {
    const { container } = render(<SidebarLayoutCustomExample />);

    expect(container.querySelector('.docs-sidebar-layout')).toBeInTheDocument();
    expect(screen.getByRole('complementary')).toHaveClass(
      'docs-sidebar-layout__sidebar',
    );
  });

  it('should render the sidebar supplied through the options', () => {
    render(<SidebarLayoutCustomExample />);

    const links = within(screen.getByRole('complementary')).getAllByRole(
      'link',
    );

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent('Overview');
  });

  it('should fall back to the title when no header is given', () => {
    render(<SidebarLayoutCustomExample />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Dashboard',
    );
  });

  it('should render the children in the main area', () => {
    render(<SidebarLayoutCustomExample />);

    expect(screen.getByRole('main')).toHaveTextContent(
      'Main content of the page.',
    );
  });

  it('should expose the sidebar position from the options', () => {
    const { container } = render(<SidebarLayoutCustomExample />);

    expect(container.querySelector('.docs-sidebar-layout')).toHaveAttribute(
      'data-position',
      'left',
    );
  });
});

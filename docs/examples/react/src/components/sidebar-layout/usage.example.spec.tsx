import { render, screen } from '@testing-library/react';

import { SidebarLayoutUsageExample } from './usage.example';

describe('docs-examples-react: SidebarLayoutUsageExample', () => {
  it('should render the sidebar from the options', () => {
    render(<SidebarLayoutUsageExample />);

    expect(screen.getByRole('complementary')).toHaveTextContent('Projects');
    expect(
      screen.getByRole('navigation', { name: 'Main' }),
    ).toBeInTheDocument();
  });

  it('should render the children in the main area', () => {
    render(<SidebarLayoutUsageExample />);

    expect(screen.getByRole('main')).toHaveTextContent('Dashboard');
    expect(screen.getByRole('main')).toHaveTextContent(
      'Welcome back. Here is what changed since yesterday.',
    );
  });

  it('should place the sidebar before the main area on the left', () => {
    render(<SidebarLayoutUsageExample />);

    expect(
      screen
        .getByRole('complementary')
        .compareDocumentPosition(screen.getByRole('main')),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});

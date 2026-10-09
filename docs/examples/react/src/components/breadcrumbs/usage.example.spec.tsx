import { fireEvent, render, screen } from '@testing-library/react';

import { BreadcrumbsUsageExample } from './usage.example';

describe('docs-examples-react: BreadcrumbsUsageExample', () => {
  it('should render the trail from the options', () => {
    // Act
    render(<BreadcrumbsUsageExample />);

    // Assert
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveTextContent('Projects');
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent(
      'Project Nero',
    );
  });

  it('should separate the items with slashes', () => {
    // Act
    const { container } = render(<BreadcrumbsUsageExample />);

    // Assert
    expect(container.querySelector('.breadcrumbs-separator')).toHaveAttribute(
      'data-separator',
      'slash',
    );
  });

  it('should show the clicked item id under the trail', () => {
    // Arrange
    render(<BreadcrumbsUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));

    // Assert
    expect(screen.getByText('Last clicked: projects')).toBeInTheDocument();
  });
});

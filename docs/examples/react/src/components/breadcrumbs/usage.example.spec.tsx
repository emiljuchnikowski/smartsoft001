import { fireEvent, render, screen } from '@testing-library/react';

import { BreadcrumbsUsageExample } from './usage.example';

describe('docs-examples-react: BreadcrumbsUsageExample', () => {
  it('should render the trail from the options', () => {
    render(<BreadcrumbsUsageExample />);

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveTextContent('Projects');
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent(
      'Project Nero',
    );
  });

  it('should hand the clicked item id to the handler', () => {
    render(<BreadcrumbsUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));

    expect(screen.getByText('Last clicked: projects')).toBeInTheDocument();
  });
});

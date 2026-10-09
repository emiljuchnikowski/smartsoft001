import { render, screen } from '@testing-library/react';

import { SectionHeadingCustomExample } from './custom.example';

describe('docs-examples-react: SectionHeadingCustomExample', () => {
  it('should render the custom heading instead of the standard one', () => {
    const { container } = render(<SectionHeadingCustomExample />);

    expect(
      container.querySelector('.docs-section-heading'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('should render the title, the eyebrow label and the description from the options', () => {
    render(<SectionHeadingCustomExample />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Manage your team in one place',
    );
    expect(screen.getByText('New')).toHaveClass('docs-section-heading__label');
    expect(screen.getByText(/Invite people, set their roles/)).toHaveClass(
      'docs-section-heading__description',
    );
  });

  it('should render the actions slot supplied through the options', () => {
    render(<SectionHeadingCustomExample />);

    expect(screen.getByRole('link', { name: 'Get started' })).toHaveClass(
      'docs-section-heading__cta',
    );
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { SectionHeadingUsageExample } from './usage.example';

describe('docs-examples-react: SectionHeadingUsageExample', () => {
  it('should render the heading from the options', () => {
    render(<SectionHeadingUsageExample />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Team members',
    );
    expect(
      screen.getByText('People who can access this project.'),
    ).toBeInTheDocument();
  });

  it('should render the label next to the title', () => {
    render(<SectionHeadingUsageExample />);

    expect(screen.getByText('12')).toHaveClass('label');
  });

  it('should run the handler from the actions slot', () => {
    render(<SectionHeadingUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Invite member' }));

    expect(screen.getByText('Invitation sent.')).toBeInTheDocument();
  });
});

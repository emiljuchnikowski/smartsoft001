import { fireEvent, render, screen } from '@testing-library/react';

import { SectionHeadingUsageExample } from './usage.example';

describe('docs-examples-react: SectionHeadingUsageExample', () => {
  it('should render the heading from the options', () => {
    // Act
    render(<SectionHeadingUsageExample />);

    // Assert
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Team members',
    );
    expect(
      screen.getByText('People who can access this project.'),
    ).toBeInTheDocument();
  });

  it('should render the label next to the title', () => {
    // Act
    render(<SectionHeadingUsageExample />);

    // Assert
    expect(screen.getByText('12 members')).toHaveClass('label');
  });

  it('should show the confirmation after the action button is clicked', () => {
    // Arrange
    render(<SectionHeadingUsageExample />);
    expect(screen.queryByText('Invitation sent.')).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Invite member' }));

    // Assert
    expect(screen.getByText('Invitation sent.')).toBeInTheDocument();
  });
});

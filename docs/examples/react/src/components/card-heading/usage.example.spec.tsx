import { fireEvent, render, screen } from '@testing-library/react';

import { CardHeadingUsageExample } from './usage.example';

describe('docs-examples-react: CardHeadingUsageExample', () => {
  it('should render the title and description from the options', () => {
    // Act
    render(<CardHeadingUsageExample />);

    // Assert
    expect(
      screen.getByRole('heading', { level: 3, name: 'Job postings' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Open roles across all teams/)).toBeInTheDocument();
    expect(screen.getByText('Jobs created: 0')).toBeInTheDocument();
  });

  it('should count the jobs the action button creates', () => {
    // Arrange
    render(<CardHeadingUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Create new job' }));

    // Assert
    expect(screen.getByText('Jobs created: 1')).toBeInTheDocument();
  });
});

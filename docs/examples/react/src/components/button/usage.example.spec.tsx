import { fireEvent, render, screen } from '@testing-library/react';

import { ButtonUsageExample } from './usage.example';

describe('docs-examples-react: ButtonUsageExample', () => {
  it('should render the label in the configured colour', () => {
    // Act
    render(<ButtonUsageExample />);

    // Assert
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('smart:bg-emerald-600');
    expect(screen.getByText('Saves: 0')).toBeInTheDocument();
  });

  it('should count the saves the click handler runs', () => {
    // Arrange
    render(<ButtonUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    // Assert
    expect(screen.getByText('Saves: 1')).toBeInTheDocument();
  });
});

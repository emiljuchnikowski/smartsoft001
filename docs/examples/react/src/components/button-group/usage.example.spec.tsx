import { fireEvent, render, screen, within } from '@testing-library/react';

import { ButtonGroupUsageExample } from './usage.example';

describe('docs-examples-react: ButtonGroupUsageExample', () => {
  function buttons() {
    return within(screen.getByRole('group')).getAllByRole('button');
  }

  it('should render the buttons and mark the selected one as pressed', () => {
    // Act
    render(<ButtonGroupUsageExample />);

    // Assert
    expect(buttons().map((button) => button.textContent)).toEqual([
      'Day',
      'Week',
      'Month',
    ]);
    expect(buttons()[1]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Showing: week')).toBeInTheDocument();
  });

  it('should select the clicked button and show it under the group', () => {
    // Arrange
    render(<ButtonGroupUsageExample />);

    // Act
    fireEvent.click(buttons()[2]);

    // Assert
    expect(buttons()[2]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons()[1]).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Showing: month')).toBeInTheDocument();
  });
});

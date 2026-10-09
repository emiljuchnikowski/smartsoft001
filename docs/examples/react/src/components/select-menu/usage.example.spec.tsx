import { fireEvent, render, screen } from '@testing-library/react';

import { SelectMenuUsageExample } from './usage.example';

describe('docs-examples-react: SelectMenuUsageExample', () => {
  it('should render the placeholder and the items from the options', () => {
    // Act
    render(<SelectMenuUsageExample />);

    // Assert
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Choose a plan', 'Starter', 'Professional', 'Enterprise']);
    expect(
      screen.getByRole('combobox', { name: 'Subscription plan' }),
    ).toBeInTheDocument();
  });

  it('should disable the item marked as disabled', () => {
    // Act
    render(<SelectMenuUsageExample />);

    // Assert
    expect(screen.getByRole('option', { name: 'Enterprise' })).toBeDisabled();
  });

  it('should show the chosen plan under the select', () => {
    // Arrange
    render(<SelectMenuUsageExample />);

    // Act
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Subscription plan' }),
      { target: { value: 'pro' } },
    );

    // Assert
    expect(screen.getByText('Selected plan: pro')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Subscription plan' }),
    ).toHaveValue('pro');
  });
});

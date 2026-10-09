import { fireEvent, render, screen } from '@testing-library/react';

import { SelectMenuUsageExample } from './usage.example';

describe('docs-examples-react: SelectMenuUsageExample', () => {
  it('should render the placeholder and the items from the options', () => {
    render(<SelectMenuUsageExample />);

    expect(
      screen.getByRole('option', { name: 'Choose a plan' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Professional' }),
    ).toBeInTheDocument();
  });

  it('should disable the item marked as disabled', () => {
    render(<SelectMenuUsageExample />);

    expect(screen.getByRole('option', { name: 'Enterprise' })).toBeDisabled();
  });

  it('should write the chosen value into the state', () => {
    render(<SelectMenuUsageExample />);

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Subscription plan' }),
      { target: { value: 'pro' } },
    );

    expect(screen.getByText('Selected plan: pro')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Subscription plan' }),
    ).toHaveValue('pro');
  });
});

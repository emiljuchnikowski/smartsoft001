import { fireEvent, render, screen } from '@testing-library/react';

import { ButtonUsageExample } from './usage.example';

describe('docs-examples-react: ButtonUsageExample', () => {
  it('should render the label as a button of the configured type', () => {
    render(<ButtonUsageExample />);

    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeEnabled();
  });

  it('should run the click handler from the options', () => {
    render(<ButtonUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByText('Saves: 1')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { ButtonCustomExample } from './custom.example';

describe('docs-examples-react: ButtonCustomExample', () => {
  it('should render the custom button with the label through SmartButton', () => {
    render(<ButtonCustomExample />);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('docs-button');
  });

  it('should run the options click handler when the custom button is clicked', () => {
    render(<ButtonCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Saved.')).toBeInTheDocument();
  });
});

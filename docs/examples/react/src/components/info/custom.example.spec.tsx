import { fireEvent, render, screen } from '@testing-library/react';

import { InfoCustomExample } from './custom.example';

describe('docs-examples-react: InfoCustomExample', () => {
  it('should render the custom info instead of the standard one', () => {
    const { container } = render(<InfoCustomExample />);

    expect(container.querySelector('.docs-info')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'More information' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should show the text after the trigger is clicked', () => {
    render(<InfoCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'More information' }));

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Enter your primary email address.',
    );
    // The standard info renders its popover with data-testid="info-popover".
    expect(screen.queryByTestId('info-popover')).toBeNull();
  });

  it('should close the popover on a click outside the component', () => {
    render(<InfoCustomExample />);
    fireEvent.click(screen.getByRole('button', { name: 'More information' }));

    fireEvent.click(document.body);

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

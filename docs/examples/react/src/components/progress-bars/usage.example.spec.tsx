import { fireEvent, render, screen } from '@testing-library/react';

import { ProgressBarsUsageExample } from './usage.example';

describe('docs-examples-react: ProgressBarsUsageExample', () => {
  it('should render the steps from the options', () => {
    render(<ProgressBarsUsageExample />);

    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('should label the navigation and mark the current step', () => {
    render(<ProgressBarsUsageExample />);

    expect(
      screen.getByRole('navigation', { name: 'Checkout progress' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent(
      'Payment',
    );
  });

  it('should hand the clicked step id to the handler', () => {
    render(<ProgressBarsUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: /Shipping/ }));

    expect(screen.getByText('Last clicked step: shipping')).toBeInTheDocument();
  });
});

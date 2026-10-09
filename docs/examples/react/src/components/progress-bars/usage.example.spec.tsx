import { fireEvent, render, screen } from '@testing-library/react';

import { ProgressBarsUsageExample } from './usage.example';

describe('docs-examples-react: ProgressBarsUsageExample', () => {
  it('should render the steps from the options', () => {
    // Act
    render(<ProgressBarsUsageExample />);

    // Assert
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('should label the navigation and mark the current step', () => {
    // Act
    render(<ProgressBarsUsageExample />);

    // Assert
    expect(
      screen.getByRole('navigation', { name: 'Checkout progress' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent(
      'Payment',
    );
  });

  it('should show the clicked step under the progress bars', () => {
    // Arrange
    render(<ProgressBarsUsageExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Shipping/ }));

    // Assert
    expect(screen.getByText('Last clicked step: shipping')).toBeInTheDocument();
  });
});

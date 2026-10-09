import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DetailUsageExample } from './usage.example';

describe('docs-examples-react: DetailUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DetailUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the text field value read from the item', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByText('Margot')).toBeInTheDocument();
  });

  it('should render the email field as a mailto link', () => {
    // Arrange
    setup();

    // Assert
    expect(
      screen.getByRole('link', { name: 'margot@example.com' }),
    ).toHaveAttribute('href', 'mailto:margot@example.com');
  });

  it('should label each field with its MODEL.<key> translation', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByText('first name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });
});

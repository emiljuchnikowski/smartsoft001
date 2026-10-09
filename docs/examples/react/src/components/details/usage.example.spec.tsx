import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DetailsUsageExample } from './usage.example';

describe('docs-examples-react: DetailsUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DetailsUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the item values from the options', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByText('Margot')).toBeInTheDocument();
    expect(screen.getByText('Foster')).toBeInTheDocument();
  });

  it('should render the email field as a mailto link', () => {
    // Arrange
    setup();

    // Assert
    expect(
      screen.getByRole('link', { name: 'margot.foster@example.com' }),
    ).toHaveAttribute('href', 'mailto:margot.foster@example.com');
  });

  it('should label each field with its MODEL.<key> translation', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getByText('first name')).toBeInTheDocument();
    expect(screen.getByText('last name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });
});

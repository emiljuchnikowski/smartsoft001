import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { CardUsageExample } from './usage.example';

describe('docs-examples-react: CardUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <CardUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title from the options', () => {
    // Act
    setup();

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Team members' }),
    ).toBeInTheDocument();
  });

  it('should render the body and footer content', () => {
    // Act
    setup();

    // Assert
    expect(screen.getByText('4 of 10 seats used')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Invite member' }),
    ).toBeInTheDocument();
  });

  it('should count the invited member in the body', () => {
    // Arrange
    setup();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Invite member' }));

    // Assert
    expect(screen.getByText('5 of 10 seats used')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ToggleUsageExample } from './usage.example';

describe('docs-examples-react: ToggleUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <ToggleUsageExample />
      </SmartProvider>,
    );

    return screen.getByRole('checkbox', { name: 'Email notifications' });
  }

  it('should render the switch from the options and the state value', () => {
    // Act
    const input = setup();

    // Assert
    expect(input).toBeChecked();
    expect(screen.getByText('Email notifications are on.')).toBeInTheDocument();
  });

  it('should describe the switch with the description text', () => {
    // Act
    const input = setup();

    // Assert
    expect(input).toHaveAccessibleDescription(
      'Get an email when someone comments on your post.',
    );
  });

  it('should write the new value back to the state and show it', () => {
    // Arrange
    const input = setup();

    // Act
    fireEvent.click(input);

    // Assert
    expect(input).not.toBeChecked();
    expect(
      screen.getByText('Email notifications are off.'),
    ).toBeInTheDocument();
  });
});

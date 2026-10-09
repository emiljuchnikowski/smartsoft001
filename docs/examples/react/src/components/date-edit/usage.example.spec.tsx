import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DateEditUsageExample } from './usage.example';

describe('docs-examples-react: DateEditUsageExample', () => {
  function setup() {
    const { container } = render(
      <SmartProvider language="eng">
        <DateEditUsageExample />
      </SmartProvider>,
    );

    return (): HTMLInputElement[] =>
      Array.from(container.querySelectorAll('input[type="number"]'));
  }

  it('should render the bound date digit by digit', () => {
    // Act
    const digitInputs = setup();

    // Assert
    expect(digitInputs().map((input) => input.value)).toEqual([
      '0',
      '7',
      '0',
      '4',
      '1',
      '9',
      '9',
      '0',
    ]);
    expect(
      screen.queryByText('Enter a valid date of birth.'),
    ).not.toBeInTheDocument();
  });

  it('should write the edited date back and keep it valid', () => {
    // Arrange
    const digitInputs = setup();

    // Act
    fireEvent.change(digitInputs()[0], { target: { value: '1' } });

    // Assert
    expect(digitInputs().map((input) => input.value)).toEqual([
      '1',
      '7',
      '0',
      '4',
      '1',
      '9',
      '9',
      '0',
    ]);
    expect(
      screen.queryByText('Enter a valid date of birth.'),
    ).not.toBeInTheDocument();
  });

  it('should show the message when the edited date is not valid', () => {
    // Arrange
    const digitInputs = setup();

    // Act
    fireEvent.change(digitInputs()[2], { target: { value: '9' } });

    // Assert
    expect(
      screen.getByText('Enter a valid date of birth.'),
    ).toBeInTheDocument();
  });
});

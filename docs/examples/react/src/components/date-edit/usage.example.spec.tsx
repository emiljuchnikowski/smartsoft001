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
    const digitInputs = setup();

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
  });

  it('should write the edited date back and keep it valid', () => {
    const digitInputs = setup();

    fireEvent.change(digitInputs()[0], { target: { value: '1' } });

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
    const digitInputs = setup();

    fireEvent.change(digitInputs()[2], { target: { value: '9' } });

    expect(
      screen.getByText('Enter a valid date of birth.'),
    ).toBeInTheDocument();
  });
});

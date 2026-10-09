import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DateRangeUsageExample } from './usage.example';

describe('docs-examples-react: DateRangeUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DateRangeUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the bound range on the trigger', () => {
    // Arrange
    setup();

    // Assert
    expect(screen.getAllByRole('button')[0]).toHaveTextContent(
      '2026-04-01 - 2026-04-30',
    );
  });

  it('should clear the range through the change handler', () => {
    // Arrange
    setup();
    const [trigger, clear] = screen.getAllByRole('button');

    // Act
    fireEvent.click(clear);

    // Assert
    expect(trigger).not.toHaveTextContent('2026-04-01 - 2026-04-30');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});

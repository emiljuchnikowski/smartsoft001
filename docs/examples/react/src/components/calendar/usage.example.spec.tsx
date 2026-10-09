import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarUsageExample } from './usage.example';

describe('docs-examples-react: CalendarUsageExample', () => {
  function day(date: Date) {
    return screen.getByRole('button', { name: date.toDateString() });
  }

  it('should render the month of the reference date, starting on Sunday', () => {
    // Act
    const { container } = render(<CalendarUsageExample />);

    // Assert
    expect(container.querySelector('.toolbar')).not.toBeNull();
    expect(day(new Date(2026, 8, 1))).toHaveAttribute(
      'data-current-month',
      'true',
    );
    expect(container.querySelector('.view-grid button.day')).toHaveAttribute(
      'aria-label',
      new Date(2026, 7, 30).toDateString(),
    );
  });

  it('should mark the days that have events', () => {
    // Act
    render(<CalendarUsageExample />);

    // Assert
    const cell = screen.getByRole('button', {
      name: `${new Date(2026, 8, 3).toDateString()}, 1 event`,
    });
    expect(cell).toHaveAttribute('data-events', '1');
    expect(cell.querySelector('[data-role="event-dot"]')).not.toBeNull();
  });

  it('should select the clicked day and show it under the calendar', () => {
    // Arrange
    render(<CalendarUsageExample />);
    const target = new Date(2026, 8, 15);

    // Act
    fireEvent.click(day(target));

    // Assert
    expect(day(target)).toHaveAttribute('data-selected', 'true');
    expect(
      screen.getByText(`Selected: ${target.toDateString()}`),
    ).toBeInTheDocument();
  });
});

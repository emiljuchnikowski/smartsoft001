import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarUsageExample } from './usage.example';

describe('docs-examples-react: CalendarUsageExample', () => {
  function day(date: Date) {
    return screen.getByRole('button', { name: date.toDateString() });
  }

  it('should render the month of the reference date with the toolbar', () => {
    const { container } = render(<CalendarUsageExample />);

    const calendar = container.querySelector('.calendar');
    expect(calendar).toHaveAttribute('data-view', 'month');
    expect(calendar?.querySelector('.toolbar')).not.toBeNull();
    expect(day(new Date(2026, 8, 1))).toHaveAttribute(
      'data-current-month',
      'true',
    );
  });

  it('should mark the days that have events', () => {
    render(<CalendarUsageExample />);

    const cell = screen.getByRole('button', {
      name: `${new Date(2026, 8, 3).toDateString()}, 1 event`,
    });
    expect(cell).toHaveAttribute('data-events', '1');
    expect(cell.querySelector('[data-role="event-dot"]')).not.toBeNull();
  });

  it('should select the clicked day through the controlled value', () => {
    render(<CalendarUsageExample />);
    const target = new Date(2026, 8, 15);

    fireEvent.click(day(target));

    expect(day(target)).toHaveAttribute('data-selected', 'true');
  });
});

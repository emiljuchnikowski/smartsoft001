import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartCalendar } from './calendar';
import { SmartCalendarProps } from './calendar.types';
import { SmartCalendarPreset } from './preset/calendar-preset';
import { getCalendarPresetDayClasses } from './preset/preset-classes';
import { SmartCalendarStandard } from './standard/calendar-standard';
import { buildMonthGrid, useCalendar } from './use-calendar';
import { ICalendarEvent } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartCalendar', () => {
  describe('SmartCalendar (wrapper)', () => {
    afterEach(() => jest.useRealTimers());

    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartCalendar options={{ view: 'week' }} className="passed-class" />,
      );

      expect(
        container.querySelector('.passed-class .calendar'),
      ).toHaveAttribute('data-view', 'week');
    });

    it('should forward value, referenceDate and events', () => {
      render(
        <SmartCalendar
          value={new Date(2027, 3, 10)}
          referenceDate={new Date(2027, 3, 1)}
          events={[{ id: 1, start: new Date(2027, 3, 10, 9) }]}
        />,
      );

      expect(
        screen.getByRole('button', {
          name: `${new Date(2027, 3, 10).toDateString()}, 1 event`,
        }),
      ).toHaveAttribute('data-selected', 'true');
    });

    it('should forward onValueChange of the standard implementation', () => {
      const onValueChange = jest.fn();
      render(
        <SmartCalendar
          referenceDate={new Date(2026, 0, 15)}
          onValueChange={onValueChange}
        />,
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: new Date(2026, 0, 20).toDateString(),
        }),
      );

      expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 20));
    });

    it('should render the implementation registered as components.calendar', () => {
      const Custom = ({ value, onValueChange }: SmartCalendarProps) => (
        <button
          type="button"
          className="injected-calendar"
          onClick={() => onValueChange?.(new Date(2026, 0, 15))}
        >
          {`injected ${value?.getDate()}`}
        </button>
      );
      const onValueChange = jest.fn();

      render(
        <SmartProvider components={{ calendar: Custom }}>
          <SmartCalendar
            value={new Date(2026, 0, 3)}
            onValueChange={onValueChange}
          />
        </SmartProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'injected 3' }));

      expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 15));
    });

    it('should pass today as referenceDate to the registered implementation by default', () => {
      jest.useFakeTimers({ now: new Date(2026, 3, 7, 12) });
      const Custom = ({ referenceDate }: SmartCalendarProps) => (
        <span data-testid="reference">{referenceDate?.toDateString()}</span>
      );

      render(
        <SmartProvider components={{ calendar: Custom }}>
          <SmartCalendar />
        </SmartProvider>,
      );

      expect(screen.getByTestId('reference')).toHaveTextContent(
        new Date(2026, 3, 7).toDateString(),
      );
    });
  });

  describe('buildMonthGrid', () => {
    it('should return 6 rows of 7 cells', () => {
      const grid = buildMonthGrid(new Date(2026, 0, 15), 1, null);

      expect(grid.map((row) => row.length)).toEqual([7, 7, 7, 7, 7, 7]);
    });

    it('should start on the Monday before the 1st when weekStart is 1', () => {
      // Jan 1 2026 is a Thursday; the Monday before is Dec 29 2025.
      const grid = buildMonthGrid(new Date(2026, 0, 15), 1, null);

      expect(grid[0][0].date).toEqual(new Date(2025, 11, 29));
      expect(grid[0][0].isCurrentMonth).toBe(false);
    });

    it('should start on the Sunday before the 1st when weekStart is 0', () => {
      const grid = buildMonthGrid(new Date(2026, 0, 15), 0, null);

      expect(grid[0][0].date).toEqual(new Date(2025, 11, 28));
    });

    it('should start on the 1st when the month begins on the week start', () => {
      // Jun 1 2026 is a Monday.
      const grid = buildMonthGrid(new Date(2026, 5, 15), 1, null);

      expect(grid[0][0].date).toEqual(new Date(2026, 5, 1));
    });

    it('should flag the days of the reference month', () => {
      const grid = buildMonthGrid(new Date(2026, 0, 15), 1, null);

      const inMonth = grid.flat().filter((cell) => cell.isCurrentMonth);

      expect(inMonth).toHaveLength(31);
      expect(inMonth[0].date).toEqual(new Date(2026, 0, 1));
      expect(inMonth[30].date).toEqual(new Date(2026, 0, 31));
    });

    it('should still produce 42 cells for a short month', () => {
      const grid = buildMonthGrid(new Date(2026, 1, 15), 1, null);

      expect(grid.flat()).toHaveLength(42);
      expect(grid.flat().filter((cell) => cell.isCurrentMonth)).toHaveLength(
        28,
      );
    });

    it('should flag today', () => {
      jest.useFakeTimers({ now: new Date(2026, 0, 20, 15, 30) });

      const grid = buildMonthGrid(new Date(2026, 0, 15), 1, null);
      jest.useRealTimers();

      const todays = grid.flat().filter((cell) => cell.isToday);
      expect(todays.map((cell) => cell.date)).toEqual([new Date(2026, 0, 20)]);
    });

    it('should flag the selected day ignoring its time', () => {
      const grid = buildMonthGrid(
        new Date(2026, 0, 15),
        1,
        new Date(2026, 0, 20, 18, 45),
      );

      const selected = grid.flat().filter((cell) => cell.isSelected);

      expect(selected.map((cell) => cell.date)).toEqual([
        new Date(2026, 0, 20),
      ]);
    });

    it('should flag no day without a selection', () => {
      const grid = buildMonthGrid(new Date(2026, 0, 15), 1, null);

      expect(grid.flat().some((cell) => cell.isSelected)).toBe(false);
    });
  });

  describe('useCalendar', () => {
    function calendar(props: SmartCalendarProps) {
      return renderHook(() => useCalendar(props)).result.current;
    }

    it('should default to the month view, Monday start and a toolbar', () => {
      const result = calendar({});

      expect([result.view, result.weekStart, result.showToolbar]).toEqual([
        'month',
        1,
        true,
      ]);
    });

    it('should take view, weekStart and showToolbar from options', () => {
      const result = calendar({
        options: { view: 'week', weekStart: 0, showToolbar: false },
      });

      expect([result.view, result.weekStart, result.showToolbar]).toEqual([
        'week',
        0,
        false,
      ]);
    });

    it('should default value to null', () => {
      const result = calendar({});

      expect(result.value).toBeNull();
    });

    describe('eventsForDay', () => {
      const events: ICalendarEvent[] = [
        { id: 1, start: new Date(2026, 0, 15, 9, 30), title: 'Standup' },
        { id: 2, start: new Date(2026, 0, 16, 14), title: 'Lunch' },
        { id: 3, start: new Date(2026, 0, 15, 18), title: 'Review' },
      ];

      it('should return the events starting on the day, ignoring time', () => {
        const result = calendar({ events });

        const found = result.eventsForDay(new Date(2026, 0, 15, 23, 59));

        expect(found.map((event) => event.id)).toEqual([1, 3]);
      });

      it('should return [] for a day without events', () => {
        const result = calendar({ events });

        expect(result.eventsForDay(new Date(2026, 0, 17))).toEqual([]);
      });
    });

    describe('dayAriaLabel', () => {
      it('should be the date string for a day without events', () => {
        const result = calendar({});

        expect(result.dayAriaLabel(new Date(2026, 0, 10))).toBe(
          new Date(2026, 0, 10).toDateString(),
        );
      });

      it('should mention a single event', () => {
        const result = calendar({
          events: [{ id: 1, start: new Date(2026, 0, 10, 9) }],
        });

        expect(result.dayAriaLabel(new Date(2026, 0, 10))).toBe(
          `${new Date(2026, 0, 10).toDateString()}, 1 event`,
        );
      });

      it('should mention the number of events', () => {
        const result = calendar({
          events: [
            { id: 1, start: new Date(2026, 0, 10, 9) },
            { id: 2, start: new Date(2026, 0, 10, 14) },
          ],
        });

        expect(result.dayAriaLabel(new Date(2026, 0, 10))).toBe(
          `${new Date(2026, 0, 10).toDateString()}, 2 events`,
        );
      });
    });

    describe('selection', () => {
      it('should keep the selected day when uncontrolled', () => {
        const { result } = renderHook(() => useCalendar({}));

        act(() => result.current.selectDay(new Date(2026, 5, 15)));

        expect(result.current.value).toEqual(new Date(2026, 5, 15));
      });

      it('should start from defaultValue when uncontrolled', () => {
        const result = calendar({ defaultValue: new Date(2026, 5, 15) });

        expect(result.value).toEqual(new Date(2026, 5, 15));
      });

      it('should report the selected day through onValueChange', () => {
        const onValueChange = jest.fn();
        const { result } = renderHook(() => useCalendar({ onValueChange }));

        act(() => result.current.selectDay(new Date(2026, 5, 15)));

        expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 15));
      });

      it('should keep the value prop when controlled', () => {
        const onValueChange = jest.fn();
        const { result } = renderHook(() =>
          useCalendar({ value: new Date(2026, 5, 1), onValueChange }),
        );

        act(() => result.current.selectDay(new Date(2026, 5, 15)));

        expect(result.current.value).toEqual(new Date(2026, 5, 1));
        expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 15));
      });

      it('should follow the value prop when controlled', () => {
        const initialProps: SmartCalendarProps = {
          value: new Date(2026, 5, 1),
        };
        const { result, rerender } = renderHook(
          (props: SmartCalendarProps) => useCalendar(props),
          { initialProps },
        );

        rerender({ value: null });

        expect(result.current.value).toBeNull();
      });

      it('should flag the selected day in the month grid', () => {
        const { result } = renderHook(() =>
          useCalendar({ referenceDate: new Date(2026, 0, 15) }),
        );

        act(() => result.current.selectDay(new Date(2026, 0, 20)));

        const selected = result.current.monthGrid
          .flat()
          .filter((cell) => cell.isSelected);
        expect(selected.map((cell) => cell.date)).toEqual([
          new Date(2026, 0, 20),
        ]);
      });
    });

    describe('reference date', () => {
      afterEach(() => jest.useRealTimers());

      it('should seed the reference from referenceDate', () => {
        const result = calendar({ referenceDate: new Date(2026, 5, 15) });

        expect(result.reference).toEqual(new Date(2026, 5, 15));
      });

      it('should default the reference to now', () => {
        jest.useFakeTimers({ now: new Date(2026, 3, 7, 12) });

        const result = calendar({});

        expect(result.reference).toEqual(new Date(2026, 3, 7, 12));
      });

      it('should jump to a new referenceDate', () => {
        const initialProps: SmartCalendarProps = {
          referenceDate: new Date(2026, 0, 15),
        };
        const { result, rerender } = renderHook(
          (props: SmartCalendarProps) => useCalendar(props),
          { initialProps },
        );
        act(() => result.current.nextPeriod());

        rerender({ referenceDate: new Date(2027, 3, 1) });

        expect(result.current.reference).toEqual(new Date(2027, 3, 1));
      });

      it('should keep the navigated month when referenceDate is an equal new Date', () => {
        const initialProps: SmartCalendarProps = {
          referenceDate: new Date(2026, 0, 15),
        };
        const { result, rerender } = renderHook(
          (props: SmartCalendarProps) => useCalendar(props),
          { initialProps },
        );
        act(() => result.current.nextPeriod());

        rerender({ referenceDate: new Date(2026, 0, 15) });

        expect(result.current.reference).toEqual(new Date(2026, 1, 15));
      });

      it('should keep the reference when referenceDate is removed', () => {
        const initialProps: SmartCalendarProps = {
          referenceDate: new Date(2026, 0, 15),
        };
        const { result, rerender } = renderHook(
          (props: SmartCalendarProps) => useCalendar(props),
          { initialProps },
        );

        rerender({});

        expect(result.current.reference).toEqual(new Date(2026, 0, 15));
      });

      it('should rebuild the month grid for the new reference', () => {
        const initialProps: SmartCalendarProps = {
          referenceDate: new Date(2026, 0, 15),
        };
        const { result, rerender } = renderHook(
          (props: SmartCalendarProps) => useCalendar(props),
          { initialProps },
        );

        rerender({ referenceDate: new Date(2026, 1, 15) });

        const inMonth = result.current.monthGrid
          .flat()
          .filter((cell) => cell.isCurrentMonth);
        expect(inMonth).toHaveLength(28);
      });

      it('should go back to today', () => {
        jest.useFakeTimers({ now: new Date(2026, 3, 7, 12) });
        const { result } = renderHook(() =>
          useCalendar({ referenceDate: new Date(2020, 0, 1) }),
        );

        act(() => result.current.goToToday());

        expect(result.current.reference).toEqual(new Date(2026, 3, 7, 12));
      });
    });

    describe('navigation', () => {
      function navigate(
        props: SmartCalendarProps,
        direction: 'prevPeriod' | 'nextPeriod',
      ): Date {
        const { result } = renderHook(() => useCalendar(props));

        act(() => result.current[direction]());

        return result.current.reference;
      }

      it.each([
        ['month', 'prevPeriod', new Date(2026, 4, 15)],
        ['month', 'nextPeriod', new Date(2026, 6, 15)],
        ['week', 'prevPeriod', new Date(2026, 5, 8)],
        ['week', 'nextPeriod', new Date(2026, 5, 22)],
        ['day', 'prevPeriod', new Date(2026, 5, 14)],
        ['day', 'nextPeriod', new Date(2026, 5, 16)],
        ['year', 'prevPeriod', new Date(2025, 5, 15)],
        ['year', 'nextPeriod', new Date(2027, 5, 15)],
      ] as const)(
        '%s view: %s should move the reference by one period',
        (view, direction, expected) => {
          const reference = navigate(
            { options: { view }, referenceDate: new Date(2026, 5, 15) },
            direction,
          );

          expect(reference).toEqual(expected);
        },
      );

      it('should cross the year boundary backwards (Jan -> Dec)', () => {
        const reference = navigate(
          { referenceDate: new Date(2026, 0, 15) },
          'prevPeriod',
        );

        expect(reference).toEqual(new Date(2025, 11, 15));
      });

      it('should cross the year boundary forwards (Dec -> Jan)', () => {
        const reference = navigate(
          { referenceDate: new Date(2026, 11, 15) },
          'nextPeriod',
        );

        expect(reference).toEqual(new Date(2027, 0, 15));
      });

      it('should step consecutive periods from the latest reference', () => {
        const { result } = renderHook(() =>
          useCalendar({ referenceDate: new Date(2026, 0, 15) }),
        );

        act(() => {
          result.current.nextPeriod();
          result.current.nextPeriod();
        });

        expect(result.current.reference).toEqual(new Date(2026, 2, 15));
      });
    });
  });

  describe('SmartCalendarStandard', () => {
    // Jan 2026 with weekStart=1 starts on Mon Dec 29, so Jan 1 is cell 3 and
    // Jan 10 is cell 12.
    const JAN_2026 = new Date(2026, 0, 15);
    const JAN_10_INDEX = 12;

    afterEach(() => jest.useRealTimers());

    function renderStandard(props: SmartCalendarProps = {}) {
      return render(
        <SmartCalendarStandard referenceDate={JAN_2026} {...props} />,
      );
    }

    function days(container: HTMLElement): HTMLButtonElement[] {
      return Array.from(
        container.querySelectorAll<HTMLButtonElement>('.view-grid .day'),
      );
    }

    function firstDayOfShownMonth(container: HTMLElement): string | null {
      return (
        container
          .querySelector('.day[data-current-month="true"]')
          ?.getAttribute('aria-label') ?? null
      );
    }

    it('should render the calendar with data-view="month" by default', () => {
      const { container } = renderStandard();

      expect(container.querySelector('.calendar')).toHaveAttribute(
        'data-view',
        'month',
      );
    });

    it('should expose options.view as data-view', () => {
      const { container } = renderStandard({ options: { view: 'week' } });

      expect(container.querySelector('.calendar')).toHaveAttribute(
        'data-view',
        'week',
      );
    });

    it('should render 6 week rows of 7 day buttons', () => {
      const { container } = renderStandard();

      expect(container.querySelectorAll('.view-grid .week')).toHaveLength(6);
      expect(days(container)).toHaveLength(42);
    });

    it('should apply className on the wrapper', () => {
      const { container } = renderStandard({ className: 'my-extra-class' });

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the toolbar by default', () => {
      const { container } = renderStandard();

      expect(container.querySelector('.toolbar')).toBeInTheDocument();
    });

    it('should hide the toolbar when options.showToolbar is false', () => {
      const { container } = renderStandard({ options: { showToolbar: false } });

      expect(container.querySelector('.toolbar')).toBeNull();
    });

    it('should show the previous month on Prev', () => {
      const { container } = renderStandard({
        referenceDate: new Date(2026, 5, 15),
      });

      fireEvent.click(screen.getByRole('button', { name: 'Prev' }));

      expect(firstDayOfShownMonth(container)).toBe(
        new Date(2026, 4, 1).toDateString(),
      );
    });

    it('should show the next month on Next', () => {
      const { container } = renderStandard({
        referenceDate: new Date(2026, 5, 15),
      });

      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(firstDayOfShownMonth(container)).toBe(
        new Date(2026, 6, 1).toDateString(),
      );
    });

    it('should show the current month on Today', () => {
      jest.useFakeTimers({ now: new Date(2026, 3, 7, 12) });
      const { container } = renderStandard({
        referenceDate: new Date(2020, 0, 1),
      });

      fireEvent.click(screen.getByRole('button', { name: 'Today' }));

      expect(firstDayOfShownMonth(container)).toBe(
        new Date(2026, 3, 1).toDateString(),
      );
    });

    it('should report the clicked day through onValueChange', () => {
      const onValueChange = jest.fn();
      const { container } = renderStandard({ onValueChange });

      fireEvent.click(days(container)[3]);

      expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 1));
    });

    it('should mark the clicked day as selected when uncontrolled', () => {
      const { container } = renderStandard();

      fireEvent.click(days(container)[3]);

      expect(days(container)[3]).toHaveAttribute('data-selected', 'true');
    });

    it('should set data-current-month only on the days of the shown month', () => {
      const { container } = renderStandard();

      expect(
        container.querySelectorAll('.day[data-current-month="true"]'),
      ).toHaveLength(31);
      expect(days(container)[0]).not.toHaveAttribute('data-current-month');
    });

    it("should set data-today on today's cell", () => {
      jest.useFakeTimers({ now: new Date(2026, 0, 20, 12) });
      const { container } = renderStandard();

      const todays = container.querySelectorAll('.day[data-today="true"]');

      expect(todays).toHaveLength(1);
      expect(todays[0]).toHaveTextContent('20');
    });

    it('should set data-selected on the day matching value', () => {
      const { container } = renderStandard({ value: new Date(2026, 0, 20) });

      const selected = container.querySelectorAll('.day[data-selected="true"]');

      expect(selected).toHaveLength(1);
      expect(selected[0]).toHaveTextContent('20');
    });

    describe('events', () => {
      const events = [
        { id: 1, start: new Date(2026, 0, 10, 9) },
        { id: 2, start: new Date(2026, 0, 10, 14) },
        { id: 3, start: new Date(2026, 0, 12) },
      ];

      it('should render an aria-hidden event marker only on days with events', () => {
        const { container } = renderStandard({ events });

        const markers = container.querySelectorAll(
          '.day span.smart-calendar-event[data-role="event-dot"]',
        );

        expect(markers).toHaveLength(2);
        expect(markers[0]).toHaveAttribute('aria-hidden', 'true');
        expect(days(container)[JAN_10_INDEX]).toContainElement(
          markers[0] as HTMLElement,
        );
      });

      it('should set data-events to the event count on days with events', () => {
        const { container } = renderStandard({ events });

        expect(container.querySelectorAll('.day[data-events]')).toHaveLength(2);
        expect(days(container)[JAN_10_INDEX]).toHaveAttribute(
          'data-events',
          '2',
        );
        expect(days(container)[JAN_10_INDEX + 2]).toHaveAttribute(
          'data-events',
          '1',
        );
      });

      it('should mention the event count in the day aria-label', () => {
        renderStandard({ events });

        expect(
          screen.getByRole('button', {
            name: `${new Date(2026, 0, 10).toDateString()}, 2 events`,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', {
            name: `${new Date(2026, 0, 12).toDateString()}, 1 event`,
          }),
        ).toBeInTheDocument();
      });

      it('should keep the plain date as aria-label on days without events', () => {
        const { container } = renderStandard({ events });

        const jan11 = days(container)[JAN_10_INDEX + 1];

        expect(jan11).toHaveAttribute(
          'aria-label',
          new Date(2026, 0, 11).toDateString(),
        );
        expect(jan11).not.toHaveAttribute('data-events');
      });
    });

    describe('templates', () => {
      it('should render dayCellTpl in every day with the cell and its events', () => {
        const events = [{ id: 1, start: new Date(2026, 0, 10, 9) }];
        const { container } = renderStandard({
          events,
          options: {
            dayCellTpl: ({ cell, events: dayEvents }) => (
              <span className="custom-day">
                {cell.date.getDate()}*{dayEvents.length}
              </span>
            ),
          },
        });

        expect(container.querySelectorAll('.day .custom-day')).toHaveLength(42);
        expect(days(container)[JAN_10_INDEX]).toHaveTextContent('10*1');
      });

      it('should replace the default content with dayCellTpl', () => {
        const events = [{ id: 1, start: new Date(2026, 0, 10, 9) }];
        const { container } = renderStandard({
          events,
          options: { dayCellTpl: () => <span className="custom-day" /> },
        });

        expect(container.querySelector('[data-role="event-dot"]')).toBeNull();
      });

      it('should render toolbarActionsTpl inside .toolbar-actions', () => {
        const { container } = renderStandard({
          options: {
            toolbarActionsTpl: (
              <button type="button" className="add-event-btn">
                + Event
              </button>
            ),
          },
        });

        expect(
          container.querySelector('.toolbar-actions button.add-event-btn'),
        ).toBeInTheDocument();
      });

      it('should not render .toolbar-actions without toolbarActionsTpl', () => {
        const { container } = renderStandard();

        expect(container.querySelector('.toolbar-actions')).toBeNull();
      });
    });
  });

  describe('SmartCalendarPreset', () => {
    // Fixed reference so the rendered grid is deterministic (July 2023).
    const JULY_2023 = new Date(2023, 6, 15);

    afterEach(() => jest.useRealTimers());

    function renderPreset(props: SmartCalendarProps = {}) {
      return render(
        <SmartCalendarPreset referenceDate={JULY_2023} {...props} />,
      );
    }

    function dayButtons(container: HTMLElement): HTMLButtonElement[] {
      return Array.from(
        container.querySelectorAll<HTMLButtonElement>('[data-role="day"]'),
      );
    }

    function text(container: HTMLElement, role: string): string | undefined {
      return container
        .querySelector(`[data-role="${role}"]`)
        ?.textContent?.trim();
    }

    function weekdays(container: HTMLElement): (string | undefined)[] {
      return Array.from(
        container.querySelectorAll('[data-role="weekday"]'),
      ).map((el) => el.textContent?.trim());
    }

    it('should render a 6-week month grid (42 day cells)', () => {
      const { container } = renderPreset();

      expect(dayButtons(container)).toHaveLength(42);
    });

    it('should render the styled popover container', () => {
      const { container } = renderPreset();

      expect(container.querySelector('[data-role="calendar"]')).toHaveClass(
        'smart:w-80',
        'smart:rounded-xl',
      );
    });

    it('should render the month and year labels', () => {
      const { container } = renderPreset();

      expect([
        text(container, 'month-label'),
        text(container, 'year-label'),
      ]).toEqual(['July', '2023']);
    });

    it('should render 7 weekday labels starting on Monday by default', () => {
      const { container } = renderPreset();

      expect(weekdays(container)).toEqual([
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
        'Su',
      ]);
    });

    it('should start the week on Sunday when options.weekStart is 0', () => {
      const { container } = renderPreset({ options: { weekStart: 0 } });

      expect(weekdays(container)).toEqual([
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
      ]);
    });

    it('should advance to the next month when Next is clicked', () => {
      const { container } = renderPreset();

      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(text(container, 'month-label')).toBe('August');
    });

    it('should go to the previous month when Previous is clicked', () => {
      const { container } = renderPreset();

      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

      expect(text(container, 'month-label')).toBe('June');
    });

    it('should hide the month header when options.showToolbar is false', () => {
      const { container } = renderPreset({ options: { showToolbar: false } });

      expect(container.querySelector('[data-role="month-label"]')).toBeNull();
      expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
    });

    it('should report the clicked current-month day through onValueChange', () => {
      const onValueChange = jest.fn();
      const { container } = renderPreset({ onValueChange });

      fireEvent.click(dayButtons(container).filter((b) => !b.disabled)[0]);

      expect(onValueChange).toHaveBeenCalledWith(new Date(2023, 6, 1));
    });

    it('should press the clicked day when uncontrolled', () => {
      renderPreset();
      const label = new Date(2023, 6, 20).toDateString();

      fireEvent.click(screen.getByRole('button', { name: label }));

      expect(screen.getByRole('button', { name: label })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('should disable out-of-month day cells', () => {
      const { container } = renderPreset();

      const disabled = dayButtons(container).filter((b) => b.disabled);

      // July 2023 starts on a Saturday: 5 leading + 6 trailing days.
      expect(disabled).toHaveLength(11);
    });

    it('should apply the selected styling to the chosen day', () => {
      const { container } = renderPreset({ value: new Date(2023, 6, 20) });

      const selected = container.querySelector('[data-selected="true"]');

      expect(selected).toHaveTextContent('20');
      expect(selected).toHaveClass('smart:bg-blue-600');
      expect(selected).toHaveAttribute('aria-pressed', 'true');
    });

    it('should not press the other days', () => {
      renderPreset({ value: new Date(2023, 6, 20) });

      expect(
        screen.getByRole('button', {
          name: new Date(2023, 6, 21).toDateString(),
        }),
      ).toHaveAttribute('aria-pressed', 'false');
    });

    it("should mark today's cell", () => {
      jest.useFakeTimers({ now: new Date(2023, 6, 18, 12) });
      const { container } = renderPreset();

      const today = container.querySelector('[data-today="true"]');

      expect(today).toHaveTextContent('18');
      expect(today).toHaveClass('smart:border-blue-600');
    });

    it('should render an event dot on days that have events', () => {
      const { container } = renderPreset({
        events: [{ id: 1, start: new Date(2023, 6, 10) }],
      });

      const dots = container.querySelectorAll('[data-role="event-dot"]');

      expect(dots).toHaveLength(1);
      expect(
        screen.getByRole('button', {
          name: `${new Date(2023, 6, 10).toDateString()}, 1 event`,
        }),
      ).toContainElement(dots[0] as HTMLElement);
    });

    it('should mention the event count in the day aria-label', () => {
      renderPreset({
        events: [
          { id: 1, start: new Date(2023, 6, 10) },
          { id: 2, start: new Date(2023, 6, 10) },
        ],
      });

      expect(
        screen.getByRole('button', {
          name: `${new Date(2023, 6, 10).toDateString()}, 2 events`,
        }),
      ).toBeInTheDocument();
    });

    it('should render dayCellTpl with the cell and its events', () => {
      renderPreset({
        events: [{ id: 1, start: new Date(2023, 6, 10) }],
        options: {
          dayCellTpl: ({ cell, events }) => (
            <span className="custom-day">
              {cell.date.getDate()}/{events.length}
            </span>
          ),
        },
      });

      expect(
        screen.getByRole('button', {
          name: `${new Date(2023, 6, 10).toDateString()}, 1 event`,
        }),
      ).toHaveTextContent('10/1');
    });

    it('should apply className on the root element', () => {
      const { container } = renderPreset({ className: 'my-extra-class' });

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    describe('getCalendarPresetDayClasses', () => {
      const cell = {
        date: new Date(2023, 6, 10),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };

      it('should return the selected classes for a selected day', () => {
        const cls = getCalendarPresetDayClasses({
          ...cell,
          isToday: true,
          isSelected: true,
        });

        expect(cls).toContain('smart:bg-blue-600');
        expect(cls).toContain('smart:text-white');
      });

      it('should return the today classes for the current day', () => {
        const cls = getCalendarPresetDayClasses({ ...cell, isToday: true });

        expect(cls).toContain('smart:border-blue-600');
      });

      it('should return the muted classes for out-of-month days', () => {
        const cls = getCalendarPresetDayClasses({
          ...cell,
          isCurrentMonth: false,
          isToday: true,
        });

        expect(cls).toContain('smart:text-gray-400');
      });

      it('should return the default classes for a plain current-month day', () => {
        const cls = getCalendarPresetDayClasses(cell);

        expect(cls).toContain('smart:text-gray-900');
        expect(cls).toContain('smart:hover:border-blue-600');
      });
    });
  });
});

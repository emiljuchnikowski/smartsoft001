import { act, fireEvent, render, screen } from '@testing-library/react';
import moment from 'moment';
import { useState } from 'react';
import type { ReactElement } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';

import { SmartDateRange } from './date-range';
import { FilterBtnConstants } from './date-range.types';
import { SmartDateRangePreset } from './preset/date-range-preset';
import { SmartDateRangeModalStandard } from './standard/date-range-modal-standard';
import { SmartDateRangeStandard } from './standard/date-range-standard';
import { SmartFormControl } from '../../forms';
import { useStyleService } from '../../providers/hooks';
import { SmartProvider } from '../../providers/smart-provider';

const TODAY = new Date('2026-10-08T10:00:00');

function renderEng(ui: ReactElement) {
  return render(<SmartProvider language="eng">{ui}</SmartProvider>);
}

/** The day cells of the month titled `title` (e.g. `October 2026`). */
function monthDays(title: string): HTMLElement[] {
  const heading = screen.getByText(title);

  return Array.from(
    (heading.nextElementSibling as HTMLElement).children,
  ) as HTMLElement[];
}

function dayCell(title: string, day: number): HTMLElement {
  return monthDays(title).find(
    (cell) => cell.textContent?.trim() === String(day),
  ) as HTMLElement;
}

function modalHeader(container: HTMLElement): string {
  return (
    container.querySelector('span.smart\\:text-gray-600')?.textContent ?? ''
  ).trim();
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('@smartsoft001/react: SmartDateRangeModalStandard', () => {
  it('should render the backdrop', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    expect(
      container.querySelector('.smart\\:fixed.smart\\:inset-0'),
    ).toBeInTheDocument();
  });

  it('should render the translated day-of-week headers', () => {
    renderEng(<SmartDateRangeModalStandard />);

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('should render the months of the calendar with translated names', () => {
    render(<SmartDateRangeModalStandard />);

    expect(screen.getByText('Październik 2026')).toBeInTheDocument();
  });

  it('should select today without a previous state', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    expect(modalHeader(container)).toBe('2026-10-08 - 2026-10-08');
  });

  it('should open with the previous state', () => {
    const { container } = renderEng(
      <SmartDateRangeModalStandard
        previousState={{
          dateFrom: moment('2026-04-01'),
          dateTo: moment('2026-04-07'),
          scrollPosition: 0,
          selectedButtonName: FilterBtnConstants.empthyString,
        }}
      />,
    );

    expect(modalHeader(container)).toBe('2026-04-01 - 2026-04-07');
  });

  it('should emit dismiss on a backdrop click', () => {
    const onDismiss = jest.fn();
    const { container } = renderEng(
      <SmartDateRangeModalStandard onDismiss={onDismiss} />,
    );

    fireEvent.click(
      container.querySelector('.smart\\:fixed.smart\\:inset-0') as Element,
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should emit dismiss on the close button', () => {
    const onDismiss = jest.fn();
    const { container } = renderEng(
      <SmartDateRangeModalStandard onDismiss={onDismiss} />,
    );

    fireEvent.click(
      container.querySelector(
        'span.smart\\:text-gray-600 + button',
      ) as HTMLElement,
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should start a new range on a day click once both dates are set', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(dayCell('October 2026', 3));

    expect(modalHeader(container)).toBe('2026-10-03 - 2026-10-03');
  });

  it('should end the range on a later day', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('October 2026', 6));

    expect(modalHeader(container)).toBe('2026-10-03 - 2026-10-06');
  });

  it('should move the start to an earlier day', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('September 2026', 28));

    expect(modalHeader(container)).toBe('2026-09-28 - 2026-09-28');
  });

  it('should ignore a second click on the same day', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('October 2026', 6));
    fireEvent.click(dayCell('October 2026', 6));

    expect(modalHeader(container)).toBe('2026-10-03 - 2026-10-06');
  });

  it('should ignore a click on an empty cell', () => {
    const { container } = renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(monthDays('October 2026')[0]);

    expect(modalHeader(container)).toBe('2026-10-08 - 2026-10-08');
  });

  it('should highlight the start, the end and the days between', () => {
    renderEng(<SmartDateRangeModalStandard />);

    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('October 2026', 6));

    expect(dayCell('October 2026', 3)).toHaveClass(
      'smart:bg-indigo-600',
      'smart:rounded-l-lg',
    );
    expect(dayCell('October 2026', 6)).toHaveClass(
      'smart:bg-indigo-600',
      'smart:rounded-r-lg',
    );
    expect(dayCell('October 2026', 4)).toHaveClass('smart:bg-indigo-100');
    expect(dayCell('October 2026', 7)).not.toHaveClass('smart:bg-indigo-100');
  });

  it('should round every cell while the start and end are the same day', () => {
    renderEng(<SmartDateRangeModalStandard />);

    expect(dayCell('October 2026', 8)).toHaveClass(
      'smart:bg-indigo-600',
      'smart:rounded-lg',
    );
    expect(dayCell('October 2026', 1)).toHaveClass('smart:rounded-lg');
  });

  it('should apply the start as the end when only a start is picked', () => {
    const onApply = jest.fn();
    renderEng(<SmartDateRangeModalStandard onApply={onApply} />);
    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('September 2026', 28));

    fireEvent.click(screen.getByRole('button', { name: 'select' }));

    const state = onApply.mock.calls[0][0];
    expect(state.dateFrom.format('YYYY-MM-DD')).toBe('2026-09-28');
    expect(state.dateTo.format('YYYY-MM-DD')).toBe('2026-09-28');
    expect(state.selectedButtonName).toBe('');
  });

  it('should not render the filter buttons by default', () => {
    renderEng(<SmartDateRangeModalStandard />);

    expect(
      screen.queryByRole('button', { name: 'Yesterday' }),
    ).not.toBeInTheDocument();
  });

  it('should highlight the Today filter button by default', () => {
    renderEng(<SmartDateRangeModalStandard showFilterBtns />);

    expect(screen.getByRole('button', { name: 'Today' })).toHaveClass(
      'smart:bg-indigo-600',
      'smart:text-white',
    );
    expect(screen.getByRole('button', { name: 'Yesterday' })).toHaveClass(
      'smart:bg-gray-100',
    );
  });

  it.each([
    ['Yesterday', '2026-10-07 - 2026-10-07'],
    ['Last 7 days', '2026-10-02 - 2026-10-08'],
    ['Last 30 days', '2026-09-09 - 2026-10-08'],
    ['This month', '2026-10-01 - 2026-10-08'],
    ['Last month', '2026-09-01 - 2026-09-30'],
    ['Today', '2026-10-08 - 2026-10-08'],
  ])('should select the range of the %s button', (name, range) => {
    const { container } = renderEng(
      <SmartDateRangeModalStandard showFilterBtns />,
    );
    fireEvent.click(dayCell('October 2026', 3));

    fireEvent.click(screen.getByRole('button', { name }));

    expect(modalHeader(container)).toBe(range);
    expect(screen.getByRole('button', { name })).toHaveClass(
      'smart:bg-indigo-600',
    );
  });

  it('should apply the name of the picked filter button', () => {
    const onApply = jest.fn();
    renderEng(<SmartDateRangeModalStandard showFilterBtns onApply={onApply} />);
    fireEvent.click(screen.getByRole('button', { name: 'Last month' }));

    fireEvent.click(screen.getByRole('button', { name: 'select' }));

    expect(onApply.mock.calls[0][0].selectedButtonName).toBe(
      FilterBtnConstants.lastMonth,
    );
  });

  it('should drop the filter button highlight on a day click', () => {
    renderEng(<SmartDateRangeModalStandard showFilterBtns />);

    fireEvent.click(dayCell('October 2026', 3));

    expect(screen.getByRole('button', { name: 'Today' })).not.toHaveClass(
      'smart:bg-indigo-600',
    );
  });

  it('should disable select until the range spans restrictSelectionTo days', () => {
    renderEng(
      <SmartDateRangeModalStandard showFilterBtns restrictSelectionTo={7} />,
    );

    expect(screen.getByRole('button', { name: 'select' })).toBeDisabled();
  });

  it('should enable select once the range spans restrictSelectionTo days', () => {
    renderEng(
      <SmartDateRangeModalStandard showFilterBtns restrictSelectionTo={7} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));

    expect(screen.getByRole('button', { name: 'select' })).toBeEnabled();
  });

  it('should keep a picked range that breaks restrictSelectionTo', () => {
    const { container } = renderEng(
      <SmartDateRangeModalStandard restrictSelectionTo={7} />,
    );

    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('October 2026', 5));

    expect(modalHeader(container)).toBe('2026-10-03 - 2026-10-05');
    expect(screen.getByRole('button', { name: 'select' })).toBeDisabled();
  });

  it('should write the application style variables on the modal', () => {
    function StyledModal() {
      const styleService = useStyleService();
      useState(() => styleService.set({ 'color-primary': '#123456' }));

      return <SmartDateRangeModalStandard />;
    }

    const { container } = renderEng(<StyledModal />);

    const panel = container.querySelector(
      '.smart\\:fixed.smart\\:inset-x-4',
    ) as HTMLElement;
    expect(panel.style.getPropertyValue('--smart-color-primary')).toBe(
      '#123456',
    );
  });

  it('should apply today with the Today button name by default', () => {
    const onApply = jest.fn();
    renderEng(<SmartDateRangeModalStandard onApply={onApply} />);

    fireEvent.click(screen.getByRole('button', { name: 'select' }));

    const state = onApply.mock.calls[0][0];
    expect(state.dateFrom.format('YYYY-MM-DD')).toBe('2026-10-08');
    expect(state.dateTo.format('YYYY-MM-DD')).toBe('2026-10-08');
    expect(state.selectedButtonName).toBe('Today');
  });
});

describe('@smartsoft001/react: SmartDateRangeStandard', () => {
  const RANGE = { start: '2026-04-01', end: '2026-04-07' } as const;

  function triggerButton(container: HTMLElement): HTMLButtonElement {
    return container.querySelector('button') as HTMLButtonElement;
  }

  function clearButton(container: HTMLElement): HTMLButtonElement | null {
    return container.querySelector('div.smart\\:inline-flex > button + button');
  }

  it('should show the translated select label without a value', () => {
    const { container } = render(<SmartDateRangeStandard />);

    expect(triggerButton(container)).toHaveTextContent('wybierz');
  });

  it('should show the range on the trigger', () => {
    const { container } = render(<SmartDateRangeStandard value={RANGE} />);

    expect(triggerButton(container)).toHaveTextContent(
      '2026-04-01 - 2026-04-07',
    );
  });

  it('should show the clear button only with a value', () => {
    const { container, rerender } = render(<SmartDateRangeStandard />);
    expect(clearButton(container)).toBeNull();

    rerender(<SmartDateRangeStandard value={RANGE} />);

    expect(clearButton(container)).toBeInTheDocument();
  });

  it('should emit undefined on clear', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangeStandard value={RANGE} onValueChange={onValueChange} />,
    );

    fireEvent.click(clearButton(container) as HTMLButtonElement);

    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  it('should go back to the select label once cleared when uncontrolled', () => {
    const { container } = render(
      <SmartDateRangeStandard defaultValue={RANGE} />,
    );

    fireEvent.click(clearButton(container) as HTMLButtonElement);

    expect(triggerButton(container)).toHaveTextContent('wybierz');
    expect(clearButton(container)).toBeNull();
  });

  it('should not render the modal until the trigger is clicked', () => {
    const { container } = render(<SmartDateRangeStandard />);

    expect(
      container.querySelector('.smart\\:fixed.smart\\:inset-0'),
    ).toBeNull();
  });

  it('should open the modal on the range of the value', () => {
    const { container } = renderEng(<SmartDateRangeStandard value={RANGE} />);

    fireEvent.click(triggerButton(container));

    expect(modalHeader(container)).toBe('2026-04-01 - 2026-04-07');
  });

  it('should emit the applied range and close the modal', () => {
    const onValueChange = jest.fn();
    const { container } = renderEng(
      <SmartDateRangeStandard onValueChange={onValueChange} />,
    );
    fireEvent.click(triggerButton(container));
    fireEvent.click(dayCell('October 2026', 3));
    fireEvent.click(dayCell('October 2026', 6));

    fireEvent.click(screen.getAllByRole('button', { name: 'select' })[1]);

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-03',
      end: '2026-10-06',
    });
    expect(
      container.querySelector('.smart\\:fixed.smart\\:inset-0'),
    ).toBeNull();
  });

  it('should show the applied range when uncontrolled', () => {
    const { container } = renderEng(<SmartDateRangeStandard />);
    fireEvent.click(triggerButton(container));

    fireEvent.click(screen.getAllByRole('button', { name: 'select' })[1]);

    expect(triggerButton(container)).toHaveTextContent(
      '2026-10-08 - 2026-10-08',
    );
  });

  it('should close the modal without a change on dismiss', () => {
    const onValueChange = jest.fn();
    const { container } = renderEng(
      <SmartDateRangeStandard value={RANGE} onValueChange={onValueChange} />,
    );
    fireEvent.click(triggerButton(container));

    fireEvent.click(
      container.querySelector('.smart\\:fixed.smart\\:inset-0') as Element,
    );

    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      container.querySelector('.smart\\:fixed.smart\\:inset-0'),
    ).toBeNull();
  });

  it('should reopen on today once the value is cleared', () => {
    const { container } = renderEng(
      <SmartDateRangeStandard defaultValue={RANGE} />,
    );
    fireEvent.click(triggerButton(container));
    fireEvent.click(
      container.querySelector('.smart\\:fixed.smart\\:inset-0') as Element,
    );
    fireEvent.click(clearButton(container) as HTMLButtonElement);

    fireEvent.click(triggerButton(container));

    expect(modalHeader(container)).toBe('2026-10-08 - 2026-10-08');
  });

  it('should apply className to the trigger row', () => {
    const { container } = render(<SmartDateRangeStandard className="extra" />);

    expect(container.firstElementChild).toHaveClass(
      'smart:inline-flex',
      'extra',
    );
  });
});

describe('@smartsoft001/react: SmartDateRangePreset', () => {
  const RANGE = { start: '2026-04-01', end: '2026-04-07' } as const;

  function trigger(container: HTMLElement): HTMLButtonElement {
    return container.querySelector(
      '[data-role="trigger"]',
    ) as HTMLButtonElement;
  }

  function days(container: HTMLElement): HTMLButtonElement[] {
    return Array.from(container.querySelectorAll('[data-role="day"]'));
  }

  /** A day of October 2026, whose grid starts on Monday 28 September. */
  function october(container: HTMLElement, day: number): HTMLButtonElement {
    return days(container)[day + 2];
  }

  function applyButton(container: HTMLElement): HTMLButtonElement {
    return container.querySelector('[data-role="apply"]') as HTMLButtonElement;
  }

  it('should show the translated select label without a value', () => {
    const { container } = render(<SmartDateRangePreset />);

    expect(trigger(container)).toHaveTextContent('wybierz');
  });

  it('should show the range on the trigger', () => {
    const { container } = render(<SmartDateRangePreset value={RANGE} />);

    expect(trigger(container)).toHaveTextContent('2026-04-01 - 2026-04-07');
  });

  it('should not render the popover until the trigger is clicked', () => {
    render(<SmartDateRangePreset />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open the popover with weekday headers and a day grid', () => {
    const { container } = render(<SmartDateRangePreset />);

    fireEvent.click(trigger(container));

    expect(
      screen.getByRole('dialog', { name: 'Select date range' }),
    ).toHaveTextContent('Mo');
    expect(days(container)).toHaveLength(35);
    expect(october(container, 1)).toHaveTextContent('1');
  });

  it('should open on the current month without a value', () => {
    const { container } = render(<SmartDateRangePreset />);

    fireEvent.click(trigger(container));

    expect(container.querySelector('[data-role="month"]')).toHaveValue('9');
    expect(container.querySelector('[data-role="year"]')).toHaveValue('2026');
  });

  it('should open on the month of the range start', () => {
    const { container } = render(<SmartDateRangePreset value={RANGE} />);

    fireEvent.click(trigger(container));

    expect(container.querySelector('[data-role="month"]')).toHaveValue('3');
  });

  it('should mark the range of the value when opened', () => {
    const { container } = render(<SmartDateRangePreset value={RANGE} />);

    fireEvent.click(trigger(container));

    // April 2026 starts on a Wednesday: the grid opens on Monday 30 March.
    expect(days(container)[2]).toHaveClass('smart:bg-blue-600');
    expect(days(container)[8]).toHaveClass('smart:bg-blue-600');
    expect(days(container)[5].parentElement).toHaveClass('smart:bg-blue-100');
  });

  it('should disable apply until a start date is picked', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    expect(applyButton(container)).toBeDisabled();

    fireEvent.click(october(container, 3));

    expect(applyButton(container)).toBeEnabled();
  });

  it('should emit the picked range on apply and close', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset onValueChange={onValueChange} />,
    );
    fireEvent.click(trigger(container));
    fireEvent.click(october(container, 3));
    fireEvent.click(october(container, 9));

    fireEvent.click(applyButton(container));

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-03',
      end: '2026-10-09',
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should apply the start as the end when no end is picked', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset onValueChange={onValueChange} />,
    );
    fireEvent.click(trigger(container));
    fireEvent.click(october(container, 3));

    fireEvent.click(applyButton(container));

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-03',
      end: '2026-10-03',
    });
  });

  it('should swap the ends when the second day is before the start', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset onValueChange={onValueChange} />,
    );
    fireEvent.click(trigger(container));
    fireEvent.click(october(container, 9));
    fireEvent.click(october(container, 3));

    fireEvent.click(applyButton(container));

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-03',
      end: '2026-10-09',
    });
  });

  it('should start over on a pick after a complete range', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset onValueChange={onValueChange} />,
    );
    fireEvent.click(trigger(container));
    fireEvent.click(october(container, 3));
    fireEvent.click(october(container, 9));
    fireEvent.click(october(container, 20));

    fireEvent.click(applyButton(container));

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-20',
      end: '2026-10-20',
    });
  });

  it('should band the range with rounded ends', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    fireEvent.click(october(container, 3));
    fireEvent.click(october(container, 9));

    expect(october(container, 3)).toHaveClass('smart:bg-blue-600');
    expect(october(container, 3).parentElement).toHaveClass(
      'smart:bg-blue-100',
      'smart:rounded-s-full',
    );
    expect(october(container, 9).parentElement).toHaveClass(
      'smart:rounded-e-full',
    );
    expect(october(container, 5).parentElement).toHaveClass(
      'smart:bg-blue-100',
    );
    expect(october(container, 10).parentElement).not.toHaveClass(
      'smart:bg-blue-100',
    );
  });

  it('should not band anything before an end is picked', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    fireEvent.click(october(container, 3));

    expect(october(container, 3).parentElement).not.toHaveClass(
      'smart:bg-blue-100',
    );
  });

  it('should mute the days of the adjacent months', () => {
    const { container } = render(<SmartDateRangePreset />);

    fireEvent.click(trigger(container));

    expect(days(container)[0]).toHaveClass('smart:text-gray-400');
    expect(october(container, 1)).toHaveClass('smart:text-gray-800');
  });

  it('should close without a change on cancel', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset onValueChange={onValueChange} />,
    );
    fireEvent.click(trigger(container));
    fireEvent.click(october(container, 3));

    fireEvent.click(
      container.querySelector('[data-role="cancel"]') as HTMLButtonElement,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should emit undefined when cleared', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRangePreset value={RANGE} onValueChange={onValueChange} />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Clear' }) as HTMLButtonElement,
    );

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(container.querySelector('[data-role="clear"]')).toBeInTheDocument();
  });

  it('should hide the clear button once cleared when uncontrolled', () => {
    const { container } = render(<SmartDateRangePreset defaultValue={RANGE} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(container.querySelector('[data-role="clear"]')).toBeNull();
  });

  it('should advance to the next month', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    fireEvent.click(
      container.querySelector('[data-role="next"]') as HTMLButtonElement,
    );

    expect(container.querySelector('[data-role="month"]')).toHaveValue('10');
  });

  it('should go back to the previous month', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    fireEvent.click(
      container.querySelector('[data-role="prev"]') as HTMLButtonElement,
    );

    expect(container.querySelector('[data-role="month"]')).toHaveValue('8');
  });

  it('should show the month picked in the month select', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));

    fireEvent.change(
      container.querySelector('[data-role="month"]') as HTMLSelectElement,
      { target: { value: '1' } },
    );

    // February 2026 starts on a Sunday: the grid opens on Monday 26 January.
    expect(days(container)[0]).toHaveTextContent('26');
  });

  it('should offer six years either side of the viewed year', () => {
    const { container } = render(<SmartDateRangePreset />);
    fireEvent.click(trigger(container));
    const year = container.querySelector(
      '[data-role="year"]',
    ) as HTMLSelectElement;

    fireEvent.change(year, { target: { value: '2030' } });

    expect(year).toHaveValue('2030');
    expect(year.querySelectorAll('option')).toHaveLength(13);
    expect(year.querySelector('option')).toHaveValue('2024');
  });

  it('should translate the footer buttons', () => {
    const { container } = renderEng(<SmartDateRangePreset />);

    fireEvent.click(trigger(container));

    expect(container.querySelector('[data-role="cancel"]')).toHaveTextContent(
      'cancel',
    );
    expect(applyButton(container)).toHaveTextContent('select');
  });

  it('should apply className to the root element', () => {
    const { container } = render(<SmartDateRangePreset className="extra" />);

    expect(container.firstElementChild).toHaveClass(
      'smart:relative',
      'smart:inline-block',
      'extra',
    );
  });
});

describe('@smartsoft001/react: SmartDateRange', () => {
  const RANGE: IDateRange = { start: '2026-04-01', end: '2026-04-07' };

  function presetTrigger(container: HTMLElement): HTMLButtonElement {
    return container.querySelector(
      '[data-role="trigger"]',
    ) as HTMLButtonElement;
  }

  /** Opens the preset, picks 3-9 October 2026 and applies it. */
  function applyOctoberRange(container: HTMLElement): void {
    fireEvent.click(presetTrigger(container));
    const days =
      container.querySelectorAll<HTMLButtonElement>('[data-role="day"]');
    fireEvent.click(days[5]);
    fireEvent.click(days[11]);
    fireEvent.click(
      container.querySelector('[data-role="apply"]') as HTMLButtonElement,
    );
  }

  it('should render the standard variant by default', () => {
    const { container } = render(<SmartDateRange value={RANGE} />);

    expect(container.querySelector('[data-role="trigger"]')).toBeNull();
    expect(container.querySelector('button')).toHaveTextContent(
      '2026-04-01 - 2026-04-07',
    );
  });

  it('should render the preset variant', () => {
    const { container } = render(
      <SmartDateRange variant="preset" value={RANGE} />,
    );

    expect(presetTrigger(container)).toHaveTextContent(
      '2026-04-01 - 2026-04-07',
    );
  });

  it('should pass className to the variant root', () => {
    const { container } = render(
      <SmartDateRange variant="preset" className="extra" />,
    );

    expect(container.firstElementChild).toHaveClass('extra');
  });

  it('should keep a two-way binding in sync with the parent state', () => {
    function Host() {
      const [range, setRange] = useState<IDateRange | undefined>();

      return (
        <>
          <span data-testid="state">
            {range ? range.start + '|' + range.end : 'none'}
          </span>
          <SmartDateRange
            variant="preset"
            value={range}
            onValueChange={setRange}
          />
        </>
      );
    }
    const { container } = render(<Host />);

    applyOctoberRange(container);

    expect(screen.getByTestId('state')).toHaveTextContent(
      '2026-10-03|2026-10-09',
    );
  });

  it('should show the select label once the parent resets the value', () => {
    const { container, rerender } = render(
      <SmartDateRange variant="preset" value={RANGE} />,
    );

    rerender(<SmartDateRange variant="preset" value={undefined} />);

    expect(presetTrigger(container)).toHaveTextContent('wybierz');
  });

  it('should show the value of a bound control', () => {
    const control = new SmartFormControl<IDateRange | null>(RANGE);

    const { container } = render(
      <SmartDateRange variant="preset" control={control} />,
    );

    expect(presetTrigger(container)).toHaveTextContent(
      '2026-04-01 - 2026-04-07',
    );
  });

  it('should show a value written to the bound control', () => {
    const control = new SmartFormControl<IDateRange | null>(null);
    const { container } = render(
      <SmartDateRange variant="preset" control={control} />,
    );

    act(() => control.setValue(RANGE));

    expect(presetTrigger(container)).toHaveTextContent(
      '2026-04-01 - 2026-04-07',
    );
  });

  it('should set an applied range on the bound control and mark it dirty and touched', () => {
    const control = new SmartFormControl<IDateRange | null>(null);
    const { container } = render(
      <SmartDateRange variant="preset" control={control} />,
    );

    applyOctoberRange(container);

    expect(control.value).toEqual({ start: '2026-10-03', end: '2026-10-09' });
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should clear the bound control', () => {
    const control = new SmartFormControl<IDateRange | null>(RANGE);
    render(<SmartDateRange variant="preset" control={control} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(control.value).toBeUndefined();
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('should still call onValueChange when bound to a control', () => {
    const control = new SmartFormControl<IDateRange | null>(null);
    const onValueChange = jest.fn();
    const { container } = render(
      <SmartDateRange
        variant="preset"
        control={control}
        onValueChange={onValueChange}
      />,
    );

    applyOctoberRange(container);

    expect(onValueChange).toHaveBeenCalledWith({
      start: '2026-10-03',
      end: '2026-10-09',
    });
  });
});

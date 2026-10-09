import { fireEvent, render } from '@testing-library/react';

import { CalendarCustomExample } from './custom.example';

describe('docs-examples-react: CalendarCustomExample', () => {
  function setup() {
    const { container } = render(<CalendarCustomExample />);

    const days = () =>
      Array.from(
        container.querySelectorAll<HTMLButtonElement>('.docs-calendar__day'),
      );
    const dayOfMonth = (label: string) =>
      days().filter(
        (day) =>
          !day.classList.contains('docs-calendar__day--outside') &&
          day.textContent?.startsWith(label),
      )[0];
    const title = () => container.querySelector('.docs-calendar__title');

    return { container, days, dayOfMonth, title };
  }

  it('should render the custom calendar for the reference month', () => {
    const { container, days, title } = setup();

    expect(container.querySelector('.docs-calendar')).not.toBeNull();
    expect(days()).toHaveLength(42);
    expect(title()).toHaveTextContent('January 2026');
    expect(container.querySelector('.calendar')).toBeNull();
  });

  it('should render the events of a day inside its cell', () => {
    const { dayOfMonth } = setup();

    expect(dayOfMonth('15')).toHaveTextContent('Design review');
  });

  it('should mark the clicked day as selected', () => {
    const { dayOfMonth } = setup();

    fireEvent.click(dayOfMonth('22'));

    expect(dayOfMonth('22')).toHaveAttribute('data-selected', 'true');
  });

  it('should move to the next month when the toolbar next button is clicked', () => {
    const { container, title } = setup();

    fireEvent.click(
      container.querySelector('.docs-calendar__next') as HTMLButtonElement,
    );

    expect(title()).toHaveTextContent('February 2026');
  });
});

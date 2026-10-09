import { fireEvent, render, screen } from '@testing-library/react';

import { DateRangeCustomExample } from './custom.example';

describe('docs-examples-react: DateRangeCustomExample', () => {
  function setup() {
    const { container } = render(<DateRangeCustomExample />);

    return {
      trigger: container.querySelector(
        '.docs-date-range__trigger',
      ) as HTMLButtonElement,
      panel: () => container.querySelector('.docs-date-range__panel'),
    };
  }

  it('should show the range bound by the parent on the custom trigger', () => {
    const { trigger } = setup();

    expect(trigger).toHaveTextContent('2026-04-01 - 2026-04-07');
  });

  it('should open the panel through the hook onClick() handler', () => {
    const { trigger, panel } = setup();
    expect(panel()).toBeNull();

    fireEvent.click(trigger);

    expect(panel()).not.toBeNull();
  });

  it('should apply a preset range and close the panel', () => {
    const { trigger, panel } = setup();
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole('button', { name: 'Whole of April' }));

    expect(trigger).toHaveTextContent('2026-04-01 - 2026-04-30');
    expect(panel()).toBeNull();
  });

  it('should clear the range back to the parent through the hook onClear()', () => {
    const { trigger } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(trigger).toHaveTextContent('Pick a range');
  });
});

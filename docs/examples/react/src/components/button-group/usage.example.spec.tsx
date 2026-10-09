import { fireEvent, render, screen, within } from '@testing-library/react';

import { ButtonGroupUsageExample } from './usage.example';

describe('docs-examples-react: ButtonGroupUsageExample', () => {
  function buttons() {
    return within(screen.getByRole('group')).getAllByRole('button');
  }

  it('should render the buttons and mark the selected one as pressed', () => {
    render(<ButtonGroupUsageExample />);

    expect(buttons().map((button) => button.textContent)).toEqual([
      'Day',
      'Week',
      'Month',
    ]);
    expect(buttons()[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('should select the clicked button through the handler', () => {
    render(<ButtonGroupUsageExample />);

    fireEvent.click(buttons()[2]);

    expect(buttons()[2]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons()[1]).toHaveAttribute('aria-pressed', 'false');
  });
});

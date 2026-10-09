import { fireEvent, render, screen } from '@testing-library/react';

import { ActionPanelUsageExample } from './usage.example';

describe('docs-examples-react: ActionPanelUsageExample', () => {
  it('should render the panel from the options', () => {
    render(<ActionPanelUsageExample />);

    expect(screen.getByText('Manage subscription')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Change your plan or cancel at the end of the billing period.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Change plan' }),
    ).toBeInTheDocument();
  });

  it('should hand the clicked action id to the handler', () => {
    render(<ActionPanelUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Change plan' }));

    expect(screen.getByText('Last action: change-plan')).toBeInTheDocument();
  });
});

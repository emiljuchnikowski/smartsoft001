import { fireEvent, render, screen, within } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { TabsUsageExample } from './usage.example';

describe('docs-examples-react: TabsUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <TabsUsageExample />
      </SmartProvider>,
    );

    return within(screen.getByRole('navigation', { name: 'Account settings' }));
  }

  it('should render the tabs from the options and mark the selected one', () => {
    const nav = setup();

    expect(nav.getByRole('button', { name: /Team members/ })).toHaveTextContent(
      '4',
    );
    expect(nav.getByRole('button', { current: 'page' })).toHaveTextContent(
      'My account',
    );
  });

  it('should hand the clicked tab id to the handler and update the selection', () => {
    const nav = setup();

    fireEvent.click(nav.getByRole('button', { name: /Team members/ }));

    expect(screen.getByText('Last chosen tab: team')).toBeInTheDocument();
    expect(nav.getByRole('button', { current: 'page' })).toHaveTextContent(
      'Team members',
    );
  });
});

import { fireEvent, render, screen, within } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { VerticalNavigationUsageExample } from './usage.example';

describe('docs-examples-react: VerticalNavigationUsageExample', () => {
  function setup() {
    render(
      <SmartProvider language="eng">
        <VerticalNavigationUsageExample />
      </SmartProvider>,
    );

    return screen.getByRole('navigation', { name: 'Main' });
  }

  it('should render the items from the options and mark the current one', () => {
    const nav = setup();

    expect(nav).toHaveTextContent('Projects');
    expect(nav).toHaveTextContent('12');
    expect(
      within(nav).getByRole('button', { current: 'page' }),
    ).toHaveTextContent('Dashboard');
  });

  it('should hand the clicked item id to the handler', () => {
    const nav = setup();

    fireEvent.click(within(nav).getAllByRole('button')[1]);

    expect(screen.getByText('Last clicked item: team')).toBeInTheDocument();
  });
});

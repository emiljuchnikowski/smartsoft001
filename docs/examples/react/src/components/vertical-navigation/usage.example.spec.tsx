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
    // Act
    const nav = setup();

    // Assert
    expect(nav).toHaveTextContent('Projects');
    expect(nav).toHaveTextContent('12');
    expect(
      within(nav).getByRole('button', { current: 'page' }),
    ).toHaveTextContent('Dashboard');
  });

  it('should show the clicked item reported through onItemClick', () => {
    // Arrange
    const nav = setup();

    // Act
    fireEvent.click(within(nav).getAllByRole('button')[1]);

    // Assert
    expect(screen.getByText('Last clicked item: team')).toBeInTheDocument();
  });
});

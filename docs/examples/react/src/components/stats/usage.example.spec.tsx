import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { StatsUsageExample } from './usage.example';

describe('docs-examples-react: StatsUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <StatsUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and every stat from the options', () => {
    // Act
    const { container } = setup();

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Last 30 days' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(3);
    expect(screen.getByText('Total subscribers')).toBeInTheDocument();
    expect(screen.getByText('71,897')).toBeInTheDocument();
  });

  it('should mark the change with its trend', () => {
    // Arrange
    const { container } = setup();

    // Act
    const change = container.querySelector('[data-trend]');

    // Assert
    expect(change).toHaveAttribute('data-trend', 'up');
    expect(change).toHaveTextContent('12%');
  });
});

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
    const { container } = setup();

    expect(
      screen.getByRole('heading', { name: 'Last 30 days' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(3);
    expect(screen.getByText('Total subscribers')).toBeInTheDocument();
    expect(screen.getByText('71,897')).toBeInTheDocument();
  });

  it('should mark the change with its trend', () => {
    const { container } = setup();

    const change = container.querySelector('[data-trend]');

    expect(change).toHaveAttribute('data-trend', 'up');
    expect(change).toHaveTextContent('12%');
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DividerUsageExample } from './usage.example';

describe('docs-examples-react: DividerUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DividerUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and the action label', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Team members' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add member' }),
    ).toBeInTheDocument();
  });

  it('should position the divider from the options', () => {
    setup();

    expect(screen.getByRole('separator')).toHaveAttribute(
      'data-position',
      'left',
    );
  });

  it('should call the handler when the action is clicked', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(screen.getByText('Add member clicks: 1')).toBeInTheDocument();
  });
});

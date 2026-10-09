import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { CardUsageExample } from './usage.example';

describe('docs-examples-react: CardUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <CardUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title from the options', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Team members' }),
    ).toBeInTheDocument();
  });

  it('should render the body and footer content', () => {
    setup();

    expect(screen.getByText('4 of 10 seats used')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Invite member' }),
    ).toBeInTheDocument();
  });
});

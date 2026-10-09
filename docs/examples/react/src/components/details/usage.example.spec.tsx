import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DetailsUsageExample } from './usage.example';

describe('docs-examples-react: DetailsUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DetailsUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the item values from the options', () => {
    setup();

    expect(screen.getByText('Margot Foster')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
  });

  it('should render the email field as a mailto link', () => {
    setup();

    expect(
      screen.getByRole('link', { name: 'margot.foster@example.com' }),
    ).toHaveAttribute('href', 'mailto:margot.foster@example.com');
  });
});

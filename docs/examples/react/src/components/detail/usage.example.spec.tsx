import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DetailUsageExample } from './usage.example';

describe('docs-examples-react: DetailUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider
        language="eng"
        translations={{ MODEL: { name: 'Full name', email: 'E-mail' } }}
      >
        <DetailUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the text field value read from the item', () => {
    setup();

    expect(screen.getByText('Margot Foster')).toBeInTheDocument();
  });

  it('should render the email field as a mailto link', () => {
    setup();

    expect(
      screen.getByRole('link', { name: 'margot@example.com' }),
    ).toHaveAttribute('href', 'mailto:margot@example.com');
  });

  it('should label each field with the MODEL.<key> translation', () => {
    setup();

    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
  });
});

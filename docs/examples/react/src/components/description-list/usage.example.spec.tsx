import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { DescriptionListUsageExample } from './usage.example';

describe('docs-examples-react: DescriptionListUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <DescriptionListUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and items from the options', () => {
    const { container } = setup();

    expect(
      screen.getByRole('heading', { name: 'Applicant information' }),
    ).toBeInTheDocument();
    expect(container.querySelector('dt')).toHaveTextContent('Full name');
    expect(container.querySelector('dd')).toHaveTextContent('Margot Foster');
  });

  it('should run the handler from the item action', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(screen.getByText('Editing: email')).toBeInTheDocument();
  });
});

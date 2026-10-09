import { fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { PageHeadingUsageExample } from './usage.example';

describe('docs-examples-react: PageHeadingUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <PageHeadingUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the title and subtitle from the options', () => {
    const { container } = setup();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Back End Developer' }),
    ).toBeInTheDocument();
    expect(container.querySelector('.subtitle')).toHaveTextContent(
      'Full-time, remote',
    );
  });

  it('should render the actions slot in the actions zone', () => {
    const { container } = setup();

    expect(container.querySelector('.actions')).toContainElement(
      screen.getByRole('button', { name: 'Publish' }),
    );
  });

  it('should run the handler of an action rendered through actionsTpl', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

    expect(screen.getByText('Last action: publish')).toBeInTheDocument();
  });
});

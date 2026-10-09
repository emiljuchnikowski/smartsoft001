import { render } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { MultiColumnLayoutUsageExample } from './usage.example';

describe('docs-examples-react: MultiColumnLayoutUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <MultiColumnLayoutUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the header and navigation slots from the options', () => {
    const { container } = setup();

    expect(container.querySelector('header')).toHaveTextContent('Inbox');
    expect(container.querySelector('aside.nav')).toHaveTextContent('Drafts');
  });

  it('should render the secondary column slot from the options', () => {
    const { container } = setup();

    expect(container.querySelector('aside.secondary')).toHaveTextContent(
      '4.2 GB of 15 GB used',
    );
  });

  it('should render the children in the main column', () => {
    const { container } = setup();

    expect(container.querySelector('main')).toHaveTextContent(
      'Quarterly report is ready',
    );
  });
});

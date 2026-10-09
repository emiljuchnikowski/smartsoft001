import { render } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { ContainerUsageExample } from './usage.example';

describe('docs-examples-react: ContainerUsageExample', () => {
  function setup() {
    const { container } = render(
      <SmartProvider language="eng">
        <ContainerUsageExample />
      </SmartProvider>,
    );

    return container.querySelector('[data-mode]') as HTMLElement;
  }

  it('should apply the layout from the options', () => {
    const wrapper = setup();

    expect(wrapper).toHaveAttribute('data-mode', 'constrained');
    expect(wrapper).toHaveAttribute('data-padding', 'mobile');
  });

  it('should render the page content inside the container', () => {
    const wrapper = setup();

    expect(wrapper).toHaveTextContent('Account settings');
  });
});

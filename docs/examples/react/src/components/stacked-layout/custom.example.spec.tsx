import { render } from '@testing-library/react';

import { StackedLayoutCustomExample } from './custom.example';

describe('docs-examples-react: StackedLayoutCustomExample', () => {
  it('should render the custom layout instead of the standard one', () => {
    const { container } = render(<StackedLayoutCustomExample />);

    expect(container.querySelector('.docs-stacked-layout')).not.toBeNull();
    expect(container.querySelector('[data-container-width]')).toBeNull();
  });

  it('should render the navigation and the header from the options', () => {
    const { container } = render(<StackedLayoutCustomExample />);

    expect(
      container.querySelector('.docs-stacked-layout__nav nav'),
    ).toHaveTextContent('Dashboard');
    expect(
      container.querySelector('.docs-stacked-layout__header h1'),
    ).toHaveTextContent('Projects');
  });

  it('should turn the container width into a modifier class', () => {
    const { container } = render(<StackedLayoutCustomExample />);

    expect(container.querySelector('.docs-stacked-layout')).toHaveClass(
      'docs-stacked-layout--xl',
    );
  });

  it('should pass the children through to the custom implementation', () => {
    const { container } = render(<StackedLayoutCustomExample />);

    expect(
      container.querySelector('.docs-stacked-layout__main'),
    ).toHaveTextContent('Main content of the page.');
  });
});

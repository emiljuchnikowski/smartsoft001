import { render } from '@testing-library/react';

import { DetailCustomExample } from './custom.example';

describe('docs-examples-react: DetailCustomExample', () => {
  it('should render the custom text field instead of the built-in one', () => {
    const { container } = render(<DetailCustomExample />);

    // The built-in text field is a <p> as well: the only one is the custom.
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(container.querySelector('p')).toHaveClass('docs-detail-text');
  });

  it('should render the value read from the item under the given key', () => {
    const { container } = render(<DetailCustomExample />);

    expect(container.querySelector('.docs-detail-text')).toHaveTextContent(
      'Margot Foster',
    );
  });

  it('should append the class forwarded by SmartDetail', () => {
    const { container } = render(<DetailCustomExample />);

    expect(container.querySelector('.docs-detail-text')).toHaveClass(
      'docs-detail-text--demo',
    );
  });
});

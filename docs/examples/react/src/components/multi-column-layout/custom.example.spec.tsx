import { render } from '@testing-library/react';

import { MultiColumnLayoutCustomExample } from './custom.example';

describe('docs-examples-react: MultiColumnLayoutCustomExample', () => {
  it('should render the custom layout instead of the standard one', () => {
    const { container } = render(<MultiColumnLayoutCustomExample />);

    expect(container.querySelector('.docs-multi-column-layout')).not.toBeNull();
    expect(container.querySelector('aside.nav')).toBeNull();
  });

  it('should render the title and the slots taken from the options', () => {
    const { container } = render(<MultiColumnLayoutCustomExample />);

    expect(
      container.querySelector('.docs-multi-column-layout__title'),
    ).toHaveTextContent('Inbox');
    expect(
      container.querySelector('.docs-multi-column-layout__header'),
    ).toHaveTextContent('Unread first');
    expect(
      container.querySelector('.docs-multi-column-layout__nav'),
    ).toHaveTextContent('Drafts');
    expect(
      container.querySelector('.docs-multi-column-layout__secondary'),
    ).toHaveTextContent('Storage');
  });

  it('should render the children in the main column', () => {
    const { container } = render(<MultiColumnLayoutCustomExample />);

    expect(
      container.querySelector('.docs-multi-column-layout__main'),
    ).toHaveTextContent('Three unread conversations');
  });

  it('should turn the widths from the options into modifier classes', () => {
    const { container } = render(<MultiColumnLayoutCustomExample />);

    expect(container.querySelector('.docs-multi-column-layout')).toHaveClass(
      'docs-multi-column-layout--full',
      'docs-multi-column-layout--secondary-sm',
    );
  });
});

import { render } from '@testing-library/react';

import { SmartIconChevronDown } from '@smartsoft001/react';

import { IconUsageExample } from './usage.example';

describe('docs-examples-react: IconUsageExample', () => {
  it('should render the built-in glyph named by the name prop', () => {
    const { container } = render(<IconUsageExample />);
    const { container: chevron } = render(<SmartIconChevronDown />);

    const glyph = container.querySelector('svg:not([data-icon])');

    expect(glyph?.innerHTML).toBe(chevron.querySelector('svg')?.innerHTML);
  });

  it('should forward the class to the glyph svg', () => {
    const { container } = render(<IconUsageExample />);

    const glyph = container.querySelector('svg:not([data-icon])');

    expect(glyph).toHaveClass('smart:size-6', 'smart:text-gray-500');
  });

  it('should render the custom svg passed as a template', () => {
    const { container } = render(<IconUsageExample />);

    expect(container.querySelector('[data-icon="heart"]')).not.toBeNull();
  });
});

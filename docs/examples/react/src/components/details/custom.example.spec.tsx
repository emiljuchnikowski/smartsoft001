import { render } from '@testing-library/react';

import { DetailsCustomExample } from './custom.example';

describe('docs-examples-react: DetailsCustomExample', () => {
  it('should render the custom details instead of the standard one', () => {
    const { container } = render(<DetailsCustomExample />);

    expect(container.querySelector('dl.docs-details')).not.toBeNull();
    expect(container.querySelectorAll('dl')).toHaveLength(1);
  });

  it('should render one row per field declared with details metadata', () => {
    const { container } = render(<DetailsCustomExample />);

    expect(container.querySelectorAll('.docs-details__row')).toHaveLength(2);
  });

  it('should read each value off the item under the field key', () => {
    const { container } = render(<DetailsCustomExample />);
    const values = container.querySelectorAll('dd');

    expect(values[0]).toHaveTextContent('Margot Foster');
    expect(values[1]).toHaveTextContent('Backend Developer');
  });
});

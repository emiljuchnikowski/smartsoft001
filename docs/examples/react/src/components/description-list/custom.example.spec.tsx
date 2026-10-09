import { render } from '@testing-library/react';

import { DescriptionListCustomExample } from './custom.example';

describe('docs-examples-react: DescriptionListCustomExample', () => {
  it('should render the custom list instead of the standard one', () => {
    const { container } = render(<DescriptionListCustomExample />);

    expect(container.querySelector('.docs-description-list')).not.toBeNull();
    expect(container.querySelector('.list')).toBeNull();
  });

  it('should render one term/definition pair per item', () => {
    const { container } = render(<DescriptionListCustomExample />);

    expect(container.querySelectorAll('dt')).toHaveLength(3);
    expect(container.querySelector('dd')).toHaveTextContent('Margot Foster');
  });

  it('should render the title from the options', () => {
    const { container } = render(<DescriptionListCustomExample />);

    expect(
      container.querySelector('.docs-description-list__title'),
    ).toHaveTextContent('Applicant information');
  });
});

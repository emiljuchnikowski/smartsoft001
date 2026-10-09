import { render } from '@testing-library/react';

import { CardHeadingCustomExample } from './custom.example';

describe('docs-examples-react: CardHeadingCustomExample', () => {
  it('should render the custom heading instead of the standard one', () => {
    const { container } = render(<CardHeadingCustomExample />);

    expect(container.querySelector('.docs-card-heading')).not.toBeNull();
    expect(container.querySelector('.content')).toBeNull();
  });

  it('should render the title and description from the options', () => {
    const { container } = render(<CardHeadingCustomExample />);

    expect(
      container.querySelector('.docs-card-heading__title'),
    ).toHaveTextContent('Applicant information');
    expect(
      container.querySelector('.docs-card-heading__description'),
    ).toHaveTextContent('Personal details');
  });

  it('should append the className passed to SmartCardHeading', () => {
    const { container } = render(<CardHeadingCustomExample />);

    expect(container.querySelector('.docs-card-heading')).toHaveClass(
      'docs-card-heading--demo',
    );
  });
});

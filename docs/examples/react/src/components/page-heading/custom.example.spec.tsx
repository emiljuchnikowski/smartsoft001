import { render, screen } from '@testing-library/react';

import { PageHeadingCustomExample } from './custom.example';

describe('docs-examples-react: PageHeadingCustomExample', () => {
  it('should render the custom page heading instead of the standard one', () => {
    const { container } = render(<PageHeadingCustomExample />);

    expect(container.querySelector('.docs-page-heading')).not.toBeNull();
    expect(container.querySelector('.subtitle')).toBeNull();
  });

  it('should render the title and subtitle taken from the options', () => {
    const { container } = render(<PageHeadingCustomExample />);

    expect(
      container.querySelector('.docs-page-heading__title'),
    ).toHaveTextContent('Back End Developer');
    expect(
      container.querySelector('.docs-page-heading__subtitle'),
    ).toHaveTextContent('Full-time');
  });

  it('should render the breadcrumbs, meta and actions slots', () => {
    const { container } = render(<PageHeadingCustomExample />);

    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toHaveTextContent('Jobs');
    expect(
      container.querySelector('.docs-page-heading__meta'),
    ).toHaveTextContent('Remote');
    expect(
      container.querySelector('.docs-page-heading__actions'),
    ).toHaveTextContent('Publish');
  });

  it('should turn the presentation layout into a modifier class', () => {
    const { container } = render(<PageHeadingCustomExample />);

    expect(container.querySelector('.docs-page-heading')).toHaveClass(
      'docs-page-heading--links-right',
    );
  });
});

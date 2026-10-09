import { render, screen } from '@testing-library/react';

import { MediaObjectCustomExample } from './custom.example';

describe('docs-examples-react: MediaObjectCustomExample', () => {
  it('should render the custom media object instead of the standard one', () => {
    const { container } = render(<MediaObjectCustomExample />);

    expect(container.querySelector('article.docs-media-object')).not.toBeNull();
    expect(container.querySelector('.smart-media-object-body')).toBeNull();
  });

  it('should render the media url and alt text on the thumbnail', () => {
    render(<MediaObjectCustomExample />);

    const image = screen.getByRole('img', {
      name: 'Portrait of Lindsay Walton',
    });

    expect(image).toHaveClass('docs-media-object__media');
    expect(image.getAttribute('src')).toContain('unsplash.com');
  });

  it('should reflect the alignment and position taken from the options', () => {
    const { container } = render(<MediaObjectCustomExample />);

    const article = container.querySelector('.docs-media-object');

    expect(article).toHaveAttribute('data-alignment', 'center');
    expect(article).toHaveAttribute('data-position', 'right');
  });

  it('should append the class passed to SmartMediaObject', () => {
    const { container } = render(<MediaObjectCustomExample />);

    expect(container.querySelector('.docs-media-object')).toHaveClass(
      'docs-media-object--demo',
    );
  });

  it('should render the children in the body', () => {
    const { container } = render(<MediaObjectCustomExample />);

    expect(
      container.querySelector('.docs-media-object__body'),
    ).toHaveTextContent('Lindsay Walton');
  });
});

import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { MediaObjectUsageExample } from './usage.example';

describe('docs-examples-react: MediaObjectUsageExample', () => {
  function setup() {
    return render(
      <SmartProvider language="eng">
        <MediaObjectUsageExample />
      </SmartProvider>,
    );
  }

  it('should render the media from the props', () => {
    setup();

    const image = screen.getByRole('img', {
      name: 'Portrait of Lindsay Walton',
    });

    expect(image).toHaveAttribute(
      'src',
      'https://i.pravatar.cc/128?u=lindsay.walton',
    );
  });

  it('should apply the alignment from the options', () => {
    const { container } = setup();

    expect(container.querySelector('[data-alignment]')).toHaveAttribute(
      'data-alignment',
      'center',
    );
  });

  it('should render the body next to the media', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Lindsay Walton' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Joined the design systems team in March.'),
    ).toBeInTheDocument();
  });
});

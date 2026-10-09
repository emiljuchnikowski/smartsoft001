import { render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';

import { LoaderUsageExample } from './usage.example';

describe('docs-examples-react: LoaderUsageExample', () => {
  it('should show the spinner with the configured size and color while loading', () => {
    render(
      <SmartProvider language="eng">
        <LoaderUsageExample />
      </SmartProvider>,
    );

    const spinner = screen.getByRole('status');

    expect(spinner).toHaveClass('smart:size-8');
    expect(spinner).toHaveClass('smart:text-emerald-600');
  });

  it('should hide the spinner once loading finishes', () => {
    const { rerender } = render(
      <SmartProvider language="eng">
        <LoaderUsageExample />
      </SmartProvider>,
    );

    rerender(
      <SmartProvider language="eng">
        <LoaderUsageExample loading={false} />
      </SmartProvider>,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

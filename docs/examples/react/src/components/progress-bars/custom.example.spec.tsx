import { fireEvent, render, screen } from '@testing-library/react';

import { ProgressBarsCustomExample } from './custom.example';

describe('docs-examples-react: ProgressBarsCustomExample', () => {
  it('should render the custom progress bars instead of the standard one', () => {
    const { container } = render(<ProgressBarsCustomExample />);

    expect(container.querySelector('.docs-progress-bars')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should render one entry per step and mark the current one', () => {
    const { container } = render(<ProgressBarsCustomExample />);

    expect(
      container.querySelectorAll('.docs-progress-bars__step'),
    ).toHaveLength(3);
    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent(
      'Profile',
    );
  });

  it('should size the value bar from the options', () => {
    const { container } = render(<ProgressBarsCustomExample />);

    expect(
      container.querySelector<HTMLElement>('.docs-progress-bars__value')?.style
        .width,
    ).toBe('50%');
  });

  it('should report the clicked step through onStepClick', () => {
    render(<ProgressBarsCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: /Review/ }));

    expect(screen.getByText('Last clicked step: review')).toBeInTheDocument();
  });
});

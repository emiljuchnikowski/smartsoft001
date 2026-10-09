import { fireEvent, render, screen } from '@testing-library/react';

import { BadgeUsageExample } from './usage.example';

describe('docs-examples-react: BadgeUsageExample', () => {
  it('should render the badge text, color and dot from the props', () => {
    const { container } = render(<BadgeUsageExample />);

    const badge = container.querySelector('[data-color]');
    expect(badge).toHaveTextContent('Active');
    expect(badge).toHaveAttribute('data-color', 'green');
    expect(badge?.querySelector('.smart-badge-dot')).not.toBeNull();
  });

  it('should run the removed handler and hide the badge', () => {
    render(<BadgeUsageExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });
});

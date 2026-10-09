import { render } from '@testing-library/react';

import { AvatarUsageExample } from './usage.example';

describe('docs-examples-react: AvatarUsageExample', () => {
  it('should render the single avatar from its initials, size and shape', () => {
    const { container } = render(<AvatarUsageExample />);

    const avatar = container.querySelector('[data-size="lg"]');
    expect(avatar).toHaveTextContent('JD');
    expect(avatar).toHaveAttribute('data-shape', 'rounded');
  });

  it('should render one item per team member in the group', () => {
    const { container } = render(<AvatarUsageExample />);

    expect(container.querySelectorAll('.smart-avatar-group-item')).toHaveLength(
      3,
    );
  });

  it('should pass the group options to the group container', () => {
    const { container } = render(<AvatarUsageExample />);

    const group = container.querySelector('[data-size="sm"]');
    expect(group).toHaveAttribute('data-placeholder-type', 'initials');
    expect(group).toHaveAttribute('data-stack-direction', 'bottom-to-top');
  });
});

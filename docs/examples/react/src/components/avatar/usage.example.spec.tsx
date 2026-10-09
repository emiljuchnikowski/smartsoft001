import { render } from '@testing-library/react';

import { AvatarUsageExample } from './usage.example';

describe('docs-examples-react: AvatarUsageExample', () => {
  it('should render the single avatar from its initials, size and shape', () => {
    // Act
    const { container } = render(<AvatarUsageExample />);

    // Assert
    const avatar = container.querySelector('[data-size="lg"]');
    expect(avatar).toHaveTextContent('JD');
    expect(avatar).toHaveAttribute('data-shape', 'rounded');
  });

  it('should render one item per team member in the group', () => {
    // Act
    const { container } = render(<AvatarUsageExample />);

    // Assert
    expect(container.querySelectorAll('.smart-avatar-group-item')).toHaveLength(
      3,
    );
  });

  it('should pass the stack direction to the group container', () => {
    // Act
    const { container } = render(<AvatarUsageExample />);

    // Assert
    const group = container.querySelector('[data-size="sm"]');
    expect(group).toHaveAttribute('data-stack-direction', 'bottom-to-top');
  });
});

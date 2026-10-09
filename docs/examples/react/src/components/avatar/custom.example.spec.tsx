import { render } from '@testing-library/react';

import { AvatarCustomExample } from './custom.example';

describe('docs-examples-react: AvatarCustomExample', () => {
  it('should render the custom avatar instead of the standard one', () => {
    const { container } = render(<AvatarCustomExample />);

    const avatar = container.querySelector('.docs-avatar');
    expect(avatar).toHaveTextContent('TW');
    expect(container.querySelector('[data-size]')).toBeNull();
  });

  it('should render the notification dot at the requested position', () => {
    const { container } = render(<AvatarCustomExample />);

    expect(
      container.querySelector('.docs-avatar__notification'),
    ).toHaveAttribute('data-position', 'top');
  });

  it('should render one item per member in group mode', () => {
    const { container } = render(<AvatarCustomExample />);

    expect(container.querySelectorAll('.docs-avatar__group-item')).toHaveLength(
      3,
    );
  });

  it('should re-render with the new size class when the size changes', () => {
    const { container, rerender } = render(<AvatarCustomExample />);

    rerender(<AvatarCustomExample size="xl" />);

    expect(container.querySelector('.docs-avatar')).toHaveClass(
      'docs-avatar--xl',
    );
  });
});

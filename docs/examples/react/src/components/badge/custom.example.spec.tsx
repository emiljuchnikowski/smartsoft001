import { fireEvent, render, screen } from '@testing-library/react';

import { SmartBadge, SmartProvider } from '@smartsoft001/react';

import { BadgeCustomExample, CustomBadge } from './custom.example';

describe('docs-examples-react: BadgeCustomExample', () => {
  it('should render the custom badge instead of the standard one', () => {
    const { container } = render(<BadgeCustomExample />);

    const badge = container.querySelector('.docs-badge');
    expect(badge).toHaveTextContent('In review');
    expect(badge).toHaveAttribute('data-color', 'yellow');
    expect(badge).toHaveClass('docs-badge--md', 'docs-badge--pill');
    expect(container.querySelector('.smart-badge-text')).toBeNull();
  });

  it('should call onRemoved when the custom remove button is clicked', () => {
    const onRemoved = jest.fn();
    render(
      <SmartProvider components={{ badge: CustomBadge }}>
        <SmartBadge
          text="In review"
          options={{ withRemove: true }}
          onRemoved={onRemoved}
        />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onRemoved).toHaveBeenCalledTimes(1);
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import {
  CustomVerticalNavigation,
  VerticalNavigationCustomExample,
} from './custom.example';

describe('docs-examples-react: VerticalNavigationCustomExample', () => {
  it('should render the custom navigation instead of the standard one', () => {
    const { container } = render(<VerticalNavigationCustomExample />);

    expect(container.querySelector('.docs-vertical-nav')).toHaveClass(
      'docs-vertical-nav--with-badges',
    );
    expect(container.querySelector('.vertical-navigation')).toBeNull();
  });

  it('should render the loose items and the titled group the hook normalises', () => {
    const { container } = render(<VerticalNavigationCustomExample />);

    const groups = container.querySelectorAll('.docs-vertical-nav__group');
    const current = container.querySelector(
      '.docs-vertical-nav__item--current',
    );

    expect(groups).toHaveLength(2);
    expect(
      groups[1].querySelector('.docs-vertical-nav__group-title'),
    ).toHaveTextContent('Projects');
    expect(current).toHaveTextContent('Team');
    expect(current?.querySelector('a')).toHaveAttribute('aria-current', 'page');
  });

  it('should report a click on an item without a href through onItemClick', () => {
    const onItemClick = jest.fn();
    render(
      <CustomVerticalNavigation
        options={{
          items: [
            { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
            { id: 'new-project', label: 'New project' },
          ],
        }}
        onItemClick={onItemClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'New project' }));

    expect(onItemClick).toHaveBeenCalledWith({ itemId: 'new-project' });
  });
});

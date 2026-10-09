import { fireEvent, render, screen } from '@testing-library/react';

import {
  CustomVerticalNavigation,
  VerticalNavigationCustomExample,
} from './custom.example';

describe('docs-examples-react: VerticalNavigationCustomExample', () => {
  it('should render the custom navigation instead of the standard one', () => {
    // Act
    const { container } = render(<VerticalNavigationCustomExample />);

    // Assert
    expect(container.querySelector('.docs-vertical-nav')).toHaveClass(
      'docs-vertical-nav--with-badges',
    );
    expect(container.querySelector('.vertical-navigation')).toBeNull();
  });

  it('should render the loose items and the titled group the hook normalises', () => {
    // Arrange
    const { container } = render(<VerticalNavigationCustomExample />);

    // Act
    const groups = container.querySelectorAll('.docs-vertical-nav__group');
    const current = container.querySelector(
      '.docs-vertical-nav__item--current',
    );

    // Assert
    expect(groups).toHaveLength(2);
    expect(
      groups[1].querySelector('.docs-vertical-nav__group-title'),
    ).toHaveTextContent('Projects');
    expect(current).toHaveTextContent('Team');
    expect(current?.querySelector('a')).toHaveAttribute('aria-current', 'page');
  });

  it('should show the item reported through onItemClick', () => {
    // Arrange
    render(<VerticalNavigationCustomExample />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'New project' }));

    // Assert
    expect(
      screen.getByText('Last clicked item: new-project'),
    ).toBeInTheDocument();
  });

  it('should report a click on an item without a href through onItemClick', () => {
    // Arrange
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

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'New project' }));

    // Assert
    expect(onItemClick).toHaveBeenCalledWith({ itemId: 'new-project' });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { CustomNavbar, NavbarCustomExample } from './custom.example';

describe('docs-examples-react: NavbarCustomExample', () => {
  it('should render the custom navbar instead of the standard one', () => {
    const { container } = render(<NavbarCustomExample />);

    expect(container.querySelector('nav.docs-navbar')).not.toBeNull();
    expect(container.querySelector('.mobile-menu-toggle')).toBeNull();
  });

  it('should render one entry per item and mark the current one', () => {
    const { container } = render(<NavbarCustomExample />);

    const items = container.querySelectorAll('.docs-navbar__item');

    expect(items).toHaveLength(4);
    expect(items[0]).toHaveAttribute('aria-current', 'page');
    expect(items[1]).not.toHaveAttribute('aria-current');
  });

  it('should report the item id through onItemClick when an entry is activated', () => {
    const onItemClick = jest.fn();
    render(
      <CustomNavbar
        options={{
          items: [
            { id: 'landing', label: 'Landing' },
            { id: 'work', label: 'Work' },
          ],
        }}
        onItemClick={onItemClick}
      />,
    );

    fireEvent.click(screen.getByText('Work'));

    expect(onItemClick).toHaveBeenCalledWith({ itemId: 'work' });
  });

  it('should reveal the mobile panel when the menu button is toggled', () => {
    const { container } = render(<NavbarCustomExample />);
    expect(container.querySelector('.docs-navbar__mobile')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));

    expect(container.querySelector('.docs-navbar__mobile')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Toggle navigation' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });
});

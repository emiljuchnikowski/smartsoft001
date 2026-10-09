import { fireEvent, render, screen } from '@testing-library/react';

import { DrawerCustomExample } from './custom.example';

describe('docs-examples-react: DrawerCustomExample', () => {
  it('should render the custom drawer through SmartDrawer instead of the standard one', () => {
    const { container } = render(<DrawerCustomExample />);

    expect(container.querySelector('.docs-drawer__panel')).not.toBeNull();
    expect(container.querySelector('.drawer-overlay')).toBeNull();
  });

  it('should render the forwarded title in the custom header', () => {
    const { container } = render(<DrawerCustomExample />);

    expect(
      container.querySelector('.docs-drawer__header h2'),
    ).toHaveTextContent('Shopping cart');
  });

  it('should render the overlay because the options ask for it', () => {
    const { container } = render(<DrawerCustomExample />);

    expect(container.querySelector('.docs-drawer__overlay')).not.toBeNull();
  });

  it('should hide the panel when the custom close button is clicked', () => {
    const { container } = render(<DrawerCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(container.querySelector('.docs-drawer__panel')).toBeNull();
  });
});

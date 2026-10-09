import { fireEvent, render, screen } from '@testing-library/react';

import { SmartBreadcrumbs, SmartProvider } from '@smartsoft001/react';

import { BreadcrumbsCustomExample, CustomBreadcrumbs } from './custom.example';

describe('docs-examples-react: BreadcrumbsCustomExample', () => {
  it('should render the custom breadcrumbs instead of the standard ones', () => {
    const { container } = render(<BreadcrumbsCustomExample />);

    const links = container.querySelectorAll('.docs-breadcrumbs__link');
    expect(container.querySelector('nav.docs-breadcrumbs')).not.toBeNull();
    expect(links).toHaveLength(3);
    expect(links[2]).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('.breadcrumbs-list')).toBeNull();
  });

  it('should call onItemClick with the item id when a crumb is clicked', () => {
    const onItemClick = jest.fn();
    render(
      <SmartProvider components={{ breadcrumbs: CustomBreadcrumbs }}>
        <SmartBreadcrumbs
          options={{ items: [{ id: 'home', label: 'Home', href: '#' }] }}
          onItemClick={onItemClick}
        />
      </SmartProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(onItemClick).toHaveBeenCalledWith({ itemId: 'home' });
  });
});

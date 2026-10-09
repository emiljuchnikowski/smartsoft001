import { fireEvent, render, screen } from '@testing-library/react';

import { CustomTabs, TabsCustomExample } from './custom.example';

describe('docs-examples-react: TabsCustomExample', () => {
  it('should render the custom tabs instead of the standard one', () => {
    const { container } = render(<TabsCustomExample />);

    expect(container.querySelector('.docs-tabs')).not.toBeNull();
    expect(container.querySelector('.tabs')).toBeNull();
  });

  it('should mark the default selection as the current tab', () => {
    const { container } = render(<TabsCustomExample />);

    const current = container.querySelector('.docs-tabs__tab--current');

    expect(current).toHaveTextContent('Billing');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('should move the current tab to a clicked one', () => {
    const { container } = render(<TabsCustomExample />);

    fireEvent.click(screen.getByRole('button', { name: /Members/ }));

    expect(
      container.querySelector('.docs-tabs__tab--current'),
    ).toHaveTextContent('Members');
  });

  it('should report the clicked tab through onTabChange and onSelectedIdChange', () => {
    const onTabChange = jest.fn();
    const onSelectedIdChange = jest.fn();
    render(
      <CustomTabs
        options={{
          items: [
            { id: 'account', label: 'Account' },
            { id: 'members', label: 'Members' },
          ],
        }}
        selectedId="account"
        onSelectedIdChange={onSelectedIdChange}
        onTabChange={onTabChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Members' }));

    expect(onTabChange).toHaveBeenCalledWith({ tabId: 'members' });
    expect(onSelectedIdChange).toHaveBeenCalledWith('members');
  });
});

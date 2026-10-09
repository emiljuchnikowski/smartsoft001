import { fireEvent, render, screen } from '@testing-library/react';

import { SmartDropdown, SmartProvider } from '@smartsoft001/react';

import { CustomDropdown, DropdownCustomExample } from './custom.example';

describe('docs-examples-react: DropdownCustomExample', () => {
  it('should render the custom dropdown instead of the standard one', () => {
    const { container } = render(<DropdownCustomExample />);

    expect(container.querySelector('.docs-dropdown')).not.toBeNull();
    expect(container.querySelector('.smart-dropdown-trigger')).toBeNull();
    expect(
      container.querySelector('.docs-dropdown__trigger'),
    ).toHaveTextContent('Actions');
  });

  it('should keep the menu closed until the trigger is clicked', () => {
    const { container } = render(<DropdownCustomExample />);
    expect(container.querySelector('.docs-dropdown__menu')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    expect(container.querySelectorAll('.docs-dropdown__item')).toHaveLength(2);
    expect(container.querySelector('.docs-dropdown__divider')).not.toBeNull();
  });

  it('should report the selected item through onSelectedItem and close the menu', () => {
    const onSelectedItem = jest.fn();
    const { container } = render(
      <SmartProvider components={{ dropdown: CustomDropdown }}>
        <SmartDropdown
          items={[{ id: 'newsletter', label: 'Newsletter' }]}
          triggerLabel="Actions"
          onSelectedItem={onSelectedItem}
        />
      </SmartProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Newsletter' }));

    expect(onSelectedItem).toHaveBeenCalledWith({ itemId: 'newsletter' });
    expect(container.querySelector('.docs-dropdown__menu')).toBeNull();
  });
});

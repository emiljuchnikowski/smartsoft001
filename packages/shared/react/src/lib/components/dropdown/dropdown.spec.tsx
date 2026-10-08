import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartDropdown } from './dropdown';
import { SmartDropdownProps } from './dropdown.types';
import { SmartDropdownPreset } from './preset/dropdown-preset';
import { SmartDropdownStandard } from './standard/dropdown-standard';
import { useDropdown } from './use-dropdown';
import { IDropdownItem } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartDropdown', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartDropdown triggerLabel="Options" />);

      expect(
        container.querySelector('button.smart-dropdown-trigger'),
      ).toHaveTextContent('Options');
    });

    it('should render the children in the trigger without a triggerLabel', () => {
      render(
        <SmartDropdown>
          <b>Projected</b>
        </SmartDropdown>,
      );

      expect(screen.getByRole('button', { name: 'Projected' })).toHaveClass(
        'smart-dropdown-trigger',
      );
    });

    it('should pass onSelectedItem to the implementation', () => {
      const onSelectedItem = jest.fn();
      render(
        <SmartDropdown
          items={[{ id: 'a', label: 'Alpha' }]}
          open
          onSelectedItem={onSelectedItem}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));

      expect(onSelectedItem).toHaveBeenCalledWith({ itemId: 'a' });
    });

    it('should render the implementation registered as components.dropdown', () => {
      const Custom = ({ triggerLabel }: SmartDropdownProps) => (
        <div data-testid="custom">{triggerLabel}</div>
      );

      render(
        <SmartProvider components={{ dropdown: Custom }}>
          <SmartDropdown triggerLabel="Options" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Options');
    });
  });

  describe('useDropdown', () => {
    it('should close the menu on close()', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useDropdown({ defaultOpen: true, onOpenChange }),
      );

      act(() => result.current.close());

      expect(result.current.open).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('standard', () => {
    const items: IDropdownItem[] = [
      { id: 'a', label: 'Alpha' },
      { id: 'sep', label: '', divider: true },
      { id: 'b', label: 'Beta', disabled: true },
    ];

    const trigger = (container: HTMLElement) =>
      container.querySelector('button.smart-dropdown-trigger') as HTMLElement;

    it('should render the trigger with the triggerLabel text', () => {
      const { container } = render(
        <SmartDropdownStandard triggerLabel="Open menu" />,
      );

      expect(trigger(container)).toHaveTextContent('Open menu');
    });

    it('should render the children in the trigger without a triggerLabel', () => {
      const { container } = render(
        <SmartDropdownStandard>
          <b>Projected</b>
        </SmartDropdownStandard>,
      );

      expect(trigger(container).querySelector('b')).toHaveTextContent(
        'Projected',
      );
    });

    it('should not render the menu when closed', () => {
      render(<SmartDropdownStandard items={items} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render the menu when open', () => {
      render(<SmartDropdownStandard items={items} open />);

      expect(screen.getByRole('menu').tagName).toBe('UL');
    });

    it('should reflect open in aria-expanded on the trigger', () => {
      const { container, rerender } = render(
        <SmartDropdownStandard items={items} open={false} />,
      );
      expect(trigger(container)).toHaveAttribute('aria-expanded', 'false');

      rerender(<SmartDropdownStandard items={items} open />);

      expect(trigger(container)).toHaveAttribute('aria-expanded', 'true');
    });

    it('should toggle the menu on trigger clicks when uncontrolled', () => {
      const { container } = render(<SmartDropdownStandard items={items} />);

      fireEvent.click(trigger(container));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(trigger(container));

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should call onOpenChange with the toggled value', () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <SmartDropdownStandard open onOpenChange={onOpenChange} />,
      );

      fireEvent.click(trigger(container));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should open from defaultOpen when uncontrolled', () => {
      render(<SmartDropdownStandard items={items} defaultOpen />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should render the items as menuitem buttons', () => {
      const { container } = render(
        <SmartDropdownStandard items={items} open />,
      );

      const buttons = container.querySelectorAll('li[role="menuitem"] button');

      expect(Array.from(buttons).map((b) => b.textContent)).toEqual([
        'Alpha',
        'Beta',
      ]);
    });

    it('should render divider items as separators', () => {
      render(<SmartDropdownStandard items={items} open />);

      expect(screen.getAllByRole('separator')).toHaveLength(1);
    });

    it('should disable the disabled items', () => {
      render(<SmartDropdownStandard items={items} open />);

      expect(screen.getByRole('button', { name: 'Beta' })).toBeDisabled();
    });

    it('should call onSelectedItem with the item id', () => {
      const onSelectedItem = jest.fn();
      render(
        <SmartDropdownStandard
          items={items}
          open
          onSelectedItem={onSelectedItem}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));

      expect(onSelectedItem).toHaveBeenCalledWith({ itemId: 'a' });
    });

    it('should close after selecting an item', () => {
      const onOpenChange = jest.fn();
      render(
        <SmartDropdownStandard
          items={items}
          defaultOpen
          onOpenChange={onOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render the headerLabel for the with-header variant', () => {
      const { container } = render(
        <SmartDropdownStandard
          items={items}
          open
          options={{ variant: 'with-header', headerLabel: 'My Menu' }}
        />,
      );

      expect(
        container.querySelector('li.smart-dropdown-header'),
      ).toHaveTextContent('My Menu');
    });

    it('should not render the headerLabel for other variants', () => {
      const { container } = render(
        <SmartDropdownStandard
          items={items}
          open
          options={{ variant: 'simple', headerLabel: 'My Menu' }}
        />,
      );

      expect(container.querySelector('li.smart-dropdown-header')).toBeNull();
    });

    it('should apply className on the wrapper div', () => {
      const { container } = render(
        <SmartDropdownStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const items: IDropdownItem[] = [
      { id: 'a', label: 'Newsletter', icon: 'N' },
      { id: 'b', label: 'Purchases', icon: 'P' },
      { id: 'sep', label: '', divider: true },
      { id: 'c', label: 'Downloads', disabled: true },
    ];

    const trigger = () =>
      screen.getByRole('button', { name: 'Actions' }) as HTMLButtonElement;

    it('should render the trigger label', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" />);

      expect(trigger()).toHaveTextContent('Actions');
    });

    it('should fall back to the Actions text and Dropdown label', () => {
      render(<SmartDropdownPreset items={items} />);

      const button = screen.getByRole('button', { name: 'Dropdown' });

      expect(button).toHaveTextContent('Actions');
    });

    it('should be closed by default with the menu ARIA on the trigger', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
      expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should open the menu on trigger click', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" />);

      fireEvent.click(trigger());

      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-orientation',
        'vertical',
      );
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    });

    it('should toggle the menu closed on a second trigger click', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" />);

      fireEvent.click(trigger());
      fireEvent.click(trigger());

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should rotate the chevron while open', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" open />);

      expect(trigger().querySelector('svg')).toHaveClass('smart:rotate-180');
    });

    it('should render the visible (non-divider) items as menuitems', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" open />);

      expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    });

    it('should call onSelectedItem and close when an item is clicked', () => {
      const onSelectedItem = jest.fn();
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          defaultOpen
          onSelectedItem={onSelectedItem}
        />,
      );

      fireEvent.click(screen.getByRole('menuitem', { name: 'Newsletter' }));

      expect(onSelectedItem).toHaveBeenCalledWith({ itemId: 'a' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should disable the items flagged as disabled', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" open />);

      expect(
        screen.getByRole('menuitem', { name: 'Downloads' }),
      ).toBeDisabled();
    });

    it('should default to the simple variant trigger (solid surface)', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" />);

      expect(trigger()).toHaveClass('smart:bg-white', 'smart:border');
    });

    it('should render a borderless trigger for the minimal variant', () => {
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          options={{ variant: 'minimal' }}
        />,
      );

      expect(trigger()).not.toHaveClass('smart:bg-white');
    });

    it('should apply divide classes on the menu for the with-dividers variant', () => {
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          options={{ variant: 'with-dividers' }}
          open
        />,
      );

      expect(screen.getByRole('menu')).toHaveClass('smart:divide-y');
    });

    it('should split the items into groups at dividers for with-dividers', () => {
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          options={{ variant: 'with-dividers' }}
          open
        />,
      );

      expect(
        screen.getByRole('menu').querySelectorAll('[data-role="group"]'),
      ).toHaveLength(2);
    });

    it('should skip empty groups around leading and repeated dividers', () => {
      render(
        <SmartDropdownPreset
          items={[
            { id: 's1', label: '', divider: true },
            { id: 'a', label: 'Alpha' },
            { id: 's2', label: '', divider: true },
            { id: 's3', label: '', divider: true },
            { id: 'b', label: 'Beta' },
          ]}
          options={{ variant: 'with-dividers' }}
          open
        />,
      );

      const groups = screen
        .getByRole('menu')
        .querySelectorAll('[data-role="group"]');

      expect(Array.from(groups).map((g) => g.textContent)).toEqual([
        'Alpha',
        'Beta',
      ]);
    });

    it('should keep a single group for the other variants', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" open />);

      expect(
        screen.getByRole('menu').querySelectorAll('[data-role="group"]'),
      ).toHaveLength(1);
    });

    it('should render the item icons for the with-icons variant', () => {
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          options={{ variant: 'with-icons' }}
          open
        />,
      );

      const icon = screen
        .getByRole('menuitem', { name: 'Newsletter' })
        .querySelector('span');

      expect(icon).toHaveTextContent('N');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render the item icons for the simple variant', () => {
      render(<SmartDropdownPreset items={items} triggerLabel="Actions" open />);

      expect(
        screen
          .getByRole('menuitem', { name: 'Newsletter' })
          .querySelector('span'),
      ).toBeNull();
    });

    it('should render a header block for the with-header variant', () => {
      render(
        <SmartDropdownPreset
          items={items}
          triggerLabel="Actions"
          options={{ variant: 'with-header', headerLabel: 'james@site.com' }}
          open
        />,
      );

      expect(screen.getByRole('menu')).toHaveTextContent('james@site.com');
    });

    it('should apply className on the container', () => {
      const { container } = render(
        <SmartDropdownPreset items={items} className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:relative',
        'my-extra-class',
      );
    });
  });
});

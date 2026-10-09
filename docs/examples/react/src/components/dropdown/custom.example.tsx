// #region usage
import {
  cn,
  IDropdownItem,
  SmartDropdown,
  SmartDropdownProps,
  SmartProvider,
  useDropdown,
} from '@smartsoft001/react';

export function CustomDropdown(props: SmartDropdownProps) {
  const { items = [], triggerLabel, className } = props;
  // useDropdown keeps the shared behaviour: the open state, toggle() and
  // selectItem(), which reports onSelectedItem and closes the menu.
  const { open, toggle, selectItem } = useDropdown(props);

  return (
    <div className={cn('docs-dropdown', className)}>
      <button
        type="button"
        className="docs-dropdown__trigger"
        aria-expanded={open}
        onClick={toggle}
      >
        {triggerLabel}
      </button>

      {open && (
        <ul className="docs-dropdown__menu" role="menu">
          {items.map((item) =>
            item.divider ? (
              <li
                key={item.id}
                className="docs-dropdown__divider"
                role="separator"
              />
            ) : (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="docs-dropdown__item"
                  disabled={item.disabled}
                  onClick={() => selectItem(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { dropdown: CustomDropdown };

const items: IDropdownItem[] = [
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'sep', label: '', divider: true },
  { id: 'downloads', label: 'Downloads' },
];

export function DropdownCustomExample() {
  // Every SmartDropdown below the provider renders CustomDropdown.
  return (
    <SmartProvider components={components}>
      <SmartDropdown items={items} triggerLabel="Actions" />
    </SmartProvider>
  );
}
// #endregion

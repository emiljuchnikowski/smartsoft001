import { SmartDropdownProps } from '../dropdown.types';
import { useDropdown } from '../use-dropdown';

/** The default dropdown rendering (`<smart-dropdown-standard>`). */
export function SmartDropdownStandard(props: SmartDropdownProps) {
  const { items = [], triggerLabel, options, className, children } = props;
  const { open, toggle, selectItem } = useDropdown(props);

  return (
    <div className={className}>
      <button
        type="button"
        className="smart-dropdown-trigger"
        aria-expanded={open}
        onClick={toggle}
      >
        {triggerLabel ? triggerLabel : children}
      </button>
      {open && (
        <ul role="menu">
          {options?.variant === 'with-header' && options?.headerLabel && (
            <li role="presentation" className="smart-dropdown-header">
              {options.headerLabel}
            </li>
          )}
          {items.map((item) =>
            item.divider ? (
              <li key={item.id} role="separator" />
            ) : (
              <li key={item.id} role="menuitem">
                <button
                  type="button"
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

import { useMemo } from 'react';

import { IDropdownItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartDropdownProps } from '../dropdown.types';
import { useDropdown } from '../use-dropdown';
import {
  DROPDOWN_CONTAINER,
  DROPDOWN_GROUP,
  DROPDOWN_HEADER,
  DROPDOWN_HEADER_TEXT,
  DROPDOWN_ICON,
  DROPDOWN_ITEM,
  getDropdownChevronClasses,
  getDropdownMenuClasses,
  getDropdownTriggerClasses,
  SmartDropdownPresetVariant,
} from './preset-classes';

/**
 * Visible (non-divider) items, split into sections at each `divider` item when
 * the with-dividers variant is active so each group renders in its own block.
 */
function toGroups(
  items: IDropdownItem[],
  variant: SmartDropdownPresetVariant,
): IDropdownItem[][] {
  if (variant !== 'with-dividers') {
    return [items.filter((item) => !item.divider)];
  }

  const result: IDropdownItem[][] = [];
  let current: IDropdownItem[] = [];
  for (const item of items) {
    if (item.divider) {
      if (current.length) result.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  if (current.length) result.push(current);
  return result;
}

/**
 * Styled dropdown variation (preset). Register it as `components.dropdown` on
 * `SmartProvider` to restyle every `<SmartDropdown>`, or render it directly.
 *
 * Open/close is driven by the shared `open` state and a click toggle; Preline's
 * JS plugin is NOT used, but its visual classes and ARIA (`aria-haspopup` /
 * `aria-expanded`) are preserved. Supports the shared `SmartDropdownVariant`
 * set: `simple`, `with-dividers`, `with-icons`, `with-header` and a borderless
 * `minimal` trigger (defaults to `simple`). The trigger shows `triggerLabel`
 * (`Actions` without it); `children` are not rendered.
 */
export function SmartDropdownPreset(props: SmartDropdownProps) {
  const { items = [], triggerLabel, options, className } = props;
  const { open, toggle, selectItem } = useDropdown(props);

  const variant = options?.variant ?? 'simple';
  const headerLabel = options?.headerLabel;
  const showIcons = variant === 'with-icons' || variant === 'with-header';
  const groups = useMemo(() => toGroups(items, variant), [items, variant]);

  return (
    <div className={cn(DROPDOWN_CONTAINER, className)}>
      <button
        type="button"
        className={getDropdownTriggerClasses(variant)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel ?? 'Dropdown'}
        onClick={toggle}
      >
        {triggerLabel ?? 'Actions'}
        <svg
          className={getDropdownChevronClasses(open)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className={getDropdownMenuClasses(variant)}
          role="menu"
          aria-orientation="vertical"
        >
          {variant === 'with-header' && headerLabel && (
            <div className={DROPDOWN_HEADER}>
              <p className={DROPDOWN_HEADER_TEXT}>{headerLabel}</p>
            </div>
          )}
          {groups.map((group, index) => (
            <div key={index} data-role="group" className={DROPDOWN_GROUP}>
              {group.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={DROPDOWN_ITEM}
                  disabled={item.disabled}
                  onClick={() => selectItem(item.id)}
                >
                  {showIcons && item.icon && (
                    <span className={DROPDOWN_ICON} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

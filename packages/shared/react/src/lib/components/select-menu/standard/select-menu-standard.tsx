import type { ChangeEvent } from 'react';

import { SmartSelectMenuProps } from '../select-menu.types';
import { useSelectMenu } from '../use-select-menu';

/**
 * The default select menu (`<smart-select-menu-standard>`): a native
 * `<select>`. The chosen option is matched back to its item, so a numeric
 * item value stays a number.
 */
export function SmartSelectMenuStandard(props: SmartSelectMenuProps) {
  const { disabled = false, options, className } = props;
  const { value, select } = useSelectMenu(props);
  const items = options?.items ?? [];

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const raw = event.target.value;
    const match = items.find((i) => String(i.value) === raw);
    select(match ? match.value : raw);
  };

  return (
    <div className={className}>
      <div className="select-menu">
        <select
          disabled={disabled}
          aria-label={options?.ariaLabel}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={onChange}
        >
          {options?.placeholder && (
            <option value="" disabled>
              {options.placeholder}
            </option>
          )}
          {items.map((item) => (
            <option
              key={item.value}
              value={item.value}
              disabled={!!item.disabled}
              aria-label={item.ariaLabel}
            >
              {item.label}
            </option>
          ))}
        </select>
        {items.length === 0 && options?.emptyTpl && (
          <div className="empty">{options.emptyTpl}</div>
        )}
      </div>
    </div>
  );
}

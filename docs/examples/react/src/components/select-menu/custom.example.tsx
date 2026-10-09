// #region usage
import { useState } from 'react';

import {
  cn,
  ISelectMenuOptions,
  SelectMenuValue,
  SmartProvider,
  SmartSelectMenu,
  SmartSelectMenuProps,
  useSelectMenu,
} from '@smartsoft001/react';

export function CustomSelectMenu(props: SmartSelectMenuProps) {
  const { options, className, disabled = false } = props;
  // useSelectMenu keeps the value (controlled or internal) and select(),
  // which ignores the choice while disabled.
  const { value, select } = useSelectMenu(props);
  const [expanded, setExpanded] = useState(false);

  const items = options?.items ?? [];
  const currentLabel = items.find((item) => item.value === value)?.label;

  const toggle = () => {
    if (disabled) return;
    setExpanded((open) => !open);
  };

  const pick = (next: SelectMenuValue, itemDisabled: boolean) => {
    if (itemDisabled) return;
    select(next);
    setExpanded(false);
  };

  return (
    <div className={cn('docs-select-menu', className)}>
      <button
        type="button"
        className="docs-select-menu__trigger"
        disabled={disabled}
        aria-expanded={expanded}
        aria-label={options?.ariaLabel}
        onClick={toggle}
      >
        {currentLabel ?? options?.placeholder ?? 'Select'}
      </button>

      {expanded && (
        <ul className="docs-select-menu__list" role="listbox">
          {items.map((item) => (
            <li
              key={item.value}
              role="option"
              className="docs-select-menu__option"
              aria-selected={value === item.value}
              aria-disabled={item.disabled ?? false}
              onClick={() => pick(item.value, item.disabled ?? false)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { 'select-menu': CustomSelectMenu };

const options: ISelectMenuOptions = {
  placeholder: 'Choose a country',
  ariaLabel: 'Country',
  items: [
    { value: 'pl', label: 'Poland' },
    { value: 'de', label: 'Germany' },
    { value: 'us', label: 'United States' },
  ],
};

export function SelectMenuCustomExample() {
  const [selected, setSelected] = useState<SelectMenuValue>(null);

  // Every SmartSelectMenu below the provider renders CustomSelectMenu.
  return (
    <SmartProvider components={components}>
      <SmartSelectMenu
        options={options}
        value={selected}
        onValueChange={setSelected}
      />
    </SmartProvider>
  );
}
// #endregion

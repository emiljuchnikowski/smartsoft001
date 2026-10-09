// #region usage
import { useState } from 'react';

import {
  IDropdownItem,
  IDropdownOptions,
  SmartDropdown,
} from '@smartsoft001/react';

const options: IDropdownOptions = {
  variant: 'with-header',
  headerLabel: 'Signed in as tom@example.com',
};

const items: IDropdownItem[] = [
  { id: 'settings', label: 'Account settings' },
  { id: 'support', label: 'Support' },
  { id: 'license', label: 'License', disabled: true },
  { id: 'divider', label: '', divider: true },
  { id: 'sign-out', label: 'Sign out' },
];

export function DropdownUsageExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <SmartDropdown
        triggerLabel="Options"
        items={items}
        options={options}
        onSelectedItem={({ itemId }) => setSelectedId(itemId)}
      />
      {selectedId && <p>Selected: {selectedId}</p>}
    </>
  );
}
// #endregion

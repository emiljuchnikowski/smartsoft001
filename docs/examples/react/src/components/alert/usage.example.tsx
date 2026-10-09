// #region usage
import { useState } from 'react';

import {
  IAlertButton,
  IAlertOptions,
  SmartAlert,
  SmartButton,
} from '@smartsoft001/react';

const options: IAlertOptions = {
  header: 'Delete file?',
  message: 'report-2026.pdf will be removed. This cannot be undone.',
  buttons: [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Delete', role: 'destructive' },
  ],
};

export function AlertUsageExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastRole, setLastRole] = useState<string | null>(null);

  const onDismissed = (button: IAlertButton | null) => {
    setLastRole(button?.role ?? null);
    setIsOpen(false);
  };

  return (
    <>
      <SmartButton options={{ click: () => setIsOpen(true) }}>
        Delete file
      </SmartButton>

      {isOpen && <SmartAlert options={options} onDismissed={onDismissed} />}

      {lastRole && <p>Last choice: {lastRole}</p>}
    </>
  );
}
// #endregion

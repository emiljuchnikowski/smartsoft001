// #region usage
import { useState } from 'react';

import { IAlertButton, IAlertOptions, SmartAlert } from '@smartsoft001/react';

const options: IAlertOptions = {
  header: 'Delete file?',
  message: 'report-2026.pdf will be removed. This cannot be undone.',
  backdropDismiss: true,
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
      <button type="button" onClick={() => setIsOpen(true)}>
        Delete file
      </button>

      {isOpen && <SmartAlert options={options} onDismissed={onDismissed} />}

      {lastRole && <p>Last choice: {lastRole}</p>}
    </>
  );
}
// #endregion

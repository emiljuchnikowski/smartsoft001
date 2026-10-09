// #region usage
import { useState } from 'react';

import {
  IModalAction,
  IModalActionClick,
  IModalOptions,
  SmartModal,
} from '@smartsoft001/react';

const actions: IModalAction[] = [
  { id: 'cancel', label: 'Cancel', variant: 'secondary' },
  { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
];

const options: IModalOptions = {
  variant: 'centered',
  footerStyle: 'gray',
  withDismiss: true,
};

export function ModalUsageExample() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [closedCount, setClosedCount] = useState(0);

  // A footer action keeps the modal open: close it here.
  const onActionClick = ({ actionId }: IModalActionClick) => {
    setLastAction(actionId);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="docs-modal-trigger"
        onClick={() => setOpen(true)}
      >
        Deactivate account
      </button>

      <SmartModal
        open={open}
        onOpenChange={setOpen}
        title="Deactivate account"
        description="Once the account is deactivated all of its data will be permanently removed."
        actions={actions}
        options={options}
        onActionClick={onActionClick}
        onClosed={() => setClosedCount((count) => count + 1)}
      />

      <p>Last action: {lastAction ?? 'none'}</p>
      <p>Closed by the user: {closedCount}</p>
    </>
  );
}
// #endregion

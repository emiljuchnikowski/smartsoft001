// #region usage
import { useState } from 'react';

import { IDrawerOptions, SmartDrawer } from '@smartsoft001/react';

const options: IDrawerOptions = {
  position: 'right',
  withOverlay: true,
};

export function DrawerUsageExample() {
  const [open, setOpen] = useState(false);
  const [closedCount, setClosedCount] = useState(0);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        View cart
      </button>

      <SmartDrawer
        open={open}
        onOpenChange={setOpen}
        title="Shopping cart"
        options={options}
        onClosed={() => setClosedCount((count) => count + 1)}
      >
        <ul>
          <li>Throwback Hip Bag, $90.00</li>
          <li>Medium Stuff Satchel, $32.00</li>
        </ul>
      </SmartDrawer>

      <p>Times closed: {closedCount}</p>
    </>
  );
}
// #endregion

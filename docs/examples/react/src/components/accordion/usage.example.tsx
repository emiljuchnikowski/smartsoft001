// #region usage
import { useState } from 'react';

import { SmartAccordion } from '@smartsoft001/react';

export function AccordionUsageExample() {
  const [open, setOpen] = useState(false);

  return (
    <SmartAccordion
      show={open}
      onShowChange={setOpen}
      accordionHeader={<span>What is your refund policy?</span>}
      accordionBody={
        <p>You can request a full refund within 30 days of purchase.</p>
      }
    />
  );
}
// #endregion

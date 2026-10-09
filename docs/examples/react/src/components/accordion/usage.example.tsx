// #region usage
import { useState } from 'react';

import { IAccordionOptions, SmartAccordion } from '@smartsoft001/react';

const options: IAccordionOptions = { disabled: false };

export function AccordionUsageExample() {
  const [open, setOpen] = useState(false);

  return (
    <SmartAccordion
      options={options}
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

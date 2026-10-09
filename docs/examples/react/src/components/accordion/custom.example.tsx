// #region usage
import { useState } from 'react';

import {
  IAccordionOptions,
  SmartAccordionBaseProps,
  useAccordion,
} from '@smartsoft001/react';

export function CustomAccordion(props: SmartAccordionBaseProps) {
  const { options, className, headerTpl, bodyTpl } = props;
  const { show, toggle, sharedContainerClasses } = useAccordion(props);

  return (
    <div
      className={['docs-accordion', ...sharedContainerClasses, className]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="docs-accordion__header"
        disabled={options?.disabled ?? false}
        aria-expanded={show}
        onClick={toggle}
      >
        {headerTpl}
        <span aria-hidden="true">{show ? '-' : '+'}</span>
      </button>

      {show && <div className="docs-accordion__body">{bodyTpl}</div>}
    </div>
  );
}

const options: IAccordionOptions = { disabled: false };

// The accordion has no SmartProvider registry key, so a custom implementation
// is rendered directly in place of <SmartAccordion>.
export function AccordionCustomExample() {
  const [open, setOpen] = useState(false);

  return (
    <CustomAccordion
      headerTpl="What is the best thing about Switzerland?"
      bodyTpl="I don't know, but the flag is a big plus."
      show={open}
      onShowChange={setOpen}
      options={options}
    />
  );
}
// #endregion

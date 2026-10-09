// #region usage
import { useEffect, useRef } from 'react';

import {
  cn,
  IInfoOptions,
  SmartInfo,
  SmartInfoProps,
  SmartProvider,
  useInfo,
  useTranslate,
} from '@smartsoft001/react';

export function CustomInfo({ options, className }: SmartInfoProps) {
  // useInfo owns the open state; the text goes through the provider's
  // translations, like in the standard info.
  const { isOpen, toggle, close } = useInfo();
  const t = useTranslate();
  const rootRef = useRef<HTMLDivElement>(null);

  // useInfo does not close the popover on an outside click: add it here.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [isOpen, close]);

  return (
    <div ref={rootRef} className={cn('docs-info', className)}>
      <button
        type="button"
        className="docs-info__trigger"
        aria-label="More information"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        ?
      </button>
      {isOpen && (
        <div className="docs-info__popover" role="tooltip">
          {t(options.text)}
        </div>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { info: CustomInfo };

const options: IInfoOptions = { text: 'Enter your primary email address.' };

export function InfoCustomExample() {
  // Every SmartInfo below the provider renders CustomInfo.
  return (
    <SmartProvider components={components}>
      <label className="docs-info__label">Email address</label>
      <SmartInfo options={options} />
    </SmartProvider>
  );
}
// #endregion

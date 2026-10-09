// #region usage
import { useState } from 'react';

import { IPageHeadingOptions, SmartPageHeading } from '@smartsoft001/react';

export function PageHeadingUsageExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const options: IPageHeadingOptions = {
    title: 'Back End Developer',
    subtitle: 'Full-time, remote',
    actionsTpl: (
      <>
        <button type="button" onClick={() => setLastAction('edit')}>
          Edit
        </button>
        <button type="button" onClick={() => setLastAction('publish')}>
          Publish
        </button>
      </>
    ),
  };

  return (
    <>
      <SmartPageHeading options={options} />
      {lastAction && <p>Last action: {lastAction}</p>}
    </>
  );
}
// #endregion

// #region usage
import { useState } from 'react';

import {
  IPageHeadingOptions,
  SmartButton,
  SmartPageHeading,
} from '@smartsoft001/react';

export function PageHeadingUsageExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const options: IPageHeadingOptions = {
    title: 'Back End Developer',
    subtitle: 'Full-time, remote',
    actionsTpl: (
      <>
        <SmartButton
          options={{
            variant: 'secondary',
            click: () => setLastAction('edit'),
          }}
        >
          Edit
        </SmartButton>
        <SmartButton options={{ click: () => setLastAction('publish') }}>
          Publish
        </SmartButton>
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

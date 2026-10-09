// #region usage
import { useState } from 'react';

import {
  ICardHeadingOptions,
  SmartButton,
  SmartCardHeading,
} from '@smartsoft001/react';

export function CardHeadingUsageExample() {
  const [createdCount, setCreatedCount] = useState(0);

  const options: ICardHeadingOptions = {
    title: 'Job postings',
    description: 'Open roles across all teams, sorted by posting date.',
    actionsTpl: (
      <SmartButton
        options={{ click: () => setCreatedCount((count) => count + 1) }}
      >
        Create new job
      </SmartButton>
    ),
  };

  return (
    <>
      <SmartCardHeading options={options} />
      <p>Jobs created: {createdCount}</p>
    </>
  );
}
// #endregion

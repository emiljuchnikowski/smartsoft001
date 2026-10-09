// #region usage
import { useState } from 'react';

import { ICardHeadingOptions, SmartCardHeading } from '@smartsoft001/react';

export function CardHeadingUsageExample() {
  const [createdCount, setCreatedCount] = useState(0);

  const options: ICardHeadingOptions = {
    title: 'Job postings',
    description: 'Open roles across all teams, sorted by posting date.',
    actionsTpl: (
      <button
        type="button"
        onClick={() => setCreatedCount((count) => count + 1)}
      >
        Create new job
      </button>
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

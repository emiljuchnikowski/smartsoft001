// #region usage
import { useState } from 'react';

import { IDividerOptions, SmartDivider } from '@smartsoft001/react';

// The preset draws the title, a line and the action in one row.
const options: IDividerOptions = { variant: 'with-toolbar' };

export function DividerUsageExample() {
  const [addClicks, setAddClicks] = useState(0);

  return (
    <>
      <SmartDivider
        options={options}
        title="Team members"
        actionLabel="Add member"
        onActionClick={() => setAddClicks((count) => count + 1)}
      />
      <p>Add member clicks: {addClicks}</p>
    </>
  );
}
// #endregion

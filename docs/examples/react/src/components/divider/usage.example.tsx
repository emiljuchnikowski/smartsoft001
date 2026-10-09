// #region usage
import { useState } from 'react';

import { IDividerOptions, SmartDivider } from '@smartsoft001/react';

const options: IDividerOptions = {
  variant: 'with-button',
  position: 'left',
};

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

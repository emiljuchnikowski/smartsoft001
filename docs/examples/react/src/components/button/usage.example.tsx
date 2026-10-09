// #region usage
import { useState } from 'react';

import { IButtonOptions, SmartButton } from '@smartsoft001/react';

export function ButtonUsageExample() {
  const [saveCount, setSaveCount] = useState(0);

  const options: IButtonOptions = {
    color: 'emerald',
    size: 'lg',
    click: () => setSaveCount((count) => count + 1),
  };

  return (
    <>
      <SmartButton options={options}>Save changes</SmartButton>
      <p>Saves: {saveCount}</p>
    </>
  );
}
// #endregion

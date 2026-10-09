// #region usage
import { useState } from 'react';

import { IButtonOptions, SmartButton } from '@smartsoft001/react';

export function ButtonUsageExample() {
  const [saveCount, setSaveCount] = useState(0);

  const options: IButtonOptions = {
    type: 'submit',
    variant: 'primary',
    color: 'indigo',
    size: 'md',
    rounded: false,
    click: () => setSaveCount((count) => count + 1),
  };

  const disabled = false;

  return (
    <>
      <SmartButton options={options} disabled={disabled}>
        Save changes
      </SmartButton>
      <p>Saves: {saveCount}</p>
    </>
  );
}
// #endregion

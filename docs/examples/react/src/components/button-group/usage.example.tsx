// #region usage
import { useState } from 'react';

import {
  IButtonGroupButton,
  IButtonGroupButtonClick,
  SmartButtonGroup,
} from '@smartsoft001/react';

const buttons: IButtonGroupButton[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

export function ButtonGroupUsageExample() {
  const [view, setView] = useState('week');

  const onButtonClick = ({ buttonId }: IButtonGroupButtonClick) =>
    setView(buttonId);

  return (
    <>
      <SmartButtonGroup
        buttons={buttons}
        selected={view}
        onButtonClick={onButtonClick}
      />
      <p>Showing: {view}</p>
    </>
  );
}
// #endregion

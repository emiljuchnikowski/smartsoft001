// #region usage
import { useState } from 'react';

import {
  IButtonGroupButton,
  IButtonGroupButtonClick,
  IButtonGroupOptions,
  SmartButtonGroup,
} from '@smartsoft001/react';

const buttons: IButtonGroupButton[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const options: IButtonGroupOptions = { variant: 'basic' };

export function ButtonGroupUsageExample() {
  const [view, setView] = useState('week');

  const onButtonClick = ({ buttonId }: IButtonGroupButtonClick) =>
    setView(buttonId);

  return (
    <SmartButtonGroup
      buttons={buttons}
      options={options}
      selected={view}
      onButtonClick={onButtonClick}
    />
  );
}
// #endregion

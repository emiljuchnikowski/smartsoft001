// #region usage
import { useState } from 'react';

import {
  IActionPanelActionClick,
  IActionPanelOptions,
  SmartActionPanel,
} from '@smartsoft001/react';

const options: IActionPanelOptions = {
  layout: 'right-button',
  title: 'Manage subscription',
  description: 'Change your plan or cancel at the end of the billing period.',
  actions: [{ id: 'change-plan', label: 'Change plan', variant: 'primary' }],
};

export function ActionPanelUsageExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const onActionClick = ({ actionId }: IActionPanelActionClick) =>
    setLastAction(actionId);

  return (
    <>
      <SmartActionPanel options={options} onActionClick={onActionClick} />
      {lastAction && <p>Last action: {lastAction}</p>}
    </>
  );
}
// #endregion

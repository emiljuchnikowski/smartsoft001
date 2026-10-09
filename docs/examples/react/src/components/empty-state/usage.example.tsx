// #region usage
import { useState } from 'react';

import {
  IEmptyStateActionClick,
  IEmptyStateOptions,
  SmartEmptyState,
} from '@smartsoft001/react';

const options: IEmptyStateOptions = {
  title: 'No projects',
  description: 'Get started by creating a new project.',
  actions: [{ id: 'new-project', label: 'New project', variant: 'primary' }],
};

export function EmptyStateUsageExample() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const onActionClick = ({ actionId }: IEmptyStateActionClick) =>
    setLastAction(actionId);

  return (
    <>
      <SmartEmptyState options={options} onActionClick={onActionClick} />
      {lastAction && <p>Last action: {lastAction}</p>}
    </>
  );
}
// #endregion

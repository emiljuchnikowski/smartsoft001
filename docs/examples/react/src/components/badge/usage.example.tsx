// #region usage
import { useState } from 'react';

import {
  IBadgeOptions,
  SmartBadge,
  SmartBadgeColor,
} from '@smartsoft001/react';

const text = 'Active';
const color: SmartBadgeColor = 'green';

const options: IBadgeOptions = { withDot: true, withRemove: true };

export function BadgeUsageExample() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <SmartBadge
      text={text}
      color={color}
      size="sm"
      options={options}
      onRemoved={() => setVisible(false)}
    />
  );
}
// #endregion

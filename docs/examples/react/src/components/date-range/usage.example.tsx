// #region usage
import { useState } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';
import { SmartDateRange } from '@smartsoft001/react';

export function DateRangeUsageExample() {
  // `null` keeps the picker controlled once the range is cleared.
  const [range, setRange] = useState<IDateRange | null>({
    start: '2026-04-01',
    end: '2026-04-30',
  });

  return (
    <SmartDateRange
      variant="standard"
      value={range}
      onValueChange={(next) => setRange(next ?? null)}
    />
  );
}
// #endregion

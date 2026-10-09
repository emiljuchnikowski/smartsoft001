// #region usage
import { useState } from 'react';

import { ICardOptions, SmartButton, SmartCard } from '@smartsoft001/react';

const options: ICardOptions = {
  title: 'Team members',
  grayFooter: true,
};

const seatsTotal = 10;

export function CardUsageExample() {
  const [seatsUsed, setSeatsUsed] = useState(4);

  return (
    <SmartCard
      options={options}
      hasHeader
      hasFooter
      footer={
        <SmartButton
          options={{ click: () => setSeatsUsed((used) => used + 1) }}
        >
          Invite member
        </SmartButton>
      }
    >
      <p>
        {seatsUsed} of {seatsTotal} seats used
      </p>
    </SmartCard>
  );
}
// #endregion

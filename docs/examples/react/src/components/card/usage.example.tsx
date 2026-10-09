// #region usage
import { ICardOptions, SmartCard } from '@smartsoft001/react';

const options: ICardOptions = {
  title: 'Team members',
  grayFooter: true,
};

const seatsUsed = 4;
const seatsTotal = 10;

export function CardUsageExample() {
  return (
    <SmartCard
      options={options}
      hasHeader
      hasFooter
      footer={<button type="button">Invite member</button>}
    >
      <p>
        {seatsUsed} of {seatsTotal} seats used
      </p>
    </SmartCard>
  );
}
// #endregion

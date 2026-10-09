// #region usage
import { IInfoOptions, SmartInfo } from '@smartsoft001/react';

const options: IInfoOptions = {
  text: 'We only use your email to send order updates.',
};

export function InfoUsageExample() {
  return (
    <>
      <span>Email address</span>
      <SmartInfo options={options} />
    </>
  );
}
// #endregion

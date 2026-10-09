// #region usage
import { IContainerOptions, SmartContainer } from '@smartsoft001/react';

const options: IContainerOptions = {
  mode: 'constrained',
  padding: 'mobile',
  narrow: false,
};

export function ContainerUsageExample() {
  return (
    <SmartContainer options={options}>
      <h1>Account settings</h1>
      <p>Manage your profile, notifications and billing details.</p>
    </SmartContainer>
  );
}
// #endregion

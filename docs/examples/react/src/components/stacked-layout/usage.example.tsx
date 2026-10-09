// #region usage
import { IStackedLayoutOptions, SmartStackedLayout } from '@smartsoft001/react';

const options: IStackedLayoutOptions = {
  title: 'Projects',
  containerWidth: 'xl',
  navTpl: (
    <>
      <a href="#dashboard">Dashboard</a>
      <a href="#projects">Projects</a>
      <a href="#reports">Reports</a>
    </>
  ),
};

export function StackedLayoutUsageExample() {
  return (
    <SmartStackedLayout options={options}>
      <p>You have 3 active projects this sprint.</p>
    </SmartStackedLayout>
  );
}
// #endregion

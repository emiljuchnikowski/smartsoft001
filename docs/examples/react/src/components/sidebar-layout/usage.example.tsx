// #region usage
import { ISidebarLayoutOptions, SmartSidebarLayout } from '@smartsoft001/react';

const options: ISidebarLayoutOptions = {
  title: 'Acme',
  sidebarPosition: 'left',
  // The sidebar is a plain React node passed inside the options.
  sidebarTpl: (
    <nav aria-label="Main">
      <a href="/dashboard">Dashboard</a>
      <a href="/projects">Projects</a>
      <a href="/team">Team</a>
    </nav>
  ),
};

export function SidebarLayoutUsageExample() {
  // The children become the main content.
  return (
    <SmartSidebarLayout options={options}>
      <h1>Dashboard</h1>
      <p>Welcome back. Here is what changed since yesterday.</p>
    </SmartSidebarLayout>
  );
}
// #endregion

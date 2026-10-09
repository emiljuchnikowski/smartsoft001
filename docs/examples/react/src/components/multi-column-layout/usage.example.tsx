// #region usage
import {
  IMultiColumnLayoutOptions,
  SmartMultiColumnLayout,
} from '@smartsoft001/react';

const options: IMultiColumnLayoutOptions = {
  secondaryWidth: 'md',
  headerTpl: <strong>Inbox</strong>,
  navTpl: (
    <>
      <a href="#inbox">Inbox</a>
      <a href="#drafts">Drafts</a>
      <a href="#sent">Sent</a>
    </>
  ),
  secondaryTpl: <span>Storage: 4.2 GB of 15 GB used</span>,
};

export function MultiColumnLayoutUsageExample() {
  return (
    <SmartMultiColumnLayout options={options}>
      <h2>Quarterly report is ready</h2>
      <p>The Q3 numbers are in. Open the attachment for the full breakdown.</p>
    </SmartMultiColumnLayout>
  );
}
// #endregion

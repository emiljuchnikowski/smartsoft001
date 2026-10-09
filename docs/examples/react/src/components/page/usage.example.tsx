// #region usage
import { useState } from 'react';

import { SmartPage } from '@smartsoft001/react';

export function PageUsageExample() {
  const [searchText, setSearchText] = useState('');

  // The back button goes back through the navigation adapter of SmartProvider.
  return (
    <SmartPage
      options={{
        title: 'Team members',
        showBackButton: true,
        search: { text: searchText, set: setSearchText },
      }}
    >
      <p>12 people have access to this workspace.</p>
    </SmartPage>
  );
}
// #endregion

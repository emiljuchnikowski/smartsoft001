// #region usage
import { useState } from 'react';

import { ISearchbarOptions, SmartSearchbar } from '@smartsoft001/react';

const options: ISearchbarOptions = {
  placeholder: 'Search orders',
  debounceTime: 300,
  showToggleButton: true,
};

export function SearchbarUsageExample() {
  // Both values are controlled: the text arrives once the typing settles.
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <SmartSearchbar
        options={options}
        text={query}
        onTextChange={setQuery}
        show={expanded}
        onShowChange={setExpanded}
      />
      {query && <p>{`Results for "${query}"`}</p>}
    </>
  );
}
// #endregion

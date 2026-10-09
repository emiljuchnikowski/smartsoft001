// #region usage
import { useState } from 'react';

import { SmartPaging } from '@smartsoft001/react';

const PAGE_SIZE = 10;
const TOTAL_ITEMS = 97;
const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / PAGE_SIZE);

export function PagingUsageExample() {
  // The page is owned by the parent: onPageChange reports the requested page.
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SmartPaging
      currentPage={currentPage}
      totalPages={TOTAL_PAGES}
      pageSize={PAGE_SIZE}
      totalItems={TOTAL_ITEMS}
      onPageChange={setCurrentPage}
    />
  );
}
// #endregion

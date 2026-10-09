// #region usage
import { useState } from 'react';

import { SmartExport } from '@smartsoft001/react';

interface Order {
  id: string;
  customer: string;
  total: number;
}

const orders: Order[] = [
  { id: 'ORD-1001', customer: 'Lindsay Walton', total: 120 },
  { id: 'ORD-1002', customer: 'Courtney Henry', total: 85.5 },
];

export function ExportUsageExample() {
  const [exported, setExported] = useState<{
    orders: Order[];
    fileName?: string;
  } | null>(null);

  // Receives `value` and `fileName` when the button is clicked. Build the
  // file (CSV, XLSX, ...) and start the download under that name.
  const exportOrders = (value: Order[], fileName?: string) =>
    setExported({ orders: value, fileName });

  return (
    <>
      <SmartExport
        value={orders}
        fileName="orders.csv"
        handler={exportOrders}
      />
      {exported && (
        <p>
          Exported {exported.orders.length} orders as {exported.fileName}
        </p>
      )}
    </>
  );
}
// #endregion

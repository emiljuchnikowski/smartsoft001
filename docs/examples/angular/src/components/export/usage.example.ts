// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ExportComponent } from '@smartsoft001/angular';

interface Order {
  id: string;
  customer: string;
  total: number;
}

@Component({
  selector: 'docs-export-usage-example',
  imports: [ExportComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportUsageExampleComponent {
  readonly orders: Order[] = [
    { id: 'ORD-1001', customer: 'Lindsay Walton', total: 120 },
    { id: 'ORD-1002', customer: 'Courtney Henry', total: 85.5 },
  ];

  readonly fileName = 'orders.csv';

  readonly exported = signal<Order[] | null>(null);
  readonly exportedFileName = signal<string | undefined>(undefined);

  // Receives the bound `value` and `fileName` when the button is clicked.
  // Build the file (CSV, XLSX, ...) and start the download under that name.
  readonly exportOrders = (orders: Order[], fileName?: string): void => {
    this.exported.set(orders);
    this.exportedFileName.set(fileName);
  };
}
// #endregion

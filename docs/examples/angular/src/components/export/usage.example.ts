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

  // Receives the bound `value` when the button is clicked. Build the file
  // (CSV, XLSX, ...) and start the download here.
  readonly exportOrders = (orders: Order[]): void => {
    this.exported.set(orders);
  };
}
// #endregion

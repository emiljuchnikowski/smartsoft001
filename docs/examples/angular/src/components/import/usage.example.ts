// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ImportComponent } from '@smartsoft001/angular';

@Component({
  selector: 'docs-import-usage-example',
  imports: [ImportComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportUsageExampleComponent {
  readonly accept = 'text/csv';

  readonly importedFile = signal<string | null>(null);

  onImport(file: File): void {
    this.importedFile.set(file.name);
  }
}
// #endregion

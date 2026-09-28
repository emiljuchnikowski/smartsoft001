// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DrawerComponent, IDrawerOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-drawer-usage-example',
  imports: [DrawerComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerUsageExampleComponent {
  readonly options: IDrawerOptions = {
    position: 'right',
    withOverlay: true,
  };

  readonly open = signal(false);
  readonly closedCount = signal(0);

  onClosed(): void {
    this.closedCount.update((count) => count + 1);
  }
}
// #endregion

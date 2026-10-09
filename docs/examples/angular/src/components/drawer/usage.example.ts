// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonComponent,
  DrawerComponent,
  IButtonOptions,
  IDrawerOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-drawer-usage-example',
  imports: [DrawerComponent, ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerUsageExampleComponent {
  // A backdrop behind the panel; a click on it closes the drawer.
  readonly options: IDrawerOptions = { withOverlay: true };

  readonly open = signal(false);
  readonly closedCount = signal(0);

  readonly viewCart: IButtonOptions = { click: () => this.open.set(true) };

  onClosed(): void {
    this.closedCount.update((count) => count + 1);
  }
}
// #endregion

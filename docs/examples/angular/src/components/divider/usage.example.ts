// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DividerComponent, IDividerOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-divider-usage-example',
  imports: [DividerComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerUsageExampleComponent {
  readonly options: IDividerOptions = {
    variant: 'with-button',
    position: 'left',
  };

  readonly title = 'Team members';
  readonly actionLabel = 'Add member';

  readonly addClicks = signal(0);

  onAddMember(): void {
    this.addClicks.update((count) => count + 1);
  }
}
// #endregion

// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

import {
  IPageHeadingOptions,
  PageHeadingComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-page-heading-usage-example',
  imports: [PageHeadingComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeadingUsageExampleComponent {
  readonly actionsTpl = viewChild<TemplateRef<unknown>>('actionsTpl');

  readonly options = computed<IPageHeadingOptions>(() => ({
    title: 'Back End Developer',
    subtitle: 'Full-time, remote',
    actionsTpl: this.actionsTpl(),
  }));

  readonly lastAction = signal<string | null>(null);

  onAction(actionId: string): void {
    this.lastAction.set(actionId);
  }
}
// #endregion

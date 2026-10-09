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
  ButtonComponent,
  CardHeadingComponent,
  IButtonOptions,
  ICardHeadingOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-card-heading-usage-example',
  imports: [CardHeadingComponent, ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeadingUsageExampleComponent {
  private readonly actionsTpl =
    viewChild.required<TemplateRef<unknown>>('actions');

  readonly options = computed<ICardHeadingOptions>(() => ({
    title: 'Job postings',
    description: 'Open roles across all teams, sorted by posting date.',
    actionsTpl: this.actionsTpl(),
  }));

  readonly createdCount = signal(0);

  readonly createButton: IButtonOptions = {
    click: () => this.createdCount.update((count) => count + 1),
  };
}
// #endregion

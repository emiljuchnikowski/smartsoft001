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
  ISectionHeadingOptions,
  SectionHeadingComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-section-heading-usage-example',
  imports: [SectionHeadingComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingUsageExampleComponent {
  private readonly actions =
    viewChild.required<TemplateRef<unknown>>('actions');

  readonly options = computed<ISectionHeadingOptions>(() => ({
    title: 'Team members',
    label: '12',
    description: 'People who can access this project.',
    actionsTpl: this.actions(),
  }));

  readonly invited = signal(false);

  onInvite(): void {
    this.invited.set(true);
  }
}
// #endregion

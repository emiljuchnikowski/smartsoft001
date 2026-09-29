// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  TemplateRef,
  viewChild,
} from '@angular/core';

import {
  IStackedLayoutOptions,
  StackedLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-stacked-layout-usage-example',
  imports: [StackedLayoutComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedLayoutUsageExampleComponent {
  private readonly navTpl = viewChild.required<TemplateRef<unknown>>('navTpl');

  readonly options = computed<IStackedLayoutOptions>(() => ({
    title: 'Projects',
    containerWidth: 'xl',
    navTpl: this.navTpl(),
  }));
}
// #endregion

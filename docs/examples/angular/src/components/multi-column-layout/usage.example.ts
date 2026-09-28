// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  TemplateRef,
  viewChild,
} from '@angular/core';

import {
  IMultiColumnLayoutOptions,
  MultiColumnLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-multi-column-layout-usage-example',
  imports: [MultiColumnLayoutComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiColumnLayoutUsageExampleComponent {
  readonly headerTpl = viewChild<TemplateRef<unknown>>('headerTpl');
  readonly navTpl = viewChild<TemplateRef<unknown>>('navTpl');
  readonly secondaryTpl = viewChild<TemplateRef<unknown>>('secondaryTpl');

  readonly options = computed<IMultiColumnLayoutOptions>(() => ({
    title: 'Inbox',
    width: 'constrained',
    secondaryWidth: 'md',
    headerTpl: this.headerTpl(),
    navTpl: this.navTpl(),
    secondaryTpl: this.secondaryTpl(),
  }));
}
// #endregion

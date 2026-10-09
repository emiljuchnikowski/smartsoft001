// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  TemplateRef,
  viewChild,
} from '@angular/core';

import {
  ISidebarLayoutOptions,
  SidebarLayoutComponent,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-sidebar-layout-usage-example',
  imports: [SidebarLayoutComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLayoutUsageExampleComponent {
  private readonly sidebar =
    viewChild.required<TemplateRef<unknown>>('sidebar');

  readonly options = computed<ISidebarLayoutOptions>(() => ({
    // The preset shows the title in a header above the sidebar and content.
    title: 'Acme',
    sidebarTpl: this.sidebar(),
  }));
}
// #endregion

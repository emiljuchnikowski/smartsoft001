import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  getPageBodyCardClasses,
  getPageContainerClasses,
  getPageHeaderClasses,
  getPageIconButtonClasses,
  getPagePageClasses,
  getPageTitleClasses,
} from './preset-classes.util';
import { ButtonComponent } from '../../button/button.component';
import { PageStandardComponent } from '../standard/standard.component';

/**
 * Styled page variation (preset).
 *
 * A full application-shell layout: an optional banner strip, a bordered
 * `<header>` with breadcrumbs, a title row (back button, avatar/logo, title +
 * subtitle, search + action buttons), a meta/stats row and an optional filters
 * bar, followed by a gray page body that renders `bodyTpl` inside a content
 * card with an optional `<aside>` sidebar.
 *
 * Registered through `PAGE_VARIANT_COMPONENTS_TOKEN` under the `'preset'` key
 * (see `PAGE_PRESET_VARIANT_COMPONENTS`), or used directly via the
 * `<smart-page-preset>` selector.
 */
@Component({
  selector: 'smart-page-preset',
  templateUrl: './preset.component.html',
  imports: [TranslatePipe, ButtonComponent, AsyncPipe, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePresetComponent extends PageStandardComponent {
  // NgComponentOutlet (used by PageComponent when this variant is registered
  // through PAGE_VARIANT_COMPONENTS_TOKEN) passes inputs by canonical name, so
  // the inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected readonly headerClasses = getPageHeaderClasses();
  protected readonly containerClasses = getPageContainerClasses();
  protected readonly titleClasses = getPageTitleClasses();
  protected readonly bodyCardClasses = getPageBodyCardClasses();
  protected readonly iconButtonClasses = getPageIconButtonClasses();

  protected pageClasses = computed(() => getPagePageClasses(this.cssClass()));
}

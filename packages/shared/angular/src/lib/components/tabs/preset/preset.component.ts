import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ITabItem } from '../../../models';
import { TabsBaseComponent } from '../base';
import {
  getTabsBadgeClasses,
  getTabsContainerClasses,
  getTabsIconClasses,
  getTabsMobileSelectClasses,
  getTabsNavClasses,
  getTabsTriggerClasses,
  SmartTabsPresetLayout,
} from './preset-classes.util';

/**
 * Styled tabs variation (preset).
 *
 * Drop-in replacement for `TabsStandardComponent` — register it through
 * `TABS_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-tabs>`, or use the
 * `<smart-tabs-preset>` selector directly.
 *
 * Renders the translated Preline "underline" tab nav (plus the other layouts in
 * `SmartTabsLayout`) with `smart:`-prefixed vanilla Tailwind classes. Preline's
 * Tabs JS plugin is NOT used: the active tab is driven by an Angular signal via
 * `(click)` + `@if`/`@for`, while ARIA (`role=tablist/tab`, `aria-selected`,
 * `aria-controls`) is kept on the markup.
 */
@Component({
  selector: 'smart-tabs-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class TabsPresetComponent extends TabsBaseComponent {
  // NgComponentOutlet (used by TabsComponent when this is registered through
  // TABS_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected layout = computed<SmartTabsPresetLayout>(
    () => this.options()?.layout ?? 'underline',
  );

  protected items = computed<ITabItem[]>(() => this.options()?.items ?? []);

  protected ariaLabel = computed<string>(
    () => this.options()?.ariaLabel ?? 'Tabs',
  );

  protected showMobileSelect = computed<boolean>(
    () => (this.options()?.showMobileSelect ?? true) && this.items().length > 0,
  );

  // Falls back to the first item when no selection has been made yet.
  protected currentId = computed<string | null>(
    () => this.selectedId() ?? this.items()[0]?.id ?? null,
  );

  protected containerClasses = computed(() =>
    getTabsContainerClasses(this.layout()),
  );
  protected navClasses = computed(() => getTabsNavClasses(this.layout()));

  protected desktopWrapperClasses = computed(() =>
    this.showMobileSelect() ? 'smart:hidden smart:sm:block' : '',
  );

  protected iconClasses = getTabsIconClasses();
  protected mobileSelectClasses = getTabsMobileSelectClasses();

  protected isCurrent(id: string): boolean {
    return this.currentId() === id;
  }

  protected triggerClasses(id: string): string {
    return getTabsTriggerClasses(this.layout(), this.isCurrent(id));
  }

  protected badgeClasses(id: string): string {
    return getTabsBadgeClasses(this.isCurrent(id));
  }

  protected onTabClick(tabId: string): void {
    this.selectedId.set(tabId);
    this.tabChange.emit({ tabId });
  }

  protected onSelectChange(event: Event): void {
    this.onTabClick((event.target as HTMLSelectElement).value);
  }
}

import { ITabItem } from '../../../models';
import { SmartNavLink } from '../../navbar/nav-link';
import { SmartTabsProps } from '../tabs.types';
import { useTabs } from '../use-tabs';
import {
  getTabsBadgeClasses,
  getTabsContainerClasses,
  getTabsIconClasses,
  getTabsMobileSelectClasses,
  getTabsNavClasses,
  getTabsTriggerClasses,
  SmartTabsPresetLayout,
} from './preset-classes';

/**
 * Styled tabs variation (preset). Register it as `components.tabs` on
 * `SmartProvider` to restyle every `<SmartTabs>`, or render it directly.
 *
 * The Preline "underline" tab nav plus the other `SmartTabsLayout`s, without
 * the Preline Tabs JS: the active tab is React state, and the ARIA
 * (`role=tablist/tab`, `aria-selected`, `aria-controls`) stays on the markup.
 * Without a selection the first item is the current tab.
 */
export function SmartTabsPreset(props: SmartTabsProps) {
  const { options, className } = props;
  const { selectedId, selectTab } = useTabs(props);

  const layout: SmartTabsPresetLayout = options?.layout ?? 'underline';
  const items = options?.items ?? [];
  const ariaLabel = options?.ariaLabel ?? 'Tabs';
  const showMobileSelect =
    (options?.showMobileSelect ?? true) && items.length > 0;
  const currentId = selectedId ?? items[0]?.id ?? null;
  const isCurrent = (id: string) => currentId === id;
  const iconClasses = getTabsIconClasses();

  const renderContent = (item: ITabItem) => (
    <>
      {item.iconTpl && <span className={iconClasses}>{item.iconTpl}</span>}
      {item.label}
      {item.badge !== undefined && item.badge !== null && (
        <span className={getTabsBadgeClasses(isCurrent(item.id))}>
          {item.badge}
        </span>
      )}
    </>
  );

  return (
    <div className={className}>
      {showMobileSelect && (
        <select
          className={getTabsMobileSelectClasses()}
          aria-label={ariaLabel}
          value={currentId ?? ''}
          onChange={(event) => selectTab(event.target.value)}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label ?? item.id}
            </option>
          ))}
        </select>
      )}

      <div
        className={showMobileSelect ? 'smart:hidden smart:sm:block' : undefined}
      >
        <div className={getTabsContainerClasses(layout) || undefined}>
          <nav
            className={getTabsNavClasses(layout)}
            role="tablist"
            aria-orientation="horizontal"
            aria-label={ariaLabel}
          >
            {items.map((item) =>
              item.href ? (
                <SmartNavLink
                  key={item.id}
                  href={item.href}
                  role="tab"
                  id={item.id + '-tab'}
                  className={getTabsTriggerClasses(layout, isCurrent(item.id))}
                  aria-selected={isCurrent(item.id)}
                  aria-controls={item.id}
                  onClick={() => selectTab(item.id)}
                >
                  {renderContent(item)}
                </SmartNavLink>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={item.id + '-tab'}
                  className={getTabsTriggerClasses(layout, isCurrent(item.id))}
                  aria-selected={isCurrent(item.id)}
                  aria-controls={item.id}
                  onClick={() => selectTab(item.id)}
                >
                  {renderContent(item)}
                </button>
              ),
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

import { ITabItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { SmartTabsProps } from '../tabs.types';
import { useTabs } from '../use-tabs';

/**
 * The default tabs rendering (`<smart-tabs-standard>`). As in Angular, a click
 * on a tab with an `href` follows the link without changing the selection.
 */
export function SmartTabsStandard(props: SmartTabsProps) {
  const { options, className } = props;
  const { selectedId, selectTab } = useTabs(props);
  const items = options?.items ?? [];
  const isCurrent = (itemId: string) => selectedId === itemId;

  const renderContent = (item: ITabItem) => (
    <>
      {item.iconTpl && <span className="tab-icon">{item.iconTpl}</span>}
      {item.label}
      {item.badge !== undefined && item.badge !== null && (
        <span className="tab-badge">{item.badge}</span>
      )}
    </>
  );

  return (
    <div className={className}>
      <div className="tabs">
        {(options?.showMobileSelect ?? true) && items.length > 0 && (
          <div className="tabs-mobile">
            <select
              aria-label={options?.ariaLabel ?? 'Select a tab'}
              value={selectedId ?? ''}
              onChange={(event) => selectTab(event.target.value)}
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label ?? item.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <nav className="tabs-desktop" aria-label={options?.ariaLabel ?? 'Tabs'}>
          <ul role="list" className="tabs-list">
            {items.map((item) => (
              <li key={item.id} className="tab">
                {item.href ? (
                  <SmartNavLink
                    href={item.href}
                    className={cn('tab-link', isCurrent(item.id) && 'current')}
                    aria-current={isCurrent(item.id) ? 'page' : undefined}
                  >
                    {renderContent(item)}
                  </SmartNavLink>
                ) : (
                  <button
                    type="button"
                    className={cn(
                      'tab-button',
                      isCurrent(item.id) && 'current',
                    )}
                    aria-current={isCurrent(item.id) ? 'page' : undefined}
                    onClick={() => selectTab(item.id)}
                  >
                    {renderContent(item)}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

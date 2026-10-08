import { IVerticalNavItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { useVerticalNavigation } from '../use-vertical-navigation';
import { SmartVerticalNavigationProps } from '../vertical-navigation.types';

/** The default vertical navigation rendering (`<smart-vertical-navigation-standard>`). */
export function SmartVerticalNavigationStandard(
  props: SmartVerticalNavigationProps,
) {
  const { options, className } = props;
  const { groups, itemClick } = useVerticalNavigation(props);

  const renderContent = (item: IVerticalNavItem) => (
    <>
      {item.iconTpl ? (
        <span className="item-icon">{item.iconTpl}</span>
      ) : item.initial ? (
        <span className="item-initial">{item.initial}</span>
      ) : null}
      {item.label && <span className="item-label">{item.label}</span>}
      {item.badge !== undefined && item.badge !== null && (
        <span className="item-badge">{item.badge}</span>
      )}
    </>
  );

  return (
    <div className={className}>
      <nav
        className="vertical-navigation"
        aria-label={options?.ariaLabel ?? 'Sidebar'}
      >
        <ul role="list" className="groups">
          {groups.map((group, index) => (
            <li key={group.id ?? index} className="group">
              {group.title && <div className="group-title">{group.title}</div>}
              <ul role="list" className="items">
                {group.items.map((item) => (
                  <li key={item.id} className="item">
                    {item.href ? (
                      <SmartNavLink
                        href={item.href}
                        className={cn('item-link', item.current && 'current')}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {renderContent(item)}
                      </SmartNavLink>
                    ) : (
                      <button
                        type="button"
                        className={cn('item-button', item.current && 'current')}
                        aria-current={item.current ? 'page' : undefined}
                        onClick={() => itemClick(item.id)}
                      >
                        {renderContent(item)}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

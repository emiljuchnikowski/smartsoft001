import { Fragment, useId } from 'react';

import {
  getVerticalNavBadgeClasses,
  getVerticalNavContainerClasses,
  getVerticalNavGroupTitleClasses,
  getVerticalNavIconClasses,
  getVerticalNavInitialClasses,
  getVerticalNavItemClasses,
  getVerticalNavListItemClasses,
  getVerticalNavNavClasses,
} from './preset-classes';
import { IVerticalNavItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { useVerticalNavigation } from '../use-vertical-navigation';
import { SmartVerticalNavigationProps } from '../vertical-navigation.types';

/**
 * Styled vertical navigation variation (preset). Register it as
 * `components['vertical-navigation']` on `SmartProvider` to restyle every
 * `<SmartVerticalNavigation>`, or render it directly.
 *
 * The Preline vertical-tabs look: each item is a tab with a trailing border,
 * the `current` item gaining the primary border and text accent. One `<nav>`
 * landmark (`options.ariaLabel`, `'Sidebar'` by default) holds every group; a
 * group is a list labelled by its title.
 */
export function SmartVerticalNavigationPreset(
  props: SmartVerticalNavigationProps,
) {
  const { options, className } = props;
  const { groups, itemClick } = useVerticalNavigation(props);
  const id = useId();

  const renderContent = (item: IVerticalNavItem) => (
    <>
      {item.iconTpl ? (
        <span className={getVerticalNavIconClasses()}>{item.iconTpl}</span>
      ) : item.initial ? (
        <span className={getVerticalNavInitialClasses()}>{item.initial}</span>
      ) : null}
      {item.label && <span>{item.label}</span>}
      {item.badge !== undefined && item.badge !== null && (
        <span className={getVerticalNavBadgeClasses()}>{item.badge}</span>
      )}
    </>
  );

  return (
    <nav
      className={cn(getVerticalNavContainerClasses(), className)}
      aria-label={options?.ariaLabel ?? 'Sidebar'}
    >
      {groups.map((group, index) => {
        const titleId = group.title ? `${id}-group-${index}` : undefined;

        return (
          <Fragment key={group.id ?? index}>
            {group.title && (
              <div id={titleId} className={getVerticalNavGroupTitleClasses()}>
                {group.title}
              </div>
            )}
            <ul
              role="list"
              className={getVerticalNavNavClasses()}
              aria-labelledby={titleId}
            >
              {group.items.map((item) => (
                <li key={item.id} className={getVerticalNavListItemClasses()}>
                  {item.href ? (
                    <SmartNavLink
                      href={item.href}
                      className={getVerticalNavItemClasses(
                        Boolean(item.current),
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {renderContent(item)}
                    </SmartNavLink>
                  ) : (
                    <button
                      type="button"
                      className={getVerticalNavItemClasses(
                        Boolean(item.current),
                      )}
                      aria-current={item.current ? 'page' : undefined}
                      onClick={() => itemClick(item.id)}
                    >
                      {renderContent(item)}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        );
      })}
    </nav>
  );
}

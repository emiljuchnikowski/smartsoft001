import { Fragment } from 'react';

import { IVerticalNavItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { useVerticalNavigation } from '../use-vertical-navigation';
import { SmartVerticalNavigationProps } from '../vertical-navigation.types';
import {
  getVerticalNavBadgeClasses,
  getVerticalNavContainerClasses,
  getVerticalNavGroupTitleClasses,
  getVerticalNavIconClasses,
  getVerticalNavInitialClasses,
  getVerticalNavItemClasses,
  getVerticalNavNavClasses,
} from './preset-classes';

/**
 * Styled vertical navigation variation (preset). Register it as
 * `components['vertical-navigation']` on `SmartProvider` to restyle every
 * `<SmartVerticalNavigation>`, or render it directly.
 *
 * The Preline vertical-tabs look: each item is a tab with a trailing border,
 * the `current` item gaining the primary border and text accent. Every group
 * renders its own `<nav>`, after its title.
 */
export function SmartVerticalNavigationPreset(
  props: SmartVerticalNavigationProps,
) {
  const { options, className } = props;
  const { groups, itemClick } = useVerticalNavigation(props);

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
    <div className={cn(getVerticalNavContainerClasses(), className)}>
      {groups.map((group, index) => (
        <Fragment key={group.id ?? index}>
          {group.title && (
            <div className={getVerticalNavGroupTitleClasses()}>
              {group.title}
            </div>
          )}
          <nav
            className={getVerticalNavNavClasses()}
            aria-label={options?.ariaLabel ?? 'Sidebar'}
          >
            {group.items.map((item) =>
              item.href ? (
                <SmartNavLink
                  key={item.id}
                  href={item.href}
                  className={getVerticalNavItemClasses(Boolean(item.current))}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {renderContent(item)}
                </SmartNavLink>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  className={getVerticalNavItemClasses(Boolean(item.current))}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => itemClick(item.id)}
                >
                  {renderContent(item)}
                </button>
              ),
            )}
          </nav>
        </Fragment>
      ))}
    </div>
  );
}

import { ISidebarNavItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../../navbar/nav-link';
import { SmartSidebarNavigationProps } from '../sidebar-navigation.types';
import { useSidebarNavigation } from '../use-sidebar-navigation';

/** The default sidebar navigation rendering (`<smart-sidebar-navigation-standard>`). */
export function SmartSidebarNavigationStandard(
  props: SmartSidebarNavigationProps,
) {
  const { options, className } = props;
  const { groups, isExpanded, toggleExpanded, itemClick } =
    useSidebarNavigation(props);

  const renderContent = (item: ISidebarNavItem) => (
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

  const renderChild = (child: ISidebarNavItem) => (
    <li key={child.id} className="child">
      {child.href ? (
        <SmartNavLink
          href={child.href}
          className={cn('child-link', child.current && 'current')}
          aria-current={child.current ? 'page' : undefined}
        >
          {child.label && <span className="child-label">{child.label}</span>}
        </SmartNavLink>
      ) : (
        <button
          type="button"
          className={cn('child-button', child.current && 'current')}
          aria-current={child.current ? 'page' : undefined}
          onClick={() => itemClick(child.id)}
        >
          {child.label && <span className="child-label">{child.label}</span>}
        </button>
      )}
    </li>
  );

  const logo = options?.logo;
  const profile = options?.profile;
  const logoImages = logo && (
    <>
      {logo.url && (
        <img className="sidebar-logo-img" src={logo.url} alt={logo.alt ?? ''} />
      )}
      {logo.urlDark && (
        <img
          className="sidebar-logo-img sidebar-logo-img-dark"
          src={logo.urlDark}
          alt={logo.alt ?? ''}
        />
      )}
    </>
  );

  return (
    <div className={cn('sidebar-navigation-wrapper', className)}>
      {logo && (
        <div className="sidebar-logo">
          {logo.tpl ? (
            logo.tpl
          ) : logo.href ? (
            <SmartNavLink href={logo.href}>{logoImages}</SmartNavLink>
          ) : (
            logoImages
          )}
        </div>
      )}

      <nav
        className="sidebar-navigation"
        aria-label={options?.ariaLabel ?? 'Sidebar'}
      >
        <ul role="list" className="groups">
          {groups.map((group, index) => (
            <li key={group.id ?? index} className="group">
              {group.title && <div className="group-title">{group.title}</div>}
              <ul role="list" className="items">
                {group.items.map((item) => (
                  <li key={item.id} className="item">
                    {item.expandable ? (
                      <>
                        <button
                          type="button"
                          className="item-toggle"
                          aria-expanded={isExpanded(item)}
                          aria-controls={'sidebar-sub-' + item.id}
                          onClick={() => toggleExpanded(item)}
                        >
                          {item.iconTpl && (
                            <span className="item-icon">{item.iconTpl}</span>
                          )}
                          {item.label && (
                            <span className="item-label">{item.label}</span>
                          )}
                          <span className="item-chevron" aria-hidden="true">
                            ›
                          </span>
                        </button>
                        {isExpanded(item) && !!item.children?.length && (
                          <ul
                            role="list"
                            className="children"
                            id={'sidebar-sub-' + item.id}
                          >
                            {item.children.map(renderChild)}
                          </ul>
                        )}
                      </>
                    ) : item.href ? (
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

          {profile && (
            <li className="profile">
              <SmartNavLink className="profile-link" href={profile.href ?? '#'}>
                {profile.avatarUrl && (
                  <img
                    className="profile-avatar"
                    src={profile.avatarUrl}
                    alt={profile.avatarAlt ?? ''}
                  />
                )}
                {profile.srOnlyText && (
                  <span className="sr-only">{profile.srOnlyText}</span>
                )}
                {profile.name && (
                  <span className="profile-name" aria-hidden="true">
                    {profile.name}
                  </span>
                )}
              </SmartNavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

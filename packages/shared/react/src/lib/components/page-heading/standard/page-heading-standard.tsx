import { SmartPageHeadingProps } from '../page-heading.types';

/**
 * The default page heading rendering (`<smart-page-heading-standard>`):
 * unstyled breadcrumbs and banner slots above a `<header>` holding the title,
 * subtitle and the avatar / logo / meta / stats / actions / filters slots.
 */
export function SmartPageHeadingStandard({
  options,
  className,
}: SmartPageHeadingProps) {
  return (
    <div className={className}>
      {options?.breadcrumbsTpl ? (
        <nav className="breadcrumbs">{options.breadcrumbsTpl}</nav>
      ) : null}
      {options?.bannerTpl ? (
        <div className="banner">{options.bannerTpl}</div>
      ) : null}
      <header>
        {options?.avatarTpl ? (
          <div className="avatar">{options.avatarTpl}</div>
        ) : null}
        {options?.logoTpl ? (
          <div className="logo">{options.logoTpl}</div>
        ) : null}
        {options?.title ? <h1>{options.title}</h1> : null}
        {options?.subtitle ? (
          <p className="subtitle">{options.subtitle}</p>
        ) : null}
        {options?.metaTpl ? (
          <div className="meta">{options.metaTpl}</div>
        ) : null}
        {options?.statsTpl ? (
          <div className="stats">{options.statsTpl}</div>
        ) : null}
        {options?.actionsTpl ? (
          <div className="actions">{options.actionsTpl}</div>
        ) : null}
        {options?.filtersTpl ? (
          <div className="filters">{options.filtersTpl}</div>
        ) : null}
      </header>
    </div>
  );
}

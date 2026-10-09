import { IBreadcrumbItem, SmartBreadcrumbsSeparator } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartBreadcrumbsProps } from '../breadcrumbs.types';
import { useBreadcrumbs } from '../use-breadcrumbs';
import {
  getBreadcrumbsItemClasses,
  getBreadcrumbsLinkClasses,
  getBreadcrumbsListClasses,
  getBreadcrumbsNavClasses,
  getBreadcrumbsSeparatorClasses,
  resolveBreadcrumbsSeparator,
} from './preset-classes';

/**
 * Styled breadcrumbs variation (preset). Register it as
 * `components.breadcrumbs` on `SmartProvider` to restyle every
 * `<SmartBreadcrumbs>`, or render it directly.
 *
 * Translates the Preline breadcrumb: muted links that brighten on
 * hover/focus, a bold non-link current crumb, and separator glyphs
 * (`chevron` / `slash` / `arrow`) selected by `options.separator`.
 * `options.layout` additionally wraps the bar (`contained`,
 * `full-width-bar`) and can imply the separator (`simple-with-slashes`).
 */
export function SmartBreadcrumbsPreset(props: SmartBreadcrumbsProps) {
  const { options, className } = props;
  const { items, itemClick } = useBreadcrumbs(props);

  const separator = resolveBreadcrumbsSeparator(
    options?.separator,
    options?.layout,
  );
  const itemClasses = getBreadcrumbsItemClasses();

  return (
    <nav
      className={cn(getBreadcrumbsNavClasses(options?.layout), className)}
      aria-label={options?.ariaLabel ?? 'Breadcrumb'}
    >
      <ol role="list" className={getBreadcrumbsListClasses()}>
        {items.map((item, idx) => (
          <li key={item.id} className={itemClasses}>
            {idx > 0 && <Separator separator={separator} />}
            {item.current ? (
              <span
                className={getBreadcrumbsLinkClasses(true)}
                aria-current="page"
              >
                <ItemContent item={item} />
              </span>
            ) : item.href ? (
              <a href={item.href} className={getBreadcrumbsLinkClasses(false)}>
                <ItemContent item={item} />
              </a>
            ) : (
              <button
                type="button"
                className={getBreadcrumbsLinkClasses(false)}
                onClick={() => itemClick(item.id)}
              >
                <ItemContent item={item} />
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ItemContent({ item }: { item: IBreadcrumbItem }) {
  return (
    <>
      {item.iconTpl}
      {item.label}
      {item.srOnlyLabel && (
        <span className="smart:sr-only">{item.srOnlyLabel}</span>
      )}
    </>
  );
}

function Separator({ separator }: { separator: SmartBreadcrumbsSeparator }) {
  const className = getBreadcrumbsSeparatorClasses(separator);

  switch (separator) {
    case 'slash':
      return (
        <svg
          className={className}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'arrow':
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    default:
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
  }
}

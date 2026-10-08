import { SmartCardHeadingProps } from '../card-heading.types';

/**
 * The default card heading rendering (`<smart-card-heading-standard>`): the
 * avatar, the title, description and meta, and the actions of `options`, each
 * only when given. Unstyled; `options.presentation` is ignored.
 */
export function SmartCardHeadingStandard({
  options,
  className,
}: SmartCardHeadingProps) {
  return (
    <div className={className || undefined}>
      {options?.avatarTpl ? (
        <div className="avatar">{options.avatarTpl}</div>
      ) : null}
      <div className="content">
        {options?.title ? <h3>{options.title}</h3> : null}
        {options?.description ? (
          <p className="description">{options.description}</p>
        ) : null}
        {options?.metaTpl ? (
          <div className="meta">{options.metaTpl}</div>
        ) : null}
      </div>
      {options?.actionsTpl ? (
        <div className="actions">{options.actionsTpl}</div>
      ) : null}
    </div>
  );
}

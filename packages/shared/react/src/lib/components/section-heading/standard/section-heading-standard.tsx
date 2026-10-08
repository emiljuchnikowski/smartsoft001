import { SmartSectionHeadingProps } from '../section-heading.types';

/**
 * The default section heading rendering (`<smart-section-heading-standard>`):
 * an unstyled `<h3>` title (with its `label`), description and the badge /
 * input group / actions slots, and a tabs slot under the header.
 */
export function SmartSectionHeadingStandard({
  options,
  className,
}: SmartSectionHeadingProps) {
  return (
    <div className={className}>
      <div className="header">
        <div className="title-block">
          {options?.title ? (
            <h3>
              {options.title}
              {options.label ? (
                <>
                  {' '}
                  <span className="label">{options.label}</span>
                </>
              ) : null}
            </h3>
          ) : null}
          {options?.description ? (
            <p className="description">{options.description}</p>
          ) : null}
        </div>
        {options?.badgeTpl ? (
          <div className="badge">{options.badgeTpl}</div>
        ) : null}
        {options?.inputGroupTpl ? (
          <div className="input-group">{options.inputGroupTpl}</div>
        ) : null}
        {options?.actionsTpl ? (
          <div className="actions">{options.actionsTpl}</div>
        ) : null}
      </div>
      {options?.tabsTpl ? <div className="tabs">{options.tabsTpl}</div> : null}
    </div>
  );
}

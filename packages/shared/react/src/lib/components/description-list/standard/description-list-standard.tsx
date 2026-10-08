import { SmartDescriptionListProps } from '../description-list.types';

/**
 * The default description list rendering (`<smart-description-list-standard>`):
 * an unstyled title, description, a `<dl>` of label/value items (`valueTpl`
 * wins over `value`, `actionTpl` follows the value) and the attachments and
 * footer slots.
 */
export function SmartDescriptionListStandard({
  options,
  className,
}: SmartDescriptionListProps) {
  return (
    <div className={className}>
      <div className="list">
        {options?.title ? <h3 className="title">{options.title}</h3> : null}
        {options?.description ? (
          <p className="description">{options.description}</p>
        ) : null}
        <dl>
          {(options?.items ?? []).map((item, index) => (
            <div className="item" key={index}>
              <dt>{item.label}</dt>
              <dd>
                {item.valueTpl ? item.valueTpl : item.value}
                {item.actionTpl ? (
                  <>
                    {' '}
                    <span className="action">{item.actionTpl}</span>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        {options?.attachmentsTpl ? (
          <div className="attachments">{options.attachmentsTpl}</div>
        ) : null}
        {options?.footerTpl ? (
          <div className="footer">{options.footerTpl}</div>
        ) : null}
      </div>
    </div>
  );
}

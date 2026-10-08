import { SmartDescriptionListProps } from '../description-list.types';
import {
  DESCRIPTION_LIST_ACTION_CLASSES,
  DESCRIPTION_LIST_ATTACHMENTS_CLASSES,
  DESCRIPTION_LIST_DESCRIPTION_CLASSES,
  DESCRIPTION_LIST_FOOTER_CLASSES,
  DESCRIPTION_LIST_ROW_CLASSES,
  DESCRIPTION_LIST_TERM_CLASSES,
  DESCRIPTION_LIST_TITLE_CLASSES,
  DESCRIPTION_LIST_VALUE_CLASSES,
  getDescriptionListListClasses,
} from './preset-classes';

/**
 * Preset-styled description list (the Angular
 * `DescriptionListPresetComponent`). Register it as
 * `components['description-list']` on `SmartProvider` to restyle every
 * `<SmartDescriptionList>`, or render it directly.
 *
 * Renders an optional header (title + description), a divided `<dl>` of
 * label/value rows, and optional attachments/footer sections. Within a row
 * `valueTpl` wins over `value`, and `actionTpl` renders right-aligned.
 * `className` is merged onto the `<dl>`. Like the Angular template it has no
 * wrapper element: the zones are rendered side by side.
 */
export function SmartDescriptionListPreset({
  options,
  className,
}: SmartDescriptionListProps) {
  const hasHeader = !!options?.title || !!options?.description;

  return (
    <>
      {hasHeader ? (
        <div data-role="header">
          {options?.title ? (
            <h3 className={DESCRIPTION_LIST_TITLE_CLASSES}>{options.title}</h3>
          ) : null}
          {options?.description ? (
            <p className={DESCRIPTION_LIST_DESCRIPTION_CLASSES}>
              {options.description}
            </p>
          ) : null}
        </div>
      ) : null}
      <dl
        data-role="list"
        className={getDescriptionListListClasses(className ?? '')}
      >
        {(options?.items ?? []).map((item, index) => (
          <div
            data-role="row"
            className={DESCRIPTION_LIST_ROW_CLASSES}
            key={index}
          >
            <dt data-role="term" className={DESCRIPTION_LIST_TERM_CLASSES}>
              {item.label}
            </dt>
            <dd data-role="value" className={DESCRIPTION_LIST_VALUE_CLASSES}>
              {item.valueTpl ? item.valueTpl : item.value}
            </dd>
            {item.actionTpl ? (
              <span
                data-role="action"
                className={DESCRIPTION_LIST_ACTION_CLASSES}
              >
                {item.actionTpl}
              </span>
            ) : null}
          </div>
        ))}
      </dl>
      {options?.attachmentsTpl ? (
        <div
          data-role="attachments"
          className={DESCRIPTION_LIST_ATTACHMENTS_CLASSES}
        >
          {options.attachmentsTpl}
        </div>
      ) : null}
      {options?.footerTpl ? (
        <div data-role="footer" className={DESCRIPTION_LIST_FOOTER_CLASSES}>
          {options.footerTpl}
        </div>
      ) : null}
    </>
  );
}

import { cn } from '../../../utils/class-names';
import { SmartFeedProps } from '../feed.types';
import {
  FEED_AVATAR,
  FEED_BODY,
  FEED_COMMENT_AVATAR,
  FEED_COMMENT_BUTTON,
  FEED_COMMENT_CONTENT,
  FEED_COMMENT_INITIALS,
  FEED_COMMENT_SUBMIT,
  FEED_COMMENT_TIME,
  FEED_DESCRIPTION,
  FEED_DOT,
  FEED_EMPTY,
  FEED_EVENT_DESCRIPTION,
  FEED_EVENT_TITLE,
  FEED_EVENT_TITLE_LINK,
  FEED_FOOTER,
  FEED_HEADING_TEXT,
  FEED_HEADING_WRAP,
  FEED_ITEM,
  FEED_MARKER_INNER,
  FEED_MARKER_RAIL,
  FEED_ROOT,
  FEED_TIMESTAMP_SIDE,
  FEED_TIMESTAMP_TEXT,
} from './preset-classes';

/** First letter of the author name, used for the comment initials fallback. */
function initial(name: string): string {
  return (name?.trim().charAt(0) ?? '').toUpperCase();
}

/**
 * Styled feed / timeline variation (preset). Register it as `components.feed`
 * on `SmartProvider` to restyle every `<SmartFeed>`, or render it directly.
 *
 * Renders the Preline timeline look in vanilla Tailwind: a vertical rail with
 * per-event markers (icon template > avatar image > dot), a side timestamp
 * column, the event title (link when `href` is set), description, and nested
 * comments shown as Preline author rows (avatar or initials fallback).
 */
export function SmartFeedPreset({ options, className }: SmartFeedProps) {
  const title = options?.title;
  const description = options?.description;
  const events = options?.events ?? [];
  const emptyTpl = options?.emptyTpl;
  const commentSubmitTpl = options?.commentSubmitTpl;
  const footerTpl = options?.footerTpl;

  return (
    <div className={cn(FEED_ROOT, className)}>
      {title && (
        <div className={FEED_HEADING_WRAP}>
          <h3 className={FEED_HEADING_TEXT}>{title}</h3>
        </div>
      )}
      {description && <p className={FEED_DESCRIPTION}>{description}</p>}

      {events.length > 0
        ? events.map((event, index) => (
            <div
              key={event.id ?? index}
              className={FEED_ITEM}
              aria-label={event.ariaLabel ?? undefined}
            >
              {event.timestamp && (
                <div className={FEED_TIMESTAMP_SIDE}>
                  <span className={FEED_TIMESTAMP_TEXT}>{event.timestamp}</span>
                </div>
              )}

              <div className={FEED_MARKER_RAIL}>
                <div className={FEED_MARKER_INNER}>
                  {event.iconTpl ? (
                    event.iconTpl
                  ) : event.avatarUrl ? (
                    <img className={FEED_AVATAR} src={event.avatarUrl} alt="" />
                  ) : (
                    <span className={FEED_DOT} aria-hidden="true"></span>
                  )}
                </div>
              </div>

              <div className={FEED_BODY}>
                {event.href ? (
                  <a className={FEED_EVENT_TITLE_LINK} href={event.href}>
                    {event.title}
                  </a>
                ) : (
                  <h3 className={FEED_EVENT_TITLE}>{event.title}</h3>
                )}

                {event.description && (
                  <p className={FEED_EVENT_DESCRIPTION}>{event.description}</p>
                )}

                {event.comments?.map((comment, commentIndex) => (
                  <div
                    key={comment.id ?? commentIndex}
                    className="smart:flex smart:flex-col"
                  >
                    <button type="button" className={FEED_COMMENT_BUTTON}>
                      {comment.authorAvatarUrl ? (
                        <img
                          className={FEED_COMMENT_AVATAR}
                          src={comment.authorAvatarUrl}
                          alt=""
                        />
                      ) : (
                        <span className={FEED_COMMENT_INITIALS}>
                          {initial(comment.authorName)}
                        </span>
                      )}
                      {comment.authorName}
                      {comment.timestamp && (
                        <time className={FEED_COMMENT_TIME}>
                          {comment.timestamp}
                        </time>
                      )}
                    </button>
                    <p className={FEED_COMMENT_CONTENT}>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        : emptyTpl && <div className={FEED_EMPTY}>{emptyTpl}</div>}

      {commentSubmitTpl && (
        <div className={FEED_COMMENT_SUBMIT}>{commentSubmitTpl}</div>
      )}
      {footerTpl && <div className={FEED_FOOTER}>{footerTpl}</div>}
    </div>
  );
}

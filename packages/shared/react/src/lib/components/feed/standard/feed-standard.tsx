import { SmartFeedProps } from '../feed.types';

/**
 * The default feed rendering: an ordered list of events (icon template >
 * avatar, timestamp, title as a link when `href` is set, description, nested
 * comments), the `emptyTpl` when there are no events, then the
 * `commentSubmitTpl` and `footerTpl` slots.
 */
export function SmartFeedStandard({ options, className }: SmartFeedProps) {
  const events = options?.events ?? [];

  return (
    <div className={className}>
      <div className="feed">
        {options?.title && <h3 className="title">{options.title}</h3>}
        {options?.description && (
          <p className="description">{options.description}</p>
        )}
        {events.length > 0 ? (
          <ol role="list">
            {events.map((event, index) => (
              <li
                key={event.id ?? index}
                className="event"
                aria-label={event.ariaLabel ?? undefined}
              >
                {event.iconTpl ? (
                  <span className="icon">{event.iconTpl}</span>
                ) : event.avatarUrl ? (
                  <img className="avatar" src={event.avatarUrl} alt="" />
                ) : null}
                <div className="body">
                  {event.timestamp && (
                    <time className="timestamp">{event.timestamp}</time>
                  )}
                  {event.href ? (
                    <a className="title" href={event.href}>
                      {event.title}
                    </a>
                  ) : (
                    <span className="title">{event.title}</span>
                  )}
                  {event.description && (
                    <p className="description">{event.description}</p>
                  )}
                  {(event.comments ?? []).length > 0 && (
                    <ul className="comments" role="list">
                      {event.comments?.map((comment, commentIndex) => (
                        <li
                          key={comment.id ?? commentIndex}
                          className="comment"
                        >
                          {comment.authorAvatarUrl && (
                            <img
                              className="avatar"
                              src={comment.authorAvatarUrl}
                              alt=""
                            />
                          )}
                          <span className="author">{comment.authorName}</span>
                          {comment.timestamp && (
                            <time className="timestamp">
                              {comment.timestamp}
                            </time>
                          )}
                          <p className="content">{comment.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          options?.emptyTpl && <div className="empty">{options.emptyTpl}</div>
        )}
        {options?.commentSubmitTpl && (
          <div className="comment-submit">{options.commentSubmitTpl}</div>
        )}
        {options?.footerTpl && (
          <div className="footer">{options.footerTpl}</div>
        )}
      </div>
    </div>
  );
}

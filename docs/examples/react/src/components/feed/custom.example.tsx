// #region usage
import { useState } from 'react';

import {
  cn,
  IFeedOptions,
  SmartFeed,
  SmartFeedProps,
  SmartProvider,
} from '@smartsoft001/react';

const COLLAPSED_COUNT = 2;

export function CustomFeed({ options, className }: SmartFeedProps) {
  // A custom implementation is free to add its own state on top of the
  // options SmartFeed forwards.
  const [expanded, setExpanded] = useState(false);

  const events = options?.events ?? [];
  const visibleEvents = expanded ? events : events.slice(0, COLLAPSED_COUNT);

  return (
    <div className={cn('docs-feed', className)}>
      {options?.title && <h3 className="docs-feed__title">{options.title}</h3>}

      <ol className="docs-feed__list">
        {visibleEvents.map((event, index) => (
          <li key={event.id ?? index} className="docs-feed__event">
            {event.timestamp && (
              <time className="docs-feed__time">{event.timestamp}</time>
            )}
            <span className="docs-feed__label">{event.title}</span>
          </li>
        ))}
      </ol>

      {events.length > visibleEvents.length && (
        <button
          type="button"
          className="docs-feed__more"
          onClick={() => setExpanded(true)}
        >
          Show all
        </button>
      )}
    </div>
  );
}

// A module constant: a new object on every render would change the context.
const components = { feed: CustomFeed };

const options: IFeedOptions = {
  title: 'Application activity',
  events: [
    {
      id: 'applied',
      title: 'Applied to Front End Developer',
      timestamp: 'Sep 20',
    },
    {
      id: 'screening',
      title: 'Advanced to phone screening',
      timestamp: 'Sep 22',
    },
    {
      id: 'interview',
      title: 'Completed phone screening',
      timestamp: 'Sep 28',
    },
  ],
};

export function FeedCustomExample() {
  // Every SmartFeed below the provider renders CustomFeed.
  return (
    <SmartProvider components={components}>
      <SmartFeed options={options} />
    </SmartProvider>
  );
}
// #endregion

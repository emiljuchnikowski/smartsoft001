// #region usage
import { IFeedOptions, SmartFeed } from '@smartsoft001/react';

const options: IFeedOptions = {
  title: 'Activity',
  events: [
    { title: 'Applied to Front End Developer', timestamp: 'Sep 20' },
    {
      title: 'Advanced to phone screening by Bethany Blake',
      timestamp: 'Sep 22',
      comments: [
        { authorName: 'Chelsea Hagon', content: 'Looks great, approved.' },
      ],
    },
    { title: 'Completed interview with Martha Gardner', timestamp: 'Sep 28' },
  ],
};

export function FeedUsageExample() {
  return <SmartFeed options={options} />;
}
// #endregion

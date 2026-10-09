// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeedComponent, IFeedOptions } from '@smartsoft001/angular';

@Component({
  selector: 'docs-feed-usage-example',
  imports: [FeedComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedUsageExampleComponent {
  readonly options: IFeedOptions = {
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
}
// #endregion

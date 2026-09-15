// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  FEED_STANDARD_COMPONENT_TOKEN,
  FeedBaseComponent,
  FeedComponent,
  IFeedOptions,
} from '@smartsoft001/angular';

const COLLAPSED_COUNT = 2;

@Component({
  selector: 'docs-custom-feed',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.title) {
        <h3 class="docs-feed__title">{{ options()?.title }}</h3>
      }

      <ol class="docs-feed__list">
        @for (event of visibleEvents(); track event.id ?? $index) {
          <li class="docs-feed__event">
            @if (event.timestamp) {
              <time class="docs-feed__time">{{ event.timestamp }}</time>
            }
            <span class="docs-feed__label">{{ event.title }}</span>
          </li>
        }
      </ol>

      @if (hasMore()) {
        <button
          type="button"
          class="docs-feed__more"
          (click)="expanded.set(true)"
        >
          Show all
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFeedComponent extends FeedBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class'
  // alias, so a feed registered through the token declares it explicitly.
  override cssClass = input<string>('');

  // A custom implementation is free to add its own state on top of the
  // options the wrapper forwards.
  expanded = signal(false);

  private events = computed(() => this.options()?.events ?? []);

  visibleEvents = computed(() =>
    this.expanded() ? this.events() : this.events().slice(0, COLLAPSED_COUNT),
  );

  hasMore = computed(() => this.events().length > this.visibleEvents().length);

  containerClasses = computed(() => {
    const classes = ['docs-feed'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}

@Component({
  selector: 'docs-feed-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FeedComponent],
  // The token swaps the standard feed for the custom one everywhere below
  // this component, so consumers keep writing `<smart-feed>`.
  providers: [
    { provide: FEED_STANDARD_COMPONENT_TOKEN, useValue: CustomFeedComponent },
  ],
  template: `<smart-feed [options]="options" />`,
})
export class FeedCustomExampleComponent {
  options: IFeedOptions = {
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
}
// #endregion

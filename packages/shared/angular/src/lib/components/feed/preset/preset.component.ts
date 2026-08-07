import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { IFeedEvent, SmartFeedVariant } from '../../../models';
import { FeedBaseComponent } from '../base';
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
} from './preset-classes.util';

/**
 * Styled feed / timeline variation (preset).
 *
 * Drop-in replacement for `FeedStandardComponent` — register it through
 * `FEED_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-feed>`, or use the
 * `<smart-feed-preset>` selector directly.
 *
 * Renders the Preline timeline look in vanilla Tailwind: a vertical rail with
 * per-event markers (icon template > avatar image > dot), a side timestamp
 * column, the event title (link when `href` is set), description, and nested
 * comments shown as Preline author rows (avatar or initials fallback).
 */
@Component({
  selector: 'smart-feed-preset',
  templateUrl: './preset.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class FeedPresetComponent extends FeedBaseComponent {
  // NgComponentOutlet (used by FeedComponent when this is registered through
  // FEED_STANDARD_COMPONENT_TOKEN) passes inputs by canonical name, so the
  // inherited `class` alias must be dropped for `cssClass` to bind.
  override cssClass = input<string>('');

  protected title = computed(() => this.options()?.title);
  protected description = computed(() => this.options()?.description);
  protected events = computed<IFeedEvent[]>(() => this.options()?.events ?? []);
  protected variant = computed<SmartFeedVariant>(
    () => this.options()?.variant ?? 'simple',
  );

  protected emptyTpl = computed(() => this.options()?.emptyTpl);
  protected commentSubmitTpl = computed(() => this.options()?.commentSubmitTpl);
  protected footerTpl = computed(() => this.options()?.footerTpl);

  protected readonly rootClasses = FEED_ROOT;
  protected readonly headingWrapClasses = FEED_HEADING_WRAP;
  protected readonly headingTextClasses = FEED_HEADING_TEXT;
  protected readonly descriptionClasses = FEED_DESCRIPTION;
  protected readonly itemClasses = FEED_ITEM;
  protected readonly timestampSideClasses = FEED_TIMESTAMP_SIDE;
  protected readonly timestampTextClasses = FEED_TIMESTAMP_TEXT;
  protected readonly markerRailClasses = FEED_MARKER_RAIL;
  protected readonly markerInnerClasses = FEED_MARKER_INNER;
  protected readonly dotClasses = FEED_DOT;
  protected readonly avatarClasses = FEED_AVATAR;
  protected readonly bodyClasses = FEED_BODY;
  protected readonly eventTitleClasses = FEED_EVENT_TITLE;
  protected readonly eventTitleLinkClasses = FEED_EVENT_TITLE_LINK;
  protected readonly eventDescriptionClasses = FEED_EVENT_DESCRIPTION;
  protected readonly commentButtonClasses = FEED_COMMENT_BUTTON;
  protected readonly commentAvatarClasses = FEED_COMMENT_AVATAR;
  protected readonly commentInitialsClasses = FEED_COMMENT_INITIALS;
  protected readonly commentContentClasses = FEED_COMMENT_CONTENT;
  protected readonly commentTimeClasses = FEED_COMMENT_TIME;
  protected readonly emptyClasses = FEED_EMPTY;
  protected readonly commentSubmitClasses = FEED_COMMENT_SUBMIT;
  protected readonly footerClasses = FEED_FOOTER;

  /** First letter of the author name, used for the comment initials fallback. */
  protected initial(name: string): string {
    return (name?.trim().charAt(0) ?? '').toUpperCase();
  }
}

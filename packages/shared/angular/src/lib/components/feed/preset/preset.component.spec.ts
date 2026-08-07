import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPresetComponent } from './preset.component';
import { IFeedOptions } from '../../../models';

describe('@smartsoft001/shared-angular: FeedPresetComponent', () => {
  let fixture: ComponentFixture<FeedPresetComponent>;
  let component: FeedPresetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedPresetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPresetComponent);
    component = fixture.componentInstance;
  });

  function setOptions(options: IFeedOptions): void {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
  }

  function root(): HTMLElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create an instance', () => {
    fixture.detectChanges();

    expect(component).toBeInstanceOf(FeedPresetComponent);
  });

  it('should render the feed title heading', () => {
    setOptions({ title: 'Activity' });

    expect(root().textContent).toContain('Activity');
  });

  it('should render the feed-level description', () => {
    setOptions({ description: 'Recent events' });

    expect(root().textContent).toContain('Recent events');
  });

  it('should render one row per event', () => {
    setOptions({
      events: [{ title: 'First' }, { title: 'Second' }],
    });

    const titles = fixture.nativeElement.querySelectorAll('h3');

    // No feed title here, so all h3 are event titles.
    expect(titles.length).toBe(2);
  });

  it('should render a dot marker by default', () => {
    setOptions({ events: [{ title: 'Event' }] });

    const dot = fixture.nativeElement.querySelector('span[aria-hidden="true"]');

    expect(dot?.className).toContain('smart:rounded-full');
  });

  it('should render an avatar marker when avatarUrl is set', () => {
    setOptions({ events: [{ title: 'Event', avatarUrl: '/a.png' }] });

    const img = fixture.nativeElement.querySelector('img');

    expect(img?.getAttribute('src')).toBe('/a.png');
    expect(img?.className).toContain('smart:size-7');
  });

  it('should render the event title as a link when href is set', () => {
    setOptions({ events: [{ title: 'Linked', href: '/go' }] });

    const link = fixture.nativeElement.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/go');
    expect(link?.textContent?.trim()).toBe('Linked');
  });

  it('should render a side timestamp when provided', () => {
    setOptions({ events: [{ title: 'Event', timestamp: '12:05PM' }] });

    expect(root().textContent).toContain('12:05PM');
  });

  it('should render comments with author name and content', () => {
    setOptions({
      events: [
        {
          title: 'Discussion',
          comments: [{ authorName: 'Lindsay', content: 'Looks good' }],
        },
      ],
    });

    const text = root().textContent ?? '';

    expect(text).toContain('Lindsay');
    expect(text).toContain('Looks good');
  });

  it('should render an initials fallback when a comment has no avatar', () => {
    setOptions({
      events: [
        {
          title: 'Discussion',
          comments: [{ authorName: 'tom', content: 'Hi' }],
        },
      ],
    });

    const initials = fixture.nativeElement.querySelector(
      'button span',
    ) as HTMLElement | null;

    expect(initials?.textContent?.trim()).toBe('T');
  });

  it('should apply cssClass on the root (canonical name for NgComponentOutlet)', () => {
    fixture.componentRef.setInput('cssClass', 'my-extra-class');
    fixture.detectChanges();

    expect(root().className).toContain('my-extra-class');
  });
});
